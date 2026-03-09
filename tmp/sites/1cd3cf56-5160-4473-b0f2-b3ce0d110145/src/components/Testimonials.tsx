import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'מיכל לוי',
    role: 'בעלת פנטהאוז, תל אביב',
    text: 'אטלס עיצובים הפכו את הדירה שלנו לחלום שהתגשם. כל פרט, כל חומר, כל צבע — הכל מושלם. הם הקשיבו לכל בקשה והפתיעו אותנו שוב ושוב.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    name: 'דניאל כהן',
    role: 'מנכ״ל חברת הייטק',
    text: 'המשרדים החדשים שלנו קיבלו מחמאות מכל מי שנכנס. הצוות של אטלס הבין בדיוק את התרבות הארגונית שלנו ותרגם אותה לעיצוב מדהים.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    name: 'שרה אברהם',
    role: 'בעלת וילה, קיסריה',
    text: 'מקצועיות ברמה הגבוהה ביותר. הם ליוו אותנו מהרגע הראשון ועד למסירה, עם תשומת לב לכל פרט קטן. ממליצה בחום!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 md:py-40 section-gradient-1 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[--accent-gold] opacity-[0.03] blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-sm font-medium tracking-widest uppercase text-[--accent-gold] mb-4 block">המלצות</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            מה הלקוחות <span className="gold-text">אומרים</span>
          </h2>
          <p className="text-lg md:text-xl font-light text-[--text-secondary] max-w-2xl mx-auto leading-relaxed">
            הלקוחות שלנו הם השגרירים הטובים ביותר שלנו
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card rounded-2xl p-8 md:p-10 hover:border-[--accent-gold]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[--accent-gold]/5 relative"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-[--accent-gold] opacity-20 mb-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[--accent-gold] text-[--accent-gold]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-base font-light text-[--text-secondary] leading-relaxed mb-8">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-[--glass-border]">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[--accent-gold]/30"
                />
                <div>
                  <div className="font-semibold text-[--text-primary]">{testimonial.name}</div>
                  <div className="text-sm text-[--text-muted]">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}