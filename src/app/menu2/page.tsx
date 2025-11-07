'use client'

import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SmartLoading from '@/components/SmartLoading'
import { MenuItem as MenuItemType, Category } from '@/lib/menuData'
import { supabase } from '@/lib/supabase'

export default function Menu2Page() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError('Fehler beim Laden des Menüs. Bitte laden Sie die Seite neu.')
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  // Category filtering
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') {
      return menuItems
    }
    return menuItems.filter(item => item.category === selectedCategory)
  }, [menuItems, selectedCategory])

  // Group items by category for display
  const itemsByCategory = useMemo(() => {
    const grouped = new Map<string, MenuItemType[]>()

    if (selectedCategory === 'all') {
      // Group by all categories
      categories.slice(1).forEach(cat => {
        const items = menuItems.filter(item => item.category === cat.id)
        if (items.length > 0) {
          grouped.set(cat.id, items)
        }
      })
    } else {
      // Only show selected category
      const cat = categories.find(c => c.id === selectedCategory)
      if (cat) {
        grouped.set(cat.id, filteredItems)
      }
    }

    return grouped
  }, [menuItems, categories, selectedCategory, filteredItems])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="pt-[60px] md:pt-[68px]">
          <main className="container mx-auto px-4">
            <SmartLoading context="menu" size="lg" />
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-[60px] md:pt-[68px]">
          <main className="container mx-auto px-4 py-16">
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hoppla!</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Seite neu laden
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="pt-[60px] md:pt-[68px]">
        <main id="main" className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Speisekarte
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Einfache Übersicht unserer Gerichte - perfekt für klassische Restaurant-Websites
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-10 overflow-x-auto pb-2 sticky top-[73px] z-20 bg-gradient-to-b from-gray-50 via-gray-50 to-transparent pt-4 pb-6">
            <div className="flex gap-3 justify-center min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-red-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="max-w-4xl mx-auto space-y-12">
            {Array.from(itemsByCategory.entries()).map(([categoryId, items]) => {
              const category = categories.find(c => c.id === categoryId)
              if (!category) return null

              return (
                <section key={categoryId} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <span className="text-3xl">
                        {categoryId === 'pho' ? '🍜' : categoryId === 'sushi' ? '🍣' : categoryId === 'appetizers' ? '🥟' : '🥤'}
                      </span>
                      {category.name}
                    </h2>
                  </div>

                  {/* Menu Items List */}
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="px-6 py-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {item.name}
                              </h3>
                              {item.popular && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                  ⭐ Beliebt
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-xl font-bold text-red-600">
                              {item.price.toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Keine Artikel in dieser Kategorie gefunden.</p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg border border-orange-100 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hinweis zur Demo
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Dies ist eine vereinfachte Speisekartenansicht ohne Bestellsystem und Bilder.
                Perfekt für Restaurants, die nur ihre Gerichte präsentieren möchten.
                Die Hauptmenüseite mit vollem Bestellsystem finden Sie <a href="/menu" className="text-red-600 font-semibold hover:text-red-700 underline">hier</a>.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
