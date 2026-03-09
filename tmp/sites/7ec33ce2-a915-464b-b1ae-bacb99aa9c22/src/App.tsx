import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const App = () => {
  return (
    <div dir="rtl" className="text-right bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen">
      <header className="backdrop-blur-md bg-white/10 shadow-2xl p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">מוסך רוזן פרו</h1>
        <nav className="flex gap-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Services</a>
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Contact</a>
        </nav>
        <div className="text-lg">📞 123-456-7890</div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="py-32 text-center"
      >
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
          מוסך מקצועי לתיקון ותחזוקת רכבים
        </h2>
        <p className="mt-4 text-xl text-white">
          שקיפות מלאה לפני כל תיקון, מחירים הוגנים בלי הפתעות
        </p>
        <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700">
          צור קשר עכשיו
        </button>
      </motion.div>

      <section className="py-24">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {['טיפולים תקופתיים', 'בדיקות לפני טסט', 'אבחון תקלות ממוחשב', 'תיקוני בלמים', 'תיקוני חשמל רכב', 'תיקון מיזוג אוויר', 'החלפת מצבר', 'כיוון פרונט', 'החלפת שמנים ופילטרים'].map((service, index) => (
            <motion.div 
              key={index} 
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <CheckCircle className="text-blue-500 w-8 h-8 mb-4" />
              <h3 className="text-2xl font-bold text-white">{service}</h3>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="py-12 bg-black/10 backdrop-blur-md text-white text-center">
        <div className="mb-4">📞 123-456-7890</div>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:underline">Facebook</a>
          <a href="#" className="hover:underline">Twitter</a>
          <a href="#" className="hover:underline">Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
