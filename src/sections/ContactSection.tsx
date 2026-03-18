'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Robot from '@/components/Robot';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowRight, Check } from 'lucide-react';
import SectionBadge from '@/components/SectionBadge';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+1 717 402 8885', href: 'tel:+17174028885' },
  { icon: Mail, label: 'Email', value: 'info@gspectech.com', href: 'mailto:info@gspectech.com' },
  { icon: MapPin, label: 'Address', value: '115 W 27th St, New York, NY 10001', href: '#' },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ContactSection] Submitting contact form with state:', formState);
    console.log('[ContactSection] EmailJS config:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      hasPublicKey: !!EMAILJS_PUBLIC_KEY,
    });
    setIsSubmitting(true);

    try {
      const templateParams = {
        // Primary fields used in your EmailJS template
        user_name: formState.name,
        user_email: formState.email,
        company: formState.company,
        message: formState.message,
        // Extra aliases in case the template uses different variable names
        name: formState.name,
        email: formState.email,
        reply_to: formState.email,
      };

      console.log('[ContactSection] EmailJS template params being sent:', templateParams);

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('[ContactSection] EmailJS send() completed successfully');

      setIsSubmitted(true);
      setFormState({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again or contact us directly at info@gspectech.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative pt-20 pb-0 lg:py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[rgba(59,240,255,0.04)] rounded-full blur-[150px]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[rgba(75,146,255,0.03)] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[rgba(184,41,247,0.02)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <SectionBadge label="Get In Touch" color="#3BF0FF" icon={MessageSquare} />

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Ready to Discuss
            <span className="block bg-gradient-to-r from-[#3BF0FF] to-[#4B92FF] bg-clip-text text-transparent">
              Your Project?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[rgba(255,255,255,0.7)] max-w-2xl mx-auto"
          >
            We're eager to learn about your project and explore how we can help you achieve your goals. 
            Reach out for a consultation.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-8 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3BF0FF] to-[#4B92FF] flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="font-['Chakra_Petch',sans-serif] text-2xl text-white mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-[rgba(255,255,255,0.6)]">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[rgba(255,255,255,0.6)] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(59,240,255,0.5)] focus:ring-2 focus:ring-[rgba(59,240,255,0.1)] transition-all"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[rgba(255,255,255,0.6)] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(59,240,255,0.5)] focus:ring-2 focus:ring-[rgba(59,240,255,0.1)] transition-all"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[rgba(255,255,255,0.6)] mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formState.company}
                      onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(59,240,255,0.5)] focus:ring-2 focus:ring-[rgba(59,240,255,0.1)] transition-all"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[rgba(255,255,255,0.6)] mb-2">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(59,240,255,0.5)] focus:ring-2 focus:ring-[rgba(59,240,255,0.1)] transition-all resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#3BF0FF] to-[#4B92FF] text-white font-['Orbitron',sans-serif] text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right - Contact info & Robot */}
          <div className="space-y-8">
            {/* Robot */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[rgba(59,240,255,0.2)] to-[rgba(75,146,255,0.1)] rounded-full blur-[60px]"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <Robot state="waving" hasEntered={true} size="lg" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
