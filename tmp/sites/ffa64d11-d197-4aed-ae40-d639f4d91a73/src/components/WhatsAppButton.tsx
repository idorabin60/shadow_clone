import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    return (
        <motion.a
            href="https://wa.me/972501234567"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 transition-colors duration-300"
            aria-label="שלח הודעת וואטסאפ"
        >
            <MessageCircle className="w-6 h-6 text-white" />
            {/* Pulse Ring */}
            <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
        </motion.a>
    );
}