import { motion } from 'framer-motion';
import { Settings, Droplets, Gauge, Zap, ShieldCheck, Cog } from 'lucide-react';

const services = [
    {
        icon: Settings,
        title: 'טיפולים תקופתיים',
        description: 'טיפולים שוטפים לפי יצרן, החלפת שמן, פילטרים ובדיקות מקיפות לשמירה על תקינות הרכב.',
        image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=600&q=80',
    },
    {
        icon: Droplets,
        title: 'מערכת קירור ומיזוג',
        description: 'תיקון ותחזוקת מערכות קירור, מיזוג אוויר, רדיאטורים ומשאבות מים.',
        image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=600&q=80',
    },
    {
        icon: Gauge,
        title: 'בלמים ובטיחות',
        description: 'החלפת רפידות, דיסקיות, בדיקת מערכת ABS ומערכות בטיחות מתקדמות.',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    },
    {
        icon: Zap,
        title: 'חשמל רכב',
        description: 'אבחון ותיקון תקלות חשמל, מצברים, אלטרנטורים ומערכות אלקטרוניות.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80',
    },
    {
        icon: ShieldCheck,
        title: 'טסט שנתי',
        description: 'הכנה מלאה לטסט, תיקון ליקויים וליווי מקצועי עד לעבירת הבדיקה.',
        image: 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da20?auto=format&fit=crop&w=600&q=80',
    },
    {
        icon: Cog,
        title: 'תיבות הילוכים',
        description: 'שיפוץ ותיקון תיבות הילוכים ידניות ואוטומטיות, החלפת שמן גיר.',
        image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=600&q=80',
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

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
};

export default function Services() {
    return (
        <section id="services" className="relative py-24 md:py-32 lg:py-40">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />

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
                        השירותים שלנו
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
                        כל מה שהרכב שלך צריך
                        <br />
                        <span className="text-gradient">במקום אחד</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        אנחנו מציעים מגוון רחב של שירותי רכב מקצועיים, עם ציוד מתקדם וצוות מומחים מנוסה.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {services.map((service) => (
                        <motion.div
                            key={service.title}
                            variants={cardVariants}
                            className="group glass-card glass-card-hover p-6 md:p-8 rounded-2xl cursor-pointer relative overflow-hidden"
                        >
                            {/* Card Glow on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-transparent transition-all duration-700 rounded-2xl" />

                            <div className="relative z-10">
                                {/* Image */}
                                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/60 to-transparent" />
                                </div>

                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all duration-500">
                                    <service.icon className="w-6 h-6 text-orange-400" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}