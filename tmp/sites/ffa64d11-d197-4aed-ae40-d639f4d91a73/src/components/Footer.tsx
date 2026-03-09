import { motion } from 'framer-motion';
import { Wrench, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const quickLinks = [
    { label: 'ראשי', href: '#hero' },
    { label: 'שירותים', href: '#services' },
    { label: 'אודות', href: '#about' },
    { label: 'המלצות', href: '#testimonials' },
    { label: 'צור קשר', href: '#contact' },
];

export default function Footer() {
    return (
        <footer className="relative border-t border-white/5">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-[#0A0A0F] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2"
                    >
                        <a href="#hero" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-extrabold text-white tracking-tight leading-none">רוזן פרו</span>
                                <span className="text-[10px] font-medium text-orange-400 tracking-widest uppercase">AUTO SERVICE</span>
                            </div>
                        </a>
                        <p className="text-slate-400 leading-relaxed max-w-md mb-6">
                            מוסך רוזן פרו - שירותי רכב מקצועיים ברמה הגבוהה ביותר.
                            מקצועיות, אמינות ושקיפות מלאה מאז 2009.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/30 transition-all duration-300"
                            >
                                <Facebook className="w-4 h-4 text-slate-400 hover:text-orange-400" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/30 transition-all duration-300"
                            >
                                <Instagram className="w-4 h-4 text-slate-400 hover:text-orange-400" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h4 className="text-white font-bold mb-6">ניווט מהיר</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-slate-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className="text-white font-bold mb-6">פרטי התקשרות</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                <a href="tel:+972501234567" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                                    050-123-4567
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                <a href="mailto:info@rosen-pro.co.il" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                                    info@rosen-pro.co.il
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-400 text-sm">
                                    רחוב התעשייה 15, חולון
                                </span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} מוסך רוזן פרו. כל הזכויות שמורות.
                    </p>
                    <p className="text-sm text-slate-600">
                        עוצב ופותח עם ❤️
                    </p>
                </div>
            </div>
        </footer>
    );
}