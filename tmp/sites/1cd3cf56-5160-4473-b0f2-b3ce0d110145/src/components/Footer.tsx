import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-16 md:py-20 bg-[#050505] border-t border-[--glass-border]">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                <span className="text-[#0A0A0A] font-black text-lg">א</span>
              </div>
              <div>
                <span className="text-lg font-bold text-[--text-primary]">אטלס עיצובים</span>
              </div>
            </div>
            <p className="text-sm text-[--text-muted] leading-relaxed mb-6">
              סטודיו בוטיק לעיצוב פנים יוקרתי. מעצבים חללים שמספרים את הסיפור שלכם.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-[--text-primary] mb-5">ניווט מהיר</h4>
            <ul className="space-y-3">
              {['ראשי', 'שירותים', 'פרויקטים', 'אודות', 'המלצות', 'צור קשר'].map((link) => (
                <li key={link}>
                  <a href={`#${link === 'ראשי' ? 'hero' : link}`} className="text-sm text-[--text-muted] hover:text-[--accent-gold] transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-[--text-primary] mb-5">שירותים</h4>
            <ul className="space-y-3">
              {['עיצוב דירות יוקרה', 'משרדי הייטק', 'ייעוץ צבע וחומרים', 'תכנון תאורה', 'ריהוט מותאם אישית'].map((service) => (
                <li key={service}>
                  <a href="#services" className="text-sm text-[--text-muted] hover:text-[--accent-gold] transition-colors duration-300">
                    {service}
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
            <h4 className="font-semibold text-[--text-primary] mb-5">צרו קשר</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-[--text-muted]">
                <Phone className="w-4 h-4 text-[--accent-gold] flex-shrink-0" />
                <span>050-123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[--text-muted]">
                <Mail className="w-4 h-4 text-[--accent-gold] flex-shrink-0" />
                <span>info@atlas-design.co.il</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[--text-muted]">
                <MapPin className="w-4 h-4 text-[--accent-gold] flex-shrink-0" />
                <span>רוטשילד 45, תל אביב</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[--glass-border] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[--text-muted]">
            © {new Date().getFullYear()} אטלס עיצובים. כל הזכויות שמורות.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[--text-muted] hover:text-[--accent-gold] transition-colors">מדיניות פרטיות</a>
            <a href="#" className="text-sm text-[--text-muted] hover:text-[--accent-gold] transition-colors">תנאי שימוש</a>
            <a href="#" className="text-sm text-[--text-muted] hover:text-[--accent-gold] transition-colors">נגישות</a>
          </div>
        </div>
      </div>
    </footer>
  );
}