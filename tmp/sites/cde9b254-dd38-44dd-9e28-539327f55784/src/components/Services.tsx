import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Wrench, Zap, Thermometer, Wind, Shield, Settings,
  ChevronLeft, Gauge, Battery, Droplets
} from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'תיקון מנוע',
    description: 'אבחון ותיקון מקצועי של כל תקלות המנוע. שימוש בציוד אבחון מתקדם ורכיבים מקוריים.',
    features: ['אבחון ממוחשב', 'חלקים מקוריים', 'אחריות 12 חודש'],
    color: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30',
    iconColor: 'text-orange-400',
    glow: 'shadow-orange-500/20',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Zap,
    title: 'מערכת חשמל',
    description: 'תיקון ואבחון מלא של מערכות חשמל, סוללות, אלטרנטורים ומערכות הצתה.',
    features: ['בדיקת סוללה', 'תיקון חיווט', 'מערכות הצתה'],
    color: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    glow: 'shadow-yellow-500/20',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Thermometer,
    title: 'מערכת קירור',
    description: 'תיקון ותחזוקה של מערכת הקירור, רדיאטורים, משאבות מים ותרמוסטטים.',
    features: ['שטיפת רדיאטור', 'החלפת נוזל', 'בדיקת לחץ'],
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    glow: 'shadow-blue-500/20',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Wind,
    title: 'מיזוג אוויר',
    description: 'שירות מלא למערכות מיזוג — טעינת גז, ניקוי מסנן, תיקון דליפות ובדיקת ביצועים.',
    features: ['טעינת גז', 'ניקוי מסנן', 'בדיקת דליפות'],
    color: 'from-teal-500/20 to-green-500/20',
    border: 'border-teal-500/30',
    iconColor: 'text-teal-400',
    glow: 'shadow-teal-500/20',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Shield,
    title: 'בלמים ובטיחות',
    description: 'בדיקה ותיקון מלא של מערכת הבלמים — רפידות, דיסקיות, נוזל בלמים ו-ABS.',
    features: ['החלפת רפידות', 'בדיקת ABS', 'נוזל בלמים'],
    color: 'from-red-500/20 to-pink-500/20',
    border: 'border-red-500/30',
    iconColor: 'text-red-400',
    glow: 'shadow-red-500/20',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Settings,
    title: 'טיפול שוטף',
    description: 'טיפולים תקופתיים מלאים — החלפת שמן, פילטרים, נרות הצתה ובדיקת כל מערכות הרכב.',
    features: ['החלפת שמן', 'פילטרים', 'בדיקה כללית'],
    color: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    glow: 'shadow-purple-500/20',
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=600&q=80',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-gradient-to-br ${service.color} backdrop-blur-md border ${service.border} rounded-3xl overflow-hidden shadow-2xl cursor-pointer`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/40 to-transparent" />
        
        {/* Icon badge */}
        <div className={`absolute top-4 right-4 w-12 h-12 rounded-2xl bg-dark-900/60 backdrop-blur-md border ${service.border} flex items-center justify-center`}>
          <service.icon className={`w-6 h-6 ${service.iconColor}`} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
        <p className="text-white/60 text-sm leading-relaxed mb-4">{service.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-5">
          {service.features.map((feature, i) => (
            <span
              key={i}
              className={`text-xs font-medium px-3 py-1 rounded-full bg-white/10 border ${service.border} ${service.iconColor}`}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA */}
        <motion.a
          href="#contact"
          whileHover={{ x: -4 }}
          className={`flex items-center gap-2 ${service.iconColor} font-semibold text-sm group-hover:gap-3 transition-all duration-300`}
        >
          קבע תור עכשיו
          <ChevronLeft className="w-4 h-4" />
        </motion.a>
      </div>

      {/* Hover glow */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl ${service.glow} pointer-events-none`} />
    </motion.div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="relative py-32 overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-600/5 blur-[150px] pointer-events-none" />

      <div className="relative section-container" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 rounded-full px-5 py-2 mb-6"
          >
            <Wrench className="w-4 h-4 text-brand-400" />
            <span className="text-brand-300 font-medium text-sm">השירותים שלנו</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            כל מה שהרכב שלך
            <br />
            <span className="bg-gradient-to-l from-brand-400 to-brand-600 bg-clip-text text-transparent">
              צריך — במקום אחד
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            מאבחון ממוחשב ועד תיקון מלא — הצוות המקצועי שלנו מטפל בכל תקלה עם שקיפות מלאה ומחירים הוגנים.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-14"
        >
          <p className="text-white/40 mb-4 text-sm">לא מצאת את השירות שחיפשת?</p>
          <motion.a
            href="tel:+972501234567"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300"
          >
            דבר איתנו ישירות
            <ChevronLeft className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
