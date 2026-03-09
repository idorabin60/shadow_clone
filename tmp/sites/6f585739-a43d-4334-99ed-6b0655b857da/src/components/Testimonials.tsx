import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'רונית כהן',
    role: 'בעלת פנטהאוז, תל אביב',
    text: 'אטלס עיצובים הפכו את הדירה שלנו לחלום שהתגשם. כל פרט, כל חומר, כל צבע — הכל מושלם. הם הקשיבו לכל בקשה והפתיעו אותנו שוב ושוב.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'אלון ברק',
    role: 'מנכ"ל חברת הייטק',
    text: 'המשרדים החדשים שלנו הפכו למקום שהעובדים אוהבים לבוא אליו. העיצוב משלב בצורה מדהימה בין פונקציונליות ליופי. תודה על עבודה יוצאת דופן!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'מיכל לוי',
    role: 'בעלת וילה, הרצליה',
    text: 'מהרגע הראשון הרגשנו שאנחנו בידיים טובות. הצוות המקצועי של אטלס ליווה אותנו בכל שלב עם סבלנות, יצירתיות ומקצועיות ברמה הגבוהה ביותר.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
  },
];

export default function Testimonials() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" className="relative py-28 md:py-36 lg:py-44 bg-[#111111]">
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-white/[0.06] to-transparent" />

      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#BF9B51]/[0.015] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
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
              המלצות
            </span>
            <div className="h-px w-12 gold-shimmer" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#F5F0E8] mb-6">
            מה הלקוחות שלנו
            <span className="gold-text"> אומרים</span>
          </h2>
          <p className="text-base md:text-lg font-light leading-relaxed text-[#8A8578] max-w-2xl mx-auto">
            הלקוחות שלנו הם השגרירים הטובים ביותר שלנו. הנה מה שהם חושבים על העבודה שלנו.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
    >
      <motion.div
        whileHover={{ y: -6, borderColor: 'rgba(191,155,81,0.3)' }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-2xl p-8 md:p-10 h-full flex flex-col relative group"
      >
        {/* Quote Icon */}
        <div className="absolute top-6 left-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <Quote className="w-12 h-12 text-[#BF9B51]" />
        </div>

        {/* Stars */}
        <div className="flex gap-1 mb-6">
          {Array.from({ length: testimonial.rating }).map((_, j) => (
            <Star key={j} className="w-4 h-4 fill-[#BF9B51] text-[#BF9B51]" />
          ))}
        </div>

        {/* Text */}
        <p className="text-base font-light leading-relaxed text-[#8A8578] mb-8 flex-1">
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06]">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#BF9B51]/20"
          />
          <div>
            <div className="font-bold text-[#F5F0E8]">{testimonial.name}</div>
            <div className="text-sm text-[#5A5650]">{testimonial.role}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}