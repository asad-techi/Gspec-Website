// Premium easing curves
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;
export const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1] as const;

// Card animation variants
export const cardVariants = {
  hiddenLeft: { 
    opacity: 0, 
    x: -80, 
    y: 20, 
    scale: 0.95,
    rotateY: -10,
  },
  hiddenRight: { 
    opacity: 0, 
    x: 80, 
    y: 20, 
    scale: 0.95,
    rotateY: 10,
  },
  hiddenBottom: {
    opacity: 0,
    y: 60,
    scale: 0.95,
  },
  hiddenTop: {
    opacity: 0,
    y: -60,
    scale: 0.95,
  },
  shown: { 
    opacity: 1, 
    x: 0, 
    y: 0, 
    scale: 1,
    rotateY: 0,
  },
};

export const cardTransition = {
  duration: 0.8,
  ease: EASE_OUT_EXPO,
};

// Robot spring configuration
export const robotSpring = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 1,
};

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
};

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: EASE_OUT,
    },
  },
};

// Slide up animation
export const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_OUT_EXPO,
    },
  },
};

// Slide in from left
export const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: EASE_OUT_EXPO,
    },
  },
};

// Slide in from right
export const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: EASE_OUT_EXPO,
    },
  },
};

// Scale animation
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: EASE_OUT_BACK,
    },
  },
};

// Text reveal animation
export const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: EASE_OUT,
    },
  }),
};

// Glow pulse animation
export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(59, 240, 255, 0.2)',
      '0 0 40px rgba(59, 240, 255, 0.4)',
      '0 0 20px rgba(59, 240, 255, 0.2)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Floating animation
export const floating = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Rotate animation
export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Path draw animation
export const pathDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: EASE_OUT_EXPO },
      opacity: { duration: 0.3 },
    },
  },
};

// Counter animation
export const counterAnimation = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: EASE_OUT_BACK,
    },
  },
};

// Hero text animation
export const heroText = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: EASE_OUT_EXPO,
    },
  },
};

// Particle animation config
export const particleConfig = {
  animate: {
    y: [-20, -100],
    opacity: [0, 1, 0],
    scale: [0.5, 1, 0.5],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeOut',
  },
};
