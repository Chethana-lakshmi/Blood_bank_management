import React from 'react'

export default function Card({ title, subtitle, children, className = '', actions, padding = true }) {
  return (
    <div className={['bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden', className].join(' ')}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={padding ? 'p-4' : ''}>{children}</div>
    </div>
  )
}
