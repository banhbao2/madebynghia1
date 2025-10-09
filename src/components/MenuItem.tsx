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

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'pho': return '🍜'
      case 'sushi': return '🍣'
      case 'appetizers': return '🥟'
      case 'drinks': return '🥤'
      default: return '🍽️'
    }
  }

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'pho': return 'from-orange-50 to-red-50 border-red-600'
      case 'sushi': return 'from-blue-50 to-cyan-50 border-cyan-600'
      case 'appetizers': return 'from-amber-50 to-yellow-50 border-yellow-600'
      case 'drinks': return 'from-purple-50 to-pink-50 border-pink-600'
      default: return 'from-gray-50 to-gray-100 border-gray-600'
    }
  }

  return (
    <div className={`bg-gradient-to-br ${getCategoryColor(item.category)} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 p-6`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{getCategoryIcon(item.category)}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
            {item.popular && (
              <span className="inline-block mt-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                ⭐ Popular
              </span>
            )}
          </div>
        </div>
        <span className="text-3xl font-extrabold text-red-600">
          ${item.price.toFixed(2)}
        </span>
      </div>

      <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>

      {!showCustomizations ? (
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add to Cart
        </button>
      ) : null}

      {/* Customization Options */}
      {showCustomizations && item.customizations && (
        <div className="mt-4 pt-4 border-t-2 border-white/50 space-y-4">
          <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <span>⚙️</span> Customize Your Order
          </h4>

          {item.customizations.map((custom) => (
            <div key={custom.label}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {custom.label}
              </label>
              <select
                value={customizations[custom.label] || custom.options[0]}
                onChange={(e) => handleCustomizationChange(custom.label, e.target.value)}
                className="w-full border-2 border-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white shadow-md"
              >
                {custom.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowCustomizations(false)
                setCustomizations({})
              }}
              className="flex-1 border-2 border-white bg-white/80 text-gray-700 px-5 py-3 rounded-xl hover:bg-white transition font-bold shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition font-bold shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
