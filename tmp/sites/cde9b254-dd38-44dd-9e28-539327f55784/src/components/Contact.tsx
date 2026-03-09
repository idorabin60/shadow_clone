import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, MapPin, Clock, Send, CheckCircle, MessageSquare, Mail } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    title: 'טלפון',
    value: '050-123-4567',
    sub: 'זמין א׳–ו׳ 08:00–19:00',
    href: 'tel:+972501234567',
    color: 'from-brand-500/20 to-orange-500/20',
    border: 'border-brand-500/30',
    iconColor: 'text-brand-400',
  },
  {
    icon: MapPin,
    title: 'כתובת',
    value: 'רחוב הנחושת 12, תל אביב',
    sub: 'חניה חינם בשטח המוסך',
    href: 'https://maps.google.com',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  {
    icon: Clock,
    title: 'שעות פעילות',
    value: 'א׳–ה׳: 08:00–19:00',
    sub: 'שישי: 08:00–14:00 | שבת: סגור',
    href: null,
    color: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    iconColor: 'text-green-400',
  },
  {
    icon: MessageSquare,
    title: 'וואטסאפ',
    value: 'שלח הודעה',
    sub: 'מענה תוך שעה',
    href: 'https://wa.me/972501234567',
    color: 'from-green-600/20 to-teal-500/20',
    border: 'border-green-600/30',
    iconColor: 'text-green-300',
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [formState, setFormState] = useState({ name: '', phone: '', car: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800 via-dark-900 to-dark-900" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-brand-600/8 blur-[150px] pointer-events-none" />

      <div className="relative section-container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 rounded-full px-5 py-2 mb-6">
            <Phone className="w-4 h-4 text-brand-400" />
            <span className="text-brand-300 font-medium text-sm">צור קשר</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            מוכן לתאם תור?
            <br />
            <span className="bg-gradient-to-l from-brand-400 to-brand-600 bg-clip-text text-transparent">
              נשמח לעזור
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            מלא את הטופס ונחזור אליך תוך שעה. אבחון ראשוני ללא עלות.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: -4 }}
              >
                {info.href ? (
                  <a
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className={`flex items-center gap-4 bg-gradient-to-br ${info.color} backdrop-blur-md border ${info.border} rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 block`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0`}>
                      <info.icon className={`w-6 h-6 ${info.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs mb-0.5">{info.title}</div>
                      <div className="text-white font-bold">{info.value}</div>
                      <div className="text-white/40 text-xs">{info.sub}</div>
                    </div>
                  </a>
                ) : (
                  <div className={`flex items-center gap-4 bg-gradient-to-br ${info.color} backdrop-blur-md border ${info.border} rounded-2xl p-5 shadow-xl`}>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className={`w-6 h-6 ${info.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs mb-0.5">{info.title}</div>
                      <div className="text-white font-bold">{info.value}</div>
                      <div className="text-white/40 text-xs">{info.sub}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-1 min-h-[160px]"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="מפה"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-brand-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-sm">רחוב הנחושת 12</div>
                  <div className="text-white/50 text-xs">תל אביב</div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-brand-400 text-xs underline"
                  >
                    פתח במפות
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl h-full">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-3">הפנייה התקבלה!</h3>
                  <p className="text-white/60 text-lg">נחזור אליך תוך שעה לאישור התור.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-brand-400 text-sm underline"
                  >
                    שלח פנייה נוספת
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="text-2xl font-black text-white mb-2">קביעת תור</h3>
                  <p className="text-white/50 text-sm mb-2">מלא את הפרטים ונחזור אליך בהקדם</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-sm mb-2 font-medium">שם מלא *</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                        placeholder="ישראל ישראלי"
                        className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-500/60 focus:bg-white/12 transition-all duration-200 text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2 font-medium">טלפון *</label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                        placeholder="050-000-0000"
                        className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-500/60 focus:bg-white/12 transition-all duration-200 text-right"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2 font-medium">סוג הרכב</label>
                    <input
                      type="text"
                      value={formState.car}
                      onChange={e => setFormState(s => ({ ...s, car: e.target.value }))}
                      placeholder="לדוגמה: טויוטה קורולה 2020"
                      className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-500/60 focus:bg-white/12 transition-all duration-200 text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2 font-medium">תיאור הבעיה</label>
                    <textarea
                      rows={4}
                      value={formState.message}
                      onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                      placeholder="תאר את הבעיה שחווית ברכב..."
                      className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-500/60 focus:bg-white/12 transition-all duration-200 resize-none text-right"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(249,115,22,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 bg-gradient-to-l from-brand-500 to-brand-600 text-white font-bold px-8 py-4 rounded-2xl shadow-glow-orange transition-all duration-300 text-lg disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        שולח...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        שלח פנייה
                      </>
                    )}
                  </motion.button>

                  <p className="text-white/30 text-xs text-center">
                    * אבחון ראשוני ללא עלות. נחזור אליך תוך שעה בשעות הפעילות.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
