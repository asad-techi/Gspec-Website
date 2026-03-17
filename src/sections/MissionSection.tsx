'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import SectionBadge from '@/components/SectionBadge';

const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

// Deterministic particles — avoids SSR/hydration mismatch
const PARTICLES = [
  { x: 8,  y: 15, size: 1.5, dur: 8.0, delay: 0.0 },
  { x: 23, y: 67, size: 1.0, dur: 10.0, delay: 1.5 },
  { x: 41, y: 32, size: 2.0, dur: 7.0, delay: 0.8 },
  { x: 55, y: 80, size: 1.2, dur: 9.0, delay: 3.0 },
  { x: 68, y: 22, size: 1.8, dur: 11.0, delay: 2.0 },
  { x: 79, y: 55, size: 1.0, dur: 8.5, delay: 0.5 },
  { x: 92, y: 38, size: 1.5, dur: 7.5, delay: 4.0 },
  { x: 14, y: 88, size: 1.0, dur: 9.5, delay: 1.0 },
  { x: 33, y: 48, size: 2.0, dur: 6.5, delay: 2.5 },
  { x: 62, y: 72, size: 1.2, dur: 10.5, delay: 3.5 },
  { x: 87, y: 12, size: 1.8, dur: 8.0, delay: 0.3 },
  { x: 47, y: 95, size: 1.0, dur: 12.0, delay: 1.8 },
  { x: 73, y: 43, size: 1.5, dur: 9.0, delay: 4.5 },
  { x: 18, y: 57, size: 1.2, dur: 7.0, delay: 2.8 },
  { x: 95, y: 75, size: 1.0, dur: 11.0, delay: 0.7 },
];

/* ── Subtle background particle field ── */
function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'rgba(255,255,255,0.5)',
          }}
          animate={{ y: [0, -18, 0], opacity: [0, 0.07, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ── Center pulse + circuit lines — loops continuously once triggered ── */
function CenterPulse({ triggered }: { triggered: boolean }) {
  // Each ring has a different total cycle length so they stay organically staggered
  const rings = [
    { size: 7,  opacityStart: 0.65, dur: 1.3, repeatDelay: 2.2 },
    { size: 10, opacityStart: 0.45, dur: 1.6, repeatDelay: 1.9 },
    { size: 13, opacityStart: 0.28, dur: 1.9, repeatDelay: 1.6 },
  ];

  // Circuit path loop: draw in → hold → fade out → pause → repeat
  const pathTransition = {
    duration: 2.8,
    times: [0, 0.35, 0.65, 1],
    repeat: Infinity,
    repeatDelay: 1.2,
    ease: 'easeInOut' as const,
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      {/* Ripple rings — each loops independently for an organic pulse feel */}
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 16, height: 16, border: '1px solid rgba(255,255,255,0.28)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={triggered ? { scale: [0, r.size], opacity: [r.opacityStart, 0] } : {}}
          transition={{
            duration: r.dur,
            delay: i * 0.22,
            repeat: Infinity,
            repeatDelay: r.repeatDelay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Circuit lines SVG — continuously draws and fades */}
      {triggered && (
        <svg
          width="240"
          height="64"
          viewBox="0 0 240 64"
          fill="none"
          className="absolute"
        >
          <defs>
            <linearGradient id="cktGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(59,240,255,0)" />
              <stop offset="40%"  stopColor="rgba(180,220,255,0.55)" />
              <stop offset="60%"  stopColor="rgba(180,220,255,0.55)" />
              <stop offset="100%" stopColor="rgba(184,41,247,0)" />
            </linearGradient>
          </defs>

          {/* Upper branch */}
          <motion.path
            d="M 50 32 L 85 32 L 96 20 L 144 20 L 155 32 L 190 32"
            stroke="url(#cktGrad)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }}
            transition={pathTransition}
          />

          {/* Lower branch — slight offset for visual depth */}
          <motion.path
            d="M 50 32 L 85 32 L 96 44 L 144 44 L 155 32 L 190 32"
            stroke="url(#cktGrad)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }}
            transition={{ ...pathTransition, delay: 0.12 }}
          />

          {/* Center node — pulses with the circuit */}
          <motion.circle
            cx="120" cy="32" r="2.5"
            fill="rgba(255,255,255,0.85)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.6, 1, 0], opacity: [0, 1, 0.7, 0] }}
            transition={{
              duration: 2.8,
              times: [0, 0.2, 0.65, 1],
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: 'easeOut',
            }}
          />
        </svg>
      )}
    </div>
  );
}

/* ── Single logo node ── */
function LogoNode({
  src, alt, fromX, initialRotate,
}: {
  src: string; alt: string; fromX: number; initialRotate: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: fromX, rotate: initialRotate }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, ease: EASE_OUT_QUART }}
      className="relative flex items-center justify-center"
    >
      {/* Continuous gentle float */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="relative z-10 object-contain rounded-2xl block"
          style={{
            height: 'clamp(84px, 13.5vw, 126px)',
            width: 'auto',
            maxWidth: 'clamp(180px, 27vw, 270px)',
            filter: 'drop-shadow(0 6px 28px rgba(0,0,0,0.65)) drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
          }}
          whileHover={{
            scale: 1.05,
            filter: 'drop-shadow(0 6px 28px rgba(0,0,0,0.65)) drop-shadow(0 2px 8px rgba(0,0,0,0.4)) brightness(1.1)',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────── */

export default function MissionSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const logoAreaRef = useRef<HTMLDivElement>(null);
  const isInView    = useInView(logoAreaRef, { once: true });
  const [btnHovered, setBtnHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  return (
    <section
      ref={sectionRef}
      id="mission"
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* ── Parallax ambient glows ── */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: backgroundY }}>
        <div
          className="absolute top-[5%] left-[8%] rounded-full"
          style={{ width: 560, height: 560, background: 'rgba(184,41,247,0.04)', filter: 'blur(160px)' }}
        />
        <div
          className="absolute bottom-[5%] right-[6%] rounded-full"
          style={{ width: 480, height: 480, background: 'rgba(59,240,255,0.035)', filter: 'blur(140px)' }}
        />
        <div
          className="absolute top-[45%] left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 640, height: 260, background: 'rgba(247,41,168,0.02)', filter: 'blur(110px)' }}
        />
      </motion.div>

      {/* ── Edge vignette — darkens corners ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 45%, rgba(0,0,0,0.38) 100%)',
        }}
      />

      {/* ── Particle field ── */}
      <ParticleField />

      {/* ── Grid dots ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.018,
        }}
      />

      {/* ── Section borders ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Badge + Heading + Body ── */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
            className="flex justify-center mb-5"
          >
            <SectionBadge label="Partnership Announcement" color="#F729A8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE_OUT_QUART }}
            className="font-['Orbitron',sans-serif] font-bold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(1.55rem, 3.8vw, 2.75rem)' }}
          >
            Where AI Technology Meets{' '}
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #F729A8, #B829F7 45%, #3BF0FF)' }}
            >
              Global Policy Intelligence
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE_OUT_QUART }}
            className="font-['Rajdhani',sans-serif] text-base sm:text-lg text-[rgba(255,255,255,0.6)] max-w-2xl mx-auto leading-relaxed"
          >
            Gspec Technologies is proud to announce a strategic partnership with{' '}
            <span className="font-semibold text-[rgba(255,255,255,0.88)]">The Meridian Council</span>
            {'. '}Together, we are aligning cutting-edge AI capability with rigorous policy research to
            create solutions that transform businesses and shape a better world.
          </motion.p>
        </div>

        {/* ── Logo pair ── */}
        <div
          ref={logoAreaRef}
          className="relative flex items-center justify-center mb-8"
          style={{ minHeight: 160 }}
        >
          {/* Center pulse / circuit lines */}
          <CenterPulse triggered={isInView} />

          {/* Logo row */}
          <div
            className="flex items-center justify-center"
            style={{ gap: 'clamp(120px, 15vw, 200px)' }}
          >
            <LogoNode
              src="/gspec_tilt.png"
              alt="Gspec Technologies"
              fromX={-110}
              initialRotate={5}
            />
            <LogoNode
              src="/meridian.jpeg"
              alt="The Meridian Council"
              fromX={110}
              initialRotate={-5}
            />
          </div>
        </div>

        {/* ── "Strategic Partnership" label ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.55, ease: EASE_OUT_QUART }}
          className="text-center mb-10"
        >
          <span
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontSize: '17px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.01em',
            }}
          >
            Strategic Partnership
          </span>
        </motion.div>

        {/* ── CTA button ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0, duration: 0.55, ease: EASE_OUT_QUART }}
          className="flex justify-center"
        >
          <motion.a
            href="/mission"
            onHoverStart={() => setBtnHovered(true)}
            onHoverEnd={() => setBtnHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'white',
              textDecoration: 'none',
              transition: 'background 0.25s ease',
            }}
            animate={{
              background: btnHovered ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
            }}
            aria-label="Read the full mission statement"
          >
            <span
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontSize: '15px',
                fontWeight: 500,
              }}
            >
              Read Full Mission
            </span>

            <motion.svg
              className="w-4 h-4 flex-shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              stroke="white"
              strokeWidth="2"
              animate={{ x: btnHovered ? 4 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </motion.svg>
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}
