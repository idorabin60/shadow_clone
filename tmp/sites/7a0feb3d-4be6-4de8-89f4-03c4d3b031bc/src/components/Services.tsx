import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Wrench, Zap, Thermometer, Wind, RotateCcw, Shield,
  Settings, Gauge, Droplets, Battery, AlertTriangle, Car
} from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'טיפול שוטף',
    desc: 'החלפת שמן, פילטרים, נוזלים ובדיקת מערכות — לפי לוח הזמנים של היצרן.',
    color: 'from-orange-500 to-amber-500',
    glow: 'rgba(249,115,22,0.3)',
    tag: 'פופולרי',
  },
  {
    icon: Zap,
    title: 'מערכת חשמל',
    desc: 'אבחון ותיקון תקלות חשמל, מחשב רכב, חיישנים ומערכות בקרה מתקדמות.',
    color: 'from-yellow-400 to-orange-500',
    glow: 'rgba(234,179,8,0.3)',
    tag: null,
  },
  {
    icon: Thermometer,
    title: 'מערכת קירור',
    desc: 'תיקון ותחזוקת רדיאטור, משאבת מים, תרמוסטט ומניעת התחממות יתר.',
    color: 'from-blue-400 to-cyan-500',
    glow: 'rgba(59,130,246,0.3)',
    tag: null,
  },
  {
    icon: RotateCcw,
    title: 'בלמים וגלגלים',
    desc: 'החלפת רפידות, דיסקים, כיול בלמים ואיזון גלגלים לבטיחות מרבית.',
    color: 'from-red-500 to-orange-500',
    glow: 'rgba(239,68,68,0.3)',
    tag: 'חשוב',
  },
  {
    icon: Wind,
    title: 'מיזוג אוויר',
    desc: 'טעינת גז, ניקוי מערכת, החלפת קומפרסור ואבחון תקלות מיזוג.',
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(6,182,212,0.3)',
    tag: null,
  },
  {
    icon: Settings,
    title: 'מנוע ותיבת הילוכים',
    desc: 'תיקון ושיפוץ מנועים, תיבות הילוכים אוטומטיות וידניות.',
    color: 'from-purple-500 to-pink-500',
    glow: 'rgba(168,85,247,0.3)',
    tag: null,
  },
  {
    icon: Gauge,
    title: 'בדיקת רכב לפני קנייה',
    desc: 'בדיקה מקיפה של 120 נקודות לפני רכישת רכב יד שנייה — שקט נפשי מלא.',
    color: 'from-green-400 to-emerald-500',
    glow: 'rgba(34,197,94,0.3)',
    tag: 'מומלץ',
  },
  {
    icon: Battery,
    title: 'מצבר ומערכת הצתה',
    desc: 'בדיקה, טעינה והחלפת מצבר, פלאגים, חוטי הצתה ומערכת הנעה.',
    color: 'from-amber-400 to-yellow-500',
    glow: 'rgba(245,158,11,0.3)',
    tag: null,
  },
  {
    icon: Shield,
    title: 'טסט ורישוי',
    desc: 'הכנה מלאה לטסט, ליווי בתחנת הרישוי ותיקון ממצאים במקום.',
    color: 'from-orange-400 to-red-500',
    glow: 'rgba(249,115,22,0.3)',
    tag: null,
  },
  {
    icon: Droplets,
    title: 'מערכת הגה',
    desc: 'תיקון הגה הידראולי וחשמלי, החלפת שמן הגה ובדיקת מוטות.',
    color: 'from-teal-400 to-cyan-500',
    glow: 'rgba(20,184,166,0.3)',
    tag: null,
  },
  {
    icon: AlertTriangle,
    title: 'אבחון ממוחשב',
    desc: 'חיבור לציוד אבחון מתקדם לאיתור תקלות מדויק וחיסכון בזמן ועלויות.',
    color: 'from-orange-500 to-amber-400',
    glow: 'rgba(249,115,22,0.3)',
    tag: 'טכנולוגי',
  },
  {
    icon: Car,
    title: 'פחחות וצבע',
    desc: 'תיקון נזקי פח, צביעה מקצועית ושחזור מראה הרכב לחדש.',
    color: 'from-pink-500 to-rose-500',
    glow: 'rgba(236,72,153,0.3)',
    tag: null,
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group rounded-2xl glass border border-white/8 hover:border-white/20 p-6 cursor-default transition-all duration-300 overflow-hidden"
      style={{ '--glow': service.glow } as React.CSSProperties}
    >
      {/* Hover glow bg */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 30% 30%, ${service.glow}, transparent 70%)` }}
      />

      {/* Tag */}
      {service.tag && (
        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-assistant font-semibold">
          {service.tag}
        </div>
      )}

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-5">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <service.icon className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
        </div>

        <h3 className="font-heebo font-bold text-xl text-white mb-2 text-right">
          {service.title}
        </h3>
        <p className="font-assistant text-sm text-white/55 text-right leading-relaxed">
          {service.desc}
        </p>

        {/* Arrow */}
        <div className="mt-4 flex justify-end">
          <span className="text-orange-400/0 group-hover:text-orange-400 text-sm font-assistant font-semibold transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            ← קרא עוד
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' });

  return (
    <section id="services" dir="rtl" className="relative py-28 bg-dark-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={titleRef} className="text-right mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange border border-orange-500/20 text-orange-300 text-sm font-assistant font-semibold mb-6"
          >
            <Wrench className="w-4 h-4" />
            <span>מה אנחנו מציעים</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heebo font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-5"
          >
            שירותים{' '}
            <span className="text-gradient">מקצועיים</span>
            <br />
            לכל סוגי הרכבים
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-assistant text-lg text-white/55 max-w-2xl leading-relaxed"
          >
            ממנוע ועד גלגלים — אנחנו מטפלים בכל מה שהרכב שלך צריך.
            ציוד מתקדם, טכנאים מוסמכים, ואחריות על כל עבודה.
          </motion.p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 text-center"
        >
          <p className="font-assistant text-white/50 mb-6">לא מצאת את השירות שחיפשת?</p>
          <motion.a
            href="tel:+972501234567"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-border text-white font-heebo font-bold text-lg hover:bg-white/5 transition-all duration-300"
          >
            צור קשר לייעוץ חינם
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
