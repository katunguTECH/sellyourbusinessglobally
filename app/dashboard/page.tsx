'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Users, Mail, TrendingUp, Search, Send, Bookmark, 
  CheckCircle, Clock, AlertCircle, ArrowRight,
  Building2, Phone, Globe, Target, Zap
} from 'lucide-react'

export default function Dashboard() {
  const [recentLeads] = useState([
    { name: 'Aria Chen', company: 'Northwind Robotics', title: 'Founder & CEO', status: 'verified' },
    { name: 'Marcus Webb', company: 'Fieldstone Group', title: 'VP Sales', status: 'verified' },
    { name: 'Priya Nair', company: 'Lumen Health', title: 'CEO', status: 'pending' },
    { name: 'James Okafor', company: 'Safari Logistics', title: 'Director', status: 'verified' },
  ])

  const stats = [
    { label: 'Leads found this month', value: '1,284', icon: Users, change: '+12%' },
    { label: 'Saved leads', value: '312', icon: Bookmark, change: '+8%' },
    { label: 'Active campaigns', value: '4', icon: Send, change: '+2' },
    { label: 'Avg. reply rate', value: '18.2%', icon: TrendingUp, change: '+5.2%' },
  ]

  const quickActions = [
    { href: '/leads', label: 'Search leads', desc: 'Filter by industry, size, or location', icon: Search },
    { href: '/campaigns/new', label: 'New campaign', desc: 'Reach out to a saved list', icon: Send },
    { href: '/saved-leads', label: 'Saved leads', desc: 'Review and export your lists', icon: Bookmark },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <span className="badge-success text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>
      case 'pending': return <span className="badge-warning text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>
      default: return <span className="badge-neutral text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Unknown</span>
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Good to see you, John</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your prospecting.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="surface p-5">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-accent/10">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
              </div>
              <div className="mt-3">
                <div className="stat-value">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions + Recent Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quick actions</h2>
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href} className="block">
                <div className="surface-hover p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-accent/5">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto mt-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent leads</h2>
            <Link href="/leads" className="text-xs text-accent hover:text-accent/80 transition-colors">View all →</Link>
          </div>
          <div className="surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Company</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Title</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.name} className="border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors duration-150">
                      <td className="py-3 px-4 font-medium">{lead.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{lead.company}</td>
                      <td className="py-3 px-4 text-muted-foreground">{lead.title}</td>
                      <td className="py-3 px-4">{getStatusBadge(lead.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}