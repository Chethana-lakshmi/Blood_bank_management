import React from 'react'

const groupColors = {
  'A+': 'bg-red-100 text-red-700 border-red-200',
  'A-': 'bg-red-50 text-red-600 border-red-100',
  'B+': 'bg-rose-100 text-rose-700 border-rose-200',
  'B-': 'bg-rose-50 text-rose-600 border-rose-100',
  'AB+': 'bg-pink-100 text-pink-700 border-pink-200',
  'AB-': 'bg-pink-50 text-pink-600 border-pink-100',
  'O+': 'bg-orange-100 text-orange-700 border-orange-200',
  'O-': 'bg-orange-50 text-orange-600 border-orange-100',
}

export default function BloodGroupBadge({ group, size = 'md' }) {
  const colorClass = groupColors[group] || 'bg-gray-100 text-gray-600 border-gray-200'
  const sizeClass = size === 'lg' ? 'text-lg px-3 py-1.5 font-bold' : size === 'sm' ? 'text-xs px-2 py-0.5 font-semibold' : 'text-sm px-2.5 py-1 font-bold'

  return (
    <span className={`inline-flex items-center rounded-lg border ${colorClass} ${sizeClass}`}>
      {group}
    </span>
  )
}
