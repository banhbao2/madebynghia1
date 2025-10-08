export default function TrustBadges() {
  return (
    <section className="py-16 bg-white border-y border-orange-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2">500+</div>
            <p className="text-gray-600 font-medium">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2">4.8★</div>
            <p className="text-gray-600 font-medium">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2">50+</div>
            <p className="text-gray-600 font-medium">Menu Items</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2">20min</div>
            <p className="text-gray-600 font-medium">Avg. Prep Time</p>
          </div>
        </div>
      </div>
    </section>
  )
}
