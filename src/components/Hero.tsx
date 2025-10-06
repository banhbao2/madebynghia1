import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative h-[600px] flex items-center justify-center">
      <Image
        src="/hero-placeholder.jpg"
        alt="Pho & Sushi Restaurant"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h2 className="text-5xl md:text-6xl font-bold mb-4">
          Vietnamese Flavors Meet Japanese Artistry
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Experience the perfect fusion of authentic pho and expertly crafted sushi
        </p>
        <button className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition transform hover:scale-105">
          Explore Menu
        </button>
      </div>
    </section>
  )
}