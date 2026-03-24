'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Brain,
  FileText,
  Eye,
  BarChart3,
  ArrowRight,
  Sparkles,
  X,
  Check,
  MessageSquare,
  Database,
  Cpu,
  TrendingUp,
  Shield,
} from 'lucide-react';
import SectionBadge from '@/components/SectionBadge';

// =========================================================================
//                              TYPES & DATA
// =========================================================================

type IconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

interface ServiceDetail {
  id: string;
  icon: IconComponent;
  title: string;
  tagline: string;
  color: string;
  modal: {
    headline: string;
    intro: string;
    capabilities: { icon: IconComponent; title: string; description: string }[];
    outcomes: string[];
  };
}

const services: ServiceDetail[] = [
  {
    id: 'nlp',
    icon: FileText,
    title: 'NLP',
    tagline: 'Turn language into actionable intelligence at scale.',
    color: '#3BF0FF',
    modal: {
      headline: 'Natural Language Processing',
      intro:
        'GSPEC Technologies delivers NLP solutions that help enterprises extract meaning, automate workflows and unlock the value hidden in text — at any scale.',
      capabilities: [
        { icon: MessageSquare, title: 'Chatbots & Conversational AI', description: 'Deploy intelligent virtual assistants that understand intent, context and nuance to deliver seamless customer interactions.' },
        { icon: FileText, title: 'Document Understanding', description: 'Automatically extract, classify and summarize information from contracts, reports, emails and invoices.' },
        { icon: TrendingUp, title: 'Sentiment Analysis', description: 'Measure customer emotion and brand perception across reviews, social feeds and support tickets in real time.' },
        { icon: Database, title: 'Language Workflow Automation', description: 'Eliminate manual text tasks by automating routing, tagging, translation and data entry with NLP pipelines.' },
      ],
      outcomes: [
        'Reduce document processing time by up to 80%',
        'Multi-language support across 50+ languages',
        'Sub-second inference at production scale',
        'Seamless integration into existing enterprise systems',
      ],
    },
  },
  {
    id: 'predictive',
    icon: BarChart3,
    title: 'Predictive Analysis',
    tagline: 'Forecast the future and act before problems arise.',
    color: '#4B92FF',
    modal: {
      headline: 'Predictive Analysis',
      intro:
        "Our predictive analytics engine transforms your historical data into forward-looking intelligence — helping decision-makers stay ahead of market shifts, operational risks and customer behavior.",
      capabilities: [
        { icon: TrendingUp, title: 'Demand Forecasting', description: 'Accurately predict demand cycles to optimize inventory, staffing and supply chain operations.' },
        { icon: Shield, title: 'Risk & Fraud Detection', description: 'Identify anomalies and high-risk events before they escalate using real-time pattern recognition models.' },
        { icon: BarChart3, title: 'Business Intelligence', description: 'Surface actionable KPIs and trend signals from complex datasets with explainable AI dashboards.' },
        { icon: Brain, title: 'Data-Driven Decisions', description: 'Replace gut-feel decisions with model-backed recommendations tied directly to business outcomes.' },
      ],
      outcomes: [
        'Forecast accuracy rates consistently above 90%',
        'Early warning systems for risk and churn',
        'Automated reporting pipelines to cut analysis time',
        'Scalable from SMB data sets to enterprise data lakes',
      ],
    },
  },
  {
    id: 'ai-solutions',
    icon: Brain,
    title: 'AI Solutions',
    tagline: 'Custom AI systems built for your specific business challenges.',
    color: '#B829F7',
    modal: {
      headline: 'AI Solutions',
      intro:
        'GSPEC Technologies builds bespoke AI systems that integrate with your existing infrastructure, automate critical workflows and deliver measurable ROI from day one.',
      capabilities: [
        { icon: Cpu, title: 'Custom AI Development', description: 'End-to-end AI model design, training and deployment tailored precisely to your use case and data.' },
        { icon: Brain, title: 'Workflow Automation', description: 'Automate repetitive, rule-based tasks across operations, finance, HR and customer service with intelligent agents.' },
        { icon: Shield, title: 'Enterprise AI Integration', description: 'Connect AI capabilities to your ERP, CRM, or cloud platforms via robust APIs and middleware layers.' },
        { icon: TrendingUp, title: 'Scalable Business Solutions', description: 'Architecture designed to grow with your business — from pilot programs to full enterprise rollout.' },
      ],
      outcomes: [
        'Average 3–5× ROI within the first year of deployment',
        'Reduced operational costs through intelligent automation',
        'Faster time-to-value with accelerated deployment frameworks',
        'Ongoing model monitoring and continuous improvement',
      ],
    },
  },
  {
    id: 'computer-vision',
    icon: Eye,
    title: 'Computer Vision',
    tagline: 'Give your systems the power to see and understand the world.',
    color: '#FF2D95',
    modal: {
      headline: 'Computer Vision',
      intro:
        'Our computer vision solutions turn raw image and video data into structured intelligence — enabling automated inspection, real-time monitoring and visual process control at scale.',
      capabilities: [
        { icon: Eye, title: 'Object Detection & Recognition', description: 'Identify, classify and track objects across live video or image streams with high accuracy and speed.' },
        { icon: Shield, title: 'Visual Inspection & QA', description: 'Automate quality control processes on production lines with precision that surpasses manual inspection.' },
        { icon: TrendingUp, title: 'Monitoring Systems', description: 'Deploy intelligent surveillance and operational monitoring with real-time anomaly detection and alerting.' },
        { icon: Cpu, title: 'Intelligent Visual Automation', description: 'Integrate vision models into robotics, logistics and smart facility systems for end-to-end visual automation.' },
      ],
      outcomes: [
        'Real-time processing at 60+ frames per second',
        'Defect detection accuracy above 98% in controlled environments',
        'Reduced inspection labor costs by up to 70%',
        'Edge and cloud deployment options for any infrastructure',
      ],
    },
  },
];

// =========================================================================
//                       SVG VECTOR ILLUSTRATIONS
// =========================================================================

function NLPIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      <defs>
        <radialGradient id="nlp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="80" r="70" fill="url(#nlp-glow)" />

      {/* Main chat bubble */}
      <rect x="55" y="35" width="90" height="50" rx="12" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.07" opacity="1" />
      <path d="M80 85 L75 95 L90 85" stroke={color} strokeWidth="2" fill="none" opacity="0.9" />
      {/* Text lines inside bubble */}
      <line x1="70" y1="50" x2="130" y2="50" stroke={color} strokeWidth="2.5" opacity="0.85" strokeLinecap="round" />
      <line x1="70" y1="58" x2="120" y2="58" stroke={color} strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />
      <line x1="70" y1="66" x2="100" y2="66" stroke={color} strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />

      {/* Secondary smaller bubble */}
      <rect x="30" y="90" width="55" height="30" rx="8" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.05" opacity="0.8" />
      <line x1="40" y1="102" x2="72" y2="102" stroke={color} strokeWidth="1.8" opacity="0.6" strokeLinecap="round" />
      <line x1="40" y1="110" x2="60" y2="110" stroke={color} strokeWidth="1.8" opacity="0.45" strokeLinecap="round" />

      {/* Processing nodes */}
      {[
        { cx: 150, cy: 45 }, { cx: 165, cy: 70 }, { cx: 155, cy: 100 },
        { cx: 25, cy: 55 }, { cx: 15, cy: 80 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r="6" fill={color} opacity="0.25" />
          <circle cx={p.cx} cy={p.cy} r="3" fill={color} opacity="0.85" />
        </g>
      ))}

      {/* Connection lines from bubbles to nodes */}
      <line x1="145" y1="50" x2="150" y2="45" stroke={color} strokeWidth="1.2" opacity="0.55" strokeDasharray="3 2" />
      <line x1="145" y1="70" x2="165" y2="70" stroke={color} strokeWidth="1.2" opacity="0.55" strokeDasharray="3 2" />
      <line x1="55" y1="55" x2="25" y2="55" stroke={color} strokeWidth="1.2" opacity="0.55" strokeDasharray="3 2" />

      {/* Waveform at bottom */}
      <path d="M20 140 Q50 125 80 135 T140 130 T200 132" stroke={color} strokeWidth="1.5" opacity="0.45" fill="none" />
      <path d="M0 148 Q40 138 80 145 T160 140 T200 142" stroke={color} strokeWidth="1.2" opacity="0.3" fill="none" />
    </svg>
  );
}

function PredictiveIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="pred-area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
        <radialGradient id="pred-glow" cx="70%" cy="30%" r="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill="url(#pred-glow)" />

      {/* Grid lines */}
      {[50, 70, 90, 110, 130].map((y, i) => (
        <line key={`h${i}`} x1="25" y1={y} x2="185" y2={y} stroke={color} strokeWidth="0.6" opacity="0.25" />
      ))}
      {[45, 75, 105, 135, 165].map((x, i) => (
        <line key={`v${i}`} x1={x} y1="35" x2={x} y2="140" stroke={color} strokeWidth="0.6" opacity="0.25" />
      ))}

      {/* Main trend line */}
      <path d="M30 125 L60 110 L90 95 L120 70 L150 45 L180 25" stroke={color} strokeWidth="3" opacity="0.95" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Area fill under trend */}
      <path d="M30 125 L60 110 L90 95 L120 70 L150 45 L180 25 L180 140 L30 140 Z" fill="url(#pred-area-fill)" />

      {/* Prediction zone (dashed future) */}
      <path d="M135 58 L150 45 L180 25" stroke={color} strokeWidth="2.5" opacity="0.75" strokeDasharray="5 3" fill="none" />
      <path d="M135 58 L155 55 L180 48" stroke={color} strokeWidth="1.5" opacity="0.4" strokeDasharray="3 3" fill="none" />
      <path d="M135 58 L150 35 L180 10" stroke={color} strokeWidth="1.5" opacity="0.4" strokeDasharray="3 3" fill="none" />

      {/* Data points with rings */}
      {[
        { x: 30, y: 125 }, { x: 60, y: 110 }, { x: 90, y: 95 },
        { x: 120, y: 70 }, { x: 150, y: 45 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="8" fill={color} opacity="0.2" />
          <circle cx={p.x} cy={p.y} r="4.5" fill={color} opacity="0.55" />
          <circle cx={p.x} cy={p.y} r="2" fill={color} opacity="1" />
        </g>
      ))}

      {/* Scatter dots */}
      {[
        { x: 42, y: 118 }, { x: 52, y: 115 }, { x: 72, y: 105 }, { x: 82, y: 100 },
        { x: 100, y: 88 }, { x: 110, y: 78 }, { x: 130, y: 62 }, { x: 142, y: 52 },
      ].map((p, i) => (
        <circle key={`s${i}`} cx={p.x} cy={p.y} r="2.5" fill={color} opacity="0.5" />
      ))}

      {/* Small bar indicators */}
      {[50, 80, 110, 140].map((x, i) => (
        <rect key={`b${i}`} x={x - 4} y={130 - (i + 1) * 15} width="8" height={(i + 1) * 15} rx="2" fill={color} opacity="0.22" />
      ))}
    </svg>
  );
}

function AISolutionsIllustration({ color }: { color: string }) {
  // Neural network nodes: layer positions for a brain-like architecture
  const inputNodes = [
    { x: 22, y: 35 }, { x: 22, y: 60 }, { x: 22, y: 85 }, { x: 22, y: 110 },
  ];
  const hiddenLayer1 = [
    { x: 62, y: 28 }, { x: 62, y: 52 }, { x: 62, y: 76 }, { x: 62, y: 100 }, { x: 62, y: 124 },
  ];
  const hiddenLayer2 = [
    { x: 138, y: 28 }, { x: 138, y: 52 }, { x: 138, y: 76 }, { x: 138, y: 100 }, { x: 138, y: 124 },
  ];
  const outputNodes = [
    { x: 178, y: 48 }, { x: 178, y: 76 }, { x: 178, y: 104 },
  ];

  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      <defs>
        <radialGradient id="ai-core-glow" cx="50%" cy="48%" r="35%">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ai-flow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="200" height="160" fill="url(#ai-core-glow)" />

      {/* Data flow line across middle */}
      <line x1="10" y1="76" x2="190" y2="76" stroke="url(#ai-flow)" strokeWidth="1" />

      {/* Connection lines: input → hidden1 */}
      {inputNodes.map((inp, i) =>
        hiddenLayer1.map((h, j) => (
          <line key={`i-h1-${i}-${j}`} x1={inp.x} y1={inp.y} x2={h.x} y2={h.y}
            stroke={color} strokeWidth="0.8" opacity={0.18 + (i === j ? 0.22 : 0)} />
        ))
      )}
      {/* Connection lines: hidden1 → hidden2 */}
      {hiddenLayer1.map((h1, i) =>
        hiddenLayer2.map((h2, j) => (
          <line key={`h1-h2-${i}-${j}`} x1={h1.x} y1={h1.y} x2={h2.x} y2={h2.y}
            stroke={color} strokeWidth="0.7" opacity={0.14 + (i === j ? 0.26 : 0)} />
        ))
      )}
      {/* Connection lines: hidden2 → output */}
      {hiddenLayer2.map((h, i) =>
        outputNodes.map((out, j) => (
          <line key={`h2-o-${i}-${j}`} x1={h.x} y1={h.y} x2={out.x} y2={out.y}
            stroke={color} strokeWidth="0.8" opacity={0.18 + (i === j ? 0.22 : 0)} />
        ))
      )}

      {/* Central AI brain — stylized processor chip */}
      <rect x="80" y="56" width="40" height="40" rx="8" stroke={color} strokeWidth="2" opacity="0.75" fill={color} fillOpacity="0.06" />
      <rect x="86" y="62" width="28" height="28" rx="4" stroke={color} strokeWidth="1.2" opacity="0.55" fill="none" />
      {/* Brain/chip pins — left */}
      {[64, 72, 80, 88].map((y, i) => (
        <line key={`pl${i}`} x1="74" y1={y} x2="80" y2={y} stroke={color} strokeWidth="1.5" opacity="0.7" />
      ))}
      {/* Brain/chip pins — right */}
      {[64, 72, 80, 88].map((y, i) => (
        <line key={`pr${i}`} x1="120" y1={y} x2="126" y2={y} stroke={color} strokeWidth="1.5" opacity="0.7" />
      ))}
      {/* Brain/chip pins — top */}
      {[90, 98, 106].map((x, i) => (
        <line key={`pt${i}`} x1={x} y1="50" x2={x} y2="56" stroke={color} strokeWidth="1.5" opacity="0.7" />
      ))}
      {/* Brain/chip pins — bottom */}
      {[90, 98, 106].map((x, i) => (
        <line key={`pb${i}`} x1={x} y1="96" x2={x} y2="102" stroke={color} strokeWidth="1.5" opacity="0.7" />
      ))}
      {/* Inner brain symbol — simplified neural paths */}
      <circle cx="100" cy="76" r="10" fill={color} opacity="0.18" />
      <circle cx="100" cy="76" r="5" fill={color} opacity="0.75" />
      <path d="M92 70 Q96 76 92 82" stroke={color} strokeWidth="1.2" opacity="0.7" fill="none" />
      <path d="M108 70 Q104 76 108 82" stroke={color} strokeWidth="1.2" opacity="0.7" fill="none" />
      <path d="M95 68 Q100 72 105 68" stroke={color} strokeWidth="1" opacity="0.6" fill="none" />
      <path d="M95 84 Q100 80 105 84" stroke={color} strokeWidth="1" opacity="0.6" fill="none" />

      {/* Input layer nodes */}
      {inputNodes.map((n, i) => (
        <g key={`in-${i}`}>
          <circle cx={n.x} cy={n.y} r="6" fill={color} opacity="0.2" />
          <circle cx={n.x} cy={n.y} r="3.5" fill={color} opacity="0.75" />
          {/* Data arrow into node */}
          <path d={`M${n.x - 12} ${n.y} L${n.x - 6} ${n.y}`} stroke={color} strokeWidth="1.2" opacity="0.6" />
          <path d={`M${n.x - 8} ${n.y - 2} L${n.x - 6} ${n.y} L${n.x - 8} ${n.y + 2}`} stroke={color} strokeWidth="1" opacity="0.6" fill="none" />
        </g>
      ))}

      {/* Hidden layer 1 nodes */}
      {hiddenLayer1.map((n, i) => (
        <g key={`h1-${i}`}>
          <circle cx={n.x} cy={n.y} r="5" fill={color} opacity="0.22" />
          <circle cx={n.x} cy={n.y} r="2.8" fill={color} opacity="0.8" />
        </g>
      ))}

      {/* Hidden layer 2 nodes */}
      {hiddenLayer2.map((n, i) => (
        <g key={`h2-${i}`}>
          <circle cx={n.x} cy={n.y} r="5" fill={color} opacity="0.22" />
          <circle cx={n.x} cy={n.y} r="2.8" fill={color} opacity="0.8" />
        </g>
      ))}

      {/* Output layer nodes with decision indicators */}
      {outputNodes.map((n, i) => (
        <g key={`out-${i}`}>
          <circle cx={n.x} cy={n.y} r="7" fill={color} opacity="0.18" />
          <circle cx={n.x} cy={n.y} r="4" fill={color} opacity="0.7" />
          {/* Output arrow */}
          <path d={`M${n.x + 6} ${n.y} L${n.x + 12} ${n.y}`} stroke={color} strokeWidth="1.2" opacity="0.65" />
          <path d={`M${n.x + 10} ${n.y - 2} L${n.x + 12} ${n.y} L${n.x + 10} ${n.y + 2}`} stroke={color} strokeWidth="1" opacity="0.65" fill="none" />
        </g>
      ))}

      {/* Layer labels */}
      <text x="22" y="148" textAnchor="middle" fill={color} opacity="0.55" fontSize="5" fontFamily="monospace">INPUT</text>
      <text x="100" y="148" textAnchor="middle" fill={color} opacity="0.55" fontSize="5" fontFamily="monospace">PROCESSING</text>
      <text x="178" y="148" textAnchor="middle" fill={color} opacity="0.55" fontSize="5" fontFamily="monospace">OUTPUT</text>

      {/* Decision tree branches from center */}
      <path d="M100 96 L100 108 L88 118" stroke={color} strokeWidth="1" opacity="0.45" />
      <path d="M100 108 L112 118" stroke={color} strokeWidth="1" opacity="0.45" />
      <circle cx="88" cy="118" r="2.5" fill={color} opacity="0.6" />
      <circle cx="112" cy="118" r="2.5" fill={color} opacity="0.6" />

      {/* Architecture bracket — top */}
      <path d="M78 45 L78 42 L122 42 L122 45" stroke={color} strokeWidth="1" opacity="0.45" fill="none" />
      {/* Architecture bracket — bottom */}
      <path d="M78 107 L78 110 L122 110 L122 107" stroke={color} strokeWidth="1" opacity="0.45" fill="none" />
    </svg>
  );
}

function ComputerVisionIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      <defs>
        <radialGradient id="cv-lens-glow" cx="50%" cy="45%" r="28%">
          <stop offset="0%" stopColor={color} stopOpacity="0.38" />
          <stop offset="60%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cv-scan-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Pixel grid background */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`pg${i}`}>
          <line x1={30 + i * 12} y1="15" x2={30 + i * 12} y2="150" stroke={color} strokeWidth="0.4" opacity="0.15" />
          <line x1="25" y1={18 + i * 11} x2="175" y2={18 + i * 11} stroke={color} strokeWidth="0.4" opacity="0.15" />
        </g>
      ))}

      {/* Central camera lens / digital eye */}
      <circle cx="100" cy="68" r="32" fill="url(#cv-lens-glow)" />
      {/* Outer lens ring */}
      <circle cx="100" cy="68" r="30" stroke={color} strokeWidth="2.5" opacity="0.7" fill="none" />
      {/* Lens aperture blades — 6 segments */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const ix = 100 + Math.cos(rad) * 14;
        const iy = 68 + Math.sin(rad) * 14;
        const ox = 100 + Math.cos(rad) * 28;
        const oy = 68 + Math.sin(rad) * 28;
        const nextRad = ((angle + 60) * Math.PI) / 180;
        const nx = 100 + Math.cos(nextRad) * 20;
        const ny = 68 + Math.sin(nextRad) * 20;
        return (
          <path key={`ap${i}`}
            d={`M${ix} ${iy} L${ox} ${oy} L${nx} ${ny}`}
            stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
        );
      })}
      {/* Inner lens circle */}
      <circle cx="100" cy="68" r="18" stroke={color} strokeWidth="1.5" opacity="0.6" fill="none" />
      {/* Iris */}
      <circle cx="100" cy="68" r="10" stroke={color} strokeWidth="1.2" opacity="0.75" fill="none" />
      {/* Pupil — bright center */}
      <circle cx="100" cy="68" r="6" fill={color} opacity="0.25" />
      <circle cx="100" cy="68" r="3" fill={color} opacity="0.9" />
      {/* Lens highlight */}
      <circle cx="94" cy="62" r="3" fill={color} opacity="0.3" />

      {/* Scanning crosshair over lens */}
      <line x1="100" y1="32" x2="100" y2="54" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <line x1="100" y1="82" x2="100" y2="104" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <line x1="64" y1="68" x2="82" y2="68" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <line x1="118" y1="68" x2="136" y2="68" stroke={color} strokeWidth="1.2" opacity="0.65" />
      {/* Crosshair tick marks */}
      <line x1="97" y1="55" x2="103" y2="55" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="97" y1="81" x2="103" y2="81" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="83" y1="65" x2="83" y2="71" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="117" y1="65" x2="117" y2="71" stroke={color} strokeWidth="1" opacity="0.5" />

      {/* Horizontal scan line effect */}
      <line x1="25" y1="68" x2="175" y2="68" stroke="url(#cv-scan-line)" strokeWidth="1.5" />

      {/* DETECTION BOX 1 — top-left: "person" silhouette */}
      <g opacity="0.85">
        {/* Tracking bracket corners */}
        <path d="M17 20 L17 16 L22 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M52 20 L52 16 L47 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M17 56 L17 60 L22 60" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M52 56 L52 60 L47 60" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Simple person icon inside */}
        <circle cx="34" cy="30" r="4" stroke={color} strokeWidth="1.2" opacity="0.8" fill="none" />
        <path d="M27 52 L27 44 Q27 38 34 38 Q41 38 41 44 L41 52" stroke={color} strokeWidth="1.2" opacity="0.75" fill="none" />
        {/* Confidence label */}
        <rect x="19" y="62" width="22" height="7" rx="1.5" fill={color} opacity="0.25" />
        <text x="30" y="67.5" textAnchor="middle" fill={color} opacity="0.9" fontSize="4.5" fontFamily="monospace">96%</text>
      </g>

      {/* DETECTION BOX 2 — right side: "vehicle" */}
      <g opacity="0.75">
        <path d="M148 28 L148 24 L153 24" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M190 28 L190 24 L185 24" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M148 62 L148 66 L153 66" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M190 62 L190 66 L185 66" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Simple car icon */}
        <rect x="158" y="42" width="22" height="12" rx="3" stroke={color} strokeWidth="1.2" opacity="0.75" fill="none" />
        <path d="M160 42 L163 35 L177 35 L180 42" stroke={color} strokeWidth="1" opacity="0.7" fill="none" />
        <circle cx="163" cy="56" r="2.5" stroke={color} strokeWidth="1" opacity="0.65" fill="none" />
        <circle cx="177" cy="56" r="2.5" stroke={color} strokeWidth="1" opacity="0.65" fill="none" />
        {/* Confidence label */}
        <rect x="149" y="68" width="22" height="7" rx="1.5" fill={color} opacity="0.22" />
        <text x="160" y="73.5" textAnchor="middle" fill={color} opacity="0.85" fontSize="4.5" fontFamily="monospace">89%</text>
      </g>

      {/* DETECTION BOX 3 — bottom-left: small object */}
      <g opacity="0.65">
        <path d="M28 105 L28 101 L32 101" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M60 105 L60 101 L56 101" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M28 128 L28 132 L32 132" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M60 128 L60 132 L56 132" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        {/* Package/box icon */}
        <rect x="38" y="109" width="12" height="12" rx="1" stroke={color} strokeWidth="1" opacity="0.7" fill="none" />
        <line x1="38" y1="115" x2="50" y2="115" stroke={color} strokeWidth="0.8" opacity="0.6" />
        <line x1="44" y1="109" x2="44" y2="115" stroke={color} strokeWidth="0.8" opacity="0.6" />
      </g>

      {/* DETECTION BOX 4 — bottom-right: tracking target */}
      <g opacity="0.55">
        <path d="M140 108 L140 104 L144 104" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M180 108 L180 104 L176 104" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M140 138 L140 142 L144 142" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M180 138 L180 142 L176 142" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        {/* Motion tracking arrows */}
        <path d="M155 120 L165 120" stroke={color} strokeWidth="1.2" opacity="0.7" />
        <path d="M163 118 L165 120 L163 122" stroke={color} strokeWidth="1" opacity="0.7" fill="none" />
        <path d="M160 115 L160 128" stroke={color} strokeWidth="0.8" opacity="0.45" strokeDasharray="2 2" />
      </g>

      {/* Dashed analysis lines from lens to detection boxes */}
      <line x1="76" y1="55" x2="45" y2="38" stroke={color} strokeWidth="0.8" opacity="0.35" strokeDasharray="2.5 2.5" />
      <line x1="124" y1="55" x2="160" y2="38" stroke={color} strokeWidth="0.8" opacity="0.35" strokeDasharray="2.5 2.5" />
      <line x1="82" y1="90" x2="50" y2="112" stroke={color} strokeWidth="0.8" opacity="0.28" strokeDasharray="2.5 2.5" />
      <line x1="118" y1="90" x2="155" y2="115" stroke={color} strokeWidth="0.8" opacity="0.28" strokeDasharray="2.5 2.5" />

      {/* UI status indicators — bottom bar */}
      <rect x="65" y="142" width="70" height="8" rx="2" stroke={color} strokeWidth="0.8" opacity="0.45" fill="none" />
      <rect x="67" y="144" width="32" height="4" rx="1" fill={color} opacity="0.35" />
      <text x="105" y="148" fill={color} opacity="0.6" fontSize="4" fontFamily="monospace">4 OBJECTS</text>

      {/* Frame counter top-right */}
      <text x="175" y="14" textAnchor="end" fill={color} opacity="0.55" fontSize="4.5" fontFamily="monospace">60 FPS</text>
      {/* Recording dot */}
      <circle cx="180" cy="12" r="2.5" fill={color} opacity="0.85" />
    </svg>
  );
}

const illustrationMap: Record<string, React.FC<{ color: string }>> = {
  'nlp': NLPIllustration,
  'predictive': PredictiveIllustration,
  'ai-solutions': AISolutionsIllustration,
  'computer-vision': ComputerVisionIllustration,
};

// =========================================================================
//                        HOLOGRAPHIC SERVICE CARD
// =========================================================================

function HolographicServiceCard({
  service,
  index,
  isInView,
  onSelect,
}: {
  service: ServiceDetail;
  index: number;
  isInView: boolean;
  onSelect: (s: ServiceDetail) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / 14);
    const rotateY = (x - centerX) / 14;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(320px circle at ${x}px ${y}px, ${service.color}22, transparent 60%)`;
      glowRef.current.style.opacity = '1';
    }
    if (shimmerRef.current) {
      const bgX = (x / rect.width) * 100;
      const bgY = (y / rect.height) * 100;
      shimmerRef.current.style.background = `
        radial-gradient(400px circle at ${bgX}% ${bgY}%, ${service.color}12, transparent 50%),
        linear-gradient(${135 + rotateY * 3}deg, transparent 20%, ${service.color}08 35%, rgba(184,41,247,0.04) 50%, rgba(255,45,149,0.03) 65%, transparent 80%)
      `;
      shimmerRef.current.style.opacity = '1';
    }
  }, [service.color]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    if (glowRef.current) glowRef.current.style.opacity = '0';
    if (shimmerRef.current) shimmerRef.current.style.opacity = '0';
  }, []);

  const Illustration = illustrationMap[service.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl cursor-pointer overflow-hidden group"
        style={{
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(service)}
      >
        {/* Card base */}
        <div
          className="relative rounded-2xl h-full flex flex-col transition-all duration-500"
          style={{
            background: 'linear-gradient(160deg, #0f1628 0%, #0a1020 100%)',
            border: `1px solid rgba(255,255,255,0.10)`,
            boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${service.color}50`;
            e.currentTarget.style.boxShadow = `0 0 40px ${service.color}18, 0 8px 32px rgba(0,0,0,0.5)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-[2px] w-full flex-shrink-0 rounded-t-2xl"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${service.color}50 30%, ${service.color} 50%, ${service.color}50 70%, transparent 100%)`,
            }}
          />

          {/* Vector illustration area */}
          <div className="relative px-4 pt-5 pb-2 flex items-center justify-center h-[170px] overflow-hidden">
            {/* Subtle radial background for illustration */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, ${service.color}08, transparent 70%)`,
              }}
            />
            {Illustration && <Illustration color={service.color} />}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 flex flex-col flex-1">
            {/* Service tag */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${service.color}20, ${service.color}08)`,
                  border: `1px solid ${service.color}30`,
                }}
              >
                {(() => { const Icon = service.icon; return <Icon className="w-3.5 h-3.5" style={{ color: service.color }} />; })()}
              </div>
              <span
                className="font-['Rajdhani',sans-serif] text-[10px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: `${service.color}aa` }}
              >
                {service.id.replace('-', ' ')}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-['Chakra_Petch',sans-serif] text-lg text-white mb-2 leading-tight transition-colors duration-300 group-hover:text-white">
              {service.title}
            </h3>

            {/* Tagline */}
            <p className="text-[rgba(255,255,255,0.5)] text-sm leading-relaxed flex-1 mb-5">
              {service.tagline}
            </p>

            {/* Learn More */}
            <div className="flex items-center gap-2 text-sm font-medium transition-all" style={{ color: service.color }}>
              <span className="font-['Chakra_Petch',sans-serif] tracking-wide text-xs uppercase">Learn More</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Holographic shimmer overlay */}
        <div
          ref={shimmerRef}
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{ opacity: 0, transition: 'opacity 0.4s ease' }}
        />

        {/* Cursor glow overlay */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-2xl pointer-events-none z-20"
          style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
        />

        {/* Edge highlight on hover */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 0 1px ${service.color}15, inset 0 1px 0 0 ${service.color}20`,
          }}
        />
      </div>
    </motion.div>
  );
}

// =========================================================================
//                            SERVICE MODAL
// =========================================================================

function ServiceModal({
  service,
  onClose,
}: {
  service: ServiceDetail;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#070A12]/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0C1120] border border-[rgba(255,255,255,0.1)] shadow-2xl"
        style={{ boxShadow: `0 0 80px ${service.color}20, 0 25px 60px rgba(0,0,0,0.6)` }}
      >
        <div
          className="relative px-8 pt-8 pb-6 border-b border-[rgba(255,255,255,0.07)]"
          style={{ background: `linear-gradient(135deg, ${service.color}10, transparent)` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${service.color}25, ${service.color}10)`,
                  border: `1px solid ${service.color}40`,
                }}
              >
                {(() => { const Icon = service.icon; return <Icon className="w-7 h-7" style={{ color: service.color }} />; })()}
              </div>
              <div>
                <p
                  className="font-['Rajdhani',sans-serif] text-xs tracking-[0.3em] uppercase mb-1"
                  style={{ color: service.color }}
                >
                  {' '}
                </p>
                <h2 className="font-['Orbitron',sans-serif] text-2xl font-bold text-white">
                  {service.modal.headline}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-5 text-[rgba(255,255,255,0.7)] leading-relaxed">
            {service.modal.intro}
          </p>
        </div>

        <div className="px-8 py-6">
          <h3
            className="font-['Orbitron',sans-serif] text-sm tracking-wider uppercase mb-5"
            style={{ color: service.color }}
          >
            Core Capabilities
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {service.modal.capabilities.map((cap) => (
              <div
                key={cap.title}
                className="p-5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)] transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    background: `${service.color}15`,
                    border: `1px solid ${service.color}30`,
                  }}
                >
                  {(() => { const CapIcon = cap.icon; return <CapIcon className="w-4 h-4" style={{ color: service.color }} />; })()}
                </div>
                <h4 className="font-['Chakra_Petch',sans-serif] text-sm text-white mb-2">
                  {cap.title}
                </h4>
                <p className="text-xs text-[rgba(255,255,255,0.55)] leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8">
          <h3
            className="font-['Orbitron',sans-serif] text-sm tracking-wider uppercase mb-4"
            style={{ color: service.color }}
          >
            Key Outcomes
          </h3>
          <div className="space-y-3">
            {service.modal.outcomes.map((outcome) => (
              <div key={outcome} className="flex items-start gap-3">
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${service.color}20` }}
                >
                  <Check className="w-3 h-3" style={{ color: service.color }} />
                </span>
                <p className="text-sm text-[rgba(255,255,255,0.7)]">{outcome}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row gap-3">
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-['Orbitron',sans-serif] text-xs tracking-wider uppercase"
              style={{
                background: `linear-gradient(135deg, ${service.color}, ${service.color}99)`,
              }}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.6)] hover:text-white hover:border-[rgba(255,255,255,0.2)] font-['Rajdhani',sans-serif] text-sm tracking-wider uppercase transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// =========================================================================
//                           MAIN SECTION
// =========================================================================

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeService, setActiveService] = useState<ServiceDetail | null>(null);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[rgba(75,146,255,0.03)] rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[rgba(59,240,255,0.03)] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <SectionBadge label="What We Do" color="#3BF0FF" icon={Sparkles} />

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Our AI
            <span className="block bg-gradient-to-r from-[#3BF0FF] via-[#4B92FF] to-[#B829F7] bg-clip-text text-transparent">
              Services
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[rgba(255,255,255,0.65)] max-w-2xl mx-auto"
          >
            Enterprise-grade AI capabilities designed to transform how your business operates,
            competes and grows. Select a service to learn more.
          </motion.p>
        </div>

        {/* Holographic service cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <HolographicServiceCard
              key={service.id}
              service={service}
              index={index}
              isInView={isInView}
              onSelect={setActiveService}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[rgba(59,240,255,0.15)] to-[rgba(75,146,255,0.1)] border border-[rgba(59,240,255,0.3)] text-white font-['Orbitron',sans-serif] text-sm tracking-wider uppercase hover:border-[rgba(59,240,255,0.5)] transition-all group"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeService && (
          <ServiceModal
            service={activeService}
            onClose={() => setActiveService(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
