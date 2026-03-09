import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Search, FileText, Wrench, CheckCircle, Star } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Phone,
    title: 'יצירת קשר',
    description: 'מתקשרים אלינו או ממלאים טופס קביעת תור. נחזור אליך תוך שעה לאישור.',
    color: 'from-brand-500 to-orange-500',
    bg: 'from-brand-500/15 to-orange-500/15',
    border: 'border-brand-500/30',
    iconColor: 'text-brand-400',
  },
  {
    number: '02',
    icon: Search,
    title: 'אבחון מקצועי',
    description: 'אבחון ממוחשב מקיף של הרכב. מזהים את כל הבעיות — גם אלה שלא ידעת עליהן.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'from-blue-500/15 to-cyan-500/15',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  {
    number: '03',
    icon: FileText,
    title: 'הצעת מחיר שקופה',
    description: 'מקבלים הצעת מחיר מפורטת לפני כל עבודה. אין הפתעות — אתה מחליט.',
    color: 'from-green-500 to-emerald-500',
    bg: 'from-green-500/15 to-emerald-500/15',
    border: 'border-green-500/30',
    iconColor: 'text-green-400',
  },
  {
    number: '04',
    icon: Wrench,
    title: 'תיקון מקצועי',
    description: 'הצוות המנוסה שלנו מבצע את התיקון עם חלקים מקוריים ואחריות מלאה.',
    color: 'from-purple-500 to-violet-500',
    bg: 'from-purple-500/15 to-violet-500/15',
    border: 'border-purple-500/30',
    iconColor: 'text-purple-400',
  },
  {
    number: '05',
    icon: CheckCircle,
    title: 'בדיקת איכות',
    description: 'לפני מסירה — בדיקת איכות מקיפה. הרכב יוצא מהמוסך רק כשהוא מושלם.',
    color: 'from-yellow-500 to-amber-500',
    bg: 'from-yellow-500/15 to-amber-500/15',
    border: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
  },
  {
    number: '06',
    icon: Star,
    title: 'מסירה ומעקב',
    description: 'מסירת הרכב עם דוח מלא. נמשיך לעקוב אחרי שביעות הרצון שלך.',
    color: 'from-red-500 to-pink-500',
    bg: 'from-red-500/15 to-pink-500/15',
    border: 'border-red-500/30',
    iconColor: 'text-red-400',
  },
];

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="process" className="relative py-32 overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              delay: i * 1.2,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full bg-brand-500"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      <div className="relative section-container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 rounded-full px-5 py-2 mb-6">
            <CheckCircle className="w-4 h-4 text-brand-400" />
            <span className="text-brand-300 font-medium text-sm">התהליך שלנו</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            פשוט, שקוף
            <br />
            <span className="bg-gradient-to-l from-brand-400 to-brand-600 bg-clip-text text-transparent">
              ויעיל
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            6 שלבים פשוטים מהתקשרות הראשונה ועד מסירת הרכב — כל שלב שקוף ומתועד.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 right-0 left-0 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent hidden lg:block" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative bg-gradient-to-br ${step.bg} backdrop-blur-md border ${step.border} rounded-3xl p-7 shadow-2xl transition-all duration-300`}
              >
                {/* Step number */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className={`text-5xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-300`}>
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{step.description}</p>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 right-6 left-6 h-0.5 bg-gradient-to-l ${step.color} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline visual for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-brand-400 mb-1">ממוצע</div>
              <div className="text-white/50 text-sm">זמן אבחון</div>
              <div className="text-white font-bold text-lg">30 דקות</div>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block" />
            <div>
              <div className="text-3xl font-black text-green-400 mb-1">90%</div>
              <div className="text-white/50 text-sm">מהתיקונים</div>
              <div className="text-white font-bold text-lg">מסתיימים ביום</div>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block" />
            <div>
              <div className="text-3xl font-black text-blue-400 mb-1">0 ₪</div>
              <div className="text-white/50 text-sm">עלות אבחון</div>
              <div className="text-white font-bold text-lg">ראשוני</div>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block" />
            <div>
              <div className="text-3xl font-black text-purple-400 mb-1">12</div>
              <div className="text-white/50 text-sm">חודשי</div>
              <div className="text-white font-bold text-lg">אחריות</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
