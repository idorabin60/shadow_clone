import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';

const contactInfo = [
  { icon: Phone, label: 'טלפון', value: '050-123-4567', href: 'tel:+972501234567' },
  { icon: Mail, label: 'אימייל', value: 'info@atlas-design.co.il', href: 'mailto:info@atlas-design.co.il' },
  { icon: MapPin, label: 'כתובת', value: 'רוטשילד 45, תל אביב', href: '#' },
  { icon: Clock, label: 'שעות פעילות', value: 'א׳-ה׳ 09:00-18:00', href: '#' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic
  };

  return (
    <section id="contact" className="relative py-24 md:py-40 section-gradient-2 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[--accent-gold] opacity-[0.04] blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[--accent-gold] opacity-[0.02] blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-sm font-medium tracking-widest uppercase text-[--accent-gold] mb-4 block">צור קשר</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            בואו <span className="gold-text">נדבר</span>
          </h2>
          <p className="text-lg md:text-xl font-light text-[--text-secondary] max-w-2xl mx-auto leading-relaxed">
            מוזמנים ליצור קשר לפגישת ייעוץ ראשונית ללא עלות. נשמח לשמוע על הפרויקט שלכם
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-xl p-6 flex items-center gap-5 hover:border-[--accent-gold]/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[--accent-gold]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[--accent-gold]/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[--accent-gold]" />
                  </div>
                  <div>
                    <div className="text-sm text-[--text-muted] mb-0.5">{item.label}</div>
                    <div className="font-medium text-[--text-primary]">{item.value}</div>
                  </div>
                </motion.a>
              );
            })}

            {/* Map placeholder */}
            <div className="relative rounded-2xl overflow-hidden h-48 mt-2 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                alt="Location map"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-[--text-secondary]">
                <MapPin className="w-4 h-4 text-[--accent-gold]" />
                <span>רוטשילד 45, תל אביב</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 md:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[--text-secondary] mb-2">שם מלא</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="הכניסו את שמכם"
                    className="w-full px-5 py-3.5 rounded-xl bg-[--bg-tertiary] border border-[--glass-border] text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none focus:border-[--accent-gold]/40 focus:ring-1 focus:ring-[--accent-gold]/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[--text-secondary] mb-2">טלפון</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="050-000-0000"
                    className="w-full px-5 py-3.5 rounded-xl bg-[--bg-tertiary] border border-[--glass-border] text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none focus:border-[--accent-gold]/40 focus:ring-1 focus:ring-[--accent-gold]/20 transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[--text-secondary] mb-2">אימייל</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-5 py-3.5 rounded-xl bg-[--bg-tertiary] border border-[--glass-border] text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none focus:border-[--accent-gold]/40 focus:ring-1 focus:ring-[--accent-gold]/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[--text-secondary] mb-2">ספרו לנו על הפרויקט</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="תארו את הפרויקט שלכם, גודל, סגנון מועדף..."
                  className="w-full px-5 py-3.5 rounded-xl bg-[--bg-tertiary] border border-[--glass-border] text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none focus:border-[--accent-gold]/40 focus:ring-1 focus:ring-[--accent-gold]/20 transition-all duration-300 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl gold-gradient text-[#0A0A0A] font-medium tracking-wide flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-[--accent-gold]/25 transition-all duration-300 hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                <span>שלחו הודעה</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}