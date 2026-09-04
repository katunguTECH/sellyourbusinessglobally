'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sparkles, Loader2, Mail, ExternalLink } from 'lucide-react'

type Mode = 'buyers' | 'investors' | 'customers'

const MODE_CONFIG: Record<Mode, { title: string; desc: string; placeholder: string }> = {
  buyers: {
    title: 'Find buyers',
    desc: 'Tell us about your business and we\u2019ll identify who\u2019d want to acquire it.',
    placeholder: 'e.g. worldtvchannel.online \u2014 a free-to-air IPTV streaming platform...',
  },
  investors: {
    title: 'Find investors',
    desc: 'We\u2019ll surface VCs, angels, and funds that fit your stage and sector.',
    placeholder: 'e.g. Raising a pre-seed round for a global FTA streaming platform...',
  },
  customers: {
    title: 'Grow my customer base',
    desc: 'Get a channel and content strategy to reach real users.',
    placeholder: 'e.g. worldtvchannel.online \u2014 free-to-air IPTV app for global viewers...',
  },
}

export default function ICPGeneratorPage() {
  const searchParams = useSearchParams()
  const mode = (searchParams.get('mode') as Mode) || 'buyers'
  const config = MODE_CONFIG[mode]

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    const isUrl = /^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(input.trim()) && !input.includes(' ')
    const body = isUrl
      ? { url: input.trim(), mode }
      : { businessDescription: input.trim(), mode }

    const endpoint = mode === 'customers' ? '/api/customer-strategy' : '/api/icp-generator'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to generate results')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold">{config.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{config.desc}</p>
      </div>

      <form onSubmit={handleSubmit} className="surface p-4 space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={config.placeholder}
          rows={3}
          className="w-full bg-transparent text-sm border border-border rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent))]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-2 text-sm font-medium bg-[hsl(var(--accent))] text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Analyzing...' : 'Generate'}
        </button>
      </form>

      {error && (
        <div className="surface p-4 text-sm text-red-500">{error}</div>
      )}

      {result && mode !== 'customers' && (
        <div className="space-y-6">
          <div className="surface p-4">
            <h2 className="text-sm font-medium mb-2">Business summary</h2>
            <p className="text-sm text-muted-foreground">{result.businessSummary}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium mb-3">
              {mode === 'investors' ? 'Investor' : 'Buyer'} personas & leads
            </h2>
            <div className="space-y-3">
              {result.enrichedLeads?.map((item: any, i: number) => (
                <div key={i} className="surface p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.persona.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.persona.industry} \u00b7 {item.persona.companyType}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(227,100%,65%,0.1)] text-[hsl(var(--accent))]">
                      {item.source}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{item.persona.motivation}</p>

                  {item.leads?.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {item.leads.map((lead: any) => (
                        <div key={lead.id} className="flex items-center gap-2 text-xs border-t border-border pt-2">
                          <Mail className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span>{lead.fullName}</span>
                          <span className="text-muted-foreground">{lead.email}</span>
                          {lead.linkedin && (
                            <a href={lead.linkedin} target="_blank" rel="noreferrer" className="ml-auto">
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-3 italic">{item.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && mode === 'customers' && (
        <div className="space-y-6">
          <div className="surface p-4">
            <h2 className="text-sm font-medium mb-2">Target audience</h2>
            <p className="text-sm text-muted-foreground">{result.audienceSummary}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium mb-3">Acquisition channels</h2>
            <div className="space-y-3">
              {result.channels?.map((channel: any, i: number) => (
                <div key={i} className="surface p-4">
                  <p className="text-sm font-medium">{channel.platform}</p>
                  <p className="text-xs text-muted-foreground mt-1">{channel.why}</p>
                  <p className="text-xs mt-2">{channel.angle}</p>
                </div>
              ))}
            </div>
          </div>

          {result.keywords?.length > 0 && (
            <div className="surface p-4">
              <h2 className="text-sm font-medium mb-2">Keyword ideas</h2>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-[hsl(227,100%,65%,0.1)] text-[hsl(var(--accent))]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.discoveryTips?.length > 0 && (
            <div className="surface p-4">
              <h2 className="text-sm font-medium mb-2">Discovery tips</h2>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {result.discoveryTips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}