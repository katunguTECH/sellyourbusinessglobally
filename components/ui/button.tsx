import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  isLoading = false,
}: ButtonProps) {
  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
    secondary: 'bg-white/10 hover:bg-white/20 text-white',
    outline: 'border border-white/10 hover:bg-white/10 text-white',
    ghost: 'hover:bg-white/10 text-gray-400 hover:text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
      ) : (
        icon
      )}
      {children}
    </button>
  )
}