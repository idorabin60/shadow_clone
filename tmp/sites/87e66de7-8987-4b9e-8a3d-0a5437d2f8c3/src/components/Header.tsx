import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

export const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { label: 'בעמוד הבית', href: '#' },
        { label: 'שירותים', href: '#services' },
        { label: 'על אודות', href: '#about' },
        { label: 'מחירים', href: '#pricing' },
        { label: 'ביקורות', href: '#reviews' },
        { label: 'צור קשר', href: '#contact' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/50">
            <div className="container-max h-20 flex items-center justify-between">
                {/* Logo */}
                <motion.a
                    href="#"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 flex-shrink-0"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">ר</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900 text-sm">מוסך רוזן</span>
                        <span className="text-xs text-brand-blue font-semibold">PRO</span>
                    </div>
                </motion.a>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link, idx) => (
                        <motion.a
                            key={idx}
                            href={link.href}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="text-neutral-700 hover:text-brand-blue font-medium transition-colors duration-300 text-sm"
                        >
                            {link.label}
                        </motion.a>
                    ))}
                </nav>

                {/* CTA Button */}
                <motion.a
                    href="tel:+972123456789"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold text-sm"
                >
                    <Phone size={16} />
                    התקשר עכשיו
                </motion.a>

                {/* Mobile Menu Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-300"
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <X size={24} className="text-neutral-900" />
                    ) : (
                        <Menu size={24} className="text-neutral-900" />
                    )}
                </motion.button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden border-t border-neutral-200/50 bg-white"
                    >
                        <nav className="container-max py-6 flex flex-col gap-4">
                            {navLinks.map((link, idx) => (
                                <motion.a
                                    key={idx}
                                    href={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    onClick={() => setIsOpen(false)}
                                    className="text-neutral-700 hover:text-brand-blue font-medium transition-colors duration-300 py-2"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.a
                                href="tel:+972123456789"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
                                className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
                            >
                                <Phone size={18} />
                                התקשר עכשיו
                            </motion.a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
