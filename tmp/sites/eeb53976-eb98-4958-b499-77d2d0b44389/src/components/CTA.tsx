import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';

export default function CTA() {
    return (
        <section id="contact" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-dark-900" />

            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-neon-cyan/10 via-neon-blue/5 to-transparent" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-neon-purple/8 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-neon-green/5 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Outer glow */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-neon-cyan/20 via-neon-blue/10 to-neon-purple/20 rounded-3xl blur-2xl" />

                    <div className="relative glass-card p-12 md:p-16 text-center neon-border">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-blue mb-8"
                        >
                            <Sparkles className="w-8 h-8 text-dark-900" />
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                            <span className="text-white">מוכנים להגן על </span>
                            <span className="text-gradient-cyan">העסק שלכם?</span>
                        </h2>

                        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            קבלו ייעוץ חינם ממומחי האבטחה שלנו. נבנה עבורכם תוכנית הגנה
                            מותאמת אישית שתשמור על הנכסים הדיגיטליים שלכם.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative inline-flex items-center gap-2"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-l from-neon-cyan to-neon-blue rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                                <div className="relative bg-gradient-to-l from-neon-cyan to-neon-blue text-dark-900 px-10 py-4 rounded-2xl text-base font-bold flex items-center gap-2">
                                    תאמו שיחת ייעוץ
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </motion.a>

                            <motion.a
                                href="tel:+972-3-000-0000"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="glass-card px-10 py-4 rounded-2xl text-base font-medium text-gray-300 hover:text-white hover:border-white/20 transition-all duration-300"
                            >
                                03-000-0000
                            </motion.a>
                        </div>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-6 mt-10 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Shield className="w-4 h-4 text-neon-green" />
                                <span>ללא התחייבות</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Shield className="w-4 h-4 text-neon-green" />
                                <span>ייעוץ חינם</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Shield className="w-4 h-4 text-neon-green" />
                                <span>תגובה מהירה</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}