export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 mb-6">
          <span className="text-sm text-emerald-400 font-medium">
            🌍 Find ANY Business Owner. Anywhere. Instantly.
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Find Every Business Owner
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Anywhere in the World
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Get verified emails, phone numbers, WhatsApp contacts, and LinkedIn profiles
          for ANY business owner — from startups to Fortune 500s.
        </p>

        {/* Search Box */}
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by industry or company..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-6 py-3 transition-colors">
              Find Leads
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            🚀 50 free leads with signup • No credit card required
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
          {[
            { label: 'Businesses', value: '250M+' },
            { label: 'Emails', value: '500M+' },
            { label: 'Phone Numbers', value: '200M+' },
            { label: 'WhatsApp', value: '150M+' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}