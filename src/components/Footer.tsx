'use client';

import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Instagram, ArrowUpRight, InstagramIcon } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'AI Solutions', href: '#services' },
    { label: 'NLP', href: '#services' },
    { label: 'Computer Vision', href: '#services' },
    { label: 'Predictive Analysis', href: '#services' },
  ],
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Story', href: '#journey' },
    { label: 'Contact', href: '#contact' },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/company/gspec-tech/', label: 'LinkedIn' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/gspectechnologies/', label: 'Instagram' },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToSection = (href: string) => {
    if (href === '#') return;
    const id = href.slice(1);

    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      return;
    }

    // Release journey scroll-lock if active, then wait one frame for layout
    // to restore before measuring element positions.
    const release = (window as unknown as Record<string, unknown>).__journeyRelease;
    if (typeof release === 'function') {
      release();
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative bg-[#050811] border-t border-[rgba(59,240,255,0.1)] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgba(59,240,255,0.03)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[rgba(75,146,255,0.03)] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <img
                src="/gspec-logo.png"
                alt="GSPEC Technologies"
                className="h-10 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 0 6px rgba(59,240,255,0.2))' }}
              />
            </div>
            
            <p className="text-[rgba(255,255,255,0.6)] text-sm leading-relaxed mb-6 max-w-sm">
              GSPEC Technologies transforms businesses with cutting-edge AI solutions including NLP,
              predictive analytics, computer vision, and enterprise automation.
              GSPEC Tech — Your Vision, Our Innovation.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a 
                href="tel:+17174028885" 
                className="flex items-center gap-3 text-[rgba(255,255,255,0.6)] hover:text-[#3BF0FF] transition-colors group"
              >
                <Phone className="w-4 h-4 group-hover:text-[#3BF0FF]" />
                <span className="text-sm">+1 717 402 8885</span>
              </a>
              <a 
                href="mailto:info@gspectech.com" 
                className="flex items-center gap-3 text-[rgba(255,255,255,0.6)] hover:text-[#3BF0FF] transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:text-[#3BF0FF]" />
                <span className="text-sm">info@gspectech.com</span>
              </a>
              <div className="flex items-start gap-3 text-[rgba(255,255,255,0.6)]">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="text-sm">115 W 27th St, New York, NY 10001</span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-['Orbitron',sans-serif] text-sm tracking-wider text-white mb-6 uppercase">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="text-[rgba(255,255,255,0.6)] hover:text-[#3BF0FF] transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-['Orbitron',sans-serif] text-sm tracking-wider text-white mb-6 uppercase">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="text-[rgba(255,255,255,0.6)] hover:text-[#3BF0FF] transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/blogs"
                  className="text-[rgba(255,255,255,0.6)] hover:text-[#3BF0FF] transition-colors text-sm flex items-center gap-1 group"
                >
                  Blogs
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </motion.div>
            {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:text-[#3BF0FF] hover:border-[rgba(59,240,255,0.3)] hover:bg-[rgba(59,240,255,0.1)] transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div 
          className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-[rgba(255,255,255,0.4)] text-sm text-center md:text-left">
            © {new Date().getFullYear()} Gspec Technologies. All rights reserved.
          </p>

        </motion.div>

        {/* Motto */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="font-['Chakra_Petch',sans-serif] text-lg text-[rgba(255,255,255,0.3)] tracking-widest">
            "Your Vision, Our Innovation, One Future."
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
