'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, tax, total, itemCount } = useCart()
  const router = useRouter()

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Ihr Warenkorb ist leer</h1>
            <p className="text-gray-600 mb-8">Fügen Sie Artikel aus unserer Speisekarte hinzu, um zu beginnen.</p>
            <button
              onClick={() => router.push('/menu')}
              className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zur Speisekarte
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20 pb-12">
      <div className="container mx-auto px-4 py-6">
        {/* Header with back button */}
        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => router.push('/menu')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-4 transition touch-manipulation active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden md:inline">Weiter einkaufen</span>
            <span className="md:hidden">Zurück zum Menü</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Ihr Warenkorb</h1>
          <p className="text-gray-600 mt-2">{itemCount} {itemCount === 1 ? 'Artikel' : 'Artikel'}</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white rounded-2xl p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                        )}
                        {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                          <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2 mb-2">
                            <div className="font-semibold text-xs text-gray-500 uppercase mb-1">Ihre Auswahl:</div>
                            {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-600 transition p-1 touch-manipulation active:scale-90"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity Controls & Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-red-600 font-bold transition touch-manipulation active:scale-90 rounded"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-red-600 font-bold transition touch-manipulation active:scale-90 rounded"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-gray-900">{(item.price * item.quantity).toFixed(2)}€</div>
                        <div className="text-xs text-gray-500">{item.price.toFixed(2)}€ / Stück</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Sticky on desktop only */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md md:sticky md:top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Bestellübersicht</h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Zwischensumme</span>
                  <span className="font-medium">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>MwSt. (19%)</span>
                  <span className="font-medium">{tax.toFixed(2)}€</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Gesamt</span>
                <span>{total.toFixed(2)}€</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98]"
              >
                Zur Kasse
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <button
                onClick={() => router.push('/menu')}
                className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:border-gray-400 hover:bg-gray-50 transition-all touch-manipulation active:scale-[0.98]"
              >
                Weitere Artikel hinzufügen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
