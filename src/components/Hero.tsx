import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'

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
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-black/70 to-orange-900/60" />

      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full blur-xl animate-float animation-delay-300" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-xl animate-float animation-delay-500" />

      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Trust Badge - Mobile optimized with enhanced design */}
        <div className="inline-flex items-center gap-2 glass border border-white/30 rounded-full px-5 py-2.5 mb-4 sm:mb-6 shadow-2xl animate-fade-in hover-lift">
          <span className="text-yellow-400 text-base sm:text-lg drop-shadow-lg">⭐⭐⭐⭐⭐</span>
          <span className="text-xs sm:text-sm font-bold text-white/95">4,9/5 von über 500 Kunden</span>
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

        {/* CTA Buttons - Enhanced with gradients and glow effects */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-fade-in-up animation-delay-400 max-w-lg mx-auto sm:max-w-none">
          <Link href="/menu">
            <Button variant="primary" size="lg" className="group shadow-2xl touch-manipulation w-full sm:w-auto">
              <span>Jetzt bestellen</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
          <Link href="/reservations">
            <Button variant="secondary" size="lg" className="group glass border-2 border-white/40 text-white hover:bg-white/25 hover:border-white/60 shadow-xl touch-manipulation w-full sm:w-auto">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Tisch reservieren</span>
            </Button>
          </Link>
        </div>

        {/* Feature cards - Enhanced with hover effects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 sm:mt-12 animate-fade-in animation-delay-500 max-w-3xl mx-auto">
          <div className="glass border border-white/30 rounded-xl px-4 py-3.5 flex items-center justify-center gap-2.5 shadow-xl hover-lift group cursor-default">
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">🚚</span>
            <span className="text-xs sm:text-sm font-bold text-white/95">Kostenlose Lieferung ab 30€</span>
          </div>
          <div className="glass border border-white/30 rounded-xl px-4 py-3.5 flex items-center justify-center gap-2.5 shadow-xl hover-lift group cursor-default">
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">⏱️</span>
            <span className="text-xs sm:text-sm font-bold text-white/95">Fertig in 20-30 Min.</span>
          </div>
          <div className="glass border border-white/30 rounded-xl px-4 py-3.5 flex items-center justify-center gap-2.5 shadow-xl hover-lift group cursor-default">
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">✨</span>
            <span className="text-xs sm:text-sm font-bold text-white/95">Täglich frisch zubereitet</span>
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
