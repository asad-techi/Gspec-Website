'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Mission', href: '#mission' },
  { label: 'Blogs', href: '/blogs', isRoute: true },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (document.body.style.position === 'fixed') return;

      setIsScrolled(window.scrollY > 50);

      const sections = [...navItems.map(item => item.href.slice(1))];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.slice(1);
    setIsMobileMenuOpen(false);

    if (!isHome) {
      // Navigate to home page then scroll
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      return;
    }

    const win = window as unknown as Record<string, unknown>;
    const suppress = win.__journeySuppress;
    if (typeof suppress === 'function') {
      (suppress as (ms: number) => void)(2500);
    }

    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-[#070A12]/90 backdrop-blur-xl border-b border-[rgba(59,240,255,0.1)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="/"
              onClick={(e) => { e.preventDefault(); if (isHome) { scrollToSection('#home'); } else { navigate('/'); } }}
              className="flex items-center group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src="/gspec-logo.png"
                alt="GSPEC Technologies"
                className="h-10 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 0 8px rgba(59,240,255,0.25))' }}
              />
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => {
                const isActive = item.isRoute
                  ? location.pathname.startsWith(item.href)
                  : isHome && activeSection === item.href.slice(1);

                if (item.isRoute) {
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                    >
                      <Link
                        to={item.href}
                        className={cn(
                          'relative px-4 py-2 text-sm font-medium transition-colors group inline-block',
                          isActive ? 'text-[#3BF0FF]' : 'text-[rgba(255,255,255,0.7)] hover:text-white'
                        )}
                      >
                        <span className="font-['Rajdhani',sans-serif] tracking-wide uppercase">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 bg-[rgba(59,240,255,0.1)] rounded-lg border border-[rgba(59,240,255,0.2)]"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <motion.div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[rgba(59,240,255,0.1)] to-[rgba(75,146,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  );
                }

                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors group',
                      isActive ? 'text-[#3BF0FF]' : 'text-[rgba(255,255,255,0.7)] hover:text-white'
                    )}
                  >
                    <span className="font-['Rajdhani',sans-serif] tracking-wide uppercase">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-[rgba(59,240,255,0.1)] rounded-lg border border-[rgba(59,240,255,0.2)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <motion.div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[rgba(59,240,255,0.1)] to-[rgba(75,146,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                );
              })}
            </nav>

            {/* CTA Button */}
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[rgba(59,240,255,0.15)] to-[rgba(75,146,255,0.15)] border border-[rgba(59,240,255,0.3)] text-white text-sm font-medium hover:border-[rgba(59,240,255,0.5)] transition-all group"
            >
              <span className="font-['Orbitron',sans-serif] tracking-wider text-xs uppercase">
                Get Started
              </span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </motion.a>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 z-40 lg:hidden"
          >
            <div className="mx-4 p-4 rounded-2xl bg-[#070A12]/95 backdrop-blur-xl border border-[rgba(59,240,255,0.2)] shadow-2xl">
              <nav className="flex flex-col gap-2">
                {navItems.map((item, index) => {
                  const isActive = item.isRoute
                    ? location.pathname.startsWith(item.href)
                    : isHome && activeSection === item.href.slice(1);

                  if (item.isRoute) {
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'block px-4 py-3 rounded-2xl text-sm font-medium transition-all',
                            isActive
                              ? 'bg-[rgba(59,240,255,0.15)] text-[#3BF0FF] border border-[rgba(59,240,255,0.3)]'
                              : 'text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                          )}
                        >
                          <span className="font-['Rajdhani',sans-serif] tracking-wide uppercase">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'px-4 py-3 rounded-2xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-[rgba(59,240,255,0.15)] text-[#3BF0FF] border border-[rgba(59,240,255,0.3)]'
                          : 'text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                      )}
                    >
                      <span className="font-['Rajdhani',sans-serif] tracking-wide uppercase">{item.label}</span>
                    </motion.a>
                  );
                })}
              </nav>

              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3BF0FF] to-[#4B92FF] text-white text-sm font-medium"
              >
                <span className="font-['Orbitron',sans-serif] tracking-wider uppercase">
                  Get Started
                </span>
                <span>→</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
