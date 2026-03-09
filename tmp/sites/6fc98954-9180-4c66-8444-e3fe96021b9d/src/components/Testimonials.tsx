import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronRight, ChevronLeft } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'דוד כהן',
      role: 'בעל עסק',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      text: 'שירות מעולה! הטכנאים מקצועיים מאוד והם הסבירו לי בדיוק מה צריך לעשות. מחירים הוגנים וזמן שירות מהיר.',
      rating: 5,
    },
    {
      name: 'שרה לוי',
      role: 'מורה',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      text: 'אני מאוד מרוצה מהשירות. הם עשו עבודה מעולה בתיקון הרכב שלי וגם הם היו מאוד אדיבים.',
      rating: 5,
    },
    {
      name: 'יוסי ברק',
      role: 'מהנדס',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      text: 'מוסך מקצועי עם ציוד מודרני. הם עשו בדיקה טכנית מלאה וגם תיקונים נוספים שהיו צריכים.',
      rating: 5,
    },
    {
      name: 'מיכל גרין',
      role: 'עורכת דין',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
      text: 'שקיפות מלאה בכל התהליך. הם שלחו לי תמונות של כל שלב של העבודה. מומלץ בחום!',
      rating: 5,
    },
    {
      name: 'אברהם סלע',
      role: 'נהג משאית',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      text: 'שירות חירום מהיר ויעיל. הם תיקנו לי את הרכב ביום אחד. מחירים הוגנים מאוד.',
      rating: 5,
    },
    {
      name: 'רונית כספי',
      role: 'עסקנית',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      text: 'אני חוזרת אליהם כל פעם שצריכה תיקון. הם מכירים את הרכב שלי וזה מאוד נוח.',
      rating: 5,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const getVisibleTestimonials = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length])
    }
    return visible
  }

  return (
    <section id="testimonials" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              מה אומרים הלקוחות שלנו
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            ביקורות אמיתיות מלקוחות מרוצים שבחרו בנו
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={`${currentIndex}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star size={18} className="fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-300 text-base leading-relaxed mb-6 italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/50"
                    />
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prev}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all text-white"
            >
              <ChevronRight size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all text-white"
            >
              <ChevronLeft size={24} />
            </motion.button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                animate={{
                  scale: index === currentIndex ? 1.2 : 1,
                  backgroundColor: index === currentIndex ? '#06b6d4' : 'rgba(255, 255, 255, 0.2)',
                }}
                className="w-2 h-2 rounded-full transition-all"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
