import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white pt-20 pb-8 border-t border-[var(--gold)]/20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Luxury Divider */}
        <div className="divider-luxury mb-16"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand Section - Luxury */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-3xl group-hover:scale-110 transition-transform">🍜</span>
              <h3 className="text-2xl font-playfair font-semibold">Nghia Demo</h3>
            </Link>
            <p className="text-white/60 leading-relaxed font-inter text-sm">
              Wo Tradition auf moderne Kulinarik trifft. Erleben Sie authentische asiatische Küche in elegantem Ambiente.
            </p>

            {/* Social Media - Luxury Design */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-[var(--gold)] font-poppins font-medium">Folgen Sie uns</h4>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 flex items-center justify-center text-white/70 hover:text-[var(--gold)] transition-luxury group"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 flex items-center justify-center text-white/70 hover:text-[var(--gold)] transition-luxury group"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://tripadvisor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 flex items-center justify-center text-white/70 hover:text-[var(--gold)] transition-luxury group"
                  aria-label="TripAdvisor"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </a>
                <a
                  href="https://yelp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 flex items-center justify-center text-white/70 hover:text-[var(--gold)] transition-luxury group"
                  aria-label="Yelp"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">⭐</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links - Luxury */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--gold)] font-poppins font-medium mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/60 hover:text-[var(--gold)] transition-luxury font-inter text-sm flex items-center gap-2 group">
                  <span className="w-0 h-px bg-[var(--gold)] group-hover:w-4 transition-all"></span>
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-white/60 hover:text-[var(--gold)] transition-luxury font-inter text-sm flex items-center gap-2 group">
                  <span className="w-0 h-px bg-[var(--gold)] group-hover:w-4 transition-all"></span>
                  Speisekarte
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="text-white/60 hover:text-[var(--gold)] transition-luxury font-inter text-sm flex items-center gap-2 group">
                  <span className="w-0 h-px bg-[var(--gold)] group-hover:w-4 transition-all"></span>
                  Reservierung
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-white/60 hover:text-[var(--gold)] transition-luxury font-inter text-sm flex items-center gap-2 group">
                  <span className="w-0 h-px bg-[var(--gold)] group-hover:w-4 transition-all"></span>
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-white/60 hover:text-[var(--gold)] transition-luxury font-inter text-sm flex items-center gap-2 group">
                  <span className="w-0 h-px bg-[var(--gold)] group-hover:w-4 transition-all"></span>
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Luxury */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--gold)] font-poppins font-medium mb-6">Kontakt</h4>
            <ul className="space-y-4 text-white/60 font-inter text-sm">
              <li className="flex items-start gap-3 group hover:text-white/80 transition-luxury">
                <span className="text-[var(--gold)] text-lg mt-0.5">📍</span>
                <span className="leading-relaxed">Hauptstraße 123<br/>10115 Berlin</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[var(--gold)] text-lg">📞</span>
                <a href="tel:+493012345678" className="hover:text-[var(--gold)] transition-luxury">+49 30 12345678</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[var(--gold)] text-lg">✉️</span>
                <a href="mailto:hallo@nghiademo.com" className="hover:text-[var(--gold)] transition-luxury">hallo@nghiademo.com</a>
              </li>
            </ul>
          </div>

          {/* Hours - Luxury */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--gold)] font-poppins font-medium mb-6">Öffnungszeiten</h4>
            <ul className="space-y-3 text-white/60 font-inter text-sm">
              <li className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="font-medium text-white/90">Mo - Fr</span>
                <span>11:00 - 22:00</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="font-medium text-white/90">Samstag</span>
                <span>12:00 - 23:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium text-white/90">Sonntag</span>
                <span>12:00 - 21:00</span>
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10">
              <h5 className="text-xs uppercase tracking-widest text-[var(--gold)] font-poppins font-medium mb-3">Zahlungsmethoden</h5>
              <div className="flex gap-3 text-2xl opacity-70">
                💳 💰 📱
              </div>
            </div>
          </div>
        </div>

        {/* Luxury Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-xs font-inter">
            <p>© {new Date().getFullYear()} Nghia Demo. Alle Rechte vorbehalten.</p>
            <div className="flex gap-6">
              <Link href="/datenschutz" className="hover:text-[var(--gold)] transition-luxury">Datenschutz</Link>
              <Link href="/impressum" className="hover:text-[var(--gold)] transition-luxury">Impressum</Link>
              <Link href="/agb" className="hover:text-[var(--gold)] transition-luxury">AGB</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}