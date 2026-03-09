import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Heart } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'תיקון מנוע', href: '#services' },
    { label: 'מערכת חשמל', href: '#services' },
    { label: 'מערכת קירור', href: '#services' },
    { label: 'מיזוג אוויר', href: '#services' },
    { label: 'בלמים ובטיחות', href: '#services' },
    { label: 'טיפול שוטף', href: '#services' },
  ],
  company: [
    { label: 'אודות', href: '#why-us' },
    { label: 'התהליך שלנו', href: '#process' },
    { label: 'המלצות', href: '#testimonials' },
    { label: 'גלריה', href: '#gallery' },
    { label: 'צור קשר', href: '#contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-black" />
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />

      <div className="relative section-container py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-orange">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-black text-2xl text-white leading-none">מוסך רונן</div>
                  <div className="text-brand-400 text-xs font-medium">שירות מקצועי</div>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                מוסך מוביל עם 15+ שנות ניסיון. שקיפות מלאה, מחירים הוגנים ושירות ביום אחד.
              </p>

              {/* Social links */}
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#', label: 'פייסבוק' },
                  { icon: Instagram, href: '#', label: 'אינסטגרם' },
                  { icon: Youtube, href: '#', label: 'יוטיוב' },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all duration-200"
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-white font-bold text-lg mb-5">שירותים</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200 hover:text-brand-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-white font-bold text-lg mb-5">החברה</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/40 hover:text-brand-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-white font-bold text-lg mb-5">יצירת קשר</h4>
            <div className="space-y-4">
              <a href="tel:+972501234567" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/30 transition-colors">
                  <Phone className="w-4 h-4 text-brand-400" />
                </div>
                <span className="text-sm">050-123-4567</span>
              </a>
              <div className="flex items-start gap-3 text-white/40">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm">רחוב הנחושת 12, תל אביב</span>
              </div>
              <div className="flex items-start gap-3 text-white/40">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-sm">
                  <div>א׳–ה׳: 08:00–19:00</div>
                  <div>שישי: 08:00–14:00</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <motion.a
              href="tel:+972501234567"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-l from-brand-500 to-brand-600 text-white font-bold px-6 py-3 rounded-xl shadow-glow-orange text-sm"
            >
              <Phone className="w-4 h-4" />
              התקשר עכשיו
            </motion.a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-l from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} מוסך רונן. כל הזכויות שמורות.
          </p>
          <p className="text-white/25 text-sm flex items-center gap-1">
            עוצב עם
            <Heart className="w-3 h-3 text-brand-500 fill-brand-500 mx-1" />
            לשירות מקצועי
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/25 hover:text-white/50 text-xs transition-colors">מדיניות פרטיות</a>
            <a href="#" className="text-white/25 hover:text-white/50 text-xs transition-colors">תנאי שימוש</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
