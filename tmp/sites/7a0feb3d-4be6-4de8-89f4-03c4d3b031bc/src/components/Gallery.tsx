import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=800&q=80',
    alt: 'עבודת מנוע מקצועית',
    label: 'תיקון מנוע',
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    alt: 'אבחון ממוחשב',
    label: 'אבחון ממוחשב',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    alt: 'ציוד מקצועי',
    label: 'ציוד מתקדם',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    alt: 'עבודת בלמים',
    label: 'מערכת בלמים',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=600&q=80',
    alt: 'טיפול שוטף',
    label: 'טיפול שוטף',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
    alt: 'מוסך מקצועי',
    label: 'המוסך שלנו',
    span: 'col-span-2',
  },
];

export default function Gallery() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' });
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="gallery" dir="rtl" className="relative py-28 bg-dark-900 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-right mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-orange border border-orange-500/20 text-orange-300 text-sm font-assistant font-semibold mb-6"
          >
            <ZoomIn className="w-4 h-4" />
            <span>הגלריה שלנו</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-heebo font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-5"
          >
            עבודה שמדברת{' '}
            <span className="text-gradient">בעד עצמה</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-assistant text-lg text-white/55 max-w-xl"
          >
            הצצה לעולם של מוסך רונן — ציוד, עבודה ותוצאות שמדברות בעד עצמן.
          </motion.p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {images.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              onClick={() => setLightbox(img.src)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-2xl ring-1 ring-white/8 hover:ring-orange-500/40 transition-all duration-300 ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Label */}
              <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="font-heebo font-bold text-sm text-white">{img.label}</span>
              </div>

              {/* Zoom icon */}
              <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox}
              alt="תמונה מוגדלת"
              className="w-full rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-glow hover:bg-orange-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
