import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Specialties from '@/components/Specialties'
import TrustBadges from '@/components/TrustBadges'
import HowItWorks from '@/components/HowItWorks'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[60px] md:pt-[68px]">
        <Hero />
      <TrustBadges />
      <Specialties />
      <HowItWorks />
      <About />
      <Contact />
      <Footer />
      </main>
    </div>
  )
}