import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({ icon: Icon, value, label, trend, trendLabel, color = 'red', className = '' }) {
  const colorMap = {
    red: { bg: 'bg-red-50', icon: 'text-red-600', ring: 'bg-red-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', ring: 'bg-green-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', ring: 'bg-blue-100' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', ring: 'bg-yellow-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', ring: 'bg-orange-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'bg-purple-100' },
  }

  const c = colorMap[color] || colorMap.red

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-gray-400'

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 ${className}`}>
      <div className={`w-12 h-12 rounded-xl ${c.ring} flex items-center justify-center flex-shrink-0`}>
        {Icon && <Icon className={`w-6 h-6 ${c.icon}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-gray-900 leading-none">{value ?? '—'}</p>
        <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          {trendLabel || `${Math.abs(trend)}%`}
        </div>
      )}
    </div>
  )
}
