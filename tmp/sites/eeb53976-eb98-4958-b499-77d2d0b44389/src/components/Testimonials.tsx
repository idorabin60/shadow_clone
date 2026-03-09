import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'דניאל כהן',
        role: 'CTO, פינטק ישראל',
        content: 'ZeroTrust Dynamics שינו לחלוטין את גישת האבטחה שלנו. מאז שהטמענו את הפתרון שלהם, חווינו ירידה של 95% באירועי אבטחה.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
    },
    {
        name: 'מיכל לוי',
        role: 'VP Security, בנק דיגיטלי',
        content: 'הצוות המקצועי והטכנולוגיה המתקדמת של ZeroTrust הם ברמה אחרת לגמרי. השירות 24/7 נותן לנו שקט נפשי מוחלט.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        rating: 5,
    },
    {
        name: 'אורי שפירא',
        role: 'CEO, סטארטאפ SaaS',
        content: 'כסטארטאפ, אבטחת מידע היא קריטית עבורנו. ZeroTrust סיפקו לנו פתרון מושלם שגדל איתנו ומתאים לתקציב שלנו.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-[#0f0f1a]" />
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-radial-purple-light" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block text-sm font-semibold text-[#00f0ff] tracking-widest uppercase mb-4">
                        מה הלקוחות אומרים
                    </span>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        <span className="text-white">לקוחות </span>
                        <span className="text-gradient-cyan">ממליצים</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        הצטרפו למאות ארגונים שכבר סומכים על ZeroTrust Dynamics
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="group relative"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-[#00f0ff]/10 to-[#8b5cf6]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            <div className="relative glass-card-hover p-8 h-full flex flex-col">
                                {/* Quote Icon */}
                                <Quote className="w-8 h-8 text-[#00f0ff]/20 mb-4" />

                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                                        <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-gray-300 leading-relaxed mb-8 flex-grow text-sm">
                                    &ldquo;{testimonial.content}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00f0ff]/20"
                                    />
                                    <div>
                                        <div className="font-bold text-white text-sm">{testimonial.name}</div>
                                        <div className="text-xs text-gray-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}