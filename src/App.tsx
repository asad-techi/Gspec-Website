import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import AboutSection from './sections/AboutSection';
import MissionSection from './sections/MissionSection';
import JourneySection from './sections/JourneySection';
import ContactSection from './sections/ContactSection';
import NeuralLoader from './components/NeuralLoader';

// Scroll progress indicator
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollTop / docHeight) * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3BF0FF] to-[#4B92FF] z-[60] origin-left"
      style={{ scaleX: progress / 100 }}
    />
  );
}

// Back to top button
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(59,240,255,0.2)] to-[rgba(75,146,255,0.1)] border border-[rgba(59,240,255,0.3)] flex items-center justify-center text-white hover:border-[rgba(59,240,255,0.5)] transition-all"
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path d="M18 15l-6-6-6 6" />
          </motion.svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <NeuralLoader key="loader" onComplete={() => setIsLoading(false)} minDuration={2400} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative min-h-screen bg-sci scanlines noise"
        >
          {/* Grid background */}
          <div className="grid-bg" />
          
          {/* Scroll progress */}
          <ScrollProgress />
          
          {/* Header */}
          <Header />
          
          {/* Sections */}
          <HeroSection />
          <ServicesSection />
          <TestimonialsSection />
          <AboutSection />
          <MissionSection />
          <JourneySection />
          <ContactSection />
          
          {/* Footer */}
          <Footer />
          
          {/* Back to top */}
          <BackToTop />
        </motion.main>
      )}
    </>
  );
}

export default App;
