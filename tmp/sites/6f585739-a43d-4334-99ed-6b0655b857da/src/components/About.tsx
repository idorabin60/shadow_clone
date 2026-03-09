import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Eye, Gem, Ruler, Heart } from 'lucide-react';

const values = [
  {
    icon: Eye,
    title: 'חזון ייחודי',
    description: 'כל פרויקט מתחיל בהקשבה עמוקה לחזון שלכם ולאורח החיים שלכם.',
  },
  {
    icon: Gem,
    title: 'חומרים מובחרים',
    description: 'אנו עובדים רק עם החומרים האיכותיים ביותר מהספקים המובילים בעולם.',
  },
  {
    icon: Ruler,
    title: 'דיוק מושלם',
    description: 'תשומת לב קפדנית לכל פרט — מהתכנון ועד הביצוע הסופי.',
  },
  {
    icon: Heart,
    title: 'תשוקה לעיצוב',
    description: 'העיצוב הוא לא רק מקצוע עבורנו — זו תשוקה שמניעה אותנו כל יום.',
  },
];

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-28 md:py-36 lg:py-44 section-mesh">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <AnimatedSection className="mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 gold-shimmer" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#BF9B51]">
              אודותינו
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#F5F0E8] mb-6">
            יוצרים חללים שמעוררים
            <br />
            <span className="gold-text">השראה ורגש</span>
          </h2>
          <p className="text-base md:text-lg font-light leading-relaxed text-[#8A8578] max-w-2xl">
            כבר למעלה מ-15 שנה, אטלס עיצובים מוביל את תחום עיצוב הפנים בישראל. אנו מאמינים שכל חלל מספר סיפור — והתפקיד שלנו הוא להפוך את הסיפור שלכם ליצירת מופת.
          </p>
        </AnimatedSection>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image */}
          <AnimatedSection>
            <div className="relative group">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#BF9B51]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                alt="Luxury interior design studio"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover ring-1 ring-white/[0.06]"
              />
              {/* Floating Badge */}
              <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 md:left-auto md:-left-6 glass-card rounded-2xl p-6 shadow-2xl"
              >
                <div className="text-3xl font-black text-[#BF9B51]">15+</div>
                <div className="text-sm text-[#8A8578]">שנות מצוינות</div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Values Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <AnimatedSection key={i}>
                <motion.div
                  whileHover={{ y: -4, borderColor: 'rgba(191,155,81,0.3)' }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-2xl p-8 h-full group cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#BF9B51]/10 flex items-center justify-center mb-5 group-hover:bg-[#BF9B51]/20 transition-colors duration-300">
                    <value.icon className="w-6 h-6 text-[#BF9B51]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F0E8] mb-3">{value.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-[#8A8578]">{value.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}