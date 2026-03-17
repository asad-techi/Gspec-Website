'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Robot from '@/components/Robot';
import {
  Brain,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Eye,
  BarChart3,
  ArrowRight,
  Check
} from 'lucide-react';
import SectionBadge from '@/components/SectionBadge';

const solutions = [
  {
    icon: Sparkles,
    title: 'Generative Modeling',
    description: 'Generative AI enables automated creation of content, workflows and simulations.',
    applications: [
      'Marketing content generation',
      'Process simulation for risk analysis',
      'Automated code synthesis',
      'Creative asset production',
    ],
    color: '#3BF0FF',
  },
  {
    icon: MessageSquare,
    title: 'Natural Language Processing',
    description: 'NLP systems analyze textual data and convert unstructured information into structured insights.',
    applications: [
      'Customer feedback analysis',
      'Legal document processing',
      'Knowledge management automation',
      'Sentiment monitoring',
    ],
    color: '#4B92FF',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Analytics',
    description: 'Predictive models analyze data to forecast trends and support strategic decisions.',
    applications: [
      'Demand forecasting',
      'Fraud detection',
      'Predictive maintenance',
      'Product recommendation systems',
    ],
    color: '#B829F7',
  },
];

const features = [
  { icon: Brain, title: 'Machine Learning', desc: 'Custom ML models tailored to your needs' },
  { icon: Eye, title: 'Computer Vision', desc: 'Visual data analysis and recognition' },
  { icon: BarChart3, title: 'Data Analytics', desc: 'Transform data into actionable insights' },
];

export default function AISolutionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={sectionRef}
      id="ai-solutions" 
      className="relative py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[rgba(59,240,255,0.03)] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[rgba(75,146,255,0.02)] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[rgba(184,41,247,0.02)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <SectionBadge label="AI Solutions" color="#3BF0FF" icon={Brain} />

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Making Data Work
            <span className="block bg-gradient-to-r from-[#3BF0FF] via-[#4B92FF] to-[#B829F7] bg-clip-text text-transparent">
              Smarter
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[rgba(255,255,255,0.7)] max-w-3xl mx-auto"
          >
            Artificial intelligence is transforming how organizations address operational and strategic challenges. 
            We design AI-driven solutions that improve decision-making, optimize operations and enhance customer engagement.
          </motion.p>
        </div>

        {/* Robot guide */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
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
            <Robot state="creating" hasEntered={true} size="md" />
          </div>
        </motion.div>

        {/* Solutions grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm h-full transition-all duration-500 hover:border-[rgba(59,240,255,0.3)] overflow-hidden">
                {/* Gradient background on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(180deg, ${solution.color}10 0%, transparent 60%)`,
                  }}
                />

                {/* Icon */}
                <div 
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, ${solution.color}20, ${solution.color}10)`,
                    border: `1px solid ${solution.color}40`,
                  }}
                >
                  <solution.icon className="w-8 h-8" style={{ color: solution.color }} />
                </div>

                {/* Content */}
                <h3 className="relative font-['Chakra_Petch',sans-serif] text-xl text-white mb-4 group-hover:text-[#3BF0FF] transition-colors">
                  {solution.title}
                </h3>
                <p className="relative text-[rgba(255,255,255,0.6)] text-sm leading-relaxed mb-6">
                  {solution.description}
                </p>

                {/* Applications */}
                <ul className="relative space-y-3">
                  {solution.applications.map((app, i) => (
                    <motion.li
                      key={app}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 + i * 0.05 }}
                      className="flex items-center gap-3 text-sm text-[rgba(255,255,255,0.7)]"
                    >
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${solution.color}20` }}
                      >
                        <Check className="w-3 h-3" style={{ color: solution.color }} />
                      </span>
                      {app}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-3 gap-4 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl bg-gradient-to-br from-[rgba(59,240,255,0.05)] to-[rgba(75,146,255,0.03)] border border-[rgba(59,240,255,0.1)] text-center group hover:border-[rgba(59,240,255,0.3)] transition-all"
            >
              <feature.icon className="w-8 h-8 text-[#3BF0FF] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-['Chakra_Petch',sans-serif] text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-[rgba(255,255,255,0.5)]">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#3BF0FF] to-[#4B92FF] text-white font-['Orbitron',sans-serif] text-sm tracking-wider uppercase group"
          >
            <span>Get AI Solutions</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
