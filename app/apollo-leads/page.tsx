import Link from 'next/link'
import { ArrowLeft, Search, Globe, Building2, MapPin, Briefcase, Mail, Phone, Linkedin, Download, Loader2 } from 'lucide-react'

'use client'

import { useState } from 'react'

export default function ApolloLeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leads, setLeads] = useState<any[]>([])
  const [error, setError] = useState('')

  const searchLeads = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term')
      return
    }

    setIsLoading(true)
    setError('')
    setLeads([])

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        location: location || '',
        limit: '20'
      })

      const response = await fetch(/api/leads/apollo-search?)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search')
      }

      setLeads(data.leads || [])
      
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

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Apollo Lead Search</h1>
            <p className="text-gray-400 text-sm">Powered by Apollo.io - 275M+ decision makers</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by industry, company, or job title..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 pl-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <input
              type="text"
              placeholder="Location (e.g., New York)"
              className="md:w-48 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={searchLeads}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 font-medium transition-colors disabled:opacity-50"
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
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead: any) => (
            <div key={lead.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-emerald-500/50 transition-all">
              <h3 className="font-semibold text-lg">{lead.fullName}</h3>
              <p className="text-emerald-400 text-sm">{lead.company}</p>
              <div className="mt-2 space-y-1 text-sm text-gray-400">
                <div className="flex items-center gap-2"><Briefcase className="w-4 h-4" />{lead.title}</div>
                <div className="flex items-center gap-2"><Building2 className="w-4 h-4" />{lead.industry}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{lead.location}</div>
              </div>
              {lead.email && (
                <a href={mailto:} className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300">
                  <Mail className="w-4 h-4" /> {lead.email}
                </a>
              )}
            </div>
          ))}
        </div>

        {!isLoading && leads.length === 0 && !error && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Search for real leads using the form above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
