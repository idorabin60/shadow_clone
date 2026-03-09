import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const footerLinks = [
  {
    title: 'שירותים',
    links: ['הגנת Zero Trust', 'AI לזיהוי איומים', 'ניטור 24/7', 'הצפנה מקצה לקצה', 'אבטחת ענן'],
  },
  {
    title: 'חברה',
    links: ['אודותינו', 'הצוות שלנו', 'קריירה', 'בלוג', 'חדשות'],
  },
  {
    title: 'משאבים',
    links: ['מרכז ידע', 'תיעוד API', 'מדריכים', 'וובינרים', 'דוחות'],
  },
];

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-8 overflow-hidden">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-cyan-500/30 to-transparent" />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a
              href="#"
              className="flex items-center gap-3 mb-6 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-xl group-hover:bg-cyan-500/30 transition-all" />
                <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white">ZeroTrust</span>
                <span className="text-[10px] font-medium text-cyan-400/80 -mt-1 tracking-widest uppercase">Dynamics</span>
              </div>
            </motion.a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              ZeroTrust Dynamics מספקת פתרונות אבטחת סייבר מתקדמים לארגונים מובילים.
              אנחנו מגנים על העתיד הדיגיטלי שלך.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-cyan-500/60" />
                <span>info@zerotrust.co.il</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-cyan-500/60" />
                <span>03-555-0199</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-cyan-500/60" />
                <span>מגדל אלון, תל אביב</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h4 className="text-white font-bold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 ZeroTrust Dynamics. כל הזכויות שמורות.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/20 p-2.5 rounded-xl transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}