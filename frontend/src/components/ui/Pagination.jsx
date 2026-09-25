import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors">1</button>
          {start > 2 && <span className="text-gray-400 px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={[
            'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
            p === page
              ? 'bg-red-600 text-white border border-red-600'
              : 'border border-gray-200 text-gray-700 hover:bg-gray-50',
          ].join(' ')}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400 px-1">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
