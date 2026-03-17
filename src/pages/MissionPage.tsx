'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, BookOpen, Users, Briefcase } from 'lucide-react';

const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

/* ── Looping center pulse + circuit lines (same logic as MissionSection) ── */
function CenterPulse({ triggered }: { triggered: boolean }) {
  const rings = [
    { size: 7,  opacityStart: 0.65, dur: 1.3, repeatDelay: 2.2 },
    { size: 10, opacityStart: 0.45, dur: 1.6, repeatDelay: 1.9 },
    { size: 13, opacityStart: 0.28, dur: 1.9, repeatDelay: 1.6 },
  ];
  const pathTransition = {
    duration: 2.8,
    times: [0, 0.35, 0.65, 1] as number[],
    repeat: Infinity,
    repeatDelay: 1.2,
    ease: 'easeInOut' as const,
  };
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 16, height: 16, border: '1px solid rgba(255,255,255,0.28)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={triggered ? { scale: [0, r.size], opacity: [r.opacityStart, 0] } : {}}
          transition={{ duration: r.dur, delay: i * 0.22, repeat: Infinity, repeatDelay: r.repeatDelay, ease: 'easeOut' }}
        />
      ))}
      {triggered && (
        <svg width="240" height="64" viewBox="0 0 240 64" fill="none" className="absolute">
          <defs>
            <linearGradient id="mpCktGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(59,240,255,0)" />
              <stop offset="40%"  stopColor="rgba(180,220,255,0.55)" />
              <stop offset="60%"  stopColor="rgba(180,220,255,0.55)" />
              <stop offset="100%" stopColor="rgba(184,41,247,0)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 50 32 L 85 32 L 96 20 L 144 20 L 155 32 L 190 32"
            stroke="url(#mpCktGrad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }}
            transition={pathTransition}
          />
          <motion.path
            d="M 50 32 L 85 32 L 96 44 L 144 44 L 155 32 L 190 32"
            stroke="url(#mpCktGrad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }}
            transition={{ ...pathTransition, delay: 0.12 }}
          />
          <motion.circle
            cx="120" cy="32" r="2.5" fill="rgba(255,255,255,0.85)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.6, 1, 0], opacity: [0, 1, 0.7, 0] }}
            transition={{ duration: 2.8, times: [0, 0.2, 0.65, 1], repeat: Infinity, repeatDelay: 1.2, ease: 'easeOut' }}
          />
        </svg>
      )}
    </div>
  );
}

/* ── Logo node   slides in with rotation, then floats ── */
function LogoNode({ src, alt, fromX, initialRotate, delay }: {
  src: string; alt: string; fromX: number; initialRotate: number; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: fromX, rotate: initialRotate }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ delay, duration: 0.85, ease: EASE_OUT_QUART }}
      className="relative flex items-center justify-center"
    >
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="object-contain rounded-2xl block"
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

/* ── Section divider line ── */
function Divider() {
  return (
    <div
      className="h-px my-10"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────── */

export default function MissionPage() {
  // Trigger the logo animation after the page loads
  const [pulseTrigger, setPulseTrigger] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPulseTrigger(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#070A12] text-white relative overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[800px] h-[600px] bg-[rgba(184,41,247,0.04)] rounded-full blur-[200px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[500px] bg-[rgba(59,240,255,0.04)] rounded-full blur-[180px]" />
      </div>

      {/* ── Grid ── */}
      <div
        className="fixed inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Header ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT_QUART }}
        className="sticky top-0 z-50 bg-[rgba(7,10,18,0.88)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.a
            href="/"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.55)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Back to Home</span>
          </motion.a>
          <img
            src="/gspec-logo.png"
            alt="Gspec Technologies"
            className="h-8 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 8px rgba(59,240,255,0.15))' }}
          />
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section className="pt-14 pb-10 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_QUART, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(247,41,168,0.08)', border: '1px solid rgba(247,41,168,0.22)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F729A8', boxShadow: '0 0 8px #F729A8' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Partnership Announcement
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_QUART, delay: 0.18 }}
            className="font-['Orbitron',sans-serif] font-bold leading-tight mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)' }}
          >
            A New Chapter in{' '}
            <span className="bg-gradient-to-r from-[#F729A8] via-[#B829F7] to-[#3BF0FF] bg-clip-text text-transparent">
              AI-Driven Global Impact
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontStyle: 'italic' }}
          >
            Gspec Technologies and The Meridian Council announce a combined AI vision
          </motion.p>

          {/* Date */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.5 }}
            style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '36px' }}
          >
           
          </motion.p>

          {/* ── Logo partnership animation ── */}
          <div className="relative flex items-center justify-center" style={{ minHeight: 160, marginBottom: '32px' }}>
            <CenterPulse triggered={pulseTrigger} />
            <div className="flex items-center justify-center" style={{ gap: 'clamp(110px, 14vw, 190px)' }}>
              <LogoNode src="/gspec_tilt.png" alt="Gspec Technologies" fromX={-110} initialRotate={5} delay={0.15} />
              <LogoNode src="/meridian.jpeg" alt="The Meridian Council" fromX={110} initialRotate={-5} delay={0.15} />
            </div>
          </div>

          {/* Strategic Partnership label */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5, ease: EASE_OUT_QUART }}
            style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.65)', marginBottom: '8px' }}
          >
            Strategic Partnership
          </motion.p>

          {/* Gradient rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.95, duration: 0.8, ease: EASE_OUT_QUART }}
            className="h-px max-w-xl mx-auto mt-8"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(247,41,168,0.35), rgba(59,240,255,0.35), transparent)' }}
          />
        </section>

        {/* ══ OVERVIEW ══════════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: EASE_OUT_QUART }}
          className="pb-2"
        >
          <h2 className="font-['Orbitron',sans-serif] font-bold text-white mb-4" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)' }}>
            Overview
          </h2>
          <div className="space-y-4" style={{ fontSize: 'clamp(0.93rem, 1.7vw, 1.05rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
            <p>
              Gspec Technologies is proud to announce a landmark strategic partnership with{' '}
              <strong className="text-white font-semibold">The Meridian Council</strong>, a nonpartisan
              global research and policy institution dedicated to shaping international dialogue on
              governance, climate change, energy, and artificial intelligence. This partnership represents
              a deliberate convergence of two complementary missions: the technological capability to
              build and deploy advanced AI systems, and the policy intelligence to ensure those systems
              serve humanity's most pressing challenges.
            </p>
            <p>
              At Gspec, our mandate has always extended beyond business efficiency. We believe artificial
              intelligence carries a responsibility to the communities, economies, and governance
              structures it touches. The Meridian Council   whose researchers and policy experts work at
              the intersection of geopolitics, climate resilience, energy transition, and AI governance  
              gives that belief a rigorous, evidence-based foundation.
            </p>
          </div>
        </motion.section>

        <Divider />

        {/* ══ ABOUT THE MERIDIAN COUNCIL ════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE_OUT_QUART }}
          className="pb-2"
        >
          <h2 className="font-['Orbitron',sans-serif] font-bold text-white mb-3" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)' }}>
            About The Meridian Council
          </h2>
          <p className="mb-6" style={{ fontSize: 'clamp(0.93rem, 1.7vw, 1.05rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
            The Meridian Council is a nonpartisan platform that advances rigorous, solutions-oriented
            research at the intersection of global politics, climate change, and the evolving dynamics of
            energy and conflict. Their mission is to inform decision-makers, elevate public discourse, and
            catalyze policy pathways toward a just, resilient, and sustainable future.
          </p>
          <p className="mb-5" style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Three primary pillars
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                Icon: BookOpen,
                accent: '#3BF0FF',
                title: 'Research & Publications',
                body: 'Evidence-based policy briefs, toolkits, and reports on climate resilience, AI governance, energy transition, and global security.',
              },
              {
                Icon: Users,
                accent: '#7B5EFF',
                title: 'Dialogue & Convening',
                body: 'Roundtables, public forums, and conferences connecting policymakers, researchers, NGOs, and civil society leaders worldwide.',
              },
              {
                Icon: Briefcase,
                accent: '#B829F7',
                title: 'Strategic Advisory',
                body: 'Data-driven guidance for governments, multilateral institutions, and private entities navigating geopolitical and environmental transformation.',
              },
            ].map(({ Icon, accent, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: EASE_OUT_QUART }}
                whileHover={{ y: -3 }}
                className="rounded-2xl p-5 relative"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${accent}22`,
                }}
              >
                <div className="absolute left-0 top-[15%] bottom-[15%] w-[2px] rounded-full"
                  style={{ background: `linear-gradient(to bottom, ${accent}99, ${accent}20, transparent)` }} />
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}>
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <h3 className="font-['Orbitron',sans-serif] font-bold text-white text-sm mb-2">{title}</h3>
                <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Divider />

        {/* ══ WHAT THIS PARTNERSHIP MEANS ═══════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE_OUT_QUART }}
          className="pb-2"
        >
          <h2 className="font-['Orbitron',sans-serif] font-bold text-white mb-3" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)' }}>
            What This Partnership Means for Our Mission
          </h2>
          <p className="mb-6" style={{ fontSize: 'clamp(0.93rem, 1.7vw, 1.05rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
            This collaboration marks an evolution in how Gspec Technologies approaches its work. Our AI
            solutions have always been engineered for precision and scale   but through this partnership,
            they will now be shaped by one of the most credible policy research platforms operating
            globally today.
          </p>

          <div className="space-y-3">
            {[
              {
                accent: '#3BF0FF',
                label: 'AI for Governance',
                body: 'Leveraging our NLP, predictive analytics, and generative AI capabilities to support governments and institutions in designing more effective public policy.',
              },
              {
                accent: '#7B5EFF',
                label: 'AI for Climate & Energy',
                body: 'Deploying machine learning and computer vision solutions aligned with Meridian\'s green energy transition research   from predictive grid management to inclusive rural energy access.',
              },
              {
                accent: '#B829F7',
                label: 'AI for Financial Inclusion',
                body: 'Building predictive finance tools for underserved markets, informed by Meridian\'s on-the-ground research into inclusive economic development.',
              },
              {
                accent: '#F729A8',
                label: 'AI Ethics & Policy Alignment',
                body: 'Ensuring that every solution we deploy meets the highest standards of transparency, fairness, and accountability   backed by Meridian\'s expertise in AI governance frameworks.',
              },
            ].map(({ accent, label, body }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.55, ease: EASE_OUT_QUART }}
                className="flex gap-4 rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${accent}1A` }}
              >
                <div className="w-[3px] rounded-full flex-shrink-0 mt-1" style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}40)`, minHeight: '40px' }} />
                <div>
                  <span className="font-semibold text-white" style={{ fontSize: '14.5px' }}>{label}: </span>
                  <span style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>{body}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Divider />

        {/* ══ OUR SHARED VISION ═════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE_OUT_QUART }}
          className="pb-2"
        >
          <h2 className="font-['Orbitron',sans-serif] font-bold text-white mb-4" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)' }}>
            Our Shared Vision
          </h2>
          <div className="space-y-4" style={{ fontSize: 'clamp(0.93rem, 1.7vw, 1.05rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
            <p>
              The convergence of Gspec Technologies' AI capability and The Meridian Council's policy
              intelligence creates something rare: a technology-research partnership that is designed,
              from the outset, to benefit not just businesses   but communities, institutions, and the
              global commons.
            </p>
            <p>
              We believe the most impactful AI is not the AI that processes the most data, but the AI
              that understands the world it operates in.
            </p>
            <p>
              We invite our clients, partners, and stakeholders to join us in following the work that
              emerges from this partnership   and to explore how AI, guided by rigorous research and
              global purpose, can reshape the challenges of our time.
            </p>
          </div>

          {/* Meridian link */}
          <p className="mt-6 text-center" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
  Learn more about The Meridian Council at{' '}
  <a 
    href="https://meridiancouncil.org" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: 'rgba(180,220,255,0.6)', textDecoration: 'underline', cursor: 'pointer' }}
  >
    meridiancouncil.org
  </a>
</p>
        </motion.section>

        {/* ── Joint statement footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[rgba(255,255,255,0.06)]"
        >
          <div>
            <p className="font-['Orbitron',sans-serif] text-xs text-[#3BF0FF] tracking-widest uppercase mb-0.5">
              Gspec Technologies
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
              & The Meridian Council   Joint Statement, March 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#F729A8', boxShadow: '0 0 8px #F729A8' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Official</span>
          </div>
        </motion.div>

        {/* ── Back CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 mb-16 flex justify-center"
        >
          <motion.a
            href="/"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </motion.a>
        </motion.div>

      </div>

      {/* ── Scanlines ── */}
      <div className="fixed inset-0 pointer-events-none scanlines opacity-25" />
    </div>
  );
}
