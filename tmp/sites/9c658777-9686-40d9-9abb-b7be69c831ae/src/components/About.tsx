import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Users, Award, TrendingUp, CheckCircle } from 'lucide-react';

const milestones = [
  { icon: Target, value: '2019', label: 'שנת הקמה' },
  { icon: Users, value: '120+', label: 'מומחי סייבר' },
  { icon: Award, value: '15+', label: 'פרסים בינלאומיים' },
  { icon: TrendingUp, value: '300%', label: 'צמיחה שנתית' },
];

const values = [
  'חדשנות טכנולוגית ללא פשרות',
  'שקיפות מלאה מול הלקוח',
  'תגובה מהירה לכל אירוע',
  'מחקר מתמיד של איומים חדשים',
  'שיתוף פעולה עם קהילת הסייבר',
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl glow-blue">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
                alt="ZeroTrust Dynamics Team"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
              
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute bottom-6 right-6 left-6 glass rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-extrabold text-gradient">500+</div>
                    <div className="text-sm text-gray-400">ארגונים סומכים עלינו</div>
                  </div>
                  <div className="flex -space-x-2 space-x-reverse">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-[#0a0a0f] flex items-center justify-center text-[10px] font-bold">
                        {n}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0a0a0f] flex items-center justify-center text-[10px] font-bold text-gray-400">
                      +496
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">אודותינו</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              <span className="text-white">אנחנו מגדירים מחדש</span>
              <br />
              <span className="text-gradient">את אבטחת הסייבר</span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              ZeroTrust Dynamics נוסדה מתוך חזון ברור: ליצור עולם דיגיטלי בטוח יותר.
              הצוות שלנו מורכב ממומחי סייבר, חוקרי AI ומהנדסי תוכנה מהשורה הראשונה,
              שעובדים יחד כדי לפתח את הדור הבא של פתרונות אבטחה.
            </p>

            {/* Values */}
            <div className="space-y-3 mb-10">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-300 font-medium">{value}</span>
                </motion.div>
              ))}
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-2 gap-4">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="glass rounded-2xl p-4 text-center hover:border-cyan-500/20 transition-all"
                >
                  <milestone.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-extrabold text-white">{milestone.value}</div>
                  <div className="text-xs text-gray-400 font-medium">{milestone.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}