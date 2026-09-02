'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, Mail, Send, Eye, Clock, Play, Pause, 
  Trash2, Edit, BarChart3, Users, TrendingUp,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  description: string
  status: string
  subject: string
  sentCount: number
  openCount: number
  clickCount: number
  replyCount: number
  bounceCount: number
  createdAt: string
  leads: any[]
  sequences: any[]
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns')
      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error('Failed to load campaigns:', error)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />
      case 'draft': return <Edit className="w-3 h-3" />
      case 'paused': return <Pause className="w-3 h-3" />
      case 'completed': return <CheckCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0)
  const totalOpens = campaigns.reduce((sum, c) => sum + c.openCount, 0)
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replyCount, 0)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Email Campaigns</h1>
          <p className="text-gray-400 text-sm">Create and manage email sequences</p>
        </div>
        <Link
          href="/campaigns/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <div className="text-2xl font-bold">{campaigns.length}</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Send className="w-5 h-5" />
            <span className="text-sm font-medium">Sent</span>
          </div>
          <div className="text-2xl font-bold">{totalSent}</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium">Opens</span>
          </div>
          <div className="text-2xl font-bold">{totalOpens}</div>
          <div className="text-sm text-gray-500">
            {totalSent > 0 ? Math.round((totalOpens / totalSent) * 100) : 0}% rate
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Replies</span>
          </div>
          <div className="text-2xl font-bold">{totalReplies}</div>
          <div className="text-sm text-gray-500">
            {totalSent > 0 ? Math.round((totalReplies / totalSent) * 100) : 0}% rate
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
          <p className="text-gray-400 mb-4">Create your first email campaign to start reaching leads</p>
          <Link href="/campaigns/new" className="btn-primary inline-block">
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="glass-card p-6 hover:border-emerald-500/30 transition-all block"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{campaign.name}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(campaign.status)} flex items-center gap-1`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{campaign.description}</p>
                  {campaign.subject && (
                    <p className="text-sm text-gray-500">
                      Subject: <span className="text-gray-300">{campaign.subject}</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  {campaign.leads?.length || 0} leads
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Send className="w-4 h-4" />
                  {campaign.sentCount} sent
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Eye className="w-4 h-4" />
                  {campaign.openCount} opens
                </div>
                <div className="text-sm text-gray-500">
                  Created {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}