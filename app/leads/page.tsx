'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, Globe, Users, Mail, Phone, MessageCircle, Building2, 
  Target, Zap, ArrowRight, Menu, X, Sparkles, Database, 
  Bookmark, LayoutDashboard, BarChart3
} from 'lucide-react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const stats = [
    { label: 'Businesses', value: '250M+', icon: Building2 },
    { label: 'Emails', value: '500M+', icon: Mail },
    { label: 'Phone Numbers', value: '200M+', icon: Phone },
    { label: 'WhatsApp', value: '150M+', icon: MessageCircle }
  ]

  const features = [
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Search businesses in 200+ countries worldwide'
    },
    {
      icon: Target,
      title: 'Smart Targeting',
      description: 'Filter by industry, size, revenue, and location'
    },
    {
      icon: Users,
      title: 'Decision Makers',
      description: 'Find CEOs, Founders, and key decision makers'
    },
    {
      icon: Zap,
      title: 'Real-time Search',
      description: 'Get results in seconds, not hours or days'
    }
  ]

  const navLinks = [
    { href: '/leads', label: 'Find Leads', icon: Search, color: 'text-emerald-400' },
    { href: '/apollo-leads', label: 'Apollo Leads', icon: Globe, color: 'text-blue-400' },
    { href: '/enhanced-leads', label: 'Enhanced Leads', icon: Sparkles, color: 'text-purple-400' },
    { href: '/saved-leads', label: 'Saved Leads', icon: Bookmark, color: 'text-emerald-400' },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-yellow-400' },
    { href: '/pricing', label: 'Pricing', icon: BarChart3, color: 'text-pink-400' },
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                Sellyourbusinessglobally
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 text-sm ${link.color} hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <button className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 font-medium transition-colors ml-2">
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-300 hover:text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 ${link.color} hover:text-white transition-colors px-4 py-3 rounded-lg hover:bg-white/5`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                <button className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 font-medium transition-colors w-full mt-2">
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 mb-6">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">
                🌍 Find ANY Business Owner. Anywhere. Instantly.
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Find Every Business Owner
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Anywhere in the World
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Get verified emails, phone numbers, WhatsApp contacts, and LinkedIn profiles
              for ANY business owner — from startups to Fortune 500s.
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by industry, location, or company..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 pl-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/leads?q=${encodeURIComponent(searchQuery)}`
                      }
                    }}
                  />
                </div>
                <Link
                  href={searchQuery.trim() ? `/leads?q=${encodeURIComponent(searchQuery)}` : '/leads'}
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-6 py-3 transition-colors"
                >
                  Find Leads Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                🚀 50 free leads with signup • No credit card required
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
                    <Icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/leads" className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
              <Search className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Lead Search</h3>
              <p className="text-gray-400 text-sm">Find business owners with verified contacts</p>
            </Link>
            <Link href="/enhanced-leads" className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Enhanced Search</h3>
              <p className="text-gray-400 text-sm">Apollo + Hunter verified emails</p>
            </Link>
            <Link href="/saved-leads" className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
              <Bookmark className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Saved Leads</h3>
              <p className="text-gray-400 text-sm">View and manage your saved leads</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Find Any Business
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              One platform. Every contact method. Unlimited possibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 group">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-white/10 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Find Your Next Customer?
            </h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Join thousands of businesses already finding leads on Sellyourbusinessglobally.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/leads"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-8 py-3 transition-colors"
              >
                Start Searching
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/10 text-white font-medium px-8 py-3 transition-colors"
              >
                View Pricing
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 50 free leads
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2024 Sellyourbusinessglobally. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-gray-300 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}