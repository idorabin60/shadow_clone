import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Search, Wrench, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: PhoneCall,
    step: '01',
    title: 'קביעת תור',
    description: 'התקשרו או השאירו פרטים באתר ונתאם תור בזמן שנוח לכם.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: Search,
    step: '02',
    title: 'אבחון מקיף',
    description: 'בדיקה יסודית של הרכב עם ציוד מתקדם וזיהוי כל הבעיות.',
    color: 'from-amber-500 to-amber-700',
  },
  {
    icon: Wrench,
    step: '03',
    title: 'טיפול מקצועי',
    description: 'ביצוע התיקון ברמה הגבוהה ביותר עם חלקים מקוריים ואיכותיים.',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'מסירה ואחריות',
    description: 'בדיקה סופית, הסבר מפורט ואחריות מלאה על כל עבודה.',
    color: 'from-purple-500 to-purple-700',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Process() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 bg-[#111827] overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            איך זה עובד
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            תהליך פשוט{' '}
            <span className="text-gradient-blue">ושקוף</span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto">
            ארבעה שלבים פשוטים מהרגע שאתם פונים אלינו ועד שהרכב חוזר אליכם כמו חדש
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative"
        >
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 right-[12%] left-[12%] h-px bg-gradient-to-l from-blue-500/20 via-amber-500/20 to-purple-500/20" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative"
            >
              <div className="glass-card glass-card-hover p-8 text-center h-full">
                {/* Step number */}
                <div className="relative inline-block mb-6">
                  <div className={`bg-gradient-to-br ${step.color} p-4 rounded-2xl shadow-lg relative z-10`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-[#111827] border border-white/10 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center z-20">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
