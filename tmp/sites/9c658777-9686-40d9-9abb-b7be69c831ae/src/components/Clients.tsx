import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote, Building2 } from 'lucide-react';

const testimonials = [
  {
    name: 'דר. רונית כהן',
    role: 'CTO, פיננסטק בע"מ',
    content: 'ZeroTrust Dynamics שינתה לחלוטין את גישת האבטחה שלנו. מאז שהטמענו את הפלטפורמה, חווינו ירידה של 95% באירועי אבטחה.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'אלון ברגמן',
    role: 'CISO, מדיקל טק',
    content: 'הצוות המקצועי והטכנולוגיה המתקדמת הם ברמה אחרת לגמרי. התגובה לאירועים מהירה ומדויקת, וההגנה מקיפה.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'מיכל אברהם',
    role: 'VP Engineering, קלאוד סולושנס',
    content: 'אחרי שנים של עבודה עם ספקי אבטחה שונים, ZeroTrust Dynamics היא הראשונה שבאמת מספקת הגנה מלאה ושקט נפשי.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
];

const logos = [
  'פיננסטק', 'מדיקל טק', 'קלאוד סולושנס', 'דאטה פרו', 'סייבר גארד', 'טק וויז',
];

export default function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="clients" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/3 w-[600px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">הלקוחות שלנו</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="text-white">מה הלקוחות</span>{' '}
            <span className="text-gradient">אומרים עלינו</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            ארגונים מובילים סומכים על ZeroTrust Dynamics להגנה על הנכסים הדיגיטליים שלהם
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="group glass rounded-3xl p-8 shadow-2xl hover:border-cyan-500/20 transition-all duration-500"
            >
              {/* Quote icon */}
              <div className="mb-6">
                <Quote className="w-8 h-8 text-cyan-500/30" />
              </div>

              {/* Content */}
              <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                "{testimonial.content}"
              </p>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/20"
                />
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Client Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="glass rounded-3xl p-8"
        >
          <p className="text-center text-sm text-gray-500 font-medium mb-8">
            חברות מובילות שסומכות עלינו
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {logos.map((logo, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center py-4 px-2 rounded-xl hover:bg-white/5 transition-all"
              >
                <span className="text-lg font-bold text-gray-500 hover:text-gray-300 transition-colors">
                  {logo}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}