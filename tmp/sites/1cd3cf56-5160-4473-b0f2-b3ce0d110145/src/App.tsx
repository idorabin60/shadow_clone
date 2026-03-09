import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div dir="rtl" lang="he" className="text-right">
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}