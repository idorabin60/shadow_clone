import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Eye, DollarSign, Clock, Award, Users, Cpu,
  CheckCircle2, ArrowLeft
} from 'lucide-react';

const advantages = [
  {
    icon: Eye,
    title: 'שקיפות מלאה',
    description: 'לפני כל תיקון תקבל הסבר מפורט ואישור מחיר. אין הפתעות, אין עלויות נסתרות.',
    stat: '100%',
    statLabel: 'שקיפות',
    color: 'from-blue-500 to-cyan-500',
    bg: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: DollarSign,
    title: 'מחירים הוגנים',
    description: 'תמחור שוק הוגן ותחרותי. אנחנו לא מנצלים מצבי חירום — המחיר שמוצג הוא המחיר שתשלם.',
    stat: '30%',
    statLabel: 'חיסכון ממוצע',
    color: 'from-green-500 to-emerald-500',
    bg: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: Clock,
    title: 'שירות ביום אחד',
    description: 'רוב התיקונים מסתיימים ביום אחד. אנחנו מכבדים את הזמן שלך ועומדים בלוחות הזמנים.',
    stat: '90%',
    statLabel: 'מסתיים ביום',
    color: 'from-brand-500 to-orange-500',
    bg: 'from-brand-500/10 to-orange-500/10',
    border: 'border-brand-500/20',
  },
  {
    icon: Award,
    title: 'אחריות מלאה',
    description: 'כל תיקון מגיע עם אחריות של 12 חודשים על עבודה וחלקים. אנחנו עומדים מאחורי העבודה שלנו.',
    stat: '12',
    statLabel: 'חודשי אחריות',
    color: 'from-purple-500 to-violet-500',
    bg: 'from-purple-500/10 to-violet-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Cpu,
    title: 'ציוד מתקדם',
    description: 'אבחון ממוחשב עם הציוד המתקדם ביותר בשוק. מזהים תקלות שמוסכים אחרים מפספסים.',
    stat: '2024',
    statLabel: 'ציוד עדכני',
    color: 'from-yellow-500 to-amber-500',
    bg: 'from-yellow-500/10 to-amber-500/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: Users,
    title: 'צוות מנוסה',
    description: 'מכונאים מוסמכים עם ניסיון של 15+ שנים. מתמחים בכל סוגי הרכבים — יפניים, אירופאים ואמריקאים.',
    stat: '15+',
    statLabel: 'שנות ניסיון',
    color: 'from-red-500 to-pink-500',
    bg: 'from-red-500/10 to-pink-500/10',
    border: 'border-red-500/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhyUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="why-us" className="relative py-32 overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800 via-dark-900 to-dark-800" />
      
      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full border border-brand-500/10 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full border border-blue-500/10 pointer-events-none"
      />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none" />

      <div className="relative section-container" ref={ref}>
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 rounded-full px-5 py-2 mb-6">
              <Award className="w-4 h-4 text-brand-400" />
              <span className="text-brand-300 font-medium text-sm">למה לבחור בנו</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
              המוסך שאתה
              <br />
              <span className="bg-gradient-to-l from-brand-400 to-brand-600 bg-clip-text text-transparent">
                יכול לסמוך עליו
              </span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              בעולם שבו מוסכים רבים מנצלים את חוסר הידע של הלקוח, אנחנו בחרנו בדרך אחרת — שקיפות מוחלטת, יחס אישי ומחירים שמדברים בעד עצמם.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1632823471565-1ecdf5c6da12?auto=format&fit=crop&w=800&q=80"
                alt="מכונאי מקצועי"
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
              
              {/* Floating achievement cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">מוסמך ומורשה</div>
                    <div className="text-white/50 text-xs">משרד התחבורה</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Advantages grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {advantages.map((adv, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`group relative bg-gradient-to-br ${adv.bg} backdrop-blur-md border ${adv.border} rounded-3xl p-6 shadow-2xl hover:shadow-2xl transition-all duration-300 cursor-default`}
            >
              {/* Stat badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${adv.color} bg-opacity-20 flex items-center justify-center shadow-lg`}>
                  <adv.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black bg-gradient-to-l ${adv.color} bg-clip-text text-transparent`}>
                    {adv.stat}
                  </div>
                  <div className="text-white/40 text-xs">{adv.statLabel}</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{adv.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{adv.description}</p>

              {/* Hover line */}
              <div className={`absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-l ${adv.color} rounded-b-3xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-16 relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-brand-600 to-brand-800" />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '30px 30px',
            }}
          />
          <div className="relative p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                מוכן לחוות את ההבדל?
              </h3>
              <p className="text-white/70 text-lg">
                אבחון ראשוני ללא עלות — התקשר עכשיו וקבע תור
              </p>
            </div>
            <motion.a
              href="tel:+972501234567"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 bg-white text-brand-600 font-black px-8 py-4 rounded-2xl shadow-2xl whitespace-nowrap text-lg"
            >
              050-123-4567
              <ArrowLeft className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
