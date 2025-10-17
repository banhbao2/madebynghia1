import SpecialtyCard from './SpecialtyCard'
import { specialties } from '@/lib/constants'

export default function Specialties() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-orange-50/30 to-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pattern-dots opacity-30" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-orange-200/40 to-red-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-red-200/40 to-pink-200/40 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="text-5xl md:text-6xl animate-float">🍜</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="gradient-text">Unsere Spezialitäten</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Entdecken Sie unser sorgfältig kuratiertes Demo-Menü, das moderne
            Webentwicklungsfunktionen präsentiert und zeigt, wie Restaurantangebote
            angezeigt und organisiert werden können
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {specialties.map((specialty, index) => (
            <div
              key={specialty.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
            >
              <SpecialtyCard {...specialty} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
