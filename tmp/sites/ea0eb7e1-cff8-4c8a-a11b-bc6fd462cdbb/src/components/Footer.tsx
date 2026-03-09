import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Phone, Mail, MapPin, Facebook, Instagram, ArrowUp } from 'lucide-react';

const footerLinks = [
  {
    title: 'שירותים',
    links: ['טיפולים שוטפים', 'אבחון ממוחשב', 'בלמים ומתלים', 'חשמל רכב', 'מיזוג אוויר', 'טסט שנתי'],
  },
  {
    title: 'מידע',
    links: ['אודותינו', 'למה אנחנו', 'המלצות', 'שאלות נפוצות', 'תנאי שימוש', 'מדיניות פרטיות'],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0A0F1C] border-t border-white/5 overflow-hidden">
      {/* Background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-6 group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/25">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                מוסך רוזן <span className="text-gradient-blue">פרו</span>
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              מוסך מקצועי ואמין עם 15+ שנות ניסיון. שירות שקוף, מחירים הוגנים ואחריות מלאה על כל טיפול.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 border border-white/10 p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <Facebook className="w-4 h-4 text-gray-400" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 border border-white/10 p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <Instagram className="w-4 h-4 text-gray-400" />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">צור קשר</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">03-1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@rozen-pro.co.il</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">רחוב התעשייה 15, תל אביב</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} מוסך רוזן פרו. כל הזכויות שמורות.
          </p>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/5 border border-white/10 p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            <ArrowUp className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
