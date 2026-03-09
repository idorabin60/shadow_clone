import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

const footerLinks = [
    {
        title: 'שירותים',
        links: ['הגנה מפני איומים', 'אבטחת ענן', 'ניטור רציף', 'ייעוץ אבטחה'],
    },
    {
        title: 'חברה',
        links: ['אודותינו', 'הצוות שלנו', 'קריירה', 'בלוג'],
    },
    {
        title: 'משאבים',
        links: ['מרכז ידע', 'מדריכים', 'וובינרים', 'דוחות'],
    },
];

export default function Footer() {
    return (
        <footer className="relative pt-20 pb-8 overflow-hidden">
            <div className="absolute inset-0 bg-dark-900" />
            <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-neon-cyan/20 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <a href="#" className="flex items-center gap-3 mb-6">
                                <div className="bg-gradient-to-br from-neon-cyan to-neon-blue p-2.5 rounded-xl">
                                    <Shield className="w-6 h-6 text-dark-900" strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold tracking-tight text-white">ZeroTrust</span>
                                    <span className="text-[10px] font-medium text-neon-cyan/70 -mt-1 tracking-widest uppercase">Dynamics</span>
                                </div>
                            </a>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                                מובילים את מהפכת אבטחת הסייבר בישראל עם טכנולוגיה חדשנית
                                ופתרונות מותאמים אישית לכל ארגון.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <a href="mailto:info@zerotrust.co.il" className="flex items-center gap-3 text-sm text-gray-400 hover:text-neon-cyan transition-colors">
                                    <Mail className="w-4 h-4" />
                                    info@zerotrust.co.il
                                </a>
                                <a href="tel:+972-3-000-0000" className="flex items-center gap-3 text-sm text-gray-400 hover:text-neon-cyan transition-colors">
                                    <Phone className="w-4 h-4" />
                                    03-000-0000
                                </a>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <MapPin className="w-4 h-4" />
                                    תל אביב, ישראל
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Link Columns */}
                    {footerLinks.map((column, i) => (
                        <motion.div
                            key={column.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
                        >
                            <h4 className="text-sm font-bold text-white mb-4">{column.title}</h4>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-gray-400 hover:text-neon-cyan transition-colors duration-300">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © 2024 ZeroTrust Dynamics. כל הזכויות שמורות.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {[Linkedin, Twitter, Github].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-300"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}