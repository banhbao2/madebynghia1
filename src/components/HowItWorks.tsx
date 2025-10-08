import { howItWorksSteps } from '@/lib/constants'

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Order your favorite dishes in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {howItWorksSteps.map((step, index) => (
            <div key={step.id} className="text-center relative">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl flex items-center justify-center text-4xl font-extrabold mx-auto mb-6 shadow-xl transform hover:scale-110 transition-transform">
                {index + 1}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {step.description}
              </p>
              {index < howItWorksSteps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-6 text-4xl text-red-300">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}