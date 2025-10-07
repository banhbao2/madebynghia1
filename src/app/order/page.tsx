'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MenuItem from '@/components/MenuItem'
import CartSidebar from '@/components/CartSidebar'
import { menuItems, categories } from '@/lib/menuData'
import { useCart } from '@/context/CartContext'

export default function OrderPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { setIsCartOpen, itemCount } = useCart()

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Floating Cart Button */}
      {itemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-red-600 text-white rounded-full w-16 h-16 shadow-lg hover:bg-red-700 transition-all hover:scale-110 z-30 flex items-center justify-center"
          aria-label="View cart"
        >
          <div className="relative">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          </div>
        </button>
      )}

      <main className="container mx-auto px-4 py-12 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Order Online
          </h1>
          <p className="text-lg text-gray-600">
            Choose from our delicious selection of Vietnamese and Japanese cuisine
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-3 justify-center min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-md">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-semibold text-gray-900 mb-1">Free Delivery</h3>
              <p className="text-sm text-gray-600">On orders over $30</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⏱️</div>
              <h3 className="font-semibold text-gray-900 mb-1">Fast Preparation</h3>
              <p className="text-sm text-gray-600">Ready in 20-30 minutes</p>
            </div>
            <div>
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-semibold text-gray-900 mb-1">Fresh Ingredients</h3>
              <p className="text-sm text-gray-600">Made to order daily</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}