/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EFG DESIGN SYSTEM — APPLE-GRADE FOUNDATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This is the single source of truth.
 * Every component pulls from here. No exceptions.
 * 
 * Inspired by: Apple.com, Linear.app, Vercel.com, Stripe.com
 */

// ═══════════════════════════════════════════════════════════════════════════
// COLORS — The Brand DNA
// ═══════════════════════════════════════════════════════════════════════════

export const colors = {
  // The Blacks — Depth hierarchy
  black: {
    void: "#0A0A0A",        // Deepest canvas
    base: "#111111",        // Section alternation
    card: "#141414",        // Interactive surfaces
    hover: "#1A1A1A",       // Hover state
    elevated: "#1E1E1E",    // Modals, dropdowns
  },

  // The Orange — Brand heartbeat
  orange: {
    core: "#E8651A",        // Primary brand
    bright: "#FF7A2E",      // Hover/emphasis
    muted: "#C4530F",       // Pressed state
    glow: "rgba(232, 101, 26, 0.35)", // Shadows
    subtle: "rgba(232, 101, 26, 0.08)", // Backgrounds
  },

  // The Whites — Voice spectrum
  white: {
    pure: "#FFFFFF",        // Headlines
    primary: "#F5F5F7",     // Apple-style off-white
    secondary: "#A1A1A6",   // Body text (Apple gray)
    tertiary: "#6E6E73",    // Metadata
    muted: "#48484A",       // Disabled
  },

  // Borders — Barely visible, always felt
  border: {
    subtle: "rgba(255, 255, 255, 0.06)",
    default: "rgba(255, 255, 255, 0.08)",
    hover: "rgba(255, 255, 255, 0.12)",
    focus: "rgba(255, 255, 255, 0.20)",
  },

  // Event Series — Distinct identities
  series: {
    cyber: "#01BBF5",       // Cyan
    ot: "#D34B9A",          // Pink
    dataAi: "#0F735E",      // Emerald
    opex: "#7C3AED",        // Violet
  },

  // Semantic
  success: "#30D158",
  warning: "#FFD60A",
  error: "#FF453A",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY — The Voice
// ═══════════════════════════════════════════════════════════════════════════

export const typography = {
  // Font families
  fonts: {
    display: "var(--font-display), SF Pro Display, -apple-system, sans-serif",
    body: "var(--font-outfit), SF Pro Text, -apple-system, sans-serif",
    mono: "SF Mono, JetBrains Mono, monospace",
  },

  // Font sizes — Apple-inspired scale
  size: {
    xs: "0.75rem",     // 12px
    sm: "0.875rem",    // 14px
    base: "1rem",      // 16px
    lg: "1.125rem",    // 18px
    xl: "1.25rem",     // 20px
    "2xl": "1.5rem",   // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",     // 48px
    "6xl": "3.75rem",  // 60px
    "7xl": "4.5rem",   // 72px
    "8xl": "6rem",     // 96px
    "9xl": "8rem",     // 128px
  },

  // Heading sizes — Fluid responsive
  heading: {
    hero: "clamp(2.5rem, 6vw, 5rem)",      // 40px → 80px
    h1: "clamp(2rem, 5vw, 4rem)",          // 32px → 64px
    h2: "clamp(1.75rem, 4vw, 3rem)",       // 28px → 48px
    h3: "clamp(1.5rem, 3vw, 2.25rem)",     // 24px → 36px
    h4: "clamp(1.25rem, 2.5vw, 1.75rem)",  // 20px → 28px
    h5: "clamp(1.125rem, 2vw, 1.5rem)",    // 18px → 24px
  },

  // Line heights
  leading: {
    none: 1,
    tight: 1.05,      // Headlines
    snug: 1.2,        // Subheadings
    normal: 1.5,      // Body
    relaxed: 1.625,   // Long-form
    loose: 2,         // Spacious
  },

  // Letter spacing
  tracking: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
    eyebrow: "0.2em",  // For labels/eyebrows
  },

  // Font weights
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SPACING — The Rhythm (8px base grid)
// ═══════════════════════════════════════════════════════════════════════════

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",   // 2px
  1: "0.25rem",      // 4px
  1.5: "0.375rem",   // 6px
  2: "0.5rem",       // 8px ← base unit
  2.5: "0.625rem",   // 10px
  3: "0.75rem",      // 12px
  3.5: "0.875rem",   // 14px
  4: "1rem",         // 16px
  5: "1.25rem",      // 20px
  6: "1.5rem",       // 24px
  7: "1.75rem",      // 28px
  8: "2rem",         // 32px
  9: "2.25rem",      // 36px
  10: "2.5rem",      // 40px
  11: "2.75rem",     // 44px
  12: "3rem",        // 48px
  14: "3.5rem",      // 56px
  16: "4rem",        // 64px
  20: "5rem",        // 80px
  24: "6rem",        // 96px
  28: "7rem",        // 112px
  32: "8rem",        // 128px
  36: "9rem",        // 144px
  40: "10rem",       // 160px
  44: "11rem",       // 176px
  48: "12rem",       // 192px
  52: "13rem",       // 208px
  56: "14rem",       // 224px
  60: "15rem",       // 240px
  64: "16rem",       // 256px
  72: "18rem",       // 288px
  80: "20rem",       // 320px
  96: "24rem",       // 384px

  // Section padding — vertical rhythm
  section: {
    sm: "clamp(3rem, 8vw, 5rem)",      // Small sections
    md: "clamp(4rem, 10vw, 7rem)",     // Medium sections
    lg: "clamp(5rem, 12vw, 9rem)",     // Large sections
    xl: "clamp(6rem, 14vw, 11rem)",    // Hero-level
  },

  // Container widths
  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
    full: "100%",
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// BORDERS & RADII — The Shape Language
// ═══════════════════════════════════════════════════════════════════════════

export const radius = {
  none: "0",
  sm: "4px",         // Small elements
  md: "8px",         // Inputs, small cards
  lg: "12px",        // Cards
  xl: "16px",        // Large cards
  "2xl": "20px",     // Section cards — STANDARD
  "3xl": "24px",     // Feature cards
  full: "9999px",    // Pills, circles
  button: "60px",    // CTA buttons — STANDARD
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SHADOWS — Depth Perception
// ═══════════════════════════════════════════════════════════════════════════

export const shadows = {
  none: "none",
  
  // Subtle elevation (cards)
  sm: "0 1px 2px rgba(0, 0, 0, 0.25)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.25)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",

  // Brand glow shadows
  glow: {
    orange: "0 0 40px rgba(232, 101, 26, 0.35)",
    orangeHover: "0 0 60px rgba(232, 101, 26, 0.5)",
    cyber: "0 0 40px rgba(1, 187, 245, 0.35)",
    ot: "0 0 40px rgba(211, 75, 154, 0.35)",
    dataAi: "0 0 40px rgba(15, 115, 94, 0.35)",
    opex: "0 0 40px rgba(124, 58, 237, 0.35)",
  },

  // Inner shadows
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)",
  innerLg: "inset 0 4px 8px 0 rgba(0, 0, 0, 0.4)",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MOTION — The Apple Secret Sauce
// ═══════════════════════════════════════════════════════════════════════════

export const motion = {
  // Easing curves — Apple-inspired
  easing: {
    // Default smooth
    default: [0.25, 0.1, 0.25, 1],
    
    // Apple's signature spring
    spring: [0.68, -0.55, 0.27, 1.55],
    
    // Smooth ease-out (enters fast, settles slow)
    out: [0, 0, 0.2, 1],
    
    // Ease-in (starts slow, accelerates)
    in: [0.4, 0, 1, 1],
    
    // Ease-in-out (symmetric)
    inOut: [0.4, 0, 0.2, 1],
    
    // Apple's "anticipation" curve
    anticipate: [0.36, 0, 0.66, -0.56],
    
    // Buttery smooth
    smooth: [0.4, 0, 0, 1],
  },

  // Duration scale (in seconds)
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.25,
    slow: 0.35,
    slower: 0.5,
    slowest: 0.75,
    
    // Page transitions
    page: 0.6,
    
    // Reveal animations
    reveal: 0.8,
  },

  // Spring configs for Framer Motion
  spring: {
    // Snappy (buttons, toggles)
    snappy: { type: "spring", stiffness: 500, damping: 30 },
    
    // Bouncy (modals, cards)
    bouncy: { type: "spring", stiffness: 400, damping: 25 },
    
    // Smooth (page elements)
    smooth: { type: "spring", stiffness: 300, damping: 30 },
    
    // Gentle (backgrounds, large elements)
    gentle: { type: "spring", stiffness: 200, damping: 25 },
    
    // Slow (hero reveals)
    slow: { type: "spring", stiffness: 100, damping: 20 },
  },

  // Stagger delays (for lists)
  stagger: {
    fast: 0.03,
    normal: 0.05,
    slow: 0.08,
    slower: 0.12,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION PRESETS — Ready-to-use variants
// ═══════════════════════════════════════════════════════════════════════════

export const variants = {
  // Fade up (most common)
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: motion.easing.out }
    },
  },

  // Fade in (no movement)
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, ease: motion.easing.smooth }
    },
  },

  // Scale up (cards, images)
  scaleUp: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: motion.easing.out }
    },
  },

  // Slide in from left
  slideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: motion.easing.out }
    },
  },

  // Slide in from right
  slideRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: motion.easing.out }
    },
  },

  // Hero reveal (dramatic)
  heroReveal: {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1,
        ease: motion.easing.out,
        staggerChildren: 0.15 
      }
    },
  },

  // Stagger container
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: motion.stagger.normal,
        delayChildren: 0.1,
      },
    },
  },

  // Card hover
  cardHover: {
    rest: { 
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: motion.easing.out }
    },
    hover: { 
      scale: 1.02,
      y: -4,
      transition: { duration: 0.3, ease: motion.easing.out }
    },
  },

  // Button press
  buttonPress: {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },

  // Image reveal (with mask)
  imageReveal: {
    hidden: { 
      opacity: 0,
      clipPath: "inset(0 0 100% 0)"
    },
    visible: { 
      opacity: 1,
      clipPath: "inset(0 0 0 0)",
      transition: { 
        duration: 0.8,
        ease: motion.easing.out
      }
    },
  },

  // Text reveal (line by line)
  textReveal: {
    hidden: { 
      opacity: 0, 
      y: "100%"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: motion.easing.out
      }
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT STYLES — Standardized patterns
// ═══════════════════════════════════════════════════════════════════════════

export const components = {
  // Buttons
  button: {
    primary: {
      background: colors.orange.core,
      backgroundHover: colors.orange.bright,
      color: colors.white.pure,
      borderRadius: radius.button,
      padding: "16px 40px",
      fontSize: typography.size.base,
      fontWeight: typography.weight.semibold,
      shadow: shadows.glow.orange,
      shadowHover: shadows.glow.orangeHover,
    },
    secondary: {
      background: "transparent",
      border: `1px solid ${colors.border.default}`,
      borderHover: `1px solid ${colors.border.hover}`,
      color: colors.white.primary,
      borderRadius: radius.button,
      padding: "16px 40px",
      fontSize: typography.size.base,
      fontWeight: typography.weight.medium,
    },
    ghost: {
      background: "transparent",
      color: colors.white.secondary,
      colorHover: colors.white.pure,
      padding: "12px 24px",
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },
  },

  // Cards
  card: {
    background: colors.black.card,
    backgroundHover: colors.black.hover,
    border: `1px solid ${colors.border.subtle}`,
    borderHover: `1px solid ${colors.border.hover}`,
    borderRadius: radius["2xl"],
    padding: spacing[8],
    paddingLg: spacing[10],
  },

  // Inputs
  input: {
    background: colors.black.card,
    border: `1px solid ${colors.border.default}`,
    borderFocus: `1px solid ${colors.orange.core}`,
    borderRadius: radius.lg,
    padding: "16px 20px",
    fontSize: typography.size.base,
    color: colors.white.primary,
    placeholder: colors.white.tertiary,
  },

  // Eyebrow/Label
  eyebrow: {
    fontSize: "11px",
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.tracking.eyebrow,
    textTransform: "uppercase" as const,
    color: colors.orange.core,
  },

  // Section
  section: {
    paddingY: spacing.section.md,
    maxWidth: spacing.container["2xl"],
    paddingX: spacing[6],
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// BREAKPOINTS — Responsive design
// ═══════════════════════════════════════════════════════════════════════════

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Media query helpers
export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  "2xl": `@media (min-width: ${breakpoints["2xl"]})`,
  
  // Max-width queries (for mobile-first overrides)
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// Z-INDEX — Layer hierarchy
// ═══════════════════════════════════════════════════════════════════════════

export const zIndex = {
  behind: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
  max: 999,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT
// ═══════════════════════════════════════════════════════════════════════════

const designSystem = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  motion,
  variants,
  components,
  breakpoints,
  media,
  zIndex,
} as const;

export default designSystem;
