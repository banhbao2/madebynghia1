export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            About Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Where two culinary traditions come together
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Story</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded as a demonstration project, Nghia Demo showcases modern web development
                capabilities with a full-featured restaurant website built using Next.js and
                contemporary web technologies.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This project demonstrates real-world applications of modern frameworks, responsive
                design, and user-friendly interfaces.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Philosophy</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe in creating clean, efficient, and user-friendly web applications
                that demonstrate best practices in modern web development. This demo showcases
                features like online ordering, reservations, and admin management.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Quality code, modern design, and excellent user experience are at the heart of this project.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-10 text-center border border-orange-100">
            <h3 className="text-3xl font-bold mb-10 text-gray-900">What Makes Us Special</h3>
            <div className="grid md:grid-cols-3 gap-10 mt-6">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">🍜</div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Authentic Recipes</h4>
                <p className="text-gray-600">
                  Traditional methods and family recipes passed down through generations
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">🐟</div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Fresh Daily</h4>
                <p className="text-gray-600">
                  Premium ingredients delivered every morning from trusted suppliers
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">👨‍🍳</div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Expert Chefs</h4>
                <p className="text-gray-600">
                  Trained in Vietnam and Japan with decades of experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}