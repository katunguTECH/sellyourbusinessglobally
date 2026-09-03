'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Search, Bookmark, Send, Twitter, 
  MessageCircle, BarChart3, Settings, Users, 
  Sparkles, Zap, Mail, Phone, Globe, Target
} from 'lucide-react'

const navSections = [
  {
    label: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/apollo-leads', label: 'Leads', icon: Search },
      { href: '/saved-leads', label: 'Saved Leads', icon: Bookmark },
    ]
  },
  {
    label: 'Outreach',
    items: [
      { href: '/campaigns', label: 'Campaigns', icon: Send },
      { href: '/social-listening', label: 'Social Listening', icon: Twitter },
      { href: '/whatsapp', label: 'WhatsApp', icon: MessageCircle },
    ]
  },
  {
    label: 'Analytics',
    items: [
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/pricing', label: 'Pricing', icon: BarChart3 },
    ]
  },
  {
    label: 'Settings',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-card overflow-y-auto">
      <div className="p-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                    isActive
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
        
        <div className="mt-6 p-4 rounded-md border border-border bg-background">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">50 credits</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="mt-3 block text-center text-xs font-medium bg-accent hover:bg-accent/90 text-white rounded-md px-3 py-1.5 transition-colors duration-150"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>
    </aside>
  )
}