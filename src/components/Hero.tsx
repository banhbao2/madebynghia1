import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-[650px] md:h-[700px] flex items-center justify-center">
      <Image
        src="/hero-placeholder.jpg"
        alt="Pho & Sushi Restaurant"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
          Vietnamese Flavors Meet<br />Japanese Artistry
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl mx-auto font-medium">
          Experience authentic pho and expertly crafted sushi at affordable prices
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/menu"
            className="inline-block bg-red-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-red-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-red-500/50 w-full sm:w-auto"
          >
            Order Now →
          </Link>
          <Link
            href="/reservations"
            className="inline-block bg-white text-gray-900 px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl w-full sm:w-auto"
          >
            Reserve a Table
          </Link>
        </div>
      </div>
    </section>
  )
}