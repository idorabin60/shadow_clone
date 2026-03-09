import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'שירותים', href: '#services' },
    { label: 'למה בחרו בנו', href: '#why' },
    { label: 'ביקורות', href: '#testimonials' },
    { label: 'תמחור', href: '#pricing' },
    { label: 'צור קשר', href: '#contact' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">ר</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold text-white">מוסך רוזן פרו</h1>
              <p className="text-xs text-blue-400">שירות מקצועי</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ color: '#0ea5e9' }}
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium text-sm"
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            קבל הצעה
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 border-t border-white/10"
          >
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                {item.label}
              </motion.a>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg"
            >
              קבל הצעה
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
