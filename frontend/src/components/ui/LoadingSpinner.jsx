import React from 'react'
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ text = '', size = 'md', fullPage = false }) {
  const iconSizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${iconSizes[size] || iconSizes.md} animate-spin text-red-600`} />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  )
}
