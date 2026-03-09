import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
} from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    title: 'טלפון',
    value: '03-1234567',
    subtitle: 'זמינים בשעות הפעילות',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: Mail,
    title: 'אימייל',
    value: 'info@rozen-pro.co.il',
    subtitle: 'נחזור אליכם תוך שעות',
    color: 'from-amber-500 to-amber-700',
  },
  {
    icon: MapPin,
    title: 'כתובת',
    value: 'רחוב התעשייה 15, תל אביב',
    subtitle: 'חניה חינם ללקוחות',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: Clock,
    title: 'שעות פעילות',
    value: 'א\'-ה\' 08:00-18:00',
    subtitle: 'ו\' 08:00-13:00',
    color: 'from-purple-500 to-purple-700',
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 lg:py-40 bg-[#0A0F1C] overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <MessageCircle className="w-4 h-4" />
            צור קשר
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            בואו נדבר על{' '}
            <span className="text-gradient-amber">הרכב שלכם</span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto">
            השאירו פרטים ונחזור אליכם בהקדם, או התקשרו ישירות לקביעת תור
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card glass-card-hover p-6 flex items-start gap-4"
              >
                <div className={`flex-shrink-0 bg-gradient-to-br ${info.color} p-3 rounded-xl shadow-lg`}>
                  <info.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{info.title}</p>
                  <p className="text-gray-300 text-sm font-medium">{info.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{info.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-8 md:p-10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 rounded-full mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">ההודעה נשלחה בהצלחה!</h3>
                  <p className="text-gray-400">נחזור אליכם בהקדם האפשרי</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">שם מלא</label>
                      <input
                        type="text"
                        required
                        placeholder="הכניסו את שמכם"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">טלפון</label>
                      <input
                        type="tel"
                        required
                        placeholder="050-0000000"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">סוג הרכב</label>
                    <input
                      type="text"
                      placeholder="לדוגמה: Toyota Corolla 2020"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">סוג השירות</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm appearance-none">
                      <option value="">בחרו שירות</option>
                      <option value="regular">טיפול שוטף</option>
                      <option value="diagnostic">אבחון ממוחשב</option>
                      <option value="brakes">בלמים ומתלים</option>
                      <option value="electric">חשמל רכב</option>
                      <option value="ac">מיזוג אוויר</option>
                      <option value="engine">גיר ומנוע</option>
                      <option value="test">טסט שנתי</option>
                      <option value="other">אחר</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">הודעה</label>
                    <textarea
                      rows={4}
                      placeholder="ספרו לנו על הבעיה או השירות שאתם צריכים..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-l from-amber-500 to-amber-600 text-black font-bold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 text-lg"
                  >
                    <Send className="w-5 h-5" />
                    שלחו הודעה
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
