import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ 
  label, 
  error,
  id,
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm ${
          error ? 'border-danger' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  )
}