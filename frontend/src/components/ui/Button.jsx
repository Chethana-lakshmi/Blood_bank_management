import React from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm disabled:bg-red-300',
  secondary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 disabled:bg-gray-50 disabled:text-gray-400',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm disabled:bg-red-300',
  outline: 'border border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 disabled:border-gray-300 disabled:text-gray-400',
  ghost: 'text-red-600 hover:bg-red-50 active:bg-red-100 disabled:text-gray-400',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-4 py-2.5 text-sm min-h-[44px]',
  lg: 'px-6 py-3 text-base min-h-[48px]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  children,
  icon: Icon,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? 'w-full' : '',
        disabled || loading ? 'cursor-not-allowed opacity-70' : '',
        className,
      ].join(' ')}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  )
}
