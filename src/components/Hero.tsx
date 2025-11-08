import Link from 'next/link'
import { Button } from '@/components/ui'

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-60px)] sm:min-h-[700px] md:min-h-[850px] flex items-center justify-center overflow-hidden -mt-[60px] md:-mt-[68px] pt-[60px] md:pt-[68px] pattern-subtle-grain">
      {/* Luxury Background - Subtle gradient with sophistication */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--neutral-900)] via-[var(--neutral-800)] to-[var(--accent-emerald)]" />

      {/* Elegant Overlay Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20" />

      {/* Placeholder text overlay - More subtle */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <p className="text-white text-7xl md:text-9xl font-playfair font-light text-center px-4 tracking-wider">
          YOUR IMAGE<br />HERE
        </p>
      </div>

      {/* Luxury Decorative Elements - More refined */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-[var(--gold)]/10 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-[var(--accent-emerald)]/10 to-transparent rounded-full blur-3xl animate-float animation-delay-300" />
      <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-[var(--gold)]/5 rounded-full blur-2xl animate-float animation-delay-500" />

      <div className="relative z-10 text-center text-white px-6 sm:px-8 max-w-7xl mx-auto">
        {/* Luxury Trust Badge - Refined */}
        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-[var(--gold)]/30 rounded-full px-6 py-3 mb-8 sm:mb-10 shadow-luxury animate-fade-in">
          <span className="text-[var(--gold)] text-lg sm:text-xl drop-shadow-lg">⭐⭐⭐⭐⭐</span>
          <span className="text-xs sm:text-sm font-poppins font-medium text-white tracking-wide uppercase">4.9/5 · 500+ Gäste</span>
        </div>

        {/* Luxury Heading - Elegant Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-semibold mb-6 sm:mb-8 leading-[1.1] tracking-tight animate-fade-in-up">
          <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">Authentische Asiatische</span><br />
          <span className="gradient-text-gold inline-block mt-2">
            Küche erleben
          </span>
        </h1>

        {/* Luxury Subtitle - Clean & Spacious */}
        <p className="text-base sm:text-lg md:text-xl mb-10 sm:mb-12 text-white max-w-2xl mx-auto font-inter font-light leading-relaxed animate-fade-in-up animation-delay-200 px-2">
          Wo Tradition auf moderne Kulinarik trifft. Genießen Sie handverlesene Spezialitäten<br className="hidden md:block" />
          in elegantem Ambiente.
        </p>

        {/* Luxury CTA Buttons - Prominent & Elegant */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center animate-fade-in-up animation-delay-300 max-w-md mx-auto sm:max-w-none mb-12 sm:mb-16">
          <Link href="/menu">
            <Button variant="primary" size="lg" className="group shadow-luxury-lg hover:shadow-gold touch-manipulation w-full sm:w-auto bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--primary)] font-poppins font-semibold tracking-wide uppercase text-sm px-8 py-4 relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Speisekarte ansehen
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </Link>
          <Link href="/reservations">
            <Button variant="secondary" size="lg" className="group bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-luxury touch-manipulation w-full sm:w-auto font-poppins font-medium tracking-wide uppercase text-sm px-8 py-4 transition-luxury">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Reservieren
              </span>
            </Button>
          </Link>
        </div>

        {/* Luxury Stats - Minimalist & Refined */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16 animate-fade-in-up animation-delay-400 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold text-white mb-2 group-hover:text-[var(--gold)] transition-luxury">50+</div>
            <div className="text-xs sm:text-sm text-white/80 font-poppins font-light uppercase tracking-widest">Spezialitäten</div>
          </div>
          <div className="hidden sm:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
          <div className="text-center group">
            <div className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold text-white mb-2 group-hover:text-[var(--gold)] transition-luxury">20</div>
            <div className="text-xs sm:text-sm text-white/80 font-poppins font-light uppercase tracking-widest">Jahre Tradition</div>
          </div>
          <div className="hidden sm:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
          <div className="text-center group">
            <div className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold text-white mb-2 group-hover:text-[var(--gold)] transition-luxury">4.9</div>
            <div className="text-xs sm:text-sm text-white/80 font-poppins font-light uppercase tracking-widest">Bewertung</div>
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
