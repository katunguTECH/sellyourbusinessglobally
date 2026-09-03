'use client'

import Link from 'next/link'
import { Search, Send, Bookmark, ArrowUpRight } from 'lucide-react'

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

const recentLeads = [
  { name: 'Aria Chen', company: 'Northwind Robotics', title: 'Founder & CEO', status: 'verified' },
  { name: 'Marcus Webb', company: 'Fieldstone Group', title: 'VP Sales', status: 'verified' },
  { name: 'Priya Nair', company: 'Lumen Health', title: 'CEO', status: 'pending' },
  { name: 'Tom Riley', company: 'Basecamp Studio', title: 'Founder', status: 'verified' },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Good to see you, John</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your prospecting.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="surface p-4">
            <p className="stat-value">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
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

      {/* Recent leads */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">Recent leads</h2>
          <Link href="/leads" className="text-xs text-[hsl(var(--accent))] hover:underline">
            View all
          </Link>
        </div>
        <div className="surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="font-medium px-4 py-2.5">Name</th>
                <th className="font-medium px-4 py-2.5">Company</th>
                <th className="font-medium px-4 py-2.5">Title</th>
                <th className="font-medium px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead, i) => (
                <tr key={lead.name} className={i !== recentLeads.length - 1 ? 'border-b border-border' : ''}>
                  <td className="px-4 py-2.5 font-medium">{lead.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{lead.company}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{lead.title}</td>
                  <td className="px-4 py-2.5">
                    <span className={lead.status === 'verified' ? 'badge-success' : 'badge-warning'}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}