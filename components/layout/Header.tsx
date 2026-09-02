'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, X, Bell, User, Search, ChevronDown, Sparkles, 
  LogOut, Settings, HelpCircle, LayoutDashboard 
} from 'lucide-react'

const navItems = [
  { href: '/leads', label: 'Leads' },
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/social-listening', label: 'Social' },
  { href: '/whatsapp', label: 'WhatsApp' },
  { href: '/saved-leads', label: 'Saved' },
  { href: '/pricing', label: 'Pricing' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight">
                Sellyourbusiness<span className="text-emerald-400">globally</span>
              </span>
              <span className="hidden lg:inline text-[10px] text-gray-500 ml-2 font-medium border border-white/10 px-2 py-0.5 rounded-full bg-white/5">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-2.5 text-sm font-medium rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-52 rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <button className="relative p-3 rounded-2xl hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
            </button>

            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-2xl px-4 py-2 transition-colors group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-black font-semibold text-sm shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  JD
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-sm font-semibold leading-none">John Doe</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pro Plan</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-2xl hover:bg-white/10 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-white/10 animate-slideDown">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/10 my-4"></div>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-black font-semibold text-sm">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-400">john@example.com</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2 px-4">
                <button className="flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-2xl transition-all">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2.5 rounded-2xl transition-all">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}