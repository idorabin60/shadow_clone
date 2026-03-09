import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, MessageCircle, Mail, Navigation } from 'lucide-react';

const contactInfo = [
    {
        icon: Phone,
        title: 'טלפון',
        value: '050-123-4567',
        href: 'tel:+972501234567',
        description: 'זמינים בשעות הפעילות',
    },
    {
        icon: Mail,
        title: 'אימייל',
        value: 'info@rosen-pro.co.il',
        href: 'mailto:info@rosen-pro.co.il',
        description: 'נחזור אליכם תוך שעות',
    },
    {
        icon: MapPin,
        title: 'כתובת',
        value: 'רחוב התעשייה 15, חולון',
        href: 'https://maps.google.com',
        description: 'חניה חינם ללקוחות',
    },
    {
        icon: Clock,
        title: 'שעות פעילות',
        value: 'א׳-ה׳ 08:00-18:00',
        href: '#',
        description: 'שישי 08:00-13:00',
    },
];

export default function Contact() {
    return (
        <section id="contact" className="relative py-24 md:py-32 lg:py-40">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.03] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-[200px] pointer-events-none -translate-x-1/2" />

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
                        צור קשר
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
                        בואו נדבר על
                        <br />
                        <span className="text-gradient">הרכב שלכם</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        צרו איתנו קשר בכל דרך שנוחה לכם. אנחנו כאן בשבילכם.
                    </p>
                </motion.div>

                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactInfo.map((info, i) => (
                        <motion.a
                            key={info.title}
                            href={info.href}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="group glass-card glass-card-hover p-6 md:p-8 rounded-2xl text-center block"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 group-hover:scale-110 transition-all duration-500">
                                <info.icon className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{info.title}</h3>
                            <p className="text-orange-400 font-medium mb-1">{info.value}</p>
                            <p className="text-sm text-slate-500">{info.description}</p>
                        </motion.a>
                    ))}
                </div>

                {/* Big CTA Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative overflow-hidden rounded-3xl"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80"
                            alt="מוסך רוזן פרו"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0F]/95 via-[#0A0A0F]/85 to-[#0A0A0F]/70" />
                    </div>

                    <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">
                                מוכנים לקבוע תור?
                            </h3>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                התקשרו עכשיו או שלחו הודעת וואטסאפ ונחזור אליכם תוך דקות.
                                אנחנו כאן בשבילכם.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="tel:+972501234567"
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-l from-orange-500 to-orange-600 text-white font-bold text-lg rounded-2xl hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 whitespace-nowrap"
                            >
                                <Phone className="w-5 h-5" />
                                <span>050-123-4567</span>
                            </a>
                            <a
                                href="https://wa.me/972501234567"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 whitespace-nowrap"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>וואטסאפ</span>
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Map Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-12 glass-card rounded-2xl overflow-hidden relative h-[300px] md:h-[400px] group"
                >
                    <img
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
                        alt="מפת מיקום המוסך"
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="glass-card p-6 rounded-2xl text-center">
                            <Navigation className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                            <h4 className="text-lg font-bold text-white mb-1">רחוב התעשייה 15, חולון</h4>
                            <p className="text-sm text-slate-400">לחצו לניווט ב-Google Maps</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}