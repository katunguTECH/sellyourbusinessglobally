'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export default function NewCampaignPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    content: '',
    senderName: '',
    senderEmail: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Campaign created successfully! 🎉')
        router.push('/campaigns')
      } else {
        alert('Failed to create campaign')
      }
    } catch (error) {
      alert('Failed to create campaign')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/campaigns" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Create Campaign</h1>
          <p className="text-gray-400 text-sm">Set up your email sequence</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Details */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Campaign Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Name *</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Tech Outreach Q4 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                placeholder="Describe your campaign..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Email Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Line *</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Grow your business with our solution"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Content *</label>
              <textarea
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[200px]"
                placeholder="Write your email content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sender Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="John Doe"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sender Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="john@yourcompany.com"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/campaigns" className="border border-white/10 hover:bg-white/10 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-6 py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              'Creating...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Create Campaign
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}