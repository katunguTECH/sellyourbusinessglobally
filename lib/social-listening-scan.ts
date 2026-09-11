import { prisma } from '@/lib/prisma'
import { searchReddit } from '@/lib/reddit'
import { scorePosts, type Scored } from '@/lib/social-listening-ai'
import { heuristicRelevance } from '@/lib/relevance'

const HEURISTIC_THRESHOLD = 0.35
const FALLBACK_REASON = 'AI scoring unavailable — saved without analysis'

function neutralFallback(): Scored {
  return {
    relevance: 0.5,
    sentiment: 'neutral',
    intent: 'other',
    reason: FALLBACK_REASON,
  }
}

async function safeScorePosts(
  keyword: string,
  posts: Array<{ id: string; title: string; body: string }>,
): Promise<Record<string, Scored>> {
  try {
    return await scorePosts(keyword, posts)
  } catch (e) {
    console.warn(
      `[scan] scorePosts threw for "${keyword}", using neutral fallback:`,
      e instanceof Error ? e.message : e,
    )
    const out: Record<string, Scored> = {}
    for (const p of posts) out[p.id] = neutralFallback()
    return out
  }
}

export type ScanSummary = {
  keyword: string
  scanned: number
  kept: number
  created: number
}

export type ScanResult = {
  keywords: number
  created: number
  errors: string[]
  summary: ScanSummary[]
}

export async function scanForUser(userId: string): Promise<ScanResult> {
  const keywords = await prisma.keywordAlert.findMany({
    where: { userId, isActive: true },
  })

  if (keywords.length === 0) {
    return { keywords: 0, created: 0, errors: [], summary: [] }
  }

  let created = 0
  const errors: string[] = []
  const summary: ScanSummary[] = []

  for (const kw of keywords) {
    try {
      const posts = await searchReddit(kw.keyword, kw.subreddits ?? [], 50)

      if (posts.length === 0) {
        await prisma.keywordAlert.update({
          where: { id: kw.id },
          data: { lastChecked: new Date() },
        })
        summary.push({ keyword: kw.keyword, scanned: 0, kept: 0, created: 0 })
        continue
      }

      const externalIds = posts.map((p) => p.id)
      const existing = await prisma.socialMention.findMany({
        where: { platform: 'reddit', externalId: { in: externalIds } },
        select: { externalId: true },
      })
      const seen = new Set(existing.map((e) => e.externalId))
      const unseen = posts.filter((p) => !seen.has(p.id))

      const scoredHeuristics = unseen.map((p) => ({
        post: p,
        heuristic: heuristicRelevance(kw.keyword, p.title, p.selftext),
      }))
      const kept = scoredHeuristics.filter(
        (x) => x.heuristic >= HEURISTIC_THRESHOLD,
      )

      if (kept.length === 0) {
        await prisma.keywordAlert.update({
          where: { id: kw.id },
          data: { lastChecked: new Date() },
        })
        summary.push({
          keyword: kw.keyword,
          scanned: posts.length,
          kept: 0,
          created: 0,
        })
        continue
      }

      const aiScores = await safeScorePosts(
        kw.keyword,
        kept.map(({ post }) => ({
          id: post.id,
          title: post.title,
          body: post.selftext,
        })),
      )

      let createdForKeyword = 0

      for (const { post: p, heuristic } of kept) {
        const s = aiScores[p.id] ?? neutralFallback()
        const aiIsFallback = s.reason === FALLBACK_REASON
        const combined = aiIsFallback
          ? heuristic
          : (s.relevance + heuristic) / 2

        try {
          await prisma.socialMention.create({
            data: {
              userId,
              keywordAlertId: kw.id,
              platform: 'reddit',
              externalId: p.id,
              title: p.title,
              content:
                p.selftext && p.selftext.trim().length > 0 ? p.selftext : ' ',
              contentUrl: p.url,
              author: p.author || 'unknown',
              postedAt: new Date(p.created_utc * 1000),
              sentiment: s.sentiment,
              intent: s.intent,
              relevanceScore: Math.round(combined * 100),
              isRelevant: combined >= 0.5,
              upvotes: p.score,
              numComments: p.num_comments,
              keywords: p.subreddit ? `r/${p.subreddit}` : null,
              summary: s.reason ?? null,
            },
          })
          created++
          createdForKeyword++
        } catch (insertErr) {
          const msg =
            insertErr instanceof Error ? insertErr.message : 'insert failed'
          if (!msg.includes('Unique constraint')) {
            errors.push(`${kw.keyword} insert [${p.id}]: ${msg}`)
          }
        }
      }

      await prisma.keywordAlert.update({
        where: { id: kw.id },
        data: {
          lastChecked: new Date(),
          lastMatch: createdForKeyword > 0 ? new Date() : kw.lastMatch,
          matchesFound: { increment: createdForKeyword },
        },
      })

      summary.push({
        keyword: kw.keyword,
        scanned: posts.length,
        kept: kept.length,
        created: createdForKeyword,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown error'
      errors.push(`${kw.keyword}: ${msg}`)
    }
  }

  return { keywords: keywords.length, created, errors, summary }
}