import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Network, Fingerprint, ScanEye, Database, ShieldCheck } from 'lucide-react';

const techStack = [
  {
    icon: Cpu,
    title: 'מנוע AI מתקדם',
    description: 'רשתות נוירונים עמוקות שמנתחות מיליארדי אירועים בשנייה',
    color: 'cyan',
  },
  {
    icon: Network,
    title: 'ניתוח רשת בזמן אמת',
    description: 'מיפוי מלא של תעבורת הרשת עם זיהוי אנומליות מיידי',
    color: 'blue',
  },
  {
    icon: Fingerprint,
    title: 'אימות ביומטרי',
    description: 'שכבת אימות מתקדמת המשלבת זיהוי פנים, טביעת אצבע וקול',
    color: 'purple',
  },
  {
    icon: ScanEye,
    title: 'Threat Intelligence',
    description: 'מאגר מודיעין איומים גלובלי שמתעדכן בזמן אמת מ-200+ מקורות',
    color: 'emerald',
  },
  {
    icon: Database,
    title: 'SIEM מתקדם',
    description: 'מערכת ניהול אירועי אבטחה עם קורלציה אוטומטית ותגובה מיידית',
    color: 'amber',
  },
  {
    icon: ShieldCheck,
    title: 'Endpoint Protection',
    description: 'הגנה מלאה על נקודות קצה עם בידוד אוטומטי של איומים',
    color: 'rose',
  },
];

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  blue: { bg: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  purple: { bg: 'from-purple-500/20 to-purple-600/10', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  amber: { bg: 'from-amber-500/20 to-amber-600/10', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  rose: { bg: 'from-rose-500/20 to-rose-600/10', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
};

export default function Technology() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="technology" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">הטכנולוגיה שלנו</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="text-white">טכנולוגיה</span>{' '}
            <span className="text-gradient">שמובילה את התעשייה</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            הפלטפורמה שלנו בנויה על הטכנולוגיות המתקדמות ביותר בעולם
          </p>
        </motion.div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, i) => {
            const colors = colorMap[tech.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.7 }}
                whileHover={{ y: -6 }}
                className={`group glass rounded-3xl p-8 shadow-2xl hover:${colors.glow} transition-all duration-500 hover:border-white/20`}
              >
                <div className={`inline-flex bg-gradient-to-br ${colors.bg} p-4 rounded-2xl mb-6 shadow-xl`}>
                  <tech.icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {tech.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {tech.description}
                </p>
                {/* Decorative line */}
                <div className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-l ${colors.bg} group-hover:w-full transition-all duration-500`} />
              </motion.div>
            );
          })}
        </div>

        {/* Dashboard Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-cyan-500/5 via-purple-600/5 to-transparent rounded-3xl blur-2xl" />
          <div className="relative glass rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80"
              alt="Technology Platform"
              className="w-full h-[300px] md:h-[450px] object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}