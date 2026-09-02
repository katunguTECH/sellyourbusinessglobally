import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EnhancedLeadsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Enhanced Leads</h1>
            <p className="text-gray-400 text-sm">Apollo + Hunter verification</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <p className="text-gray-400">Enhanced lead search with Apollo + Hunter email verification</p>
          <Link href="/leads" className="text-emerald-400 hover:text-emerald-300 mt-4 inline-block">
            ← Back to Lead Search
          </Link>
        </div>
      </div>
    </div>
  )
}
