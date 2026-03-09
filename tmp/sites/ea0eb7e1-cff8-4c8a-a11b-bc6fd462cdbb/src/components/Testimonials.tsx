import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'דוד כהן',
    role: 'בעל BMW X5',
    text: 'מוסך רוזן פרו הוא המוסך הכי מקצועי שנתקלתי בו. שקיפות מלאה, מחירים הוגנים ושירות ברמה אחרת לגמרי. ממליץ בחום!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'שרה לוי',
    role: 'בעלת Toyota Corolla',
    text: 'סוף סוף מצאתי מוסך שאני סומכת עליו. הם הסבירו לי בדיוק מה צריך לתקן ולמה, בלי לנסות למכור דברים מיותרים.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'יוסי אברהם',
    role: 'בעל Mercedes C-Class',
    text: 'הרכב שלי חזר כמו חדש! הצוות מקצועי, אדיב ועומד בזמנים. המחיר היה בדיוק כמו שסוכם מראש. תודה רבה!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'מיכל רוזנברג',
    role: 'בעלת Hyundai Tucson',
    text: 'שירות מעולה מהרגע הראשון. קיבלתי עדכונים שוטפים על מצב הרכב והכל היה שקוף ומקצועי. בהחלט אחזור!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'אלון גולדשטיין',
    role: 'בעל Mazda CX-5',
    text: 'אחרי שנים של חוויות גרועות במוסכים, מוסך רוזן פרו שינה לי את הגישה. מקצועיות, יושרה ושירות אישי. פשוט מושלם.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'רונית שמעון',
    role: 'בעלת Kia Sportage',
    text: 'המוסך הכי אמין שאני מכירה. תמיד מסבירים מה עושים ולמה, ואף פעם לא מנסים לדחוף שירותים מיותרים. ממליצה!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 md:py-32 lg:py-40 bg-[#0A0F1C] overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star className="w-4 h-4 fill-amber-400" />
            המלצות לקוחות
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            מה הלקוחות שלנו{' '}
            <span className="text-gradient-amber">אומרים עלינו</span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto">
            אלפי לקוחות מרוצים שסומכים עלינו עם הרכב שלהם
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group"
            >
              <div className="glass-card glass-card-hover p-8 h-full relative overflow-hidden">
                {/* Quote icon */}
                <Quote className="absolute top-4 left-4 w-10 h-10 text-white/5 group-hover:text-blue-500/10 transition-colors duration-500" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <p className="text-white font-bold text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
