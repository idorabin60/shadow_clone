import { motion } from 'framer-motion';
import { Cloud, Building2, Smartphone, ArrowLeft } from 'lucide-react';

const solutions = [
    {
        icon: Building2,
        title: 'אבטחה ארגונית',
        description: 'פתרון אבטחה מקיף לארגונים גדולים הכולל ניהול סיכונים, תאימות רגולטורית וניטור מתקדם.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
        tag: 'Enterprise',
    },
    {
        icon: Cloud,
        title: 'אבטחת ענן',
        description: 'הגנה מלאה על תשתיות ענן, אפליקציות SaaS ונתונים רגישים בסביבות מרובות ענן.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        tag: 'Cloud',
    },
    {
        icon: Smartphone,
        title: 'אבטחת מובייל',
        description: 'הגנה על מכשירים ניידים, אפליקציות ונתונים עם פתרון MDM מתקדם ואבטחת אפליקציות.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?auto=format&fit=crop&w=600&q=80',
        tag: 'Mobile',
    },
];

export default function Solutions() {
    return (
        <section id="solutions" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-[#0a0a0f]" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-radial-cyan-light" />

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
                        הפתרונות שלנו
                    </span>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        <span className="text-white">פתרונות </span>
                        <span className="text-gradient-green">מותאמים אישית</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        כל ארגון הוא ייחודי. אנחנו מתאימים את הפתרונות שלנו בדיוק לצרכים שלכם
                    </p>
                </motion.div>

                {/* Solutions Cards */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {solutions.map((solution, i) => (
                        <motion.div
                            key={solution.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="group relative"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-[#00f0ff]/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            <div className="relative glass-card overflow-hidden h-full group-hover:border-[#00f0ff]/20 transition-all duration-500">
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={solution.image}
                                        alt={solution.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />

                                    {/* Tag */}
                                    <div className="absolute top-4 right-4 bg-[#00f0ff]/10 border border-[#00f0ff]/30 backdrop-blur-md rounded-full px-3 py-1">
                                        <span className="text-xs font-bold text-[#00f0ff]">{solution.tag}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="inline-flex p-2.5 rounded-xl bg-white/5 border border-white/10 mb-4">
                                        <solution.icon className="w-5 h-5 text-[#00f0ff]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{solution.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{solution.description}</p>
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#00f0ff] group-hover:gap-3 transition-all duration-300"
                                    >
                                        גלה עוד
                                        <ArrowLeft className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}