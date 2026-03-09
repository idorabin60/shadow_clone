import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Eye,
  Clock,
  BadgeDollarSign,
  Headphones,
  Award,
} from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'שקיפות מלאה',
    description: 'תמיד תדעו מה קורה עם הרכב שלכם. אנחנו מסבירים כל תיקון לפני שמתחילים.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: BadgeDollarSign,
    title: 'מחירים הוגנים',
    description: 'ללא הפתעות. הצעת מחיר מפורטת מראש עם התחייבות למחיר סופי.',
    color: 'from-amber-500 to-amber-700',
  },
  {
    icon: Clock,
    title: 'עמידה בזמנים',
    description: 'אנחנו מכבדים את הזמן שלכם. הרכב יהיה מוכן בזמן שסוכם — תמיד.',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: ShieldCheck,
    title: 'אחריות מלאה',
    description: 'אחריות מקיפה על כל עבודה שאנחנו מבצעים. השקט שלכם חשוב לנו.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: Headphones,
    title: 'שירות אישי',
    description: 'כל לקוח מקבל יחס אישי ומותאם. אנחנו כאן בשבילכם בכל שאלה.',
    color: 'from-cyan-500 to-cyan-700',
  },
  {
    icon: Award,
    title: 'מומחיות מוכחת',
    description: 'צוות טכנאים מוסמכים עם הכשרות מתקדמות וניסיון של שנים.',
    color: 'from-rose-500 to-rose-700',
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

export default function WhyUs() {
  return (
    <section id="why-us" className="relative py-24 md:py-32 lg:py-40 bg-[#111827] overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:sticky lg:top-32"
          >
            <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              למה לבחור בנו
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              לא סתם מוסך.{' '}
              <span className="text-gradient-amber">המוסך שלכם.</span>
            </h2>
            <p className="text-base md:text-lg font-normal text-gray-300 mb-8 leading-relaxed">
              אנחנו לא רק מתקנים רכבים — אנחנו בונים מערכת יחסים של אמון עם כל לקוח. 
              הגישה שלנו מבוססת על שקיפות, מקצועיות ושירות שלא מתפשר.
            </p>

            {/* Image */}
            <div className="gradient-border">
              <img
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80"
                alt="מוסך מקצועי"
                className="rounded-2xl w-full h-[280px] md:h-[320px] object-cover"
              />
            </div>
          </motion.div>

          {/* Right features grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ x: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group"
              >
                <div className="glass-card glass-card-hover p-6 md:p-8 flex items-start gap-5 relative overflow-hidden">
                  {/* Number */}
                  <span className="absolute top-4 left-4 text-6xl font-black text-white/[0.03] select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className={`flex-shrink-0 bg-gradient-to-br ${feature.color} p-3 rounded-xl shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
