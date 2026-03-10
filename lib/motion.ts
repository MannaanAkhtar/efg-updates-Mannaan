/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EFG MOTION LIBRARY — APPLE-GRADE ANIMATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The difference between "good" and "premium" is in the motion.
 * Apple understands this. Now we do too.
 */

import type { Variants, Transition, TargetAndTransition } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// EASING CURVES — The Soul of Motion
// ═══════════════════════════════════════════════════════════════════════════

export const ease = {
  // Apple's signature curves
  appleDefault: [0.25, 0.1, 0.25, 1.0],
  appleEaseOut: [0.22, 1, 0.36, 1],
  appleEaseIn: [0.42, 0, 1, 1],
  
  // Premium curves
  smooth: [0.4, 0, 0, 1],
  smoothOut: [0, 0, 0.2, 1],
  smoothIn: [0.4, 0, 1, 1],
  
  // Dramatic curves
  dramatic: [0.6, 0.01, -0.05, 0.95],
  bounce: [0.68, -0.55, 0.27, 1.55],
  overshoot: [0.34, 1.56, 0.64, 1],
  
  // Subtle curves
  gentle: [0.25, 0.46, 0.45, 0.94],
  linear: [0, 0, 1, 1],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SPRING CONFIGURATIONS — Physics-based Motion
// ═══════════════════════════════════════════════════════════════════════════

export const springs = {
  // Micro-interactions (buttons, toggles)
  snappy: { 
    type: "spring" as const, 
    stiffness: 500, 
    damping: 30,
    mass: 0.8,
  },
  
  // Cards, modals
  bouncy: { 
    type: "spring" as const, 
    stiffness: 400, 
    damping: 25,
    mass: 1,
  },
  
  // Page elements
  smooth: { 
    type: "spring" as const, 
    stiffness: 300, 
    damping: 30,
    mass: 1,
  },
  
  // Large elements, backgrounds
  gentle: { 
    type: "spring" as const, 
    stiffness: 200, 
    damping: 25,
    mass: 1.2,
  },
  
  // Hero reveals, dramatic entrances
  slow: { 
    type: "spring" as const, 
    stiffness: 100, 
    damping: 20,
    mass: 1.5,
  },
  
  // Rubber band effect
  elastic: { 
    type: "spring" as const, 
    stiffness: 600, 
    damping: 15,
    mass: 0.8,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DURATIONS — Timing Scale
// ═══════════════════════════════════════════════════════════════════════════

export const duration = {
  instant: 0.1,
  micro: 0.15,
  fast: 0.2,
  normal: 0.3,
  medium: 0.4,
  slow: 0.5,
  slower: 0.6,
  slowest: 0.8,
  reveal: 1.0,
  dramatic: 1.2,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// STAGGER — List Animations
// ═══════════════════════════════════════════════════════════════════════════

export const stagger = {
  micro: 0.02,
  fast: 0.04,
  normal: 0.06,
  slow: 0.08,
  slower: 0.1,
  dramatic: 0.15,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TRANSITION PRESETS — Ready to use
// ═══════════════════════════════════════════════════════════════════════════

export const transitions = {
  // Default smooth
  default: {
    duration: duration.normal,
    ease: ease.smooth,
  } as Transition,
  
  // Fast feedback
  fast: {
    duration: duration.fast,
    ease: ease.smoothOut,
  } as Transition,
  
  // Slow reveal
  slow: {
    duration: duration.slow,
    ease: ease.appleEaseOut,
  } as Transition,
  
  // Hero/dramatic
  hero: {
    duration: duration.reveal,
    ease: ease.appleEaseOut,
  } as Transition,
  
  // With spring
  spring: springs.smooth,
  
  // Bouncy
  bounce: springs.bouncy,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS — The Animation Library
// ═══════════════════════════════════════════════════════════════════════════

// Fade Up (Most Common)
export const fadeUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 24,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: duration.medium,
      ease: ease.appleEaseOut,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: duration.fast,
      ease: ease.smoothIn,
    },
  },
};

// Fade In (No movement)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: ease.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: ease.smoothIn,
    },
  },
};

// Scale Up (Cards, Images)
export const scaleUp: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.92,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: duration.medium,
      ease: ease.appleEaseOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: duration.fast,
      ease: ease.smoothIn,
    },
  },
};

// Slide from Left
export const slideLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -32,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: duration.medium,
      ease: ease.appleEaseOut,
    },
  },
};

// Slide from Right
export const slideRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 32,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: duration.medium,
      ease: ease.appleEaseOut,
    },
  },
};

// Hero Reveal (Dramatic)
export const heroReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 48,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: duration.reveal,
      ease: ease.appleEaseOut,
    },
  },
};

// Text Line Reveal (Apple style)
export const textLineReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: "110%",
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: duration.slow,
      ease: ease.appleEaseOut,
    },
  },
};

// Image Reveal (With Clip Path)
export const imageReveal: Variants = {
  hidden: { 
    opacity: 0,
    scale: 1.1,
    filter: "blur(10px)",
  },
  visible: { 
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: duration.slower,
      ease: ease.appleEaseOut,
    },
  },
};

// Clip Reveal (Wipe animation)
export const clipReveal: Variants = {
  hidden: { 
    clipPath: "inset(0 0 100% 0)",
    opacity: 0,
  },
  visible: { 
    clipPath: "inset(0 0 0 0)",
    opacity: 1,
    transition: {
      duration: duration.slowest,
      ease: ease.appleEaseOut,
    },
  },
};

// Card Hover
export const cardHover: Variants = {
  rest: { 
    scale: 1,
    y: 0,
    boxShadow: "0 0 0 rgba(232, 101, 26, 0)",
  },
  hover: { 
    scale: 1.015,
    y: -6,
    boxShadow: "0 20px 40px rgba(232, 101, 26, 0.15)",
    transition: springs.smooth,
  },
};

// Button Interaction
export const buttonInteraction: Variants = {
  rest: { 
    scale: 1,
  },
  hover: { 
    scale: 1.03,
    transition: springs.snappy,
  },
  tap: { 
    scale: 0.97,
    transition: { duration: duration.instant },
  },
};

// Nav Item
export const navItem: Variants = {
  rest: { 
    color: "rgba(161, 161, 166, 1)", // white.secondary
  },
  hover: { 
    color: "rgba(255, 255, 255, 1)", // white.pure
    transition: { duration: duration.fast },
  },
};

// Stagger Container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.1,
    },
  },
};

// Fast Stagger Container
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.fast,
      delayChildren: 0.05,
    },
  },
};

// Slow Stagger Container
export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.slow,
      delayChildren: 0.15,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// HOVER EFFECTS — Micro-interactions
// ═══════════════════════════════════════════════════════════════════════════

export const hoverEffects = {
  // Subtle lift
  lift: {
    whileHover: { y: -4, transition: springs.snappy },
    whileTap: { y: 0 },
  },
  
  // Scale up
  grow: {
    whileHover: { scale: 1.02, transition: springs.snappy },
    whileTap: { scale: 0.98 },
  },
  
  // Glow
  glow: {
    whileHover: { 
      boxShadow: "0 0 40px rgba(232, 101, 26, 0.35)",
      transition: { duration: duration.normal },
    },
  },
  
  // Border glow
  borderGlow: {
    whileHover: { 
      borderColor: "rgba(232, 101, 26, 0.5)",
      transition: { duration: duration.normal },
    },
  },
  
  // Combined premium
  premium: {
    whileHover: { 
      y: -6,
      scale: 1.015,
      boxShadow: "0 20px 40px rgba(232, 101, 26, 0.2)",
      transition: springs.smooth,
    },
    whileTap: { 
      scale: 0.98,
      transition: { duration: duration.instant },
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS — Viewport-triggered
// ═══════════════════════════════════════════════════════════════════════════

export const scrollTrigger = {
  // Default viewport options
  viewport: { 
    once: true, 
    margin: "-80px",
    amount: 0.3,
  },
  
  // Full element visible
  viewportFull: { 
    once: true, 
    amount: 0.8,
  },
  
  // Trigger as soon as visible
  viewportEarly: { 
    once: true, 
    margin: "0px",
    amount: 0.1,
  },
  
  // Re-trigger on every scroll
  viewportRepeat: { 
    once: false, 
    margin: "-80px",
    amount: 0.3,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TRANSITION BUILDERS — Dynamic transitions
// ═══════════════════════════════════════════════════════════════════════════

export const createTransition = {
  // With delay
  withDelay: (delay: number, transition: Transition = transitions.default): Transition => ({
    ...transition,
    delay,
  }),
  
  // With stagger
  withStagger: (staggerDelay: number = stagger.normal): Transition => ({
    ...transitions.default,
    staggerChildren: staggerDelay,
  }),
  
  // Orchestrated (parent controls children)
  orchestrated: (
    staggerDelay: number = stagger.normal, 
    delayChildren: number = 0.1
  ): Transition => ({
    staggerChildren: staggerDelay,
    delayChildren,
    when: "beforeChildren",
  }),
  
  // Spring with config
  spring: (config: Partial<typeof springs.smooth> = {}): Transition => ({
    ...springs.smooth,
    ...config,
  }),
};

// ═══════════════════════════════════════════════════════════════════════════
// PARALLAX — Scroll-based transformations
// ═══════════════════════════════════════════════════════════════════════════

export const parallax = {
  // Subtle parallax (most elements)
  subtle: { y: [0, -20] },
  
  // Medium parallax
  medium: { y: [0, -40] },
  
  // Strong parallax
  strong: { y: [0, -80] },
  
  // Scale on scroll
  scaleIn: { scale: [0.8, 1], opacity: [0, 1] },
  
  // Rotate on scroll
  rotate: { rotate: [0, 5] },
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE TRANSITIONS — Route changes
// ═══════════════════════════════════════════════════════════════════════════

export const pageTransitions: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
  },
  enter: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.medium,
      ease: ease.appleEaseOut,
      when: "beforeChildren",
    },
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: {
      duration: duration.fast,
      ease: ease.smoothIn,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT
// ═══════════════════════════════════════════════════════════════════════════

const motionLib = {
  ease,
  springs,
  duration,
  stagger,
  transitions,
  variants: {
    fadeUp,
    fadeIn,
    scaleUp,
    slideLeft,
    slideRight,
    heroReveal,
    textLineReveal,
    imageReveal,
    clipReveal,
    cardHover,
    buttonInteraction,
    navItem,
    staggerContainer,
    staggerFast,
    staggerSlow,
  },
  hoverEffects,
  scrollTrigger,
  createTransition,
  parallax,
  pageTransitions,
} as const;

export default motionLib;
