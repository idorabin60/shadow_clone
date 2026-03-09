import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Zap, Globe, ChevronDown } from 'lucide-react';

const floatingCards = [
  { icon: Lock, label: 'הצפנה מתקדמת', x: '10%', y: '20%', delay: 1.2 },
  { icon: Zap, label: 'זיהוי בזמן אמת', x: '80%', y: '15%', delay: 1.5 },
  { icon: Globe, label: 'הגנה גלובלית', x: '85%', y: '65%', delay: 1.8 },
];

const stats = [
  { value: '99.97%', label: 'זמן פעילות מובטח' },
  { value: '< 0.3s', label: 'זמן תגובה לאיום' },
  { value: '500+', label: 'ארגונים מוגנים' },
  { value: '24/7', label: 'ניטור רציף' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px]" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />
      </div>

      {/* Floating Cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: card.delay, duration: 0.8, ease: 'easeOut' }}
          className="absolute hidden lg:flex glass rounded-2xl px-4 py-3 items-center gap-3 shadow-2xl"
          style={{ left: card.x, top: card.y }}
        >
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          >
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-2 rounded-lg">
              <card.icon className="w-4 h-4 text-cyan-400" />
            </div>
          </motion.div>
          <span className="text-xs font-medium text-gray-300 whitespace-nowrap">{card.label}</span>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm font-medium text-cyan-300">פלטפורמת אבטחת סייבר מהדור הבא</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-white">הגנה מוחלטת</span>
          <br />
          <span className="text-gradient">בעידן הדיגיטלי</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          ZeroTrust Dynamics מספקת שכבת הגנה חכמה מבוססת בינה מלאכותית,
          שמזהה, מנתחת ומנטרלת איומי סייבר בזמן אמת — לפני שהם פוגעים בעסק שלך.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-l from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-300" />
            <div className="relative flex items-center gap-3 bg-gradient-to-l from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl">
              <span>קבל הדגמה חינם</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </motion.a>

          <motion.a
            href="#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 glass text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all"
          >
            <span>גלה את השירותים</span>
            <Shield className="w-5 h-5 text-cyan-400" />
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-2xl p-5 glow-cyan group hover:border-cyan-500/20 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent rounded-3xl blur-2xl" />
          <div className="relative glass rounded-3xl overflow-hidden shadow-2xl glow-blue">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80"
              alt="Cybersecurity Dashboard"
              className="w-full h-[300px] md:h-[500px] object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
            <div className="absolute bottom-6 right-6 left-6 flex items-center justify-between">
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-green-300">כל המערכות פעילות</span>
              </div>
              <div className="glass rounded-xl px-4 py-2">
                <span className="text-sm font-medium text-gray-300">0 איומים פעילים</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-12 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs font-medium">גלול למטה</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}