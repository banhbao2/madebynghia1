'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function FloatingCartButton() {
  const { itemCount, total } = useCart()
  const router = useRouter()
  const [justAdded, setJustAdded] = useState(false)
  const [prevItemCount, setPrevItemCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Check if component is mounted (client-side only)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show animation when item is added
  useEffect(() => {
    if (itemCount > prevItemCount && itemCount > 0) {
      setJustAdded(true)
      const timer = setTimeout(() => setJustAdded(false), 1000)
      return () => clearTimeout(timer)
    }
    setPrevItemCount(itemCount)
  }, [itemCount, prevItemCount])

  const handleCartClick = () => {
    router.push('/cart')
  }

  if (!mounted || itemCount === 0) {
    return null // Hide button when cart is empty or not mounted
  }

  const buttons = (
    <>
      {/* Mobile Floating Button - Fixed at bottom right, stays in place */}
      <button
        onClick={handleCartClick}
        className="md:hidden w-14 h-14 bg-gradient-to-br from-red-600 to-orange-500 text-white rounded-full shadow-[0_8px_30px_rgba(220,38,38,0.4)] flex items-center justify-center"
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1rem',
          zIndex: 9999,
          touchAction: 'manipulation',
          transform: justAdded ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s ease'
        }}
        aria-label="Warenkorb öffnen"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span
            className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
            style={{
              transform: justAdded ? 'scale(1.25)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }}
          >
            {itemCount}
          </span>
        </div>
      </button>

      {/* Desktop/Tablet Floating Button - Bottom Right */}
      <button
        onClick={handleCartClick}
        className={`hidden md:flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-xl transition-all ${
          justAdded ? 'scale-110' : ''
        }`}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999
        }}
        aria-label="Warenkorb öffnen"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        </div>
        <span className="font-bold">{total.toFixed(2)}€</span>
      </button>
    </>
  )

  // Render using portal to ensure it's at body level
  return createPortal(buttons, document.body)
}
