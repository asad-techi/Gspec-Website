'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Robot from '@/components/Robot';
import { ChevronDown, Sparkles, Zap, Shield } from 'lucide-react';

const features = [
  { icon: Sparkles, text: 'AI-Powered' },
  { icon: Zap, text: 'Enterprise-Grade' },
  { icon: Shield, text: 'End-to-End' },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToNext = () => {
    const release = (window as unknown as Record<string, unknown>).__journeyRelease;
    if (typeof release === 'function') release();
    requestAnimationFrame(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <section 
      ref={sectionRef}
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#3BF0FF] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[rgba(59,240,255,0.08)] rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[rgba(75,146,255,0.06)] rounded-full blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          x: -mousePosition.x * 2,
          y: -mousePosition.y * 2,
        }}
      />

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        style={isMobile ? {} : { opacity, scale, y }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
           

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
            >
              <span className="block">AI-Driven</span>
              <span className="block bg-gradient-to-r from-[#3BF0FF] via-[#4B92FF] to-[#B829F7] bg-clip-text text-transparent">
                Innovation
              </span>
             
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-[rgba(255,255,255,0.7)] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              We combine deep AI expertise with industry know-how to deliver solutions 
              that drive measurable impact. AI works for you—not the other way around.
            </motion.p>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]"
                >
                  <feature.icon className="w-4 h-4 text-[#3BF0FF]" />
                  <span className="font-['Rajdhani',sans-serif] text-sm text-[rgba(255,255,255,0.8)]">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const release = (window as unknown as Record<string, unknown>).__journeyRelease;
                  if (typeof release === 'function') release();
                  requestAnimationFrame(() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  });
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59,240,255,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-[#3BF0FF] to-[#4B92FF] text-white font-['Orbitron',sans-serif] text-sm tracking-wider uppercase group"
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#4B92FF] to-[#3BF0FF]"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              
              <motion.a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  const release = (window as unknown as Record<string, unknown>).__journeyRelease;
                  if (typeof release === 'function') release();
                  requestAnimationFrame(() => {
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl border border-[rgba(59,240,255,0.3)] text-white font-['Orbitron',sans-serif] text-sm tracking-wider uppercase hover:bg-[rgba(59,240,255,0.1)] hover:border-[rgba(59,240,255,0.5)] transition-all"
              >
                Explore Services
              </motion.a>
            </motion.div>
          </div>

          {/* Right - Robot */}
          <motion.div 
            className="flex justify-center order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Glow effect behind robot */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[rgba(59,240,255,0.3)] to-[rgba(75,146,255,0.2)] rounded-full blur-[80px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              <Robot state="welcoming" hasEntered={true} size="lg" />
              
              {/* Floating elements around robot */}
              <motion.div
                className="absolute top-1/4 -right-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgba(59,240,255,0.2)] to-[rgba(75,146,255,0.1)] border border-[rgba(59,240,255,0.3)] flex items-center justify-center"
                animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Zap className="w-6 h-6 text-[#3BF0FF]" />
              </motion.div>

              <motion.div
                className="absolute top-1/2 -left-8 w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(184,41,247,0.2)] to-[rgba(75,146,255,0.1)] border border-[rgba(184,41,247,0.3)] flex items-center justify-center"
                animate={{ y: [8, -8, 8], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-[#B829F7]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[rgba(255,255,255,0.5)] hover:text-[#3BF0FF] transition-colors group"
      >
        <span className="font-['Rajdhani',sans-serif] text-xs tracking-widest uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
