import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, Wrench } from 'lucide-react';
import { cn } from '../lib/cn';

const navLinks = [
    { label: 'ראשי', href: '#hero' },
    { label: 'שירותים', href: '#services' },
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
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    'fixed top-0 right-0 left-0 z-50 transition-all duration-500',
                    scrolled
                        ? 'bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
                        : 'bg-transparent'
                )}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <a href="#hero" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-shadow duration-300">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-extrabold text-white tracking-tight leading-none">רוזן פרו</span>
                                <span className="text-[10px] font-medium text-orange-400 tracking-widest uppercase">AUTO SERVICE</span>
                            </div>
                        </a>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* CTA + Mobile Toggle */}
                        <div className="flex items-center gap-3">
                            <a
                                href="tel:+972501234567"
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-l from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
                            >
                                <Phone className="w-4 h-4" />
                                <span>050-123-4567</span>
                            </a>
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
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
                        className="fixed inset-0 z-40 pt-20 bg-[#0A0A0F]/95 backdrop-blur-2xl md:hidden"
                    >
                        <div className="flex flex-col items-center gap-2 p-6">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="w-full text-center py-4 text-lg font-bold text-slate-200 hover:text-orange-400 border-b border-white/5 transition-colors"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.a
                                href="tel:+972501234567"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 flex items-center gap-2 px-8 py-4 bg-gradient-to-l from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25"
                            >
                                <Phone className="w-5 h-5" />
                                <span>050-123-4567</span>
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}