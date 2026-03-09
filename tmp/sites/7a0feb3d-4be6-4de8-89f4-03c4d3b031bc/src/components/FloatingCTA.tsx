import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, ChevronUp } from 'lucide-react';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-3"
          dir="rtl"
        >
          {/* Scroll to top */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={scrollTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl glass border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all duration-200 shadow-xl"
              >
                <ChevronUp className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Expanded options */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-2"
              >
                <motion.a
                  href="https://wa.me/972501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, x: -4 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-500 text-white font-heebo font-bold text-sm shadow-2xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>וואטסאפ</span>
                </motion.a>
                <motion.a
                  href="tel:+972501234567"
                  whileHover={{ scale: 1.05, x: -4 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-heebo font-bold text-sm shadow-glow"
                >
                  <Phone className="w-4 h-4" />
                  <span>050-123-4567</span>
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-glow-lg text-white transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: expanded ? 45 : 0 }}
              transition={{ duration: 0.25 }}
            >
              {expanded ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
            </motion.div>
            {/* Pulse ring */}
            {!expanded && (
              <span className="absolute inset-0 rounded-2xl bg-orange-500 animate-ping opacity-20" />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
