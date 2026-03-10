/**
 * Cyber First Design System Tokens
 * 
 * Unified design language for the Cyber First event series.
 * Use these tokens consistently across all Cyber First components.
 */

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTE
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  // Primary Accent - Cyber Blue
  cyan: "#01BBF5",
  cyanBright: "#4DD4FF",
  cyanDim: "#0199C7",
  cyanGlow: "rgba(1, 187, 245, 0.4)",
  cyanSubtle: "rgba(1, 187, 245, 0.08)",
  
  // Background Hierarchy (darkest to lightest)
  bgDeep: "#030508",
  bgBase: "#080A0F",
  bgElevated: "#0D1015",
  bgCard: "#12151A",
  bgCardHover: "#181B22",
  
  // Text Hierarchy
  textPrimary: "#F0F2F5",
  textSecondary: "#A0A5AD",
  textTertiary: "#606570",
  textMuted: "#404550",
  textAccent: "#01BBF5",
  
  // Borders
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  borderDefault: "rgba(255, 255, 255, 0.10)",
  borderAccent: "rgba(1, 187, 245, 0.20)",
  borderAccentHover: "rgba(1, 187, 245, 0.35)",
  
  // Status Colors
  success: "#22C55E",
  successBg: "rgba(34, 197, 94, 0.12)",
  successBorder: "rgba(34, 197, 94, 0.25)",
  
  // Glass Effects
  glassBg: "rgba(255, 255, 255, 0.03)",
  glassBgHover: "rgba(255, 255, 255, 0.06)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────

export const TYPOGRAPHY = {
  // Font Families (CSS Variables)
  fontDisplay: "var(--font-display)",
  fontBody: "var(--font-outfit)",
  
  // Hero Headings
  heroTitle: {
    fontSize: "clamp(48px, 7vw, 88px)",
    fontWeight: 800,
    letterSpacing: "-3px",
    lineHeight: 1.05,
  },
  
  // Section Headings
  sectionTitle: {
    fontSize: "clamp(30px, 3.5vw, 48px)",
    fontWeight: 800,
    letterSpacing: "-1.5px",
    lineHeight: 1.1,
  },
  
  // Card Headings
  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "-0.3px",
    lineHeight: 1.3,
  },
  
  // Labels
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "2.5px",
    textTransform: "uppercase" as const,
  },
  
  // Body Text
  bodyLarge: {
    fontSize: "16px",
    fontWeight: 300,
    lineHeight: 1.7,
  },
  
  bodyDefault: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  
  bodySmall: {
    fontSize: "13px",
    fontWeight: 400,
    lineHeight: 1.5,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SPACING & SIZING
// ─────────────────────────────────────────────────────────────────────────────

export const SPACING = {
  // Section Padding
  sectionPadding: "clamp(48px, 6vw, 80px)",
  sectionPaddingLarge: "clamp(80px, 10vw, 130px)",
  
  // Container
  maxWidth: "1320px",
  containerPadding: "clamp(20px, 4vw, 60px)",
  
  // Grid Gaps
  gridGapLarge: "24px",
  gridGapDefault: "16px",
  gridGapSmall: "12px",
  
  // Card Padding
  cardPadding: "32px 28px",
  cardPaddingCompact: "24px 20px",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────────────────────

export const RADIUS = {
  xs: "6px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  round: "50px",
  full: "9999px",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION
// ─────────────────────────────────────────────────────────────────────────────

export const ANIMATION = {
  // Premium Easing
  ease: [0.16, 1, 0.3, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  
  // Durations
  durationFast: 0.2,
  durationDefault: 0.4,
  durationSlow: 0.6,
  durationVerySlow: 0.8,
  
  // Stagger
  staggerDefault: 0.07,
  staggerFast: 0.04,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────────────────────────────────────

export const SHADOWS = {
  // Elevation
  sm: "0 4px 12px rgba(0, 0, 0, 0.2)",
  md: "0 8px 24px rgba(0, 0, 0, 0.3)",
  lg: "0 12px 40px rgba(0, 0, 0, 0.4)",
  xl: "0 20px 60px rgba(0, 0, 0, 0.5)",
  
  // Glow Effects
  cyanGlow: "0 0 20px rgba(1, 187, 245, 0.2)",
  cyanGlowStrong: "0 0 40px rgba(1, 187, 245, 0.3)",
  cyanGlowHover: "0 12px 40px rgba(1, 187, 245, 0.15)",
  
  // Card Shadows
  cardHover: "0 12px 40px rgba(0, 0, 0, 0.3)",
  cardLift: "0 16px 48px rgba(0, 0, 0, 0.35)",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// GRADIENTS
// ─────────────────────────────────────────────────────────────────────────────

export const GRADIENTS = {
  // Background Gradients
  heroOverlay: `linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(1,187,245,0.03) 40%, rgba(10,10,10,0.95) 100%)`,
  sectionGlow: `radial-gradient(ellipse 60% 40% at 50% 80%, rgba(1,187,245,0.06) 0%, transparent 70%)`,
  cardOverlay: `linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 40%, transparent 70%)`,
  
  // Accent Gradients
  cyanLine: `linear-gradient(90deg, ${COLORS.cyan}, transparent)`,
  cyanBar: `linear-gradient(90deg, ${COLORS.cyan}, rgba(1, 187, 245, 0.4))`,
  
  // Text Gradients
  shimmerText: `linear-gradient(110deg, ${COLORS.cyanBright} 0%, #fff 50%, ${COLORS.cyanBright} 100%)`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// EFFECTS
// ─────────────────────────────────────────────────────────────────────────────

export const EFFECTS = {
  // Film Grain Texture
  filmGrain: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  filmGrainOpacity: 0.025,
  
  // Backdrop Blur
  blur: "blur(16px)",
  blurStrong: "blur(24px)",
  
  // Glass Morphism
  glassMorphism: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// HOVER STATES
// ─────────────────────────────────────────────────────────────────────────────

export const HOVER = {
  lift: "translateY(-3px)",
  liftSmall: "translateY(-2px)",
  scale: "scale(1.02)",
  
  cardTransition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  buttonTransition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT PRESETS
// ─────────────────────────────────────────────────────────────────────────────

export const COMPONENTS = {
  // Section Label with lines
  sectionLabel: {
    lineWidth: 30,
    lineHeight: 1,
    gap: 12,
  },
  
  // Primary Button
  primaryButton: {
    padding: "14px 32px",
    borderRadius: RADIUS.round,
    background: COLORS.cyan,
    hoverBackground: COLORS.cyanBright,
    color: "#0A0A0A",
    fontWeight: 600,
    fontSize: "15px",
  },
  
  // Secondary Button
  secondaryButton: {
    padding: "14px 28px",
    borderRadius: RADIUS.round,
    background: "transparent",
    border: `1px solid ${COLORS.borderAccent}`,
    hoverBackground: "rgba(1, 187, 245, 0.08)",
    color: COLORS.cyan,
    fontWeight: 500,
    fontSize: "14px",
  },
  
  // Card Base
  card: {
    padding: "32px 28px",
    borderRadius: RADIUS.lg,
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.borderSubtle}`,
    hoverBorder: `1px solid ${COLORS.borderAccent}`,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CSS HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a section wrapper style
 */
export const sectionStyle = (variant: "dark" | "darker" = "dark") => ({
  background: variant === "darker" ? COLORS.bgDeep : COLORS.bgBase,
  padding: `${SPACING.sectionPadding} 0`,
});

/**
 * Generate a container style
 */
export const containerStyle = () => ({
  maxWidth: SPACING.maxWidth,
  margin: "0 auto",
  padding: `0 ${SPACING.containerPadding}`,
});

/**
 * Generate section header styles
 */
export const sectionHeaderStyle = () => ({
  textAlign: "center" as const,
  marginBottom: "56px",
});

// ─────────────────────────────────────────────────────────────────────────────
// PREMIUM IMAGE URLS (Cybersecurity / Tech)
// ─────────────────────────────────────────────────────────────────────────────

export const PREMIUM_IMAGES = {
  // Hero Backgrounds
  heroNetworkDark: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
  heroDataCenter: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
  heroCyberAbstract: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80",
  heroServerRoom: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&q=80",
  
  // Section Backgrounds
  sectionCode: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
  sectionNetwork: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
  sectionLock: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
  
  // Conference/Event
  conferenceKeynote: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  conferenceMeeting: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
  conferenceNetworking: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
  
  // City Backgrounds
  kuwaitCity: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1200&q=80",
  abuDhabi: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
  doha: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80",
  riyadh: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600&q=80",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ALL
// ─────────────────────────────────────────────────────────────────────────────

const CYBER_TOKENS = {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  ANIMATION,
  SHADOWS,
  GRADIENTS,
  EFFECTS,
  HOVER,
  COMPONENTS,
  PREMIUM_IMAGES,
} as const;

export default CYBER_TOKENS;
