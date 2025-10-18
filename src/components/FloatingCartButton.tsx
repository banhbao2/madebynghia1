'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CartIcon } from './Icons'

/**
 * Floating cart button that stays fixed on screen
 * Positioned at bottom-right on both mobile and desktop
 * Shows cart item count and total price
 */
export default function FloatingCartButton() {
  const { itemCount, total } = useCart()
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCount, setPrevCount] = useState(0)

  // Animate when items are added
  useEffect(() => {
    if (itemCount > prevCount && itemCount > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
    setPrevCount(itemCount)
  }, [itemCount, prevCount])

  // Don't render if cart is empty
  if (itemCount === 0) return null

  const handleClick = () => router.push('/cart')

  return (
    <>
      {/* Mobile Button - Compact circular */}
      <button
        onClick={handleClick}
        className={`
          md:hidden
          fixed
          bottom-6
          right-4
          z-[9999]
          w-14
          h-14
          rounded-full
          bg-gradient-to-br
          from-red-600
          to-orange-500
          text-white
          shadow-lg
          hover:shadow-xl
          flex
          items-center
          justify-center
          transition-transform
          duration-200
          ${isAnimating ? 'scale-110' : 'scale-100'}
        `}
        aria-label={`Warenkorb mit ${itemCount} ${itemCount === 1 ? 'Artikel' : 'Artikeln'}`}
      >
        <div className="relative">
          <CartIcon />
          <span
            className={`
              absolute
              -top-2
              -right-2
              bg-white
              text-red-600
              text-xs
              font-bold
              rounded-full
              w-5
              h-5
              flex
              items-center
              justify-center
              shadow-md
              transition-transform
              duration-200
              ${isAnimating ? 'scale-125' : 'scale-100'}
            `}
          >
            {itemCount}
          </span>
        </div>
      </button>

      {/* Desktop Button - Expanded with price */}
      <button
        onClick={handleClick}
        className={`
          hidden
          md:flex
          fixed
          bottom-6
          right-6
          z-[9999]
          items-center
          gap-3
          px-6
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-red-600
          to-orange-500
          text-white
          shadow-2xl
          hover:shadow-3xl
          transition-transform
          duration-200
          ${isAnimating ? 'scale-105' : 'scale-100'}
        `}
        aria-label={`Warenkorb mit ${itemCount} ${itemCount === 1 ? 'Artikel' : 'Artikeln'} - ${total.toFixed(2)}€`}
      >
        <div className="relative">
          <CartIcon />
          <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        </div>
        <span className="font-bold text-lg">{total.toFixed(2)}€</span>
      </button>
    </>
  )
}
