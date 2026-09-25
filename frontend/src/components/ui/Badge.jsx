import React from 'react'

const variants = {
  success: 'bg-green-100 text-green-700 border border-green-200',
  danger: 'bg-red-100 text-red-700 border border-red-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  gray: 'bg-gray-100 text-gray-600 border border-gray-200',
  orange: 'bg-orange-100 text-orange-700 border border-orange-200',
  purple: 'bg-purple-100 text-purple-700 border border-purple-200',
}

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
}

export default function Badge({ variant = 'gray', children, size = 'md', className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full font-medium',
        variants[variant] || variants.gray,
        sizes[size] || sizes.md,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
