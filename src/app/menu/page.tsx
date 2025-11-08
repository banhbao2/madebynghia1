'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCartButton from '@/components/FloatingCartButton'
import MenuItem from '@/components/MenuItem'
import { MenuGridSkeleton } from '@/components/MenuItemSkeleton'
import SmartLoading from '@/components/SmartLoading'
import { MenuItem as MenuItemType, Category } from '@/lib/menuData'
import { supabase } from '@/lib/supabase'

function MenuPageContent() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const popularItems = useMemo(() =>
    menuItems.filter(item => item.popular),
    [menuItems]
  )

  // Store table number for checkout if provided
  useEffect(() => {
    if (tableNumber) {
      sessionStorage.setItem('tableNumber', tableNumber)
    }
  }, [tableNumber])

  // Show loading state with smart loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="pt-[60px] md:pt-[68px]">
          <main className="container mx-auto px-6 lg:px-8">
            <SmartLoading context="menu" size="lg" />
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="pt-[60px] md:pt-[68px]">
        <main className="container mx-auto px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-playfair font-semibold text-[var(--primary)] mb-3">Hoppla!</h2>
            <p className="text-[var(--foreground-muted)] mb-8 font-inter">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[var(--primary)] text-white px-8 py-4 rounded-lg hover:bg-[var(--primary-hover)] transition-luxury shadow-luxury hover:shadow-luxury-lg font-poppins font-medium uppercase text-sm tracking-wide"
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
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Floating Cart Button */}
      <FloatingCartButton />

      <div className="pt-[60px] md:pt-[68px]">

      <main id="main" className="container mx-auto px-6 lg:px-8 py-16 md:py-20 pb-32">
        {/* Luxury Header */}
        <div className="text-center mb-16 md:mb-20">
          {tableNumber && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] text-[var(--primary)] px-6 py-3 rounded-full font-poppins font-semibold text-sm uppercase tracking-wide mb-6 shadow-gold">
              <span className="text-lg">🍽️</span>
              Tisch {tableNumber}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-semibold text-[var(--primary)] mb-6 tracking-tight">
            Unsere Speisekarte
          </h1>
          <p className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-3xl mx-auto leading-relaxed font-inter font-light">
            Entdecken Sie unsere exquisite Auswahl an authentischen asiatischen Spezialitäten,<br className="hidden md:block" />
            frisch zubereitet mit höchster Sorgfalt
          </p>
        </div>

        {/* Luxury Category Filter */}
        <div className="mb-16 overflow-x-auto pb-2 sticky top-[73px] z-20 bg-gradient-to-b from-[var(--background)] via-[var(--background)] to-transparent pt-4 pb-8">
          <div className="flex gap-3 md:gap-4 justify-center min-w-max px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 md:px-8 py-3 md:py-3.5 rounded-lg font-poppins font-medium transition-luxury whitespace-nowrap text-sm uppercase tracking-wide ${
                  selectedCategory === category.id
                    ? 'bg-[var(--primary)] text-white shadow-luxury-lg scale-105'
                    : 'bg-white text-[var(--foreground-muted)] hover:text-[var(--gold)] hover:bg-white/90 shadow-luxury hover:shadow-luxury-lg border border-[var(--neutral-200)]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Items Section - Luxury */}
        {selectedCategory === 'all' && popularItems.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-semibold text-[var(--primary)] mb-8 flex items-center gap-3">
              <span className="text-[var(--gold)] text-3xl">⭐</span> Beliebte Gerichte
            </h2>
            <div className="space-y-4">
              {popularItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Menu Items by Category - Luxury */}
        <div className="space-y-12 md:space-y-16">
          {selectedCategory === 'all' ? (
            // Show all categories
            categories.slice(1).map((category) => {
              const categoryItems = menuItems.filter(item => item.category === category.id)
              return (
                <section key={category.id}>
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl md:text-4xl">
                      {category.id === 'pho' ? '🍜' : category.id === 'sushi' ? '🍣' : category.id === 'appetizers' ? '🥟' : '🥤'}
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-semibold text-[var(--primary)]">
                      {category.name}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {categoryItems.map((item) => (
                      <MenuItem key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )
            })
          ) : (
            // Show selected category
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Empty State - Luxury */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--foreground-muted)] text-lg font-inter">Keine Artikel gefunden.</p>
          </div>
        )}

        {/* Luxury Info Section */}
        <div className="mt-20 bg-gradient-to-br from-[var(--neutral-50)] to-white rounded-2xl p-8 md:p-12 shadow-luxury border border-[var(--neutral-100)]">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-xl p-8 shadow-luxury hover:shadow-luxury-lg transition-luxury group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🚚</div>
              <h3 className="font-playfair font-semibold text-[var(--primary)] mb-3 text-xl">Kostenlose Lieferung</h3>
              <p className="text-[var(--foreground-muted)] font-inter text-sm leading-relaxed">Bei Bestellungen über 30€</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-luxury hover:shadow-luxury-lg transition-luxury group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⏱️</div>
              <h3 className="font-playfair font-semibold text-[var(--primary)] mb-3 text-xl">Schnelle Zubereitung</h3>
              <p className="text-[var(--foreground-muted)] font-inter text-sm leading-relaxed">Fertig in 20-30 Minuten</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-luxury hover:shadow-luxury-lg transition-luxury group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✨</div>
              <h3 className="font-playfair font-semibold text-[var(--primary)] mb-3 text-xl">Frische Zutaten</h3>
              <p className="text-[var(--foreground-muted)] font-inter text-sm leading-relaxed">Täglich frisch zubereitet</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="pt-[60px] md:pt-[68px]">
          <main className="container mx-auto px-6 lg:px-8 py-16">
            <MenuGridSkeleton count={6} />
          </main>
          <Footer />
        </div>
      </div>
    }>
      <MenuPageContent />
    </Suspense>
  )
}