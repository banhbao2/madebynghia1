'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { MenuItem } from '@/lib/menuData'

export interface CartItem extends MenuItem {
  quantity: number
  selectedCustomizations?: Record<string, string>
  cartItemId: string // Unique ID for cart items (allows same item with different customizations)
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: MenuItem, customizations?: Record<string, string>) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  tax: number
  total: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const TAX_RATE = 0.0875 // 8.75% tax

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = useCallback((item: MenuItem, customizations?: Record<string, string>) => {
    setItems((currentItems) => {
      // Create a unique cart item ID based on item ID and customizations
      const customizationKey = customizations
        ? Object.entries(customizations).sort().map(([k, v]) => `${k}:${v}`).join('|')
        : ''
      const cartItemId = `${item.id}-${customizationKey}`

      // Check if item with same customizations already exists
      const existingItem = currentItems.find(i => i.cartItemId === cartItemId)

      if (existingItem) {
        // Increment quantity if item exists
        return currentItems.map(i =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      } else {
        // Add new item to cart
        return [
          ...currentItems,
          {
            ...item,
            quantity: 1,
            selectedCustomizations: customizations,
            cartItemId
          }
        ]
      }
    })
    setIsCartOpen(true) // Open cart when item is added
  }, [])

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems((currentItems) => currentItems.filter(item => item.cartItemId !== cartItemId))
  }, [])

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }

    setItems((currentItems) =>
      currentItems.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        tax,
        total,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
