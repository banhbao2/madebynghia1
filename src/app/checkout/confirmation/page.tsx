'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SmartLoading from '@/components/SmartLoading'
import { useRouter } from 'next/navigation'
import { formatTime, formatDateTime } from '@/lib/formatters'
import { useConfetti } from '@/hooks/useConfetti'
import type { OrderStatus } from '@/types/order'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { celebration } = useConfetti()
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending')
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const orderId = searchParams.get('orderId')
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  const orderType = searchParams.get('orderType') as 'delivery' | 'pickup' | null
  const total = searchParams.get('total')

  // Calculate estimated time
  const estimatedMinutes = orderType === 'delivery' ? 45 : 30
  const estimatedTime = new Date(Date.now() + estimatedMinutes * 60000)
  const estimatedTimeString = formatTime(estimatedTime)

  // Redirect if no order ID
  useEffect(() => {
    if (!orderId) {
      router.push('/menu')
    }
  }, [orderId, router])

  // Fetch order details and status from backend
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return

      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrderStatus(data.order.status)
          setOrderDetails(data.order) // Store full order details
        }
      } catch (error) {
        console.error('Failed to fetch order data:', error)
      } finally {
        setIsLoadingStatus(false)
      }
    }

    fetchOrderData()

    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchOrderData, 10000)
    return () => clearInterval(interval)
  }, [orderId])

  // Celebration confetti on page load (dopamine hit!)
  useEffect(() => {
    if (orderId) {
      // Slight delay to let page render, then celebrate
      const timer = setTimeout(() => {
        celebration()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [orderId, celebration])

  if (!orderId) {
    return null
  }

  // Map backend status to customer-friendly labels
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Gesendet',
          icon: '📤',
          color: 'yellow',
          description: 'Ihre Bestellung wurde an das Restaurant gesendet'
        }
      case 'preparing':
        return {
          label: 'Akzeptiert',
          icon: '👨‍🍳',
          color: 'blue',
          description: 'Ihre Bestellung wurde akzeptiert und wird zubereitet'
        }
      case 'completed':
        return {
          label: 'Fertig',
          icon: '✅',
          color: 'green',
          description: orderType === 'delivery' ? 'Ihre Bestellung wurde geliefert' : 'Ihre Bestellung ist abholbereit'
        }
      case 'cancelled':
        return {
          label: 'Abgelehnt',
          icon: '❌',
          color: 'red',
          description: 'Ihre Bestellung wurde leider abgelehnt. Wir kontaktieren Sie telefonisch.'
        }
      default:
        return {
          label: 'In Bearbeitung',
          icon: '⏳',
          color: 'yellow',
          description: 'Ihre Bestellung wird bearbeitet'
        }
    }
  }

  const statusInfo = getStatusInfo(orderStatus)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
      <Header />
      <main id="main" className="pt-[60px] md:pt-[68px]">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-8 animate-scale-in">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
                <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                <span className="gradient-text">Bestellung erfolgreich aufgegeben!</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-2">
                Vielen Dank, <span className="font-bold text-gray-900">{name || 'Kunde'}</span>!
              </p>

              <p className="text-base text-gray-600">
                Eine Bestätigungsmail wurde an <span className="font-semibold text-gray-900">{email}</span> gesendet. Verwenden Sie den Tracking-Link in der E-Mail, um den Status Ihrer Bestellung in Echtzeit zu verfolgen.
              </p>
            </div>

            {/* Order Type & Estimated Time - PROMINENT */}
            <div className={`mb-8 rounded-3xl p-6 md:p-8 border-3 shadow-2xl animate-fade-in-up animation-delay-200 ${
              orderType === 'delivery'
                ? 'bg-gradient-to-br from-blue-50 via-blue-100 to-teal-100 border-blue-300'
                : 'bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 border-orange-300'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    orderType === 'delivery' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}>
                    <span className="text-4xl">{orderType === 'delivery' ? '🚚' : '🏪'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Bestellart</p>
                    <p className="text-2xl md:text-3xl font-extrabold text-gray-900">
                      {orderType === 'delivery' ? 'Lieferung' : 'Abholung'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {orderType === 'delivery' ? 'Geschätzte Lieferung' : 'Bereit zur Abholung'}
                  </p>
                  <p className="text-3xl md:text-4xl font-extrabold gradient-text">
                    {estimatedTimeString} Uhr
                  </p>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    (~{estimatedMinutes} Minuten)
                  </p>
                </div>
              </div>

              {orderType === 'pickup' && (
                <div className="mt-6 pt-6 border-t-2 border-orange-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Abholadresse:</p>
                      <p className="text-gray-700 font-medium">
                        Hauptstraße 123<br />
                        Ihre Stadt, 10115
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Wir rufen Sie an, sobald Ihre Bestellung zur Abholung bereit ist!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {orderType === 'delivery' && (
                <div className="mt-6 pt-6 border-t-2 border-blue-200">
                  <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <span className="text-2xl">🎉</span>
                    <p className="text-sm text-gray-700 font-medium">
                      <span className="font-bold text-green-600">Kostenlose Lieferung!</span> Ihr Essen wird direkt zu Ihnen nach Hause geliefert.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border-2 border-gray-100 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">Bestelldetails</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Bestellnummer</span>
                  <span className="font-mono font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
                    #{orderId.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Bestelldatum</span>
                  <span className="font-semibold text-gray-900">
                    {formatDateTime(new Date())}
                  </span>
                </div>

                {total && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Gesamtbetrag</span>
                    <span className="font-bold text-xl text-gray-900">{total}€</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Status</span>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    statusInfo.color === 'yellow' ? 'bg-yellow-100' :
                    statusInfo.color === 'blue' ? 'bg-blue-100' :
                    statusInfo.color === 'green' ? 'bg-green-100' :
                    'bg-red-100'
                  }`}>
                    <span className="text-xl" role="img" aria-label={statusInfo.label}>{statusInfo.icon}</span>
                    <span className={`font-bold text-sm ${
                      statusInfo.color === 'yellow' ? 'text-yellow-800' :
                      statusInfo.color === 'blue' ? 'text-blue-800' :
                      statusInfo.color === 'green' ? 'text-green-800' :
                      'text-red-800'
                    }`}>{statusInfo.label}</span>
                    {orderStatus !== 'completed' && orderStatus !== 'cancelled' && (
                      <span className={`w-3 h-3 rounded-full animate-pulse ${
                        statusInfo.color === 'yellow' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`} aria-hidden="true"></span>
                    )}
                  </div>
                </div>

                {/* Itemized Order Details */}
                {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
                  <div className="pt-4 mt-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span>🍜</span>
                      <span>Bestellte Artikel</span>
                    </h3>
                    <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                      {orderDetails.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-start gap-4 pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-red-600 text-sm">{item.quantity}×</span>
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                                  <div className="mt-1 space-y-0.5">
                                    {Object.entries(item.selectedCustomizations).map(([key, value]: [string, any]) => (
                                      <p key={key} className="text-xs text-gray-600">
                                        • {value}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gray-900">{item.price.toFixed(2)}€</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-500">{(item.price / item.quantity).toFixed(2)}€ pro Stück</p>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Subtotal, Tax, Total */}
                      <div className="pt-3 mt-3 border-t-2 border-gray-300 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Zwischensumme</span>
                          <span className="text-sm font-medium text-gray-900">{orderDetails.subtotal.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">MwSt. (19%)</span>
                          <span className="text-sm font-medium text-gray-900">{orderDetails.tax.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                          <span className="text-base font-bold text-gray-900">Gesamt</span>
                          <span className="text-xl font-bold text-gray-900">{orderDetails.total.toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* What's Next Timeline - Dynamic based on order status */}
            {orderStatus !== 'cancelled' && (
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl p-6 md:p-8 mb-8 border-2 border-purple-200 animate-fade-in-up animation-delay-400">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">⏱️</span>
                  <h3 className="text-2xl font-extrabold text-gray-900">Was passiert jetzt?</h3>
                </div>

                <div className="space-y-6">
                  {/* Step 1: Order Received - Always completed */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg">
                        ✓
                      </div>
                      {orderStatus !== 'pending' && (
                        <div className="absolute top-10 left-5 w-0.5 h-12 bg-gradient-to-b from-green-500 to-blue-500"></div>
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="font-extrabold text-gray-900 text-lg">Bestellung erhalten!</p>
                      <p className="text-sm text-gray-600 mt-1">Ihre Bestellung wurde erfolgreich in unser System übermittelt</p>
                    </div>
                  </div>

                  {/* Step 2: Accepted & Preparing - Shows when status is 'preparing' or 'completed' */}
                  {(orderStatus === 'preparing' || orderStatus === 'completed') && (
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg ${
                          orderStatus === 'preparing' ? 'animate-pulse' : ''
                        }`}>
                          {orderStatus === 'completed' ? '✓' : '👨‍🍳'}
                        </div>
                        {orderStatus !== 'preparing' && (
                          <div className="absolute top-10 left-5 w-0.5 h-12 bg-gradient-to-b from-blue-500 to-orange-500"></div>
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="font-extrabold text-gray-900 text-lg">Bestellung akzeptiert und in Zubereitung</p>
                        <p className="text-sm text-gray-600 mt-1">Unser Küchen-Team bereitet Ihre Speisen frisch zu</p>
                        {orderStatus === 'preparing' && (
                          <div className="mt-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
                            <p className="text-xs font-bold text-blue-600">AKTUELLER SCHRITT</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Ready for pickup/delivery - Shows when status is 'completed' */}
                  {orderStatus === 'completed' && (
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg">
                          {orderType === 'delivery' ? '🚚' : '📦'}
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="font-extrabold text-gray-900 text-lg">
                          {orderType === 'delivery' ? 'Unterwegs zu Ihnen' : 'Bereit zur Abholung'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {orderType === 'delivery'
                            ? 'Ihre Bestellung wird zu Ihnen geliefert'
                            : 'Sie erhalten eine Benachrichtigung zur Abholung'}
                        </p>
                        <div className="mt-2 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
                          <p className="text-xs font-bold text-green-600">AKTUELLER SCHRITT</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pending state - waiting for acceptance */}
                  {orderStatus === 'pending' && (
                    <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-800">
                        <span className="font-bold">⏳ Warten auf Bestätigung:</span> Das Restaurant prüft gerade Ihre Bestellung. Sie erhalten in Kürze eine Rückmeldung.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cancelled order message */}
            {orderStatus === 'cancelled' && (
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 md:p-8 mb-8 animate-fade-in-up animation-delay-400">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">❌</span>
                  <div>
                    <h3 className="text-2xl font-extrabold text-red-900 mb-2">Bestellung abgelehnt</h3>
                    <p className="text-red-800 mb-4">
                      Leider mussten wir Ihre Bestellung ablehnen. Dies kann verschiedene Gründe haben (z.B. ausverkaufte Artikel, Liefergebiet, etc.).
                    </p>
                    <p className="text-red-700 font-semibold">
                      📞 Wir werden Sie telefonisch kontaktieren, um die Situation zu klären.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Important Notes */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 animate-fade-in-up animation-delay-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-bold text-gray-900 mb-2">Wichtige Hinweise:</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Sie erhalten eine E-Mail-Bestätigung an {email}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Wir informieren Sie, sobald Ihre Bestellung {orderType === 'delivery' ? 'unterwegs ist' : 'abholbereit ist'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Bei Fragen kontaktieren Sie uns gerne telefonisch oder per E-Mail</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 animate-fade-in-up animation-delay-600">
              <Link
                href="/menu"
                className="block w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-4 rounded-xl hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] active:scale-95 transition-all font-bold text-lg text-center"
              >
                Weiter einkaufen
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4 font-medium">Fragen zu Ihrer Bestellung?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+493012345678"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition font-medium text-gray-700 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +49 30 12345678
                </a>
                <a
                  href="mailto:hallo@nghiademo.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition font-medium text-gray-700 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  hallo@nghiademo.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <SmartLoading context="order" size="lg" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
