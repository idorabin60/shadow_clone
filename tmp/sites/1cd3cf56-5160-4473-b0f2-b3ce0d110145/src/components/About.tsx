import { motion } from 'framer-motion';
import { Award, Users, Clock, Target } from 'lucide-react';

const values = [
  {
    icon: Award,
    title: 'מצוינות',
    description: 'שואפים לשלמות בכל פרט ופרט. לא מתפשרים על איכות.',
  },
  {
    icon: Users,
    title: 'שיתוף פעולה',
    description: 'עובדים בשקיפות מלאה עם הלקוחות שלנו לאורך כל הדרך.',
  },
  {
    icon: Clock,
    title: 'עמידה בזמנים',
    description: 'מחויבים ללוחות זמנים ומספקים תוצאות בזמן שנקבע.',
  },
  {
    icon: Target,
    title: 'חדשנות',
    description: 'מביאים רעיונות חדשניים ופתרונות יצירתיים לכל פרויקט.',
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-40 section-gradient-2 overflow-hidden">
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-[--accent-gold] opacity-[0.03] blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[--accent-gold] opacity-[0.02] blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80"
                alt="Interior design studio"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
            </div>
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 md:left-auto md:-left-8 glass-card rounded-2xl p-6 shadow-2xl"
            >
              <div className="text-4xl font-black gold-text">15+</div>
              <div className="text-sm text-[--text-secondary] mt-1">שנות ניסיון<br />בעיצוב יוקרה</div>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-medium tracking-widest uppercase text-[--accent-gold] mb-4 block">אודותינו</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              סטודיו עיצוב <span className="gold-text">בוטיק</span> עם חזון
            </h2>
            <p className="text-lg font-light text-[--text-secondary] leading-relaxed mb-6">
              אטלס עיצובים הוקם מתוך אהבה עמוקה לעיצוב ואדריכלות. אנחנו מאמינים שכל חלל מספר סיפור, ותפקידנו הוא להפוך את הסיפור שלכם למציאות מעוצבת ומרהיבה.
            </p>
            <p className="text-lg font-light text-[--text-secondary] leading-relaxed mb-10">
              הצוות שלנו מורכב ממעצבים, אדריכלים ואנשי מקצוע מנוסים שעובדים יחד כדי ליצור חללים ייחודיים שמשלבים יופי, נוחות ופונקציונליות.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-6">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="glass-card rounded-xl p-5 hover:border-[--accent-gold]/20 transition-all duration-300"
                  >
                    <Icon className="w-6 h-6 text-[--accent-gold] mb-3" />
                    <h4 className="font-semibold mb-1">{value.title}</h4>
                    <p className="text-sm text-[--text-muted] leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}