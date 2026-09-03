'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Search, ChevronDown, Sparkles } from 'lucide-react'

export function TopBar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background transition-shadow duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="font-semibold text-sm tracking-tight">
            Sellyourbusiness<span className="text-accent">globally</span>
          </span>
        </Link>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads, companies, or campaigns..."
              className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors duration-150"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-md hover:bg-white/5 transition-colors duration-150">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-background" />
          </button>
          
          <div className="flex items-center gap-2 border-l border-border pl-3">
            <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center text-accent font-medium text-sm">
              JD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs text-muted-foreground">Pro Plan</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  )
}