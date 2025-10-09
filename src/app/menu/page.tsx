'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartSidebar from '@/components/CartSidebar'
import MenuItem from '@/components/MenuItem'
import { MenuItem as MenuItemType, Category } from '@/lib/menuData'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setIsCartOpen, itemCount } = useCart()
  const searchParams = useSearchParams()

  // QR Code support: Get table number from URL
  const tableNumber = searchParams.get('table')

  // Fetch menu items and categories from Supabase
  useEffect(() => {
    async function fetchMenuData() {
      try {
        setLoading(true)

        // Fetch menu items
        const { data: items, error: itemsError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true)
          .order('sort_order')

        if (itemsError) throw itemsError

        // Fetch categories
        const { data: cats, error: catsError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')

        if (catsError) throw catsError

        setMenuItems(items || [])
        setCategories(cats || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching menu data:', err)
        setError('Failed to load menu. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory)

  const popularItems = menuItems.filter(item => item.popular)

  // Store table number for checkout if provided
  useEffect(() => {
    if (tableNumber) {
      sessionStorage.setItem('tableNumber', tableNumber)
    }
  }, [tableNumber])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading menu...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Reload Page
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Floating Cart Button (Mobile & Desktop) */}
      {itemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full w-20 h-20 shadow-2xl hover:shadow-red-500/50 hover:scale-110 z-30 flex items-center justify-center transition-all animate-pulse"
          aria-label="View cart"
        >
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-3 -right-3 bg-white text-red-600 text-sm font-extrabold rounded-full w-7 h-7 flex items-center justify-center shadow-lg ring-2 ring-white">
              {itemCount}
            </span>
          </div>
        </button>
      )}

      <main className="container mx-auto px-4 py-16 pb-32">
        {/* Header */}
        <div className="text-center mb-16">
          {tableNumber && (
            <div className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full font-bold text-lg mb-4 shadow-lg">
              🍽️ Table {tableNumber}
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Our Menu
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our delicious selection of authentic Vietnamese Phở and Japanese Sushi,
            crafted fresh daily with the finest ingredients
          </p>
          {!tableNumber && itemCount === 0 && (
            <div className="mt-6 inline-flex items-center gap-2 text-gray-500 text-sm">
              <span>💡</span>
              <span>Tap any item to add it to your cart</span>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-12 overflow-x-auto pb-2 sticky top-[73px] z-20 bg-gradient-to-b from-[#FFFBF5] via-[#FFFBF5] to-transparent pt-4 pb-6">
          <div className="flex gap-4 justify-center min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-8 py-3.5 rounded-xl font-bold transition-all whitespace-nowrap text-lg ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white shadow-xl scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-50 shadow-md hover:shadow-lg border border-orange-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Items Section - Now with ordering! */}
        {selectedCategory === 'all' && popularItems.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-4xl">⭐</span> Popular Favorites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Menu Items by Category */}
        <div className="space-y-12">
          {selectedCategory === 'all' ? (
            // Show all categories
            categories.slice(1).map((category) => {
              const categoryItems = menuItems.filter(item => item.category === category.id)
              return (
                <section key={category.id}>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-5xl">
                      {category.id === 'pho' ? '🍜' : category.id === 'sushi' ? '🍣' : category.id === 'appetizers' ? '🥟' : '🥤'}
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900">
                      {category.name}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryItems.map((item) => (
                      <MenuItem key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )
            })
          ) : (
            // Show selected category
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-10 shadow-lg border border-orange-100">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="font-bold text-gray-900 mb-2 text-xl">Free Delivery</h3>
              <p className="text-gray-600">On orders over $30</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="font-bold text-gray-900 mb-2 text-xl">Fast Preparation</h3>
              <p className="text-gray-600">Ready in 20-30 minutes</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="font-bold text-gray-900 mb-2 text-xl">Fresh Ingredients</h3>
              <p className="text-gray-600">Made to order daily</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}