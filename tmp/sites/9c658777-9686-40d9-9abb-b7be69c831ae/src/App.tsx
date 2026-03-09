import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Technology from './components/Technology';
import Clients from './components/Clients';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div dir="rtl" className="text-right min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Technology />
      <Clients />
      <Contact />
      <Footer />
    </div>
  );
}