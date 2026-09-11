import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export type Sentiment = 'positive' | 'neutral' | 'negative'
export type Intent = 'buy' | 'research' | 'complaint' | 'other'

export type Scored = {
  relevance: number
  sentiment: Sentiment
  intent: Intent
  reason: string
}

function fallbackScore(id: string): Scored {
  return {
    relevance: 0.5,
    sentiment: 'neutral',
    intent: 'other',
    reason: 'AI scoring unavailable — saved without analysis',
  }
}

export async function scorePosts(
  keyword: string,
  posts: Array<{ id: string; title: string; body: string }>,
): Promise<Record<string, Scored>> {
  if (posts.length === 0) return {}

  // No key configured → return neutral fallback for everything
  if (!openai) {
    const out: Record<string, Scored> = {}
    for (const p of posts) out[p.id] = fallbackScore(p.id)
    return out
  }

  const system = `You score Reddit posts for a B2B social-listening / lead-gen tool. Reply with strict JSON only.`

  const user = `Keyword: "${keyword}"

For each post, return an object keyed by the post id with:
- relevance: number 0..1 (how relevant to the keyword as a buying/research signal)
- sentiment: "positive" | "neutral" | "negative"
- intent: "buy" | "research" | "complaint" | "other"
- reason: short string (<= 120 chars)

Posts:
${posts
  .map(
    (p) =>
      `### id: ${p.id}\ntitle: ${p.title}\nbody: ${p.body.slice(0, 800)}`,
  )
  .join('\n\n')}

Respond with JSON like: { "<id>": { "relevance": 0.8, "sentiment": "positive", "intent": "research", "reason": "..." }, ... }`

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    })

    const text = res.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(text) as Record<string, Scored>

    // Fill in any posts the model skipped
    const out: Record<string, Scored> = {}
    for (const p of posts) {
      out[p.id] = parsed[p.id] ?? fallbackScore(p.id)
    }
    return out
  } catch (e) {
    // OpenAI failed (no credits, rate limit, network) → don't lose the posts
    console.warn(
      '[social-listening-ai] OpenAI scoring failed, using fallback:',
      e instanceof Error ? e.message : e,
    )
    const out: Record<string, Scored> = {}
    for (const p of posts) out[p.id] = fallbackScore(p.id)
    return out
  }
}