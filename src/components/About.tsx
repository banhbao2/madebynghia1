export default function About() {
  return (
    <section id="about" className="relative py-24 bg-gradient-to-b from-white via-teal-50/20 to-white overflow-hidden scroll-mt-24">
      {/* Decorative elements */}
      <div className="absolute top-10 left-0 w-full h-full pattern-grid opacity-20" />
      <div className="absolute top-32 left-20 w-72 h-72 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-float animation-delay-300" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="text-5xl md:text-6xl animate-float animation-delay-200">🎨</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5">
            <span className="gradient-text-ocean">Über uns</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Wo kulinarische Tradition auf moderne Technologie trifft
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-teal-100 shadow-lg hover-lift animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">Unsere Geschichte</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Als Demonstrationsprojekt gegründet, zeigt Nghia Demo moderne Webentwicklungs-
                fähigkeiten mit einer vollständig ausgestatteten Restaurant-Website, die mit
                Next.js und zeitgenössischen Webtechnologien erstellt wurde.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Dieses Projekt demonstriert reale Anwendungen moderner Frameworks, responsives
                Design und benutzerfreundliche Oberflächen.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-100 shadow-lg hover-lift animate-fade-in-up animation-delay-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">Unsere Philosophie</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Wir glauben an die Erstellung sauberer, effizienter und benutzerfreundlicher
                Webanwendungen, die Best Practices in der modernen Webentwicklung demonstrieren.
                Diese Demo zeigt Features wie Online-Bestellung, Reservierungen und Admin-Verwaltung.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Qualitätscode, modernes Design und exzellente Benutzererfahrung stehen im Mittelpunkt dieses Projekts.
              </p>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-3xl p-10 md:p-12 text-center border-2 border-orange-200 shadow-2xl overflow-hidden animate-fade-in-up animation-delay-400">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 pattern-dots opacity-10" />

            <div className="relative z-10">
              <div className="inline-block mb-6">
                <span className="text-5xl animate-float">✨</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-10 gradient-text">Was uns besonders macht</h3>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-6">
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-red-200">
                  <div className="text-6xl mb-5 group-hover:scale-110 transition-transform">🍜</div>
                  <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-4 rounded-full" />
                  <h4 className="font-extrabold text-gray-900 mb-3 text-xl">Moderne Technologie</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Modernste Webtechnologien und bewährte Entwicklungsmethoden
                  </p>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-purple-200">
                  <div className="text-6xl mb-5 group-hover:scale-110 transition-transform">🎨</div>
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 rounded-full" />
                  <h4 className="font-extrabold text-gray-900 mb-3 text-xl">Elegantes Design</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Ansprechendes und responsives Design für alle Geräte optimiert
                  </p>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-yellow-200">
                  <div className="text-6xl mb-5 group-hover:scale-110 transition-transform">⚡</div>
                  <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mb-4 rounded-full" />
                  <h4 className="font-extrabold text-gray-900 mb-3 text-xl">Blitzschnell</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Optimierte Performance für schnelle Ladezeiten und flüssige Navigation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
