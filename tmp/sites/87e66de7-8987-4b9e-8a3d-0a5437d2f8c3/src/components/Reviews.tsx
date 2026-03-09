import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
    {
        name: 'דוד כהן',
        role: 'בעל עסק',
        image: '👨‍💼',
        rating: 5,
        text: 'שירות מעולה! הצוות מקצועי מאוד ותמיד עוזרים בכל שאלה. המחירים הוגנים והעבודה מהירה.',
    },
    {
        name: 'שרה לוי',
        role: 'מורה',
        image: '👩‍🏫',
        rating: 5,
        text: 'מוסך מדהים! הם טיפלו ברכב שלי בדיוק כמו שהבטיחו. אני ממליצה בחום לכל מי שמחפש מוסך אמין.',
    },
    {
        name: 'יוסי ברק',
        role: 'נהג משאית',
        image: '👨‍🚚',
        rating: 5,
        text: 'עבדתי עם מוסך רוזן במשך שנים. הם תמיד מהירים, מקצועיים ותמיד עוזרים בשעות חירום.',
    },
    {
        name: 'מיכל גרין',
        role: 'עורכת דין',
        image: '👩‍⚖️',
        rating: 5,
        text: 'שירות מעולה מתחילה ועד סוף. הם הסבירו לי בדיוק מה צריך לעשות ולא ניסו למכור לי דברים שלא צריכים.',
    },
    {
        name: 'אלי רוזנברג',
        role: 'מהנדס',
        image: '👨‍💻',
        rating: 5,
        text: 'מוסך מקצועי עם ציוד מודרני. הם עשו עבודה מעולה בתיקון המנוע של הרכב שלי.',
    },
    {
        name: 'ליאור סלע',
        role: 'אדריכל',
        image: '👨‍🏗️',
        rating: 5,
        text: 'המלצה חמה! צוות מקצועי, שירות מעולה, ומחירים הוגנים. אני בטוח שאחזור אליהם.',
    },
];

export const Reviews: React.FC = () => {
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

    const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);

    return (
        <section id="reviews" className="section-padding bg-neutral-50">
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
                        מה אומרים הלקוחות שלנו
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        ביקורות אמיתיות מלקוחות מרוצים
                    </p>

                    {/* Rating Summary */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-8 inline-flex items-center gap-4 px-6 py-4 bg-white rounded-full border border-neutral-200"
                    >
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={20}
                                    className="fill-brand-orange text-brand-orange"
                                />
                            ))}
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-neutral-900">
                                {averageRating} מתוך 5
                            </div>
                            <div className="text-sm text-neutral-600">
                                {reviews.length} ביקורות
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Reviews Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-white rounded-2xl p-8 border border-neutral-200 hover:border-brand-blue/50 transition-all duration-300"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className="fill-brand-orange text-brand-orange"
                                    />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-neutral-700 mb-6 leading-relaxed">
                                "{review.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 pt-6 border-t border-neutral-200">
                                <div className="text-4xl">
                                    {review.image}
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900">
                                        {review.name}
                                    </h4>
                                    <p className="text-sm text-neutral-600">
                                        {review.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-20 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-3xl p-12 text-white text-center"
                >
                    <h3 className="text-3xl font-bold mb-4">
                        מוכן להצטרף לאלפי לקוחות מרוצים?
                    </h3>
                    <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                        בואו לחוות את שירות מוסך מקצועי ואמין
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-blue rounded-lg font-bold hover:bg-blue-50 transition-colors duration-300"
                    >
                        צור קשר עכשיו
                    </a>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 flex flex-wrap justify-center gap-8"
                >
                    {[
                        { icon: '✓', text: 'מוסך מאומת' },
                        { icon: '🏆', text: 'פרס איכות' },
                        { icon: '🔒', text: 'אחריות מלאה' },
                        { icon: '⚡', text: 'שירות מהיר' },
                    ].map((badge, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-neutral-200"
                        >
                            <span className="text-2xl">{badge.icon}</span>
                            <span className="font-semibold text-neutral-900">
                                {badge.text}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
