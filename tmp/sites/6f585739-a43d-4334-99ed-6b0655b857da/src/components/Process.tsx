import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, Compass, PencilRuler, Hammer, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'פגישת היכרות',
    description: 'נפגש להכיר את החזון שלכם, להבין את הצרכים ולהגדיר את הכיוון העיצובי.',
  },
  {
    icon: Compass,
    number: '02',
    title: 'תכנון קונספט',
    description: 'נפתח קונספט עיצובי מקיף הכולל לוחות השראה, פלטת צבעים ותכניות ראשוניות.',
  },
  {
    icon: PencilRuler,
    number: '03',
    title: 'עיצוב מפורט',
    description: 'נכין תכניות מפורטות, הדמיות תלת-ממד ומפרטים טכניים לכל חלל.',
  },
  {
    icon: Hammer,
    number: '04',
    title: 'ביצוע וליווי',
    description: 'נלווה את הביצוע מקרוב, נפקח על כל שלב ונוודא שהתוצאה מושלמת.',
  },
  {
    icon: CheckCircle2,
    number: '05',
    title: 'מסירה והנאה',
    description: 'נמסור לכם חלל מושלם שמוכן לאכלס — ונהיה כאן גם אחרי.',
  },
];

export default function Process() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section className="relative py-28 md:py-36 lg:py-44 section-mesh">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
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
              תהליך העבודה
            </span>
            <div className="h-px w-12 gold-shimmer" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#F5F0E8] mb-6">
            מהחזון
            <span className="gold-text"> למציאות</span>
          </h2>
          <p className="text-base md:text-lg font-light leading-relaxed text-[#8A8578] max-w-2xl mx-auto">
            תהליך עבודה מובנה ושקוף שמבטיח תוצאות מושלמות בכל פרויקט.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 right-0 left-0 h-px bg-gradient-to-l from-transparent via-[#BF9B51]/20 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="relative"
    >
      <motion.div
        whileHover={{ y: -6, borderColor: 'rgba(191,155,81,0.3)' }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-2xl p-8 text-center h-full group"
      >
        {/* Number */}
        <div className="text-4xl font-black text-[#BF9B51]/10 mb-4 group-hover:text-[#BF9B51]/20 transition-colors duration-300">
          {step.number}
        </div>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#BF9B51]/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#BF9B51]/20 group-hover:scale-110 transition-all duration-300">
          <step.icon className="w-7 h-7 text-[#BF9B51]" />
        </div>

        <h3 className="text-lg font-bold text-[#F5F0E8] mb-3">{step.title}</h3>
        <p className="text-sm font-light leading-relaxed text-[#8A8578]">{step.description}</p>
      </motion.div>
    </motion.div>
  );
}