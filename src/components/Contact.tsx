import { contactInfo } from '@/lib/constants'

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            Visit Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch - this is a demo project showcasing modern web development
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Contact Information</h3>
            <div className="space-y-6">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Address</p>
                <a 
                  href={contactInfo.addressLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  {contactInfo.address}
                </a>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Phone</p>
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Email</p>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Follow Us</p>
                <div className="flex gap-4 mt-2">
                  {contactInfo.social.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-red-600 transition"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Opening Hours</h3>
            <div className="space-y-4">
              {contactInfo.openingHours.map((hours) => (
                <div key={hours.days} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <span className="font-bold text-gray-900 text-lg">{hours.days}</span>
                  <span className="text-gray-600 font-medium">{hours.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}