import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, ChevronDown, Star, Shield, Clock, Zap } from 'lucide-react';

const floatingBadges = [
  { icon: Shield, label: 'אחריות מלאה', sub: '12 חודשים', color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', top: '20%', right: '5%', delay: 0.8 },
  { icon: Clock, label: 'שירות מהיר', sub: 'ביום אחד', color: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30', top: '55%', right: '2%', delay: 1.0 },
  { icon: Star, label: 'דירוג לקוחות', sub: '4.9 / 5 ⭐', color: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/30', top: '75%', left: '3%', delay: 1.2 },
  { icon: Zap, label: 'אבחון מיידי', sub: 'ללא עלות', color: 'from-brand-500/20 to-brand-600/20', border: 'border-brand-500/30', top: '25%', left: '4%', delay: 1.4 },
];

const stats = [
  { value: '15+', label: 'שנות ניסיון' },
  { value: '8,000+', label: 'רכבים טופלו' },
  { value: '98%', label: 'שביעות רצון' },
  { value: '1 יום', label: 'זמן טיפול ממוצע' },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ direction: 'rtl' }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700" />
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-brand-500/10 blur-[80px] pointer-events-none"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating badges */}
      {floatingBadges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: badge.delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            top: badge.top,
            right: badge.right,
            left: badge.left,
          }}
          className="hidden xl:block"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            className={`bg-gradient-to-br ${badge.color} backdrop-blur-md border ${badge.border} rounded-2xl px-4 py-3 shadow-2xl`}
          >
            <div className="flex items-center gap-2">
              <badge.icon className="w-4 h-4 text-white/80" />
              <div>
                <div className="text-white font-bold text-sm leading-none">{badge.label}</div>
                <div className="text-white/60 text-xs mt-0.5">{badge.sub}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div style={{ y, opacity }} className="relative z-10 section-container pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-right">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 rounded-full px-5 py-2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-brand-300 font-medium text-sm">מוסך מוביל באזור — מעל 15 שנות ניסיון</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-white">הרכב שלך</span>
              <br />
              <span className="bg-gradient-to-l from-brand-400 via-brand-500 to-orange-400 bg-clip-text text-transparent">
                בידיים הטובות
              </span>
              <br />
              <span className="text-white">ביותר</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-lg"
            >
              מוסך רונן מציע שירות תיקון רכב מקצועי עם{' '}
              <span className="text-white/90 font-semibold">שקיפות מלאה</span>,{' '}
              <span className="text-white/90 font-semibold">מחירים הוגנים</span> ו
              <span className="text-white/90 font-semibold">שירות ביום אחד</span>.
              אנחנו לא רק מתקנים רכבים — אנחנו בונים אמון.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-start"
            >
              <motion.a
                href="tel:+972501234567"
                whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(249,115,22,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 bg-gradient-to-l from-brand-500 to-brand-600 text-white font-bold px-8 py-4 rounded-2xl shadow-glow-orange transition-all duration-300 text-lg"
              >
                <Phone className="w-5 h-5" />
                התקשר עכשיו
              </motion.a>
              <motion.a
                href="#services"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/15 transition-all duration-300 text-lg"
              >
                גלה את השירותים
              </motion.a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-4 mt-10"
            >
              <div className="flex -space-x-2 space-x-reverse">
                {[
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=60&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="לקוח מרוצה"
                    className="w-10 h-10 rounded-full border-2 border-dark-900 object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/50 text-sm">+8,000 לקוחות מרוצים</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-3xl scale-110" />
              
              <motion.img
                src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=900&q=80"
                alt="מוסך רונן - שירות מקצועי"
                className="relative rounded-3xl shadow-2xl w-full object-cover h-[520px]"
                style={{ objectPosition: 'center' }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />

              {/* Floating card on image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="absolute bottom-6 right-6 left-6 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/80 text-sm font-medium">פתוח עכשיו</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">א׳–ו׳: 08:00–19:00</div>
                    <div className="text-white/50 text-xs">שישי: 08:00–14:00</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:border-brand-500/30 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-black text-brand-400 mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs font-medium tracking-widest uppercase">גלול למטה</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
