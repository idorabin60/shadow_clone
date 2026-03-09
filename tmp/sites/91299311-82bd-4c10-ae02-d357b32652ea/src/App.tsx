import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

const App = () => {
  return (
    <div dir="rtl" className="text-right bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen py-24">
      <header className="backdrop-blur-md bg-white/10 shadow-2xl rounded-2xl p-8 mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
          ברוכים הבאים לסטארטאפ שלנו
        </h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-12 px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4">תכונה מדהימה</h2>
          <p className="text-white mb-4">
            תיאור קצר של התכונה המדהימה הזו שמציעה ערך רב למשתמשים שלנו.
          </p>
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" 
            alt="Feature Image" 
            className="rounded-2xl shadow-2xl mb-4"
          />
          <Star className="text-white" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4">תכונה נוספת</h2>
          <p className="text-white mb-4">
            תיאור קצר של תכונה נוספת שמציעה ערך רב למשתמשים שלנו.
          </p>
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" 
            alt="Another Feature Image" 
            className="rounded-2xl shadow-2xl mb-4"
          />
          <CheckCircle className="text-white" />
        </motion.div>
      </main>
    </div>
  );
};

export default App;
