import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Star, Quote, ChevronRight, ChevronLeft } from 'lucide-react';

const testimonials = [
  {
    name: 'דוד אברהם',
    role: 'לקוח קבוע מ-2018',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'רונן הוא הטכנאי הכי ישר שפגשתי. תמיד מסביר בדיוק מה צריך לתקן ולמה, לא מנסה למכור שירותים מיותרים. הרכב שלי בידיים הכי טובות.',
    car: 'טויוטה קורולה 2019',
  },
  {
    name: 'מיכל שפירא',
    role: 'לקוחה מ-2020',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'הגעתי עם בעיה בחשמל שאף מוסך לא הצליח לאתר. תוך שעה אמיר מצא את הבעיה ותיקן אותה. מחיר הוגן, שירות מדהים. ממליצה בחום!',
    car: 'מאזדה 3 2021',
  },
  {
    name: 'יעקב לוינשטיין',
    role: 'לקוח מ-2015',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'שלחתי את הרכב לטסט אחרי שמוסך אחר אמר שצריך להחליף חלקים ב-3,000 ש"ח. רונן בדק, תיקן רק מה שצריך ב-800 ש"ח. עבר טסט בלי בעיה.',
    car: 'הונדה סיוויק 2017',
  },
  {
    name: 'נועה כץ',
    role: 'לקוחה מ-2022',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'קניתי רכב יד שנייה ורציתי לבדוק אותו לפני הקנייה. הבדיקה הייתה מקיפה ומפורטת. בזכות הבדיקה חסכתי הרבה כסף על רכב עם בעיות נסתרות.',
    car: 'קיה ספורטאז׳ 2020',
  },
  {
    name: 'אלי ברקוביץ',
    role: 'לקוח מ-2019',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'הרכב שלי התחמם פתאום בדרך. התקשרתי לרונן, הוא הדריך אותי בטלפון מה לעשות ותוך שעה הייתי במוסך. תיקנו את הבעיה ביום אחד. שירות יוצא מן הכלל.',
    car: 'פולקסווגן גולף 2018',
  },
  {
    name: 'שרה מנחם',
    role: 'לקוחה מ-2021',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'אחרי שנים של חיפוש אחרי מוסך אמין, מצאתי את מוסך רונן. הצוות מקצועי, המקום נקי ומסודר, והמחירים הוגנים. לא אלך לשום מקום אחר.',
    car: 'סקודה אוקטביה 2022',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="relative group rounded-2xl p-6 border border-white/8 hover:border-orange-500/25 transition-all duration-300 overflow-hidden flex flex-col"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.12), transparent 70%)' }}
      />

      {/* Quote icon */}
      <div className="absolute top-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Quote className="w-12 h-12 text-orange-400" />
      </div>

      <div className="relative z-10 flex flex-col h-full text-right">
        {/* Stars */}
        <div className="flex justify-end mb-4">
          <StarRating rating={t.rating} />
        </div>

        {/* Text */}
        <p className="font-assistant text-sm text-white/70 leading-relaxed mb-6 flex-1">
          "{t.text}"
        </p>

        {/* Car tag */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-assistant">
            {t.car}
          </span>
        </div>

        {/* Author */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/8">
          <div className="text-right">
            <div className="font-heebo font-bold text-sm text-white">{t.name}</div>
            <div className="font-assistant text-xs text-white/40">{t.role}</div>
          </div>
          <img
            src={t.avatar}
            alt={t.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/30"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' });
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="testimonials" dir="rtl" className="relative py-28 bg-dark-800 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Decorative */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-right mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange border border-orange-500/20 text-orange-300 text-sm font-assistant font-semibold mb-6"
          >
            <Star className="w-4 h-4 fill-orange-400" />
            <span>מה אומרים עלינו</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-heebo font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-5"
          >
            לקוחות{' '}
            <span className="text-gradient">מרוצים</span>
            <br />
            מדברים
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="font-heebo font-bold text-2xl text-white">4.9</span>
            <span className="font-assistant text-white/50 text-sm">מתוך 5 — 312 ביקורות</span>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {visible.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page ? 'w-8 bg-orange-500' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
