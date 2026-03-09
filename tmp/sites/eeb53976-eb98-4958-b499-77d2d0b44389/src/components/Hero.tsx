import { motion } from 'framer-motion';
import { ArrowLeft, Play, ShieldCheck, Lock, Zap } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0">
                {/* Deep gradient base */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]" />

                {/* Radial glow - top right */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-radial-cyan" />

                {/* Radial glow - bottom left */}
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-radial-purple" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Floating orbs */}
                <motion.div
                    animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                />
                <motion.div
                    animate={{ y: [15, -15, 15], x: [10, -10, 10] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-[#8b5cf6] rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                />
                <motion.div
                    animate={{ y: [10, -20, 10] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-[#00ff88] rounded-full shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="text-right">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded-full px-5 py-2 mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
                            </span>
                            <span className="text-sm font-medium text-[#00f0ff]">
                                הגנת סייבר מהדור הבא
                            </span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
                        >
                            <span className="text-white">אבטחה ללא</span>
                            <br />
                            <span className="text-gradient-cyan">פשרות</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl mb-10"
                        >
                            פלטפורמת אבטחת הסייבר המתקדמת ביותר בישראל. אנחנו מגנים על הנכסים
                            הדיגיטליים שלכם עם טכנולוגיית Zero Trust מבוססת בינה מלאכותית,
                            24/7.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.45 }}
                            className="flex flex-wrap gap-4"
                        >
                            <a
                                href="#contact"
                                className="group relative inline-flex items-center gap-2"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-l from-[#00f0ff] to-[#3366ff] rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                                <div className="relative bg-gradient-to-l from-[#00f0ff] to-[#3366ff] text-[#0a0a0f] px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-2 transition-transform duration-300 group-hover:scale-[1.02]">
                                    קבל הדגמה חינם
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </a>
                            <a
                                href="#about"
                                className="group inline-flex items-center gap-3 glass-card px-8 py-4 rounded-2xl text-base font-medium text-gray-300 hover:text-white hover:border-white/20 transition-all duration-300"
                            >
                                <div className="bg-white/10 rounded-full p-2">
                                    <Play className="w-4 h-4 fill-current" />
                                </div>
                                צפה בסרטון
                            </a>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="flex items-center gap-8 mt-12 pt-8 border-t border-white/5"
                        >
                            <div className="text-center">
                                <div className="text-2xl font-extrabold text-white">500+</div>
                                <div className="text-xs text-gray-500 mt-1">לקוחות מוגנים</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-center">
                                <div className="text-2xl font-extrabold text-white">99.9%</div>
                                <div className="text-xs text-gray-500 mt-1">זמן פעילות</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-center">
                                <div className="text-2xl font-extrabold text-white">24/7</div>
                                <div className="text-xs text-gray-500 mt-1">ניטור רציף</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual / Image Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        {/* Glow behind image */}
                        <div className="absolute -inset-4 bg-gradient-to-br from-[#00f0ff]/20 via-[#3366ff]/10 to-[#8b5cf6]/20 rounded-3xl blur-3xl" />

                        {/* Main Image */}
                        <div className="relative rounded-3xl overflow-hidden neon-border">
                            <img
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
                                alt="Cybersecurity Operations Center"
                                className="w-full h-[500px] object-cover rounded-3xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-[#0a0a0f]/20 to-transparent" />

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute top-6 right-6 glass-card p-4 flex items-center gap-3"
                            >
                                <div className="bg-[#00ff88]/20 p-2 rounded-xl">
                                    <ShieldCheck className="w-5 h-5 text-[#00ff88]" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">מערכת מאובטחת</div>
                                    <div className="text-xs text-gray-400">כל המערכות תקינות</div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [5, -5, 5] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute bottom-6 left-6 glass-card p-4 flex items-center gap-3"
                            >
                                <div className="bg-[#00f0ff]/20 p-2 rounded-xl">
                                    <Lock className="w-5 h-5 text-[#00f0ff]" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">הצפנה מלאה</div>
                                    <div className="text-xs text-gray-400">AES-256 bit</div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [-8, 8, -8] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute top-1/2 left-6 -translate-y-1/2 glass-card p-3"
                            >
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-[#00f0ff]" />
                                    <span className="text-xs font-bold text-[#00f0ff]">AI Active</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}