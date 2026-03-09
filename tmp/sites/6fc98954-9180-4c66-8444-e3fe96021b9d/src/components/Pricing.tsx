import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'בדיקה בסיסית',
      price: '₪199',
      description: 'בדיקה כללית של הרכב',
      features: [
        'בדיקת מנוע',
        'בדיקת מערכות חשמל',
        'בדיקת בטיחות',
        'דוח מפורט',
      ],
      highlighted: false,
    },
    {
      name: 'תיקון מקצועי',
      price: '₪499',
      description: 'תיקון מלא עם חלקים מקוריים',
      features: [
        'כל מה שבחבילה הבסיסית',
        'תיקון מלא',
        'חלקים מקוריים',
        'אחריות 6 חודשים',
        'שירות חירום 24/7',
      ],
      highlighted: true,
    },
    {
      name: 'חבילה שנתית',
      price: '₪2,999',
      description: 'תחזוקה שנתית מלאה',
      features: [
        'כל מה שבחבילה המקצועית',
        '4 בדיקות שנתיות',
        'החלפת שמן וסינון',
        'אחריות מלאה',
        'עדיפות בתור',
        'הנחות על חלקים',
      ],
      highlighted: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
              תמחור שקוף
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            בחר את החבילה המתאימה לך - כל מחיר כולל את כל העלויות
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -12, boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)' }}
              className={`relative p-8 rounded-2xl transition-all ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {/* Highlighted Badge */}
              {plan.highlighted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 right-8 px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold rounded-full"
                >
                  המומלץ ביותר
                </motion.div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  {plan.price}
                </span>
                <p className="text-gray-400 text-sm mt-2">לחבילה</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: featureIndex * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Check size={20} className="text-cyan-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                בחר חבילה
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-center"
        >
          <p className="text-gray-300 mb-4">
            <span className="font-bold text-white">כל המחירים כוללים:</span> חלקים מקוריים, עבודה מקצועית, דוח מפורט, ואחריות מלאה
          </p>
          <p className="text-gray-400 text-sm">
            אין עלויות נסתרות או הפתעות - שקיפות מלאה בכל עסקה
          </p>
        </motion.div>
      </div>
    </section>
  )
}
