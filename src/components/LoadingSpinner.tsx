/**
 * Reusable Loading Spinner Component
 * Used for inline loading states
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  text?: string
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'border-red-600',
    white: 'border-white',
    gray: 'border-gray-600'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  )
}

/**
 * Full Page Loading Component
 */
export function PageLoader({ text = 'Wird geladen...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="xl" text={text} />
    </div>
  )
}

/**
 * Section Loading Component
 */
export function SectionLoader({ text }: { text?: string }) {
  return (
    <div className="py-12 flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

/**
 * Button Loading Component
 */
export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <LoadingSpinner size={size} color="white" />
  )
}
