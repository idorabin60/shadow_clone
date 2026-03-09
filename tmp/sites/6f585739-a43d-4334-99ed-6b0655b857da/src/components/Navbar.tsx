import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '../lib/cn';

const navLinks = [
  { label: 'ראשי', href: '#hero' },
  { label: 'אודות', href: '#about' },
  { label: 'שירותים', href: '#services' },
  { label: 'פרויקטים', href: '#projects' },
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
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 right-0 left-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg gold-shimmer flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-[#0A0A0A] font-black text-lg">א</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#F5F0E8] tracking-tight">אטלס עיצובים</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#BF9B51]">Interior Design Studio</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-[#8A8578] hover:text-[#F5F0E8] transition-colors duration-300 rounded-lg hover:bg-white/[0.03] relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 right-4 left-4 h-px bg-gradient-to-r from-[#8B6914] via-[#BF9B51] to-[#D4AF61] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
                </a>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
              <a
                href="#contact"
                className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full gold-shimmer text-[#0A0A0A] font-bold text-sm hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(191,155,81,0.3)]"
              >
                <Phone className="w-4 h-4" />
                <span>ייעוץ חינם</span>
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-[#F5F0E8] hover:bg-white/[0.05] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
            className="fixed inset-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-bold text-[#F5F0E8] py-4 border-b border-white/[0.06] hover:text-[#BF9B51] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setMobileOpen(false)}
                className="mt-6 flex items-center justify-center gap-2 px-8 py-4 rounded-full gold-shimmer text-[#0A0A0A] font-bold text-lg"
              >
                <Phone className="w-5 h-5" />
                <span>ייעוץ חינם</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}