import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, Wrench } from 'lucide-react';

const navLinks = [
  { label: 'שירותים', href: '#services' },
  { label: 'אודות', href: '#about' },
  { label: 'יתרונות', href: '#why-us' },
  { label: 'המלצות', href: '#testimonials' },
  { label: 'גלריה', href: '#gallery' },
  { label: 'צור קשר', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-dark-900/80 backdrop-blur-2xl border-b border-white/8 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                  <Wrench className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
              </div>
              <div className="text-right">
                <span className="block font-heebo font-black text-xl text-white leading-none tracking-tight">
                  מוסך רונן
                </span>
                <span className="block text-xs text-orange-400 font-assistant font-medium tracking-wide">
                  שירות רכב מקצועי
                </span>
              </div>
            </motion.a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" dir="rtl">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="relative px-4 py-2 text-sm font-assistant font-medium text-white/70 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 group"
                >
                  {link.label}
                  <span className="absolute bottom-1 right-4 left-4 h-px bg-gradient-to-r from-orange-500 to-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
                </motion.button>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <motion.a
                href="tel:+972501234567"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-heebo font-bold text-sm shadow-glow hover:shadow-glow-lg transition-all duration-300 relative overflow-hidden shimmer-btn"
              >
                <Phone className="w-4 h-4" />
                <span>050-123-4567</span>
              </motion.a>

              {/* Mobile menu toggle */}
              <motion.button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl glass text-white"
                whileTap={{ scale: 0.9 }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[72px] z-40 bg-dark-800/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl lg:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-1" dir="rtl">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-right px-4 py-3 text-base font-assistant font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.a
                href="tel:+972501234567"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-heebo font-bold shadow-glow"
              >
                <Phone className="w-4 h-4" />
                <span>050-123-4567</span>
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
