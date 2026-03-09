import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, Users, ShieldCheck, Clock } from 'lucide-react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [isInView, target]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}

const stats = [
    {
        icon: Users,
        value: 500,
        suffix: '+',
        label: 'לקוחות מוגנים',
        description: 'ארגונים סומכים עלינו',
    },
    {
        icon: ShieldCheck,
        value: 99,
        suffix: '.9%',
        label: 'שיעור הצלחה',
        description: 'בזיהוי ומניעת איומים',
    },
    {
        icon: Clock,
        value: 15,
        suffix: ' שנ׳',
        label: 'זמן תגובה ממוצע',
        description: 'לאירועי אבטחה קריטיים',
    },
    {
        icon: TrendingUp,
        value: 10,
        suffix: 'M+',
        label: 'איומים שנחסמו',
        description: 'בשנה האחרונה בלבד',
    },
];

export default function Stats() {
    return (
        <section className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[#0a0a0f]" />
            {/* Neon line accent */}
            <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-[#00f0ff]/30 to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-[#8b5cf6]/30 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="text-center group"
                        >
                            <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 group-hover:border-[#00f0ff]/30 group-hover:bg-[#00f0ff]/5 transition-all duration-500">
                                <stat.icon className="w-6 h-6 text-[#00f0ff]" />
                            </div>
                            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-sm font-semibold text-gray-300 mb-1">{stat.label}</div>
                            <div className="text-xs text-gray-500">{stat.description}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}