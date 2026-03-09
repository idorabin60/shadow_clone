import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Mail, Phone, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'אימייל', value: 'info@zerotrust.co.il' },
  { icon: Phone, label: 'טלפון', value: '03-555-0199' },
  { icon: MapPin, label: 'כתובת', value: 'מגדל אלון, תל אביב' },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6">
            <Send className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">צור קשר</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="text-white">בואו נדבר על</span>{' '}
            <span className="text-gradient">האבטחה שלכם</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            השאירו פרטים ונחזור אליכם תוך 24 שעות עם הצעה מותאמת אישית
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-cyan-500/20 transition-all group"
              >
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-3 rounded-xl group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all">
                  <info.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">{info.label}</div>
                  <div className="text-white font-bold">{info.value}</div>
                </div>
              </motion.div>
            ))}

            {/* Map Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="relative glass rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="Office Location"
                className="w-full h-48 object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent" />
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl glow-cyan">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-6 rounded-full mb-6">
                    <CheckCircle className="w-12 h-12 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">ההודעה נשלחה בהצלחה!</h3>
                  <p className="text-gray-400">נחזור אליך בהקדם האפשרי</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">שם מלא</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        placeholder="הכנס את שמך"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">חברה</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        placeholder="שם החברה"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">אימייל</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">טלפון</label>
                      <input
                        type="tel"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        placeholder="050-000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">הודעה</label>
                    <textarea
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none"
                      placeholder="ספר לנו על צרכי האבטחה שלך..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group w-full"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-l from-cyan-500 to-blue-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-center gap-3 bg-gradient-to-l from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl">
                      <span>שלח הודעה</span>
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}