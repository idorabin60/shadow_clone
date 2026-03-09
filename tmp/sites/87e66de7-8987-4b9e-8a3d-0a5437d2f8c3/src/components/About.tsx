import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Zap, Heart } from 'lucide-react';

export const About: React.FC = () => {
    const values = [
        {
            icon: Award,
            title: 'מקצועיות',
            description: 'צוות מוסמך וחוויה של 15+ שנים בתחום',
        },
        {
            icon: Users,
            title: 'שירות אישי',
            description: 'כל לקוח הוא חשוב לנו ומקבל תשומת לב מלאה',
        },
        {
            icon: Zap,
            title: 'מהירות',
            description: 'עבודה יעילה ותוצאות מהירות ללא פשרות על איכות',
        },
        {
            icon: Heart,
            title: 'אמינות',
            description: 'אנחנו עומדים מאחורי כל עבודה שאנחנו עושים',
        },
    ];

    const stats = [
        { number: '15+', label: 'שנות ניסיון' },
        { number: '5000+', label: 'לקוחות מרוצים' },
        { number: '98%', label: 'שביעות רצון' },
        { number: '24/7', label: 'שירות חירום' },
    ];

    return (
        <section id="about" className="section-padding bg-neutral-50">
            <div className="container-max">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                    {/* Left Side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-brand-blue font-semibold text-sm mb-6"
                        >
                            <span>ℹ️</span>
                            על אודות מוסך רוזן
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6"
                        >
                            מוסך מקצועי עם ניסיון עמוק
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-lg text-neutral-600 mb-6 leading-relaxed"
                        >
                            מוסך רוזן PRO הוא מוסך מקצועי המתמחה בתיקול וטיפול רכבים. עם ניסיון של יותר מ-15 שנים בתחום, אנחנו מספקים שירותים איכותיים בהחלט.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="text-lg text-neutral-600 mb-8 leading-relaxed"
                        >
                            הצוות שלנו מורכב מטכנאים מוסמכים ומנוסים, המשתמשים בציוד מודרני ובחלקים מקוריים. אנחנו מתחייבים לספק שירות מעולה בכל פעם.
                        </motion.p>

                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            href="#contact"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            צור קשר עכשיו
                        </motion.a>
                    </motion.div>

                    {/* Right Side - Image/Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-brand-blue/10 to-brand-cyan/10 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-9xl mb-4">🔧</div>
                                <p className="text-neutral-600 font-semibold text-lg">מוסך מקצועי</p>
                            </div>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-blue/10 rounded-full blur-2xl"></div>
                        <div className="absolute -top-4 -left-4 w-32 h-32 bg-brand-cyan/10 rounded-full blur-2xl"></div>
                    </motion.div>
                </div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h3 className="text-3xl font-bold text-neutral-900 text-center mb-12">
                        הערכים שלנו
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center p-6 rounded-2xl bg-white border border-neutral-200 hover:border-brand-blue/30 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center mx-auto mb-4">
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <h4 className="font-bold text-neutral-900 mb-2">
                                        {value.title}
                                    </h4>
                                    <p className="text-neutral-600 text-sm">
                                        {value.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-brand-blue to-brand-cyan rounded-3xl p-12 text-white"
                >
                    <h3 className="text-3xl font-bold text-center mb-12">
                        הנתונים שלנו
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-2">
                                    {stat.number}
                                </div>
                                <p className="text-blue-100">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
