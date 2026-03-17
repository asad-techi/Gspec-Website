'use client';

import { motion } from 'framer-motion';

interface SectionBadgeProps {
  label: string;
  color?: string;
  align?: 'left' | 'center';
  icon?: React.ElementType;
}

export default function SectionBadge({
  label,
  color = '#3BF0FF',
  align = 'center',
  icon: Icon,
}: SectionBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-2.5 mb-6 relative overflow-hidden ${
        align === 'center' ? 'self-center' : ''
      }`}
    >
      {/* Top-left corner bracket */}
      <span className="relative flex-shrink-0 w-[14px] h-[14px]">
        <span
          className="absolute top-0 left-0 w-full h-[1.5px]"
          style={{ background: color }}
        />
        <span
          className="absolute top-0 left-0 h-full w-[1.5px]"
          style={{ background: color }}
        />
      </span>

      {/* Optional icon */}
      {Icon && (
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
      )}

      {/* Label */}
      <span
        className="font-['Rajdhani',sans-serif] text-[11px] font-semibold tracking-[0.45em] uppercase"
        style={{ color }}
      >
        {label}
      </span>

      {/* Bottom-right corner bracket */}
      <span className="relative flex-shrink-0 w-[14px] h-[14px]">
        <span
          className="absolute bottom-0 right-0 w-full h-[1.5px]"
          style={{ background: color }}
        />
        <span
          className="absolute bottom-0 right-0 h-full w-[1.5px]"
          style={{ background: color }}
        />
      </span>

      {/* Sweeping scan line */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color}30 50%, transparent 100%)`,
        }}
        animate={{ x: ['-110%', '110%'] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 3.5,
        }}
      />
    </motion.div>
  );
}
