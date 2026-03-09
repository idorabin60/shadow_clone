import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const App = () => {
  return (
    <div dir="rtl" className="text-right bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen">
      <header className="backdrop-blur-md bg-white/10 shadow-2xl p-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          מוסך רוזן פרו
        </h1>
        <p className="mt-4 text-lg">
          שקיפות מלאה לפני כל תיקון, מחירים הוגנים בלי הפתעות, שירות מהיר מהיום להיום, אחריות על עבודה וחלקים
        </p>
      </header>

      <main className="py-24 px-8">
        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-white/10 shadow-2xl rounded-2xl p-8">
            <h2 className="text-4xl font-bold mb-4">השירותים שלנו</h2>
            <ul className="space-y-4">
              {['טיפולים תקופתיים', 'בדיקות לפני טסט', 'אבחון תקלות ממוחשב', 'תיקוני בלמים', 'תיקוני חשמל רכב', 'תיקון מיזוג אוויר', 'החלפת מצבר', 'כיוון פרונט', 'החלפת שמנים ופילטרים'].map((service, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4">
                  <CheckCircle className="text-green-500" />
                  <span>{service}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-white/10 shadow-2xl rounded-2xl p-8">
            <h2 className="text-4xl font-bold mb-4">למה לבחור בנו?</h2>
            <p className="text-lg">
              אנו מציעים שקיפות מלאה, מחירים הוגנים, שירות מהיר ואחריות על עבודה וחלקים.
            </p>
          </motion.div>
        </section>

        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-white/10 shadow-2xl rounded-2xl p-8">
            <h2 className="text-4xl font-bold mb-4">קהל היעד שלנו</h2>
            <p className="text-lg">
              אנו פונים לנהגים פרטיים, בעלי רכבים משפחתיים, סטודנטים, עסקים עם רכבי חברה ונהגים המתכוננים למבחני רכב.
            </p>
          </motion.div>
        </section>
      </main>

      <footer className="backdrop-blur-md bg-white/10 shadow-2xl p-8">
        <p className="text-lg">טלפון: [Insert Phone Number Here]</p>
      </footer>
    </div>
  );
};

export default App;
