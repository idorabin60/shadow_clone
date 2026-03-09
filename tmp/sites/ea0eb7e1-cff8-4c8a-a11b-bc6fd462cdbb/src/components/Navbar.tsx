import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'אודות', href: '#about' },
  { label: 'שירותים', href: '#services' },
  { label: 'למה אנחנו', href: '#why-us' },
  { label: 'המלצות', href: '#testimonials' },
  { label: 'צור קשר', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A0F1C]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20'
            : 'bg-[#0A0F1C]/60 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                מוסך רוזן <span className="text-gradient-blue">פרו</span>
              </span>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gradient-to-l from-blue-500 to-blue-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-gradient-to-l from-amber-500 to-amber-600 text-black font-bold px-6 py-2.5 text-sm rounded-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                קבעו תור עכשיו
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-8"
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                onClick={() => setIsOpen(false)}
                className="mt-4 inline-flex items-center gap-2 bg-gradient-to-l from-amber-500 to-amber-600 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-lg shadow-amber-500/25"
              >
                <Phone className="w-5 h-5" />
                קבעו תור עכשיו
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
