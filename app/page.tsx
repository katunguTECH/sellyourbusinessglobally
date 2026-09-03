'use client'

import Link from 'next/link'
import { 
  ArrowRight, Globe, Users, Mail, Phone, MessageCircle, 
  Building2, Target, Zap, Sparkles, Search, Bookmark,
  Twitter, Linkedin, Send, Eye, TrendingUp, CheckCircle,
  Shield, Clock, BarChart3, Layers, Rocket, Star
} from 'lucide-react'

export default function Home() {
  const features = [
    { icon: Globe, title: 'Global Coverage', desc: 'Search businesses in 200+ countries', color: 'from-emerald-400 to-emerald-600' },
    { icon: Target, title: 'Smart Targeting', desc: 'Filter by industry, size, and location', color: 'from-blue-400 to-blue-600' },
    { icon: Users, title: 'Decision Makers', desc: 'Find CEOs, Founders, and key leaders', color: 'from-purple-400 to-purple-600' },
    { icon: Zap, title: 'Real-time Search', desc: 'Get results in seconds, not hours', color: 'from-yellow-400 to-yellow-600' },
  ]

  const stats = [
    { label: 'Businesses', value: '250M+', icon: Building2 },
    { label: 'Emails', value: '500M+', icon: Mail },
    { label: 'Phone Numbers', value: '200M+', icon: Phone },
    { label: 'WhatsApp', value: '150M+', icon: MessageCircle },
  ]

  const quickLinks = [
    { href: '/leads', label: 'Find Leads', icon: Search, color: 'from-emerald-400 to-emerald-500' },
    { href: '/campaigns', label: 'Campaigns', icon: Send, color: 'from-blue-400 to-blue-500' },
    { href: '/social-listening', label: 'Social Listening', icon: Twitter, color: 'from-purple-400 to-purple-500' },
    { href: '/whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'from-green-400 to-green-500' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <section className="relative pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 mb-8 animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">AI-Powered Lead Generation Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
            Find Every Business Owner
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Anywhere in the World
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Get verified emails, phone numbers, WhatsApp contacts, and LinkedIn profiles
            for ANY business owner — from startups to Fortune 500s.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/leads" className="btn-primary-premium group inline-flex items-center justify-center gap-2">
              Start Searching
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="btn-secondary-premium inline-flex items-center justify-center gap-2">
              View Pricing
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-premium rounded-2xl p-6 text-center hover:border-emerald-500/20 transition-all duration-500 group">
                <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href} className="group">
                  <div className="glass-premium rounded-2xl p-8 text-center hover:border-emerald-500/30 hover:scale-[1.02] transition-all duration-500 cursor-pointer">
                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${link.color} p-3.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{link.label}</h3>
                    <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-300 transition-colors">Get started →</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="py-16 border-t border-white/10">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400">One platform. Every contact method. Unlimited possibilities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="glass-premium rounded-2xl p-8 hover:border-emerald-500/30 hover:scale-[1.02] transition-all duration-500 group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-3 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-blue-500/10 border border-white/10 p-12 md:p-16 text-center">
            <div className="relative z-10">
              <Star className="w-12 h-12 text-emerald-400 mx-auto mb-6 animate-float" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Find Your Next Customer?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Join thousands of businesses already finding leads on Sellyourbusinessglobally.
              </p>
              <Link href="/leads" className="btn-primary-premium inline-flex items-center justify-center gap-2 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-gray-500 mt-6">✨ No credit card required • 50 free leads</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}