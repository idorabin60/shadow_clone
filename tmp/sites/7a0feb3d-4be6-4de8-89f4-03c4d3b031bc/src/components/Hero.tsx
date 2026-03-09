import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Phone, Calendar, ChevronDown, Star, Shield, Clock, Award } from 'lucide-react';

const stats = [
  { value: '15+', label: 'שנות ניסיון', icon: Award },
  { value: '4,800+', label: 'לקוחות מרוצים', icon: Star },
  { value: '98%', label: 'שביעות רצון', icon: Shield },
  { value: '24/7', label: 'זמינות טלפונית', icon: Clock },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      dir="rtl"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-dark-900"
    >
      {/* Background layers */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1920&q=80"
          alt="מוסך מקצועי"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/85 via-dark-900/70 to-dark-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/40" />
      </motion.div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(249,115,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] z-0 pointer-events-none" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-start mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange border border-orange-500/30 text-orange-300 text-sm font-assistant font-semibold">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span>מוסך מורשה ומוסמך — ירושלים</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-heebo font-black text-5xl sm:text-6xl md:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-right mb-6"
          >
            <span className="text-white block">הרכב שלך</span>
            <span className="text-gradient block">בידיים הטובות</span>
            <span className="text-white block">ביותר</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="font-assistant text-lg sm:text-xl text-white/65 text-right leading-relaxed max-w-2xl mb-10"
          >
            מוסך רונן — מעל 15 שנות ניסיון בתיקון ותחזוקת רכבים. שירות מקצועי, מחירים הוגנים,
            ואחריות מלאה על כל עבודה. כי הרכב שלך לא פחות ממה שאתה מגיע לו.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-start"
          >
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 60px rgba(249,115,22,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-heebo font-bold text-lg shadow-glow overflow-hidden shimmer-btn transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              <span>קבע תור עכשיו</span>
            </motion.a>

            <motion.a
              href="tel:+972501234567"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass border border-white/15 text-white font-heebo font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              <Phone className="w-5 h-5 text-orange-400" />
              <span>050-123-4567</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-2xl p-5 text-right border border-white/8 hover:border-orange-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center group-hover:bg-orange-500/25 transition-colors duration-300">
                  <stat.icon className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <div className="font-heebo font-black text-3xl text-white mb-1">{stat.value}</div>
              <div className="font-assistant text-sm text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs font-assistant">גלול למטה</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-orange-400/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
