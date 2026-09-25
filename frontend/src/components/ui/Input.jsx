import React, { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, placeholder, type = 'text', name, required, icon: Icon, className = '', ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={[
            'w-full rounded-lg border text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
            'min-h-[44px] px-3 py-2.5',
            Icon ? 'pl-10' : '',
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-400'
              : 'border-gray-300 bg-white hover:border-gray-400',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
})

export default Input
