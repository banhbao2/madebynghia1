'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    logger.fatal('React component error caught by boundary', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    })

    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Ein Fehler ist aufgetreten
              </h1>

              <p className="text-gray-600 mb-6">
                Entschuldigung, etwas ist schiefgegangen. Bitte versuchen Sie es erneut.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 text-left">
                  <details className="bg-red-50 border border-red-200 rounded p-4">
                    <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
                      Fehlerdetails (nur in Entwicklungsumgebung sichtbar)
                    </summary>
                    <div className="text-xs text-red-700 space-y-2">
                      <div>
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Erneut versuchen
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Zur Startseite
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>
                  Wenn das Problem weiterhin besteht, kontaktieren Sie uns bitte unter{' '}
                  <a
                    href="mailto:support@example.com"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    support@example.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Lightweight Error Fallback Component
 * Use for smaller sections where full-page error is too much
 */
export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-1">
            Fehler beim Laden des Inhalts
          </h3>
          <p className="text-sm text-red-700 mb-3">
            {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
          </p>
          <button
            onClick={reset}
            className="text-sm bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary
