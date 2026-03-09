import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'פנטהאוז תל אביב',
    category: 'דירות יוקרה',
    description: 'עיצוב פנטהאוז מפואר בן 300 מ"ר עם נוף לים.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    size: 'large',
  },
  {
    title: 'משרדי הייטק הרצליה',
    category: 'משרדים',
    description: 'חלל עבודה מודרני לחברת סטארטאפ מובילה.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    size: 'small',
  },
  {
    title: 'וילה קיסריה',
    category: 'בתים פרטיים',
    description: 'וילה מפוארת עם עיצוב ים-תיכוני עכשווי.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    size: 'small',
  },
  {
    title: 'לובי מלון ירושלים',
    category: 'מסחרי',
    description: 'עיצוב לובי מרשים למלון בוטיק בלב ירושלים.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d955e4c47?auto=format&fit=crop&w=800&q=80',
    size: 'large',
  },
];

const categories = ['הכל', 'דירות יוקרה', 'משרדים', 'בתים פרטיים', 'מסחרי'];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('הכל');
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });

  const filteredProjects = activeCategory === 'הכל'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-28 md:py-36 lg:py-44 section-mesh">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 gold-shimmer" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#BF9B51]">
              הפרויקטים שלנו
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#F5F0E8] mb-4">
                פרויקטים
                <span className="gold-text"> נבחרים</span>
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed text-[#8A8578] max-w-xl">
                הצצה לפרויקטים האחרונים שלנו — כל אחד מהם מספר סיפור ייחודי.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-[#BF9B51] font-medium hover:gap-4 transition-all duration-300 group shrink-0"
            >
              <span>צפו בכל הפרויקטים</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'gold-shimmer text-[#0A0A0A] shadow-lg'
                  : 'glass-card text-[#8A8578] hover:text-[#F5F0E8] hover:border-[#BF9B51]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {filteredProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className={project.size === 'large' ? 'md:row-span-1' : ''}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4 }}
        className="glass-card glass-card-hover rounded-2xl overflow-hidden group cursor-pointer h-full"
      >
        <div className="relative h-72 md:h-80 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />

          {/* Overlay Content */}
          <div className="absolute bottom-0 right-0 left-0 p-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-[#BF9B51] bg-[#BF9B51]/10 border border-[#BF9B51]/20 mb-3">
              {project.category}
            </span>
            <h3 className="text-2xl font-bold text-[#F5F0E8] mb-2 group-hover:text-[#BF9B51] transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-sm font-light text-[#8A8578]">{project.description}</p>
          </div>

          {/* Hover Icon */}
          <div className="absolute top-4 left-4 w-10 h-10 rounded-full glass-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ExternalLink className="w-4 h-4 text-[#BF9B51]" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}