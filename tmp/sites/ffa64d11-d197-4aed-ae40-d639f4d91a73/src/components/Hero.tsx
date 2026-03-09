import { motion } from 'framer-motion';
import { Phone, ArrowDown, Shield, Clock, Award } from 'lucide-react';

const badges = [
    { icon: Shield, label: 'אחריות מלאה' },
    { icon: Clock, label: 'שירות מהיר' },
    { icon: Award, label: '15+ שנות ניסיון' },
];

export default function Hero() {
    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1920&q=80"
                    alt="מוסך מקצועי"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0F] via-[#0A0A0F]/90 to-[#0A0A0F]/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-[#0A0A0F]/50" />
            </div>

            {/* Decorative Glow */}
            <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-32 md:py-40">
                <div className="max-w-4xl">
                    {/* Top Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-sm font-medium text-orange-400">מוסך מוסמך ומורשה</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
                    >
                        <span className="text-white">הרכב שלך</span>
                        <br />
                        <span className="text-gradient">ראוי לטיפול</span>
                        <br />
                        <span className="text-white">הכי טוב</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mb-10"
                    >
                        מוסך רוזן פרו מספק שירותי תיקון ואחזקה ברמה הגבוהה ביותר.
                        צוות המכונאים המומחים שלנו ידאג לרכב שלך כאילו היה שלהם.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-wrap gap-4 mb-16"
                    >
                        <a
                            href="tel:+972501234567"
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-l from-orange-500 to-orange-600 text-white font-bold text-lg rounded-2xl hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
                        >
                            <Phone className="w-5 h-5 group-hover:animate-pulse" />
                            <span>התקשרו עכשיו</span>
                        </a>
                        <a
                            href="#services"
                            className="flex items-center gap-3 px-8 py-4 glass-card glass-card-hover text-white font-bold text-lg rounded-2xl hover:scale-105"
                        >
                            <span>השירותים שלנו</span>
                            <ArrowDown className="w-5 h-5" />
                        </a>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                        className="flex flex-wrap gap-6"
                    >
                        {badges.map((badge) => (
                            <div key={badge.label} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <badge.icon className="w-5 h-5 text-orange-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-300">{badge.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-slate-500 font-medium">גלול למטה</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                </motion.div>
            </motion.div>
        </section>
    );
}