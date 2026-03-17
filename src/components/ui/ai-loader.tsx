'use client';

import React, { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   SpiralAnimation — golden-angle sunflower dot spiral with pulsing animation.
   Used as the mobile center piece in JourneySection.
───────────────────────────────────────────────────────────────────────────── */

interface SpiralAnimationProps {
  totalDots?: number;
  size?: number;
  dotRadius?: number;
  margin?: number;
  duration?: number;
  dotColor?: string;
  backgroundColor?: string;
}

const SpiralAnimation: React.FC<SpiralAnimationProps> = ({
  totalDots = 600,
  size = 400,
  dotRadius = 2,
  margin = 2,
  duration = 3,
  dotColor = '#fff',
  backgroundColor = '#000',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const CENTER = size / 2;
    const MAX_RADIUS = CENTER - margin - dotRadius;
    const svgNS = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    for (let i = 0; i < totalDots; i++) {
      const idx = i + 0.5;
      const frac = idx / totalDots;
      const r = Math.sqrt(frac) * MAX_RADIUS;
      const theta = idx * GOLDEN_ANGLE;
      const x = CENTER + r * Math.cos(theta);
      const y = CENTER + r * Math.sin(theta);

      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('cx', x.toString());
      c.setAttribute('cy', y.toString());
      c.setAttribute('r', dotRadius.toString());
      c.setAttribute('fill', dotColor);
      c.setAttribute('opacity', '0.6');
      svg.appendChild(c);

      const animR = document.createElementNS(svgNS, 'animate');
      animR.setAttribute('attributeName', 'r');
      animR.setAttribute('values', `${dotRadius * 0.5};${dotRadius * 1.5};${dotRadius * 0.5}`);
      animR.setAttribute('dur', `${duration}s`);
      animR.setAttribute('begin', `${frac * duration}s`);
      animR.setAttribute('repeatCount', 'indefinite');
      animR.setAttribute('calcMode', 'spline');
      animR.setAttribute('keySplines', '0.4 0 0.6 1;0.4 0 0.6 1');
      c.appendChild(animR);

      const animO = document.createElementNS(svgNS, 'animate');
      animO.setAttribute('attributeName', 'opacity');
      animO.setAttribute('values', '0.3;1;0.3');
      animO.setAttribute('dur', `${duration}s`);
      animO.setAttribute('begin', `${frac * duration}s`);
      animO.setAttribute('repeatCount', 'indefinite');
      animO.setAttribute('calcMode', 'spline');
      animO.setAttribute('keySplines', '0.4 0 0.6 1;0.4 0 0.6 1');
      c.appendChild(animO);
    }
  }, [totalDots, size, dotRadius, margin, duration, dotColor]);

  return (
    <div style={{ width: size, height: size, background: backgroundColor, borderRadius: '50%' }}>
      <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} />
    </div>
  );
};

export { SpiralAnimation };

/* ─────────────────────────────────────────────────────────────────────────────
   Component — themed wrapper used in JourneySection mobile center.
   Renders the spiral sized to fit the orbit ring, with "JOURNEY" label
   and the active accent color passed from the parent.
───────────────────────────────────────────────────────────────────────────── */

export function Component({ size = 200, accent = '#3BF0FF' }: { size?: number; accent?: string }) {
  return (
    <div
      className="flex flex-col items-center select-none pointer-events-none"
      style={{ gap: 10 }}
    >
      <SpiralAnimation
        size={size}
        totalDots={500}
        dotRadius={1.8}
        duration={3}
        dotColor={accent}
        backgroundColor="transparent"
      />
      <div
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.28em',
          color: accent,
          textShadow: `0 0 10px ${accent}90`,
          opacity: 0.9,
        }}
      >
        JOURNEY
      </div>
    </div>
  );
}
