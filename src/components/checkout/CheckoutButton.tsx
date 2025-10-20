import { Button } from '@/components/ui'
import { useState, useEffect } from 'react'

interface CheckoutButtonProps {
  isSubmitting: boolean
  isMobile?: boolean
  onSubmit: (e: React.FormEvent) => void
}

export default function CheckoutButton({ isSubmitting, isMobile = false, onSubmit }: CheckoutButtonProps) {
  const visibilityClass = isMobile ? "lg:hidden" : "hidden lg:flex"

  // Progressive loading messages for psychological impact
  const [loadingMessage, setLoadingMessage] = useState('Wird verarbeitet...')

  useEffect(() => {
    if (!isSubmitting) {
      setLoadingMessage('Wird verarbeitet...')
      return
    }

    const messages = [
      { text: 'Wird verarbeitet...', delay: 0 },
      { text: 'Berechne Lieferzeit...', delay: 800 },
      { text: 'Sende Bestellung...', delay: 1600 },
      { text: 'Fast fertig...', delay: 2400 }
    ]

    const timeouts = messages.map(({ text, delay }) =>
      setTimeout(() => setLoadingMessage(text), delay)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [isSubmitting])

  return (
    <Button
      type="submit"
      onClick={onSubmit}
      disabled={isSubmitting}
      variant="primary"
      size="lg"
      fullWidth
      isLoading={isSubmitting}
      className={visibilityClass}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <span className="animate-pulse">{loadingMessage}</span>
        </span>
      ) : (
        <>
          Bestellung aufgeben
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </>
      )}
    </Button>
  )
}
