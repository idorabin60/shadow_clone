import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Phone, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#0A0F1C]" />
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>🔧 מוסך מקצועי ואמין</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6"
        >
          <span className="text-white">הרכב שלכם</span>
          <br />
          <span className="text-gradient-hero">מקבל את הטיפול הטוב ביותר</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          מוסך רוזן פרו — שירות מקצועי, שקיפות מלאה ואמינות ללא פשרות.
          <br className="hidden md:block" />
          אנחנו מטפלים ברכב שלכם כאילו הוא שלנו.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-gradient-to-l from-amber-500 to-amber-600 text-black font-bold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 text-lg"
          >
            <Phone className="w-5 h-5" />
            קבעו תור עכשיו
          </motion.a>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 text-lg"
          >
            גלו את השירותים שלנו
            <ArrowLeft className="w-5 h-5" />
          </motion.a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1 space-x-reverse">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-gray-400 font-medium">4.9/5 מתוך 500+ ביקורות</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 font-medium">אחריות מלאה על כל טיפול</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-medium">🏆 15+ שנות ניסיון</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0F1C] to-transparent" />
    </section>
  );
}
