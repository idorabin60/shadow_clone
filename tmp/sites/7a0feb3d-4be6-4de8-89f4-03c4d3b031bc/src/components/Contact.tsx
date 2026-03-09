import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle2,
  MessageCircle, Calendar
} from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    label: 'טלפון',
    value: '050-123-4567',
    href: 'tel:+972501234567',
    color: 'from-orange-500 to-amber-400',
  },
  {
    icon: MessageCircle,
    label: 'וואטסאפ',
    value: 'שלח הודעה',
    href: 'https://wa.me/972501234567',
    color: 'from-green-500 to-emerald-400',
  },
  {
    icon: Mail,
    label: 'אימייל',
    value: 'ronen@garage.co.il',
    href: 'mailto:ronen@garage.co.il',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: MapPin,
    label: 'כתובת',
    value: 'רחוב הרצל 42, ירושלים',
    href: 'https://maps.google.com',
    color: 'from-red-500 to-orange-400',
  },
];

const hours = [
  { day: 'ראשון – חמישי', time: '08:00 – 19:00' },
  { day: 'שישי', time: '08:00 – 14:00' },
  { day: 'שבת', time: 'סגור' },
];

const services = [
  'טיפול שוטף', 'תיקון מנוע', 'מערכת חשמל', 'בלמים וגלגלים',
  'מיזוג אוויר', 'בדיקה לפני קנייה', 'טסט ורישוי', 'אחר',
];

export default function Contact() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' });

  const [form, setForm] = useState({
    name: '', phone: '', service: '', message: '', preferredTime: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section id="contact" dir="rtl" className="relative py-28 bg-dark-800 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Decorative */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-right mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange border border-orange-500/20 text-orange-300 text-sm font-assistant font-semibold mb-6"
          >
            <Calendar className="w-4 h-4" />
            <span>קבע תור</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-heebo font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-5"
          >
            בואו{' '}
            <span className="text-gradient">נדבר</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-assistant text-lg text-white/55 max-w-xl"
          >
            מלאו את הטופס ונחזור אליכם תוך שעה. לחילופין, התקשרו ישירות.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left: Contact info + hours */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact cards */}
            <div className="space-y-3">
              {contactInfo.map((info, i) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: -4, scale: 1.02 }}
                  className="flex items-center gap-4 p-4 rounded-2xl glass border border-white/8 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="font-assistant text-xs text-white/40 mb-0.5">{info.label}</div>
                    <div className="font-heebo font-semibold text-white text-sm">{info.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl glass border border-white/8 p-5"
            >
              <div className="flex items-center gap-2 mb-4 justify-end">
                <h3 className="font-heebo font-bold text-white">שעות פעילות</h3>
                <Clock className="w-4 h-4 text-orange-400" />
              </div>
              <div className="space-y-3">
                {hours.map((h) => (
                  <div key={h.day} className="flex items-center justify-between">
                    <span className={`font-assistant text-sm font-medium ${h.time === 'סגור' ? 'text-red-400' : 'text-orange-400'}`}>
                      {h.time}
                    </span>
                    <span className="font-assistant text-sm text-white/60">{h.day}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="מפת מיקום מוסך רונן"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 glass border-t border-white/8">
                <p className="font-assistant text-sm text-white/60 text-right">
                  📍 רחוב הרצל 42, ירושלים — חניה חינם בחצר
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="rounded-3xl glass border border-white/10 p-8 shadow-2xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center gap-6"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-2xl">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heebo font-black text-2xl text-white mb-2">הפנייה התקבלה!</h3>
                    <p className="font-assistant text-white/60">נחזור אליך תוך שעה בימי עסקים.</p>
                  </div>
                  <motion.button
                    onClick={() => setSubmitted(false)}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 font-assistant font-semibold text-sm hover:bg-orange-500/30 transition-colors"
                  >
                    שלח פנייה נוספת
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
                  <h3 className="font-heebo font-black text-2xl text-white mb-6 text-right">
                    קבע תור — חינם ומהיר
                  </h3>

                  {/* Name + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-assistant text-sm text-white/60 mb-2 text-right">
                        שם מלא *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="ישראל ישראלי"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 font-assistant text-sm focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all duration-200 text-right"
                      />
                    </div>
                    <div>
                      <label className="block font-assistant text-sm text-white/60 mb-2 text-right">
                        טלפון *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="050-000-0000"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 font-assistant text-sm focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all duration-200 text-right"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block font-assistant text-sm text-white/60 mb-2 text-right">
                      סוג שירות
                    </label>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {services.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, service: s }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-assistant font-medium transition-all duration-200 ${
                            form.service === s
                              ? 'bg-orange-500 text-white border border-orange-500'
                              : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/25 hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred time */}
                  <div>
                    <label className="block font-assistant text-sm text-white/60 mb-2 text-right">
                      זמן מועדף לחזרה
                    </label>
                    <input
                      type="text"
                      value={form.preferredTime}
                      onChange={e => setForm(f => ({ ...f, preferredTime: e.target.value }))}
                      placeholder="למשל: בוקר, אחה״צ, ערב..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 font-assistant text-sm focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all duration-200 text-right"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-assistant text-sm text-white/60 mb-2 text-right">
                      תיאור הבעיה / הערות
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="תאר את הבעיה ברכב, סוג הרכב, שנת ייצור..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 font-assistant text-sm focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all duration-200 text-right resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(249,115,22,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-heebo font-bold text-lg shadow-glow disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden shimmer-btn"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>שלח פנייה</span>
                      </>
                    )}
                  </motion.button>

                  <p className="font-assistant text-xs text-white/30 text-center">
                    הפרטים שלך מאובטחים ולא יועברו לצד שלישי
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
