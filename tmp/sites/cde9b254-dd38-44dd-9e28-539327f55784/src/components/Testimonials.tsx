import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronRight, ChevronLeft } from 'lucide-react';

const testimonials = [
  {
    name: 'דוד כהן',
    role: 'בעל עסק',
    location: 'תל אביב',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    text: 'הגעתי למוסך רונן אחרי שמוסך אחר ניסה לגבות ממני פי שלושה על אותה עבודה. רונן הסביר לי בדיוק מה צריך לתקן, הראה לי את החלקים הישנים, ועשה הכל ביום אחד. מחיר הוגן ועבודה מושלמת.',
    car: 'טויוטה קורולה 2019',
    highlight: 'חסכתי 40% לעומת הצעה אחרת',
  },
  {
    name: 'מיכל לוי',
    role: 'מורה',
    location: 'רמת גן',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    text: 'כאישה שלא מבינה הרבה ברכבים, תמיד פחדתי שינצלו אותי. במוסך רונן הרגשתי בטוחה לגמרי — הסבירו לי הכל בשפה פשוטה, שלחו לי תמונות של הבעיה, ולא עשו שום דבר בלי אישורי.',
    car: 'מאזדה 3 2021',
    highlight: 'שקיפות מלאה לאורך כל הדרך',
  },
  {
    name: 'יוסי אברהם',
    role: 'נהג מונית',
    location: 'פתח תקווה',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    text: 'הרכב שלי הוא פרנסתי. כשהמנוע התחיל לעשות רעשים, הגעתי לרונן בבוקר ועד הצהריים הרכב היה מוכן. עבודה מהירה, מקצועית ובמחיר שלא שבר לי את הכיס. אני שולח לכאן את כל החברים.',
    car: 'סקודה אוקטביה 2018',
    highlight: 'תיקון מלא תוך חצי יום',
  },
  {
    name: 'שרה גולדברג',
    role: 'רופאה',
    location: 'הרצליה',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    text: 'ניסיתי כמה מוסכים לפני שמצאתי את רונן. ההבדל הוא שמיים וארץ. כאן מקבלים דוח אבחון מפורט, הצעת מחיר כתובה, ואחריות על כל עבודה. זה המוסך שלי לכל החיים.',
    car: 'BMW סדרה 3 2020',
    highlight: 'שירות ברמה של דילר — במחיר הוגן',
  },
  {
    name: 'אמיר נחמני',
    role: 'מהנדס',
    location: 'ראשון לציון',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    text: 'כמהנדס, אני מעריך מקצועיות ודיוק. רונן ידע לאבחן בעיה שמוסכים אחרים לא הצליחו לזהות. השתמש בציוד אבחון מתקדם ופתר את הבעיה בפעם הראשונה. מרשים מאוד.',
    car: 'הונדה סיוויק 2022',
    highlight: 'אבחון מדויק שאחרים פספסו',
  },
  {
    name: 'רחל ברק',
    role: 'עצמאית',
    location: 'נתניה',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    text: 'הגעתי עם בעיה במיזוג בעיצומו של הקיץ. רונן קיבל אותי מיד, אבחן את הבעיה תוך 20 דקות, ותיקן הכל תוך שעתיים. יצאתי עם מיזוג קר ועם חיוך. ממליצה בחום!',
    car: 'ניסאן קשקאי 2020',
    highlight: 'תיקון מיידי ללא תור מוקדם',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800 via-dark-900 to-dark-800" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/8 blur-[150px] pointer-events-none" />

      <div className="relative section-container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-500/15 border border-yellow-500/30 rounded-full px-5 py-2 mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-300 font-medium text-sm">מה הלקוחות אומרים</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            8,000+ לקוחות
            <br />
            <span className="bg-gradient-to-l from-yellow-400 to-brand-500 bg-clip-text text-transparent">
              מרוצים מדברים
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            לא מאמינים לנו? תקראו מה הלקוחות שלנו אומרים — בלי פילטרים, בלי עריכה.
          </p>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <div className="relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md border border-white/15 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
            {/* Background quote */}
            <Quote className="absolute top-6 left-6 w-24 h-24 text-white/3" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-3 gap-8 items-center"
              >
                {/* Avatar & info */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img
                      src={testimonials[activeIndex].avatar}
                      alt={testimonials[activeIndex].name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-brand-500/40 shadow-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-2 border-dark-900 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-white text-white" />
                    </div>
                  </div>
                  <div className="font-bold text-white text-lg">{testimonials[activeIndex].name}</div>
                  <div className="text-white/50 text-sm">{testimonials[activeIndex].role}</div>
                  <div className="text-white/40 text-xs mb-3">{testimonials[activeIndex].location}</div>
                  <StarRating rating={testimonials[activeIndex].rating} />
                  <div className="mt-3 text-xs text-white/40 bg-white/5 rounded-full px-3 py-1">
                    {testimonials[activeIndex].car}
                  </div>
                </div>

                {/* Quote */}
                <div className="md:col-span-2">
                  <Quote className="w-8 h-8 text-brand-500/50 mb-4" />
                  <p className="text-white/80 text-lg leading-relaxed mb-6 font-light">
                    "{testimonials[activeIndex].text}"
                  </p>
                  <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 rounded-full px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-brand-400" />
                    <span className="text-brand-300 text-sm font-medium">
                      {testimonials[activeIndex].highlight}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'w-8 bg-brand-500' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={prev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={next}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid of mini testimonials */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveIndex(i)}
              className={`bg-white/5 backdrop-blur-md border rounded-2xl p-5 shadow-xl cursor-pointer transition-all duration-300 ${
                activeIndex === i ? 'border-brand-500/50 bg-brand-500/10' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <StarRating rating={t.rating} />
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed line-clamp-3">"{t.text}"</p>
            </motion.div>
          ))}
        </div>

        {/* Overall rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center">
            <div className="text-6xl font-black text-white mb-1">4.9</div>
            <StarRating rating={5} />
            <div className="text-white/40 text-sm mt-2">דירוג ממוצע</div>
          </div>
          <div className="w-px h-20 bg-white/10 hidden md:block" />
          <div className="grid grid-cols-2 gap-4 text-center">
            {[
              { label: 'Google Reviews', value: '4.9', count: '312 ביקורות' },
              { label: 'Facebook', value: '4.8', count: '187 ביקורות' },
              { label: 'Waze', value: '5.0', count: '94 ביקורות' },
              { label: 'iCar', value: '4.9', count: '156 ביקורות' },
            ].map((platform, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3">
                <div className="text-white font-bold text-lg">{platform.value}</div>
                <div className="text-white/60 text-xs font-medium">{platform.label}</div>
                <div className="text-white/30 text-xs">{platform.count}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
