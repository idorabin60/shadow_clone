import { motion } from 'framer-motion';
import { Home, Building2, Palette, Lightbulb, Ruler, Armchair } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'עיצוב דירות יוקרה',
    description: 'עיצוב פנים מקיף לדירות פרימיום — מתכנון ראשוני ועד לפריט האחרון. יוצרים חללי מגורים שמשלבים אסתטיקה עם פונקציונליות.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Building2,
    title: 'משרדי הייטק',
    description: 'עיצוב סביבות עבודה חדשניות שמעודדות יצירתיות ופרודוקטיביות. מותאם לתרבות הארגונית שלכם.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Palette,
    title: 'ייעוץ צבע וחומרים',
    description: 'בחירת פלטת צבעים, חומרי גמר וטקסטורות שיוצרים אווירה ייחודית ומותאמת אישית לכל פרויקט.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Lightbulb,
    title: 'תכנון תאורה',
    description: 'עיצוב תאורה מקצועי שמדגיש את האדריכלות ויוצר אווירה מושלמת לכל שעה ביום.',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Ruler,
    title: 'תכנון אדריכלי',
    description: 'תכנון מרחבי חכם שממקסם כל סנטימטר. שילוב מושלם בין צורה לתפקוד.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Armchair,
    title: 'ריהוט מותאם אישית',
    description: 'עיצוב וייצור רהיטים ייחודיים בהתאמה אישית מלאה — חומרים, מידות וסגנון לפי בחירתכם.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-40 section-gradient-2 overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[--accent-gold] opacity-[0.03] blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[--accent-gold] opacity-[0.02] blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-sm font-medium tracking-widest uppercase text-[--accent-gold] mb-4 block">השירותים שלנו</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            פתרונות עיצוב <span className="gold-text">מקיפים</span>
          </h2>
          <p className="text-lg md:text-xl font-light text-[--text-secondary] max-w-2xl mx-auto leading-relaxed">
            מציעים מגוון שירותי עיצוב פנים ברמה הגבוהה ביותר, מותאמים אישית לכל לקוח ופרויקט
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="group glass-card rounded-2xl overflow-hidden hover:border-[--accent-gold]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[--accent-gold]/5"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-[#0A0A0A]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-base font-light text-[--text-secondary] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}