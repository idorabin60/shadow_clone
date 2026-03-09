import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, ArrowUpRight } from 'lucide-react';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=800&q=80',
    alt: 'עבודת מנוע מקצועית',
    label: 'תיקון מנוע',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    alt: 'אבחון ממוחשב',
    label: 'אבחון ממוחשב',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    alt: 'מערכת חשמל',
    label: 'מערכת חשמל',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da12?auto=format&fit=crop&w=600&q=80',
    alt: 'מכונאי מקצועי',
    label: 'הצוות שלנו',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=600&q=80',
    alt: 'מערכת בלמים',
    label: 'מערכת בלמים',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=800&q=80',
    alt: 'טיפול שוטף',
    label: 'טיפול שוטף',
    span: 'md:col-span-2',
  },
];

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-32 overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />

      <div className="relative section-container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 rounded-full px-5 py-2 mb-6">
            <Camera className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium text-sm">הגלריה שלנו</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            עבודה שמדברת
            <br />
            <span className="bg-gradient-to-l from-purple-400 to-brand-500 bg-clip-text text-transparent">
              בעד עצמה
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            הצצה לעבודה היומיומית שלנו — מאבחון ועד מסירה
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              className={`group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Label */}
              <div className="absolute bottom-0 right-0 left-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">{img.label}</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-brand-500/0 group-hover:border-brand-500/40 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
