'use client'

import { useState, useRef } from 'react'
import { MenuItem as MenuItemType } from '@/lib/menuData'
import { useCart } from '@/context/CartContext'
import { PlusIcon, CheckIcon } from './Icons'
import { Button } from '@/components/ui'
import { useConfetti } from '@/hooks/useConfetti'

interface MenuItemProps {
  item: MenuItemType
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useCart()
  const { fromElement } = useConfetti()
  const buttonRef = useRef<HTMLButtonElement>(null)
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
      // OPTIMISTIC UI: Add to cart instantly (no waiting!)
      addToCart(item, Object.keys(customizations).length > 0 ? customizations : undefined)
      setShowCustomizations(false)
      setCustomizations({})

      // Celebration confetti from button position (dopamine hit!)
      if (buttonRef.current) {
        fromElement(buttonRef.current, 'subtle')
      }

      // Show success feedback (reduced from 1.5s to 800ms - faster perceived performance)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 800)
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
    <div className="bg-white rounded-xl shadow-luxury hover:shadow-luxury-lg transition-luxury border border-[var(--neutral-100)] overflow-hidden group">
      <div className="flex gap-4 p-4 md:p-5">
        {/* Image Section - Luxury square on left */}
        {item.image && !imageError ? (
          <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--neutral-100)]">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
            {item.popular && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] text-[var(--primary)] px-2 py-1 rounded text-xs font-poppins font-semibold shadow-gold">
                ⭐
              </div>
            )}
          </div>
        ) : (
          <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-lg bg-gradient-to-br from-[var(--neutral-50)] to-[var(--neutral-100)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <span className="text-4xl">{getCategoryIcon(item.category)}</span>
          </div>
        )}

        {/* Content Section - Luxury */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-base md:text-lg font-playfair font-semibold text-[var(--primary)] leading-tight">{item.name}</h3>
              {item.popular && !item.image && (
                <span className="text-[var(--gold)] text-sm">⭐</span>
              )}
            </div>
            <p className="text-xs md:text-sm text-[var(--foreground-muted)] font-inter leading-relaxed line-clamp-2 mb-3">{item.description}</p>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-lg md:text-xl font-playfair font-semibold text-[var(--gold)]">
              {item.price.toFixed(2)}€
            </span>

            {!showCustomizations ? (
              <Button
                ref={buttonRef}
                onClick={handleAddToCart}
                variant={justAdded ? 'success' : 'primary'}
                size="sm"
                className={justAdded ? 'scale-105' : ''}
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
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Customization Options - Luxury Expanded Section */}
      {showCustomizations && item.customizations && (
        <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-[var(--neutral-200)] pt-4 md:pt-5 space-y-4 bg-[var(--neutral-50)]">
          <h4 className="font-playfair font-semibold text-[var(--primary)] text-sm md:text-base flex items-center gap-2">
            <span className="text-[var(--gold)]">⚙️</span> Bestellung anpassen
          </h4>

          {item.customizations.map((custom) => (
            <div key={custom.label}>
              <label className="block text-xs md:text-sm font-poppins font-medium text-[var(--foreground-muted)] mb-2">
                {custom.label}
              </label>
              <select
                value={customizations[custom.label] || custom.options[0]}
                onChange={(e) => handleCustomizationChange(custom.label, e.target.value)}
                className="w-full border border-[var(--neutral-200)] rounded-lg px-4 py-3 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-[var(--gold)] bg-white transition-luxury shadow-sm"
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
            <Button
              onClick={() => {
                setShowCustomizations(false)
                setCustomizations({})
              }}
              variant="secondary"
              size="sm"
              fullWidth
              disabled={justAdded}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleAddToCart}
              variant={justAdded ? 'success' : 'primary'}
              size="sm"
              fullWidth
              disabled={justAdded}
              className={justAdded ? 'scale-105' : ''}
            >
              {justAdded ? (
                <>
                  <CheckIcon />
                  Hinzugefügt
                </>
              ) : (
                'Hinzufügen'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
