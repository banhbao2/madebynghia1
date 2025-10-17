import { contactInfo } from '@/lib/constants'

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 bg-gradient-to-br from-white via-pink-50/30 to-orange-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pattern-grid opacity-10" />
      <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-pink-200/40 to-orange-200/40 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-red-200/40 rounded-full blur-3xl animate-float animation-delay-300" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="text-5xl md:text-6xl animate-float">📞</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5">
            <span className="gradient-text-sunset">Besuchen Sie uns</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Kontaktieren Sie uns - dies ist ein Demo-Projekt, das moderne Webentwicklung präsentiert
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-orange-100 hover-lift animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">Kontaktinformationen</h3>
            </div>
            <div className="space-y-6">
              <div className="group p-4 rounded-xl hover:bg-orange-50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">Adresse</p>
                    <a
                      href={contactInfo.addressLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-red-600 transition text-lg font-medium"
                    >
                      {contactInfo.address}
                    </a>
                  </div>
                </div>
              </div>

              <div className="group p-4 rounded-xl hover:bg-orange-50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📱</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">Telefon</p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-gray-700 hover:text-red-600 transition text-lg font-medium"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="group p-4 rounded-xl hover:bg-orange-50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">✉️</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">E-Mail</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-700 hover:text-red-600 transition text-lg font-medium"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
                <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="text-xl">🌐</span>
                  Folgen Sie uns
                </p>
                <div className="flex gap-3 flex-wrap">
                  {contactInfo.social.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white rounded-lg text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 transition-all font-medium shadow-sm hover:shadow-lg"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-pink-100 hover-lift animate-fade-in-up animation-delay-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🕐</span>
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">Öffnungszeiten</h3>
            </div>
            <div className="space-y-3">
              {contactInfo.openingHours.map((hours, index) => (
                <div
                  key={hours.days}
                  className="group flex justify-between items-center p-4 rounded-xl hover:bg-pink-50 transition-all border-2 border-transparent hover:border-pink-200"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl group-hover:scale-110 transition-transform">📅</span>
                    <span className="font-extrabold text-gray-900 text-lg">{hours.days}</span>
                  </div>
                  <span className="text-gray-700 font-bold bg-white px-4 py-2 rounded-lg shadow-sm group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-red-500 group-hover:text-white transition-all">
                    {hours.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
