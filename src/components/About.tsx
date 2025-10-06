export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          About Us
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Where two culinary traditions come together
        </p>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Story</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded with a passion for bringing the best of Asian cuisine to your table, 
                Pho & Sushi combines the aromatic depths of Vietnamese cooking with the refined 
                artistry of Japanese sushi preparation.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our chefs bring decades of experience from Hanoi to Tokyo, ensuring every dish 
                honors its cultural roots while delighting modern palates.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Philosophy</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe in using only the freshest ingredients, traditional cooking methods, 
                and authentic recipes passed down through generations. Every bowl of pho is 
                simmered for hours, and every piece of sushi is crafted with precision.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Quality, authenticity, and hospitality are at the heart of everything we do.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">What Makes Us Special</h3>
            <div className="grid md:grid-cols-3 gap-8 mt-6">
              <div>
                <div className="text-4xl mb-2">🍜</div>
                <h4 className="font-bold text-gray-900 mb-2">Authentic Recipes</h4>
                <p className="text-gray-600 text-sm">
                  Traditional methods and family recipes
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">🐟</div>
                <h4 className="font-bold text-gray-900 mb-2">Fresh Daily</h4>
                <p className="text-gray-600 text-sm">
                  Premium ingredients delivered every morning
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">👨‍🍳</div>
                <h4 className="font-bold text-gray-900 mb-2">Expert Chefs</h4>
                <p className="text-gray-600 text-sm">
                  Trained in Vietnam and Japan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}