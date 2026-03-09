import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const Hero: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 },
        },
    };

    return (
        <section className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-neutral-50 via-white to-blue-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl -z-10"></div>

            <div className="container-max h-full flex items-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-3xl"
                >
                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-brand-blue font-semibold text-sm mb-6"
                    >
                        <CheckCircle size={16} />
                        מוסך מקצועי מאומת
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight"
                    >
                        שירותי תיקון רכבים
                        <span className="block bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                            מקצועיים ואמינים
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-neutral-600 mb-8 leading-relaxed max-w-2xl"
                    >
                        מוסך רוזן PRO מספק שירותי תיקול וטיפול רכבים מקצועיים עם ניסיון של 15+ שנים. צוות מוסמך, ציוד מודרני, ומחירים הוגנים.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 mb-12"
                    >
                        <a
                            href="#contact"
                            className="btn-primary flex items-center justify-center gap-2 group"
                        >
                            קבל הצעת מחיר
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="tel:+972123456789"
                            className="px-8 py-4 rounded-lg border-2 border-brand-blue text-brand-blue font-semibold hover:bg-blue-50 transition-colors duration-300 text-center"
                        >
                            התקשר עכשיו: 03-123-4567
                        </a>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-neutral-200"
                    >
                        <div>
                            <div className="text-3xl font-bold text-brand-blue mb-1">15+</div>
                            <p className="text-neutral-600 text-sm">שנות ניסיון</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-brand-blue mb-1">5000+</div>
                            <p className="text-neutral-600 text-sm">לקוחות מרוצים</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-brand-blue mb-1">98%</div>
                            <p className="text-neutral-600 text-sm">שביעות רצון</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-brand-blue mb-1">24/7</div>
                            <p className="text-neutral-600 text-sm">שירות חירום</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side - Illustration/Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full items-center justify-center"
                >
                    <div className="relative w-full h-full max-w-2xl">
                        {/* Car Illustration Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-brand-cyan/10 rounded-3xl flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-8xl mb-4">🚗</div>
                                <p className="text-neutral-600 font-semibold">מוסך מקצועי</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
