import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Clock, ShieldCheck } from 'lucide-react';

const stats = [
  { icon: Clock, value: '15+', label: 'שנות ניסיון', color: 'from-blue-500 to-blue-700' },
  { icon: Users, value: '10,000+', label: 'לקוחות מרוצים', color: 'from-amber-500 to-amber-700' },
  { icon: Award, value: '98%', label: 'שביעות רצון', color: 'from-emerald-500 to-emerald-700' },
  { icon: ShieldCheck, value: '100%', label: 'אחריות מלאה', color: 'from-purple-500 to-purple-700' },
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 lg:py-40 bg-[#111827] overflow-hidden">
      {/* Background orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="gradient-border">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80"
                alt="מוסך רוזן פרו - צוות מקצועי"
                className="rounded-2xl w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 md:left-6 glass-card p-4 md:p-6 flex items-center gap-3"
            >
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl">
                <Award className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">15+ שנים</p>
                <p className="text-gray-400 text-sm">של מצוינות בשירות</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              אודותינו
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              מוסך שמבין{' '}
              <span className="text-gradient-blue">את הרכב שלכם</span>
            </h2>
            <p className="text-base md:text-lg font-normal text-gray-300 mb-6 leading-relaxed">
              מוסך רוזן פרו הוקם מתוך אהבה אמיתית לעולם הרכב ומחויבות לשירות ברמה הגבוהה ביותר. 
              עם צוות טכנאים מוסמכים, ציוד מתקדם וגישה שקופה — אנחנו מבטיחים שכל לקוח יוצא מרוצה ובטוח ברכב שלו.
            </p>
            <p className="text-base md:text-lg font-normal text-gray-300 mb-8 leading-relaxed">
              אנחנו מאמינים שמוסך טוב נמדד לא רק באיכות העבודה, אלא גם באמון שהוא בונה עם הלקוחות שלו. 
              לכן אנחנו מציעים שקיפות מלאה בכל שלב — מהאבחון ועד למסירה.
            </p>

            <div className="flex flex-wrap gap-4">
              {['ציוד מתקדם', 'טכנאים מוסמכים', 'מחירים הוגנים', 'שקיפות מלאה'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-gray-300 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-20 md:mt-28"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="glass-card glass-card-hover p-8 text-center"
            >
              <div className={`inline-flex bg-gradient-to-br ${stat.color} p-3 rounded-xl mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</p>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
