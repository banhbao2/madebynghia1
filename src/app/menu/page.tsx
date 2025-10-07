'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { menuItems, categories } from '@/lib/menuData'
import Image from 'next/image'

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory)

  const popularItems = menuItems.filter(item => item.popular)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our delicious selection of authentic Vietnamese Phở and Japanese Sushi,
            crafted with the freshest ingredients
          </p>
        </div>

        {/* Popular Items Section */}
        {selectedCategory === 'all' && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>⭐</span> Popular Favorites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                  <div className="relative h-48 bg-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <p className="text-red-600 font-bold text-lg">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items by Category */}
        <div className="space-y-12">
          {selectedCategory === 'all' ? (
            // Show all categories
            categories.slice(1).map((category) => {
              const categoryItems = menuItems.filter(item => item.category === category.id)
              return (
                <section key={category.id}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-2">
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoryItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                              {item.popular && (
                                <span className="text-yellow-500 text-sm">⭐</span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-2">{item.description}</p>
                            {item.customizations && (
                              <div className="mt-3 text-sm text-gray-500">
                                <span className="font-semibold">Customizable:</span>{' '}
                                {item.customizations.map(c => c.label).join(', ')}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-red-600 font-bold text-xl whitespace-nowrap">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })
          ) : (
            // Show selected category
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                        {item.popular && (
                          <span className="text-yellow-500 text-sm">⭐</span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-2">{item.description}</p>
                      {item.customizations && (
                        <div className="mt-3 text-sm text-gray-500">
                          <span className="font-semibold">Customizable:</span>{' '}
                          {item.customizations.map(c => c.label).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-red-600 font-bold text-xl whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
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

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-lg mb-6 opacity-90">
            Order online for pickup or delivery and enjoy our delicious food at home
          </p>
          <a
            href="/order"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Order Now
          </a>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl mb-2">🚚</div>
            <h3 className="font-semibold text-gray-900 mb-1">Free Delivery</h3>
            <p className="text-sm text-gray-600">On orders over $30</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl mb-2">⏱️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Fast Preparation</h3>
            <p className="text-sm text-gray-600">Ready in 20-30 minutes</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-900 mb-1">Fresh Ingredients</h3>
            <p className="text-sm text-gray-600">Made to order daily</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}