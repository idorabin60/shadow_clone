import { motion } from 'framer-motion';
import { CheckCircle2, Users, Calendar, Car } from 'lucide-react';

const stats = [
    { icon: Calendar, value: '15+', label: 'שנות ניסיון' },
    { icon: Car, value: '10,000+', label: 'רכבים טופלו' },
    { icon: Users, value: '5,000+', label: 'לקוחות מרוצים' },
    { icon: CheckCircle2, value: '100%', label: 'שביעות רצון' },
];

const features = [
    'ציוד אבחון ממוחשב מתקדם',
    'חלפים מקוריים בלבד',
    'אחריות מלאה על כל עבודה',
    'מחירים הוגנים ושקופים',
    'שירות איסוף והחזרה',
    'רכב חלופי בזמן הטיפול',
];

export default function About() {
    return (
        <section id="about" className="relative py-24 md:py-32 lg:py-40">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=800&q=80"
                                alt="צוות מוסך רוזן פרו"
                                className="w-full h-[500px] object-cover rounded-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/50 to-transparent" />
                        </div>

                        {/* Floating Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="absolute -bottom-8 -left-4 md:left-8 glass-card p-6 rounded-2xl shadow-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                    <Car className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">10,000+</div>
                                    <div className="text-sm text-slate-400">רכבים טופלו בהצלחה</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm font-medium text-orange-400 mb-6">
                            אודות המוסך
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
                            מקצועיות ואמינות
                            <br />
                            <span className="text-gradient">מאז 2009</span>
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed mb-8">
                            מוסך רוזן פרו הוקם מתוך אהבה לעולם הרכב ומחויבות לשירות ברמה הגבוהה ביותר.
                            אנחנו מאמינים בשקיפות מלאה, מחירים הוגנים ועבודה מקצועית שלא מתפשרת על איכות.
                        </p>

                        {/* Features List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                    <span className="text-sm font-medium text-slate-300">{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="glass-card p-4 rounded-xl text-center">
                                    <stat.icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                                    <div className="text-xl font-black text-white">{stat.value}</div>
                                    <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}