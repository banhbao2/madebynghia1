import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Order Now</h1>
        <p className="text-center text-gray-600 text-lg mb-8">
          Online ordering coming soon! Call us or visit our restaurant to place your order.
        </p>
        
        <div className="max-w-2xl mx-auto bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">How to Order</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-4">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-semibold text-gray-900">Call Us</p>
                <p>(555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">🏪</span>
              <div>
                <p className="font-semibold text-gray-900">Visit Us</p>
                <p>123 Main Street, Downtown District</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-semibold text-gray-900">Email Us</p>
                <p>hello@phoandsushi.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/#menu"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition"
            >
              View Menu
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}