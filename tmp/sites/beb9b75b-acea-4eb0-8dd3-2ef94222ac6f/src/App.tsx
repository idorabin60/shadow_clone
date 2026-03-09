import './index.css';

function App() {
  return (
    <div dir="rtl" className="font-sans">
      <Hero />
      <About />
      <Services />
      <CTA />
      <Footer />
    </div>
  );
}

const Hero = () => (
  <section className="bg-blue-800 text-white text-right p-8">
    <h1 className="text-4xl font-bold">ברוכים הבאים למוסך רונן</h1>
    <p className="text-xl mt-4">המוסך הכי טוב במדינה מספק שירות 24/7 לכל בעיה</p>
    <p className="mt-2">100 מוסכניקים מומחים וצוות שזמין תמיד</p>
    <button className="bg-yellow-500 text-white py-2 px-4 rounded mt-4">צור קשר עכשיו</button>
  </section>
);

const About = () => (
  <section className="bg-gray-100 text-gray-900 text-right p-8">
    <h2 className="text-3xl font-bold">עלינו</h2>
    <p className="mt-4">מוסך רונן הוא המוסך הכי טוב במדינה, עם צוות של 100 מוסכניקים מומחים הזמינים 24/7 לכל בעיה.</p>
  </section>
);

const Services = () => (
  <section className="bg-white text-gray-900 text-right p-8">
    <h2 className="text-3xl font-bold">השירותים שלנו</h2>
    <p className="mt-4">מתנקים כל דבר אפשרי ברכב</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <ServiceCard title="שירות 1" />
      <ServiceCard title="שירות 2" />
      <ServiceCard title="שירות 3" />
    </div>
  </section>
);

const ServiceCard = ({ title }: { title: string }) => (
  <div className="bg-gray-100 text-gray-900 p-4 rounded shadow">
    <h3 className="text-xl font-bold">{title}</h3>
  </div>
);

const CTA = () => (
  <section className="bg-blue-800 text-white text-right p-8">
    <h2 className="text-3xl font-bold">מוכנים לשדרג את הרכב שלכם?</h2>
    <p className="mt-4">צור קשר עם המומחים שלנו עכשיו!</p>
    <button className="bg-yellow-500 text-white py-2 px-4 rounded mt-4">צור קשר</button>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white text-right p-8">
    <p className="text-lg font-bold">מוסך רונן</p>
    <p className="mt-2">טלפון: [הכנס מספר טלפון כאן]</p>
    <div className="mt-4">
      <a href="#" className="text-gray-400">קישור נוסף</a>
    </div>
  </footer>
);

export default App;
