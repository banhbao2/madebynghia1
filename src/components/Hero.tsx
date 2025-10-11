import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-[700px] md:h-[750px] flex items-center justify-center overflow-hidden">
      <Image
        src="/hero-placeholder.jpg"
        alt="Nghia Demo Restaurant"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />

      <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6 shadow-xl animate-fade-in">
          <span className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</span>
          <span className="text-sm font-semibold">4.9/5 from 500+ happy customers</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight animate-fade-in-up">
          Welcome to<br />
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Nghia Demo
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto font-medium animate-fade-in-up animation-delay-200">
          A demo restaurant website showcasing modern web development with Next.js
        </p>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10 animate-fade-in-up animation-delay-300">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">50+</div>
            <div className="text-sm text-gray-300">Menu Items</div>
          </div>
          <div className="w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">20-30</div>
            <div className="text-sm text-gray-300">Minute Prep</div>
          </div>
          <div className="w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">100%</div>
            <div className="text-sm text-gray-300">Fresh Daily</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
          <Link
            href="/menu"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-2xl hover:shadow-red-500/50 w-full sm:w-auto"
          >
            Order Now
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/reservations"
            className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all transform hover:scale-105 shadow-xl w-full sm:w-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reserve a Table
          </Link>
        </div>

        {/* Floating feature cards */}
        <div className="hidden md:flex justify-center gap-4 mt-12 animate-fade-in animation-delay-500">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2 shadow-xl">
            <span className="text-2xl">🚚</span>
            <span className="text-sm font-semibold">Free Delivery $30+</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2 shadow-xl">
            <span className="text-2xl">⏱️</span>
            <span className="text-sm font-semibold">Ready in 20-30 min</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2 shadow-xl">
            <span className="text-2xl">✨</span>
            <span className="text-sm font-semibold">Made Fresh Daily</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}