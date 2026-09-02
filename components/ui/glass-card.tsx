import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'hover' | 'gradient'
}

export function GlassCard({ children, className = '', variant = 'default' }: GlassCardProps) {
  const variantClasses = {
    default: 'bg-white/5',
    hover: 'bg-white/5 hover:border-emerald-500/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300',
    gradient: 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10',
  }

  return (
    <div className={`rounded-xl border border-white/10 backdrop-blur-sm ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}