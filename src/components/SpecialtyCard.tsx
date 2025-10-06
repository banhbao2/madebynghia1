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
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition">
      <div className="relative h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <Link 
          href={link} 
          className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition"
        >
          Order →
        </Link>
      </div>
    </div>
  )
}