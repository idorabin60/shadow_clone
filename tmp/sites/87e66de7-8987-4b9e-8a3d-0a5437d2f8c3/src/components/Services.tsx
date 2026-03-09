import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Zap, Shield, Gauge, Droplet, Cog } from 'lucide-react';

const services = [
    {
        icon: Wrench,
        title: 'תיקון כללי',
        description: 'תיקון וטיפול בכל חלקי הרכב עם חלקים מקוריים',
        features: ['החלפת חלקים', 'תיקון מנוע', 'תיקון תיבת הילוכים'],
    },
    {
        icon: Zap,
        title: 'מערכות חשמל',
        description: 'אבחון וטיפול במערכות חשמל מורכבות',
        features: ['אבחון מחשב', 'החלפת סוללה', 'תיקון חיווט'],
    },
    {
        icon: Shield,
        title: 'בדיקות בטיחות',
        description: 'בדיקות מקיפות לבטיחות הרכב',
        features: ['בדיקת בלמים', 'בדיקת תאורה', 'בדיקת הגה'],
    },
    {
        icon: Gauge,
        title: 'כיוונון מנוע',
        description: 'כיוונון מדויק של מנוע הרכב',
        features: ['כיוונון דלק', 'כיוונון הצתה', 'בדיקת פליטות'],
    },
    {
        icon: Droplet,
        title: 'החלפת נוזלים',
        description: 'החלפת כל נוזלי הרכב בחומרים איכותיים',
        features: ['שמן מנוע', 'נוזל קירור', 'נוזל בלמים'],
    },
    {
        icon: Cog,
        title: 'תחזוקה תקופתית',
        description: 'תחזוקה קבועה להבטחת ביצועי הרכב',
        features: ['בדיקה שנתית', 'החלפת מסננים', 'כיוונון מערכות'],
    },
];

export const Services: React.FC = () => {
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
        <section id="services" className="section-padding bg-white">
            <div className="container-max">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
                        השירותים שלנו
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        מגוון שירותים מקצועיים לכל צרכי הרכב שלך
                    </p>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {services.map((service, idx) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="group p-8 rounded-2xl border-2 border-neutral-200 hover:border-brand-blue/50 bg-white hover:bg-blue-50/30 transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Icon size={28} className="text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-neutral-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-2">
                                    {service.features.map((feature, featureIdx) => (
                                        <li
                                            key={featureIdx}
                                            className="flex items-center gap-2 text-sm text-neutral-600"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <a
                                    href="#contact"
                                    className="mt-6 inline-flex items-center gap-2 text-brand-blue font-semibold hover:gap-3 transition-all duration-300"
                                >
                                    למידע נוסף
                                    <span>→</span>
                                </a>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-lg text-neutral-600 mb-6">
                        לא מצאת את השירות שחיפשת?
                    </p>
                    <a
                        href="#contact"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        צור קשר לשירות מותאם אישי
                    </a>
                </motion.div>
            </div>
        </section>
    );
};
