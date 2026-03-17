
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, useInView } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import SectionBadge from '@/components/SectionBadge';
import { cn } from "@/lib/utils";


interface FallState {
  active: boolean;
  velocityX: number;
  velocityY: number;
  rotation: number;
}

interface DebrisData {
  id: number;
  x: number;
  y: number;
  rot: number;
  delay: number;
  path: string;
}

interface TestimonialData {
  quote: string;
  name: string;
  role: string;
  company: string;
  highlight?: string;
}

// =========================================================================
//                              CONSTANTS & CONFIG
// =========================================================================

const PHYSICS = {
  MAX_RANGE: 45,
  DAMAGE_INCREMENT: 0.08,
  RECOVERY_RATE: 0.05,
  RESPAWN_TIME_MS: 7000,
  DEBRIS_DISAPPEAR_MS: 3000,
  HEALING_DURATION_MS: 10000,
} as const;

const CHUNK_PATHS = [
  "M 0 0 L 20 5 L 15 25 L 5 20 Z",
  "M 5 0 L 25 10 L 15 30 L 0 25 Z",
  "M 10 5 L 30 0 L 25 25 L 5 30 Z",
  "M 0 10 L 20 0 L 30 20 L 10 30 Z",
];

const DEBRIS_THRESHOLDS = [0.3, 0.5, 0.7, 0.9];


const useBreakableCard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [crackLevel, setCrackLevel] = useState(0);
  const [isBroken, setIsBroken] = useState(false);
  const [fallState, setFallState] = useState<FallState>({ active: false, velocityX: 0, velocityY: 0, rotation: 0 });
  const [debrisChunks, setDebrisChunks] = useState<DebrisData[]>([]);
  const [respawnProgress, setRespawnProgress] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  const lastPos = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const shakeIntensity = useRef(0);
  const velocityRef = useRef({ x: 0, y: 0 });
  const crackLevelRef = useRef(0);
  const isBrokenRef = useRef(false);

  const triggerBreak = useCallback(() => {
    if (isBrokenRef.current) return;
    isBrokenRef.current = true;
    setIsBroken(true);
    setIsDragging(false);
    const vx = velocityRef.current.x;
    setFallState({
      active: true,
      velocityX: vx * 0.3,
      velocityY: 5,
      rotation: Math.max(-60, Math.min(60, vx)),
    });
  }, []);

  const spawnDebris = useCallback((level: number) => {
    const newChunks: DebrisData[] = [];
    DEBRIS_THRESHOLDS.forEach((threshold, i) => {
      if (level >= threshold && debrisChunks.length <= i) {
        newChunks.push({
          id: Date.now() + i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          rot: Math.random() * 360,
          delay: 0,
          path: CHUNK_PATHS[Math.floor(Math.random() * CHUNK_PATHS.length)],
        });
      }
    });
    if (newChunks.length > 0) setDebrisChunks(prev => [...prev, ...newChunks]);
  }, [debrisChunks.length]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isBrokenRef.current) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    startPos.current = { x: clientX - position.x, y: clientY - position.y };
    lastPos.current = { x: clientX, y: clientY };
    lastTime.current = Date.now();
    shakeIntensity.current = 0;
  }, [position.x, position.y]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || isBrokenRef.current) return;
    const now = Date.now();
    const dt = Math.max(1, now - lastTime.current);
    const vx = (clientX - lastPos.current.x) / dt;
    const vy = (clientY - lastPos.current.y) / dt;
    velocityRef.current = { x: vx * 100, y: vy * 100 };

    const newX = clientX - startPos.current.x;
    const newY = clientY - startPos.current.y;
    const clampedX = Math.max(-PHYSICS.MAX_RANGE, Math.min(PHYSICS.MAX_RANGE, newX));
    const clampedY = Math.max(-PHYSICS.MAX_RANGE, Math.min(PHYSICS.MAX_RANGE, newY));
    setPosition({ x: clampedX, y: clampedY });

    const isHorizontalImpact = ((clampedX >= PHYSICS.MAX_RANGE && vx > 0) || (clampedX <= -PHYSICS.MAX_RANGE && vx < 0)) && Math.abs(vx) > 0.5;
    const isVerticalImpact = ((clampedY >= PHYSICS.MAX_RANGE && vy > 0) || (clampedY <= -PHYSICS.MAX_RANGE && vy < 0)) && Math.abs(vy) > 0.5;

    if (isHorizontalImpact) {
      shakeIntensity.current += PHYSICS.DAMAGE_INCREMENT * 1.5;
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);
    } else if (isVerticalImpact) {
      shakeIntensity.current += PHYSICS.DAMAGE_INCREMENT * 0.5;
    } else {
      shakeIntensity.current = Math.max(0, shakeIntensity.current - PHYSICS.RECOVERY_RATE);
    }

    setCrackLevel(prev => {
      const newLevel = Math.min(1, prev + shakeIntensity.current * 0.025);
      crackLevelRef.current = newLevel;
      spawnDebris(newLevel);
      if (newLevel >= 1) setTimeout(() => triggerBreak(), 0);
      return newLevel;
    });

    lastPos.current = { x: clientX, y: clientY };
    lastTime.current = now;
  }, [isDragging, spawnDebris, triggerBreak]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    shakeIntensity.current = 0;
  }, [isDragging]);

  // Healing
  useEffect(() => {
    if (!isDragging && !isBroken && crackLevel > 0) {
      const interval = setInterval(() => {
        setCrackLevel(prev => {
          const newLevel = Math.max(0, prev - 50 / PHYSICS.HEALING_DURATION_MS);
          crackLevelRef.current = newLevel;
          if (newLevel <= 0) setDebrisChunks([]);
          return newLevel;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isDragging, isBroken, crackLevel]);

  // Respawn
  useEffect(() => {
    if (!isBroken) return;
    setRespawnProgress(0);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setRespawnProgress(Math.min(100, (elapsed / PHYSICS.RESPAWN_TIME_MS) * 100));
      if (elapsed >= PHYSICS.RESPAWN_TIME_MS) {
        clearInterval(interval);
        setIsBroken(false);
        isBrokenRef.current = false;
        setCrackLevel(0);
        crackLevelRef.current = 0;
        setPosition({ x: 0, y: 0 });
        setDebrisChunks([]);
        setFallState({ active: false, velocityX: 0, velocityY: 0, rotation: 0 });
        shakeIntensity.current = 0;
        velocityRef.current = { x: 0, y: 0 };
        setRespawnProgress(0);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isBroken]);

  // Global drag listeners
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      handleDragMove(clientX, clientY);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", handleDragEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return { isDragging, position, crackLevel, isBroken, fallState, debrisChunks, handleDragStart, respawnProgress, isFlashing };
};


const DebrisChunk = ({ x, y, rot, path }: { x: number; y: number; rot: number; path: string }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), PHYSICS.DEBRIS_DISAPPEAR_MS);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <svg
      className="absolute w-8 h-8 pointer-events-none z-30 overflow-visible"
      style={{
        left: `${x}%`, top: `${y}%`,
        transform: `rotate(${rot}deg)`,
        animation: `testimonial-debris-fall 0.8s cubic-bezier(0.55, 0, 1, 0.45) forwards`,
      }}
    >
      <path d={path} fill="rgba(59,240,255,0.5)" stroke="#3BF0FF" strokeWidth="1.5" />
    </svg>
  );
};

const CrackLines = ({ level }: { level: number }) => {
  if (level < 0.1) return null;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
      {level >= 0.1 && (
        <path d="M0 20 L15 25 L8 40 L20 50" fill="none" stroke="#3BF0FF" strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: Math.min(1, level * 2), filter: 'drop-shadow(0 0 4px #3BF0FF)' }} />
      )}
      {level >= 0.5 && (
        <path d="M50 100 L55 80 L45 70 L60 55" fill="none" stroke="#3BF0FF" strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: Math.min(1, (level - 0.4) * 2), filter: 'drop-shadow(0 0 4px #3BF0FF)' }} />
      )}
      {level >= 0.9 && (
        <path d="M20 0 L25 20 L40 25 L35 45 L50 50" fill="none" stroke="#3BF0FF" strokeWidth="3"
          vectorEffect="non-scaling-stroke" strokeDasharray="4 2"
          style={{ filter: 'drop-shadow(0 0 6px #3BF0FF)' }} />
      )}
    </svg>
  );
};

// =========================================================================
//  ACCENT COLORS PER CARD — gives each card a unique identity
// =========================================================================

const CARD_ACCENTS = [
  { primary: '#3BF0FF', secondary: '#4B92FF', label: 'Customer Experience' },
  { primary: '#A78BFA', secondary: '#7C3AED', label: 'Research & Policy' },
  { primary: '#34D399', secondary: '#059669', label: 'Risk & Security' },
  { primary: '#FB923C', secondary: '#EA580C', label: 'Operational Efficiency' },
];

// =========================================================================
//                         TESTIMONIAL BREAKABLE CARD
// =========================================================================

const TestimonialCard = ({ data, index }: { data: TestimonialData; index: number }) => {
  const { isDragging, position, crackLevel, isBroken, fallState, debrisChunks, handleDragStart, respawnProgress, isFlashing } = useBreakableCard();

  const cardId = useMemo(() => `tcard-${Math.random().toString(36).substr(2, 9)}`, []);
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  const fallTransform = useMemo(() => {
    if (!fallState.active) return '';
    const drift = fallState.velocityX * 5;
    const rot = fallState.rotation + (fallState.velocityX > 0 ? 45 : -45);
    return `translate(${drift}px, 120vh) rotate(${rot}deg)`;
  }, [fallState]);

  const cardTransform = isBroken
    ? fallTransform
    : `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.15}deg)`;

  const cardTransition = isDragging
    ? 'none'
    : isBroken
      ? 'transform 1.0s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 1.0s ease-out'
      : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';

  return (
    <div className="relative w-full h-full">
      {/* Layer 1: Ghost remnant */}
      <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-[rgba(59,240,255,0.12)] bg-[rgba(7,10,18,0.4)] flex flex-col items-center justify-center z-0">
        <span className="font-['Chakra_Petch',sans-serif] text-[rgba(59,240,255,0.3)] text-xs uppercase tracking-widest mb-3">
          Rebuilding...
        </span>
        {isBroken && (
          <div className="w-20 h-1.5 rounded-full border border-[rgba(59,240,255,0.2)] bg-[rgba(7,10,18,0.8)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${respawnProgress}%`,
                background: `linear-gradient(90deg, ${accent.primary}, ${accent.secondary})`,
              }}
            />
          </div>
        )}
      </div>

      {/* Layer 2: Debris */}
      <div
        className="pointer-events-none absolute inset-0 z-50 overflow-visible"
        style={{ transform: cardTransform }}
      >
        {debrisChunks.map((chunk: DebrisData) => (
          <DebrisChunk key={chunk.id} x={chunk.x} y={chunk.y} rot={chunk.rot} path={chunk.path} />
        ))}
      </div>

      {/* Layer 3: Interactive card */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className={cn(
          "relative z-10 rounded-2xl border cursor-grab active:cursor-grabbing select-none h-full flex flex-col overflow-hidden backdrop-blur-sm",
          isBroken && "pointer-events-none",
          isFlashing
            ? "border-[rgba(59,240,255,0.55)]"
            : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]"
        )}
        style={{
          transform: cardTransform,
          transition: cardTransition,
          opacity: isBroken ? 0 : 1,
          background: isFlashing
            ? 'rgba(59,240,255,0.05)'
            : 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          boxShadow: crackLevel > 0.3
            ? `0 0 ${Math.round(crackLevel * 28)}px rgba(59,240,255,${(crackLevel * 0.28).toFixed(2)}), inset 0 0 ${Math.round(crackLevel * 16)}px rgba(59,240,255,0.04)`
            : '0 2px 24px rgba(0,0,0,0.2)',
          maskImage: debrisChunks.length > 0 ? `url(#mask-${cardId})` : 'none',
          WebkitMaskImage: debrisChunks.length > 0 ? `url(#mask-${cardId})` : 'none',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full flex-shrink-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent.primary}40 20%, ${accent.primary} 50%, ${accent.primary}40 80%, transparent 100%)`,
          }}
        />

        <div className="p-7 flex flex-col justify-between flex-1">
          {/* Top: Category label + quote icon */}
          <div>
            <div className="flex justify-between items-start mb-5">
              <span
                className="font-['Chakra_Petch',sans-serif] text-[11px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-md"
                style={{
                  color: accent.primary,
                  background: `${accent.primary}10`,
                  border: `1px solid ${accent.primary}20`,
                }}
              >
                {accent.label}
              </span>

              {/* Verified badge instead of quote icon */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12l2 2 4-4"
                    stroke={accent.primary}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12" cy="12" r="10"
                    stroke={accent.primary}
                    strokeWidth="1.5"
                    opacity="0.4"
                  />
                </svg>
                <span
                  className="font-['Chakra_Petch',sans-serif] text-[10px] uppercase tracking-widest"
                  style={{ color: `${accent.primary}90` }}
                >
                  Verified
                </span>
              </div>
            </div>

            {/* Large opening quote mark */}
            <div className="mb-3" style={{ color: `${accent.primary}25` }}>
              <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                <path d="M0 24V14.4C0 9.87 0.88 6.36 2.64 3.84C4.48 1.28 7.36 0 11.28 0L12.48 4.08C10.24 4.48 8.56 5.44 7.44 6.96C6.32 8.48 5.76 10.32 5.76 12.48H12V24H0ZM20 24V14.4C20 9.87 20.88 6.36 22.64 3.84C24.48 1.28 27.36 0 31.28 0L32.48 4.08C30.24 4.48 28.56 5.44 27.44 6.96C26.32 8.48 25.76 10.32 25.76 12.48H32V24H20Z" />
              </svg>
            </div>

            {/* Quote text */}
            <p className="font-['Inter',sans-serif] text-[rgba(255,255,255,0.78)] leading-[1.75] text-[15px]">
              {data.quote}
            </p>

            {/* Highlighted result if present */}
            {data.highlight && (
              <div
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: `${accent.primary}08`,
                  border: `1px solid ${accent.primary}18`,
                }}
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                  stroke={accent.primary} strokeWidth="2" strokeLinecap="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                <span
                  className="font-['Chakra_Petch',sans-serif] text-[12px] font-medium tracking-wide"
                  style={{ color: accent.primary }}
                >
                  {data.highlight}
                </span>
              </div>
            )}
          </div>

          {/* Bottom: Author info — clean horizontal layout */}
          <div className="mt-6 pt-5 flex items-center gap-0" style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
            {/* Vertical accent bar */}
            <div
              className="w-[3px] h-9 rounded-full mr-3.5 flex-shrink-0"
              style={{
                background: `linear-gradient(180deg, ${accent.primary}, ${accent.secondary}60)`,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-['Chakra_Petch',sans-serif] text-white text-sm font-semibold leading-tight tracking-wide">
                {data.name}
              </div>
              <div className="text-[13px] text-[rgba(255,255,255,0.4)] mt-0.5">
                 {data.company}
              </div>
            </div>

           {/* Damage indicator */}
<div className="text-right flex-shrink-0 ml-3">
  <div
    className={cn(
      "font-['Rajdhani',sans-serif] text-xs font-semibold uppercase tracking-[0.15em]",
      "transition-colors duration-300",
      crackLevel > 0.7
        ? "text-red-400 drop-shadow-[0_0_6px_rgba(255,80,80,0.7)]"
        : crackLevel > 0.3
        ? "text-yellow-300"
        : "text-emerald-400"
    )}
  >
    {crackLevel > 0
      ? `Damage ${Math.round(crackLevel * 100)}%`
      : "Intact"}
  </div>
</div>
          </div>
        </div>

        {/* Overlays */}
        <CrackLines level={crackLevel} />
        {crackLevel > 0.2 && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ background: `rgba(59,240,255,${(crackLevel * 0.05).toFixed(3)})` }}
          />
        )}
      </div>

      {/* SVG mask defs */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <mask id={`mask-${cardId}`} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="white" />
            {debrisChunks.map((chunk: DebrisData) => (
              <g key={`hole-${chunk.id}`} transform={`translate(${chunk.x / 100}, ${chunk.y / 100}) rotate(${chunk.rot}) scale(0.003)`}>
                <path d={chunk.path} fill="black" />
              </g>
            ))}
          </mask>
        </defs>
      </svg>
    </div>
  );
};


const testimonials: TestimonialData[] = [
  {
    quote: "We wanted to improve our customer support, and Gspec's chatbot solution made it happen. Now, we resolve customer queries faster and more efficiently than ever before.",
    name: "CEO",
    role: "Chief Executive Officer",
    company: "Anahana.com",
    highlight: "Faster query resolution",
  },
  {
    quote: "GSPEC has been an outstanding research partner in our work on AI adoption in governance. Their analytical depth and domain expertise significantly strengthened our policy frameworks, helping us produce actionable insights that resonate with decision-makers across Pakistan and beyond.",
    name: "Research Team",
    role: "Policy & Research Division",
    company: "The Meridian Council",
    highlight: "Actionable policy insights",
  },
  {
    quote: "Gspec's fraud detection system has been a game-changer. It helped us reduce fraud by 40%, saving us both time and money while keeping our customers safe.",
    name: "Head of Risk Management",
    role: "Risk Management",
    company: "NCCIA",
    highlight: "40% fraud reduction",
  },
  {
    quote: "Gspec Technologies helped us streamline our operations with AI-powered automation. What used to take days now happens in minutes — our efficiency has skyrocketed!",
    name: "CTO",
    role: "Chief Technology Officer",
    company: "DST Engineers",
    highlight: "Days reduced to minutes",
  },
];

// =========================================================================
//                              MAIN SECTION
// =========================================================================

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} id="testimonials" className="relative py-32 overflow-hidden">
      {/* Keyframe for debris animation */}
      <style>{`
        @keyframes testimonial-debris-fall {
          0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(30px, 70px) rotate(200deg) scale(0.2); opacity: 0; }
        }
      `}</style>

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[rgba(59,240,255,0.03)] rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[rgba(75,146,255,0.02)] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[300px] bg-[rgba(184,41,247,0.02)] rounded-full blur-[100px] -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-2">
          <SectionBadge label="Client Results" color="#FFC107" icon={MessageSquare} />

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Orbitron',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Trusted by
            <span className="block bg-gradient-to-r from-[#FFC107] to-[#FF9800] bg-clip-text text-transparent mb-16">
              Industry Leaders
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
className="mt-4 text-sm md:text-base text-yellow-400 font-semibold font-['Chakra_Petch',sans-serif] uppercase tracking-[0.3em] text-center animate-pulse"          >
            Shake cards to break them free 
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="min-h-[280px]"
            >
              <TestimonialCard data={testimonial} index={index} />
            </motion.div>
          ))}
        </div>

       
      </div>
    </section>
  );
}