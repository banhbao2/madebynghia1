'use client'

import { useState } from 'react'
import { MenuItem as MenuItemType } from '@/lib/menuData'
import { useCart } from '@/context/CartContext'
import { PlusIcon, CheckIcon } from './Icons'

interface MenuItemProps {
  item: MenuItemType
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useCart()
  const [showCustomizations, setShowCustomizations] = useState(false)
  const [customizations, setCustomizations] = useState<Record<string, string>>({})
  const [imageError, setImageError] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = () => {
    // Check if item has customizations AND they are not empty
    const hasCustomizations = item.customizations && item.customizations.length > 0

    if (hasCustomizations && !showCustomizations) {
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

      // Show success feedback (1.5s is optimal - noticeable but not blocking)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 1500)
    }
  }

  const handleCustomizationChange = (label: string, value: string) => {
    setCustomizations(prev => ({ ...prev, [label]: value }))
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      pho: '🍜',
      sushi: '🍣',
      appetizers: '🥟',
      drinks: '🥤'
    }
    return icons[category] || '🍽️'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
      <div className="flex gap-3 p-3">
        {/* Image Section - Compact square on left */}
        {item.image && !imageError ? (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            {item.popular && (
              <div className="absolute top-1 left-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                ⭐
              </div>
            )}
          </div>
        ) : (
          <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <span className="text-3xl">{getCategoryIcon(item.category)}</span>
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-900 leading-tight">{item.name}</h3>
              {item.popular && !item.image && (
                <span className="text-xs">⭐</span>
              )}
            </div>
            <p className="text-xs text-gray-600 leading-snug line-clamp-2 mb-2">{item.description}</p>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-lg font-bold text-red-600">
              {item.price.toFixed(2)}€
            </span>

            {!showCustomizations ? (
              <button
                onClick={handleAddToCart}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold text-sm ${
                  justAdded
                    ? 'bg-green-600 text-white scale-105'
                    : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                }`}
              >
                {justAdded ? (
                  <>
                    <CheckIcon />
                    <span className="hidden sm:inline">Hinzugefügt</span>
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    <span className="hidden sm:inline">Hinzufügen</span>
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Customization Options - Expanded Section */}
      {showCustomizations && item.customizations && (
        <div className="px-3 pb-3 border-t border-gray-200 pt-3 space-y-3 bg-gray-50">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <span>⚙️</span> Bestellung anpassen
          </h4>

          {item.customizations.map((custom) => (
            <div key={custom.label}>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {custom.label}
              </label>
              <select
                value={customizations[custom.label] || custom.options[0]}
                onChange={(e) => handleCustomizationChange(custom.label, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                {custom.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                setShowCustomizations(false)
                setCustomizations({})
              }}
              className="flex-1 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-bold text-sm"
              disabled={justAdded}
            >
              Abbrechen
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex-1 px-4 py-2 rounded-lg transition-all font-bold text-sm flex items-center justify-center gap-1.5 ${
                justAdded
                  ? 'bg-green-600 text-white scale-105'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              disabled={justAdded}
            >
              {justAdded ? (
                <>
                  <CheckIcon />
                  Hinzugefügt
                </>
              ) : (
                'Hinzufügen'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
