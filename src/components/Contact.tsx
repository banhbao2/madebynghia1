import { contactInfo } from '@/lib/constants'

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Visit Us
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Come experience authentic Vietnamese and Japanese cuisine
        </p>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h3>
            <div className="space-y-4">
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
          
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Opening Hours</h3>
            <div className="space-y-3">
              {contactInfo.openingHours.map((hours) => (
                <div key={hours.days} className="flex justify-between">
                  <span className="font-semibold text-gray-900">{hours.days}</span>
                  <span className="text-gray-600">{hours.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}