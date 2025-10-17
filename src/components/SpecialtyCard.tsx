import Image from 'next/image'
import Link from 'next/link'

interface SpecialtyCardProps {
  title: string
  description: string
  image: string
  link: string
}

export default function SpecialtyCard({ title, description, image, link }: SpecialtyCardProps) {
  return (
    <Link href={link}>
      <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-orange-200">
        {/* Card background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative h-72 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Floating badge */}
          <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full">
            <span className="text-white font-bold text-sm">✨ Spezial</span>
          </div>
        </div>

        <div className="relative p-8">
          <h3 className="text-3xl font-extrabold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            {description}
          </p>
          <div className="inline-flex items-center gap-2 text-red-600 font-bold text-lg group-hover:gap-3 transition-all">
            <span>Jetzt bestellen</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style={{ boxShadow: '0 0 40px rgba(220, 38, 38, 0.3)' }} />
      </div>
    </Link>
  )
}