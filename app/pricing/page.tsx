import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      description: 'Perfect for individuals just getting started',
      features: ['100 leads/month', 'Email verification', 'Basic search filters', 'CSV export'],
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      price: '$99',
      description: 'For serious lead generation professionals',
      features: ['500 leads/month', 'Email + Phone verification', 'Advanced filters', 'Bulk export', 'API access'],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large teams and agencies',
      features: ['Unlimited leads', 'All verification methods', 'Custom integrations', 'Dedicated support', 'White-label'],
      cta: 'Contact Sales'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Pricing</h1>
            <p className="text-gray-400 text-sm">Choose the plan that works for you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white/5 border rounded-xl p-6 relative ${
                plan.popular ? 'border-emerald-500 scale-105' : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              )}
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <div className="text-3xl font-bold mb-2">{plan.price}</div>
              <div className="text-sm text-gray-400 mb-4">{plan.description}</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/leads"
                className={`block text-center rounded-lg px-4 py-2 font-medium transition-colors ${
                  plan.popular 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black' 
                    : 'border border-white/10 hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}