'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'

interface CheckoutModalProps {
  onClose: () => void
  total: number
}

export default function CheckoutModal({ onClose, total }: CheckoutModalProps) {
  const { clearCart, items, subtotal, tax } = useCart()
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    houseNumber: '',
    city: '',
    notes: '',
    honeypot: '' // spam prevention
  })
  const [submissionTime, setSubmissionTime] = useState<number>(0)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Spam prevention checks
    if (formData.honeypot) {
      setError('Ungültige Übermittlung erkannt.')
      setIsSubmitting(false)
      return
    }

    const timeTaken = Date.now() - submissionTime
    if (timeTaken < 3000) {
      setError('Bitte nehmen Sie sich Zeit, um das Formular auszufüllen.')
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          delivery_address: orderType === 'delivery'
            ? `${formData.street} ${formData.houseNumber}, ${formData.city}`.trim()
            : undefined,
          order_type: orderType,
          special_notes: formData.notes || undefined,
          items: items,
          subtotal: subtotal,
          tax: tax,
          total: total
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Bestellung konnte nicht aufgegeben werden')
      }

      setOrderId(data.order.id)
      setOrderSubmitted(true)

      // Send confirmation email
      if (formData.email) {
        try {
          const orderDate = new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })

          const estimatedTime = new Date(Date.now() + (orderType === 'delivery' ? 45 : 30) * 60000).toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })

          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerEmail: formData.email,
              customerName: formData.name,
              orderNumber: data.order.id.slice(-8),
              orderType,
              items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              subtotal,
              tax,
              total,
              estimatedTime,
              deliveryAddress: orderType === 'delivery'
                ? `${formData.street} ${formData.houseNumber}, ${formData.city}`.trim()
                : undefined,
              orderDate
            })
          })
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
          // Don't block order completion if email fails
        }
      }

      // Don't auto-close anymore - user needs to manually close

    } catch (err) {
      console.error('Error submitting order:', err)
      setError(err instanceof Error ? err.message : 'Bestellung konnte nicht aufgegeben werden. Bitte versuchen Sie es erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.trim()
    setFormData(prev => ({ ...prev, [e.target.name]: value }))

    // Set submission time on first interaction (spam prevention)
    if (submissionTime === 0) {
      setSubmissionTime(Date.now())
    }
  }

  const handleCloseSuccess = () => {
    clearCart()
    onClose()
    setOrderSubmitted(false)
    setOrderId('')
  }

  if (orderSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Bestellung angenommen!</h3>
          <p className="text-gray-600 mb-2">
            Vielen Dank für Ihre Bestellung, {formData.name}!
          </p>
          <p className="text-gray-600 mb-4">
            Eine Bestätigungs-E-Mail wurde an <strong>{formData.email}</strong> gesendet
          </p>
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Bestellnummer</p>
              <p className="text-sm font-mono text-gray-700 break-all">{orderId}</p>
            </div>
          )}
          <button
            onClick={handleCloseSuccess}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Schließen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Zur Kasse</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Kasse schließen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Order Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Bestellart</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-4 border-2 rounded-lg transition ${
                  orderType === 'delivery'
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">🚚</div>
                <div className="font-semibold">Lieferung</div>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-4 border-2 rounded-lg transition ${
                  orderType === 'pickup'
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">🏪</div>
                <div className="font-semibold">Abholung</div>
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefonnummer *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="ihre@email.de"
              />
            </div>

            {/* Honeypot field - hidden from users, only bots will fill it */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleInputChange}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {orderType === 'delivery' && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Straße *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Hauptstraße"
                    />
                  </div>
                  <div>
                    <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Nr. *
                    </label>
                    <input
                      type="text"
                      id="houseNumber"
                      name="houseNumber"
                      required
                      value={formData.houseNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Stadt *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ihre Stadt"
                  />
                </div>
              </>
            )}

            {orderType === 'pickup' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Abholort:</strong><br />
                  Hauptstraße 123, Ihre Stadt<br />
                  Wir benachrichtigen Sie, sobald Ihre Bestellung fertig ist!
                </p>
              </div>
            )}

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Besondere Anweisungen
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Spezielle Wünsche oder Ernährungseinschränkungen?"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Bestellübersicht</h3>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Gesamt</span>
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Bestellung wird aufgegeben...
              </>
            ) : (
              'Bestellung aufgeben'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
