'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CartIcon } from './Icons'

export default function FloatingCartButton() {
  const { itemCount, total } = useCart()
  const router = useRouter()
  const [justAdded, setJustAdded] = useState(false)
  const [prevItemCount, setPrevItemCount] = useState(0)

  // Show animation when item is added
  useEffect(() => {
    if (itemCount > prevItemCount && itemCount > 0) {
      setJustAdded(true)
      const timer = setTimeout(() => setJustAdded(false), 1000)
      return () => clearTimeout(timer)
    }
    setPrevItemCount(itemCount)
  }, [itemCount, prevItemCount])

  if (itemCount === 0) {
    return null
  }

  const handleCartClick = () => {
    router.push('/cart')
  }

  return (
    <>
      {/* Mobile Floating Button */}
      <button
        onClick={handleCartClick}
        className="md:hidden fixed bottom-24 right-4 z-[9999] w-14 h-14 bg-gradient-to-br from-red-600 to-orange-500 text-white rounded-full shadow-lg flex items-center justify-center"
        style={{ transform: justAdded ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s ease' }}
        aria-label="Warenkorb öffnen"
      >
        <div className="relative">
          <CartIcon />
          <span
            className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
            style={{ transform: justAdded ? 'scale(1.25)' : 'scale(1)', transition: 'transform 0.2s ease' }}
          >
            {itemCount}
          </span>
        </div>
      </button>

      {/* Desktop/Tablet Floating Button */}
      <button
        onClick={handleCartClick}
        className="hidden md:flex fixed bottom-8 right-8 z-[9999] items-center gap-3 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-xl transition-all"
        style={{ transform: justAdded ? 'scale(1.1)' : 'scale(1)' }}
        aria-label="Warenkorb öffnen"
      >
        <div className="relative">
          <CartIcon />
          <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        </div>
        <span className="font-bold">{total.toFixed(2)}€</span>
      </button>
    </>
  )
}
