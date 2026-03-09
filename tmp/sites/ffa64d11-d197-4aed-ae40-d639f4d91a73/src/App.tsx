import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
    return (
        <div dir="rtl" className="min-h-screen bg-[#0A0A0F] text-right">
            <Navbar />
            <Hero />
            <Services />
            <About />
            <Testimonials />
            <Contact />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}

export default App;