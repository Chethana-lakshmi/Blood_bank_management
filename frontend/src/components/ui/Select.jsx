import React, { forwardRef } from 'react'

const Select = forwardRef(function Select(
  { label, error, options = [], name, required, className = '', placeholder, ...props },
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
      <select
        ref={ref}
        id={name}
        name={name}
        required={required}
        className={[
          'w-full rounded-lg border text-sm text-gray-900 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
          'min-h-[44px] px-3 py-2.5 bg-white appearance-none cursor-pointer',
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-400'
            : 'border-gray-300 hover:border-gray-400',
          className,
        ].join(' ')}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '40px' }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
})

export default Select
