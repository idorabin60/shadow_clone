import { motion } from 'framer-motion';
import { Shield, Brain, Eye, Lock, Wifi, Fingerprint } from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: 'הגנה מתקדמת מפני איומים',
        description: 'מערכת הגנה רב-שכבתית המזהה ומנטרלת איומים בזמן אמת, עוד לפני שהם מגיעים לרשת שלכם.',
        color: 'from-[#00f0ff] to-[#3366ff]',
        glowColor: 'rgba(0, 240, 255, 0.15)',
    },
    {
        icon: Brain,
        title: 'בינה מלאכותית לאבטחה',
        description: 'אלגוריתמי AI מתקדמים שלומדים את דפוסי הפעילות ברשת ומזהים חריגות באופן אוטומטי.',
        color: 'from-[#8b5cf6] to-[#3366ff]',
        glowColor: 'rgba(139, 92, 246, 0.15)',
    },
    {
        icon: Eye,
        title: 'ניטור 24/7',
        description: 'מרכז תפעול אבטחה (SOC) פעיל מסביב לשעון עם צוות מומחים שמגיב לכל אירוע בזמן אמת.',
        color: 'from-[#00ff88] to-[#00f0ff]',
        glowColor: 'rgba(0, 255, 136, 0.15)',
    },
    {
        icon: Lock,
        title: 'Zero Trust Architecture',
        description: 'ארכיטקטורת אפס אמון שמוודאת כל גישה, בכל פעם, ללא יוצא מן הכלל.',
        color: 'from-[#00f0ff] to-[#00ff88]',
        glowColor: 'rgba(0, 240, 255, 0.15)',
    },
    {
        icon: Wifi,
        title: 'אבטחת רשת מלאה',
        description: 'הגנה מקיפה על כל נקודות הקצה, הרשתות והשרתים שלכם עם פתרון אחד מאוחד.',
        color: 'from-[#3366ff] to-[#8b5cf6]',
        glowColor: 'rgba(51, 102, 255, 0.15)',
    },
    {
        icon: Fingerprint,
        title: 'אימות מתקדם',
        description: 'מערכת אימות רב-גורמית (MFA) עם זיהוי ביומטרי ואנליטיקה התנהגותית.',
        color: 'from-[#8b5cf6] to-[#00f0ff]',
        glowColor: 'rgba(139, 92, 246, 0.15)',
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
};

export default function Features() {
    return (
        <section id="services" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[#0f0f1a]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-radial-blue" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block text-sm font-semibold text-[#00f0ff] tracking-widest uppercase mb-4">
                        השירותים שלנו
                    </span>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        <span className="text-white">הגנה מקיפה </span>
                        <span className="text-gradient-cyan">לעולם הדיגיטלי</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        פתרונות אבטחת סייבר מתקדמים שמותאמים לצרכים הייחודיים של הארגון שלכם
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="group relative"
                        >
                            {/* Hover glow */}
                            <div
                                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                                style={{ background: feature.glowColor }}
                            />

                            <div className="relative glass-card-hover p-8 h-full">
                                {/* Icon */}
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                                    <feature.icon className="w-6 h-6 text-[#0a0a0f]" strokeWidth={2} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00f0ff] transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}