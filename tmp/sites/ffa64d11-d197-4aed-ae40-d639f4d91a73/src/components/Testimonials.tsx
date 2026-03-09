import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'דוד כהן',
        role: 'בעל BMW X5',
        text: 'שירות מעולה! הצוות מקצועי, אמין ושקוף. הרכב חזר כמו חדש. ממליץ בחום לכל מי שמחפש מוסך אמין.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
        name: 'שרה לוי',
        role: 'בעלת Toyota Camry',
        text: 'כבר שנים שאני מטפלת את הרכב רק אצל רוזן פרו. תמיד מסבירים בדיוק מה צריך לעשות ולמה. מחירים הוגנים.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
        name: 'יוסי אברהם',
        role: 'בעל Mercedes C-Class',
        text: 'הגעתי עם בעיה מורכבת שמוסכים אחרים לא הצליחו לפתור. תוך יום אחד הרכב היה מוכן. מקצוענים אמיתיים!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    },
    {
        name: 'מיכל רוזנברג',
        role: 'בעלת Hyundai Tucson',
        text: 'השירות הכי טוב שקיבלתי. רכב חלופי, עדכונים שוטפים, ומחיר שהופתעתי ממנו לטובה. תודה רבה!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="relative py-24 md:py-32 lg:py-40">
            {/* Background */}
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[200px] pointer-events-none -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm font-medium text-orange-400 mb-6">
                        המלצות
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
                        מה הלקוחות שלנו
                        <br />
                        <span className="text-gradient">אומרים עלינו</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        אלפי לקוחות מרוצים סומכים עלינו כבר שנים. הנה מה שחלקם אומרים.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="group glass-card glass-card-hover p-6 md:p-8 rounded-2xl relative"
                        >
                            {/* Quote Icon */}
                            <Quote className="w-10 h-10 text-orange-500/20 absolute top-6 left-6" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, j) => (
                                    <Star key={j} className="w-4 h-4 text-orange-400 fill-orange-400" />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-slate-300 leading-relaxed mb-6 relative z-10">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500/20"
                                />
                                <div>
                                    <div className="font-bold text-white">{testimonial.name}</div>
                                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}