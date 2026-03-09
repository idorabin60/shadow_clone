import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ShieldCheck, Clock3, BadgeCheck, Banknote,
  Headphones, Star, Wrench, Zap
} from 'lucide-react';

const reasons = [
  {
    icon: ShieldCheck,
    title: 'אחריות מלאה',
    desc: '12 חודשי אחריות על כל תיקון ועבודה — ללא תנאים וללא אותיות קטנות.',
    color: 'from-green-500 to-emerald-400',
    glow: 'rgba(34,197,94,0.25)',
  },
  {
    icon: Banknote,
    title: 'מחיר הוגן ושקוף',
    desc: 'הצעת מחיר מפורטת לפני כל עבודה. אין הפתעות, אין תוספות נסתרות.',
    color: 'from-orange-500 to-amber-400',
    glow: 'rgba(249,115,22,0.25)',
  },
  {
    icon: Clock3,
    title: 'מהירות ויעילות',
    desc: 'רוב הטיפולים מתבצעים ביום אחד. אנחנו מכבדים את הזמן שלך.',
    color: 'from-blue-500 to-cyan-400',
    glow: 'rgba(59,130,246,0.25)',
  },
  {
    icon: BadgeCheck,
    title: 'טכנאים מוסמכים',
    desc: 'כל הטכנאים שלנו עברו הכשרה מקצועית ומוסמכים ע"י יצרני הרכב.',
    color: 'from-purple-500 to-violet-400',
    glow: 'rgba(168,85,247,0.25)',
  },
  {
    icon: Headphones,
    title: 'זמינות 7 ימים',
    desc: 'שירות לקוחות זמין בטלפון ובוואטסאפ — גם בסופי שבוע ובחגים.',
    color: 'from-pink-500 to-rose-400',
    glow: 'rgba(236,72,153,0.25)',
  },
  {
    icon: Wrench,
    title: 'חלקים מקוריים',
    desc: 'אנחנו משתמשים אך ורק בחלקי חילוף מקוריים ומאושרים ע"י היצרן.',
    color: 'from-amber-500 to-yellow-400',
    glow: 'rgba(245,158,11,0.25)',
  },
  {
    icon: Zap,
    title: 'אבחון ממוחשב',
    desc: 'ציוד אבחון מהדור החדש לאיתור מדויק של תקלות — חיסכון בזמן ובכסף.',
    color: 'from-cyan-500 to-teal-400',
    glow: 'rgba(6,182,212,0.25)',
  },
  {
    icon: Star,
    title: 'ניסיון של 15 שנה',
    desc: 'מעל 4,800 לקוחות מרוצים ו-15 שנות ניסיון מוכח בשוק הישראלי.',
    color: 'from-orange-400 to-red-500',
    glow: 'rgba(249,115,22,0.25)',
  },
];

function ReasonCard({ reason, index }: { reason: typeof reasons[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group rounded-2xl p-6 border border-white/8 hover:border-white/20 transition-all duration-400 overflow-hidden cursor-default"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 20% 20%, ${reason.glow}, transparent 65%)` }}
      />

      {/* Top accent line */}
      <div
        className={`absolute top-0 right-0 left-0 h-px bg-gradient-to-r ${reason.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative z-10 text-right">
        {/* Icon */}
        <div className="mb-5 flex justify-end">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
          >
            <reason.icon className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
        </div>

        <h3 className="font-heebo font-bold text-xl text-white mb-3">{reason.title}</h3>
        <p className="font-assistant text-sm text-white/55 leading-relaxed">{reason.desc}</p>
      </div>
    </motion.div>
  );
}

export default function WhyUs() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' });

  return (
    <section id="why-us" dir="rtl" className="relative py-28 bg-dark-900 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-orange-500/4 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-right mb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange border border-orange-500/20 text-orange-300 text-sm font-assistant font-semibold mb-6"
          >
            <Star className="w-4 h-4" />
            <span>למה לבחור בנו</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-heebo font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-5 leading-tight"
          >
            לא סתם מוסך —{' '}
            <span className="text-gradient">שותף</span>
            <br />
            לדרך
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-assistant text-lg text-white/55 leading-relaxed"
          >
            אנחנו לא רק מתקנים רכבים — אנחנו בונים אמון. כל לקוח שנכנס אלינו יוצא עם
            הרכב מתוקן, הסבר מלא על מה שנעשה, ותחושה שהוא בידיים טובות.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((reason, i) => (
            <ReasonCard key={reason.title} reason={reason} index={i} />
          ))}
        </div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500" />
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10 px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-right">
            <div>
              <h3 className="font-heebo font-black text-2xl sm:text-3xl text-white mb-2">
                מוכן לקבוע תור?
              </h3>
              <p className="font-assistant text-white/80 text-base">
                התקשר עכשיו ותקבל ייעוץ חינם ותאום מהיר
              </p>
            </div>
            <motion.a
              href="tel:+972501234567"
              whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 px-8 py-4 rounded-2xl bg-white text-orange-600 font-heebo font-black text-lg shadow-2xl hover:bg-orange-50 transition-colors duration-200"
            >
              050-123-4567
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
