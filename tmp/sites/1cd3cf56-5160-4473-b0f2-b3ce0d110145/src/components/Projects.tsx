import { motion } from 'framer-motion';
import { ArrowUpLeft, MapPin } from 'lucide-react';

const projects = [
  {
    title: 'פנטהאוז תל אביב',
    category: 'דירת יוקרה',
    location: 'תל אביב',
    area: '320 מ״ר',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    large: true,
  },
  {
    title: 'משרדי סטארטאפ',
    category: 'משרד הייטק',
    location: 'הרצליה פיתוח',
    area: '450 מ״ר',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    large: false,
  },
  {
    title: 'וילה בקיסריה',
    category: 'בית פרטי',
    location: 'קיסריה',
    area: '550 מ״ר',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    large: false,
  },
  {
    title: 'לובי מלון בוטיק',
    category: 'מסחרי',
    location: 'ירושלים',
    area: '200 מ״ר',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    large: false,
  },
  {
    title: 'דופלקס מודרני',
    category: 'דירת יוקרה',
    location: 'רמת גן',
    area: '280 מ״ר',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    large: true,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 md:py-40 section-gradient-1 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[--accent-gold] opacity-[0.03] blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-sm font-medium tracking-widest uppercase text-[--accent-gold] mb-4 block">הפרויקטים שלנו</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            עבודות <span className="gold-text">נבחרות</span>
          </h2>
          <p className="text-lg md:text-xl font-light text-[--text-secondary] max-w-2xl mx-auto leading-relaxed">
            הצצה לפרויקטים האחרונים שלנו — כל אחד מהם מספר סיפור ייחודי של עיצוב ויצירתיות
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                project.large ? 'lg:col-span-2 h-[400px] md:h-[500px]' : 'h-[350px] md:h-[400px]'
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[--accent-gold]/20 text-[--accent-gold] border border-[--accent-gold]/30 mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{project.title}</h3>
                  <div className="flex items-center gap-4 text-[--text-secondary] text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.location}
                    </span>
                    <span>{project.area}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full glass-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-100 scale-75">
                  <ArrowUpLeft className="w-5 h-5 text-[--accent-gold]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}