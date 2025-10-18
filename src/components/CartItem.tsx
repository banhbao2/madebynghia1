'use client'

import { CartItem as CartItemType } from '@/context/CartContext'
import { useCart } from '@/context/CartContext'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-3 py-4 border-b border-gray-200">
      {/* Image placeholder */}
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">🍜</span>
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)}</p>

        {/* Customizations */}
        {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
          <div className="mt-1 space-y-0.5">
            {Object.entries(item.selectedCustomizations).map(([label, value]) => (
              <p key={label} className="text-xs text-gray-500">
                {label}: <span className="font-medium">{value}</span>
              </p>
            ))}
          </div>
        )}

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
            className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            aria-label="Decrease quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <span className="w-8 text-center font-medium">{item.quantity}</span>

          <button
            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
            className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            aria-label="Increase quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          <button
            onClick={() => removeFromCart(item.cartItemId)}
            className="ml-auto text-red-600 hover:text-red-700 transition"
            aria-label="Remove item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Item total */}
      <div className="font-semibold text-gray-900">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  )
}
