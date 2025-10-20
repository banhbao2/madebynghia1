'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import CartItem from './CartItem'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui'

export default function CartSidebar() {
  const router = useRouter()
  const { items, isCartOpen, setIsCartOpen, subtotal, tax, total, itemCount } = useCart()
  const [touchStart, setTouchStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const cartRef = useRef<HTMLDivElement>(null)

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentTouch = e.touches[0].clientY
    const diff = currentTouch - touchStart

    // Only allow downward swipe
    if (diff > 0) {
      setDragOffset(diff)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    // If swiped down more than 100px, close the cart
    if (dragOffset > 100) {
      setIsCartOpen(false)
    }

    // Reset
    setDragOffset(0)
    setTouchStart(0)
  }

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsCartOpen(false)
    }
  }

  // Navigate to checkout page
  const handleCheckout = () => {
    setIsCartOpen(false)
    router.push('/checkout')
  }

  return (
    <>
      {/* Backdrop - Only show on mobile */}
      {isCartOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar - Bottom sheet on mobile, side panel on desktop */}
      <div
        ref={cartRef}
        className={`fixed bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
          md:right-0 md:top-0 md:h-full md:w-96
          left-0 right-0 bottom-0 rounded-t-3xl md:rounded-none
          ${isCartOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
        style={{
          transform: isDragging && isCartOpen
            ? `translateY(${dragOffset}px)`
            : undefined,
          maxHeight: 'calc(100vh - 60px)', // Leave space for status bar on mobile
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col h-full max-h-full">
          {/* Swipe Indicator (Mobile) */}
          <div className="md:hidden flex justify-center py-3 bg-gray-50 rounded-t-3xl flex-shrink-0">
            <div className="w-16 h-1.5 bg-gray-400 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b flex-shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Ihr Warenkorb ({itemCount})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition p-2 hover:bg-gray-100 rounded-lg touch-manipulation active:scale-95"
              aria-label="Warenkorb schließen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart items - Scrollable area */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-5" style={{ WebkitOverflowScrolling: 'touch' }}>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-lg font-medium">Ihr Warenkorb ist leer</p>
                <p className="text-sm mt-1 text-center px-4">Fügen Sie leckere Artikel hinzu, um zu beginnen!</p>
              </div>
            ) : (
              <div className="space-y-0 pb-4">
                {items.map((item) => (
                  <CartItem key={item.cartItemId} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer - Totals and Checkout - Fixed at bottom */}
          {items.length > 0 && (
            <div className="border-t p-4 md:p-5 bg-gradient-to-b from-gray-50 to-white flex-shrink-0 safe-bottom">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Zwischensumme</span>
                  <span className="font-semibold">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>MwSt (19%)</span>
                  <span className="font-semibold">{tax.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-xl md:text-2xl font-bold text-gray-900 pt-3 border-t-2">
                  <span>Gesamt</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                variant="primary"
                size="lg"
                fullWidth
                className="shadow-lg touch-manipulation"
              >
                <span>Zur Kasse</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
