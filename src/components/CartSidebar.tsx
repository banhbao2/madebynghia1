'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import CartItem from './CartItem'
import { useState, useRef } from 'react'

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

      {/* Sidebar */}
      <div
        ref={cartRef}
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          transform: isDragging && isCartOpen
            ? `translateY(${dragOffset}px)`
            : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col h-full">
          {/* Swipe Indicator (Mobile) */}
          <div className="md:hidden flex justify-center py-2 bg-gray-50">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Ihr Warenkorb ({itemCount})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Warenkorb schließen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-lg font-medium">Ihr Warenkorb ist leer</p>
                <p className="text-sm mt-1">Fügen Sie leckere Artikel hinzu, um zu beginnen!</p>
              </div>
            ) : (
              <div className="space-y-0">
                {items.map((item) => (
                  <CartItem key={item.cartItemId} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer - Totals and Checkout */}
          {items.length > 0 && (
            <div className="border-t p-4 bg-gradient-to-b from-gray-50 to-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Zwischensumme</span>
                  <span className="font-semibold">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>MwSt (8,75%)</span>
                  <span className="font-semibold">{tax.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2">
                  <span>Gesamt</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-4 rounded-xl hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] active:scale-95 transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                <span>Zur Kasse</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
