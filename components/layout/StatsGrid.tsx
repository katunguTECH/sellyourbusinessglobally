import { ReactNode } from 'react'

interface StatItem {
  label: string
  value: string | number
  icon: ReactNode
  change?: string
  color?: 'emerald' | 'blue' | 'purple' | 'yellow' | 'pink'
}

const colorClasses = {
  emerald: 'text-emerald-400 bg-emerald-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  yellow: 'text-yellow-400 bg-yellow-500/10',
  pink: 'text-pink-400 bg-pink-500/10',
}

interface StatsGridProps {
  stats: StatItem[]
  className?: string
}

export function StatsGrid({ stats, className = '' }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-emerald-500/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`rounded-lg p-2 ${colorClasses[stat.color || 'emerald']}`}>
              {stat.icon}
            </div>
            {stat.change && (
              <span className="text-xs font-medium text-emerald-400">
                {stat.change}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm text-gray-400 mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}