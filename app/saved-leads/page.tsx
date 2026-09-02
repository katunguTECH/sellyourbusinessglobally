'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Linkedin, Building2, MapPin, Briefcase, Trash2, Download } from 'lucide-react'

interface SavedLead {
  id: string
  fullName: string
  email: string
  phone: string
  company: string
  title: string
  industry: string
  location: string
  linkedin: string
  score: number
  source: string
  createdAt: string
}

export default function SavedLeadsPage() {
  const [leads, setLeads] = useState<SavedLead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Load saved leads
  useEffect(() => {
    loadSavedLeads()
  }, [])

  const loadSavedLeads = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/leads/saved')
      const data = await response.json()
      
      if (response.ok) {
        setLeads(data.leads || [])
      } else {
        setError(data.error || 'Failed to load saved leads')
      }
    } catch (err) {
      setError('Failed to load saved leads')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== id))
        alert('Lead deleted successfully!')
      } else {
        alert('Failed to delete lead')
      }
    } catch (err) {
      alert('Failed to delete lead')
    }
  }

  const exportLeads = () => {
    if (leads.length === 0) {
      alert('No leads to export')
      return
    }

    const headers = ['Full Name', 'Email', 'Phone', 'Company', 'Title', 'Industry', 'Location', 'LinkedIn', 'Score', 'Source']
    const rows = leads.map(lead => [
      lead.fullName,
      lead.email,
      lead.phone,
      lead.company,
      lead.title,
      lead.industry,
      lead.location,
      lead.linkedin,
      lead.score,
      lead.source
    ])

    let csv = headers.join(',') + '\n'
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `saved-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Saved Leads</h1>
              <p className="text-gray-400 text-sm">{leads.length} leads saved</p>
            </div>
          </div>
          {leads.length > 0 && (
            <button
              onClick={exportLeads}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Leads Grid */}
        {!isLoading && leads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <SavedLeadCard key={lead.id} lead={lead} onDelete={() => deleteLead(lead.id)} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && leads.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400">No leads saved yet.</p>
            <Link href="/leads" className="text-emerald-400 hover:text-emerald-300 transition-colors mt-2 inline-block">
              Search for leads to save →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function SavedLeadCard({ lead, onDelete }: { lead: SavedLead; onDelete: () => void }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-emerald-500/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{lead.fullName}</h3>
          <p className="text-emerald-400 text-sm">{lead.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${lead.score >= 80 ? 'text-emerald-400' : lead.score >= 50 ? 'text-yellow-400' : 'text-gray-400'}`}>
            {lead.score}%
          </span>
          <button
            onClick={onDelete}
            className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Briefcase className="w-4 h-4" />
          {lead.title}
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Building2 className="w-4 h-4" />
          {lead.industry}
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="w-4 h-4" />
          {lead.location}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10 transition-colors">
            <Mail className="w-3 h-3" />
            {lead.email}
          </a>
        )}
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/10 transition-colors">
            <Phone className="w-3 h-3" />
            Call
          </a>
        )}
        {lead.linkedin && (
          <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg border border-blue-500/30 px-3 py-1 text-xs text-blue-400 hover:bg-blue-500/10 transition-colors">
            <Linkedin className="w-3 h-3" />
            LinkedIn
          </a>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
        <span className="text-xs text-gray-500">Source: {lead.source}</span>
        <span className="text-xs text-gray-500">
          Saved: {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}