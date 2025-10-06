import { howItWorksSteps } from '@/lib/constants'

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Order your favorite dishes in three simple steps
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {howItWorksSteps.map((step, index) => (
            <div key={step.id} className="text-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                {index + 1}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}