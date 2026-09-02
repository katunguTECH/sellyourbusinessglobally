'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, Globe, Building2, MapPin, Briefcase, 
  Mail, Phone, Linkedin, Loader2, ArrowLeft,
  Sparkles, CheckCircle, XCircle
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

export default function ApolloLeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const searchLeads = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')
    setLeads([])

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        location: location || '',
        limit: '20'
      })

      // ✅ FIXED: Proper string with template literal
      const response = await fetch(`/api/leads/apollo-search?${params}`)
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search')
      }

      setLeads(data.leads || [])
      setMessage(data.message || '')
      
      if (data.leads?.length === 0) {
        setError('No leads found. Try a different search term.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') searchLeads()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-gray-400'
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Apollo Lead Search</h1>
          <p className="text-muted-foreground text-sm">Powered by Apollo.io - 275M+ decision makers</p>
        </div>
        <span className="ml-auto text-xs px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          🚀 FREE API
        </span>
      </div>

      {/* Search Section */}
      <div className="surface p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by industry, company, or job title..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <input
            type="text"
            placeholder="Location (e.g., New York)"
            className="input-field md:w-48"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={searchLeads}
            disabled={isLoading}
            className="btn-primary flex items-center gap-2"
          >
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
        <p className="text-xs text-muted-foreground mt-3">
          💡 Searching across 275M+ decision makers • FREE (no credits used)
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-6 p-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-md border border-red-500/30 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      {/* Results Stats */}
      {leads.length > 0 && (
        <div className="mb-4 text-sm text-muted-foreground">
          Found {leads.length} leads
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map((lead) => (
          <div key={lead.id} className="surface-hover p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{lead.fullName || 'Unknown'}</h3>
                <p className="text-sm text-accent">{lead.company || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-1">
                {lead.isVerified ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : lead.email ? (
                  <Mail className="w-4 h-4 text-blue-400" />
                ) : null}
                <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                  {lead.score}%
                </span>
              </div>
            </div>

            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {lead.title || 'N/A'}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {lead.industry || 'N/A'}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {lead.location || 'N/A'}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="text-xs flex items-center gap-1 px-3 py-1 rounded-md border border-border hover:border-accent transition-colors">
                  <Mail className="w-3 h-3" />
                  {lead.email}
                </a>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="text-xs flex items-center gap-1 px-3 py-1 rounded-md border border-border hover:border-accent transition-colors">
                  <Phone className="w-3 h-3" />
                  Call
                </a>
              )}
              {lead.linkedin && (
                <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 px-3 py-1 rounded-md border border-border hover:border-accent transition-colors">
                  <Linkedin className="w-3 h-3" />
                  LinkedIn
                </a>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Source: {lead.source}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && leads.length === 0 && !error && (
        <div className="surface p-12 text-center">
          <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Search for Real Leads</h3>
          <p className="text-muted-foreground">Enter a search term above to find decision makers</p>
          <p className="text-sm text-muted-foreground mt-2">Try: "Technology", "Healthcare", or "Real Estate"</p>
        </div>
      )}
    </div>
  )
}