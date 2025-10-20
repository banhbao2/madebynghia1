import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  isLoading?: boolean
  fullWidth?: boolean
}

/**
 * Unified Button Component
 * Provides consistent button styling across the application
 *
 * @param variant - Button style variant (default: 'primary')
 * @param size - Button size (default: 'md')
 * @param isLoading - Show loading spinner and disable button
 * @param fullWidth - Make button full width
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    children,
    className,
    isLoading = false,
    fullWidth = false,
    disabled,
    ...props
  }, ref) => {
    // Base styles - consistent across all buttons
    const baseStyles = "rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"

    // Variant styles - different visual treatments
    const variants = {
      primary: "bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:shadow-red-500/50",
      secondary: "bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50 shadow-sm",
      outline: "border-2 border-red-600 text-red-600 hover:bg-red-50 transition-colors",
      ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      success: "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
    }

    // Size styles - consistent padding and text sizes
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    }

    // Width styles
    const widthStyles = fullWidth ? "w-full" : ""

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthStyles,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
