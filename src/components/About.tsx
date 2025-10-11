export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            Über uns
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Wo kulinarische Tradition auf moderne Technologie trifft
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Unsere Geschichte</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Als Demonstrationsprojekt gegründet, zeigt Nghia Demo moderne Webentwicklungs-
                fähigkeiten mit einer vollständig ausgestatteten Restaurant-Website, die mit
                Next.js und zeitgenössischen Webtechnologien erstellt wurde.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Dieses Projekt demonstriert reale Anwendungen moderner Frameworks, responsives
                Design und benutzerfreundliche Oberflächen.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Unsere Philosophie</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Wir glauben an die Erstellung sauberer, effizienter und benutzerfreundlicher
                Webanwendungen, die Best Practices in der modernen Webentwicklung demonstrieren.
                Diese Demo zeigt Features wie Online-Bestellung, Reservierungen und Admin-Verwaltung.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Qualitätscode, modernes Design und exzellente Benutzererfahrung stehen im Mittelpunkt dieses Projekts.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-10 text-center border border-orange-100">
            <h3 className="text-3xl font-bold mb-10 text-gray-900">Was uns besonders macht</h3>
            <div className="grid md:grid-cols-3 gap-10 mt-6">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">🍜</div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Moderne Technologie</h4>
                <p className="text-gray-600">
                  Modernste Webtechnologien und bewährte Entwicklungsmethoden
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">🎨</div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Elegantes Design</h4>
                <p className="text-gray-600">
                  Ansprechendes und responsives Design für alle Geräte optimiert
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">⚡</div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Blitzschnell</h4>
                <p className="text-gray-600">
                  Optimierte Performance für schnelle Ladezeiten und flüssige Navigation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
