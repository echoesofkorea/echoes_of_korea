import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'medium',
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-blue-700 focus:ring-accent',
    secondary: 'bg-surface text-secondary border border-gray-300 hover:bg-gray-50 focus:ring-accent',
    danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger'
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  }

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}