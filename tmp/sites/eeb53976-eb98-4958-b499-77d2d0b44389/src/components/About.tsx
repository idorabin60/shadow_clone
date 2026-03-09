import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const highlights = [
    'צוות מומחים עם ניסיון של 15+ שנים בתעשיית הסייבר',
    'שותפות אסטרטגית עם חברות טכנולוגיה מובילות בעולם',
    'מרכז מחקר ופיתוח ייעודי לאיומים מתקדמים',
    'תקני אבטחה בינלאומיים: ISO 27001, SOC 2, GDPR',
];

export default function About() {
    return (
        <section id="about" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-[#0f0f1a]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-radial-purple-light" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-br from-[#8b5cf6]/15 via-[#3366ff]/10 to-[#00f0ff]/15 rounded-3xl blur-3xl" />
                        <div className="relative rounded-3xl overflow-hidden neon-border">
                            <img
                                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
                                alt="צוות ZeroTrust Dynamics"
                                className="w-full h-[450px] object-cover rounded-3xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
                        </div>

                        {/* Floating stat card */}
                        <motion.div
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -bottom-6 -left-6 glass-card p-6 neon-glow"
                        >
                            <div className="text-3xl font-extrabold text-gradient-cyan">15+</div>
                            <div className="text-sm text-gray-400 mt-1">שנות ניסיון</div>
                        </motion.div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="inline-block text-sm font-semibold text-[#00f0ff] tracking-widest uppercase mb-4">
                            אודותינו
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                            <span className="text-white">מובילים את </span>
                            <span className="text-gradient-cyan">מהפכת הסייבר</span>
                        </h2>
                        <p className="text-lg text-gray-400 leading-relaxed mb-8">
                            ZeroTrust Dynamics הוקמה מתוך חזון ברור: ליצור עולם דיגיטלי בטוח יותר.
                            אנחנו משלבים טכנולוגיה חדשנית עם מומחיות עמוקה כדי לספק את ההגנה
                            המתקדמת ביותר לארגונים בישראל ובעולם.
                        </p>

                        <div className="space-y-4 mb-10">
                            {highlights.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-[#00ff88] mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300">{item}</span>
                                </motion.div>
                            ))}
                        </div>

                        <a
                            href="#contact"
                            className="group inline-flex items-center gap-2 text-[#00f0ff] font-semibold hover:gap-3 transition-all duration-300"
                        >
                            למד עוד על הצוות שלנו
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}