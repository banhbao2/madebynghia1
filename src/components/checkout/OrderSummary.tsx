import CheckoutButton from './CheckoutButton'

interface CartItem {
  cartItemId: string
  name: string
  quantity: number
  price: number
}

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  orderType: 'delivery' | 'pickup'
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
}

export default function OrderSummary({
  items,
  subtotal,
  tax,
  total,
  orderType,
  isSubmitting,
  onSubmit
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Bestellübersicht</h2>

      {/* Items */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex justify-between items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{item.name}</div>
              <div className="text-sm text-gray-600">Menge: {item.quantity}</div>
            </div>
            <div className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)}€</div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Zwischensumme</span>
          <span className="font-semibold">{subtotal.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>MwSt (8,75%)</span>
          <span className="font-semibold">{tax.toFixed(2)}€</span>
        </div>
        {orderType === 'delivery' && (
          <div className="flex justify-between text-gray-700">
            <span>Lieferung</span>
            <span className="font-semibold text-green-600">Kostenlos</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-3 border-t-2 border-gray-200">
          <span>Gesamt</span>
          <span className="gradient-text">{total.toFixed(2)}€</span>
        </div>
      </div>

      {/* Desktop Submit Button */}
      <CheckoutButton isSubmitting={isSubmitting} onSubmit={onSubmit} />

      {/* Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Sichere Bestellung</span>
      </div>
    </div>
  )
}
