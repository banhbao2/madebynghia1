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
      <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-orange-100">
        <div className="relative h-72">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="p-8">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            {title}
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            {description}
          </p>
          <div className="inline-flex items-center text-red-600 font-bold text-lg hover:text-red-700 transition">
            Order Now →
          </div>
        </div>
      </div>
    </Link>
  )
}