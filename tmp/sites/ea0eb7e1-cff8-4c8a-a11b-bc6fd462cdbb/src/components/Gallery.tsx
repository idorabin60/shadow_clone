import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=800&q=80',
    alt: 'מוסך רוזן פרו - אזור עבודה',
    span: 'md:col-span-2 md:row-span-2',
    height: 'h-64 md:h-full',
  },
  {
    src: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=600&q=80',
    alt: 'ציוד מתקדם',
    span: '',
    height: 'h-64',
  },
  {
    src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
    alt: 'רכב מטופל',
    span: '',
    height: 'h-64',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80',
    alt: 'עבודת מנוע',
    span: '',
    height: 'h-64',
  },
  {
    src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    alt: 'רכב יוקרה',
    span: '',
    height: 'h-64',
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Gallery() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 bg-[#111827] overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Camera className="w-4 h-4" />
            הצצה למוסך
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            המוסך שלנו{' '}
            <span className="text-gradient-blue">מבפנים</span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto">
            סביבת עבודה מקצועית, נקייה ומאובזרת בציוד המתקדם ביותר
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-4 gap-4 md:gap-6"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`relative group overflow-hidden rounded-2xl ${image.span}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full ${image.height} object-cover transition-transform duration-700 group-hover:scale-110`}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <p className="text-white font-medium text-sm">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
