'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ExternalLink,
  Minus,
  Search,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'

type Keyword = {
  id: string
  keyword: string
  isActive: boolean
  createdAt: string
  subreddits: string[]
  _count?: { mentions: number }
}

type Mention = {
  id: string
  title: string | null
  content: string | null
  contentUrl: string | null
  author: string | null
  keywords: string | null
  upvotes: number | null
  numComments: number | null
  sentiment: string | null
  intent: string | null
  relevanceScore: number | null
  isRelevant: boolean | null
  summary: string | null
  postedAt: string
  keywordAlert?: { keyword: string } | null
}

type SentimentFilter = 'all' | 'positive' | 'neutral' | 'negative'

export default function SocialListeningPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [mentions, setMentions] = useState<Mention[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [newSubreddits, setNewSubreddits] = useState('')
  const [filter, setFilter] = useState<SentimentFilter>('all')
  const [relevantOnly, setRelevantOnly] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const loadKeywords = useCallback(async () => {
    try {
      const res = await fetch('/api/social-listening/keywords', { cache: 'no-store' })
      if (!res.ok) return
      const json = await res.json()
      setKeywords(Array.isArray(json?.keywords) ? json.keywords : [])
    } catch {
      // swallow
    }
  }, [])

  const loadMentions = useCallback(async () => {
    try {
      const qs = filter === 'all' ? '' : `?sentiment=${filter}`
      const res = await fetch(`/api/social-listening/mentions${qs}`, { cache: 'no-store' })
      if (!res.ok) return
      const json = await res.json()
      const list: Mention[] = Array.isArray(json?.mentions) ? json.mentions : []
      setMentions(relevantOnly ? list.filter((m) => m.isRelevant === true) : list)
    } catch {
      // swallow
    }
  }, [filter, relevantOnly])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      await Promise.all([loadKeywords(), loadMentions()])
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [loadKeywords, loadMentions])

  async function addKeyword(e: React.FormEvent) {
    e.preventDefault()
    const kw = newKeyword.trim()
    if (!kw) return
    setError(null)
    const subreddits = newSubreddits
      .split(/[,\s]+/)
      .map((s) => s.trim().replace(/^\/?r\//i, ''))
      .filter(Boolean)

    try {
      const res = await fetch('/api/social-listening/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: kw, subreddits }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j?.error ?? 'Could not add keyword')
        return
      }
      setNewKeyword('')
      setNewSubreddits('')
      await loadKeywords()
    } catch {
      setError('Could not add keyword')
    }
  }

  async function removeKeyword(id: string) {
    try {
      await fetch(`/api/social-listening/keywords?id=${id}`, { method: 'DELETE' })
      await Promise.all([loadKeywords(), loadMentions()])
    } catch {
      // swallow
    }
  }

  async function scanNow() {
    setScanning(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch('/api/social-listening/scan', { method: 'POST' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error ?? 'Scan failed')

      if (Array.isArray(json?.errors) && json.errors.length) {
        setError(`Scan issues: ${json.errors[0]}`)
      } else if (Array.isArray(json?.summary)) {
        const totalKept = json.summary.reduce(
          (a: number, s: { kept: number }) => a + (s.kept ?? 0),
          0,
        )
        const totalScanned = json.summary.reduce(
          (a: number, s: { scanned: number }) => a + (s.scanned ?? 0),
          0,
        )
        setNotice(
          `Scan complete — ${totalScanned} posts scanned, ${totalKept} relevant, ${json.created ?? 0} new mentions.`,
        )
      }

      await Promise.all([loadKeywords(), loadMentions()])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed')
    } finally {
      setScanning(false)
    }
  }

  const stats = useMemo(() => {
    const pos = mentions.filter((m) => m.sentiment === 'positive').length
    const neg = mentions.filter((m) => m.sentiment === 'negative').length
    const neu = mentions.filter((m) => m.sentiment === 'neutral').length
    const hot = mentions.filter((m) => m.isRelevant === true).length
    return { total: mentions.length, pos, neg, neu, hot }
  }, [mentions])

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 text-slate-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Activity className="h-6 w-6 text-emerald-400" />
            Social Listening
          </h1>
          <p className="text-sm text-slate-400">
            Reddit-powered signals, scored with AI. Real-time feed, sentiment, and intent.
          </p>
        </div>
        <button
          onClick={scanNow}
          disabled={scanning}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/10 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {scanning ? 'Scanning…' : 'Scan now'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notice && !error && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat label="Mentions" value={stats.total} />
        <Stat label="Positive" value={stats.pos} />
        <Stat label="Neutral" value={stats.neu} />
        <Stat label="Negative" value={stats.neg} />
        <Stat label="High intent" value={stats.hot} />
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Search className="h-4 w-4" />
          Tracked keywords
        </h2>

        <form onSubmit={addKeyword} className="mb-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder='e.g. "sell my business" OR "business acquisition"'
            className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-white/20"
          />
          <input
            value={newSubreddits}
            onChange={(e) => setNewSubreddits(e.target.value)}
            placeholder="subreddits (optional): entrepreneur, smallbusiness"
            className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-white/20"
          />
          <button
            type="submit"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Add
          </button>
        </form>

        {keywords.length === 0 ? (
          <p className="text-sm text-slate-500">No keywords yet. Add one and hit "Scan now".</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {keywords.map((k) => (
              <li
                key={k.id}
                className="group inline-flex flex-col items-start gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{k.keyword}</span>
                  <span className="text-slate-500">{k._count?.mentions ?? 0}</span>
                  <button
                    onClick={() => removeKeyword(k.id)}
                    className="text-slate-500 hover:text-red-300"
                    aria-label={`Remove ${k.keyword}`}
                  >
                    ×
                  </button>
                </div>
                {k.subreddits && k.subreddits.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {k.subreddits.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400"
                      >
                        r/{s}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        {(['all', 'positive', 'neutral', 'negative'] as SentimentFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs capitalize transition ${
              filter === f
                ? 'bg-white/15 text-white'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
        <button
          onClick={() => setRelevantOnly((v) => !v)}
          className={`rounded-full px-3 py-1 text-xs transition ${
            relevantOnly
              ? 'bg-emerald-500/20 text-emerald-200'
              : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          {relevantOnly ? '✓ Relevant only' : 'Show all'}
        </button>
      </div>

      <section className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : mentions.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-500">
            {relevantOnly
              ? 'No relevant mentions. Try turning off "Relevant only" to see everything.'
              : 'No mentions yet. Add a keyword and run a scan.'}
          </div>
        ) : (
          mentions.map((m) => <MentionCard key={m.id} mention={m} />)
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  )
}

function MentionCard({ mention }: { mention: Mention }) {
  const sentiment = mention?.sentiment ?? null
  const title = mention?.title?.trim() || '(untitled)'
  const author = mention?.author?.trim() || 'unknown'
  const contentUrl = mention?.contentUrl ?? null
  const keywords = mention?.keywords ?? null
  const body = mention?.content ?? ''
  const summary = mention?.summary ?? null
  const intent = mention?.intent ?? null
  const relevanceScore = mention?.relevanceScore ?? 0
  const upvotes = mention?.upvotes ?? 0
  const numComments = mention?.numComments ?? 0
  const postedAt = mention?.postedAt

  const tone =
    sentiment === 'positive'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
      : sentiment === 'negative'
        ? 'border-red-500/30 bg-red-500/10 text-red-200'
        : 'border-white/10 bg-white/5 text-slate-300'

  const relevanceTone =
    relevanceScore >= 70
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
      : relevanceScore >= 50
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
        : 'border-white/10 bg-white/5 text-slate-400'

  const postedLabel = postedAt ? new Date(postedAt).toLocaleString() : '—'

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        {keywords && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
            {keywords}
          </span>
        )}
        <span>u/{author}</span>
        <span>·</span>
        <span>{postedLabel}</span>
      </div>

      {contentUrl ? (
        <a
          href={contentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-1 text-base font-medium text-slate-100 hover:underline"
        >
          {title}
          <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 opacity-60" />
        </a>
      ) : (
        <div className="text-base font-medium text-slate-100">{title}</div>
      )}

      {body && body.trim().length > 0 && (
        <p className="mt-2 line-clamp-3 text-sm text-slate-400">{body}</p>
      )}

      {summary && (
        <p className="mt-2 text-xs italic text-slate-500">AI: {summary}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 capitalize ${tone}`}>
          {sentiment === 'positive' ? (
            <ThumbsUp className="h-3 w-3" />
          ) : sentiment === 'negative' ? (
            <ThumbsDown className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          {sentiment ?? 'unscored'}
        </span>

        {intent && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 capitalize text-slate-300">
            {intent}
          </span>
        )}

        <span
          className={`rounded-full border px-2 py-0.5 ${relevanceTone}`}
        >
          relevance {relevanceScore}
        </span>

        {mention?.keywordAlert?.keyword && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-slate-400">
            keyword: {mention.keywordAlert.keyword}
          </span>
        )}

        <span className="ml-auto text-slate-500">
          ▲ {upvotes} · {numComments} comments
        </span>
      </div>
    </article>
  )
}