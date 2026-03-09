import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wrench, Phone } from 'lucide-react';
import { clsx } from 'clsx';

const navLinks = [
  { label: 'שירותים', href: '#services' },
  { label: 'אודות', href: '#about' },
  { label: 'יתרונות', href: '#why-us' },
  { label: 'גלריה', href: '#gallery' },
  { label: 'המלצות', href: '#testimonials' },
  { label: 'צור קשר', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-dark-900/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                  <Wrench className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 rounded-xl bg-brand-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold text-white tracking-tight">מוסך רונן</span>
                <span className="text-xs text-brand-400 font-medium tracking-widest uppercase">Auto Expert</span>
              </div>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
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
                  <span className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-l from-brand-400 to-brand-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
                </motion.a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.a
                href="tel:+972501234567"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-brand-500 to-brand-600 text-white text-sm font-bold shadow-glow hover:shadow-glow-lg transition-all duration-300 relative overflow-hidden shimmer-btn"
              >
                <Phone className="w-4 h-4" />
                <span>050-123-4567</span>
              </motion.a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl glass text-white"
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
            className="fixed inset-x-0 top-20 z-40 bg-dark-800/95 backdrop-blur-2xl border-b border-white/10 lg:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 font-medium transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="tel:+972501234567"
                className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-l from-brand-500 to-brand-600 text-white font-bold shadow-glow"
              >
                <Phone className="w-4 h-4" />
                <span>050-123-4567</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
