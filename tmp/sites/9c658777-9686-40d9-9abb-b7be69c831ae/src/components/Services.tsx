import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Brain, Eye, Lock, Server, Wifi, ArrowLeft } from 'lucide-react';

const services = [
  {
    icon: Shield,
    title: 'הגנת Zero Trust',
    description: 'ארכיטקטורת אבטחה שלא סומכת על אף ישות — פנימית או חיצונית — ומאמתת כל בקשת גישה.',
    gradient: 'from-cyan-500 to-blue-600',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Brain,
    title: 'AI לזיהוי איומים',
    description: 'מנוע בינה מלאכותית שלומד את דפוסי הרשת שלך ומזהה חריגות בזמן אמת עם דיוק של 99.9%.',
    gradient: 'from-purple-500 to-pink-600',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Eye,
    title: 'ניטור 24/7',
    description: 'מרכז פעולות אבטחה (SOC) שפועל מסביב לשעון עם צוות מומחים שמגיב לכל אירוע.',
    gradient: 'from-emerald-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Lock,
    title: 'הצפנה מקצה לקצה',
    description: 'הצפנת נתונים ברמה צבאית בכל שלב — במנוחה, בתנועה ובעיבוד.',
    gradient: 'from-amber-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Server,
    title: 'אבטחת ענן',
    description: 'הגנה מלאה על תשתיות ענן — AWS, Azure, GCP — עם ניהול תצורה אוטומטי.',
    gradient: 'from-blue-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Wifi,
    title: 'אבטחת IoT',
    description: 'הגנה על מכשירים מחוברים ורשתות IoT עם פרוטוקולים ייעודיים וסגמנטציה חכמה.',
    gradient: 'from-rose-500 to-red-600',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">השירותים שלנו</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="text-white">פתרונות אבטחה</span>{' '}
            <span className="text-gradient">מקיפים</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            מגוון שירותי אבטחת סייבר מתקדמים שמותאמים לצרכים הייחודיים של הארגון שלך
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.7 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative glass rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
                <div className={`absolute top-4 right-4 bg-gradient-to-br ${service.gradient} p-3 rounded-xl shadow-xl`}>
                  <service.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
                  <span>למד עוד</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}