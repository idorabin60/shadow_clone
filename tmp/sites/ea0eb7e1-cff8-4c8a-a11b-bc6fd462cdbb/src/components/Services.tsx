import React from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Gauge,
  Zap,
  Droplets,
  Disc,
  ThermometerSun,
  CarFront,
  Settings,
} from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'טיפולים שוטפים',
    description: 'טיפולי קילומטראז\' מקיפים הכוללים החלפת שמן, פילטרים ובדיקת מערכות הרכב.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: Gauge,
    title: 'אבחון ממוחשב',
    description: 'אבחון תקלות מתקדם באמצעות מכשור ממוחשב מהמתקדמים בשוק.',
    color: 'from-amber-500 to-amber-700',
  },
  {
    icon: Disc,
    title: 'בלמים ומתלים',
    description: 'החלפה ותיקון מערכות בלימה ומתלים לנסיעה בטוחה ונוחה.',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: Zap,
    title: 'חשמל רכב',
    description: 'טיפול במערכות חשמל, מצברים, אלטרנטורים ומערכות הצתה.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: ThermometerSun,
    title: 'מיזוג אוויר',
    description: 'תיקון ומילוי גז למערכות מיזוג אוויר לנסיעה נעימה בכל עונה.',
    color: 'from-cyan-500 to-cyan-700',
  },
  {
    icon: Droplets,
    title: 'מערכת קירור',
    description: 'בדיקה ותיקון מערכות קירור, רדיאטורים ומשאבות מים.',
    color: 'from-rose-500 to-rose-700',
  },
  {
    icon: Settings,
    title: 'גיר ומנוע',
    description: 'שיפוץ ותיקון מנועים, גירים אוטומטיים וידניים ברמה הגבוהה ביותר.',
    color: 'from-orange-500 to-orange-700',
  },
  {
    icon: CarFront,
    title: 'טסט שנתי',
    description: 'הכנת הרכב לטסט שנתי כולל בדיקה מקיפה ותיקון ליקויים.',
    color: 'from-indigo-500 to-indigo-700',
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

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32 lg:py-40 bg-[#0A0F1C] overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            השירותים שלנו
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            כל מה שהרכב שלכם{' '}
            <span className="text-gradient-blue">צריך במקום אחד</span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto">
            מגוון שירותים מקצועיים תחת קורת גג אחת, עם ציוד מתקדם וצוות מומחים
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group"
            >
              <div className="glass-card glass-card-hover p-8 md:p-10 h-full relative overflow-hidden">
                {/* Subtle gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex bg-gradient-to-br ${service.color} p-3 rounded-xl mb-5 shadow-lg`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
