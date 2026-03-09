import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0A0A0A] text-right font-heebo">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;