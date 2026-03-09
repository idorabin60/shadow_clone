import { motion } from 'framer-motion'
import { ChevronDown, Zap, ArrowRight } from 'lucide-react'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all cursor-pointer">
              <Zap size={16} className="text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300">שירות מהיר וחצי שעה</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              תיקון רכב
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              בשקיפות מלאה
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            מוסך רוזן פרו מספק שירות תיקון רכב מקצועי עם שקיפות מלאה, מחירים הוגנים, וזמן שירות מהיר. אנחנו מתחייבים לאיכות ללא פשרות.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl text-lg hover:shadow-2xl transition-all flex items-center gap-2"
            >
              קבל הצעה חינם
              <ArrowRight size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl text-lg hover:border-white/40 transition-all"
            >
              צפה בשירותים
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 pt-12 max-w-2xl mx-auto"
          >
            {[
              { number: '500+', label: 'לקוחות מרוצים' },
              { number: '15+', label: 'שנות ניסיון' },
              { number: '24/7', label: 'שירות חירום' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/10 transition-all"
              >
                <p className="text-2xl md:text-3xl font-extrabold text-cyan-400">{stat.number}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown size={32} className="text-cyan-400" />
      </motion.div>
    </section>
  )
}
