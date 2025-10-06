import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Specialties from '@/components/Specialties'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Specialties />
      <Footer />
    </div>
  )
}