import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'ניווט',
            links: [
                { label: 'בעמוד הבית', href: '#' },
                { label: 'שירותים', href: '#services' },
                { label: 'על אודות', href: '#about' },
                { label: 'מחירים', href: '#pricing' },
            ],
        },
        {
            title: 'שירותים',
            links: [
                { label: 'תיקון כללי', href: '#services' },
                { label: 'מערכות חשמל', href: '#services' },
                { label: 'בדיקות בטיחות', href: '#services' },
                { label: 'תחזוקה תקופתית', href: '#services' },
            ],
        },
        {
            title: 'משפטי',
            links: [
                { label: 'תנאי שימוש', href: '#' },
                { label: 'מדיניות פרטיות', href: '#' },
                { label: 'מדיניות עוגיות', href: '#' },
            ],
        },
    ];

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    return (
        <footer className="bg-neutral-900 text-white">
            {/* Main Footer */}
            <div className="section-padding border-b border-neutral-800">
                <div className="container-max">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12"
                    >
                        {/* Brand Section */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-1"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">ר</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-sm">מוסך רוזן</span>
                                    <span className="text-xs text-brand-cyan font-semibold">PRO</span>
                                </div>
                            </div>
                            <p className="text-neutral-400 text-sm mb-6">
                                מוסך מקצועי עם ניסיון של 15+ שנים בתחום תיקול וטיפול רכבים.
                            </p>
                            <div className="flex gap-4">
                                {socialLinks.map((social, idx) => {
                                    const Icon = social.icon;
                                    return (
                                        <motion.a
                                            key={idx}
                                            href={social.href}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-brand-blue flex items-center justify-center transition-colors duration-300"
                                            aria-label={social.label}
                                        >
                                            <Icon size={18} />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Links Sections */}
                        {footerLinks.map((section, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                            >
                                <h4 className="font-bold text-white mb-6">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <a
                                                href={link.href}
                                                className="text-neutral-400 hover:text-brand-cyan transition-colors duration-300 text-sm"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}

                        {/* Contact Section */}
                        <motion.div
                            variants={itemVariants}
                        >
                            <h4 className="font-bold text-white mb-6">
                                צור קשר
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <Phone size={18} className="text-brand-cyan flex-shrink-0" />
                                    <a
                                        href="tel:+972123456789"
                                        className="text-neutral-400 hover:text-brand-cyan transition-colors duration-300 text-sm"
                                    >
                                        03-123-4567
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail size={18} className="text-brand-cyan flex-shrink-0" />
                                    <a
                                        href="mailto:info@rozengarage.co.il"
                                        className="text-neutral-400 hover:text-brand-cyan transition-colors duration-300 text-sm"
                                    >
                                        info@rozengarage.co.il
                                    </a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin size={18} className="text-brand-cyan flex-shrink-0 mt-0.5" />
                                    <span className="text-neutral-400 text-sm">
                                        רחוב הטכנולוגיה 10<br />
                                        תל אביב
                                    </span>
                                </li>
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Newsletter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-brand-blue/20 to-brand-cyan/20 rounded-2xl p-8 border border-neutral-800"
                    >
                        <h3 className="text-xl font-bold text-white mb-2">
                            הישאר מעודכן
                        </h3>
                        <p className="text-neutral-400 mb-6">
                            קבל עדכונים על שירותים חדשים והצעות מיוחדות
                        </p>
                        <form className="flex gap-3">
                            <input
                                type="email"
                                placeholder="הכנס את דוא&quot;לך"
                                className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-brand-blue focus:outline-none transition-colors duration-300"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-brand-blue hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300"
                            >
                                הרשם
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="section-padding-sm"
            >
                <div className="container-max flex flex-col md:flex-row items-center justify-between gap-6 text-neutral-400 text-sm">
                    <p>
                        © {currentYear} מוסך רוזן PRO. כל הזכויות שמורות.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-brand-cyan transition-colors duration-300">
                            תנאי שימוש
                        </a>
                        <a href="#" className="hover:text-brand-cyan transition-colors duration-300">
                            מדיניות פרטיות
                        </a>
                        <a href="#" className="hover:text-brand-cyan transition-colors duration-300">
                            מפת אתר
                        </a>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
};
