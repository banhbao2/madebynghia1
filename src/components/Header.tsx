'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const smoothScrollTo = (element: HTMLElement) => {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    const duration = 1200 // milliseconds
    let start: number | null = null

    // Easing function: ease-in-out-cubic (starts fast, ends slow)
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const progress = Math.min(timeElapsed / duration, 1)
      const easeProgress = easeInOutCubic(progress)

      window.scrollTo(0, startPosition + distance * easeProgress)

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if it's an anchor link and we're on the home page
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault()
      const id = href.substring(2) // Remove '/#'
      const element = document.getElementById(id)
      if (element) {
        smoothScrollTo(element)
        setMobileMenuOpen(false)
      }
    } else if (href.startsWith('/#')) {
      // If not on home page, let Next.js navigate then scroll
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-orange-100">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        {/* Logo - Mobile optimized */}
        <Link href="/" className="text-xl md:text-2xl font-extrabold text-gray-900 hover:text-red-600 transition touch-manipulation">
          🍜 Nghia Demo
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/menu"
            className="text-gray-700 hover:text-gray-900 font-medium transition"
          >
            Speisekarte
          </Link>
          <Link
            href="/reservations"
            className="text-gray-700 hover:text-gray-900 font-medium transition"
          >
            Reservierung
          </Link>
          <Link
            href="/#about"
            onClick={(e) => handleScrollToSection(e, '/#about')}
            className="text-gray-700 hover:text-gray-900 font-medium transition"
          >
            Über uns
          </Link>
          <Link
            href="/#contact"
            onClick={(e) => handleScrollToSection(e, '/#contact')}
            className="text-gray-700 hover:text-gray-900 font-medium transition"
          >
            Kontakt
          </Link>
          <Link
            href="/menu"
            className="bg-red-600 text-white px-6 lg:px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
          >
            Jetzt bestellen →
          </Link>
        </nav>

        {/* Mobile Menu Button - Larger touch target */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-900 p-2 -mr-2 touch-manipulation active:scale-95 transition-transform"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu - Full screen overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 md:hidden overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-xl font-bold text-gray-900">Menü</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 touch-manipulation active:scale-95 transition"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links - Larger touch targets */}
              <nav className="flex-1 flex flex-col p-4 space-y-2">
                <Link
                  href="/menu"
                  className="flex items-center gap-3 text-gray-900 font-semibold py-4 px-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-2xl">🍽️</span>
                  <span className="text-lg">Speisekarte</span>
                </Link>
                <Link
                  href="/reservations"
                  className="flex items-center gap-3 text-gray-900 font-semibold py-4 px-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-2xl">📅</span>
                  <span className="text-lg">Reservierung</span>
                </Link>
                <Link
                  href="/#about"
                  onClick={(e) => handleScrollToSection(e, '/#about')}
                  className="flex items-center gap-3 text-gray-900 font-semibold py-4 px-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation"
                >
                  <span className="text-2xl">ℹ️</span>
                  <span className="text-lg">Über uns</span>
                </Link>
                <Link
                  href="/#contact"
                  onClick={(e) => handleScrollToSection(e, '/#contact')}
                  className="flex items-center gap-3 text-gray-900 font-semibold py-4 px-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation"
                >
                  <span className="text-2xl">📞</span>
                  <span className="text-lg">Kontakt</span>
                </Link>

                {/* Primary CTA */}
                <div className="pt-4 mt-auto">
                  <Link
                    href="/menu"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl active:scale-95 transition-transform touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Jetzt bestellen</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </nav>

              {/* Contact Info */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2 font-medium">Kontakt</p>
                <a href="tel:+493012345678" className="flex items-center gap-2 text-sm text-gray-900 mb-2 touch-manipulation">
                  <span>📞</span>
                  <span>+49 30 12345678</span>
                </a>
                <a href="mailto:hallo@nghiademo.com" className="flex items-center gap-2 text-sm text-gray-900 touch-manipulation">
                  <span>✉️</span>
                  <span>hallo@nghiademo.com</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
