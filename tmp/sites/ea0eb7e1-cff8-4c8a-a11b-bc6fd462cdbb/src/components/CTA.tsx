import React from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowLeft } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 md:py-32 bg-[#111827] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            מוכנים לתת לרכב שלכם{' '}
            <span className="text-gradient-hero">את הטיפול שהוא מגיע לו?</span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto mb-10">
            קבעו תור עוד היום ותנו לצוות המומחים שלנו לדאוג לכל השאר
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              href="tel:031234567"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 text-lg"
            >
              התקשרו עכשיו
              <ArrowLeft className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
