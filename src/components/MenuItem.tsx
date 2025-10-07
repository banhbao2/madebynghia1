'use client'

import { useState } from 'react'
import { MenuItem as MenuItemType } from '@/lib/menuData'
import { useCart } from '@/context/CartContext'

interface MenuItemProps {
  item: MenuItemType
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useCart()
  const [showCustomizations, setShowCustomizations] = useState(false)
  const [customizations, setCustomizations] = useState<Record<string, string>>({})

  const handleAddToCart = () => {
    if (item.customizations && !showCustomizations) {
      // Show customization options first
      setShowCustomizations(true)
      // Initialize default selections
      const defaults: Record<string, string> = {}
      item.customizations.forEach(custom => {
        defaults[custom.label] = custom.options[0]
      })
      setCustomizations(defaults)
    } else {
      // Add to cart with or without customizations
      addToCart(item, Object.keys(customizations).length > 0 ? customizations : undefined)
      setShowCustomizations(false)
      setCustomizations({})
    }
  }

  const handleCustomizationChange = (label: string, value: string) => {
    setCustomizations(prev => ({ ...prev, [label]: value }))
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
        <span className="text-6xl">🍜</span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
          {item.popular && (
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-red-600">
            ${item.price.toFixed(2)}
          </span>

          {!showCustomizations ? (
            <button
              onClick={handleAddToCart}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add
            </button>
          ) : null}
        </div>

        {/* Customization Options */}
        {showCustomizations && item.customizations && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">Customize Your Order</h4>

            {item.customizations.map((custom) => (
              <div key={custom.label}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {custom.label}
                </label>
                <select
                  value={customizations[custom.label] || custom.options[0]}
                  onChange={(e) => handleCustomizationChange(custom.label, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {custom.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowCustomizations(false)
                  setCustomizations({})
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
