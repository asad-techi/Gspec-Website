'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Robot from '@/components/Robot';
import { Target, Eye, Rocket, Users, Award, Clock } from 'lucide-react';
import SectionBadge from '@/components/SectionBadge';


const stats = [
  { value: '100+', label: 'Projects Delivered', icon: Rocket },
  { value: '30+', label: 'Skilled Professionals', icon: Users },
  { value: '99%', label: 'Client Satisfaction', icon: Award },
  { value: '95%', label: 'On-Time Delivery', icon: Clock },
];

const values = [
  { title: 'Vision', description: 'To redefine software development by making it transparent, collaborative and value-driven.', icon: Eye },
  { title: 'Mission', description: 'To empower businesses with tailored software solutions that drive efficiency and innovation.', icon: Target },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="relative py-16 lg:py-24 overflow-hidden"
    >
      {/* Background */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[rgba(59,240,255,0.03)] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[rgba(75,146,255,0.02)] rounded-full blur-[120px]" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <SectionBadge label="About GSPEC Technologies" color="#B829F7" />

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Turning Big Ideas into
            <span className="block bg-gradient-to-r from-[#B829F7] to-[#3BF0FF] bg-clip-text text-transparent">
              Real-World Results
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[rgba(255,255,255,0.7)] max-w-3xl mx-auto"
          >
            We believe software should be more than lines of code. It should make businesses stronger, 
            simplify processes and help organizations achieve their goals.
          </motion.p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-10">
          {/* Left - Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-['Chakra_Petch',sans-serif] text-2xl text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3BF0FF] to-[#4B92FF] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </span>
              Our Story
            </h3>
            
            <div className="space-y-4 text-[rgba(255,255,255,0.7)] leading-relaxed">
              <p>
                Many businesses struggle to keep up with fast-moving technology. They are often stuck 
                with complex systems that are difficult to adapt.
              </p>
              <p>
                Founded in 2020 by a team working in technology since 2017, GSPEC Technologies was
                built to change that. Our mission is simple: Make software development transparent,
                collaborative and focused on long-term success.
              </p>
              <p>
                At GSPEC Tech, we create smart and adaptable AI-powered software solutions that solve
                real problems and deliver measurable results for enterprises worldwide.
              </p>
            </div>

            {/* Vision & Mission */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {values.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-5 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,240,255,0.3)] transition-all group"
                >
                  <item.icon className="w-6 h-6 text-[#3BF0FF] mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-['Orbitron',sans-serif] text-lg text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-[rgba(255,255,255,0.6)]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Robot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[rgba(184,41,247,0.2)] to-[rgba(59,240,255,0.1)] rounded-full blur-[60px]"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <Robot state="thinking" hasEntered={true} size="lg" />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[rgba(59,240,255,0.08)] to-[rgba(75,146,255,0.05)] border border-[rgba(59,240,255,0.15)] text-center group"
            >
              <stat.icon className="w-6 h-6 text-[#3BF0FF] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-['Orbitron',sans-serif] text-3xl lg:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="font-['Rajdhani',sans-serif] text-sm text-[rgba(255,255,255,0.6)] uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
