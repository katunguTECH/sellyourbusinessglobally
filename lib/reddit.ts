import { getRedditAccessToken } from './reddit-auth'

export type RedditPost = {
  id: string
  title: string
  selftext: string
  author: string
  subreddit: string
  permalink: string
  score: number
  num_comments: number
  created_utc: number
  url: string
}

type RawRedditChild = { data: Record<string, unknown> }

function mapPost(p: Record<string, unknown>): RedditPost {
  const permalink = String(p.permalink ?? '')
  return {
    id: String(p.id ?? ''),
    title: String(p.title ?? ''),
    selftext: String(p.selftext ?? ''),
    author: String(p.author ?? ''),
    subreddit: String(p.subreddit ?? ''),
    permalink,
    score: Number(p.score ?? 0),
    num_comments: Number(p.num_comments ?? 0),
    created_utc: Number(p.created_utc ?? 0),
    url: permalink ? `https://reddit.com${permalink}` : String(p.url ?? ''),
  }
}

async function fetchReddit(
  path: string,
  params: Record<string, string>,
): Promise<RedditPost[]> {
  const token = await getRedditAccessToken()
  const url = new URL(path, 'https://oauth.reddit.com')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': process.env.REDDIT_USER_AGENT || 'social-listening/0.1',
    },
    cache: 'no-store',
  })

  if (res.status === 401) throw new Error('Reddit token expired — re-run devvit login')
  if (res.status === 429) throw new Error('Reddit rate limit hit')
  if (!res.ok) throw new Error(`Reddit fetch failed: ${res.status} ${path}`)

  const json = (await res.json()) as {
    data?: { children?: RawRedditChild[] }
  }
  return (json?.data?.children ?? []).map((c) => mapPost(c.data))
}

export async function searchReddit(
  query: string,
  subreddits: string[] = [],
  limit = 25,
): Promise<RedditPost[]> {
  const cleaned = subreddits
    .map((s) => s.trim().replace(/^\/?r\//i, ''))
    .filter(Boolean)

  // Single-subreddit fast path
  if (cleaned.length === 1) {
    return fetchReddit(`/r/${cleaned[0]}/search`, {
      q: query,
      restrict_sr: '1',
      sort: 'new',
      t: 'month',
      limit: String(limit),
      type: 'link',
    })
  }

  // Multi-subreddit: fan out, merge, dedupe by id
  if (cleaned.length > 1) {
    const perSub = Math.max(5, Math.ceil(limit / cleaned.length))
    const batches = await Promise.all(
      cleaned.map((sub) =>
        fetchReddit(`/r/${sub}/search`, {
          q: query,
          restrict_sr: '1',
          sort: 'new',
          t: 'month',
          limit: String(perSub),
          type: 'link',
        }).catch(() => [] as RedditPost[]),
      ),
    )
    const seen = new Set<string>()
    const merged: RedditPost[] = []
    for (const batch of batches) {
      for (const post of batch) {
        if (seen.has(post.id)) continue
        seen.add(post.id)
        merged.push(post)
      }
    }
    merged.sort((a, b) => b.created_utc - a.created_utc)
    return merged.slice(0, limit)
  }

  // Global search (no subreddits specified)
  return fetchReddit('/search', {
    q: query,
    sort: 'new',
    t: 'week',
    limit: String(limit),
    type: 'link',
  })
}