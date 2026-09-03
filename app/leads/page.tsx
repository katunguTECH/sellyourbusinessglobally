'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search, Building2, MapPin, Briefcase, Mail, Phone,
  Linkedin, Loader2, Sparkles, CheckCircle, Bookmark
} from 'lucide-react'

interface Lead {
  id: string
  fullName: string
  company: string
  title: string
  industry: string
  location: string
  email?: string
  phone?: string
  linkedin?: string
  score: number
  source: string
  isVerified: boolean
}

function LeadsSearch() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const searchLeads = async (q?: string) => {
    const term = q ?? searchQuery
    if (!term.trim()) {
      setError('Please enter a search term')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')
    setLeads([])

    try {
      const params = new URLSearchParams({ q: term, location: location || '', limit: '20' })
      const response = await fetch(`/api/leads/apollo-search?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search')
      }

      setLeads(data.leads || [])
      setMessage(data.message || '')

      if (data.leads?.length === 0) {
        setError(data.message || 'No leads found. Try a different search term.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) searchLeads(initialQuery)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') searchLeads()
  }

  const handleSave = async (lead: Lead) => {
    try {
      const res = await fetch('/api/leads/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          title: lead.title,
          industry: lead.industry,
          location: lead.location,
          score: lead.score,
          source: lead.source,
        }),
      })
      if (res.ok) setSavedIds((prev) => new Set(prev).add(lead.id))
    } catch (err) {
      console.error('Save failed', err)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-muted-foreground'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Lead search</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search a company domain for real emails (Hunter), or a job title / industry for people (Apollo).
        </p>
      </div>

      <div className="surface p-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="e.g. worldtvchannel.online, or 'CEO Technology'..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <input
            type="text"
            placeholder="Location (optional)"
            className="input-field md:w-48"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => searchLeads()} disabled={isLoading} className="btn-primary flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Find Leads'
            )}
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-md border border-emerald-800 bg-emerald-950/50 text-emerald-400 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-md border border-red-800 bg-red-950/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent))]" />
        </div>
      )}

      {leads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="surface-hover p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{lead.fullName}</h3>
                  <p className="text-sm text-[hsl(var(--accent))]">{lead.company || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-1">
                  {lead.isVerified && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  {lead.score > 0 && (
                    <span className={`text-sm font-medium tabular-nums ${getScoreColor(lead.score)}`}>
                      {lead.score}%
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  {lead.title || 'N/A'}
                </div>
                {lead.industry && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 shrink-0" />
                    {lead.industry}
                  </div>
                )}
                {lead.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {lead.location}
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="text-xs flex items-center gap-1 px-3 py-1 rounded-md border border-border hover:border-[hsl(var(--accent))] transition-colors">
                    <Mail className="w-3 h-3" />
                    {lead.email}
                  </a>
                )}
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="text-xs flex items-center gap-1 px-3 py-1 rounded-md border border-border hover:border-[hsl(var(--accent))] transition-colors">
                    <Phone className="w-3 h-3" />
                    Call
                  </a>
                )}
                {lead.linkedin && (
                  <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 px-3 py-1 rounded-md border border-border hover:border-[hsl(var(--accent))] transition-colors">
                    <Linkedin className="w-3 h-3" />
                    LinkedIn
                  </a>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{lead.source}</span>
                <button
                  onClick={() => handleSave(lead)}
                  disabled={savedIds.has(lead.id)}
                  className="flex items-center gap-1.5 text-xs text-[hsl(var(--accent))] hover:underline disabled:text-muted-foreground disabled:no-underline"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {savedIds.has(lead.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && leads.length === 0 && !error && (
        <div className="surface p-12 text-center">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Search for real leads</h3>
          <p className="text-muted-foreground text-sm">
            Try a domain like "worldtvchannel.online" for real emails, or "CEO Technology" for people.
          </p>
        </div>
      )}
    </div>
  )
}

export default function LeadsPage() {
  return <LeadsSearch />
}