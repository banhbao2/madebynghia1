import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-60px)] sm:min-h-[650px] md:min-h-[750px] flex items-center justify-center overflow-hidden -mt-[60px] md:-mt-[68px] pt-[60px] md:pt-[68px]">
      <Image
        src="/hero-placeholder.jpg"
        alt="Nghia Demo Restaurant"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />

      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Trust Badge - Mobile optimized */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-4 sm:mb-6 shadow-xl animate-fade-in">
          <span className="text-yellow-400 text-base sm:text-lg">⭐⭐⭐⭐⭐</span>
          <span className="text-xs sm:text-sm font-semibold">4,9/5 von über 500 Kunden</span>
        </div>

        {/* Heading - Better mobile sizing */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight animate-fade-in-up">
          Willkommen bei<br />
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Nghia Demo
          </span>
        </h1>

        {/* Subtitle - Mobile optimized */}
        <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-100 max-w-3xl mx-auto font-medium animate-fade-in-up animation-delay-200 px-2">
          Eine Demo-Restaurant-Website mit moderner Webentwicklung in Next.js
        </p>

        {/* Stats Bar - Mobile stacked layout */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 mb-8 sm:mb-10 animate-fade-in-up animation-delay-300">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1">50+</div>
            <div className="text-xs sm:text-sm text-gray-300">Gerichte</div>
          </div>
          <div className="w-px h-10 sm:h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1">20-30</div>
            <div className="text-xs sm:text-sm text-gray-300">Min. Zubereitung</div>
          </div>
          <div className="w-px h-10 sm:h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1">100%</div>
            <div className="text-xs sm:text-sm text-gray-300">Täglich frisch</div>
          </div>
        </div>

        {/* CTA Buttons - Mobile first with larger touch targets */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-fade-in-up animation-delay-400 max-w-lg mx-auto sm:max-w-none">
          <Link
            href="/menu"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 sm:px-10 py-4 rounded-xl text-base sm:text-lg font-bold hover:from-red-700 hover:to-red-800 active:scale-95 transition-all shadow-2xl touch-manipulation"
          >
            Jetzt bestellen
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/reservations"
            className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 sm:px-10 py-4 rounded-xl text-base sm:text-lg font-bold hover:bg-white/20 active:scale-95 transition-all shadow-xl touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Tisch reservieren
          </Link>
        </div>

        {/* Feature cards - Show on mobile as grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 sm:mt-12 animate-fade-in animation-delay-500 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2 shadow-xl">
            <span className="text-xl sm:text-2xl">🚚</span>
            <span className="text-xs sm:text-sm font-semibold">Kostenlose Lieferung ab 30€</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2 shadow-xl">
            <span className="text-xl sm:text-2xl">⏱️</span>
            <span className="text-xs sm:text-sm font-semibold">Fertig in 20-30 Min.</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2 shadow-xl">
            <span className="text-xl sm:text-2xl">✨</span>
            <span className="text-xs sm:text-sm font-semibold">Täglich frisch zubereitet</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Hidden on small mobile */}
      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
