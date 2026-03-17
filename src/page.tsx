'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import ServicesSection from '@/sections/ServicesSection';
import NLPSection from '@/sections/NLPSection';
import VisionSection from '@/sections/VisionSection';
import AISolutionsSection from '@/sections/AISolutionsSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import StatsSection from '@/sections/StatsSection';
import JourneySection from '@/sections/JourneySection';
import ContactSection from '@/sections/ContactSection';

// Loading screen component
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#070A12] flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3BF0FF] to-[#4B92FF] flex items-center justify-center"
            animate={{ 
              boxShadow: [
                '0 0 30px rgba(59,240,255,0.3)',
                '0 0 60px rgba(59,240,255,0.5)',
                '0 0 30px rgba(59,240,255,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="font-['Orbitron',sans-serif] text-2xl font-bold text-white">G</span>
          </motion.div>
          <div>
            <span className="font-['Orbitron',sans-serif] text-3xl font-bold tracking-wider text-white block">
              GSPEC
            </span>
            <span className="text-xs tracking-[0.4em] text-[rgba(255,255,255,0.5)] uppercase">
              Technologies
            </span>
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#3BF0FF] to-[#4B92FF]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Loading text */}
      <motion.p
        className="mt-4 font-['Rajdhani',sans-serif] text-sm text-[rgba(255,255,255,0.5)] tracking-wider uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading Experience
      </motion.p>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#3BF0FF] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Scroll progress indicator
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // While journey locks the body (position:fixed), window.scrollY is 0.
      // Read the true scroll position from the body's top offset instead.
      const bodyTop = document.body.style.position === 'fixed'
        ? Math.abs(parseInt(document.body.style.top || '0', 10))
        : window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((bodyTop / docHeight) * 100);
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
      const scrollY = document.body.style.position === 'fixed'
        ? Math.abs(parseInt(document.body.style.top || '0', 10))
        : window.scrollY;
      setIsVisible(scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    // Release journey scroll-lock before navigating away.
    const release = (window as unknown as Record<string, unknown>).__journeyRelease;
    if (typeof release === 'function') release();
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
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
          <AboutSection />
          <ServicesSection />
          <NLPSection />
          <VisionSection />
          <AISolutionsSection />
          <TestimonialsSection />
          <StatsSection />
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
