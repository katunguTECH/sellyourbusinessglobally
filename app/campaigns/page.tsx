'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Mail, Send, Eye, Users, TrendingUp, Sparkles, Zap } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatsGrid } from '@/components/layout/StatsGrid'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/layout/EmptyState'

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
  createdAt: string
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

  const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'active': return 'success'
      case 'draft': return 'default'
      case 'paused': return 'warning'
      case 'completed': return 'info'
      default: return 'default'
    }
  }

  const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0)
  const totalOpens = campaigns.reduce((sum, c) => sum + c.openCount, 0)
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replyCount, 0)

  const stats = [
    {
      label: 'Total Campaigns',
      value: campaigns.length,
      icon: <Sparkles className="w-5 h-5" />,
      color: 'emerald' as const,
    },
    {
      label: 'Emails Sent',
      value: totalSent,
      icon: <Send className="w-5 h-5" />,
      color: 'blue' as const,
    },
    {
      label: 'Open Rate',
      value: totalSent > 0 ? `${Math.round((totalOpens / totalSent) * 100)}%` : '0%',
      icon: <Eye className="w-5 h-5" />,
      color: 'purple' as const,
    },
    {
      label: 'Reply Rate',
      value: totalSent > 0 ? `${Math.round((totalReplies / totalSent) * 100)}%` : '0%',
      icon: <Users className="w-5 h-5" />,
      color: 'yellow' as const,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Email Campaigns"
        description="Create and manage your email sequences"
        actions={
          <Link href="/campaigns/new">
            <Button icon={<Plus className="w-4 h-4" />}>
              New Campaign
            </Button>
          </Link>
        }
      />

      <StatsGrid stats={stats} />

      {campaigns.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-8 h-8" />}
          title="No campaigns yet"
          description="Create your first email campaign to start reaching leads"
          action={
            <Link href="/campaigns/new">
              <Button icon={<Plus className="w-4 h-4" />}>
                Create Campaign
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4 mt-8">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="block"
            >
              <GlassCard variant="hover" className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <Badge variant={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{campaign.description}</p>
                    {campaign.subject && (
                      <p className="text-sm text-gray-500">
                        Subject: <span className="text-gray-300">{campaign.subject}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
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
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}