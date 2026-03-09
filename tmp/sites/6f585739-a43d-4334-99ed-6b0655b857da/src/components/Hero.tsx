import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Award, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury interior design"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0A0A0A]" />
        <div className="absolute inset-0 ambient-glow" />
      </div>

      {/* Decorative Gold Line */}
      <div className="absolute top-0 right-0 w-px h-40 gold-shimmer opacity-30" />
      <div className="absolute top-0 left-0 w-px h-60 gold-shimmer opacity-20" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 w-full pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-12 gold-shimmer" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#BF9B51]">
              סטודיו לעיצוב פנים יוקרתי
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight text-[#F5F0E8] mb-8"
          >
            מעצבים את
            <br />
            <span className="gold-text">החלום שלכם</span>
            <br />
            למציאות
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg md:text-xl font-light leading-relaxed text-[#8A8578] max-w-2xl mb-12"
          >
            אטלס עיצובים מביא לכם עיצוב פנים ברמה הגבוהה ביותר. אנו יוצרים חללים שמספרים את הסיפור שלכם — עם תשומת לב לכל פרט, חומרים מובחרים ואסתטיקה ללא פשרות.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-4 mb-20"
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full gold-shimmer text-[#0A0A0A] font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-[0_0_50px_rgba(191,155,81,0.3)]"
            >
              <Sparkles className="w-5 h-5" />
              <span>קבעו פגישת ייעוץ</span>
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/[0.1] text-[#F5F0E8] font-medium text-lg hover:border-[#BF9B51]/40 hover:bg-white/[0.03] transition-all duration-300 backdrop-blur-sm"
            >
              <span>צפו בפרויקטים</span>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-8 md:gap-16"
          >
            {[
              { icon: Award, number: '15+', label: 'שנות ניסיון' },
              { icon: Users, number: '500+', label: 'לקוחות מרוצים' },
              { icon: Sparkles, number: '1,200+', label: 'פרויקטים שהושלמו' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#BF9B51]" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-[#F5F0E8]">{stat.number}</div>
                  <div className="text-sm text-[#8A8578]">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[#5A5650] uppercase tracking-[0.2em]">גלול למטה</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-5 h-5 text-[#BF9B51]" />
        </motion.div>
      </motion.div>
    </section>
  );
}