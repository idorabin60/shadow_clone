import { motion } from 'framer-motion'
import { Wrench, Zap, Shield, Droplet, Gauge, Lightbulb, ArrowRight } from 'lucide-react'

export default function Services() {
  const services = [
    {
      icon: Wrench,
      title: 'תיקון כללי',
      description: 'תיקון כללי של כל חלקי הרכב עם חלקים מקוריים ובעלי איכות גבוהה',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Zap,
      title: 'מערכות חשמל',
      description: 'אבחון ותיקון מערכות חשמל מתקדמות עם ציוד מודרני',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Droplet,
      title: 'שמן וזיתים',
      description: 'החלפת שמן, סינון וזיתים עם מוצרים מומלצים',
      color: 'from-amber-500 to-yellow-600',
    },
    {
      icon: Gauge,
      title: 'בדיקה טכנית',
      description: 'בדיקה טכנית מלאה וקבלת תעודה רשמית',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Shield,
      title: 'בטיחות וגלגלים',
      description: 'בדיקת בטיחות, החלפת גלגלים ויישור גלגלים',
      color: 'from-red-500 to-pink-600',
    },
    {
      icon: Lightbulb,
      title: 'תאורה וחלקים',
      description: 'החלפת נורות, פנסים וחלקים חיצוניים שונים',
      color: 'from-purple-500 to-indigo-600',
    },
  ]

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
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              שירותים מקצועיים
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            מגוון שירותים מקצועיים לכל צרכי תיקון הרכב שלך
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}
                className="group relative p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon size={28} className="text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Arrow */}
                  <motion.div
                    whileHover={{ x: -5 }}
                    className="flex items-center gap-2 text-cyan-400 font-semibold text-sm"
                  >
                    <span>קרא עוד</span>
                    <ArrowRight size={16} />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
