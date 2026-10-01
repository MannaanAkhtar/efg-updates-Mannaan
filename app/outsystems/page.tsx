"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  submitForm,
  isWorkEmail,
  validatePhone,
  COUNTRY_CODES,
  type CountryCode,
} from "@/lib/form-helpers";

/* ═══════════════════════════════════════════════════════════════════════════
   ONE Executive Day KSA — OutSystems
   JW Marriott Hotel Riyadh · 19 October 2026 · 09:00–16:00

   Visual language is OutSystems' own: a near-black page, pure-black panels,
   and the red → magenta → blue spectrum used as a border and an accent rather
   than a fill. Nothing here is borrowed from the EFG event-page system.
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Tokens ──────────────────────────────────────────────────────────────────
const INK = "#171717";        // page ground
const PANEL = "#000000";      // cards, hero, agenda rows
const PANEL_2 = "#0C0C0C";    // raised panel
const LINE = "rgba(255,255,255,0.10)";
const TXT = "#FFFFFF";
const TXT_70 = "rgba(255,255,255,0.72)";
const TXT_45 = "rgba(255,255,255,0.45)";

const RED = "#F0323C";
const MAGENTA = "#D13CC4";
const BLUE = "#5566E8";
const SPECTRUM = `linear-gradient(90deg, ${RED} 0%, ${MAGENTA} 52%, ${BLUE} 100%)`;

const FD = "var(--font-display)";
const FO = "var(--font-outfit)";
const EASE = [0.16, 1, 0.3, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const OUTSYSTEMS_MARK = `${S3}/logos/outsystems.png`;
// Riyadh skyline key visual. The left half is near-black, so the headline sits
// over it unaided; the scrim below only carries the mid-band and the stacked
// mobile layout, where the art slides under the text.
const HERO_BG = `${S3}/heros/image+(7).png`;

const EVENT_NAME = "ONE Executive Day KSA";
const EVENT_DATE = "19 October 2026";
const EVENT_TIME = "09:00–16:00";
const EVENT_VENUE = "JW Marriott Hotel Riyadh";

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#why", label: "Why Attend" },
  { href: "#agenda", label: "Agenda" },
  { href: "#sponsors", label: "Sponsors" },
];

// ─── Why attend ──────────────────────────────────────────────────────────────
const WHY = [
  {
    title: "Gain Exclusive Executive Insights",
    body: "Hear from OutSystems leadership as they share their vision for agentic AI systems in enterprise software development.",
  },
  {
    title: "Discover AI-Powered App Generation",
    body: "Get an exclusive look at Agent Workbench — turning ideas into intelligent, enterprise-grade applications and AI agents at speed.",
  },
  {
    title: "Learn from Industry Leaders",
    body: "Engage in panel discussions with customers and experts who are transforming their businesses with OutSystems.",
  },
  {
    title: "Experience Live Demos & High-Impact Networking",
    body: "See OutSystems in action through live product demos, then connect with peers over a networking lunch.",
  },
];

// ─── Agenda ──────────────────────────────────────────────────────────────────
// Every row carries its full detail inline. The source site hid the longer
// sessions behind a "view more" dialog; here the bullets are always on show.
type Slot = {
  time: string;
  label: string;
  title?: string;
  body?: string;
  points?: string[];
  kind: "break" | "keynote" | "session" | "panel" | "award";
};

const AGENDA: Slot[] = [
  { time: "09:00–09:30", label: "Arrival and Registration", kind: "break" },
  { time: "09:30–09:40", label: "Welcome Remarks", kind: "session" },
  { time: "09:40–10:00", label: "Executive Keynote: Building the Agentic Future", kind: "keynote" },
  {
    time: "10:00–10:10",
    label: "Customer Story",
    title: "Delivering Impact at Scale: Accelerating Transformation in the Kingdom",
    body: "A real-world success story from a Saudi organization leveraging OutSystems to modernize mission-critical systems and deliver measurable outcomes aligned with national priorities.",
    kind: "session",
  },
  {
    time: "10:10–10:35",
    label: "Platform Showcase",
    title: "The Rise of the Agentic Enterprise: OutSystems Agent Workbench in Action",
    body: "Enabling Saudi enterprises to operationalize AI responsibly — driving productivity, governance, and innovation at scale.",
    kind: "keynote",
  },
  {
    time: "10:35–11:05",
    label: "Thought Leadership Session (Envnt)",
    title: "From Digital to Intelligent: Driving National Transformation through AI & Automation",
    body: "Exploring how automation and AI are redefining service delivery across government and strategic sectors.",
    kind: "session",
  },
  { time: "11:05–11:30", label: "Coffee & Networking Break", kind: "break" },
  {
    time: "11:30–12:00",
    label: "Executive Panel (Government)",
    title: "Modernizing Mission-Critical Government Systems to Deliver Vision 2030",
    body: "How public sector leaders are strengthening national capabilities by transforming core government platforms to enable:",
    points: [
      "Secure and sovereign digital infrastructure",
      "Scalable, future-ready regulatory and service frameworks",
      "Resilient, citizen-centric services that support national transformation priorities",
    ],
    kind: "panel",
  },
  {
    time: "12:00–12:30",
    label: "Industry Session (Rihal)",
    title: "Powering the Future: Innovation & Modernization Across Energy and Public Sector",
    body: "Driving agility and resilience across Saudi Arabia's most strategic sectors.",
    kind: "session",
  },
  { time: "12:30–13:00", label: "Coffee & Networking Break", kind: "break" },
  {
    time: "13:00–13:30",
    label: "Executive Panel (BFSI)",
    title: "Reinventing Financial Services: AI-Led Modernization for a Digital Economy",
    body: "Supporting Saudi Arabia's ambition to become a leading financial hub through:",
    points: ["Intelligent platforms", "Speed of innovation", "Regulatory-aligned resilience"],
    kind: "panel",
  },
  {
    time: "13:30–14:30",
    label: "Partner Panel",
    title: "Enabling Vision 2030: Building the Agentic Enterprise through Ecosystem Collaboration",
    body: "How technology and delivery partners are accelerating transformation across giga-projects and national initiatives.",
    kind: "panel",
  },
  {
    time: "14:30–15:00",
    label: "Awards & Recognition",
    title: "Celebrating Digital Excellence in the Kingdom",
    kind: "award",
  },
  { time: "15:00–16:00", label: "Closing & Networking Lunch", kind: "break" },
];

const SLOT_ACCENT: Record<Slot["kind"], string> = {
  break: "rgba(255,255,255,0.28)",
  session: MAGENTA,
  keynote: RED,
  panel: BLUE,
  award: "#E8B23C",
};

// ─── Sponsors ────────────────────────────────────────────────────────────────
// `logo` is null wherever we do not yet hold the artwork; those render as a
// wordmark tile so the tier is complete and correct while files are chased.
/**
 * `h` is the logo's rendered cap height in pixels at Gold scale. Every mark is
 * a different shape — Link Development is near-square at 1.41:1, the Blackstone
 * lockup is 7.9:1 — so a single max-height would print the square ones several
 * times the area of the wide ones. Each `h` is instead derived from the
 * artwork's own aspect ratio to hold the *optical area* roughly constant
 * (h = sqrt(7000 / aspect), then clamped so nothing outgrows its tile's width).
 * Re-measure the source file if a logo is ever swapped.
 */
type Sponsor = { name: string; note?: string; logo: string | null; h: number };
type SponsorTier = {
  tier: string;
  /** Size multiplier against Gold, so the tier a sponsor bought reads at a glance. */
  scale: number;
  /** Tile flex-basis in px. */
  tile: number;
  /** Tile min-height in px. */
  tileH: number;
  items: Sponsor[];
};

const S3_SPONSORS = `${S3}/logos`;

/** Widest the row may run: three tiles plus the two gaps between them. */
const SPONSOR_GAP = 26;
function rowWidth(t: SponsorTier) {
  const across = Math.min(t.items.length, 3);
  return across * t.tile + (across - 1) * SPONSOR_GAP;
}

const SPONSOR_TIERS: SponsorTier[] = [
  {
    tier: "Global Sponsor",
    scale: 1.18,
    tile: 300,
    tileH: 150,
    items: [{ name: "AWS", logo: `${S3_SPONSORS}/AWS.png`, h: 74 }],
  },
  {
    tier: "Platinum Sponsors",
    scale: 1.06,
    tile: 270,
    tileH: 140,
    items: [
      { name: "Rihal", logo: `${S3_SPONSORS}/Rihal.png`, h: 69 },
      { name: "Envnt", logo: `${S3_SPONSORS}/envnt.png`, h: 46 },
    ],
  },
  {
    tier: "Gold Sponsors",
    scale: 1,
    tile: 290,
    tileH: 132,
    items: [
      { name: "adree", logo: `${S3_SPONSORS}/adree.png`, h: 55 },
      // The "a Beyon Solutions company", "A Duroob Company" and "An Intro Group
      // company" endorsements are set inside the artwork itself, so they are no
      // longer carried as separate `note` text.
      { name: "Link Development", logo: `${S3_SPONSORS}/Link_Development.png`, h: 78 },
      { name: "4matex", logo: `${S3_SPONSORS}/4matex.png`, h: 53 },
      {
        // The positive lockup, not the reversed one: these tiles are white, and
        // inverting the reversed file turned the brand's cyan hexagon orange.
        name: "Blackstone eIT",
        logo: `${S3}/sponsors-logo/Blackstone+eIT+Logo+Main+No+Slogan+RGB.png`,
        h: 32,
      },
      { name: "KPMG", logo: `${S3_SPONSORS}/KPMG.png`, h: 63 },
    ],
  },
  {
    tier: "Silver Sponsors",
    scale: 0.92,
    tile: 240,
    tileH: 118,
    items: [
      { name: "DigiNation", logo: `${S3_SPONSORS}/DigiNation.png`, h: 45 },
      { name: "Advansys", logo: `${S3_SPONSORS}/Advansys.png`, h: 47 },
    ],
  },
];

// ─── Register form options ───────────────────────────────────────────────────
const INDUSTRIES = [
  "Government & Public Sector",
  "Banking, Financial Services & Insurance",
  "Energy & Utilities",
  "Telecommunications",
  "Healthcare",
  "Education",
  "Retail & Consumer",
  "Transportation & Logistics",
  "Manufacturing",
  "Real Estate & Construction",
  "Technology & Software",
  "Other",
];

const COUNTRIES = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Bahrain",
  "Kuwait",
  "Oman",
  "Qatar",
  "Jordan",
  "Egypt",
  "United Kingdom",
  "United States",
  "Other",
];

// ─── Shared bits ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: FO,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: TXT_45,
      }}
    >
      <span aria-hidden style={{ width: 22, height: 2, borderRadius: 2, background: SPECTRUM }} />
      {children}
    </span>
  );
}

/** Black panel inside a 3px spectrum frame — the site's signature container. */
function SpectrumFrame({
  children,
  radius = 24,
  style,
}: {
  children: React.ReactNode;
  radius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ padding: 3, borderRadius: radius, background: SPECTRUM, ...style }}>
      <div style={{ borderRadius: radius - 3, background: PANEL, height: "100%" }}>{children}</div>
    </div>
  );
}

function CtaButton({
  href,
  children,
  solid,
}: {
  href: string;
  children: React.ReactNode;
  solid?: boolean;
}) {
  return (
    <a
      href={href}
      className={solid ? "os-cta os-cta-solid" : "os-cta os-cta-ghost"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FD,
        fontWeight: 700,
        fontSize: 16,
        padding: "15px 34px",
        borderRadius: 9999,
        textDecoration: "none",
        color: TXT,
        border: solid ? "none" : `1.5px solid ${TXT}`,
        background: solid ? RED : "transparent",
      }}
    >
      {children}
    </a>
  );
}

/**
 * Business-email check.
 *
 * `isWorkEmail` in lib/form-helpers.ts matches an exact domain list, which
 * leaves two gaps: it never checks the address is well-formed (it only looks
 * for an "@", so `a@b` passes), and it misses the national variants of the big
 * consumer providers (`hotmail.fr`, `yahoo.com.au` and so on). Shape is tested
 * first, then those variants by their provider label, and the shared list still
 * runs last so a one-off domain only ever needs adding in one place.
 */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
const FREE_PROVIDER =
  /^(?:gmail|googlemail|yahoo|ymail|rocketmail|hotmail|outlook|live|msn|aol|icloud|me|pm|proton|protonmail|gmx|web|mail|yandex|zoho|rediff|rediffmail|qq|163|126|naver|hanmail|daum)\.[a-z.]{2,8}$/;
const DISPOSABLE_PROVIDER =
  /^(?:mailinator|guerrillamail|tempmail|temp-mail|10minutemail|yopmail|throwawaymail|trashmail|sharklasers|getnada|dispostable|maildrop|mailnesia|fakeinbox)\./;

function businessEmailError(raw: string): string | null {
  const email = raw.trim();
  if (!email) return "Business email is required";
  if (!EMAIL_SHAPE.test(email)) return "Enter a valid email address";
  const domain = email.split("@")[1].toLowerCase();
  if (FREE_PROVIDER.test(domain) || DISPOSABLE_PROVIDER.test(domain) || !isWorkEmail(email)) {
    return "Please use your work email — free providers are not accepted";
  }
  return null;
}

/**
 * Hold the phone field to exactly the digits the selected country expects.
 *
 * Clamping alone would silently truncate the two ways people habitually type a
 * number — with the dialling code (+966 50…) or with the national trunk zero
 * (050…) — turning a correct number into a wrong one, so both are stripped
 * before the clamp rather than after.
 */
function normalizePhoneInput(raw: string, country: CountryCode): string {
  let digits = raw.replace(/\D/g, "");
  const dial = country.code.replace(/\D/g, "");
  if (digits.length > country.length && digits.startsWith(dial)) {
    digits = digits.slice(dial.length);
  }
  while (digits.length > country.length && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, country.length);
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: FO, fontSize: 13, fontWeight: 600, color: TXT }}>
        {label}
        {required && <span style={{ color: RED, marginLeft: 2 }}>*</span>}
      </span>
      {children}
      {error ? (
        <span style={{ fontFamily: FO, fontSize: 12, color: "#ff8080" }}>{error}</span>
      ) : (
        hint && <span style={{ fontFamily: FO, fontSize: 12, color: TXT_45 }}>{hint}</span>
      )}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: FO,
  fontSize: 14.5,
  color: TXT,
  background: "rgba(255,255,255,0.045)",
  border: `1px solid ${LINE}`,
  borderRadius: 10,
  padding: "12px 14px",
  width: "100%",
  outline: "none",
};

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);

  // Fixed, not sticky. globals.css:88 sets `overflow-x: hidden` on body, which
  // makes body a scroll container; a `position: sticky` descendant then has no
  // scrollport of its own to stick to and simply scrolls away. /algosec and
  // /intwo take the same route. The spacer below replaces the height the bar
  // gives up by leaving the flow, and is measured rather than hard-coded so a
  // wrapped bar can never sit over the hero.
  const NAV_BORDER = 1;
  const barRef = useRef<HTMLDivElement>(null);
  const [barH, setBarH] = useState(78);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const sync = () => setBarH(el.offsetHeight);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `${NAV_BORDER}px solid ${LINE}`,
      }}
    >
      <div
        ref={barRef}
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px clamp(18px,4vw,48px)",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <a href="#top" aria-label={`${EVENT_NAME}, back to top`} style={{ textDecoration: "none", flex: "none" }}>
          <span className="os-wordmark">
            <span className="os-wordmark-one">one</span>
            <span className="os-wordmark-rest">Executive Day</span>
          </span>
        </a>

        <nav className="os-nav-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="os-nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#register" className="os-nav-cta">
          Register Now
        </a>

        <button
          type="button"
          className="os-burger"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span style={{ display: "block", width: 20, height: 2, background: TXT, borderRadius: 2 }} />
          <span style={{ display: "block", width: 20, height: 2, background: TXT, borderRadius: 2 }} />
          <span style={{ display: "block", width: 20, height: 2, background: TXT, borderRadius: 2 }} />
        </button>
      </div>

      {open && (
        <div className="os-mobile-menu">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="os-mobile-link">
              {l.label}
            </a>
          ))}
          <a href="#register" onClick={() => setOpen(false)} className="os-mobile-link os-mobile-cta">
            Register Now
          </a>
        </div>
      )}
    </header>
    <div aria-hidden style={{ height: barH + NAV_BORDER }} />
    </>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="top" style={{ padding: "clamp(28px,4vw,56px) clamp(18px,4vw,48px) clamp(14px,2vw,24px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SpectrumFrame radius={26}>
          <div className="os-hero-inner">
            <div aria-hidden className="os-hero-art" style={{ backgroundImage: `url("${HERO_BG}")` }} />
            <div aria-hidden className="os-hero-scrim" />

            <div style={{ position: "relative", zIndex: 2, maxWidth: 620 }}>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                style={{
                  fontFamily: FD,
                  fontWeight: 400,
                  fontSize: "clamp(34px,5vw,64px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: TXT,
                  margin: "0 0 20px",
                  textWrap: "balance",
                }}
              >
                {EVENT_NAME}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
              >
                <p style={{ fontFamily: FO, fontSize: "clamp(17px,1.4vw,20px)", color: TXT, margin: "0 0 14px" }}>
                  {EVENT_VENUE}
                </p>
                <p style={{ fontFamily: FO, fontSize: "clamp(15px,1.2vw,17px)", color: TXT_70, margin: 0, lineHeight: 1.6 }}>
                  {EVENT_DATE}
                  <br />
                  {EVENT_TIME}
                </p>
                <p style={{ fontFamily: FO, fontSize: 13.5, color: TXT_45, margin: "12px 0 0" }}>
                  All times Arabia Standard Time (AST · UTC+3)
                </p>
                <div style={{ marginTop: 24 }}>
                  <CtaButton href="#register" solid>
                    Register Now
                  </CtaButton>
                </div>
              </motion.div>
            </div>

          </div>
        </SpectrumFrame>
      </div>
    </section>
  );
}

// ─── Overview ────────────────────────────────────────────────────────────────
function Overview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="overview" ref={ref} className="os-section">
      <div className="os-wrap os-two-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <SectionLabel>One day</SectionLabel>
          <h2
            style={{
              fontFamily: FD,
              fontWeight: 700,
              fontSize: "clamp(30px,3.8vw,46px)",
              lineHeight: 1.12,
              letterSpacing: "-0.028em",
              color: TXT,
              margin: "18px 0 20px",
              textWrap: "balance",
            }}
          >
            ONE Day to Explore the Power of the{" "}
            <span style={{ background: SPECTRUM, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>
              Agentic Enterprise
            </span>
          </h2>
          <p style={{ fontFamily: FO, fontSize: "clamp(15px,1.15vw,17px)", lineHeight: 1.72, color: TXT_70, margin: "0 0 30px", maxWidth: 560 }}>
            Join us on 19th October for ONE Executive Day KSA — the exclusive event for senior IT
            leaders. Discover how KSA organizations and enterprises are using agentic systems to
            innovate faster, modernize legacy processes, and build mission-critical applications and
            AI agents that truly differentiate. Hands-on demos, real customer stories and powerful
            networking — all in just one day.
          </p>
          <CtaButton href="#register">Register Here</CtaButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <SpectrumFrame radius={22}>
            <div className="os-facts">
              {[
                ["Date", EVENT_DATE],
                ["Time", `${EVENT_TIME} AST`],
                ["Venue", EVENT_VENUE],
                ["Format", "In-person · Senior IT leaders"],
              ].map(([k, v]) => (
                <div key={k} className="os-fact">
                  <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TXT_45 }}>
                    {k}
                  </span>
                  <span style={{ fontFamily: FD, fontWeight: 600, fontSize: "clamp(17px,1.6vw,22px)", color: TXT, letterSpacing: "-0.02em" }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </SpectrumFrame>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Why attend ──────────────────────────────────────────────────────────────
function WhyAttend() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="why" ref={ref} className="os-section">
      <div className="os-wrap">
        <SectionLabel>Why attend</SectionLabel>
        <h2
          style={{
            fontFamily: FD,
            fontWeight: 700,
            fontSize: "clamp(30px,3.8vw,46px)",
            letterSpacing: "-0.028em",
            color: TXT,
            margin: "18px 0 clamp(28px,3.5vw,46px)",
          }}
        >
          Four reasons to be in the room.
        </h2>

        <div className="os-why-grid">
          {WHY.map((w, i) => (
            <motion.article
              key={w.title}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
              className="os-why-card"
            >
              <span aria-hidden className="os-why-rule" />
              <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", color: TXT_45 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: "clamp(17px,1.5vw,20px)", letterSpacing: "-0.02em", color: TXT, margin: "10px 0 10px", lineHeight: 1.25 }}>
                {w.title}
              </h3>
              <p style={{ fontFamily: FO, fontSize: 14.5, lineHeight: 1.65, color: TXT_70, margin: 0 }}>{w.body}</p>
            </motion.article>
          ))}
        </div>

        <div style={{ marginTop: "clamp(28px,3.4vw,42px)" }}>
          <CtaButton href="#register">Register Here</CtaButton>
        </div>
      </div>
    </section>
  );
}

// ─── Agenda — split two-column, everything visible ───────────────────────────
function Agenda() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  // Splitting on item count alone stacks every long session into column two,
  // because a bare break row is a fraction of the height of a panel with
  // bullets. Split on rendered weight instead, keeping the day in order.
  const { columns, half } = useMemo(() => {
    const weight = (s: Slot) =>
      1 + (s.title ? 1 : 0) + (s.body ? 1 : 0) + (s.points?.length ?? 0);
    const total = AGENDA.reduce((n, s) => n + weight(s), 0);
    let run = 0;
    let cut = AGENDA.length;
    for (let i = 0; i < AGENDA.length; i++) {
      run += weight(AGENDA[i]);
      if (run >= total / 2) {
        cut = i + 1;
        break;
      }
    }
    return { columns: [AGENDA.slice(0, cut), AGENDA.slice(cut)], half: cut };
  }, []);

  return (
    <section id="agenda" ref={ref} className="os-section">
      <div className="os-wrap">
        <SectionLabel>Agenda</SectionLabel>
        <h2
          style={{
            fontFamily: FD,
            fontWeight: 700,
            fontSize: "clamp(30px,3.8vw,46px)",
            letterSpacing: "-0.028em",
            color: TXT,
            margin: "18px 0 10px",
          }}
        >
          {EVENT_DATE}
        </h2>
        <p style={{ fontFamily: FO, fontSize: 15, color: TXT_45, margin: "0 0 clamp(26px,3.2vw,42px)" }}>
          {AGENDA.length} sessions, {EVENT_TIME} AST. Here&rsquo;s what&rsquo;s scheduled for the day.
        </p>

        <div className="os-agenda-split">
          {columns.map((col, ci) => (
            <div key={ci} className="os-agenda-col">
              {col.map((s, i) => {
                const accent = SLOT_ACCENT[s.kind];
                const idx = ci * half + i;
                return (
                  <motion.div
                    key={s.time + s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, delay: 0.04 * idx, ease: EASE }}
                    className="os-slot"
                  >
                    <div className="os-slot-time">
                      <span aria-hidden className="os-slot-dot" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
                      <span style={{ fontFamily: FO, fontSize: 13, fontWeight: 600, color: TXT_45, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
                        {s.time}
                      </span>
                    </div>

                    <div className="os-slot-card">
                      <span aria-hidden className="os-slot-edge" style={{ background: accent }} />
                      <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: accent === "rgba(255,255,255,0.28)" ? TXT_70 : accent, margin: 0, lineHeight: 1.3 }}>
                        {s.label}
                      </h3>
                      {s.title && (
                        <p style={{ fontFamily: FO, fontSize: 14.5, fontWeight: 500, color: TXT, margin: "9px 0 0", lineHeight: 1.5 }}>
                          {s.title}
                        </p>
                      )}
                      {s.body && (
                        <p style={{ fontFamily: FO, fontSize: 13.5, color: TXT_70, margin: "8px 0 0", lineHeight: 1.6 }}>{s.body}</p>
                      )}
                      {s.points && (
                        <ul style={{ margin: "10px 0 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                          {s.points.map((p) => (
                            <li key={p} style={{ display: "flex", gap: 10, fontFamily: FO, fontSize: 13.5, color: TXT_70, lineHeight: 1.55 }}>
                              <span aria-hidden style={{ flex: "none", width: 5, height: 5, borderRadius: "50%", background: accent, marginTop: 7 }} />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sponsors ────────────────────────────────────────────────────────────────
function Sponsors() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section id="sponsors" ref={ref} className="os-section">
      <div className="os-wrap" style={{ textAlign: "center" }}>
        <SectionLabel>Sponsors</SectionLabel>
        <h2
          style={{
            fontFamily: FD,
            fontWeight: 700,
            fontSize: "clamp(30px,3.8vw,46px)",
            letterSpacing: "-0.028em",
            color: TXT,
            margin: "18px 0 10px",
          }}
        >
          The partners behind the day.
        </h2>
        <p style={{ fontFamily: FO, fontSize: 15, color: TXT_45, margin: "0 0 clamp(26px,3.2vw,42px)" }}>
          Discover the sponsors who make ONE Executive Day KSA possible.
        </p>

        {SPONSOR_TIERS.map((t, ti) => (
          <div key={t.tier} style={{ marginBottom: ti === SPONSOR_TIERS.length - 1 ? 0 : "clamp(30px,3.6vw,48px)" }}>
            <p style={{ fontFamily: FO, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TXT_45, margin: "0 0 16px" }}>
              {t.tier}
            </p>
            <div
              className="os-sponsor-row"
              style={
                {
                  // At most three across, so a five-logo tier breaks 3 + 2
                  // centred rather than running to a ragged four.
                  maxWidth: rowWidth(t),
                  "--tile": `${t.tile}px`,
                  "--tile-h": `${t.tileH}px`,
                } as React.CSSProperties
              }
            >
              {t.items.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.05 * i, ease: EASE }}
                  className="os-sponsor-tile"
                >
                  {s.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logo}
                      alt={s.name}
                      loading="lazy"
                      decoding="async"
                      className="os-sponsor-logo"
                      style={{ maxHeight: Math.round(s.h * t.scale) }}
                    />
                  ) : (
                    <span style={{ textAlign: "center" }}>
                      <span style={{ display: "block", fontFamily: FD, fontWeight: 700, fontSize: "clamp(18px,1.8vw,24px)", letterSpacing: "-0.02em", color: "#111" }}>
                        {s.name}
                      </span>
                      {s.note && (
                        <span style={{ display: "block", fontFamily: FO, fontSize: 11.5, color: "rgba(0,0,0,0.52)", marginTop: 6 }}>
                          {s.note}
                        </span>
                      )}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Register ────────────────────────────────────────────────────────────────
function Register() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  // Riyadh event, so Saudi Arabia is the default dialling code.
  const defaultPhoneCountry = useMemo<CountryCode>(
    () => COUNTRY_CODES.find((c) => c.country === "SA") ?? COUNTRY_CODES[0],
    [],
  );
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(defaultPhoneCountry);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  // Once a field passes, drop its message rather than making the visitor
  // submit again to find out it is fixed.
  const clearError = (key: string) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    const emailError = businessEmailError(email);
    if (emailError) next.email = emailError;
    if (!firstName.trim()) next.firstName = "First name is required";
    if (!lastName.trim()) next.lastName = "Last name is required";
    if (!jobTitle.trim()) next.jobTitle = "Job title is required";
    if (!company.trim()) next.company = "Company is required";
    const phoneError = validatePhone(phone, phoneCountry);
    if (phoneError) next.phone = phoneError;
    if (!country) next.country = "Please select a country";
    if (!industry) next.industry = "Please select an industry";
    if (!consent) next.consent = "Please confirm consent to proceed";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setState("submitting");
    setSubmitError("");
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    const res = await submitForm({
      type: "contact",
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      job_title: jobTitle.trim(),
      company: company.trim(),
      phone: `${phoneCountry.code} ${cleanPhone}`,
      event_name: `${EVENT_NAME} · ${EVENT_DATE}`,
      metadata: {
        "Event Page": `${EVENT_NAME} · OutSystems`,
        "Page Section": "Registration Form",
        "First Name": firstName.trim(),
        "Last Name": lastName.trim(),
        "Phone Country": `${phoneCountry.name} (${phoneCountry.code})`,
        Country: country,
        Industry: industry,
        "Consent Given": "true",
      },
    });
    if (res.success) {
      setState("success");
      setEmail(""); setFirstName(""); setLastName(""); setJobTitle(""); setCompany("");
      setPhone(""); setPhoneCountry(defaultPhoneCountry); setCountry(""); setIndustry("");
      setConsent(false);
    } else {
      setState("error");
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="register" ref={ref} className="os-section" style={{ scrollMarginTop: 90 }}>
      <div className="os-wrap os-register-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <SectionLabel>Register</SectionLabel>
          <h2
            style={{
              fontFamily: FD,
              fontWeight: 700,
              fontSize: "clamp(30px,3.8vw,46px)",
              letterSpacing: "-0.028em",
              color: TXT,
              margin: "18px 0 18px",
              textWrap: "balance",
            }}
          >
            Reserve your seat.
          </h2>
          <p style={{ fontFamily: FO, fontSize: "clamp(15px,1.15vw,17px)", lineHeight: 1.7, color: TXT_70, margin: "0 0 26px", maxWidth: 460 }}>
            {EVENT_VENUE}, {EVENT_DATE}. Places are limited and confirmed individually — tell us a
            little about you and the team will be in touch.
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {[EVENT_DATE, `${EVENT_TIME} AST`, EVENT_VENUE].map((l) => (
              <li key={l} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FO, fontSize: 14.5, color: TXT_70 }}>
                <span aria-hidden style={{ flex: "none", width: 7, height: 7, borderRadius: "50%", background: SPECTRUM }} />
                {l}
              </li>
            ))}
          </ul>
        </motion.div>

        <SpectrumFrame radius={22}>
          <div className="os-form-panel">
            {state === "success" ? (
              <div style={{ textAlign: "center", padding: "28px 8px" }}>
                <div
                  aria-hidden
                  style={{
                    width: 56, height: 56, borderRadius: "50%", margin: "0 auto 18px",
                    background: SPECTRUM, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 22, color: TXT, margin: "0 0 10px" }}>Seat requested.</h3>
                <p style={{ fontFamily: FO, fontSize: 14.5, color: TXT_70, margin: 0, lineHeight: 1.6 }}>
                  Thank you. A member of the team will confirm your place at {EVENT_NAME} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Honeypot */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  onChange={() => undefined} />

                <Field
                  label="Business Email"
                  error={errors.email}
                  hint="Work email only — Gmail, Outlook and other free providers are not accepted."
                  required
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!businessEmailError(e.target.value)) clearError("email");
                    }}
                    placeholder="you@company.com"
                    style={inputStyle}
                    className="os-input"
                    autoComplete="email"
                  />
                </Field>

                <div className="os-form-row">
                  <Field label="First Name" error={errors.firstName} required>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      style={inputStyle} className="os-input" autoComplete="given-name" />
                  </Field>
                  <Field label="Last Name" error={errors.lastName} required>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                      style={inputStyle} className="os-input" autoComplete="family-name" />
                  </Field>
                </div>

                <div className="os-form-row">
                  <Field label="Job Title" error={errors.jobTitle} required>
                    <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                      style={inputStyle} className="os-input" autoComplete="organization-title" />
                  </Field>
                  <Field label="Company" error={errors.company} required>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                      style={inputStyle} className="os-input" autoComplete="organization" />
                  </Field>
                </div>

                <Field
                  label="Phone Number"
                  error={errors.phone}
                  hint={`${phoneCountry.name} numbers are ${phoneCountry.length} digits`}
                  required
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      aria-label="Country dialling code"
                      value={`${phoneCountry.code}|${phoneCountry.country}`}
                      onChange={(e) => {
                        const [code, ctry] = e.target.value.split("|");
                        const found = COUNTRY_CODES.find((c) => c.code === code && c.country === ctry);
                        if (!found) return;
                        setPhoneCountry(found);
                        // The old number may be the wrong length for the new
                        // country, so re-run it and drop any stale message.
                        setPhone((prev) => normalizePhoneInput(prev, found));
                        clearError("phone");
                      }}
                      style={{ ...inputStyle, width: "auto", flex: "none", minWidth: 118 }}
                      className="os-input"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={`${c.code}|${c.country}`} value={`${c.code}|${c.country}`} style={{ background: PANEL_2 }}>
                          {c.country} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={phoneCountry.length}
                      value={phone}
                      onChange={(e) => {
                        const next = normalizePhoneInput(e.target.value, phoneCountry);
                        setPhone(next);
                        if (!validatePhone(next, phoneCountry)) clearError("phone");
                      }}
                      placeholder={phoneCountry.placeholder}
                      style={inputStyle}
                      className="os-input"
                      autoComplete="tel-national"
                    />
                  </div>
                </Field>

                <div className="os-form-row">
                  <Field label="Country" error={errors.country} required>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} style={inputStyle} className="os-input">
                      <option value="" style={{ background: PANEL_2 }}>Select a country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} style={{ background: PANEL_2 }}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Industry" error={errors.industry} required>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={inputStyle} className="os-input">
                      <option value="" style={{ background: PANEL_2 }}>Select an industry</option>
                      {INDUSTRIES.map((i) => (
                        <option key={i} value={i} style={{ background: PANEL_2 }}>{i}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                    style={{ marginTop: 3, width: 16, height: 16, accentColor: RED, flex: "none" }} />
                  <span style={{ fontFamily: FO, fontSize: 13, color: TXT_70, lineHeight: 1.55 }}>
                    I agree to be contacted about {EVENT_NAME} and related Events First Group
                    communications.
                  </span>
                </label>
                {errors.consent && <span style={{ fontFamily: FO, fontSize: 12, color: "#ff8080" }}>{errors.consent}</span>}

                <button type="submit" disabled={state === "submitting"} className="os-submit">
                  {state === "submitting" ? "Submitting…" : "Register Now"}
                </button>

                {state === "error" && (
                  <p style={{ fontFamily: FO, fontSize: 13, color: "#ff8080", margin: 0 }}>{submitError}</p>
                )}
              </form>
            )}
          </div>
        </SpectrumFrame>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: PANEL, borderTop: `1px solid ${LINE}`, padding: "clamp(34px,4.5vw,56px) clamp(18px,4vw,48px) 26px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="os-footer-top">
          <div>
            <span className="os-wordmark">
              <span className="os-wordmark-one">one</span>
              <span className="os-wordmark-rest">Executive Day</span>
            </span>
            <p style={{ fontFamily: FO, fontSize: 14, color: TXT_70, margin: "14px 0 0", lineHeight: 1.6 }}>
              {EVENT_VENUE}
              <br />
              {EVENT_DATE} · {EVENT_TIME} AST
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TXT_45 }}>
              Hosted by
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={OUTSYSTEMS_MARK} alt="OutSystems" style={{ height: 30, width: "auto", objectFit: "contain" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TXT_45 }}>
              Brought to you by
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/events-first-group_logo_alt.svg" alt="Events First Group" style={{ height: 30, width: "auto", objectFit: "contain" }} />
          </div>
        </div>

        <div aria-hidden style={{ height: 2, borderRadius: 2, background: SPECTRUM, opacity: 0.6, margin: "clamp(24px,3vw,36px) 0 18px" }} />

        <p style={{ fontFamily: FO, fontSize: 12.5, color: TXT_45, margin: 0 }}>
          {EVENT_NAME} · {EVENT_DATE} · {EVENT_VENUE}
        </p>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function OutSystemsOneExecutiveDayPage() {
  // overflowX is `clip`, not `hidden`: `hidden` makes this element a scroll
  // container, which silently cancels `position: sticky` on the nav inside it.
  // `clip` contains the same stray horizontal overflow without doing that.
  return (
    <main style={{ background: INK, color: TXT, minHeight: "100vh", overflowX: "clip" }}>
      <Nav />
      <Hero />
      <Overview />
      <WhyAttend />
      <Agenda />
      <Sponsors />
      <Register />
      <Footer />

      <style jsx global>{`
        .os-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(18px, 4vw, 48px);
        }
        .os-section {
          /* Adjacent sections each contribute their own padding, so this is
             half the gap between two blocks, not the whole of it. */
          padding: clamp(34px, 3.8vw, 58px) 0;
        }

        /* Wordmark — the "one" badge plus the lighter descriptor beside it */
        .os-wordmark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px 16px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          background: ${PANEL};
          white-space: nowrap;
        }
        .os-wordmark-one {
          font-family: ${FD};
          font-weight: 800;
          font-size: 19px;
          letter-spacing: -0.04em;
          color: ${TXT};
        }
        .os-wordmark-rest {
          font-family: ${FD};
          font-weight: 400;
          font-size: 17px;
          letter-spacing: -0.015em;
          color: ${TXT};
        }

        .os-nav-links {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2vw, 30px);
          margin-left: auto;
        }
        .os-nav-link {
          font-family: ${FO};
          font-size: 15px;
          color: ${TXT};
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .os-nav-link:hover {
          color: ${RED};
        }
        .os-nav-cta {
          flex: none;
          font-family: ${FD};
          font-weight: 700;
          font-size: 15px;
          color: ${TXT};
          background: ${RED};
          padding: 11px 24px;
          border-radius: 9999px;
          text-decoration: none;
          transition: filter 0.2s ease, transform 0.2s ease;
        }
        .os-nav-cta:hover {
          filter: brightness(1.12);
          transform: translateY(-1px);
        }
        .os-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .os-mobile-menu {
          display: none;
          flex-direction: column;
          gap: 2px;
          padding: 8px clamp(18px, 4vw, 48px) 16px;
          border-top: 1px solid ${LINE};
        }
        .os-mobile-link {
          font-family: ${FO};
          font-size: 16px;
          color: ${TXT};
          text-decoration: none;
          padding: 12px 0;
        }
        .os-mobile-cta {
          color: ${RED};
          font-weight: 700;
        }

        .os-cta {
          transition: transform 0.2s ease, filter 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .os-cta-solid:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
        }
        .os-cta-ghost:hover {
          background: ${TXT};
          color: ${PANEL};
          transform: translateY(-2px);
        }

        /* Hero */
        .os-hero-inner {
          position: relative;
          overflow: hidden;
          border-radius: 23px;
          padding: clamp(28px, 3.4vw, 48px) clamp(24px, 4vw, 56px) clamp(30px, 3.6vw, 50px);
          min-height: clamp(260px, 28vw, 380px);
          display: flex;
          align-items: center;
        }
        .os-hero-art {
          position: absolute;
          inset: 0;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: 82% center;
          pointer-events: none;
          z-index: 0;
        }
        .os-hero-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.82) 0%,
            rgba(0, 0, 0, 0.66) 30%,
            rgba(0, 0, 0, 0.26) 56%,
            rgba(0, 0, 0, 0) 74%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Overview */
        .os-two-col {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(26px, 4vw, 64px);
          align-items: center;
        }
        .os-facts {
          display: flex;
          flex-direction: column;
          padding: clamp(22px, 2.6vw, 34px);
          gap: clamp(16px, 2vw, 24px);
        }
        .os-fact {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-bottom: clamp(16px, 2vw, 24px);
          border-bottom: 1px solid ${LINE};
        }
        .os-fact:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        /* Why attend */
        .os-why-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(14px, 1.8vw, 24px);
        }
        .os-why-card {
          position: relative;
          background: ${PANEL};
          border: 1px solid ${LINE};
          border-radius: 18px;
          padding: clamp(22px, 2.4vw, 32px);
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .os-why-card:hover {
          border-color: rgba(255, 255, 255, 0.24);
          transform: translateY(-3px);
        }
        .os-why-rule {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: ${SPECTRUM};
        }

        /* Agenda — two columns side by side, every detail on show */
        .os-agenda-split {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(16px, 2.4vw, 38px);
          align-items: start;
        }
        .os-agenda-col {
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 1.2vw, 16px);
          min-width: 0;
        }
        .os-slot {
          display: grid;
          grid-template-columns: 112px minmax(0, 1fr);
          gap: 14px;
          align-items: start;
        }
        .os-slot-time {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-top: 18px;
        }
        .os-slot-dot {
          flex: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .os-slot-card {
          position: relative;
          background: ${PANEL};
          border: 1px solid ${LINE};
          border-radius: 14px;
          padding: 16px 18px 17px 21px;
          overflow: hidden;
          min-width: 0;
        }
        .os-slot-edge {
          position: absolute;
          top: 16px;
          left: 0;
          width: 3px;
          height: 22px;
          border-radius: 0 2px 2px 0;
        }

        /* Sponsors — white tiles, as the brand presents them */
        .os-sponsor-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: clamp(14px, 1.8vw, 26px);
          margin: 0 auto;
        }
        .os-sponsor-tile {
          flex: 0 1 var(--tile, 240px);
          min-width: 0;
          background: #ffffff;
          border-radius: 12px;
          min-height: var(--tile-h, 150px);
          padding: 18px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .os-sponsor-tile:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
        }
        .os-sponsor-logo {
          max-width: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        /* Register */
        .os-register-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: clamp(26px, 4vw, 60px);
          align-items: start;
        }
        .os-form-panel {
          padding: clamp(22px, 2.6vw, 34px);
        }
        .os-form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .os-input:focus {
          border-color: ${MAGENTA} !important;
          box-shadow: 0 0 0 3px rgba(209, 60, 196, 0.18);
        }
        .os-submit {
          font-family: ${FD};
          font-weight: 700;
          font-size: 16px;
          color: ${TXT};
          background: ${SPECTRUM};
          border: none;
          border-radius: 9999px;
          padding: 15px 28px;
          cursor: pointer;
          transition: filter 0.2s ease, transform 0.2s ease;
        }
        .os-submit:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }
        .os-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Footer */
        .os-footer-top {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(24px, 4vw, 64px);
          align-items: flex-start;
          justify-content: space-between;
        }

        /* ── Responsive ─────────────────────────────────────────────────── */
        @media (max-width: 1080px) {
          .os-slot {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .os-slot-time {
            padding-top: 0;
          }
        }
        @media (max-width: 960px) {
          .os-nav-links {
            display: none;
          }
          .os-burger {
            display: flex;
            margin-left: auto;
          }
          .os-nav-cta {
            display: none;
          }
          .os-mobile-menu {
            display: flex;
          }
          .os-two-col,
          .os-register-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .os-agenda-split {
            grid-template-columns: minmax(0, 1fr);
          }
          .os-hero-art {
            background-position: 72% center;
          }
          .os-hero-scrim {
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.84) 0%,
              rgba(0, 0, 0, 0.7) 52%,
              rgba(0, 0, 0, 0.42) 100%
            );
          }
        }
        @media (max-width: 620px) {
          /* The card is taller than it is wide here, so the cover crop shows
             only a narrow slice of the art. Pull that slice left of the tower,
             where the skyline reads without washing out the stacked copy. */
          .os-hero-art {
            background-position: 56% center;
          }
          .os-hero-scrim {
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.88) 0%,
              rgba(0, 0, 0, 0.76) 55%,
              rgba(0, 0, 0, 0.6) 100%
            );
          }
          .os-why-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .os-form-row {
            grid-template-columns: minmax(0, 1fr);
          }
          .os-wordmark-rest {
            font-size: 15px;
          }
        }
        @media (max-width: 980px) {
          .os-sponsor-tile {
            flex-basis: 250px;
          }
        }
        @media (max-width: 760px) {
          .os-sponsor-tile {
            flex-basis: 212px;
          }
        }
        @media (max-width: 500px) {
          .os-sponsor-tile {
            flex-basis: 100%;
          }
        }
        @media (max-width: 640px) {
          /* globals.css:234 forces every <section> to 48px/40px !important
             below 640px, which is more padding than this page carries at 760
             and reverses the taper. A class beats a type selector, so these
             win without needing to touch the global rule. */
          .os-section {
            padding-top: 34px !important;
            padding-bottom: 34px !important;
          }
          #top {
            padding-top: 28px !important;
            padding-bottom: 18px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .os-cta,
          .os-why-card,
          .os-sponsor-tile,
          .os-submit,
          .os-nav-cta {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
