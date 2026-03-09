import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const pricingPlans = [
    {
        name: 'בדיקה בסיסית',
        price: '₪199',
        period: 'חד פעמי',
        description: 'בדיקה כללית של הרכב',
        features: [
            'בדיקת מנוע',
            'בדיקת בלמים',
            'בדיקת תאורה',
            'דוח מפורט',
        ],
        highlighted: false,
    },
    {
        name: 'תחזוקה שנתית',
        price: '₪1,299',
        period: 'לשנה',
        description: 'תחזוקה מלאה וקבועה',
        features: [
            'בדיקה מקיפה',
            'החלפת שמן',
            'החלפת מסננים',
            'כיוונון מערכות',
            'דוח מפורט',
            'עדיפות בתיקונים',
        ],
        highlighted: true,
    },
    {
        name: 'חבילת VIP',
        price: '₪2,499',
        period: 'לשנה',
        description: 'שירות מלא עם עדיפות מקסימלית',
        features: [
            'כל השירותים בחבילה הקודמת',
            'שירות חירום 24/7',
            'הנחה 20% על כל תיקון',
            'בדיקה רבעונית',
            'החלפת חלקים בחינם',
            'שירות הובלה חינם',
        ],
        highlighted: false,
    },
];

export const Pricing: React.FC = () => {
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
        <section id="pricing" className="section-padding bg-white">
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
                        תוכניות תמחור
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        בחר את התוכנית המתאימה לצרכיך
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                >
                    {pricingPlans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className={`relative rounded-2xl p-8 transition-all duration-300 ${
                                plan.highlighted
                                    ? 'bg-gradient-to-br from-brand-blue to-brand-cyan text-white border-2 border-brand-blue shadow-2xl scale-105'
                                    : 'bg-white border-2 border-neutral-200 hover:border-brand-blue/50'
                            }`}
                        >
                            {/* Badge */}
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-orange text-white rounded-full text-sm font-bold">
                                    הפופולרי ביותר
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className={`text-2xl font-bold mb-2 ${
                                plan.highlighted ? 'text-white' : 'text-neutral-900'
                            }`}>
                                {plan.name}
                            </h3>

                            {/* Description */}
                            <p className={`text-sm mb-6 ${
                                plan.highlighted ? 'text-blue-100' : 'text-neutral-600'
                            }`}>
                                {plan.description}
                            </p>

                            {/* Price */}
                            <div className="mb-8">
                                <div className={`text-4xl font-bold mb-1 ${
                                    plan.highlighted ? 'text-white' : 'text-neutral-900'
                                }`}>
                                    {plan.price}
                                </div>
                                <p className={`text-sm ${
                                    plan.highlighted ? 'text-blue-100' : 'text-neutral-600'
                                }`}>
                                    {plan.period}
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIdx) => (
                                    <li
                                        key={featureIdx}
                                        className="flex items-center gap-3"
                                    >
                                        <Check size={20} className={
                                            plan.highlighted ? 'text-white' : 'text-brand-blue'
                                        } />
                                        <span className={`text-sm ${
                                            plan.highlighted ? 'text-white' : 'text-neutral-700'
                                        }`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <a
                                href="#contact"
                                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                                    plan.highlighted
                                        ? 'bg-white text-brand-blue hover:bg-blue-50'
                                        : 'bg-brand-blue text-white hover:bg-blue-700'
                                }`}
                            >
                                בחר תוכנית
                                <ArrowRight size={18} />
                            </a>
                        </motion.div>
                    ))}
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-neutral-50 rounded-3xl p-12"
                >
                    <h3 className="text-3xl font-bold text-neutral-900 text-center mb-12">
                        שאלות נפוצות
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                q: 'האם אני יכול לבטל את התוכנית בכל עת?',
                                a: 'כן, אתה יכול לבטל בכל עת ללא עלויות נוספות.',
                            },
                            {
                                q: 'האם כלולה הובלה בתוכניות?',
                                a: 'הובלה כלולה רק בחבילת VIP. בתוכניות אחרות זה בתשלום נוסף.',
                            },
                            {
                                q: 'כמה זמן לוקח תיקון ממוצע?',
                                a: 'זה תלוי בסוג התיקון. בדיקה בסיסית לוקחת כ-30 דקות.',
                            },
                            {
                                q: 'האם יש הנחה לרכישה של מספר תוכניות?',
                                a: 'כן, אנחנו מציעים הנחות מיוחדות לרכישה של מספר תוכניות.',
                            },
                        ].map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h4 className="font-bold text-neutral-900 mb-2">
                                    {faq.q}
                                </h4>
                                <p className="text-neutral-600 text-sm">
                                    {faq.a}
                                </p>
                            </motion.div>
                        ))}
                    </div>
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
                        לא בטוח איזו תוכנית בחרת?
                    </p>
                    <a
                        href="#contact"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        צור קשר לייעוץ חינם
                    </a>
                </motion.div>
            </div>
        </section>
    );
};
