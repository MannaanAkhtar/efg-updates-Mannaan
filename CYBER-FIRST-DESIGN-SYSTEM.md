# Cyber First Series — Design System Audit & Upgrade Plan

## Current State Analysis

### Color Palette (Inconsistent)
```
Primary:     #01BBF5 (Cyber Blue)
Bright:      #4DD4FF (used inconsistently)
Backgrounds: var(--black), var(--black-light), #050810, #030810, #141414
Text Grays:  #A0A0A0, #808080, #707070, #606060, #505050, #404040 (too many)
```

### Issues Identified

1. **6+ different background colors** — no clear hierarchy
2. **7+ gray text shades** — visual noise, no system
3. **Border radius varies:** 10, 12, 14, 16, 20px — inconsistent
4. **Border colors inconsistent:** some white-based, some cyan-based
5. **Section padding varies wildly** between components
6. **No unified hover states** — each component does its own thing

---

## Proposed Design System: "Cyber Premium"

### Color Tokens

```tsx
// ═══════════════════════════════════════════════════════════════
// CYBER FIRST — UNIFIED DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  // Brand
  cyan: "#01BBF5",
  cyanBright: "#4DD4FF",
  cyanDim: "#0199C7",
  cyanGlow: "rgba(1, 187, 245, 0.15)",
  
  // Backgrounds (3-tier system)
  bgDeep: "#030508",      // Deepest — hero sections, dramatic
  bgBase: "#080A0F",      // Standard section background
  bgElevated: "#0D1015",  // Cards, elevated surfaces
  bgCard: "#12151A",      // Interactive cards
  
  // Text (4-tier system only)
  textPrimary: "#F0F2F5",   // Headlines, important
  textSecondary: "#A0A5AD", // Body text
  textTertiary: "#606570",  // Captions, meta
  textMuted: "#404550",     // Disabled, subtle
  
  // Borders
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  borderDefault: "rgba(255, 255, 255, 0.10)",
  borderAccent: "rgba(1, 187, 245, 0.20)",
  borderAccentHover: "rgba(1, 187, 245, 0.40)",
};

const RADII = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

const SPACING = {
  section: "clamp(80px, 10vw, 120px)",
  sectionCompact: "clamp(60px, 8vw, 100px)",
  container: "clamp(20px, 4vw, 60px)",
};

const SHADOWS = {
  card: "0 4px 24px rgba(0, 0, 0, 0.3)",
  cardHover: "0 12px 48px rgba(0, 0, 0, 0.4), 0 0 60px rgba(1, 187, 245, 0.08)",
  glow: "0 0 60px rgba(1, 187, 245, 0.15)",
};
```

---

## Component Upgrades Required

### 1. Series Hero (`SeriesHero.tsx`)
- [ ] Standardize background to `bgDeep`
- [ ] Use `textPrimary` / `textSecondary` consistently
- [ ] Add subtle noise texture for premium feel
- [ ] Improve stat card styling

### 2. Editions Map (`EditionsMap.tsx`)
- [ ] Consistent card backgrounds (`bgCard`)
- [ ] Unified border treatment
- [ ] Better hover glow effects

### 3. Featured Speakers (`FeaturedSpeakers.tsx`)
- [ ] Card background: `bgCard` not `#141414`
- [ ] Consistent border radius: `lg` (16px)
- [ ] Unified hover state with cyan glow

### 4. Market Insights (`MarketInsights.tsx`)
- [ ] Stat blocks: cleaner backgrounds
- [ ] Better visual hierarchy

### 5. Sponsors Wall (`SponsorsWall.tsx`)
- [ ] Standardize logo card styling
- [ ] Better hover reveals

### 6. Individual Event Pages
- Kuwait 2026: Apply unified tokens
- Kenya 2026: Apply unified tokens

---

## Implementation Priority

### Phase 1: Core Tokens (30 min)
1. Create `lib/cyber-design-tokens.ts`
2. Export all color/spacing/shadow tokens

### Phase 2: Component Refactor (2-3 hours)
1. Update all components to import tokens
2. Replace hardcoded values
3. Standardize hover states

### Phase 3: Event Pages (1-2 hours)
1. Kuwait 2026 page alignment
2. Kenya 2026 page alignment

---

## Premium Enhancements

### Noise Texture (Film Grain)
```css
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
opacity: 0.02;
```

### Cyan Glow Effect
```css
box-shadow: 
  0 0 40px rgba(1, 187, 245, 0.12),
  0 0 80px rgba(1, 187, 245, 0.06);
```

### Glass Morphism Cards
```css
background: rgba(13, 16, 21, 0.8);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.06);
```

---

## Approval Required

Sir, shall I proceed with implementing this unified design system across all Cyber First pages and components?

Estimated time: 3-4 hours for full implementation.
