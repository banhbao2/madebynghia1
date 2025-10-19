'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { api } from '@/lib/api-client'
import { getUserErrorMessage } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { useTimeSlots } from '@/hooks/useTimeSlots'
import { formatDateTime, formatDateTimeLong } from '@/lib/formatters'
import OrderTypeSelector from '@/components/checkout/OrderTypeSelector'
import TimeSlotPicker from '@/components/checkout/TimeSlotPicker'
import ContactForm from '@/components/checkout/ContactForm'
import DeliveryAddressForm from '@/components/checkout/DeliveryAddressForm'
import PickupInfo from '@/components/checkout/PickupInfo'
import SpecialInstructions from '@/components/checkout/SpecialInstructions'
import CheckoutButton from '@/components/checkout/CheckoutButton'
import OrderSummary from '@/components/checkout/OrderSummary'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, subtotal, tax, total, itemCount } = useCart()
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const { timeSlots, selectedTime, setSelectedTime, closedMessage } = useTimeSlots()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    houseNumber: '',
    city: '',
    notes: '',
    honeypot: ''
  })
  const [submissionTime, setSubmissionTime] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [orderSubmitted, setOrderSubmitted] = useState(false)

  // Redirect if cart is empty (but not if order was just submitted)
  useEffect(() => {
    if (itemCount === 0 && !orderSubmitted) {
      router.push('/menu')
    }
  }, [itemCount, router, orderSubmitted])

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
      // Prepare order data
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        delivery_address: orderType === 'delivery'
          ? `${formData.street} ${formData.houseNumber}, ${formData.city}`.trim()
          : undefined,
        order_type: orderType,
        scheduled_time: selectedTime,
        special_notes: formData.notes || undefined,
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total
      }

      // Log order attempt
      logger.info('Submitting order', {
        orderType,
        itemCount: items.length,
        total,
        hasScheduledTime: !!selectedTime
      })

      // Submit order with automatic retry on network failures
      const data = await api.post('/api/orders', orderData, {
        retry: {
          maxRetries: 3,
          retryDelay: 1000
        },
        timeout: 30000
      })

      logger.info('Order submitted successfully', {
        orderId: data.order.id
      })

      // Email will be sent when restaurant accepts or declines the order

      // Mark order as submitted to prevent redirect from empty cart
      setOrderSubmitted(true)

      // Clear cart and redirect to confirmation page with order details
      clearCart()
      router.push(`/checkout/confirmation?orderId=${data.order.id}&email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.name)}&orderType=${orderType}&total=${total.toFixed(2)}`)

    } catch (err) {
      // Log detailed error information
      logger.error('Order submission failed', err, {
        orderType,
        itemCount: items.length,
        total,
        customerName: formData.name,
        hasEmail: !!formData.email,
        hasScheduledTime: !!selectedTime
      })

      // Get user-friendly error message
      const userMessage = getUserErrorMessage(err)
      setError(userMessage)
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.trim()
    setFormData(prev => ({ ...prev, [e.target.name]: value }))

    if (submissionTime === 0) {
      setSubmissionTime(Date.now())
    }
  }

  if (itemCount === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="pt-[60px] md:pt-[68px]">

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-900">Warenkorb</span>
              </div>
              <div className="w-12 md:w-20 h-1 bg-red-500"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-900">Kasse</span>
              </div>
              <div className="w-12 md:w-20 h-1 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-500">Bestätigung</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zum Menü
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
                    <span className="gradient-text">Checkout</span>
                  </h1>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Order Type Selection */}
                    <OrderTypeSelector
                      value={orderType}
                      onChange={setOrderType}
                      disabled={isSubmitting}
                    />

                    {/* Time Selection */}
                    <TimeSlotPicker
                      orderType={orderType}
                      selectedTime={selectedTime}
                      timeSlots={timeSlots}
                      closedMessage={closedMessage}
                      onSelect={setSelectedTime}
                      disabled={isSubmitting}
                    />

                    {/* Contact Information */}
                    <ContactForm
                      formData={{
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email,
                        honeypot: formData.honeypot
                      }}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />

                    {/* Delivery Address or Pickup Info */}
                    {orderType === 'delivery' ? (
                      <DeliveryAddressForm
                        formData={{
                          street: formData.street,
                          houseNumber: formData.houseNumber,
                          city: formData.city
                        }}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <PickupInfo />
                    )}

                    {/* Special Instructions */}
                    <SpecialInstructions
                      value={formData.notes}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                      </div>
                    )}

                    {/* Submit Button - Mobile */}
                    <CheckoutButton isSubmitting={isSubmitting} isMobile onSubmit={handleSubmit} />
                  </form>
                </div>
              </div>

              {/* Right Column - Order Summary (Sticky on Desktop) */}
              <div className="lg:col-span-1">
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  orderType={orderType}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
