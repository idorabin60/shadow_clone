import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[--bg-primary]" />

      {/* Decorative gold orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[--accent-gold] opacity-[0.03] blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[--accent-gold] opacity-[0.04] blur-3xl rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[--accent-gold] opacity-[0.02] blur-3xl rounded-full" />

      {/* Background image overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury interior"
          className="w-full h-full object-cover opacity-[0.07]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex flex-col items-center gap-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass-card rounded-full px-6 py-2.5 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[--accent-gold]" />
            <span className="text-sm font-medium text-[--text-secondary]">סטודיו לעיצוב פנים יוקרתי</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
          >
            <span className="block">מעצבים את</span>
            <span className="block gold-text">החלום שלכם</span>
            <span className="block">למציאות</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl font-light text-[--text-secondary] max-w-2xl leading-relaxed"
          >
            אטלס עיצובים — סטודיו בוטיק לעיצוב דירות יוקרה ומשרדי הייטק.
            <br />
            יוצרים חללים שמספרים את הסיפור שלכם.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <a
              href="#contact"
              className="px-8 py-4 rounded-full gold-gradient text-[#0A0A0A] text-base font-medium tracking-wide hover:shadow-xl hover:shadow-[--accent-gold]/25 transition-all duration-300 hover:scale-105"
            >
              קבעו פגישת ייעוץ חינם
            </a>
            <a
              href="#projects"
              className="px-8 py-4 rounded-full glass-card text-[--text-primary] text-base font-medium tracking-wide hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              צפו בפרויקטים שלנו
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 pt-12 border-t border-[--glass-border]"
          >
            {[
              { number: '250+', label: 'פרויקטים שהושלמו' },
              { number: '15+', label: 'שנות ניסיון' },
              { number: '98%', label: 'שביעות רצון לקוחות' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black gold-text">{stat.number}</div>
                <div className="text-sm text-[--text-muted] mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-5 h-5 text-[--accent-gold] opacity-60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}