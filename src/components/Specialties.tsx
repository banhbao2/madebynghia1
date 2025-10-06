import SpecialtyCard from './SpecialtyCard'
import { specialties } from '@/lib/constants'

export default function Specialties() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Our Specialties
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our carefully curated menu featuring the best of Vietnamese and Japanese cuisine
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {specialties.map((specialty) => (
            <SpecialtyCard key={specialty.id} {...specialty} />
          ))}
        </div>
      </div>
    </section>
  )
}