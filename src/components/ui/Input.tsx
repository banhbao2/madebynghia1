import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  fullWidth?: boolean
}

/**
 * Unified Input Component
 * Provides consistent input styling across the application
 *
 * @param error - Show error state styling
 * @param fullWidth - Make input full width
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    error = false,
    fullWidth = false,
    ...props
  }, ref) => {
    // Base styles - consistent across all inputs
    const baseStyles = "rounded-xl px-4 py-3 border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0"

    // State styles
    const stateStyles = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200 focus:border-red-500 focus:ring-red-500/20 hover:border-gray-300"

    // Width styles
    const widthStyles = fullWidth ? "w-full" : ""

    return (
      <input
        ref={ref}
        className={cn(
          baseStyles,
          stateStyles,
          widthStyles,
          "text-base",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  fullWidth?: boolean
}

/**
 * Unified Textarea Component
 * Provides consistent textarea styling across the application
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    error = false,
    fullWidth = false,
    ...props
  }, ref) => {
    // Base styles
    const baseStyles = "rounded-xl px-4 py-3 border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 resize-y min-h-[100px]"

    // State styles
    const stateStyles = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200 focus:border-red-500 focus:ring-red-500/20 hover:border-gray-300"

    // Width styles
    const widthStyles = fullWidth ? "w-full" : ""

    return (
      <textarea
        ref={ref}
        className={cn(
          baseStyles,
          stateStyles,
          widthStyles,
          "text-base",
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

/**
 * Unified Label Component
 * Provides consistent label styling for form inputs
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({
    className,
    children,
    required = false,
    ...props
  }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-bold text-gray-700 mb-2",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )
  }
)

Label.displayName = 'Label'
