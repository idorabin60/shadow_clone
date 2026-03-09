import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '../lib/utils';

const navLinks = [
  { label: 'ראשי', href: '#hero' },
  { label: 'שירותים', href: '#services' },
  { label: 'פרויקטים', href: '#projects' },
  { label: 'אודות', href: '#about' },
  { label: 'המלצות', href: '#testimonials' },
  { label: 'צור קשר', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 right-0 left-0 z-50 transition-all duration-500',
          scrolled
            ? 'glass-card shadow-2xl py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
              <span className="text-[#0A0A0A] font-black text-lg">א</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[--text-primary] leading-tight">אטלס עיצובים</span>
              <span className="text-[10px] font-light text-[--text-muted] tracking-widest uppercase">Interior Design Studio</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wider uppercase text-[--text-secondary] hover:text-[--accent-gold] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-[--accent-gold] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+972501234567"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full gold-gradient text-[#0A0A0A] text-sm font-medium tracking-wide hover:shadow-lg hover:shadow-[--accent-gold]/20 transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>התקשרו עכשיו</span>
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[--text-primary]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-bold text-[--text-primary] hover:text-[--accent-gold] transition-colors border-b border-[--glass-border] pb-4"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="tel:+972501234567"
                className="mt-4 flex items-center justify-center gap-2 px-6 py-4 rounded-full gold-gradient text-[#0A0A0A] text-lg font-bold"
              >
                <Phone className="w-5 h-5" />
                <span>התקשרו עכשיו</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}