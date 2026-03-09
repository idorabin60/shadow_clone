import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { label: 'שירותים', href: '#services' },
  { label: 'אודות', href: '#about' },
  { label: 'טכנולוגיה', href: '#technology' },
  { label: 'לקוחות', href: '#clients' },
  { label: 'צור קשר', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-xl group-hover:bg-cyan-500/30 transition-all" />
                <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  ZeroTrust
                </span>
                <span className="text-[10px] font-medium text-cyan-400/80 -mt-1 tracking-widest uppercase">
                  Dynamics
                </span>
              </div>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-l from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <motion.a
                href="#contact"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-l from-cyan-500 to-blue-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-l from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl">
                  התחל עכשיו
                </div>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative p-2 rounded-xl glass"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
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
            className="fixed inset-0 z-40 pt-24 bg-[#0a0a0f]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-bold text-gray-200 hover:text-cyan-400 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setMobileOpen(false)}
                className="mt-4 bg-gradient-to-l from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-xl"
              >
                התחל עכשיו
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}