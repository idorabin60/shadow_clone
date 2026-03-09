import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Facebook, ArrowUp } from 'lucide-react';

const footerLinks = [
  {
    title: 'ניווט מהיר',
    links: [
      { label: 'ראשי', href: '#hero' },
      { label: 'אודות', href: '#about' },
      { label: 'שירותים', href: '#services' },
      { label: 'פרויקטים', href: '#projects' },
      { label: 'המלצות', href: '#testimonials' },
    ],
  },
  {
    title: 'שירותים',
    links: [
      { label: 'עיצוב דירות יוקרה', href: '#services' },
      { label: 'עיצוב משרדים', href: '#services' },
      { label: 'ייעוץ צבע וחומרים', href: '#services' },
      { label: 'תכנון תאורה', href: '#services' },
      { label: 'ריהוט בהתאמה אישית', href: '#services' },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-white/[0.06]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg gold-shimmer flex items-center justify-center shadow-lg">
                <span className="text-[#0A0A0A] font-black text-lg">א</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#F5F0E8] tracking-tight">אטלס עיצובים</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#BF9B51]">Interior Design Studio</span>
              </div>
            </div>
            <p className="text-sm font-light leading-relaxed text-[#8A8578] mb-6 max-w-xs">
              סטודיו לעיצוב פנים יוקרתי המתמחה ביצירת חללים מעוררי השראה. למעלה מ-15 שנות ניסיון בעיצוב דירות יוקרה, משרדים ומרחבים מסחריים.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[Instagram, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:bg-[#BF9B51]/10 hover:border-[#BF9B51]/30 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 text-[#8A8578] group-hover:text-[#BF9B51] transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerLinks.map((column, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
            >
              <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-[#F5F0E8] mb-6">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-sm font-light text-[#8A8578] hover:text-[#BF9B51] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-[#F5F0E8] mb-6">צרו קשר</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#BF9B51] shrink-0" />
                <a href="tel:031234567" className="text-sm font-light text-[#8A8578] hover:text-[#BF9B51] transition-colors">
                  03-1234567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#BF9B51] shrink-0" />
                <a href="mailto:info@atlas-design.co.il" className="text-sm font-light text-[#8A8578] hover:text-[#BF9B51] transition-colors">
                  info@atlas-design.co.il
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#BF9B51] shrink-0 mt-0.5" />
                <span className="text-sm font-light text-[#8A8578]">
                  רוטשילד 45, תל אביב
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#5A5650]">
            © 2024 אטלס עיצובים. כל הזכויות שמורות.
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-[#BF9B51]/10 hover:border-[#BF9B51]/30 transition-all duration-300 group"
          >
            <ArrowUp className="w-4 h-4 text-[#8A8578] group-hover:text-[#BF9B51] transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
}