import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const contactInfo = [
  { icon: Phone, label: 'טלפון', value: '03-1234567', href: 'tel:031234567' },
  { icon: Mail, label: 'אימייל', value: 'info@atlas-design.co.il', href: 'mailto:info@atlas-design.co.il' },
  { icon: MapPin, label: 'כתובת', value: 'רוטשילד 45, תל אביב', href: '#' },
  { icon: Clock, label: 'שעות פעילות', value: 'א׳-ה׳ 09:00-18:00', href: '#' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: '-80px' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="relative py-28 md:py-36 lg:py-44 bg-[#111111]">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-white/[0.06] to-transparent" />

      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full bg-[#BF9B51]/[0.02] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 gold-shimmer" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#BF9B51]">
              צור קשר
            </span>
            <div className="h-px w-12 gold-shimmer" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#F5F0E8] mb-6">
            בואו נתחיל
            <span className="gold-text"> לעצב ביחד</span>
          </h2>
          <p className="text-base md:text-lg font-light leading-relaxed text-[#8A8578] max-w-2xl mx-auto">
            מוכנים להפוך את החלום למציאות? השאירו פרטים ונחזור אליכם תוך 24 שעות.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 md:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={headerInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                whileHover={{ x: -4, borderColor: 'rgba(191,155,81,0.3)' }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl p-6 flex items-center gap-5 group block"
              >
                <div className="w-14 h-14 rounded-xl bg-[#BF9B51]/10 flex items-center justify-center shrink-0 group-hover:bg-[#BF9B51]/20 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-[#BF9B51]" />
                </div>
                <div>
                  <div className="text-sm text-[#5A5650] mb-1">{item.label}</div>
                  <div className="text-[#F5F0E8] font-medium">{item.value}</div>
                </div>
              </motion.a>
            ))}

            {/* Map Placeholder */}
            <div className="glass-card rounded-2xl overflow-hidden h-48 relative">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="Location map"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-card rounded-xl px-6 py-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#BF9B51]" />
                  <span className="text-sm font-medium text-[#F5F0E8]">רוטשילד 45, תל אביב</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: -40 }}
            animate={formInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl font-bold text-[#F5F0E8] mb-2">השאירו פרטים</h3>
              <p className="text-sm font-light text-[#8A8578] mb-8">מלאו את הטופס ונחזור אליכם בהקדם</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#BF9B51]/20 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-[#BF9B51]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#F5F0E8] mb-2">תודה רבה!</h4>
                  <p className="text-[#8A8578]">קיבלנו את הפרטים שלכם ונחזור אליכם בהקדם.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#8A8578] mb-2">שם מלא</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#F5F0E8] placeholder-[#5A5650] focus:outline-none focus:border-[#BF9B51]/50 focus:ring-1 focus:ring-[#BF9B51]/20 transition-all duration-300"
                        placeholder="הכניסו את שמכם"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8A8578] mb-2">טלפון</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#F5F0E8] placeholder-[#5A5650] focus:outline-none focus:border-[#BF9B51]/50 focus:ring-1 focus:ring-[#BF9B51]/20 transition-all duration-300"
                        placeholder="050-0000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#8A8578] mb-2">אימייל</label>
                    <input
                      type="email"
                      required
                      className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#F5F0E8] placeholder-[#5A5650] focus:outline-none focus:border-[#BF9B51]/50 focus:ring-1 focus:ring-[#BF9B51]/20 transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#8A8578] mb-2">סוג הפרויקט</label>
                    <select
                      className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#8A8578] focus:outline-none focus:border-[#BF9B51]/50 focus:ring-1 focus:ring-[#BF9B51]/20 transition-all duration-300 appearance-none"
                    >
                      <option value="">בחרו סוג פרויקט</option>
                      <option value="apartment">דירת יוקרה</option>
                      <option value="office">משרד</option>
                      <option value="villa">וילה / בית פרטי</option>
                      <option value="commercial">מסחרי</option>
                      <option value="other">אחר</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#8A8578] mb-2">ספרו לנו על הפרויקט</label>
                    <textarea
                      rows={4}
                      className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#F5F0E8] placeholder-[#5A5650] focus:outline-none focus:border-[#BF9B51]/50 focus:ring-1 focus:ring-[#BF9B51]/20 transition-all duration-300 resize-none"
                      placeholder="תארו בקצרה את הפרויקט שלכם..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl gold-shimmer text-[#0A0A0A] font-bold text-lg shadow-xl hover:shadow-[0_0_40px_rgba(191,155,81,0.3)] transition-shadow duration-300"
                  >
                    <Send className="w-5 h-5" />
                    <span>שלחו הודעה</span>
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