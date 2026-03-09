import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import About from './components/About';
import Solutions from './components/Solutions';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
    return (
        <div dir="rtl" className="min-h-screen bg-[#0a0a0f] text-white text-right" style={{ fontFamily: "'Heebo', sans-serif" }}>
            <Navbar />
            <Hero />
            <Features />
            <Stats />
            <About />
            <Solutions />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
}

export default App;