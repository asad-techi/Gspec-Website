'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Robot from '@/components/Robot';
import { Eye, Video, Settings, Scan } from 'lucide-react';
import SectionBadge from '@/components/SectionBadge';

const visionServices = [
  {
    icon: Video,
    title: 'Video Analytics',
    description: 'Real-time object detection allows businesses to monitor environments and automatically identify events or objects.',
    benefits: [
      'Detect objects in real-time',
      'Improve security monitoring',
      'Track assets and inventory',
      'Automate operational processes',
    ],
    color: '#B829F7',
  },
  {
    icon: Settings,
    title: 'Equipment Monitoring',
    description: 'Computer vision systems monitor equipment and detect early signs of failure for predictive maintenance.',
    benefits: [
      'Prevent costly breakdowns',
      'Schedule maintenance proactively',
      'Improve operational efficiency',
      'Extend equipment lifespan',
    ],
    color: '#FF2D95',
  },
];

const useCases = [
  { title: 'Quality Control', description: 'Automated defect detection in manufacturing' },
  { title: 'Safety Monitoring', description: 'Real-time workplace safety compliance' },
  { title: 'Retail Analytics', description: 'Customer behavior and foot traffic analysis' },
  { title: 'Healthcare Imaging', description: 'Medical image analysis and diagnostics' },
];

export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={sectionRef}
      id="vision" 
      className="relative py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[rgba(184,41,247,0.04)] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[rgba(255,45,149,0.03)] rounded-full blur-[120px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(184,41,247,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(184,41,247,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <SectionBadge label="Computer Vision" color="#B829F7" icon={Scan} />

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Automating Visual
            <span className="block bg-gradient-to-r from-[#B829F7] to-[#FF2D95] bg-clip-text text-transparent">
              Data Analysis
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[rgba(255,255,255,0.7)] max-w-3xl mx-auto"
          >
            Computer Vision analyzes images and video streams to generate actionable insights. 
            These systems improve decision-making, operational efficiency and customer experiences.
          </motion.p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Robot */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center order-2 lg:order-1"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[rgba(184,41,247,0.2)] to-[rgba(255,45,149,0.1)] rounded-full blur-[60px]"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Scanning effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#B829F7] to-transparent"
                  animate={{
                    top: ['0%', '100%', '0%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
              
              <Robot state="scanning" hasEntered={true} size="lg" />
            </div>
          </motion.div>

          {/* Services */}
          <div className="space-y-6 order-1 lg:order-2">
            {visionServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ x: 10 }}
                className="group"
              >
                <div className="p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm transition-all duration-500 hover:border-[rgba(184,41,247,0.3)]">
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ 
                        background: `linear-gradient(135deg, ${service.color}20, ${service.color}10)`,
                        border: `1px solid ${service.color}40`,
                      }}
                    >
                      <service.icon className="w-7 h-7" style={{ color: service.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-['Chakra_Petch',sans-serif] text-xl text-white mb-2 group-hover:text-[#B829F7] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[rgba(255,255,255,0.6)] text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2">
                        {service.benefits.map((benefit) => (
                          <span
                            key={benefit}
                            className="px-3 py-1 rounded-full text-xs"
                            style={{ 
                              background: `${service.color}15`,
                              color: service.color,
                              border: `1px solid ${service.color}30`,
                            }}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Use cases */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-['Orbitron',sans-serif] text-xl text-white text-center mb-8">
            Industry Applications
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(184,41,247,0.3)] transition-all group"
              >
                <Eye className="w-6 h-6 text-[#B829F7] mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-['Chakra_Petch',sans-serif] text-white mb-1 group-hover:text-[#B829F7] transition-colors">
                  {useCase.title}
                </h4>
                <p className="text-xs text-[rgba(255,255,255,0.5)]">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            { value: '60 FPS', label: 'Real-time Processing' },
            { value: '99.5%', label: 'Detection Accuracy' },
            { value: '24/7', label: 'Continuous Monitoring' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="font-['Orbitron',sans-serif] text-3xl text-[#B829F7] mb-1">{stat.value}</div>
              <div className="text-sm text-[rgba(255,255,255,0.5)]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
