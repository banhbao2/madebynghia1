'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo - Clickable to home */}
        <Link href="/" className="text-2xl font-extrabold text-gray-900 hover:text-red-600 transition">
          🍜 Pho & Sushi
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/menu"
            className="text-gray-700 hover:text-gray-900 font-medium transition"
          >
            Menu
          </Link>
          <Link
            href="/#about"
            onClick={(e) => handleScrollToSection(e, '/#about')}
            className="text-gray-700 hover:text-gray-900 font-medium transition"
          >
            About
          </Link>
          <Link
            href="/#contact"
            onClick={(e) => handleScrollToSection(e, '/#contact')}
            className="text-gray-700 hover:text-gray-900 font-medium transition"
          >
            Contact
          </Link>
          <Link
            href="/order"
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
          >
            Order Now →
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-900"
          aria-label="Toggle menu"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/menu"
              className="text-gray-700 hover:text-gray-900 transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/#about"
              onClick={(e) => handleScrollToSection(e, '/#about')}
              className="text-gray-700 hover:text-gray-900 transition py-2"
            >
              About
            </Link>
            <Link
              href="/#contact"
              onClick={(e) => handleScrollToSection(e, '/#contact')}
              className="text-gray-700 hover:text-gray-900 transition py-2"
            >
              Contact
            </Link>
            <Link
              href="/order"
              className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition text-center shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Order Now →
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}