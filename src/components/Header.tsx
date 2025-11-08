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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-luxury ${
      isScrolled
        ? 'bg-white/98 backdrop-blur-xl shadow-luxury border-b border-[var(--neutral-200)]'
        : 'bg-white/90 backdrop-blur-lg border-b border-[var(--neutral-100)]'
    }`}>
      <div className="container mx-auto px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between">
        {/* Logo - Luxury Typography */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-playfair font-semibold tracking-tight text-[var(--foreground)] hover:text-[var(--gold)] transition-luxury touch-manipulation group"
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">🍜</span>
            <span>Nghia Demo</span>
          </span>
        </Link>

        {/* Desktop Navigation - Minimalist & Sophisticated */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          <Link
            href="/menu"
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-poppins font-medium text-sm tracking-wide uppercase transition-luxury relative group"
          >
            Speisekarte
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--gold)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/menu2"
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-poppins font-medium text-sm tracking-wide uppercase transition-luxury relative group"
          >
            Menu 2
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--gold)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/reservations"
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-poppins font-medium text-sm tracking-wide uppercase transition-luxury relative group"
          >
            Reservierung
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--gold)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/#about"
            onClick={(e) => handleScrollToSection(e, '/#about')}
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-poppins font-medium text-sm tracking-wide uppercase transition-luxury relative group"
          >
            Über uns
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--gold)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/#contact"
            onClick={(e) => handleScrollToSection(e, '/#contact')}
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-poppins font-medium text-sm tracking-wide uppercase transition-luxury relative group"
          >
            Kontakt
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--gold)] group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Luxury CTA Button */}
          <Link
            href="/menu"
            className="bg-[var(--primary)] text-white px-6 xl:px-8 py-3 rounded-lg font-poppins font-medium text-sm tracking-wide uppercase hover:bg-[var(--primary-hover)] transition-luxury transform hover:-translate-y-0.5 shadow-luxury hover:shadow-luxury-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Jetzt bestellen
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>
        </nav>

        {/* Mobile Menu Button - Minimalist */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[var(--foreground)] p-2 -mr-2 touch-manipulation active:scale-95 transition-transform"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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

        {/* Luxury Mobile Menu Panel */}
        <div
          className={`fixed inset-0 bg-[var(--background)] z-50 lg:hidden transition-transform duration-500 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
            <div className="flex flex-col h-full">
              {/* Elegant Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍜</span>
                  <span className="text-xl font-playfair font-semibold text-white tracking-tight">Navigation</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white/80 hover:text-white touch-manipulation active:scale-95 transition rounded-lg hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Minimalist Navigation Links */}
              <nav className="flex flex-col justify-center flex-1 px-6 py-8 space-y-1">
                <Link
                  href="/menu"
                  className="group py-5 px-5 rounded-lg hover:bg-[var(--background-alt)] active:bg-[var(--neutral-100)] transition-luxury touch-manipulation border-b border-[var(--neutral-200)] last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">🍽️</span>
                      <span className="text-lg font-poppins font-medium text-[var(--foreground)] tracking-wide">Speisekarte</span>
                    </div>
                    <svg className="w-5 h-5 text-[var(--gold)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
                <Link
                  href="/menu2"
                  className="group py-5 px-5 rounded-lg hover:bg-[var(--background-alt)] active:bg-[var(--neutral-100)] transition-luxury touch-manipulation border-b border-[var(--neutral-200)] last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">📋</span>
                      <span className="text-lg font-poppins font-medium text-[var(--foreground)] tracking-wide">Menu 2</span>
                    </div>
                    <svg className="w-5 h-5 text-[var(--gold)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
                <Link
                  href="/reservations"
                  className="group py-5 px-5 rounded-lg hover:bg-[var(--background-alt)] active:bg-[var(--neutral-100)] transition-luxury touch-manipulation border-b border-[var(--neutral-200)] last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">📅</span>
                      <span className="text-lg font-poppins font-medium text-[var(--foreground)] tracking-wide">Reservierung</span>
                    </div>
                    <svg className="w-5 h-5 text-[var(--gold)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
                <Link
                  href="/#about"
                  onClick={(e) => handleScrollToSection(e, '/#about')}
                  className="group py-5 px-5 rounded-lg hover:bg-[var(--background-alt)] active:bg-[var(--neutral-100)] transition-luxury touch-manipulation border-b border-[var(--neutral-200)] last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">ℹ️</span>
                      <span className="text-lg font-poppins font-medium text-[var(--foreground)] tracking-wide">Über uns</span>
                    </div>
                    <svg className="w-5 h-5 text-[var(--gold)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
                <Link
                  href="/#contact"
                  onClick={(e) => handleScrollToSection(e, '/#contact')}
                  className="group py-5 px-5 rounded-lg hover:bg-[var(--background-alt)] active:bg-[var(--neutral-100)] transition-luxury touch-manipulation border-b border-[var(--neutral-200)] last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">📞</span>
                      <span className="text-lg font-poppins font-medium text-[var(--foreground)] tracking-wide">Kontakt</span>
                    </div>
                    <svg className="w-5 h-5 text-[var(--gold)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                {/* Luxury CTA */}
                <div className="pt-6">
                  <Link
                    href="/menu"
                    className="flex items-center justify-center gap-3 bg-[var(--primary)] text-white py-5 px-6 rounded-lg font-poppins font-medium text-base tracking-wide uppercase shadow-luxury-lg active:scale-[0.98] transition-luxury touch-manipulation relative overflow-hidden group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">Jetzt bestellen</span>
                    <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                </div>
              </nav>

              {/* Refined Contact Info */}
              <div className="border-t border-[var(--neutral-200)] px-6 py-6 bg-[var(--background-alt)] flex-shrink-0">
                <p className="text-xs uppercase tracking-widest text-[var(--foreground-muted)] font-poppins font-medium mb-4">Kontakt</p>
                <a href="tel:+493012345678" className="flex items-center gap-3 text-base text-[var(--foreground)] mb-3 font-poppins font-medium touch-manipulation py-2 hover:text-[var(--gold)] transition-luxury">
                  <span className="text-xl">📞</span>
                  <span>+49 30 12345678</span>
                </a>
                <a href="mailto:hallo@nghiademo.com" className="flex items-center gap-3 text-base text-[var(--foreground)] font-poppins font-medium touch-manipulation py-2 hover:text-[var(--gold)] transition-luxury">
                  <span className="text-xl">✉️</span>
                  <span>hallo@nghiademo.com</span>
                </a>
              </div>
            </div>
          </div>
      </>
    </header>
  )
}
