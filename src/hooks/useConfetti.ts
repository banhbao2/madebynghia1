import { useCallback } from 'react'
import confetti from 'canvas-confetti'

export type ConfettiStyle = 'celebration' | 'success' | 'subtle'

/**
 * Custom hook for celebration confetti animations
 * Provides dopamine-inducing micro-interactions that reinforce positive user actions
 */
export function useConfetti() {
  /**
   * Celebration confetti - Big, joyful explosion for major achievements
   * Use for: Order completion, successful checkout
   */
  const celebration = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Fire from two sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }, [])

  /**
   * Success confetti - Single burst from top
   * Use for: Successful form submissions, confirmation pages
   */
  const success = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7'], // Green success colors
      zIndex: 1000,
    })
  }, [])

  /**
   * Subtle confetti - Small burst, quick and delightful
   * Use for: Adding to cart, small wins
   */
  const subtle = useCallback((x: number = 0.5, y: number = 0.5) => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x, y },
      colors: ['#ef4444', '#f97316', '#fbbf24'], // Brand colors (red-orange-yellow)
      ticks: 50,
      gravity: 1.2,
      scalar: 0.8,
      zIndex: 1000,
    })
  }, [])

  /**
   * Fire confetti from a specific element's position
   */
  const fromElement = useCallback((element: HTMLElement, style: ConfettiStyle = 'subtle') => {
    const rect = element.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    if (style === 'subtle') {
      subtle(x, y)
    } else if (style === 'success') {
      success()
    } else {
      celebration()
    }
  }, [subtle, success, celebration])

  return {
    celebration,
    success,
    subtle,
    fromElement,
  }
}
