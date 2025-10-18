'use client'

import { useCart } from '@/context/CartContext'
import { useEffect, useState } from 'react'

export default function AddToCartToast() {
  const { itemCount } = useCart()
  const [showToast, setShowToast] = useState(false)
  const [prevItemCount, setPrevItemCount] = useState(0)

  useEffect(() => {
    // Show toast only when items are added (count increases)
    if (itemCount > prevItemCount && itemCount > 0) {
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 2000)
      setPrevItemCount(itemCount)
      return () => clearTimeout(timer)
    }
    setPrevItemCount(itemCount)
  }, [itemCount, prevItemCount])

  if (!showToast) return null

  return (
    <div className="fixed top-20 md:top-24 left-4 right-4 md:left-auto md:right-6 z-[100] animate-fade-in-up pointer-events-none">
      <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md mx-auto md:mx-0">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="font-bold">In den Warenkorb hinzugefügt!</span>
      </div>
    </div>
  )
}
