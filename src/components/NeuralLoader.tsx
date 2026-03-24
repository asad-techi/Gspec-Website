/**
 * NeuralLoader — Sacred Circle Architecture  (desktop + mobile unified)
 *
 * Single component, three tiers selected at runtime:
 *
 *   TIER_NANO   < 375px or low-power   8 nodes  · 8 conns  · 1.2s · no glow blur
 *   TIER_MOBILE 375–767px              12 nodes · 12 conns · 1.5s · single aura layer
 *   TIER_FULL   768px+                 28 nodes · 48 conns · 2.4s · all effects
 *
 * Safe-zone rule: SAFE_PX enforced at pixel level — no node ever enters the
 * logo radius. Values differ per tier because physical pixel density varies.
 *
 * GPU contract:
 *   - Only opacity / transform / scale on animated elements
 *   - will-change declared only on elements that actually animate
 *   - SVG blur filters disabled on TIER_NANO
 *   - Animations pause when document.hidden (battery save)
 *   - ResizeObserver drives orientation changes
 *
 * Tap-to-skip: disabled by default, enable via allowSkip prop.
 */

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg:         '#050508',
  cyan:       '#00d4ff',
  cyanBright: '#3BF0FF',
  cyanCore:   '#e8ffff',
  blue:       '#0066ff',
  blueMid:    '#4B92FF',
  purple:     '#4d00ff',
  purpleSoft: '#7B5CF0',
  textCyan:   'rgba(59,240,255,0.72)',
  textDim:    'rgba(59,240,255,0.32)',
} as const;

// ─── Tier system ──────────────────────────────────────────────────────────────

type Tier = 'nano' | 'mobile' | 'full';

interface TierConfig {
  /** Min safe-zone radius (px from center) — no nodes inside */
  safeZone:      number;
  /** Total loader duration in ms */
  duration:      number;
  /** Scale for logo breathing */
  breatheScale:  number;
  /** Max active nodes */
  maxNodes:      number;
  /** Max active connections */
  maxConns:      number;
  /** Show particle dust layer */
  particles:     boolean;
  /** Use SVG blur filters on nodes */
  glowBlur:      boolean;
  /** Show animated fog in background */
  animatedFog:   boolean;
  /** Show scanlines overlay */
  scanlines:     boolean;
  /** Show data-packet pulse on connections */
  pulsePackets:  boolean;
  /** Chromatic aberration on text */
  chromatic:     boolean;
  /** Purple glow tier behind logo */
  purpleLayer:   boolean;
  /** Shockwave ring count */
  shockwaveRings: number;
  /** Exit fade duration */
  exitDuration:  number;
}

const TIER: Record<Tier, TierConfig> = {
  nano: {
    safeZone: 55,   duration: 1200, breatheScale: 1.015,
    maxNodes: 8,    maxConns: 8,
    particles: false, glowBlur: false, animatedFog: false,
    scanlines: false, pulsePackets: false, chromatic: false,
    purpleLayer: false, shockwaveRings: 1, exitDuration: 0.4,
  },
  mobile: {
    safeZone: 62,   duration: 1500, breatheScale: 1.02,
    maxNodes: 12,   maxConns: 12,
    particles: false, glowBlur: true, animatedFog: false,
    scanlines: false, pulsePackets: false, chromatic: false,
    purpleLayer: false, shockwaveRings: 2, exitDuration: 0.5,
  },
  full: {
    safeZone: 100,  duration: 2400, breatheScale: 1.03,
    maxNodes: 28,   maxConns: 48,
    particles: true, glowBlur: true, animatedFog: true,
    scanlines: true, pulsePackets: true, chromatic: true,
    purpleLayer: true, shockwaveRings: 3, exitDuration: 0.7,
  },
};

// ─── Viewport & device hooks ──────────────────────────────────────────────────

interface Viewport { w: number; h: number; }

function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  useEffect(() => {
    // ResizeObserver for orientation + resize — more reliable than window resize on mobile
    const ro = new ResizeObserver(() => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
    });
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return vp;
}

/** Returns true if Battery Status API reports level ≤ 20% or charging=false+level≤30% */
function useLowPower(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    // Battery Status API — not universally available
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{ level: number; charging: boolean; addEventListener: (type: string, listener: () => void) => void }>;
    };
    if (!nav.getBattery) return;
    nav.getBattery().then(b => {
      const check = () => setLow(!b.charging && b.level <= 0.2);
      check();
      b.addEventListener('levelchange', check);
      b.addEventListener('chargingchange', check);
    }).catch(() => {/* API blocked — treat as normal power */});
  }, []);
  return low;
}

/** Pause/resume signal tied to document visibility */
function usePageVisible(): boolean {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const h = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', h);
    return () => document.removeEventListener('visibilitychange', h);
  }, []);
  return visible;
}

function deriveTier(vp: Viewport, lowPower: boolean): Tier {
  if (lowPower || vp.w < 375) return 'nano';
  if (vp.w < 768)             return 'mobile';
  return 'full';
}

// ─── Node & Connection types ──────────────────────────────────────────────────

interface NodeDef {
  id:         number;
  /** Pixel radius from viewport center. Always >= tier.safeZone */
  r:          number;
  /** Polar angle, degrees. 0=right, 90=down */
  angle:      number;
  /** Logical priority 1–4 (used for maxNodes slicing) */
  priority:   number;
  spawnDelay: number; // ms absolute from loader mount
  heartbeat:  number; // ms per pulse cycle
  /** Visual weight 0.6–1.2 */
  weight:     number;
}

interface ConnDef {
  id:        number;
  from:      number;
  to:        number;
  delay:     number;   // ms absolute
  strength:  number;   // 0–1
  /** Push bezier CP outward from center by this many px */
  cpOutward: number;
}

// ─── Node positions (pixel radii, priority-ordered) ──────────────────────────
//
// Priority 1: 3 seed nodes — always shown (even TIER_NANO)
// Priority 2: outer ring   — mobile+full
// Priority 3: primary ring — full only (but scaled for mobile)
// Priority 4: accent/extra — full only
//
// Radii authored for TIER_FULL (safeZone=100).
// Mobile/nano use smaller radii via scaledR() at render time.

const ALL_NODES: NodeDef[] = [
  // Priority 1 — seed nodes (outer drift, spawn immediately)
  { id: 0,  r: 300, angle: -70,  priority: 1, spawnDelay: 60,   heartbeat: 2600, weight: 0.9  },
  { id: 1,  r: 285, angle:  50,  priority: 1, spawnDelay: 160,  heartbeat: 3100, weight: 0.85 },
  { id: 2,  r: 305, angle: 178,  priority: 1, spawnDelay: 260,  heartbeat: 2400, weight: 0.9  },

  // Priority 2 — outer ring 240–270px
  { id: 3,  r: 248, angle: -90,  priority: 2, spawnDelay: 340,  heartbeat: 3200, weight: 0.95 },
  { id: 4,  r: 258, angle: -35,  priority: 2, spawnDelay: 380,  heartbeat: 2900, weight: 1.0  },
  { id: 5,  r: 243, angle:  20,  priority: 2, spawnDelay: 420,  heartbeat: 3500, weight: 0.9  },
  { id: 6,  r: 262, angle:  80,  priority: 2, spawnDelay: 460,  heartbeat: 2700, weight: 1.0  },
  { id: 7,  r: 252, angle: 138,  priority: 2, spawnDelay: 500,  heartbeat: 3100, weight: 1.05 },
  { id: 8,  r: 268, angle: 198,  priority: 2, spawnDelay: 540,  heartbeat: 2600, weight: 0.95 },
  { id: 9,  r: 245, angle: 252,  priority: 2, spawnDelay: 580,  heartbeat: 3300, weight: 0.9  },

  // Priority 3 — primary ring 140–160px (full only)
  { id: 10, r: 142, angle: -80,  priority: 3, spawnDelay: 720,  heartbeat: 2800, weight: 0.8  },
  { id: 11, r: 152, angle: -20,  priority: 3, spawnDelay: 780,  heartbeat: 3600, weight: 0.75 },
  { id: 12, r: 145, angle:  45,  priority: 3, spawnDelay: 840,  heartbeat: 2500, weight: 0.8  },
  { id: 13, r: 158, angle: 115,  priority: 3, spawnDelay: 900,  heartbeat: 3200, weight: 0.7  },
  { id: 14, r: 150, angle: 178,  priority: 3, spawnDelay: 960,  heartbeat: 2900, weight: 0.75 },
  { id: 15, r: 142, angle: 240,  priority: 3, spawnDelay: 1020, heartbeat: 3400, weight: 0.8  },
  { id: 16, r: 155, angle: 305,  priority: 3, spawnDelay: 1080, heartbeat: 2700, weight: 0.7  },

  // Priority 4 — extra outer + accent (full only)
  { id: 17, r: 332, angle: -100, priority: 4, spawnDelay: 1300, heartbeat: 3700, weight: 0.8  },
  { id: 18, r: 325, angle:  -5,  priority: 4, spawnDelay: 1360, heartbeat: 2800, weight: 0.85 },
  { id: 19, r: 338, angle:  65,  priority: 4, spawnDelay: 1420, heartbeat: 3500, weight: 0.8  },
  { id: 20, r: 322, angle: 160,  priority: 4, spawnDelay: 1480, heartbeat: 2600, weight: 0.85 },
  { id: 21, r: 335, angle: 230,  priority: 4, spawnDelay: 1540, heartbeat: 3200, weight: 0.8  },
  { id: 22, r: 320, angle: 295,  priority: 4, spawnDelay: 1600, heartbeat: 3600, weight: 0.85 },
  { id: 23, r: 198, angle: -55,  priority: 4, spawnDelay: 1360, heartbeat: 2400, weight: 0.88 },
  { id: 24, r: 193, angle: 130,  priority: 4, spawnDelay: 1420, heartbeat: 3100, weight: 0.85 },
  { id: 25, r: 208, angle: 270,  priority: 4, spawnDelay: 1480, heartbeat: 2700, weight: 0.9  },
  { id: 26, r: 126, angle:  -5,  priority: 4, spawnDelay: 1540, heartbeat: 2200, weight: 0.65 },
  { id: 27, r: 128, angle: 185,  priority: 4, spawnDelay: 1600, heartbeat: 2500, weight: 0.65 },
];

const ALL_CONNS: ConnDef[] = [
  // Seed triangle
  { id: 0,  from: 0,  to: 1,  delay: 280,  strength: 0.55, cpOutward: 40 },
  { id: 1,  from: 1,  to: 2,  delay: 340,  strength: 0.5,  cpOutward: 45 },
  { id: 2,  from: 2,  to: 0,  delay: 400,  strength: 0.5,  cpOutward: 50 },
  // Seeds → outer ring
  { id: 3,  from: 0,  to: 3,  delay: 480,  strength: 0.65, cpOutward: 30 },
  { id: 4,  from: 0,  to: 4,  delay: 510,  strength: 0.6,  cpOutward: 35 },
  { id: 5,  from: 1,  to: 5,  delay: 540,  strength: 0.65, cpOutward: 30 },
  { id: 6,  from: 1,  to: 6,  delay: 570,  strength: 0.6,  cpOutward: 40 },
  { id: 7,  from: 2,  to: 7,  delay: 600,  strength: 0.65, cpOutward: 35 },
  { id: 8,  from: 2,  to: 8,  delay: 630,  strength: 0.6,  cpOutward: 30 },
  // Outer ring loop
  { id: 9,  from: 3,  to: 4,  delay: 660,  strength: 0.7,  cpOutward: 55 },
  { id: 10, from: 4,  to: 5,  delay: 685,  strength: 0.65, cpOutward: 50 },
  { id: 11, from: 5,  to: 6,  delay: 710,  strength: 0.7,  cpOutward: 55 },
  { id: 12, from: 6,  to: 7,  delay: 735,  strength: 0.65, cpOutward: 50 },
  { id: 13, from: 7,  to: 8,  delay: 760,  strength: 0.7,  cpOutward: 55 },
  { id: 14, from: 8,  to: 9,  delay: 785,  strength: 0.65, cpOutward: 50 },
  { id: 15, from: 9,  to: 3,  delay: 810,  strength: 0.7,  cpOutward: 55 },
  // Outer → primary spokes
  { id: 16, from: 3,  to: 10, delay: 860,  strength: 0.6,  cpOutward: 25 },
  { id: 17, from: 4,  to: 11, delay: 885,  strength: 0.55, cpOutward: 30 },
  { id: 18, from: 5,  to: 12, delay: 910,  strength: 0.6,  cpOutward: 25 },
  { id: 19, from: 6,  to: 13, delay: 935,  strength: 0.55, cpOutward: 30 },
  { id: 20, from: 7,  to: 14, delay: 960,  strength: 0.6,  cpOutward: 25 },
  { id: 21, from: 8,  to: 15, delay: 985,  strength: 0.55, cpOutward: 30 },
  { id: 22, from: 9,  to: 16, delay: 1010, strength: 0.6,  cpOutward: 25 },
  // Primary ring loop
  { id: 23, from: 10, to: 11, delay: 1070, strength: 0.75, cpOutward: 65 },
  { id: 24, from: 11, to: 12, delay: 1090, strength: 0.7,  cpOutward: 60 },
  { id: 25, from: 12, to: 13, delay: 1110, strength: 0.75, cpOutward: 65 },
  { id: 26, from: 13, to: 14, delay: 1130, strength: 0.7,  cpOutward: 60 },
  { id: 27, from: 14, to: 15, delay: 1150, strength: 0.75, cpOutward: 65 },
  { id: 28, from: 15, to: 16, delay: 1170, strength: 0.7,  cpOutward: 60 },
  { id: 29, from: 16, to: 10, delay: 1190, strength: 0.75, cpOutward: 65 },
  // Accent connections
  { id: 30, from: 23, to: 4,  delay: 1480, strength: 0.55, cpOutward: 20 },
  { id: 31, from: 23, to: 11, delay: 1500, strength: 0.6,  cpOutward: 30 },
  { id: 32, from: 24, to: 7,  delay: 1520, strength: 0.55, cpOutward: 25 },
  { id: 33, from: 24, to: 14, delay: 1540, strength: 0.6,  cpOutward: 30 },
  { id: 34, from: 25, to: 9,  delay: 1560, strength: 0.55, cpOutward: 20 },
  { id: 35, from: 25, to: 16, delay: 1580, strength: 0.6,  cpOutward: 30 },
  // Phase 4 outer ring
  { id: 36, from: 17, to: 3,  delay: 1620, strength: 0.45, cpOutward: 60 },
  { id: 37, from: 18, to: 4,  delay: 1635, strength: 0.4,  cpOutward: 55 },
  { id: 38, from: 19, to: 6,  delay: 1650, strength: 0.45, cpOutward: 60 },
  { id: 39, from: 20, to: 7,  delay: 1665, strength: 0.4,  cpOutward: 55 },
  { id: 40, from: 21, to: 9,  delay: 1680, strength: 0.45, cpOutward: 60 },
  { id: 41, from: 22, to: 3,  delay: 1695, strength: 0.4,  cpOutward: 55 },
  { id: 42, from: 17, to: 18, delay: 1740, strength: 0.35, cpOutward: 70 },
  { id: 43, from: 18, to: 19, delay: 1755, strength: 0.35, cpOutward: 70 },
  { id: 44, from: 19, to: 20, delay: 1770, strength: 0.35, cpOutward: 70 },
  { id: 45, from: 20, to: 21, delay: 1785, strength: 0.35, cpOutward: 70 },
  { id: 46, from: 21, to: 22, delay: 1800, strength: 0.35, cpOutward: 70 },
  { id: 47, from: 22, to: 17, delay: 1815, strength: 0.35, cpOutward: 70 },
];

// ─── Messages ─────────────────────────────────────────────────────────────────

const MESSAGES = [
  'INITIALIZING NEURAL MATRIX...',
  'SYNAPSES FORMING...',
  'CONSCIOUSNESS EMERGING...',
  'SYNCING WITH GSPEC CORE...',
  'AWAKENING COMPLETE',
] as const;

// ─── Deterministic particle pool (desktop only) ───────────────────────────────

const DUST = Array.from({ length: 16 }, (_, i) => {
  const s = (i * 2654435761) >>> 0;
  const f = (n: number) => ((s * (n + 1) * 1664525 + 1013904223) >>> 0) / 0xffffffff;
  return { id: i, x: f(0)*100, y: f(1)*100, dx: (f(2)-0.5)*48, dy: -(f(3)*32+10), sz: f(4)*1.1+0.4, op: f(5)*0.22+0.04, t: f(6)*7+6, dl: (i*0.38)%4 };
});

// ─── Pixel position helper ────────────────────────────────────────────────────

function nodePixel(
  n: NodeDef,
  cx: number, cy: number,
  scale: number,   // radius scale factor for this tier
  safeZone: number
): { px: number; py: number } {
  const r   = Math.max(n.r * scale, safeZone);
  const rad = (n.angle * Math.PI) / 180;
  return { px: cx + r * Math.cos(rad), py: cy + r * Math.sin(rad) * 0.88 };
}

// ─── Background ───────────────────────────────────────────────────────────────

const AtmosphericBg = memo(function AtmosphericBg({ tier }: { tier: TierConfig }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: C.bg }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,212,255,0.03) 0%, rgba(0,102,255,0.018) 45%, transparent 70%)' }} />
      {tier.purpleLayer && (
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 55%, rgba(77,0,255,0.05) 80%, transparent 100%)' }} />
      )}
      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(0,0,0,0.72) 100%)' }} />
      {/* Animated fog — desktop only */}
      {tier.animatedFog && (
        <>
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 38% 28% at 25% 65%, rgba(75,146,255,0.022) 0%, transparent 70%)' }}
            animate={{ x: [0, 26, 0], y: [0, -16, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 32% 22% at 75% 35%, rgba(123,92,240,0.022) 0%, transparent 70%)' }}
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}
      {/* Scanlines */}
      {tier.scanlines && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.014) 2px, rgba(0,0,0,0.014) 4px)',
        }} />
      )}
    </>
  );
});

// ─── Particle dust (full tier only) ──────────────────────────────────────────

const ParticleField = memo(function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {DUST.map(d => (
        <motion.div key={d.id} className="absolute rounded-full"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.sz, height: d.sz, background: C.cyanBright, willChange: 'transform, opacity' }}
          animate={{ x: [0, d.dx, 0], y: [0, d.dy, 0], opacity: [0, d.op, 0] }}
          transition={{ duration: d.t, repeat: Infinity, ease: 'easeInOut', delay: d.dl }}
        />
      ))}
    </div>
  );
});

// ─── Logo ─────────────────────────────────────────────────────────────────────

interface LogoProps { shockwave: boolean; tier: TierConfig; }

const Logo = memo(function Logo({ shockwave, tier }: LogoProps) {
  const breathe = tier.breatheScale;
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 50, pointerEvents: 'none' }}>
      {/* Aura layers — behind img */}
      <div className="absolute flex items-center justify-center">
        {/* Purple outer — full tier only */}
        {tier.purpleLayer && (
          <motion.div className="absolute rounded-full" style={{
            width: 260, height: 260,
            background: 'radial-gradient(circle, transparent 35%, rgba(77,0,255,0.055) 60%, transparent 80%)',
            filter: 'blur(18px)',
            willChange: 'transform',
          }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {/* Blue mid — full + mobile */}
        <motion.div className="absolute rounded-full" style={{
          width: 190, height: 190,
          background: 'radial-gradient(circle, transparent 30%, rgba(0,102,255,0.09) 55%, transparent 75%)',
          filter: 'blur(12px)',
          willChange: 'transform',
        }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
        {/* Cyan inner core — all tiers */}
        <motion.div className="absolute rounded-full" style={{
          width: 130, height: 130,
          background: 'radial-gradient(circle, rgba(0,212,255,0.16) 0%, rgba(0,212,255,0.07) 45%, transparent 70%)',
          filter: 'blur(7px)',
          willChange: 'transform',
        }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </div>

      {/* Logo image — opacity 1 always */}
      <motion.img
        src="/gspec-logo.png"
        alt="GSpec Technologies"
        style={{
          position: 'relative',
          height: 'clamp(52px, 11vw, 80px)',
          width: 'auto',
          objectFit: 'contain',
          opacity: 1,
          filter: shockwave
            ? 'drop-shadow(0 0 5px rgba(0,212,255,0.9)) drop-shadow(0 0 28px rgba(0,212,255,0.8)) drop-shadow(0 0 55px rgba(0,102,255,0.55))'
            : 'drop-shadow(0 0 3px rgba(0,212,255,0.45)) drop-shadow(0 0 14px rgba(0,102,255,0.28))',
          willChange: 'transform',
        }}
        initial={{ opacity: 1, scale: 0.88 }}
        animate={shockwave ? { scale: [1, 1.05, 1] } : { scale: [1, breathe, 1] }}
        transition={
          shockwave
            ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            : { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3,
                opacity: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
        }
      />
    </div>
  );
});

// ─── Shockwave ────────────────────────────────────────────────────────────────

const Shockwave = memo(function Shockwave({ rings }: { rings: number }) {
  const defs = [
    { border: `2px solid ${C.cyanBright}`, shadow: `0 0 10px ${C.cyanBright}`, endW: 680,  op0: 1.0, dur: 0.72, delay: 0    },
    { border: `1.5px solid ${C.blueMid}`,  shadow: '',                          endW: 900,  op0: 0.8, dur: 0.95, delay: 0.1  },
    { border: `1px solid ${C.purpleSoft}`, shadow: '',                          endW: 1080, op0: 0.5, dur: 1.15, delay: 0.2  },
  ].slice(0, rings);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 60 }}>
      {defs.map((d, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ border: d.border, boxShadow: d.shadow || undefined }}
          initial={{ width: 155, height: 155, opacity: d.op0 }}
          animate={{ width: d.endW, height: d.endW, opacity: 0 }}
          transition={{ duration: d.dur, ease: [0.2, 0.8, 0.4, 1], delay: d.delay }}
        />
      ))}
    </div>
  );
});

// ─── Neural network SVG ───────────────────────────────────────────────────────

interface NetworkProps {
  nodes:      NodeDef[];
  conns:      ConnDef[];
  cx:         number;
  cy:         number;
  rScale:     number;
  safeZone:   number;
  showPulse:  boolean;
  glowBlur:   boolean;
  paused:     boolean;
}

const NeuralNetwork = memo(function NeuralNetwork({
  nodes, conns, cx, cy, rScale, safeZone, showPulse, glowBlur, paused,
}: NetworkProps) {
  const pxMap = useMemo(() => {
    const m: Record<number, { px: number; py: number }> = {};
    nodes.forEach(n => { m[n.id] = nodePixel(n, cx, cy, rScale, safeZone); });
    return m;
  }, [nodes, cx, cy, rScale, safeZone]);

  const nodeSet  = useMemo(() => new Set(nodes.map(n => n.id)), [nodes]);
  const visConns = useMemo(() => conns.filter(c => nodeSet.has(c.from) && nodeSet.has(c.to)), [conns, nodeSet]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {glowBlur && (
          <>
            <filter id="ncg" x="-500%" y="-500%" width="1100%" height="1100%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="nbm" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="7"/>
            </filter>
          </>
        )}
      </defs>

      {/* Connections */}
      {visConns.map(conn => {
        const a = pxMap[conn.from], b = pxMap[conn.to];
        if (!a || !b) return null;

        const midX = (a.px + b.px) / 2;
        const midY = (a.py + b.py) / 2;
        const dist = Math.hypot(midX - cx, midY - cy) || 1;
        const nx   = (midX - cx) / dist;
        const ny   = (midY - cy) / dist;
        const cpx  = midX + nx * conn.cpOutward * rScale;
        const cpy  = midY + ny * conn.cpOutward * rScale;
        const pathD = `M${a.px},${a.py} Q${cpx},${cpy} ${b.px},${b.py}`;
        const sw    = 0.4 + conn.strength * 1.3;
        const gid   = `g${conn.id}`;
        const pid   = `p${conn.id}`;

        return (
          <g key={conn.id}>
            <defs>
              <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={a.px} y1={a.py} x2={b.px} y2={b.py}>
                <stop offset="0%"   stopColor={C.cyanBright} stopOpacity={conn.strength * 0.68}/>
                <stop offset="50%"  stopColor={C.blueMid}    stopOpacity={conn.strength * 0.42}/>
                <stop offset="100%" stopColor={C.cyanBright} stopOpacity={0.04}/>
              </linearGradient>
              {showPulse && !paused && (
                <linearGradient id={pid} gradientUnits="userSpaceOnUse" x1={a.px} y1={a.py} x2={b.px} y2={b.py}>
                  <stop offset="0%"   stopColor={C.cyanCore} stopOpacity={0}/>
                  <stop offset="50%"  stopColor={C.cyanCore} stopOpacity={0.82}/>
                  <stop offset="100%" stopColor={C.cyanCore} stopOpacity={0}/>
                </linearGradient>
              )}
            </defs>
            <motion.path d={pathD} fill="none" stroke={`url(#${gid})`} strokeWidth={sw} strokeLinecap="round"
              style={{ willChange: 'opacity' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={paused ? {} : { pathLength: 1, opacity: 1 }}
              transition={{ pathLength: { delay: conn.delay/1000, duration: 0.45, ease: 'easeOut' }, opacity: { delay: conn.delay/1000, duration: 0.16 } }}
            />
            {showPulse && !paused && (
              <motion.path d={pathD} fill="none" stroke={`url(#${pid})`} strokeWidth={sw+0.6} strokeLinecap="round"
                strokeDasharray="0 1"
                style={{ willChange: 'opacity' }}
                initial={{ pathLength: 0.13, pathOffset: 0, opacity: 0 }}
                animate={{ pathOffset: [0,1], opacity: [0,0.82,0.82,0] }}
                transition={{
                  pathOffset: { duration: 1.15+conn.strength*0.48, repeat: Infinity, ease: 'linear', delay: conn.delay/1000+0.45+conn.id*0.06 },
                  opacity:    { duration: 1.15+conn.strength*0.48, repeat: Infinity, times:[0,0.08,0.92,1], delay: conn.delay/1000+0.45+conn.id*0.06 },
                }}
              />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map(n => {
        const { px, py } = pxMap[n.id] ?? { px: 0, py: 0 };
        const coreR  = 2.0 * n.weight;
        const glowR  = 7.0 * n.weight;
        const bloomR = 15  * n.weight;
        const spawnS = n.spawnDelay / 1000;

        return (
          <motion.g key={n.id}
            initial={{ opacity: 0 }} animate={paused ? {} : { opacity: 1 }}
            transition={{ delay: spawnS, duration: 0.01 }}
          >
            {/* Bloom — only when glowBlur enabled */}
            {glowBlur && (
              <>
                <circle cx={px} cy={py} r={bloomR} fill={C.cyanBright} fillOpacity={0.065 * n.weight} filter="url(#nbm)"/>
                <motion.circle cx={px} cy={py} r={bloomR} fill={C.cyanBright} fillOpacity={0}
                  style={{ filter: 'blur(5px)', willChange: 'opacity' }}
                  animate={paused ? {} : { r:[bloomR,bloomR*1.38,bloomR], fillOpacity:[0.055,0.13,0.055] }}
                  transition={{ duration: n.heartbeat/1000, repeat: Infinity, ease: 'easeInOut', delay: spawnS }}
                />
              </>
            )}
            {/* Inner glow */}
            <motion.circle cx={px} cy={py} r={glowR} fill={C.cyanBright} fillOpacity={0}
              style={{ filter: glowBlur ? 'blur(2px)' : undefined, willChange: 'opacity' }}
              animate={paused ? {} : { r:[glowR,glowR*1.18,glowR], fillOpacity:[0.18,0.36,0.18] }}
              transition={{ duration: n.heartbeat/1000, repeat: Infinity, ease: 'easeInOut', delay: spawnS+0.14 }}
            />
            {/* Halo ring */}
            <motion.circle cx={px} cy={py} r={coreR+4} fill="none" stroke={C.cyanBright} strokeWidth={0.45}
              animate={paused ? {} : { r:[coreR+4,coreR+10,coreR+4], strokeOpacity:[0.48,0,0.48] }}
              transition={{ duration: n.heartbeat/1000, repeat: Infinity, ease: 'easeOut', delay: spawnS+0.24 }}
            />
            {/* Birth flash */}
            <motion.circle cx={px} cy={py} r={coreR} fill={C.cyanCore}
              filter={glowBlur ? 'url(#ncg)' : undefined}
              style={{ transformOrigin: `${px}px ${py}px`, willChange: 'transform, opacity' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={paused ? {} : { scale:[0,2.4,1], opacity:[0,1,0.88] }}
              transition={{ delay: spawnS, duration: 0.38, ease:[0.22,1,0.36,1], times:[0,0.33,1] }}
            />
            {/* Living heartbeat */}
            <motion.circle cx={px} cy={py} r={coreR} fill={C.cyanCore}
              style={{ willChange: 'opacity' }}
              animate={paused ? {} : { opacity:[0.78,1,0.68,1,0.78] }}
              transition={{ duration: n.heartbeat/1000, repeat: Infinity, ease: 'easeInOut', delay: spawnS+0.44 }}
            />
          </motion.g>
        );
      })}
    </svg>
  );
});

// ─── Status text ──────────────────────────────────────────────────────────────

interface StatusTextProps {
  message:  string;
  tier:     TierConfig;
  /** typing mode on desktop, fade-only on mobile/nano */
  typed:    boolean;
}

const StatusText = memo(function StatusText({ message, tier, typed }: StatusTextProps) {
  const [shown, setShown]   = useState('');
  const [cursor, setCursor] = useState(true);
  const prevMsg             = useRef('');

  useEffect(() => {
    if (!typed) { setShown(message); return; }
    if (prevMsg.current === message) return;
    prevMsg.current = message;
    setShown('');
    let i = 0;
    const id = setInterval(() => { i++; setShown(message.slice(0, i)); if (i >= message.length) clearInterval(id); }, 34);
    return () => clearInterval(id);
  }, [message, typed]);

  useEffect(() => {
    if (!typed) return;
    const id = setInterval(() => setCursor(c => !c), 520);
    return () => clearInterval(id);
  }, [typed]);

  return (
    <motion.div key={message}
      className="flex items-center gap-px"
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.16 }}
      style={{
        fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
        fontSize: '10px',
        letterSpacing: '0.18em',
        color: C.textCyan,
        // Chromatic aberration on desktop only
        textShadow: tier.chromatic
          ? '-0.5px 0 rgba(255,50,50,0.28), 0.5px 0 rgba(59,240,255,0.28)'
          : 'none',
      }}
    >
      <span>{shown}</span>
      {typed && (
        <span style={{ opacity: cursor ? 1 : 0, color: C.cyanBright, marginLeft: 1 }}>▋</span>
      )}
    </motion.div>
  );
});

// ─── Progress counter ─────────────────────────────────────────────────────────

const ProgressCounter = memo(function ProgressCounter({ value }: { value: number }) {
  const [glitch, setGlitch] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    prev.current = value;
    setGlitch(true);
    const t = setTimeout(() => setGlitch(false), 70);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div style={{
      fontFamily: "'JetBrains Mono','Fira Code',monospace",
      fontSize: '9px', letterSpacing: '0.13em',
      color: C.textDim, userSelect: 'none',
      textShadow: glitch ? '-1px 0 rgba(255,50,50,0.48), 1px 0 rgba(59,240,255,0.48)' : 'none',
      transform: glitch ? 'translateX(1px)' : 'none',
      transition: 'transform 0.05s, text-shadow 0.05s',
    }}>
      {String(value).padStart(2,'0')}%
    </div>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────

export interface NeuralLoaderProps {
  onComplete:   () => void;
  /**
   * Override minimum duration in ms.
   * When undefined, tier's default is used.
   */
  minDuration?: number;
  /** Allow tap/click anywhere to skip loader. Default false. */
  allowSkip?:   boolean;
}

export default function NeuralLoader({
  onComplete,
  minDuration,
  allowSkip = false,
}: NeuralLoaderProps) {
  const reduced   = useReducedMotion();
  const vp        = useViewport();
  const lowPower  = useLowPower();
  const pageVisible = usePageVisible();

  const tierKey = useMemo<Tier>(() => {
    if (reduced) return 'nano';
    return deriveTier(vp, lowPower);
  }, [vp, lowPower, reduced]);

  const tier = TIER[tierKey];
  const duration = minDuration ?? tier.duration;

  const cx = vp.w / 2;
  const cy = vp.h / 2;

  // Radius scale: mobile/nano nodes need to be compressed to fit smaller screens
  // Full tier nodes are authored at ~300px max — scale so they stay on-screen
  const rScale = useMemo(() => {
    if (tierKey === 'full') return 1.0;
    // On small screens, compress radii so the outer ring sits within viewport
    const maxR = 310; // largest authored radius
    const maxAllowed = Math.min(cx, cy) * 0.88;
    return Math.min(1.0, maxAllowed / maxR);
  }, [tierKey, cx, cy]);

  // Node/conn slices for this tier
  const nodes = useMemo<NodeDef[]>(() => {
    const sorted = [...ALL_NODES].sort((a, b) => a.priority - b.priority);
    return sorted.slice(0, tier.maxNodes);
  }, [tier.maxNodes]);

  const conns = useMemo<ConnDef[]>(() => {
    const ids = new Set(nodes.map(n => n.id));
    const eligible = ALL_CONNS.filter(c => ids.has(c.from) && ids.has(c.to));
    return eligible.slice(0, tier.maxConns);
  }, [nodes, tier.maxConns]);

  // Timeline state
  const [msgIdx,    setMsgIdx]    = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [shockwave, setShockwave] = useState(false);
  const [flashCyan, setFlashCyan] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [textHide,  setTextHide]  = useState(false);
  const [done,      setDone]      = useState(false);

  // Tap-to-skip handler
  const handleSkip = useCallback(() => {
    if (!allowSkip || done) return;
    setDone(true);
    setTextHide(true);
    setShockwave(true);
    setFlashCyan(true);
    setTimeout(() => setFlashCyan(false), 350);
    setTimeout(onComplete, 500);
  }, [allowSkip, done, onComplete]);

  // Message schedule — compressed to fit duration
  const msgTimes = useMemo(() => {
    const d = duration;
    return [0, d*0.22, d*0.44, d*0.66, d*0.84].map(Math.round);
  }, [duration]);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }

    const T: ReturnType<typeof setTimeout>[] = [];
    const push = (fn: () => void, ms: number) => T.push(setTimeout(fn, ms));

    // Pulse packets at 65% through
    push(() => setShowPulse(true), Math.round(duration * 0.6));

    // Messages
    msgTimes.forEach((t, i) => push(() => setMsgIdx(i), t));

    // Transcendence
    const transcendAt = Math.round(duration * 0.82);
    push(() => setTextHide(true), transcendAt - 150);
    push(() => {
      if (done) return;
      setDone(true);
      setShockwave(true);
      setFlashCyan(true);
      setTimeout(() => setFlashCyan(false), 380);
      setTimeout(onComplete, 550);
    }, transcendAt);

    // Progress ticker
    const step = 100 / (duration / 40);
    let val = 0;
    const prog = setInterval(() => {
      val = Math.min(100, val + step);
      setProgress(Math.round(val));
      if (val >= 100) clearInterval(prog);
    }, 40);

    return () => { T.forEach(clearTimeout); clearInterval(prog); };
  }, [onComplete, duration, reduced, msgTimes, done]);

  // Prevent body scroll while loader is visible
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // iOS momentum scroll lock
    document.body.style.position = 'fixed';
    document.body.style.width    = '100%';
    return () => {
      document.body.style.overflow = prev;
      document.body.style.position = '';
      document.body.style.width    = '';
    };
  }, []);

  // Reduced motion — static logo, fast fade
  if (reduced) {
    return (
      <motion.div className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: C.bg }}
        exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
      >
        <img src="/gspec-logo.png" alt="GSpec Technologies"
          style={{ height: 'clamp(48px, 10vw, 72px)', filter: `drop-shadow(0 0 3px rgba(0,212,255,0.4))` }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 100, touchAction: 'none' }}
      exit={{ opacity: 0 }}
      transition={{ duration: tier.exitDuration, ease: 'easeInOut' }}
      // Tap-to-skip
      onClick={allowSkip ? handleSkip : undefined}
      onTouchEnd={allowSkip ? handleSkip : undefined}
    >
      {/* z-0  Background */}
      <AtmosphericBg tier={tier} />

      {/* z-5  Particles — full tier only */}
      {tier.particles && <ParticleField />}

      {/* z-10 Neural network — behind logo */}
      <NeuralNetwork
        nodes={nodes} conns={conns}
        cx={cx} cy={cy}
        rScale={rScale} safeZone={tier.safeZone}
        showPulse={showPulse} glowBlur={tier.glowBlur}
        paused={!pageVisible}
      />

      {/* z-50 Logo — always hero */}
      <Logo shockwave={shockwave} tier={tier} />

      {/* z-60 Shockwave */}
      {shockwave && <Shockwave rings={tier.shockwaveRings} />}

      {/* Transcendence flash */}
      <AnimatePresence>
        {flashCyan && (
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 55, background: 'rgba(0,212,255,0.045)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
          />
        )}
      </AnimatePresence>

      {/* Status text — anchored 52px below logo center */}
      <div className="absolute pointer-events-none flex items-center justify-center"
        style={{ left: 0, right: 0, top: cy + 52, zIndex: 20 }}
      >
        <AnimatePresence mode="wait">
          {!textHide && (
            <StatusText
              key={msgIdx}
              message={MESSAGES[msgIdx]}
              tier={tier}
              typed={tierKey === 'full'}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Progress counter — bottom right */}
      <div className="fixed pointer-events-none"
        style={{ bottom: 20, right: 24, zIndex: 20, opacity: 0.65 }}
      >
        <ProgressCounter value={progress} />
      </div>

      {/* Tap-to-skip hint — mobile only, fades in at 0.8s */}
      {allowSkip && tierKey !== 'full' && (
        <motion.div
          className="fixed pointer-events-none"
          style={{ bottom: 20, left: 0, right: 0, zIndex: 20, textAlign: 'center',
            fontFamily: "'JetBrains Mono',monospace", fontSize: '8px',
            letterSpacing: '0.2em', color: C.textDim }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.6, 0.6] }}
          transition={{ duration: 2, times: [0, 0.4, 0.6, 1], delay: 0.8 }}
        >
          TAP TO SKIP
        </motion.div>
      )}
    </motion.div>
  );
}
