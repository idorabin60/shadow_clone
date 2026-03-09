import { motion } from 'framer-motion'
import { CheckCircle, Eye, Zap, DollarSign, Users, Award } from 'lucide-react'

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Eye,
      title: 'שקיפות מלאה',
      description: 'אנחנו מספקים דוח מפורט של כל עבודה עם תמונות ותיעוד מלא',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'שירות מהיר',
      description: 'רוב התיקונים מסתיימים ביום אחד עם שירות חירום 24/7',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: DollarSign,
      title: 'מחירים הוגנים',
      description: 'מחירים תחרותיים ללא עלויות נסתרות או הפתעות',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'צוות מקצועי',
      description: 'טכנאים מיומנים עם 15+ שנות ניסיון בתחום',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Award,
      title: 'אישורים וסמכויות',
      description: 'מוסך מורשה עם כל ההסמכות והאישורים הנדרשים',
      color: 'from-red-500 to-rose-500',
    },
    {
      icon: CheckCircle,
      title: 'אחריות מלאה',
      description: 'כל עבודה מכוסה בהבטחת איכות ואחריות מלאה',
      color: 'from-indigo-500 to-blue-500',
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
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="why" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
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
              למה לבחור בנו?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            אנחנו מתחייבים לשקיפות, איכות וחדשנות בכל עבודה שאנחנו עושים
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1487700492018-f3b90425d6a1?auto=format&fit=crop&w=600&q=80"
                alt="מוסך מקצועי"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-w-xs"
            >
              <p className="text-white font-bold mb-2">✓ מוסך מורשה</p>
              <p className="text-gray-300 text-sm">עם כל ההסמכות והאישורים הנדרשים</p>
            </motion.div>
          </motion.div>

          {/* Right Column - Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {reasons.map((reason, index) => {
              const Icon = reason.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: -8 }}
                  className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${reason.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {reason.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
