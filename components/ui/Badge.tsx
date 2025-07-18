import React from 'react'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'default'
  children: React.ReactNode
}

export default function Badge({ variant = 'default', children }: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-success',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-danger',
    default: 'bg-gray-100 text-secondary'
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}