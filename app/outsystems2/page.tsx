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
   Innovator Day UAE — OutSystems
   Museum of the Future, Dubai · 28 October 2026 · 09:00–15:00

   Light theme, matching the brand's own Innovator Day pages: a warm paper
   ground, near-black ink, white cards, and the red → magenta → blue spectrum
   as a frame and accent rather than a fill. Two deliberate dark blocks — the
   audience panel and the footer — punctuate the page.

   /outsystems is the architectural sibling (same nav, agenda, register and
   footer patterns) but runs the dark colourway. These brand pages are kept
   self-contained by copy rather than shared imports, so one can be reshaped
   without disturbing the other.
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Tokens ──────────────────────────────────────────────────────────────────
// Sampled from the brand's own Innovator Day pages.
const PAPER = "#F5F1F0";      // page ground
const CARD = "#FFFFFF";       // cards, form panel
const ROW = "#E4E3E3";        // agenda rows
const DARK = "#0A0D1A";       // ink, dark panel, footer
const LINE = "rgba(10,13,26,0.12)";
const TXT = "#0A0D1A";
const TXT_70 = "#3C3C3C";
const TXT_45 = "rgba(10,13,26,0.52)";

// On the two dark blocks.
const D_LINE = "rgba(255,255,255,0.12)";
const D_TXT = "#FFFFFF";
const D_TXT_70 = "rgba(255,255,255,0.72)";
const D_TXT_45 = "rgba(255,255,255,0.45)";

const RED = "#F32D35";
const MAGENTA = "#D13CC4";
const BLUE = "#5566E8";
const SPECTRUM = `linear-gradient(90deg, ${RED} 0%, ${MAGENTA} 52%, ${BLUE} 100%)`;

const FD = "var(--font-display)";
const FO = "var(--font-outfit)";
const EASE = [0.16, 1, 0.3, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
// The event's own lockup: red dot, black "outsystems", and the Innovator Day
// pill in a spectrum outline. It is the positive colourway, so it sits bare on
// the paper nav and needs a paper plate on the dark footer.
const EVENT_LOGO = `${S3}/logos/OutSystems_Innovator_Day.png`;
// The reversed OutSystems mark — a red dot with a WHITE wordmark — used for the
// footer's "Hosted by" credit, where the band is already dark.
const OUTSYSTEMS_MARK = `${S3}/logos/outsystems.png`;
// Museum of the Future key visual. The torus sits right of centre and the left
// third is an unbroken red-to-blue wash, so the white headline reads over it
// with only a light scrim to steady the mid-band.
const HERO_BG = `${S3}/heros/pic.png`;

/**
 * Event photography, in the same three places the brand's own page uses it:
 * the stage beside Why Attend, the room beside Who Should Attend, and the
 * networking floor beside What to Expect. All three are 1920x1280 (3:2), so
 * the frames below are set to 3:2 and nothing is cropped.
 */
const IMG_STAGE = `${S3}/assets/outsystem2+image1.webp`;
const IMG_ROOM = `${S3}/assets/outsystem2+image2.webp`;
const IMG_NETWORKING = `${S3}/assets/outsystem2+image3.webp`;

const EVENT_NAME = "Innovator Day UAE";
const EVENT_DATE = "28 October 2026";
const EVENT_TIME = "09:00–15:00";
const EVENT_VENUE = "Museum of the Future, Dubai";

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#why", label: "Why Attend" },
  { href: "#agenda", label: "Agenda" },
  { href: "#sponsors", label: "Sponsors" },
];

// ─── Why attend ──────────────────────────────────────────────────────────────
const WHY = [
  {
    title: "UAE set the destination. OutSystems builds the road.",
    body: "Delivering on the UAE’s Agentic AI mandate without compromising governance, security, or control.",
  },
  {
    title: "AI pilots are easy. Scaling AI across the enterprise is not.",
    body: "See how leading organizations move from experimentation to secure, production-ready AI at scale.",
  },
  {
    title: "Legacy systems cannot become a constraint on AI ambition.",
    body: "Learn how to modernize applications, connect data, and build the foundation for enterprise AI.",
  },
  {
    title: "AI talent is scarce. Enterprise demand is not.",
    body: "See how organizations close skills gaps and accelerate AI delivery with the teams they already have.",
  },
];

// ─── Who should attend ───────────────────────────────────────────────────────
const AUDIENCE = [
  "CIOs, CTOs, and technology executives",
  "Digital Transformation, Application Development, and Enterprise Architecture leaders",
  "Innovation and Strategy leaders",
  "IT and business leaders driving AI and modernization initiatives",
];

// ─── What to expect ──────────────────────────────────────────────────────────
const EXPECT = [
  {
    title: "Explore the Latest Product Innovations",
    body: "See the latest OutSystems capabilities for building, scaling, and governing modern applications and agentic systems.",
  },
  {
    title: "Connect with Experts and Peers",
    body: "Exchange ideas with OutSystems experts, partners, customers, and technology leaders tackling similar challenges.",
  },
  {
    title: "Gain Practical Direction",
    body: "Leave with actionable ideas to move from AI experimentation to secure, production-ready execution.",
  },
];

// ─── Agenda ──────────────────────────────────────────────────────────────────
// Every row carries its full detail inline. The source site hid the two long
// partner sessions behind a "view more" dialog; here they are always on show.
type Slot = {
  time: string;
  label: string;
  title?: string;
  body?: string;
  kind: "break" | "keynote" | "session" | "panel" | "award";
};

const AGENDA: Slot[] = [
  {
    time: "09:00–09:45",
    label: "Arrival and Registration",
    body: "Start your day with breakfast and networking before the main programme begins. Explore sponsor showcases, discover innovative solutions, and connect with OutSystems experts, partners, and fellow technology leaders.",
    kind: "break",
  },
  { time: "09:45–10:05", label: "Welcome & Keynote", kind: "keynote" },
  {
    time: "10:05–10:50",
    label: "Human Leads, AI Delivers: How OutSystems Turns the UAE’s Agentic Mandate into Reality",
    kind: "keynote",
  },
  {
    time: "10:50–11:10",
    label: "Partner Session · FPT",
    title: "One App. Every Employee Service. Powered by AI",
    body: "What if employees could access everyday workplace services through one intelligent, mobile-first experience, regardless of the systems behind them? Discover how FPT’s Employee Experience Accelerator, powered by OutSystems, brings together AI, enterprise systems and digital workflows into a unified experience — simplifying employee journeys, automating routine interactions and providing one seamless access point for workplace services. Learn how organizations can modernize employee services faster while maximizing the value of their existing core systems.",
    kind: "session",
  },
  {
    time: "11:10–11:30",
    label: "Partner Session · Exalio",
    title: "Revolutionizing Patent & IP Grants with OutSystems",
    kind: "session",
  },
  { time: "11:30–11:45", label: "Coffee & Networking Break", kind: "break" },
  {
    time: "11:45–12:15",
    label: "Panel",
    title: "Beyond the Blueprint: How Real Organizations Are Living the Agentic Shift",
    kind: "panel",
  },
  {
    time: "12:15–12:25",
    label: "Partner Session · Blackstone eIT",
    title: "From AI to AGI: Are Enterprises Ready for the Next Intelligence Shift?",
    body: "From AI to AGI, presented by Blackstone eIT at OutSystems Innovator Day UAE, explores the next evolution of enterprise AI from systems that assist to intelligent agents capable of reasoning, deciding, and acting. As organizations move toward agentic AI and AGI, success will depend on having the right foundations: connected systems, governed data, AI applications, intelligent workflows, and strong security, governance, and human oversight. Drawing on Blackstone eIT’s perspective on enterprise transformation, with practical OutSystems use cases, the session explores how organizations can move beyond isolated AI experiments to establish AI as an institutional capability that drives meaningful transformation and action.",
    kind: "session",
  },
  { time: "12:25–12:40", label: "Coffee & Networking Break", kind: "break" },
  {
    time: "12:40–13:10",
    label: "From potential to kinetic — Why execution, not models, decides who gets value from agents",
    kind: "session",
  },
  {
    time: "13:10–13:35",
    label: "Awards & Recognition",
    title: "Celebrating Customer Success",
    kind: "award",
  },
  { time: "13:35–13:40", label: "Closing Remarks", kind: "session" },
  { time: "13:40–15:00", label: "Lunch & Networking", kind: "break" },
];

// Break rows get a neutral ink rather than a brand colour, so the spine reads
// as programme / pause at a glance.
const SLOT_ACCENT: Record<Slot["kind"], string> = {
  break: "rgba(10,13,26,0.34)",
  session: MAGENTA,
  keynote: RED,
  panel: BLUE,
  award: "#C8891E",
};

// ─── Sponsors ────────────────────────────────────────────────────────────────
// `logo` is null wherever we do not yet hold the artwork; those render as a
// wordmark so the tier is complete and correct while the files are chased.
// `h` is the logo's rendered cap height in px at Gold scale, derived from the
// artwork's own aspect ratio so marks of different shapes carry roughly equal
// optical area (h = sqrt(7000 / aspect), clamped to the cell width).
type Sponsor = { name: string; note?: string; logo: string | null; h: number };
type SponsorTier = {
  tier: string;
  /** Size multiplier against Gold, so the tier a sponsor bought reads at a glance. */
  scale: number;
  items: Sponsor[];
};

const SPONSOR_TIERS: SponsorTier[] = [
  {
    tier: "Platinum Sponsors",
    scale: 1.14,
    items: [
      { name: "FPT", logo: `${S3}/logos/FPT.png`, h: 66 },
      // The strapline is set inside the artwork, so it is not carried as a
      // separate `note`.
      { name: "Exalio", logo: `${S3}/logos/Exalio.png`, h: 49 },
    ],
  },
  {
    tier: "Gold Sponsor",
    scale: 1,
    items: [
      {
        // The positive lockup, not the reversed one: this band is white, and
        // inverting the reversed file turns the brand's cyan hexagon orange.
        name: "Blackstone eIT",
        logo: `${S3}/sponsors-logo/Blackstone+eIT+Logo+Main+No+Slogan+RGB.png`,
        h: 32,
      },
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

// Dubai event, so the UAE leads the list.
const COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
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
function SectionLabel({ children, onDark }: { children: React.ReactNode; onDark?: boolean }) {
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
        color: onDark ? D_TXT_45 : TXT_45,
      }}
    >
      <span aria-hidden style={{ width: 22, height: 2, borderRadius: 2, background: SPECTRUM }} />
      {children}
    </span>
  );
}

/** White panel inside a 3px spectrum frame — the page's signature container. */
function SpectrumFrame({
  children,
  radius = 24,
  fill = CARD,
  style,
}: {
  children: React.ReactNode;
  radius?: number;
  fill?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ padding: 3, borderRadius: radius, background: SPECTRUM, ...style }}>
      <div style={{ borderRadius: radius - 3, background: fill, height: "100%" }}>{children}</div>
    </div>
  );
}

/**
 * The event lockup. `dark` sets it on a paper plate, because the wordmark is
 * black and would otherwise vanish into the footer.
 */
function Brand({ dark }: { dark?: boolean }) {
  return (
    <span className={dark ? "idu-brand idu-brand-plate" : "idu-brand"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={EVENT_LOGO} alt="OutSystems Innovator Day" className="idu-brand-img" />
    </span>
  );
}

function CtaButton({
  href,
  children,
  solid,
  onDark,
}: {
  href: string;
  children: React.ReactNode;
  solid?: boolean;
  onDark?: boolean;
}) {
  const edge = onDark ? D_TXT : TXT;
  return (
    <a
      href={href}
      className={solid ? "idu-cta idu-cta-solid" : `idu-cta ${onDark ? "idu-cta-ghost-dark" : "idu-cta-ghost"}`}
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
        color: solid ? "#FFFFFF" : edge,
        border: solid ? "none" : `1.5px solid ${edge}`,
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
 * number — with the dialling code (+971 50…) or with the national trunk zero
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
        <span style={{ fontFamily: FO, fontSize: 12, color: "#C2272D" }}>{error}</span>
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
  background: "#FFFFFF",
  border: `1px solid rgba(10,13,26,0.18)`,
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
  // scrollport of its own to stick to and simply scrolls away. /outsystems,
  // /algosec and /intwo all take the same route. The spacer below replaces the
  // height the bar gives up by leaving the flow, and is measured rather than
  // hard-coded so a wrapped bar can never sit over the hero.
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
          background: "rgba(245,241,240,0.92)",
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
            <Brand />
          </a>

          <nav className="idu-nav-links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="idu-nav-link">
                {l.label}
              </a>
            ))}
          </nav>

          <a href="#register" className="idu-nav-cta">
            Register Now
          </a>

          <button
            type="button"
            className="idu-burger"
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
          <div className="idu-mobile-menu">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="idu-mobile-link">
                {l.label}
              </a>
            ))}
            <a href="#register" onClick={() => setOpen(false)} className="idu-mobile-link idu-mobile-cta">
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
        <SpectrumFrame radius={26} fill={DARK}>
          <div className="idu-hero-inner">
            <div aria-hidden className="idu-hero-art" style={{ backgroundImage: `url("${HERO_BG}")` }} />
            <div aria-hidden className="idu-hero-scrim" />

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
                  color: D_TXT,
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
                <p style={{ fontFamily: FO, fontSize: "clamp(17px,1.4vw,20px)", color: D_TXT, margin: "0 0 14px" }}>
                  The Museum of the Future
                </p>
                <p style={{ fontFamily: FO, fontSize: "clamp(15px,1.2vw,17px)", color: D_TXT_70, margin: 0, lineHeight: 1.6 }}>
                  {EVENT_DATE}
                  <br />
                  {EVENT_TIME}
                </p>
                <p style={{ fontFamily: FO, fontSize: 13.5, color: D_TXT_45, margin: "12px 0 0" }}>
                  All times Gulf Standard Time (GST · UTC+4)
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
    <section id="overview" ref={ref} className="idu-section">
      <div className="idu-wrap idu-two-col">
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
            Your agentic future starts at{" "}
            <span style={{ background: SPECTRUM, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>
              Innovator Day UAE
            </span>
          </h2>
          <p style={{ fontFamily: FO, fontSize: "clamp(15px,1.15vw,17px)", lineHeight: 1.72, color: TXT_70, margin: "0 0 28px", maxWidth: 560 }}>
            Join 200+ technology and business leaders from across the region.
          </p>
          <CtaButton href="#register">Register Here</CtaButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <SpectrumFrame radius={22}>
            <div className="idu-facts">
              {[
                ["Date", EVENT_DATE],
                ["Time", `${EVENT_TIME} GST`],
                ["Venue", EVENT_VENUE],
                ["Format", "In-person · Technology & business leaders"],
              ].map(([k, v]) => (
                <div key={k} className="idu-fact">
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
    <section id="why" ref={ref} className="idu-section">
      <div className="idu-wrap idu-two-col idu-two-col-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <SectionLabel>Why attend</SectionLabel>
          <h2 className="idu-h2-sm">Four reasons to be in the room.</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,1.5vw,19px)" }}>
            {WHY.map((w) => (
              <div key={w.title}>
                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: "clamp(16px,1.4vw,19px)", letterSpacing: "-0.02em", color: TXT, margin: "0 0 8px", lineHeight: 1.3 }}>
                  {w.title}
                </h3>
                <p style={{ fontFamily: FO, fontSize: 14.5, lineHeight: 1.65, color: TXT_70, margin: 0 }}>{w.body}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "clamp(20px,2.2vw,28px)" }}>
            <CtaButton href="#register">Register Here</CtaButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="idu-side-photo"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* Pulled right of centre: a centred crop leaves half the left-hand
              sponsor screen hanging at the frame edge. */}
          <img src={IMG_STAGE} alt="A speaker on the OutSystems stage beside a screen reading Redefining the Future of Software Development" loading="lazy" decoding="async" style={{ objectPosition: "58% center" }} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Who should attend · What to expect ──────────────────────────────────────
// The page's one dark block, as on the brand's own page — it breaks the run of
// paper and gives the audience list the weight it needs.
function Audience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="audience" ref={ref} className="idu-section">
      <div className="idu-wrap">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="idu-dark-panel"
        >
          <div className="idu-dark-grid">
            <div className="idu-dark-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG_ROOM} alt="Delegates seated at round tables in the main room" loading="lazy" decoding="async" />
            </div>

            <div>
              <SectionLabel onDark>Who should attend</SectionLabel>
              <h2 className="idu-h2-sm" style={{ color: D_TXT }}>
                Built for the people who decide.
              </h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {AUDIENCE.map((a) => (
                  <li key={a} style={{ display: "flex", gap: 14, fontFamily: FO, fontSize: "clamp(15px,1.15vw,16.5px)", lineHeight: 1.6, color: D_TXT_70 }}>
                    <span aria-hidden style={{ flex: "none", width: 7, height: 7, borderRadius: "50%", background: SPECTRUM, marginTop: 9 }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── What to expect ──────────────────────────────────────────────────────────
function WhatToExpect() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="expect" ref={ref} className="idu-section">
      <div className="idu-wrap idu-two-col idu-two-col-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <SectionLabel>What to expect</SectionLabel>
          <h2 className="idu-h2-sm">A day built to be used, not watched.</h2>
          <p style={{ fontFamily: FO, fontSize: "clamp(15px,1.15vw,16.5px)", lineHeight: 1.65, color: TXT_70, margin: "0 0 clamp(20px,2.2vw,26px)", maxWidth: 520 }}>
            A focused day of keynotes, customer stories, expert sessions, live demonstrations and
            peer conversations designed to turn AI ambition into practical action.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,1.5vw,19px)" }}>
            {EXPECT.map((e) => (
              <div key={e.title} className="idu-expect-item">
                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: "clamp(16px,1.4vw,19px)", letterSpacing: "-0.02em", color: TXT, margin: "0 0 8px", lineHeight: 1.3 }}>
                  {e.title}
                </h3>
                <p style={{ fontFamily: FO, fontSize: 14.5, lineHeight: 1.65, color: TXT_70, margin: 0 }}>{e.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="idu-side-photo"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG_NETWORKING} alt="Delegates talking in small groups in front of an OutSystems Build your agentic future stand" loading="lazy" decoding="async" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Agenda — split two-column, everything visible ───────────────────────────
function Agenda() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  // Splitting on item count alone stacks every long session into column two,
  // because a bare break row is a fraction of the height of a session carrying
  // a full abstract. Split on rendered weight instead, keeping the day in order.
  const { columns, half } = useMemo(() => {
    const weight = (s: Slot) => 1 + (s.title ? 1 : 0) + (s.body ? Math.ceil(s.body.length / 160) : 0);
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
    <section id="agenda" ref={ref} className="idu-section">
      <div className="idu-wrap">
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
          Where Big Ideas Take Center Stage
        </h2>
        <p style={{ fontFamily: FO, fontSize: 15, color: TXT_45, margin: "0 0 clamp(26px,3.2vw,42px)" }}>
          {EVENT_DATE} · {AGENDA.length} sessions, {EVENT_TIME} GST. Here&rsquo;s what&rsquo;s
          scheduled for the day.
        </p>

        <div className="idu-agenda-split">
          {columns.map((col, ci) => (
            <div key={ci} className="idu-agenda-col">
              {col.map((s, i) => {
                const accent = SLOT_ACCENT[s.kind];
                const isBreak = s.kind === "break";
                const idx = ci * half + i;
                return (
                  <motion.div
                    key={s.time + s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, delay: 0.04 * idx, ease: EASE }}
                    className="idu-slot"
                  >
                    <div className="idu-slot-time">
                      <span aria-hidden className="idu-slot-dot" style={{ background: accent }} />
                      <span style={{ fontFamily: FO, fontSize: 13, fontWeight: 600, color: TXT_45, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
                        {s.time}
                      </span>
                    </div>

                    <div className="idu-slot-card">
                      <span aria-hidden className="idu-slot-edge" style={{ background: accent }} />
                      <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: isBreak ? TXT_70 : accent, margin: 0, lineHeight: 1.3 }}>
                        {s.label}
                      </h3>
                      {s.title && (
                        <p style={{ fontFamily: FO, fontSize: 14.5, fontWeight: 600, color: TXT, margin: "9px 0 0", lineHeight: 1.5 }}>
                          {s.title}
                        </p>
                      )}
                      {s.body && (
                        <p style={{ fontFamily: FO, fontSize: 13.5, color: TXT_70, margin: "8px 0 0", lineHeight: 1.6 }}>{s.body}</p>
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
// A white band, the way the brand presents its partners — logos sit on the page
// rather than in tiles.
function Sponsors() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section id="sponsors" ref={ref} className="idu-section" style={{ background: CARD }}>
      <div className="idu-wrap" style={{ textAlign: "center" }}>
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
          Discover the sponsors who make {EVENT_NAME} possible.
        </p>

        {SPONSOR_TIERS.map((t, ti) => (
          <div key={t.tier} style={{ marginBottom: ti === SPONSOR_TIERS.length - 1 ? 0 : "clamp(34px,4vw,54px)" }}>
            <p style={{ fontFamily: FD, fontSize: "clamp(16px,1.5vw,19px)", fontWeight: 700, letterSpacing: "-0.015em", color: TXT, margin: "0 0 clamp(18px,2.2vw,30px)" }}>
              {t.tier}
            </p>
            <div className="idu-sponsor-row">
              {t.items.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.05 * i, ease: EASE }}
                  className="idu-sponsor-cell"
                >
                  {s.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logo}
                      alt={s.name}
                      loading="lazy"
                      decoding="async"
                      className="idu-sponsor-logo"
                      style={{ maxHeight: Math.round(s.h * t.scale) }}
                    />
                  ) : (
                    <span style={{ textAlign: "center" }}>
                      <span style={{ display: "block", fontFamily: FD, fontWeight: 700, fontSize: "clamp(22px,2.4vw,32px)", letterSpacing: "-0.02em", color: TXT }}>
                        {s.name}
                      </span>
                      {s.note && (
                        <span style={{ display: "block", fontFamily: FO, fontSize: 12, letterSpacing: "0.04em", color: TXT_45, marginTop: 7 }}>
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
  // Dubai event, so the UAE is the default dialling code.
  const defaultPhoneCountry = useMemo<CountryCode>(
    () => COUNTRY_CODES.find((c) => c.country === "AE") ?? COUNTRY_CODES[0],
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
    <section id="register" ref={ref} className="idu-section" style={{ scrollMarginTop: 90 }}>
      <div className="idu-wrap idu-register-grid">
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
            {[EVENT_DATE, `${EVENT_TIME} GST`, EVENT_VENUE].map((l) => (
              <li key={l} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FO, fontSize: 14.5, color: TXT_70 }}>
                <span aria-hidden style={{ flex: "none", width: 7, height: 7, borderRadius: "50%", background: SPECTRUM }} />
                {l}
              </li>
            ))}
          </ul>
        </motion.div>

        <SpectrumFrame radius={22}>
          <div className="idu-form-panel">
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
                    className="idu-input"
                    autoComplete="email"
                  />
                </Field>

                <div className="idu-form-row">
                  <Field label="First Name" error={errors.firstName} required>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      style={inputStyle} className="idu-input" autoComplete="given-name" />
                  </Field>
                  <Field label="Last Name" error={errors.lastName} required>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                      style={inputStyle} className="idu-input" autoComplete="family-name" />
                  </Field>
                </div>

                <div className="idu-form-row">
                  <Field label="Job Title" error={errors.jobTitle} required>
                    <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                      style={inputStyle} className="idu-input" autoComplete="organization-title" />
                  </Field>
                  <Field label="Company" error={errors.company} required>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                      style={inputStyle} className="idu-input" autoComplete="organization" />
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
                      className="idu-input"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={`${c.code}|${c.country}`} value={`${c.code}|${c.country}`}>
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
                      className="idu-input"
                      autoComplete="tel-national"
                    />
                  </div>
                </Field>

                <div className="idu-form-row">
                  <Field label="Country" error={errors.country} required>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} style={inputStyle} className="idu-input">
                      <option value="">Select a country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Industry" error={errors.industry} required>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={inputStyle} className="idu-input">
                      <option value="">Select an industry</option>
                      {INDUSTRIES.map((i) => (
                        <option key={i} value={i}>{i}</option>
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
                {errors.consent && <span style={{ fontFamily: FO, fontSize: 12, color: "#C2272D" }}>{errors.consent}</span>}

                <button type="submit" disabled={state === "submitting"} className="idu-submit">
                  {state === "submitting" ? "Submitting…" : "Register Now"}
                </button>

                {state === "error" && (
                  <p style={{ fontFamily: FO, fontSize: 13, color: "#C2272D", margin: 0 }}>{submitError}</p>
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
    <footer style={{ background: DARK, borderTop: `1px solid ${D_LINE}`, padding: "clamp(34px,4.5vw,56px) clamp(18px,4vw,48px) 26px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="idu-footer-top">
          <div>
            <Brand dark />
            <p style={{ fontFamily: FO, fontSize: 14, color: D_TXT_70, margin: "14px 0 0", lineHeight: 1.6 }}>
              {EVENT_VENUE}
              <br />
              {EVENT_DATE} · {EVENT_TIME} GST
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: D_TXT_45 }}>
              Hosted by
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={OUTSYSTEMS_MARK} alt="OutSystems" style={{ height: 30, width: "auto", objectFit: "contain" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: D_TXT_45 }}>
              Brought to you by
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/events-first-group_logo_alt.svg" alt="Events First Group" style={{ height: 30, width: "auto", objectFit: "contain" }} />
          </div>
        </div>

        <div aria-hidden style={{ height: 2, borderRadius: 2, background: SPECTRUM, opacity: 0.7, margin: "clamp(24px,3vw,36px) 0 18px" }} />

        <p style={{ fontFamily: FO, fontSize: 12.5, color: D_TXT_45, margin: 0 }}>
          {EVENT_NAME} · {EVENT_DATE} · {EVENT_VENUE}
        </p>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function OutSystemsInnovatorDayUaePage() {
  // overflowX is `clip`, not `hidden`: `hidden` makes this element a scroll
  // container, which silently cancels `position: sticky` on anything inside it.
  // `clip` contains the same stray horizontal overflow without doing that.
  return (
    <main style={{ background: PAPER, color: TXT, minHeight: "100vh", overflowX: "clip" }}>
      <Nav />
      <Hero />
      <Overview />
      <WhyAttend />
      <Audience />
      <WhatToExpect />
      <Agenda />
      <Sponsors />
      <Register />
      <Footer />

      <style jsx global>{`
        .idu-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(18px, 4vw, 48px);
        }
        .idu-section {
          /* Adjacent sections each contribute their own padding, so this is
             half the gap between two blocks, not the whole of it. */
          padding: clamp(28px, 3vw, 44px) 0;
        }
        /* The section headings in the photo-beside-text blocks. Deliberately
           smaller than the full-width headings: at display size they pushed the
           copy column far past the photo and opened a hole beneath it. */
        .idu-h2-sm {
          font-family: ${FD};
          font-weight: 700;
          font-size: clamp(24px, 2.5vw, 34px);
          line-height: 1.14;
          letter-spacing: -0.024em;
          color: ${TXT};
          margin: 14px 0 clamp(16px, 1.8vw, 22px);
          text-wrap: balance;
        }

        /* Brand lockup — the event's own logo */
        .idu-brand {
          display: inline-flex;
          align-items: center;
        }
        .idu-brand-img {
          height: 30px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        /* The wordmark is black, so on the dark footer the lockup sits on a
           plate rather than disappearing into the band. */
        .idu-brand-plate {
          background: ${PAPER};
          padding: 11px 18px;
          border-radius: 14px;
        }

        .idu-nav-links {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2vw, 30px);
          margin-left: auto;
        }
        .idu-nav-link {
          font-family: ${FO};
          font-size: 15px;
          color: ${TXT};
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .idu-nav-link:hover {
          color: ${RED};
        }
        .idu-nav-cta {
          flex: none;
          font-family: ${FD};
          font-weight: 700;
          font-size: 15px;
          color: #ffffff;
          background: ${RED};
          padding: 11px 24px;
          border-radius: 9999px;
          text-decoration: none;
          transition: filter 0.2s ease, transform 0.2s ease;
        }
        .idu-nav-cta:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
        .idu-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .idu-mobile-menu {
          display: none;
          flex-direction: column;
          gap: 2px;
          padding: 8px clamp(18px, 4vw, 48px) 16px;
          border-top: 1px solid ${LINE};
        }
        .idu-mobile-link {
          font-family: ${FO};
          font-size: 16px;
          color: ${TXT};
          text-decoration: none;
          padding: 12px 0;
        }
        .idu-mobile-cta {
          color: ${RED};
          font-weight: 700;
        }

        .idu-cta {
          transition: transform 0.2s ease, filter 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .idu-cta-solid:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
        }
        .idu-cta-ghost:hover {
          background: ${TXT};
          color: ${PAPER};
          transform: translateY(-2px);
        }
        .idu-cta-ghost-dark:hover {
          background: ${D_TXT};
          color: ${DARK};
          transform: translateY(-2px);
        }

        /* Hero */
        .idu-hero-inner {
          position: relative;
          overflow: hidden;
          border-radius: 23px;
          padding: clamp(28px, 3.4vw, 48px) clamp(24px, 4vw, 56px) clamp(30px, 3.6vw, 50px);
          min-height: clamp(260px, 28vw, 380px);
          display: flex;
          align-items: center;
        }
        .idu-hero-art {
          position: absolute;
          inset: 0;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: 78% center;
          pointer-events: none;
          z-index: 0;
        }
        /* The art's left third is a saturated red-to-blue wash, so the white
           copy carries on its own; this only steadies the mid-band. */
        .idu-hero-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.34) 0%,
            rgba(0, 0, 0, 0.24) 36%,
            rgba(0, 0, 0, 0.08) 60%,
            rgba(0, 0, 0, 0) 78%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Overview */
        .idu-two-col {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(26px, 4vw, 64px);
          align-items: center;
        }
        /* Photo beside copy: the two columns share a height and the image
           covers its half, so the block closes flush instead of leaving a gap
           under a short photo. */
        .idu-two-col-top {
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
        }
        .idu-facts {
          display: flex;
          flex-direction: column;
          padding: clamp(22px, 2.6vw, 34px);
          gap: clamp(16px, 2vw, 24px);
        }
        .idu-fact {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-bottom: clamp(16px, 2vw, 24px);
          border-bottom: 1px solid ${LINE};
        }
        .idu-fact:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        /* Photography — every source file is 3:2, so the frames match it and
           nothing is cropped. */
        .idu-side-photo {
          border-radius: 20px;
          overflow: hidden;
          background: ${ROW};
          min-height: 100%;
        }
        .idu-side-photo img {
          display: block;
          width: 100%;
          height: 100%;
          /* The floor: on a narrow column the copy is taller than 3:2 and the
             photo stretches to meet it; this stops it collapsing when it is
             not. */
          min-height: min(66vw, 340px);
          aspect-ratio: 3 / 2;
          object-fit: cover;
        }
        .idu-dark-photo {
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
        }
        .idu-dark-photo img {
          display: block;
          width: 100%;
          aspect-ratio: 3 / 2;
          object-fit: cover;
        }

        /* Audience — the page's one dark block */
        .idu-dark-panel {
          position: relative;
          background: ${DARK};
          border-radius: 26px;
          padding: clamp(28px, 3.6vw, 56px);
          overflow: hidden;
        }
        /* Faint grid, as on the brand's own dark block */
        .idu-dark-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
          background-size: 68px 68px;
          pointer-events: none;
        }
        .idu-dark-grid {
          position: relative;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: clamp(26px, 3.6vw, 56px);
          align-items: center;
        }
        .idu-expect-item {
          padding-bottom: clamp(16px, 2vw, 22px);
          border-bottom: 1px solid ${D_LINE};
        }
        .idu-expect-item:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        /* Agenda — two columns side by side, every detail on show */
        .idu-agenda-split {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(16px, 2.4vw, 38px);
          align-items: start;
        }
        .idu-agenda-col {
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 1.2vw, 16px);
          min-width: 0;
        }
        .idu-slot {
          display: grid;
          grid-template-columns: 112px minmax(0, 1fr);
          gap: 14px;
          align-items: start;
        }
        .idu-slot-time {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-top: 18px;
        }
        .idu-slot-dot {
          flex: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .idu-slot-card {
          position: relative;
          background: ${ROW};
          border: 1px solid rgba(10, 13, 26, 0.07);
          border-radius: 14px;
          padding: 16px 18px 17px 21px;
          overflow: hidden;
          min-width: 0;
        }
        .idu-slot-edge {
          position: absolute;
          top: 16px;
          left: 0;
          width: 3px;
          height: 22px;
          border-radius: 0 2px 2px 0;
        }

        /* Sponsors — a white band, logos on the page rather than in tiles */
        .idu-sponsor-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: clamp(28px, 6vw, 90px);
        }
        .idu-sponsor-cell {
          flex: 0 1 300px;
          min-width: 0;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .idu-sponsor-cell:hover {
          transform: translateY(-3px);
        }
        .idu-sponsor-logo {
          max-width: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        /* Register */
        .idu-register-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: clamp(26px, 4vw, 60px);
          align-items: start;
        }
        .idu-form-panel {
          padding: clamp(22px, 2.6vw, 34px);
        }
        .idu-form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .idu-input:focus {
          border-color: ${MAGENTA} !important;
          box-shadow: 0 0 0 3px rgba(209, 60, 196, 0.16);
        }
        .idu-submit {
          font-family: ${FD};
          font-weight: 700;
          font-size: 16px;
          color: #ffffff;
          background: ${SPECTRUM};
          border: none;
          border-radius: 9999px;
          padding: 15px 28px;
          cursor: pointer;
          transition: filter 0.2s ease, transform 0.2s ease;
        }
        .idu-submit:hover:not(:disabled) {
          filter: brightness(1.06);
          transform: translateY(-2px);
        }
        .idu-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Footer */
        .idu-footer-top {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(24px, 4vw, 64px);
          align-items: flex-start;
          justify-content: space-between;
        }

        /* ── Responsive ─────────────────────────────────────────────────── */
        @media (max-width: 1080px) {
          .idu-slot {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .idu-slot-time {
            padding-top: 0;
          }
        }
        @media (max-width: 960px) {
          .idu-nav-links {
            display: none;
          }
          .idu-burger {
            display: flex;
            margin-left: auto;
          }
          .idu-nav-cta {
            display: none;
          }
          .idu-mobile-menu {
            display: flex;
          }
          .idu-two-col,
          .idu-two-col-top,
          .idu-register-grid,
          .idu-dark-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .idu-side-photo {
            min-height: 0;
          }
          .idu-side-photo img {
            height: auto;
          }

          .idu-agenda-split {
            grid-template-columns: minmax(0, 1fr);
          }
          .idu-hero-art {
            background-position: 70% center;
          }
          .idu-hero-scrim {
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.5) 0%,
              rgba(0, 0, 0, 0.36) 52%,
              rgba(0, 0, 0, 0.18) 100%
            );
          }
        }
        @media (max-width: 620px) {
          /* The card is taller than it is wide here, so the cover crop shows
             only a narrow slice of the art. Pull that slice left of the torus,
             into the gradient wash, where the stacked copy still reads. */
          .idu-hero-art {
            background-position: 42% center;
          }
          .idu-hero-scrim {
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.56) 0%,
              rgba(0, 0, 0, 0.42) 55%,
              rgba(0, 0, 0, 0.28) 100%
            );
          }
          .idu-form-row {
            grid-template-columns: minmax(0, 1fr);
          }
          .idu-brand-img {
            height: 24px;
          }
          .idu-brand-plate {
            padding: 9px 14px;
          }
        }
        @media (max-width: 640px) {
          /* globals.css:234 forces every <section> to 48px/40px !important
             below 640px, which is more padding than this page carries at 760
             and reverses the taper. A class beats a type selector, so these
             win without needing to touch the global rule. */
          .idu-section {
            padding-top: 34px !important;
            padding-bottom: 34px !important;
          }
          #top {
            padding-top: 28px !important;
            padding-bottom: 18px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .idu-cta,
          .idu-sponsor-cell,
          .idu-submit,
          .idu-nav-cta {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
