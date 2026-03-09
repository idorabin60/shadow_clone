import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2, Users, MapPin, Clock } from 'lucide-react';

const highlights = [
  'מוסמך ע"י יצרני רכב מובילים',
  'ציוד אבחון ממוחשב מהדור החדש',
  'שקיפות מלאה — הצעת מחיר לפני כל עבודה',
  'אחריות 12 חודש על כל תיקון',
  'חלקי חילוף מקוריים בלבד',
  'שירות לקוחות זמין 7 ימים בשבוע',
];

const teamMembers = [
  {
    name: 'רונן לוי',
    role: 'מייסד ומנהל טכני',
    exp: '15+ שנות ניסיון',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'אמיר כהן',
    role: 'טכנאי בכיר — מנועים',
    exp: '10 שנות ניסיון',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'יוסי מזרחי',
    role: 'מומחה חשמל ואלקטרוניקה',
    exp: '8 שנות ניסיון',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" dir="rtl" className="relative py-28 bg-dark-800 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-orange-500/6 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-amber-500/6 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left: Image collage */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
              >
                <img
                  src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80"
                  alt="מוסך רונן — עבודה מקצועית"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />
              </motion.div>

              {/* Floating card 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 border border-white/15 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-heebo font-black text-2xl text-white">4,800+</div>
                    <div className="font-assistant text-xs text-white/50">לקוחות מרוצים</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="absolute -top-6 -right-6 glass rounded-2xl p-4 border border-white/15 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-heebo font-black text-2xl text-white">98%</div>
                    <div className="font-assistant text-xs text-white/50">שביעות רצון</div>
                  </div>
                </div>
              </motion.div>

              {/* Small secondary image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute top-8 -left-8 w-32 h-32 rounded-2xl overflow-hidden shadow-xl ring-2 ring-orange-500/30 hidden lg:block"
              >
                <img
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=200&q=80"
                  alt="ציוד מקצועי"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange border border-orange-500/20 text-orange-300 text-sm font-assistant font-semibold mb-6">
              <span>הסיפור שלנו</span>
            </div>

            <h2 className="font-heebo font-black text-4xl sm:text-5xl text-white tracking-tight mb-6 leading-tight">
              מוסך שמכיר{' '}
              <span className="text-gradient">את הרכב שלך</span>
              <br />
              כמו את עצמו
            </h2>

            <p className="font-assistant text-base text-white/60 leading-relaxed mb-6">
              מוסך רונן נוסד ב-2009 מתוך אמונה פשוטה: כל לקוח מגיע לשירות ישיר, מקצועי ושקוף.
              לא עוד הפתעות בחשבון, לא עוד המתנות ארוכות — רק עבודה טובה, בזמן, במחיר הוגן.
            </p>

            <p className="font-assistant text-base text-white/60 leading-relaxed mb-8">
              היום אנחנו צוות של 8 טכנאים מוסמכים, עם ציוד אבחון מהדור החדש ויכולת לטפל
              בכל סוגי הרכבים — מרכבים פרטיים ועד רכבים מסחריים.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3 text-right"
                >
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="font-assistant text-sm text-white/70">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Location & Hours */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-white/50 text-sm font-assistant">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>רחוב הרצל 42, ירושלים</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm font-assistant">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>א׳–ה׳ 08:00–19:00 | ו׳ 08:00–14:00</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team section */}
        <div className="text-right mb-12">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heebo font-black text-3xl text-white mb-3"
          >
            הצוות שלנו
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-assistant text-white/50"
          >
            אנשי מקצוע עם ניסיון, תשוקה ומחויבות לאיכות
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl overflow-hidden border border-white/8 hover:border-orange-500/20 transition-all duration-300 group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
              </div>
              <div className="p-5 text-right">
                <h4 className="font-heebo font-bold text-lg text-white mb-1">{member.name}</h4>
                <p className="font-assistant text-sm text-orange-400 mb-1">{member.role}</p>
                <p className="font-assistant text-xs text-white/40">{member.exp}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
