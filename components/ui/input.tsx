import { ReactNode } from 'react'

interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: ReactNode
  error?: string
  type?: string
  required?: boolean
  className?: string
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  icon,
  error,
  type = 'text',
  required = false,
  className = '',
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full rounded-lg border bg-white/5 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${icon ? 'pl-10' : 'px-4'} ${error ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10'} py-3 ${className}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}