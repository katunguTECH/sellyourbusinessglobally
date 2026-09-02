'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Eye, Users, TrendingUp, Send } from 'lucide-react'

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
  createdAt: string
  leads: any[]
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
      <div className="flex items-center gap-4 mb-8">
        <Link href="/campaigns" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{campaign.name}</h1>
          <p className="text-gray-400 text-sm">{campaign.description}</p>
        </div>
        <span className={`ml-auto text-xs px-3 py-1 rounded-full border bg-gray-500/20 text-gray-400 border-gray-500/30`}>
          {campaign.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-medium">Sent</span>
          </div>
          <div className="text-2xl font-bold">{campaign.sentCount}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium">Opens</span>
          </div>
          <div className="text-2xl font-bold">{campaign.openCount}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Clicks</span>
          </div>
          <div className="text-2xl font-bold">{campaign.clickCount}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Replies</span>
          </div>
          <div className="text-2xl font-bold">{campaign.replyCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
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

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Content Preview</h3>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-300 whitespace-pre-wrap">{campaign.content || 'No content yet'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}