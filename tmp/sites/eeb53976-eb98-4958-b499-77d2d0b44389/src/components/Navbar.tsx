import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const navLinks = [
    { label: 'שירותים', href: '#services' },
    { label: 'אודות', href: '#about' },
    { label: 'פתרונות', href: '#solutions' },
    { label: 'לקוחות', href: '#testimonials' },
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
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    'fixed top-0 right-0 left-0 z-50 transition-all duration-500',
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
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#00f0ff]/20 rounded-xl blur-lg group-hover:bg-[#00f0ff]/40 transition-all duration-500" />
                                <div className="relative bg-gradient-to-br from-[#00f0ff] to-[#3366ff] p-2.5 rounded-xl">
                                    <Shield className="w-6 h-6 text-[#0a0a0f]" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight text-white">
                                    ZeroTrust
                                </span>
                                <span className="text-[10px] font-medium text-[#00f0ff]/70 -mt-1 tracking-widest uppercase">
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
                                    className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-l from-[#00f0ff] to-[#3366ff] group-hover:w-full transition-all duration-300" />
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
                                <div className="absolute -inset-0.5 bg-gradient-to-l from-[#00f0ff] to-[#3366ff] rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                                <div className="relative bg-gradient-to-l from-[#00f0ff] to-[#3366ff] text-[#0a0a0f] px-6 py-2.5 rounded-xl text-sm font-bold">
                                    התחל עכשיו
                                </div>
                            </motion.a>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden relative p-2 text-gray-300 hover:text-white transition-colors"
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
                        className="fixed inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-2xl pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-2xl font-bold text-gray-200 hover:text-[#00f0ff] py-3 border-b border-white/5 transition-colors"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.a
                                href="#contact"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => setMobileOpen(false)}
                                className="mt-6 bg-gradient-to-l from-[#00f0ff] to-[#3366ff] text-[#0a0a0f] px-8 py-4 rounded-xl text-lg font-bold text-center"
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