import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ArrowRight, Zap } from 'lucide-react'

export default function CTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-10"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-16 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-slate-950 border border-cyan-500/30 rounded-3xl overflow-hidden"
        >
          {/* Animated Border */}
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
          />

          <div className="relative z-10">
            {/* Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center space-y-8"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                  <Zap size={16} className="text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-300">קבל הצעה חינם עכשיו</span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold"
              >
                <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
                  מוכן לתיקון הרכב שלך?
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-300 max-w-2xl mx-auto"
              >
                צור קשר איתנו היום וקבל הצעה חינם. אנחנו כאן כדי לעזור לך עם כל צרכי תיקון הרכב שלך.
              </motion.p>

              {/* Contact Methods */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
              >
                {[
                  {
                    icon: Phone,
                    label: 'טלפון',
                    value: '03-123-4567',
                    href: 'tel:0312345678',
                  },
                  {
                    icon: Mail,
                    label: 'דוא"ל',
                    value: 'info@rozenpro.co.il',
                    href: 'mailto:info@rozenpro.co.il',
                  },
                  {
                    icon: MapPin,
                    label: 'כתובת',
                    value: 'רחוב הרכב 123, תל אביב',
                    href: '#',
                  },
                ].map((contact, index) => {
                  const Icon = contact.icon
                  return (
                    <motion.a
                      key={index}
                      href={contact.href}
                      whileHover={{ y: -5 }}
                      className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                    >
                      <Icon size={28} className="text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-gray-400 mb-1">{contact.label}</p>
                      <p className="text-white font-semibold">{contact.value}</p>
                    </motion.a>
                  )
                })}
              </motion.div>

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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl text-lg hover:bg-white/20 transition-all"
                >
                  צור קשר
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-center"
        >
          {[
            { emoji: '✓', text: 'מוסך מורשה' },
            { emoji: '⭐', text: '500+ ביקורות חיוביות' },
            { emoji: '🔒', text: 'אחריות מלאה' },
            { emoji: '⚡', text: 'שירות מהיר' },
          ].map((badge, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg"
            >
              <span className="text-2xl mr-2">{badge.emoji}</span>
              <span className="text-gray-300 font-semibold">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
