import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}

export default App
