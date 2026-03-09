import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, Wrench } from 'lucide-react';

const navLinks = [
  { label: 'שירותים', href: '#services' },
  { label: 'יתרונות', href: '#why-us' },
  { label: 'תהליך', href: '#process' },
  { label: 'המלצות', href: '#testimonials' },
  { label: 'צור קשר', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-orange group-hover:shadow-glow-orange-lg transition-all duration-300">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <div className="font-black text-xl text-white leading-none tracking-tight">מוסך רונן</div>
                <div className="text-xs text-brand-400 font-medium tracking-wide">שירות מקצועי</div>
              </div>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-l from-brand-500 to-brand-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right rounded-full" />
                </motion.a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <motion.a
                href="tel:+972501234567"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-gradient-to-l from-brand-500 to-brand-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-glow-orange hover:shadow-glow-orange-lg transition-all duration-300 text-sm"
              >
                <Phone className="w-4 h-4" />
                050-123-4567
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 inset-x-0 z-40 bg-dark-800/95 backdrop-blur-xl border-b border-white/10 shadow-2xl md:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 text-white/80 hover:text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200 text-right"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="tel:+972501234567"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-l from-brand-500 to-brand-600 text-white font-bold px-6 py-3 rounded-xl shadow-glow-orange"
              >
                <Phone className="w-4 h-4" />
                050-123-4567
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
