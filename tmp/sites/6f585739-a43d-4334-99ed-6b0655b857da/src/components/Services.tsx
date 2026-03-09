import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Home, Building2, Palette, Lightbulb, Sofa, PenTool } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'עיצוב דירות יוקרה',
    description: 'עיצוב מקיף לדירות פנטהאוז ודירות יוקרה — מהתכנון הראשוני ועד הריהוט האחרון.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Building2,
    title: 'עיצוב משרדים',
    description: 'חללי עבודה מעוררי השראה שמשלבים פונקציונליות עם אסתטיקה מרשימה.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Palette,
    title: 'ייעוץ צבע וחומרים',
    description: 'בחירת פלטת צבעים וחומרי גמר מושלמים שמשקפים את האישיות שלכם.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Lightbulb,
    title: 'תכנון תאורה',
    description: 'עיצוב תאורה מקצועי שיוצר אווירה מושלמת בכל חלל ובכל שעה ביום.',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: Sofa,
    title: 'ריהוט בהתאמה אישית',
    description: 'עיצוב וייצור רהיטים ייחודיים שנבנים במיוחד עבור החלל שלכם.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    icon: PenTool,
    title: 'שיפוץ ושדרוג',
    description: 'הפיכת חללים קיימים לסביבה חדשה ומרעננת עם שיפוץ מקצועי ומדויק.',
    image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80',
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4 }}
        className="glass-card glass-card-hover rounded-2xl overflow-hidden group cursor-default h-full"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl glass-card flex items-center justify-center">
            <service.icon className="w-6 h-6 text-[#BF9B51]" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-[#F5F0E8] mb-3 group-hover:text-[#BF9B51] transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-sm font-light leading-relaxed text-[#8A8578]">
            {service.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="services" className="relative py-28 md:py-36 lg:py-44 bg-[#111111]">
      {/* Top Border */}
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-white/[0.06] to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#BF9B51]/[0.02] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 gold-shimmer" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#BF9B51]">
              השירותים שלנו
            </span>
            <div className="h-px w-12 gold-shimmer" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#F5F0E8] mb-6">
            פתרונות עיצוב
            <span className="gold-text"> מקיפים</span>
          </h2>
          <p className="text-base md:text-lg font-light leading-relaxed text-[#8A8578] max-w-2xl mx-auto">
            מגוון שירותי עיצוב פנים מקצועיים שמותאמים בדיוק לצרכים ולחלומות שלכם.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}