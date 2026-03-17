'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionBadge from '@/components/SectionBadge';
import Robot from '@/components/Robot';
import { Component as JourneyGlobe } from '@/components/ui/ai-loader';

/* ─────────────────────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────────────────────── */

type Milestone = {
  year: string;
  phase: string;
  title: string;
  description: string;
  accent: string;
};

const MILESTONES: Milestone[] = [
  {
    year: '2017',
    phase: '01',
    title: 'The Beginning',
    description:
      'Observed that powerful technologies were often difficult for businesses to adopt effectively.',
    accent: '#3BF0FF',
  },
  {
    year: '2020',
    phase: '02',
    title: 'Foundation',
    description:
      'Gspec Technologies was founded with a vision to create collaborative software development partnerships.',
    accent: '#4B92FF',
  },
  {
    year: '2021',
    phase: '03',
    title: 'Building Excellence',
    description:
      'Focused on building strong engineering processes, infrastructure and CI/CD systems.',
    accent: '#7B5EFF',
  },
  {
    year: '2022',
    phase: '04',
    title: 'AI Innovation',
    description:
      'Launched our first AI-driven projects in NLP and predictive analytics.',
    accent: '#B829F7',
  },
  {
    year: '2023',
    phase: '05',
    title: 'Global Expansion',
    description:
      'Expanded to global clients and developed advanced data science and computer vision capabilities.',
    accent: '#F729A8',
  },
  {
    year: 'Future',
    phase: '06',
    title: 'Vision Ahead',
    description:
      'Aim to remain at the forefront of AI and cloud innovation while helping businesses worldwide adopt intelligent automation.',
    accent: '#3BF0FF',
  },
];

const N = MILESTONES.length;

/* ─────────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────────── */

const ANIM_DURATION = 0.55;
const NODE_SIZE = 44;
const NODE_SIZE_ACTIVE = 52;

/* ─────────────────────────────────────────────────────────────────────────────
   Orbital math — active node at 12-o'clock
───────────────────────────────────────────────────────────────────────────── */

function nodePosition(
  index: number,
  total: number,
  radius: number,
  activeIndex: number,
) {
  const baseAngle = (index / total) * 360;
  const activeAngle = (activeIndex / total) * 360;
  const angle = baseAngle - activeAngle - 90; // -90 = top
  const rad = (angle * Math.PI) / 180;
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad),
    angleDeg: angle,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   useOrbitRadius — desktop-optimised radius. The orbit is always rendered at
   this natural size; a CSS scale transform (useOrbitScale) then shrinks the
   whole stage to fit any viewport without any clipping or overflow.
───────────────────────────────────────────────────────────────────────────── */

function useOrbitRadius() {
  const [radius, setRadius] = useState(260);
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      if (vw < 768)       setRadius(220);
      else if (vw < 1024) setRadius(240);
      else if (vw < 1280) setRadius(260);
      else                 setRadius(280);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return radius;
}

/* ─────────────────────────────────────────────────────────────────────────────
   useOrbitScale — scales the whole orbit stage (ring + nodes + robot) so it
   always fits the available space without clipping. Returns { scale, margin }
   where margin (px, can be negative) collapses the layout box to match the
   visual size.
───────────────────────────────────────────────────────────────────────────── */

function useOrbitScale(orbitContainerSize: number) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      let available: number;
      if (vw >= 1024) {
        // Desktop: orbit sits beside the card (400px) with gap + padding
        available = Math.max(300, vw * 0.52 - 48);
      } else {
        // Mobile / tablet: orbit is full-width minus padding
        available = vw - 32;
      }
      setScale(Math.min(1, available / orbitContainerSize));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [orbitContainerSize]);

  const margin = (orbitContainerSize * (scale - 1)) / 2; // negative when scale < 1
  return { scale, margin };
}

/* ─────────────────────────────────────────────────────────────────────────────
   OrbitalRing SVG — bold ring with glow + connection line to active node
───────────────────────────────────────────────────────────────────────────── */

function OrbitalRing({
  radius,
  activeIndex,
  accent,
}: {
  radius: number;
  activeIndex: number;
  accent: string;
}) {
  const padding = 70;
  const size = (radius + padding) * 2;
  const cx = size / 2;
  const cy = size / 2;
  const activePos = nodePosition(activeIndex, N, radius, activeIndex);

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
      }}
    >
      <defs>
        <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow bloom */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={accent}
        strokeWidth="8"
        opacity="0.06"
        filter="url(#ring-glow)"
      />

      {/* Main orbit ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2.5"
      />

      {/* Accent colored overlay */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        strokeWidth="2.5"
        animate={{ stroke: accent }}
        transition={{ duration: ANIM_DURATION }}
        opacity="0.3"
      />

      {/* Connection line to active node */}
      <motion.line
        x1={cx}
        y1={cy}
        animate={{
          x2: cx + activePos.x,
          y2: cy + activePos.y,
          stroke: accent,
        }}
        transition={{ duration: ANIM_DURATION, ease: [0.22, 1, 0.36, 1] }}
        strokeWidth="1.5"
        opacity="0.25"
        filter="url(#line-glow)"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   OrbitalNode
───────────────────────────────────────────────────────────────────────────── */

function OrbitalNode({
  milestone,
  index,
  activeIndex,
  radius,
  onSelect,
}: {
  milestone: Milestone;
  index: number;
  activeIndex: number;
  radius: number;
  onSelect: (i: number) => void;
}) {
  const isActive = index === activeIndex;
  const pos = nodePosition(index, N, radius, activeIndex);
  const size = isActive ? NODE_SIZE_ACTIVE : NODE_SIZE;
  const halfSize = size / 2;

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{
        left: '50%',
        top: '50%',
        width: size,
        height: size,
        zIndex: isActive ? 25 : 15,
      }}
      animate={{
        x: pos.x - halfSize,
        y: pos.y - halfSize,
        scale: isActive ? 1.15 : 1,
      }}
      transition={{ duration: ANIM_DURATION, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
    >
      {/* Active halo */}
      {isActive && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -10,
            border: `2px solid ${milestone.accent}50`,
            boxShadow: `0 0 18px ${milestone.accent}30, 0 0 40px ${milestone.accent}15`,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Node circle */}
      <div
        className="w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${milestone.accent}55, ${milestone.accent}20)`
            : 'rgba(10,14,30,0.85)',
          border: `2px solid ${isActive ? milestone.accent : 'rgba(255,255,255,0.2)'}`,
          boxShadow: isActive
            ? `0 0 20px ${milestone.accent}40, inset 0 0 10px ${milestone.accent}15`
            : '0 2px 8px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          className="font-['Orbitron',sans-serif]"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
            textShadow: isActive ? `0 0 8px ${milestone.accent}80` : 'none',
          }}
        >
          {milestone.phase}
        </span>
      </div>

      {/* Labels below node */}
      <div
        className="absolute whitespace-nowrap flex flex-col items-center pointer-events-none"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: size + 6,
        }}
      >
        <motion.span
          className="font-['Rajdhani',sans-serif] font-semibold leading-tight"
          animate={{
            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
            opacity: isActive ? 1 : 0.7,
          }}
          transition={{ duration: ANIM_DURATION }}
          style={{ fontSize: 12 }}
        >
          {milestone.title}
        </motion.span>
        <motion.span
          className="font-['Orbitron',sans-serif]"
          animate={{
            color: isActive ? milestone.accent : 'rgba(255,255,255,0.45)',
            opacity: isActive ? 1 : 0.7,
          }}
          transition={{ duration: ANIM_DURATION }}
          style={{ fontSize: 10 }}
        >
          {milestone.year}
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MilestoneCard — info card placed to the SIDE of the orbit
───────────────────────────────────────────────────────────────────────────── */

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const { accent } = milestone;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -24, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          padding: 'clamp(18px, 2.5vw, 28px)',
          background:
            'linear-gradient(160deg, rgba(10,15,32,0.96) 0%, rgba(6,9,20,0.98) 100%)',
          border: `1px solid ${accent}40`,
          boxShadow: `0 16px 48px rgba(0,0,0,0.55), 0 0 36px ${accent}10`,
        }}
      >
        {/* Left accent spine */}
        <div
          className="absolute left-0 top-[10%] bottom-[10%] w-[2.5px] rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${accent}CC, ${accent}50, transparent)`,
          }}
        />

        {/* Top glow beam */}
        <div
          className="absolute top-0 left-[6%] right-[6%] h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}BB, transparent)`,
          }}
        />

        {/* Corner TL */}
        <span className="absolute top-0 left-0 w-[20px] h-[20px]">
          <span className="absolute top-0 left-0 w-full h-[1.5px]" style={{ background: accent }} />
          <span className="absolute top-0 left-0 h-full w-[1.5px]" style={{ background: accent }} />
        </span>

        {/* Corner BR */}
        <span className="absolute bottom-0 right-0 w-[20px] h-[20px]">
          <span className="absolute bottom-0 right-0 w-full h-[1.5px]" style={{ background: accent }} />
          <span className="absolute bottom-0 right-0 h-full w-[1.5px]" style={{ background: accent }} />
        </span>

        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-['Rajdhani',sans-serif] text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase select-none"
            style={{ color: `${accent}90` }}
          >
            Phase {milestone.phase}&nbsp;/&nbsp;{String(N).padStart(2, '0')}
          </span>
          <span
            className="font-['Orbitron',sans-serif] text-xs font-bold px-2.5 py-0.5 rounded-full select-none"
            style={{
              background: `${accent}20`,
              border: `1px solid ${accent}60`,
              color: accent,
              boxShadow: `0 0 12px ${accent}25`,
            }}
          >
            {milestone.year}
          </span>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-3"
          style={{
            background: `linear-gradient(90deg, ${accent}55, ${accent}20, transparent)`,
          }}
        />

        {/* Title */}
        <h3
          className="font-['Orbitron',sans-serif] font-bold text-white leading-snug mb-2"
          style={{ fontSize: 'clamp(1.05rem, 2vw, 1.4rem)' }}
        >
          {milestone.title}
        </h3>

        {/* Description */}
        <p
          className="font-['Rajdhani',sans-serif] text-[rgba(255,255,255,0.78)] leading-relaxed"
          style={{ fontSize: 'clamp(0.84rem, 1.6vw, 1rem)' }}
        >
          {milestone.description}
        </p>

        {/* Bottom divider */}
        <div
          className="h-px mt-4"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}25, transparent)`,
          }}
        />

        {/* Corner glow */}
        <div
          className="absolute bottom-0 right-0 w-[120px] h-[120px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}0A 0%, transparent 70%)` }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PhaseDots — clickable dot indicators (01–06)
───────────────────────────────────────────────────────────────────────────── */

function PhaseDots({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      {MILESTONES.map((m, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={m.phase}
            onClick={() => onSelect(i)}
            className="relative flex items-center justify-center cursor-pointer"
            style={{ width: 32, height: 32 }}
            aria-label={`Phase ${m.phase}: ${m.title}`}
          >
            {isActive && (
              <motion.div
                layoutId="phase-ring"
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1.5px solid ${m.accent}70`,
                  boxShadow: `0 0 10px ${m.accent}25`,
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <motion.div
              className="rounded-full flex items-center justify-center"
              animate={{
                width: isActive ? 24 : 10,
                height: isActive ? 24 : 10,
                background: isActive ? `${m.accent}40` : 'rgba(255,255,255,0.15)',
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {isActive && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-['Orbitron',sans-serif] text-[8px] font-semibold"
                  style={{ color: m.accent }}
                >
                  {m.phase}
                </motion.span>
              )}
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   JourneySection — Click-only orbital UI
   Layout: orbit+robot in center, info card on the RIGHT side (desktop)
           or below (mobile). Fills side space, no wasted horizontal room.
───────────────────────────────────────────────────────────────────────────── */

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbitRadius = useOrbitRadius();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  /* ─── No-op escape hatches for Header / Footer compatibility ───────── */

  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;
    win.__journeyRelease  = () => {};
    win.__journeySuppress = () => {};
    return () => {
      delete win.__journeyRelease;
      delete win.__journeySuppress;
    };
  }, []);

  /* ─── Derived ──────────────────────────────────────────────────────── */

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const active = MILESTONES[activeIndex];
  const orbitContainerSize = (orbitRadius + 70) * 2;
  const { scale: orbitScale, margin: orbitMargin } = useOrbitScale(orbitContainerSize);


  /* ─────────────────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────────────────── */

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative bg-[#070A12]"
      style={{ minHeight: '100vh', overflow: 'hidden' }}
    >
      {/* ── Background ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[20%] rounded-full"
          style={{ width: '70vw', height: '65vh', filter: 'blur(150px)' }}
          animate={{ background: `${active.accent}0D` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: '50vw',
            height: '50vh',
            background: 'rgba(75,146,255,0.04)',
            filter: 'blur(130px)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(59,240,255,0.9) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{ top: '32%' }}
          animate={{
            background: `linear-gradient(90deg, transparent, ${active.accent}14, transparent)`,
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="relative z-10 text-center pt-8 sm:pt-12 px-4">
        <div className="flex justify-center">
          <SectionBadge label="Our Journey" color="#3BF0FF" />
        </div>
        <h2
          className="font-['Orbitron',sans-serif] font-bold text-white mt-2 sm:mt-3 leading-tight"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)' }}
        >
          Milestones That{' '}
          <span className="bg-gradient-to-r from-[#3BF0FF] to-[#4B92FF] bg-clip-text text-transparent">
            Define Us
          </span>
        </h2>
      </div>

      {/* ── Main stage: orbit LEFT/CENTER + card RIGHT ─────────────────── */}
      <div
        className="
          relative z-10 w-full max-w-[1400px] mx-auto
          flex flex-col lg:flex-row
          items-center justify-center
          gap-6 lg:gap-10 xl:gap-14
          px-4 sm:px-8 lg:px-12
          mt-8 sm:mt-10 pb-10 sm:pb-14
        "
        style={{ minHeight: 'calc(100vh - 180px)' }}
      >
        {/* ── Orbit + Robot ──────────────────────────────────────────── */}
        <div
          className="relative flex-shrink-0"
          style={{
            width: orbitContainerSize,
            height: orbitContainerSize,
            // CSS scale shrinks ring + nodes + robot proportionally so
            // nothing clips. Negative margin collapses the layout box to
            // match the visual size so the flex gap stays correct.
            transform: `scale(${orbitScale})`,
            transformOrigin: 'center center',
            margin: orbitMargin,
          }}
        >
          {/* SVG ring */}
          <OrbitalRing
            radius={orbitRadius}
            activeIndex={activeIndex}
            accent={active.accent}
          />

          {/* Robot at center — wrapper auto-sizes to whatever the Robot
               component renders (240×380 on desktop, 260×400 on mobile).
               We center with translate(-50%,-50%) so any canvas size stays
               centered, then nudge down by ROBOT_OFFSET_Y to align the
               robot's visual centroid (head-to-feet midpoint) with the
               orbit's geometric center. */}
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
            }}
          >
            {isMobile ? (
              <JourneyGlobe size={160} accent={active.accent} />
            ) : (
              <div style={{ marginTop: '35px' }}>
                <Robot size="sm" />
              </div>
            )}
          </div>

          {/* Subtle glow behind robot */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              width: orbitRadius * 0.65,
              height: orbitRadius * 0.65,
              transform: 'translate(-50%, -50%)',
              zIndex: 4,
            }}
            animate={{
              background: `radial-gradient(circle, ${active.accent}08 0%, transparent 70%)`,
            }}
            transition={{ duration: 1.2 }}
          />

          {/* Orbital nodes */}
          {MILESTONES.map((m, i) => (
            <OrbitalNode
              key={m.year}
              milestone={m}
              index={i}
              activeIndex={activeIndex}
              radius={orbitRadius}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* ── Side panel: card + dots + hint ──────────────────────────── */}
        <div className="flex flex-col items-center lg:items-start gap-6 w-full lg:w-[400px] xl:w-[440px] flex-shrink-0">
          {/* Info card */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <MilestoneCard key={activeIndex} milestone={active} />
            </AnimatePresence>
          </div>

          {/* Phase dots */}
          <PhaseDots activeIndex={activeIndex} onSelect={handleSelect} />

        </div>
      </div>
    </section>
  );
}
