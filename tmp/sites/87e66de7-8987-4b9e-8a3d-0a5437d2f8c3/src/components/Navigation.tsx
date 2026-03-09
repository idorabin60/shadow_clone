import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

export const Navigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'בעמוד הבית', href: '#' },
        { label: 'שירותים', href: '#services' },
        { label: 'על אודות', href: '#about' },
        { label: 'מחירים', href: '#pricing' },
        { label: 'ביקורות', href: '#reviews' },
        { label: 'צור קשר', href: '#contact' },
    ];

    const menuVariants = {
        hidden: { opacity: 0, x: 300 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            x: 300,
            transition: { duration: 0.3 },
        },
    };

    const menuItemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 },
        },
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg'
                    : 'bg-transparent'
            }`}
        >
            <div className="container-max h-20 flex items-center justify-between">
                {/* Logo */}
                <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 z-10"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">ר</span>
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-bold text-sm transition-colors duration-300 ${
                            isScrolled ? 'text-neutral-900' : 'text-white'
                        }`}>
                            מוסך רוזן
                        </span>
                        <span className="text-xs text-brand-cyan font-semibold">PRO</span>
                    </div>
                </motion.a>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link, idx) => (
                        <motion.a
                            key={idx}
                            href={link.href}
                            whileHover={{ color: '#0066FF' }}
                            className={`font-semibold transition-colors duration-300 ${
                                isScrolled
                                    ? 'text-neutral-700 hover:text-brand-blue'
                                    : 'text-white hover:text-brand-cyan'
                            }`}
                        >
                            {link.label}
                        </motion.a>
                    ))}
                </nav>

                {/* CTA Button */}
                <motion.a
                    href="tel:+972123456789"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden lg:flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                    <Phone size={18} />
                    התקשר
                </motion.a>

                {/* Mobile Menu Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden z-10 p-2"
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <X size={24} className={isScrolled ? 'text-neutral-900' : 'text-white'} />
                    ) : (
                        <Menu size={24} className={isScrolled ? 'text-neutral-900' : 'text-white'} />
                    )}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="lg:hidden fixed top-20 left-0 right-0 bottom-0 bg-white shadow-lg overflow-y-auto"
                    >
                        <div className="container-max py-8 flex flex-col gap-6">
                            {navLinks.map((link, idx) => (
                                <motion.a
                                    key={idx}
                                    href={link.href}
                                    variants={menuItemVariants}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-semibold text-neutral-900 hover:text-brand-blue transition-colors duration-300 py-2"
                                >
                                    {link.label}
                                </motion.a>
                            ))}

                            <motion.div
                                variants={menuItemVariants}
                                className="pt-6 border-t border-neutral-200"
                            >
                                <a
                                    href="tel:+972123456789"
                                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                                >
                                    <Phone size={18} />
                                    התקשר עכשיו
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
