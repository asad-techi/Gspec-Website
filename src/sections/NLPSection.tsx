'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Robot from '@/components/Robot';
import { FileText, MessageCircle, Database, Check, Zap } from 'lucide-react';
import SectionBadge from '@/components/SectionBadge';

const nlpServices = [
  {
    icon: FileText,
    title: 'Document Processing',
    description: 'Automate the way you handle text data. Extract key information from PDFs, invoices, contracts and emails automatically.',
    benefits: [
      'Faster document review',
      'Reduced manual errors',
      'Automatic data extraction',
      'Seamless integration',
    ],
    color: '#3BF0FF',
  },
  {
    icon: MessageCircle,
    title: 'Sentiment Analysis',
    description: 'Understand customer emotions at scale. Evaluate emotions expressed in customer feedback, reviews and social media.',
    benefits: [
      'Measure customer satisfaction',
      'Monitor brand reputation',
      'Understand customer opinions',
      'Improve customer retention',
    ],
    color: '#4B92FF',
  },
  {
    icon: Database,
    title: 'Data Extraction',
    description: 'Turn unstructured data into valuable insights. Convert raw text into structured information for decision-making.',
    benefits: [
      'Structured data output',
      'Real-time processing',
      'Multi-format support',
      'Scalable solutions',
    ],
    color: '#B829F7',
  },
];

const floatingWords = [
  'NLP', 'Text', 'Analysis', 'AI', 'Data', 'Insights', 
  'Process', 'Extract', 'Understand', 'Automate', 'Learn', 'Transform'
];

export default function NLPSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={sectionRef}
      id="nlp" 
      className="relative py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[rgba(59,240,255,0.04)] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[rgba(75,146,255,0.03)] rounded-full blur-[120px]" />
        
        {/* Floating words */}
        {floatingWords.map((word, i) => (
          <motion.span
            key={word}
            className="absolute font-['Orbitron',sans-serif] text-[rgba(59,240,255,0.08)] text-4xl font-bold select-none"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${10 + (i * 13) % 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <SectionBadge label="Language AI" color="#3BF0FF" icon={Zap} align="left" />

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl font-bold text-white mb-6"
            >
              Automating Textual
              <span className="block bg-gradient-to-r from-[#3BF0FF] to-[#4B92FF] bg-clip-text text-transparent">
                Analysis
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[rgba(255,255,255,0.7)] leading-relaxed"
            >
              Natural Language Processing enables automated understanding and analysis of human language. 
              It allows organizations to extract valuable information from textual data and transform 
              it into actionable insights.
            </motion.p>
          </div>

          {/* Robot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
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
              <Robot state="reading" hasEntered={true} size="lg" />
            </div>
          </motion.div>
        </div>

        {/* NLP Services */}
        <div className="grid md:grid-cols-3 gap-6">
          {nlpServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm h-full transition-all duration-500 hover:border-[rgba(59,240,255,0.3)] overflow-hidden">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${service.color}15, transparent 60%)`,
                  }}
                />

                {/* Icon */}
                <div 
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, ${service.color}20, ${service.color}10)`,
                    border: `1px solid ${service.color}40`,
                  }}
                >
                  <service.icon className="w-8 h-8" style={{ color: service.color }} />
                </div>

                {/* Content */}
                <h3 className="relative font-['Chakra_Petch',sans-serif] text-xl text-white mb-4 group-hover:text-[#3BF0FF] transition-colors">
                  {service.title}
                </h3>
                <p className="relative text-[rgba(255,255,255,0.6)] text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Benefits */}
                <ul className="relative space-y-3">
                  {service.benefits.map((benefit, i) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 + i * 0.05 }}
                      className="flex items-center gap-3 text-sm text-[rgba(255,255,255,0.7)]"
                    >
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${service.color}20` }}
                      >
                        <Check className="w-3 h-3" style={{ color: service.color }} />
                      </span>
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: '50+', label: 'Languages Supported' },
            { value: '99%', label: 'Accuracy Rate' },
            { value: '10M+', label: 'Documents Processed' },
            { value: '<1s', label: 'Response Time' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]"
            >
              <div className="font-['Orbitron',sans-serif] text-2xl text-[#3BF0FF] mb-1">{stat.value}</div>
              <div className="text-xs text-[rgba(255,255,255,0.5)] uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
