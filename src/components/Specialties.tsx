import SpecialtyCard from './SpecialtyCard'
import { specialties } from '@/lib/constants'

export default function Specialties() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            Unsere Spezialitäten
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Entdecken Sie unser sorgfältig kuratiertes Demo-Menü, das moderne
            Webentwicklungsfunktionen präsentiert und zeigt, wie Restaurantangebote
            angezeigt und organisiert werden können
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {specialties.map((specialty) => (
            <SpecialtyCard key={specialty.id} {...specialty} />
          ))}
        </div>
      </div>
    </section>
  )
}
