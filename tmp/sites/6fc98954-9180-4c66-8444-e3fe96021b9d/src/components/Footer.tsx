import { motion } from 'framer-motion'
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = [
    {
      title: 'שירותים',
      links: ['תיקון כללי', 'מערכות חשמל', 'בדיקה טכנית', 'בטיחות וגלגלים'],
    },
    {
      title: 'חברה',
      links: ['אודות', 'בלוג', 'קריירה', 'צור קשר'],
    },
    {
      title: 'משפטי',
      links: ['תנאי שימוש', 'מדיניות פרטיות', 'מדיניות עוגיות'],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="relative bg-slate-950 border-t border-white/10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-extrabold text-lg">ר</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">מוסך רוזן פרו</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                שירות תיקון רכב מקצועי עם שקיפות מלאה ומחירים הוגנים.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -3 }}
                      className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-white/20 transition-all"
                    >
                      <Icon size={20} />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            {/* Links Columns */}
            {footerLinks.map((column, columnIndex) => (
              <motion.div
                key={columnIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: columnIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-white font-bold mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a
                        href="#"
                        whileHover={{ x: -4, color: '#06b6d4' }}
                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-bold mb-4">צור קשר</h4>
              <div className="space-y-4">
                <a href="tel:0312345678" className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors">
                  <Phone size={18} />
                  <span className="text-sm">03-123-4567</span>
                </a>
                <a href="mailto:info@rozenpro.co.il" className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors">
                  <Mail size={18} />
                  <span className="text-sm">info@rozenpro.co.il</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin size={18} />
                  <span className="text-sm">רחוב הרכב 123, תל אביב</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm"
            >
              © 2024 מוסך רוזן פרו. כל הזכויות שמורות.
            </motion.p>

            {/* Scroll to Top Button */}
            <motion.button
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-cyan-400 hover:bg-white/20 transition-all"
            >
              <ArrowUp size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
