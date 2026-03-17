'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Robot from '@/components/Robot';
import { TrendingUp, Users, Target, Globe, Award, Clock } from 'lucide-react';

const stats = [
  { 
    value: 10, 
    suffix: '+',
    label: 'Years of AI Expertise', 
    description: 'A proven track record delivering successful AI-driven transformations.',
    icon: Clock,
    color: '#3BF0FF',
  },
  { 
    value: 200, 
    suffix: '+',
    label: 'Global Enterprise Clients', 
    description: 'Trusted by over 200 companies worldwide.',
    icon: Users,
    color: '#4B92FF',
  },
  { 
    value: 99, 
    suffix: '%',
    label: 'Accuracy in AI Models', 
    description: 'Best-in-class AI performance for precision-driven results.',
    icon: Target,
    color: '#B829F7',
  },
  { 
    value: 50, 
    suffix: '+',
    label: 'Countries Deployed', 
    description: 'Scalable solutions designed for global impact.',
    icon: Globe,
    color: '#FF2D95',
  },
];

const achievements = [
  { icon: Award, title: 'Industry Recognition', desc: 'Award-winning AI solutions' },
  { icon: TrendingUp, title: 'Proven ROI', desc: 'Average 300% return on investment' },
];

function AnimatedCounter({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span className="font-['Orbitron',sans-serif]">
      {count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={sectionRef}
      id="stats" 
      className="relative py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[rgba(59,240,255,0.03)] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[rgba(75,146,255,0.02)] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[rgba(184,41,247,0.02)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(59,240,255,0.1)] border border-[rgba(59,240,255,0.2)] mb-6"
          >
            <TrendingUp className="w-4 h-4 text-[#3BF0FF]" />
            <span className="font-['Rajdhani',sans-serif] text-sm tracking-wider text-[#3BF0FF] uppercase">
              Why Partner With Us
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Numbers That
            <span className="block bg-gradient-to-r from-[#3BF0FF] via-[#4B92FF] to-[#B829F7] bg-clip-text text-transparent">
              Speak for Themselves
            </span>
          </motion.h2>
        </div>

        {/* Robot */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[rgba(59,240,255,0.2)] via-[rgba(75,146,255,0.15)] to-[rgba(184,41,247,0.1)] rounded-full blur-[60px]"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <Robot state="counting" hasEntered={true} size="md" />
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm h-full transition-all duration-500 hover:border-[rgba(59,240,255,0.3)] overflow-hidden text-center">
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${stat.color}15, transparent 60%)`,
                  }}
                />

                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                    border: `1px solid ${stat.color}40`,
                  }}
                >
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </div>

                {/* Counter */}
                <div 
                  className="text-4xl lg:text-5xl font-bold mb-3"
                  style={{ color: stat.color }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
                </div>

                {/* Label */}
                <h3 className="font-['Chakra_Petch',sans-serif] text-white mb-3">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-[rgba(255,255,255,0.5)]">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-5 p-6 rounded-xl bg-gradient-to-br from-[rgba(59,240,255,0.05)] to-[rgba(75,146,255,0.03)] border border-[rgba(59,240,255,0.1)]"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[rgba(59,240,255,0.15)] to-[rgba(75,146,255,0.1)] flex items-center justify-center flex-shrink-0">
                <achievement.icon className="w-7 h-7 text-[#3BF0FF]" />
              </div>
              <div>
                <h4 className="font-['Chakra_Petch',sans-serif] text-white mb-1">{achievement.title}</h4>
                <p className="text-sm text-[rgba(255,255,255,0.5)]">{achievement.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
