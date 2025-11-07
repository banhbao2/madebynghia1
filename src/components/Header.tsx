'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Track scroll position for enhanced sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  // Close mobile menu with ESC key for accessibility
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [mobileMenuOpen])

  const smoothScrollTo = (element: HTMLElement) => {
    // Get the fixed header height for proper offset
    const headerHeight = 68 // md:pt-[68px] from the layout
    const additionalOffset = 24 // Extra spacing for better UX (breathing room)

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition - headerHeight - additionalOffset
    const duration = 600 // Optimal duration: 600ms (industry standard for smooth UX)
    let start: number | null = null

    // Easing function: ease-out-quart (fast start, smooth deceleration)
    // Research shows this feels more natural and responsive than ease-in-out
    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4)
    }

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const progress = Math.min(timeElapsed / duration, 1)
      const easeProgress = easeOutQuart(progress)

      window.scrollTo({
        top: startPosition + distance * easeProgress,
        behavior: 'auto' // Use our custom animation instead of browser's
      })

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      } else {
        // Ensure we end at exact position (prevents sub-pixel issues)
        window.scrollTo({
          top: startPosition + distance,
          behavior: 'auto'
        })
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/98 backdrop-blur-lg shadow-lg border-b border-orange-200'
        : 'bg-white/95 backdrop-blur-md shadow-md border-b border-orange-100'
    }`}>
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
            href="/menu2"
            className="text-gray-700 hover:text-gray-900 font-medium transition"
          >
            Speisekarte 2
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
      <>
        {/* Backdrop with fade animation */}
        <div
          className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel with slide-in animation - Full Width */}
        <div
          className={`fixed inset-0 bg-white z-50 md:hidden transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
            <div className="flex flex-col h-full bg-white">
              {/* Header with gradient */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-600 to-orange-500 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍜</span>
                  <span className="text-xl font-bold text-white">Menü</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 text-white/90 hover:text-white touch-manipulation active:scale-95 transition rounded-lg hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links - Spacious */}
              <nav className="flex flex-col justify-center flex-1 px-6 py-8 space-y-3 bg-white">
                <Link
                  href="/menu"
                  className="flex items-center gap-4 text-gray-900 font-bold py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation border-2 border-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-3xl">🍽️</span>
                  <span className="text-xl">Speisekarte</span>
                </Link>
                <Link
                  href="/menu2"
                  className="flex items-center gap-4 text-gray-900 font-bold py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation border-2 border-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-3xl">📋</span>
                  <span className="text-xl">Speisekarte 2</span>
                </Link>
                <Link
                  href="/reservations"
                  className="flex items-center gap-4 text-gray-900 font-bold py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation border-2 border-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-3xl">📅</span>
                  <span className="text-xl">Reservierung</span>
                </Link>
                <Link
                  href="/#about"
                  onClick={(e) => handleScrollToSection(e, '/#about')}
                  className="flex items-center gap-4 text-gray-900 font-bold py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation border-2 border-gray-200"
                >
                  <span className="text-3xl">ℹ️</span>
                  <span className="text-xl">Über uns</span>
                </Link>
                <Link
                  href="/#contact"
                  onClick={(e) => handleScrollToSection(e, '/#contact')}
                  className="flex items-center gap-4 text-gray-900 font-bold py-4 px-5 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation border-2 border-gray-200"
                >
                  <span className="text-3xl">📞</span>
                  <span className="text-xl">Kontakt</span>
                </Link>

                {/* Primary CTA */}
                <div className="pt-4">
                  <Link
                    href="/menu"
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-orange-500 text-white py-5 px-6 rounded-xl font-bold text-xl shadow-xl active:scale-[0.98] transition-transform touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Jetzt bestellen</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </nav>

              {/* Contact Info */}
              <div className="border-t-2 border-gray-200 px-6 py-5 bg-gray-50 flex-shrink-0">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-3">Kontakt</p>
                <a href="tel:+493012345678" className="flex items-center gap-3 text-base text-gray-900 mb-3 font-semibold touch-manipulation py-2">
                  <span className="text-2xl">📞</span>
                  <span>+49 30 12345678</span>
                </a>
                <a href="mailto:hallo@nghiademo.com" className="flex items-center gap-3 text-base text-gray-900 font-semibold touch-manipulation py-2">
                  <span className="text-2xl">✉️</span>
                  <span>hallo@nghiademo.com</span>
                </a>
              </div>
            </div>
          </div>
      </>
    </header>
  )
}
