'use client'

import Link from 'next/link'
import { Search, Send, Bookmark, ArrowUpRight, Users, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Leads found this month', value: '1,284' },
  { label: 'Saved leads', value: '312' },
  { label: 'Active campaigns', value: '4' },
  { label: 'Avg. reply rate', value: '18.2%' },
]

const quickActions = [
  { href: '/leads', label: 'Search leads', desc: 'Filter by industry, size, or location', icon: Search },
  { href: '/campaigns/new', label: 'New campaign', desc: 'Reach out to a saved list', icon: Send },
  { href: '/saved-leads', label: 'Saved leads', desc: 'Review and export your lists', icon: Bookmark },
]

const goalPaths = [
  {
    href: '/icp-generator?mode=buyers',
    label: 'Find buyers',
    desc: 'Discover companies and people who\u2019d want to acquire your business',
    icon: Search,
  },
  {
    href: '/icp-generator?mode=investors',
    label: 'Find investors',
    desc: 'Surface VCs, angels, and funds that fit your stage and sector',
    icon: TrendingUp,
  },
  {
    href: '/icp-generator?mode=customers',
    label: 'Grow my customer base',
    desc: 'Get a channel and content strategy to reach real users',
    icon: Users,
  },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Good to see you, John</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your prospecting.</p>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3">What are you looking for?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goalPaths.map((goal) => {
            const Icon = goal.icon
            return (
              <Link key={goal.href} href={goal.href} className="surface-hover p-4 flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-md bg-[hsl(227,100%,65%,0.1)] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[hsl(var(--accent))]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{goal.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{goal.desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="surface p-4">
            <p className="stat-value">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href} className="surface-hover p-4 flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-md bg-[hsl(227,100%,65%,0.1)] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[hsl(var(--accent))]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}