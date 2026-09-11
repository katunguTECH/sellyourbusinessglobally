/**
 * Cheap heuristic relevance scoring. Runs before AI scoring so:
 *   - noise never reaches the DB
 *   - OpenAI credits are only spent on plausibly-relevant posts
 *
 * Returns a score in [0, 1]:
 *   - 0.0-0.4 → almost certainly noise
 *   - 0.4-0.7 → maybe relevant, worth an AI look
 *   - 0.7-1.0 → strong signal
 */
export function heuristicRelevance(
  keyword: string,
  title: string,
  body: string,
): number {
  const cleanKeyword = keyword.replace(/["']/g, '').toLowerCase().trim()
  if (!cleanKeyword) return 0.5

  const tokens = cleanKeyword
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))

  const text = `${title} ${body}`.toLowerCase()
  const titleLower = title.toLowerCase()

  // 1. Token coverage in full text
  let tokenScore = 0
  if (tokens.length > 0) {
    const matched = tokens.filter((t) => text.includes(t)).length
    tokenScore = matched / tokens.length
  }

  // 2. Exact phrase bonus
  const exactInTitle = titleLower.includes(cleanKeyword) ? 1 : 0
  const exactInBody = text.includes(cleanKeyword) ? 0.6 : 0

  // 3. Negative signals — marketplaces, spam, unrelated
  const NEGATIVE = [
    'feetfinder', 'hardwareswap', 'repladies', 'reptoprehomes',
    'onlyfans', 'nsfw', 'gonewild', '[h] ', 'selling my rtx',
    'selling my gpu', 'selling my phone', 'selling my car',
    'selling my ps5', 'selling my xbox',
  ]
  const negativeHit = NEGATIVE.some((n) => text.includes(n)) ? 0.4 : 0

  // 4. Positive signals — business/sale context
  const POSITIVE = [
    'business for sale', 'sell my business', 'selling my business',
    'sell a business', 'selling a business', 'business broker',
    'business valuation', 'exit my business', 'acquire a business',
    'acquiring a business', 'acquire businesses', 'business acquisition',
    'm&a', 'mergers and acquisitions', 'sell my company', 'selling my company',
    'exit strategy', 'buy a business', 'buying a business',
  ]
  const positiveHits = POSITIVE.filter((p) => text.includes(p)).length
  const positiveBonus = Math.min(0.4, positiveHits * 0.15)

  const raw =
    tokenScore * 0.5 +
    exactInTitle * 0.3 +
    exactInBody * 0.15 +
    positiveBonus -
    negativeHit

  return Math.max(0, Math.min(1, raw))
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'you', 'with', 'that', 'this', 'are', 'from', 'have',
  'was', 'were', 'will', 'can', 'but', 'not', 'all', 'any', 'use', 'how',
  'what', 'why', 'who', 'when', 'where', 'has', 'had', 'its', 'our', 'your',
])