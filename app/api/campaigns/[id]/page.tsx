'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, Send, Edit, Trash2, Eye, Users, 
  TrendingUp, Mail, Clock, Play, Pause, BarChart3
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  description: string
  status: string
  subject: string
  content: string
  senderName: string
  senderEmail: string
  sentCount: number
  openCount: number
  clickCount: number
  replyCount: number
  bounceCount: number
  createdAt: string
  leads: any[]
  sequences: any[]
}

export default function CampaignDetailPage() {
  const params = useParams()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCampaign()
  }, [])

  const loadCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`)
      const data = await response.json()
      setCampaign(data.campaign)
    } catch (error) {
      console.error('Failed to load campaign:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Campaign not found</p>
        <Link href="/campaigns" className="text-emerald-400 hover:text-emerald-300 mt-2 inline-block">
          ← Back to Campaigns
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/campaigns" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{campaign.name}</h1>
            <p className="text-gray-400 text-sm">{campaign.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(campaign.status)} flex items-center gap-1`}>
            {campaign.status}
          </span>
          {campaign.status === 'draft' && (
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Send className="w-4 h-4" />
              Launch
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-gray-400 hover:text-red-400">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-medium">Sent</span>
          </div>
          <div className="text-2xl font-bold">{campaign.sentCount}</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium">Opens</span>
          </div>
          <div className="text-2xl font-bold">{campaign.openCount}</div>
          <div className="text-sm text-gray-500">
            {campaign.sentCount > 0 ? Math.round((campaign.openCount / campaign.sentCount) * 100) : 0}% rate
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-purple-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Clicks</span>
          </div>
          <div className="text-2xl font-bold">{campaign.clickCount}</div>
          <div className="text-sm text-gray-500">
            {campaign.openCount > 0 ? Math.round((campaign.clickCount / campaign.openCount) * 100) : 0}% CTR
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Replies</span>
          </div>
          <div className="text-2xl font-bold">{campaign.replyCount}</div>
          <div className="text-sm text-gray-500">
            {campaign.sentCount > 0 ? Math.round((campaign.replyCount / campaign.sentCount) * 100) : 0}% reply rate
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Email Details</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400">Subject:</span>
              <p className="font-medium">{campaign.subject}</p>
            </div>
            <div>
              <span className="text-gray-400">From:</span>
              <p>{campaign.senderName} &lt;{campaign.senderEmail}&gt;</p>
            </div>
            <div>
              <span className="text-gray-400">Created:</span>
              <p>{new Date(campaign.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Content Preview</h3>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-300 whitespace-pre-wrap">{campaign.content || 'No content yet'}</p>
          </div>
        </div>
      </div>

      {/* Leads in Campaign */}
      <div className="glass-card p-6 mt-6">
        <h3 className="font-semibold mb-4">Leads in Campaign ({campaign.leads?.length || 0})</h3>
        {campaign.leads && campaign.leads.length > 0 ? (
          <div className="space-y-2">
            {campaign.leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <p className="font-medium">{lead.fullName}</p>
                  <p className="text-sm text-gray-400">{lead.company}</p>
                </div>
                <span className="text-sm text-gray-500">{lead.email}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">No leads added to this campaign yet</p>
        )}
      </div>
    </div>
  )
}