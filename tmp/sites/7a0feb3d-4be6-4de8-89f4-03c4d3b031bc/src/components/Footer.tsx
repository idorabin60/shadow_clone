import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Wrench, Facebook, Instagram, MessageCircle } from 'lucide-react';

const footerLinks = [
  {
    title: 'שירותים',
    links: [
      'טיפול שוטף', 'מערכת חשמל', 'בלמים וגלגלים',
      'מיזוג אוויר', 'אבחון ממוחשב', 'טסט ורישוי',
    ],
  },
  {
    title: 'מידע',
    links: ['אודות', 'הצוות שלנו', 'המלצות', 'גלריה', 'מדיניות פרטיות'],
  },
];

export default function Footer() {
  return (
    <footer dir="rtl" className="relative bg-dark-900 border-t border-white/8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-orange-500/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-glow">
                    <Wrench className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 blur-md opacity-30" />
                </div>
                <div>
                  <span className="block font-heebo font-black text-xl text-white leading-none">מוסך רונן</span>
                  <span className="block text-xs text-orange-400 font-assistant">שירות רכב מקצועי</span>
                </div>
              </div>
              <p className="font-assistant text-sm text-white/50 leading-relaxed">
                מעל 15 שנות ניסיון בתיקון ותחזוקת רכבים. שירות מקצועי, מחירים הוגנים, ואחריות מלאה.
              </p>
            </motion.div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#', label: 'פייסבוק' },
                { icon: Instagram, href: '#', label: 'אינסטגרם' },
                { icon: MessageCircle, href: 'https://wa.me/972501234567', label: 'וואטסאפ' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {footerLinks.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1 }}
            >
              <h4 className="font-heebo font-bold text-white mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-assistant text-sm text-white/45 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 justify-end group"
                    >
                      <span>{link}</span>
                      <span className="w-1 h-1 rounded-full bg-orange-500/0 group-hover:bg-orange-500 transition-colors duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-heebo font-bold text-white mb-5">צור קשר</h4>
            <ul className="space-y-4">
              {[
                { icon: Phone, text: '050-123-4567', href: 'tel:+972501234567' },
                { icon: Mail, text: 'ronen@garage.co.il', href: 'mailto:ronen@garage.co.il' },
                { icon: MapPin, text: 'רחוב הרצל 42, ירושלים', href: '#' },
                { icon: Clock, text: 'א׳–ה׳ 08:00–19:00', href: '#' },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="flex items-center gap-3 justify-end group"
                  >
                    <span className="font-assistant text-sm text-white/45 group-hover:text-white/70 transition-colors duration-200">
                      {text}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors duration-200">
                      <Icon className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-assistant text-xs text-white/30">
            © {new Date().getFullYear()} מוסך רונן. כל הזכויות שמורות.
          </p>
          <div className="flex items-center gap-1">
            <span className="font-assistant text-xs text-white/20">עוצב ופותח בישראל</span>
            <span className="text-orange-500">🇮🇱</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
