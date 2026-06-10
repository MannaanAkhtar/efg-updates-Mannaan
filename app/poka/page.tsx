"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  submitForm,
  isWorkEmail,
  validatePhone,
  COUNTRY_CODES,
  type CountryCode,
} from "@/lib/form-helpers";

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Poka Ã— Events First Group â€” Executive Roundtable
// "Turn Your Frontline into a Strategic Growth Lever"
//
// Visual system: industrial-premium. Deep navy + electric blue, with a
// safety-yellow accent reserved for moments that demand attention (CTAs,
// active state markers, hairlines). Hero uses a real shop-floor image
// behind a heavy dark gradient. Grid-of-dots backdrop in section blocks
// echoes a blueprint / line-of-sight feel without being on-the-nose.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// ─── Brand tokens — IFS brand palette (mapped onto the existing Poka token names
// so the entire page picks up the IFS purple template via this single block) ─
const BLUE = "#8427E2";        // IFS Tier 2 · Purple — primary accent
const BLUE_DEEP = "#360065";   // IFS Tier 1 · Dark Purple
const BLUE_GLOW = "#CD92FF";   // IFS Tier 2 · Light Purple — highlights / glow
const YELLOW = "#33FF94";      // IFS Tier 3 · Green — secondary CTA / highlight
const NAVY = "#170430";        // IFS Tier 1 · Midnight Purple — page base
const NAVY_DEEP = "#0A0218";   // Deepest darkening (off-spec, for footer/depth)
const INK = "#0A0218";

// On-dark text tokens (formerly hero-only; now used across the whole page)
const WHITE = "#FFFFFF";
const FAINT = "rgba(255,255,255,0.52)";
const MUTE = "rgba(255,255,255,0.78)";
const HAIR = "rgba(255,255,255,0.08)";
const HAIR_STRONG = "rgba(255,255,255,0.18)";

// Section-surface tokens — repointed from light paper to dark IFS layers so
// every existing "light section" component renders as a dark purple panel.
const PAPER = "#170430";       // IFS Midnight Purple — was #FFFFFF
const PAPER_SOFT = "#250146";  // IFS card surface — was #F4F7FB
const INK_DARK = "#FFFFFF";    // Headings — flipped to white
const INK_BODY = "rgba(255,255,255,0.85)";
const INK_MUTE = "rgba(255,255,255,0.78)";
const INK_FAINT = "rgba(255,255,255,0.55)";
const LINE = "rgba(205,146,255,0.22)"; // IFS_BORDER — Light Purple at 22%

// â”€â”€â”€ Assets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const POKA_LOGO =
  "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Poka-Logo-Colour.webp";
const HERO_BG =
  "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Industrial_efficiency_in_action_Poka.png";
const EFG_LOGO = "/events-first-group_logo_alt.svg";

// Confirmed: 29 June 2026, in-person executive roundtable in Dubai (GST/UTC+4).
// Time defaults to 15:00 GST — adjust here + in layout.tsx if it shifts.
const EVENT_DATE_ISO = "2026-06-29T15:00:00+04:00";

// â”€â”€â”€ Why attend â€” adapted from Poka's webinar themes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TAKEAWAYS: { title: string; body: string }[] = [
  {
    title: "Why continuous-improvement programmes plateau",
    body: "The systems gap behind stalled CI initiatives: fragmented work, inconsistency across shifts and sites, and tribal knowledge that never scales.",
  },
  {
    title: "Connected work, scaled enterprise-wide",
    body: "How a connected work strategy turns fragmented improvement into enterprise-wide performance.",
  },
  {
    title: "AI at the point of work",
    body: "How AI augments frontline execution: knowledge, troubleshooting and decision support at the moment value is created.",
  },
  {
    title: "A KPI framework that moves the needle",
    body: "Time-to-competency, downtime, first-pass yield, rework and changeover. The metrics that separate intent from execution.",
  },
  {
    title: "ROI levers, not slideware",
    body: "How execution translates directly into margin, capacity and resilience, plus the levers operations leaders should pull first.",
  },
];

// Why Attend — board-level context for the roundtable
const WHY_REASONS: string[] = [
  "Frontline productivity is now a board-level priority, not just an operational KPI.",
  "Margin pressure is rising faster than productivity can keep up.",
  "Continuous-improvement programmes are plateauing without systems to scale best practices.",
  "AI is reshaping point-of-work performance, but only with connected execution in place.",
  "Tribal knowledge is walking out the door faster than it's being captured.",
];
const WHY_CLOSING =
  "The companies pulling ahead won't just have stronger strategies; they'll execute them consistently, every shift, every site, every team.";

// â”€â”€â”€ Who is the roundtable for â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AUDIENCE: { role: string; sub: string }[] = [
  { role: "Operations & Production", sub: "VPs / Directors / Heads of Operations" },
  {
    role: "Manufacturing Excellence & Continuous Improvement",
    sub: "CI, lean and TPM leaders",
  },
  { role: "Plant & Site Leadership", sub: "Plant managers and site directors" },
  {
    role: "Digital & Operational Transformation",
    sub: "Digital, IT/OT and Industry 4.0 leaders",
  },
  {
    role: "Learning, Training & Workforce Development",
    sub: "HR, training and operational learning leaders",
  },
];

// ─── Agenda — programme schedule ────────────────────────────────────────────
type AgendaItem = { time: string; title: string; isBreak?: boolean };
const AGENDA: AgendaItem[] = [
  { time: "10:00 — 10:15", title: "Welcome & coffee break" },
  { time: "10:15 — 10:30", title: "What Is Connected Work Technology — and Why Now?" },
  { time: "10:30 — 10:50", title: "From Experience to Excellence: Retaining What Your Best Workers Know" },
  { time: "10:50 — 11:10", title: "Coffee Break", isBreak: true },
  { time: "11:10 — 11:30", title: "How Leading Manufacturers Are Standardising the Daily Management Routine" },
  { time: "11:30 — 11:45", title: "The Operator's Edge: How Industrial AI Is Changing What's Possible on the Shop Floor" },
  { time: "11:45 — 12:15", title: "Open Q&A" },
  { time: "12:15", title: "Lunch", isBreak: true },
];

// â”€â”€â”€ Speakers â€” empty placeholder blocks (to be confirmed) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type PokaSpeaker = {
  name: string;
  role: string;
  title?: string;
  photo?: string;
  initials?: string;
  linkedin?: string;
};

const SPEAKERS: PokaSpeaker[] = [
  {
    name: "Mohammed Sa'Adeh",
    role: "Moderator",
    title: "Country Leader — Saudi Arabia, IFS",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Mohammed_Saadeh.png",
    initials: "MS",
    linkedin: "https://www.linkedin.com/in/mohammed-sa-adeh-76393a14/",
  },
  {
    name: "Aïchatou Abdou",
    role: "Panelist",
    title: "Global Director Strategic Alliance",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/A%C3%AFchatou_Abdou.jpg",
    initials: "AA",
    linkedin: "https://www.linkedin.com/in/a%C3%AFchatou-h%C3%A9l%C3%A8ne-abdou-ing/",
  },
  {
    name: "Keerthie Maruthapillai",
    role: "Panelist",
    title: "Presales Solution Architect, IFS",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Keerthie1.jpg",
    initials: "KM",
    linkedin: "https://www.linkedin.com/in/keerthie/",
  },
];

// â”€â”€â”€ Industries / Countries (form selects) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const INDUSTRIES = [
  "Discrete Manufacturing",
  "Process Manufacturing",
  "Automotive",
  "Aerospace & Defence",
  "Consumer Goods (CPG)",
  "Food & Beverage",
  "Pharmaceuticals & Healthcare",
  "Energy & Utilities",
  "Chemicals",
  "Metals & Mining",
  "Building Products & Construction Materials",
  "Logistics & Supply Chain",
  "Other",
];

const COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Bahrain",
  "Kuwait",
  "Oman",
  "Qatar",
  "United Kingdom",
  "United States",
  "Canada",
  "Germany",
  "France",
  "Netherlands",
  "Sweden",
  "Spain",
  "Italy",
  "India",
  "Singapore",
  "Australia",
  "South Africa",
  "Other",
];

// â”€â”€â”€ Poka Logo component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PokaLogo({
  height = 32,
  tone = "color",
}: {
  height?: number;
  tone?: "color" | "white";
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={POKA_LOGO}
      alt="Poka"
      style={{
        height,
        width: "auto",
        display: "block",
        userSelect: "none",
        filter: tone === "white" ? "brightness(0) invert(1)" : "none",
        transition: "filter 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    />
  );
}

// â”€â”€â”€ Top Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Per brand-sponsor rule: only Poka's logo lives in the nav. EFG attribution
// is in the footer.
function TopBar() {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goReserve = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document
      .getElementById("reserve")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToId = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const NAV_LINKS: { id: string; label: string }[] = [
    { id: "learn", label: "What you'll learn" },
    { id: "why", label: "Why attend" },
    { id: "agenda", label: "Agenda" },
    { id: "speakers", label: "Speakers" },
    { id: "audience", label: "Audience" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: condensed ? "4px 0" : "8px 0",
        background: condensed
          ? "rgba(10,2,24,0.92)"
          : "linear-gradient(180deg, rgba(10,2,24,0.70) 0%, rgba(10,2,24,0) 100%)",
        backdropFilter: condensed ? "blur(18px) saturate(160%)" : "blur(6px)",
        WebkitBackdropFilter: condensed ? "blur(18px) saturate(160%)" : "blur(6px)",
        borderBottom: condensed
          ? `1px solid ${LINE}`
          : "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/ifs_logo_negative_rgb-1.svg"
            alt="IFS"
            style={{ height: 56, width: "auto", display: "block" }}
          />
        </a>

        <nav
          className={`poka-nav-links ${condensed ? "poka-nav-links--dark" : "poka-nav-links--light"}`}
          aria-label="Page sections"
        >
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={scrollToId(l.id)}>
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#reserve"
          onClick={goReserve}
          className="poka-nav-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 999,
            background: BLUE,
            color: WHITE,
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.01em",
            textDecoration: "none",
            border: `1px solid ${BLUE_GLOW}55`,
            boxShadow: `0 8px 20px ${BLUE}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            whiteSpace: "nowrap",
          }}
        >
          Reserve seat
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </header>
  );
}

// â”€â”€â”€ Countdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Countdown({ targetISO }: { targetISO: string }) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [parts, setParts] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setParts({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!mounted) return null;

  const cells: { v: number; l: string }[] = [
    { v: parts.d, l: "Days" },
    { v: parts.h, l: "Hours" },
    { v: parts.m, l: "Min" },
    { v: parts.s, l: "Sec" },
  ];

  return (
    <div className="poka-countdown">
      <span className="poka-countdown__eyebrow">
        <span aria-hidden className="poka-countdown__dot" />
        Roundtable begins in
      </span>
      <div className="poka-countdown__row">
        {cells.map((c, i) => (
          <React.Fragment key={c.l}>
            <span className="poka-countdown__cell">
              <span className="poka-countdown__num">
                {String(c.v).padStart(2, "0")}
              </span>
              <span className="poka-countdown__label">{c.l}</span>
            </span>
            {i < cells.length - 1 && (
              <span aria-hidden className="poka-countdown__sep" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Hero() {
  const scrollToReserve = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document
      .getElementById("reserve")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="poka-hero">
      {/* Industrial photograph backdrop â€” shown at full strength */}
      <div aria-hidden className="poka-hero__bg" />

      <div className="poka-hero__content">
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="poka-hero-eyebrow"
        >
          <span className="poka-hero-eyebrow__text">Executive Roundtable</span>
          <span aria-hidden className="poka-hero-eyebrow__dot" />
          <span className="poka-hero-eyebrow__text">By Invitation</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="poka-hero-headline"
        >
          Turn your frontline into a{" "}
          <span className="poka-hero-headline__accent">strategic growth lever</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="poka-hero-sub"
        >
          Close the execution gap. Every shift. Every site. Every team.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: "clamp(28px, 4vw, 44px)" }}
        >
          <a href="#reserve" onClick={scrollToReserve} className="poka-hero-cta">
            Reserve your seat
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: "clamp(28px, 4vw, 44px)" }}
        >
          <Countdown targetISO={EVENT_DATE_ISO} />
        </motion.div>

        {/* Event detail strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="poka-event-strip"
        >
          {[
            { label: "Date", value: "29 Jun 2026" },
            { label: "Venue", value: "Hilton Riyadh Hotel & Residences, Saudi Arabia" },
          ].map((s) => (
            <div key={s.label} className="poka-event-strip__cell">
              <span className="poka-event-strip__label">{s.label}</span>
              <span className="poka-event-strip__value">{s.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// â”€â”€â”€ Section Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SectionHeader({
  eyebrow,
  title,
  align = "left",
  maxWidth = 720,
  theme = "light",
}: {
  eyebrow: string;
  title: React.ReactNode;
  align?: "left" | "center";
  maxWidth?: number;
  theme?: "light" | "dark";
}) {
  const titleColor = theme === "dark" ? WHITE : INK_DARK;
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: 28,
        maxWidth,
        marginLeft: align === "center" ? "auto" : 0,
        marginRight: align === "center" ? "auto" : 0,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: BLUE_GLOW,
            boxShadow: `0 0 12px ${BLUE_GLOW}`,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 11.5,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: BLUE_GLOW,
            fontWeight: 700,
            textShadow: `0 0 14px ${BLUE_GLOW}55`,
          }}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 3.4vw, 44px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.08,
          color: titleColor,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

// â”€â”€â”€ Why attend â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LearnAndWhy() {
  const learnRef = useRef<HTMLDivElement | null>(null);
  const learnInView = useInView(learnRef, { once: true, margin: "-80px" });
  const whyRef = useRef<HTMLDivElement | null>(null);
  const whyInView = useInView(whyRef, { once: true, margin: "-80px" });

  return (
    <section className="poka-light-section poka-learnwhy">
      {/* Top blue hairline */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${BLUE}, transparent)`,
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <span aria-hidden className="poka-light-section__dots" />

      <div className="poka-learnwhy__inner">
        {/* In this roundtable, you'll learn */}
        <div id="learn" ref={learnRef} className="poka-learnwhy__block">
          <SectionHeader
            eyebrow="In this roundtable"
            title={
              <>
                In this roundtable,{" "}
                <span style={{ color: BLUE_GLOW }}>you&rsquo;ll learn</span>
              </>
            }
            maxWidth={820}
          />

          <div className="poka-takeaway-grid">
            {TAKEAWAYS.map((t, i) => (
              <motion.div
                key={t.title}
                className="poka-takeaway-card"
                initial={{ opacity: 0, y: 18 }}
                animate={learnInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.06 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span aria-hidden className="poka-takeaway-card__sheen" />
                <span aria-hidden className="poka-takeaway-card__corner" />

                <div className="poka-takeaway-card__top">
                  <span aria-hidden className="poka-takeaway-card__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="poka-takeaway-card__title">{t.title}</h3>
                <p className="poka-takeaway-card__body">{t.body}</p>

                <span aria-hidden className="poka-takeaway-card__rule" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Inner divider between the two blocks */}
        <span aria-hidden className="poka-learnwhy__divider" />

        {/* Why attend */}
        <div id="why" ref={whyRef} className="poka-learnwhy__block">
          <div className="poka-why-grid">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="poka-why-headline"
            >
              <span className="poka-why-headline__eyebrow">
                <span aria-hidden className="poka-why-headline__dot" />
                Why attend
              </span>
              <h2 className="poka-why-headline__title">
                Why
                <br />
                Attend
              </h2>
            </motion.div>

            <div className="poka-why-list">
              {WHY_REASONS.map((r, i) => (
                <motion.div
                  key={i}
                  className="poka-why-row"
                  initial={{ opacity: 0, x: 18 }}
                  animate={whyInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.55,
                    delay: 0.08 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span aria-hidden className="poka-why-check">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <p className="poka-why-row__text">{r}</p>
                </motion.div>
              ))}

              <motion.p
                className="poka-why-closing"
                initial={{ opacity: 0, y: 14 }}
                animate={whyInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.08 * WHY_REASONS.length + 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {WHY_CLOSING}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Agenda — programme schedule ────────────────────────────────────────────
function Agenda() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="agenda"
      ref={ref}
      className="poka-light-section poka-agenda"
    >
      {/* Top blue hairline */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${BLUE}, transparent)`,
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <span aria-hidden className="poka-light-section__dots" />

      <div className="poka-agenda__inner">
        <SectionHeader
          eyebrow="Agenda"
          title={<>Event <span style={{ color: BLUE_GLOW }}>Agenda</span></>}
          maxWidth={820}
        />

        <div className="poka-agenda-list">
          {AGENDA.map((item, i) => (
            <motion.div
              key={i}
              className={`poka-agenda-row${item.isBreak ? " is-break" : ""}`}
              initial={{ opacity: 0, x: 14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: 0.05 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="poka-agenda-row__time">{item.time}</span>
              <span aria-hidden className="poka-agenda-row__dot" />
              <h3 className="poka-agenda-row__title">{item.title}</h3>
              {item.isBreak && (
                <span aria-hidden className="poka-agenda-row__badge">Break</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Who is the roundtable for ────────────────────────────────────────────
function WhoForBlock() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div id="audience" ref={ref} className="poka-audreserve__block">
      <SectionHeader
        theme="light"
        eyebrow="Designed for"
        title={
          <>
            Operations leaders accountable for{" "}
            <span style={{ color: BLUE_GLOW }}>execution at scale</span>
          </>
        }
        maxWidth={820}
      />

      <p className="poka-who-intro">
        A curated table of senior leaders responsible for turning operational
        intent into measurable, repeatable execution across plants and shifts.
      </p>

      <ul className="poka-who-list">
        {AUDIENCE.map((a, i) => (
          <motion.li
            key={a.role}
            className="poka-who-card"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.55,
              delay: 0.06 * i,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="poka-who-card__panel">
              <span aria-hidden className="poka-who-card__reflection" />
              <span aria-hidden className="poka-who-card__sheen" />
              <span aria-hidden className="poka-who-card__corner" />
              <span aria-hidden className="poka-who-card__stripe" />
              <span aria-hidden className="poka-who-card__shimmer" />
              <span aria-hidden className="poka-who-card__watermark">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="poka-who-card__role">{a.role}</h3>
              <p className="poka-who-card__sub">{a.sub}</p>

              <span aria-hidden className="poka-who-card__rule" />
            </div>
          </motion.li>
        ))}
      </ul>

    </div>
  );
}

// â”€â”€â”€ Speakers (empty placeholder blocks) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Speakers() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="speakers" className="poka-speakers-section">
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)`,
          opacity: 0.45,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <span aria-hidden className="poka-speakers-section__grid" />

      <div
        ref={ref}
        style={{
          position: "relative",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
          zIndex: 2,
        }}
      >
        <SectionHeader
          theme="dark"
          eyebrow="Speakers"
          title={<>Event <span style={{ color: BLUE_GLOW }}>Speakers</span></>}
          maxWidth={780}
        />

        <div className="poka-speakers-grid">
          {SPEAKERS.map((s, i) => (
            <motion.div
              key={`speaker-${i}`}
              className="poka-speaker-card"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: 0.08 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span aria-hidden className="poka-speaker-card__hairline" />
              <div
                className={`poka-speaker-card__avatar${s.photo ? " has-photo" : ""}`}
              >
                {s.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.photo}
                    alt={s.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 18%",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  /* Placeholder silhouette */
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <div className="poka-speaker-card__body">
                <h3 className="poka-speaker-card__name">{s.name}</h3>
                {s.title && (
                  <p className="poka-speaker-card__title">{s.title}</p>
                )}
                {!s.photo && (
                  <p className="poka-speaker-card__note">
                    Details shared with confirmed attendees.
                  </p>
                )}
                {s.linkedin && (
                  <a
                    href={s.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name} on LinkedIn`}
                    className="poka-speaker-card__ln"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ Form Field helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: error ? "#b91c1c" : INK_MUTE,
          fontWeight: 700,
        }}
      >
        {label}
        {required && <span style={{ color: BLUE_GLOW, marginLeft: 4 }}>*</span>}
      </span>
      {children}
      {error && (
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            color: "#b91c1c",
            marginTop: 2,
          }}
        >
          {error}
        </span>
      )}
    </label>
  );
}

// â”€â”€â”€ Reservation Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ReserveBlock() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const defaultPhoneCountry = useMemo<CountryCode>(
    () => COUNTRY_CODES.find((c) => c.country === "AE") ?? COUNTRY_CODES[0],
    [],
  );
  const [phoneCountry, setPhoneCountry] =
    useState<CountryCode>(defaultPhoneCountry);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Business email is required";
    else if (!isWorkEmail(email.trim()))
      newErrors.email =
        "Please use your work email. Free providers are not accepted";
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!company.trim()) newErrors.company = "Company is required";
    const phoneError = validatePhone(phone, phoneCountry);
    if (phoneError) newErrors.phone = phoneError;
    if (!country) newErrors.country = "Please select a country";
    if (!industry) newErrors.industry = "Please select an industry";
    if (!consent) newErrors.consent = "Please confirm consent to proceed";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitState("submitting");
    setSubmitError("");
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    const fullPhone = `${phoneCountry.code} ${cleanPhone}`;
    const res = await submitForm({
      type: "contact",
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      job_title: jobTitle.trim(),
      company: company.trim(),
      phone: fullPhone,
      event_name:
        "Poka Executive Roundtable: Turn Your Frontline into a Strategic Growth Lever",
      metadata: {
        "Event Page": "Poka Executive Roundtable",
        "Page Section": "Reservation Form",
        "First Name": firstName.trim(),
        "Last Name": lastName.trim(),
        "Phone Country": `${phoneCountry.name} (${phoneCountry.code})`,
        Country: country,
        Industry: industry,
        "Consent Given": "true",
      },
    });
    if (res.success) {
      setSubmitState("success");
      setEmail("");
      setFirstName("");
      setLastName("");
      setJobTitle("");
      setCompany("");
      setPhone("");
      setPhoneCountry(defaultPhoneCountry);
      setCountry("");
      setIndustry("");
      setConsent(false);
    } else {
      setSubmitState("error");
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${LINE}`,
    background: "rgba(10,2,24,0.55)",
    color: WHITE,
    fontFamily: "var(--font-outfit)",
    fontSize: 14.5,
    outline: "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  };

  return (
    <div id="reserve" ref={ref} className="poka-audreserve__block">
      <div
        className="poka-form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.95fr 1.05fr",
            gap: "clamp(36px, 5vw, 72px)",
            alignItems: "start",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader
              theme="light"
              eyebrow="Reserve"
              title={<>Request your seat at the table</>}
              maxWidth={520}
            />
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(15px, 1.2vw, 17px)",
                lineHeight: 1.7,
                color: INK_MUTE,
                margin: "0 0 22px",
                maxWidth: 460,
              }}
            >
              This roundtable is by invitation only. Apply below and our team
              will confirm your seat and share dial-in details within 48 hours.
            </p>

            <div className="poka-reserve-info">
              <span aria-hidden className="poka-reserve-info__hairline" />
              <div className="poka-reserve-detail">
                <span className="poka-reserve-detail__label">Format</span>
                <span className="poka-reserve-detail__value">Executive Roundtable</span>
                <span className="poka-reserve-detail__sub">
                  29 Jun 2026 · Chatham House Rule
                </span>
              </div>
              <div className="poka-reserve-detail">
                <span className="poka-reserve-detail__label">Audience</span>
                <span className="poka-reserve-detail__value">
                  Operations & manufacturing leaders
                </span>
                <span className="poka-reserve-detail__sub">
                  Curated · invitation only
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="poka-form-panel"
          >
            <span aria-hidden className="poka-form-panel__hairline" />

            {submitState === "success" ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: BLUE,
                    marginBottom: 18,
                    boxShadow: `0 12px 32px ${BLUE}55`,
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={WHITE}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px, 2vw, 24px)",
                    fontWeight: 700,
                    color: INK_DARK,
                  }}
                >
                  Request received.
                </h3>
                <p
                  style={{
                    margin: "12px auto 0",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14.5,
                    color: INK_MUTE,
                    lineHeight: 1.6,
                    maxWidth: 380,
                  }}
                >
                  We&rsquo;ll be in touch within 48 hours with your invitation
                  and dial-in details.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                />

                <Field label="Business email" error={errors.email} required>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="name@company.com"
                    autoComplete="email"
                    style={inputStyle}
                    aria-invalid={!!errors.email}
                    suppressHydrationWarning
                  />
                </Field>

                <div
                  className="poka-form-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <Field label="First name" error={errors.firstName} required>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName)
                          setErrors({ ...errors, firstName: "" });
                      }}
                      autoComplete="given-name"
                      style={inputStyle}
                      aria-invalid={!!errors.firstName}
                      suppressHydrationWarning
                    />
                  </Field>
                  <Field label="Last name" error={errors.lastName} required>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName)
                          setErrors({ ...errors, lastName: "" });
                      }}
                      autoComplete="family-name"
                      style={inputStyle}
                      aria-invalid={!!errors.lastName}
                      suppressHydrationWarning
                    />
                  </Field>
                </div>

                <div
                  className="poka-form-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <Field label="Job title" error={errors.jobTitle} required>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => {
                        setJobTitle(e.target.value);
                        if (errors.jobTitle)
                          setErrors({ ...errors, jobTitle: "" });
                      }}
                      autoComplete="organization-title"
                      style={inputStyle}
                      aria-invalid={!!errors.jobTitle}
                      suppressHydrationWarning
                    />
                  </Field>
                  <Field label="Company" error={errors.company} required>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        if (errors.company)
                          setErrors({ ...errors, company: "" });
                      }}
                      autoComplete="organization"
                      style={inputStyle}
                      aria-invalid={!!errors.company}
                      suppressHydrationWarning
                    />
                  </Field>
                </div>

                <Field label="Phone number" error={errors.phone} required>
                  <div
                    className="poka-phone-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(118px, 130px) 1fr",
                      gap: 10,
                    }}
                  >
                    <select
                      value={`${phoneCountry.code}-${phoneCountry.country}`}
                      onChange={(e) => {
                        const [code, country] = e.target.value.split("-");
                        const next = COUNTRY_CODES.find(
                          (c) => c.code === code && c.country === country,
                        );
                        if (next) {
                          setPhoneCountry(next);
                          setPhone((prev) => prev.slice(0, next.length));
                          if (errors.phone)
                            setErrors({ ...errors, phone: "" });
                        }
                      }}
                      aria-label="Phone country code"
                      style={inputStyle}
                      suppressHydrationWarning
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option
                          key={`${c.code}-${c.country}`}
                          value={`${c.code}-${c.country}`}
                          style={{ background: PAPER, color: INK_DARK }}
                        >
                          {c.country} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value
                          .replace(/[^\d]/g, "")
                          .slice(0, phoneCountry.length);
                        setPhone(digitsOnly);
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }}
                      placeholder={phoneCountry.placeholder}
                      autoComplete="tel-national"
                      maxLength={phoneCountry.length}
                      style={inputStyle}
                      aria-invalid={!!errors.phone}
                      suppressHydrationWarning
                    />
                  </div>
                </Field>

                <div
                  className="poka-form-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <Field label="Country" error={errors.country} required>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (errors.country)
                          setErrors({ ...errors, country: "" });
                      }}
                      style={inputStyle}
                      aria-invalid={!!errors.country}
                      suppressHydrationWarning
                    >
                      <option value="" style={{ background: PAPER, color: INK_DARK }}>
                        Select…
                      </option>
                      {COUNTRIES.map((c) => (
                        <option
                          key={c}
                          value={c}
                          style={{ background: PAPER, color: INK_DARK }}
                        >
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Industry" error={errors.industry} required>
                    <select
                      value={industry}
                      onChange={(e) => {
                        setIndustry(e.target.value);
                        if (errors.industry)
                          setErrors({ ...errors, industry: "" });
                      }}
                      style={inputStyle}
                      aria-invalid={!!errors.industry}
                      suppressHydrationWarning
                    >
                      <option value="" style={{ background: PAPER, color: INK_DARK }}>
                        Select…
                      </option>
                      {INDUSTRIES.map((i) => (
                        <option
                          key={i}
                          value={i}
                          style={{ background: PAPER, color: INK_DARK }}
                        >
                          {i}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    cursor: "pointer",
                    marginTop: 4,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (errors.consent)
                        setErrors({ ...errors, consent: "" });
                    }}
                    style={{
                      flexShrink: 0,
                      width: 16,
                      height: 16,
                      marginTop: 3,
                      accentColor: BLUE,
                    }}
                    suppressHydrationWarning
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12.5,
                      color: errors.consent ? "#b91c1c" : INK_MUTE,
                      lineHeight: 1.5,
                    }}
                  >
                    I agree to receive event-related communications from Events
                    First Group and Poka. I understand my information will be
                    handled per the relevant privacy policies.
                  </span>
                </label>

                {submitError && (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "rgba(217, 38, 74, 0.08)",
                      border: "1px solid rgba(217, 38, 74, 0.35)",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      color: "#b91c1c",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  style={{
                    marginTop: 6,
                    padding: "14px 22px",
                    borderRadius: 10,
                    border: "none",
                    background: BLUE,
                    color: WHITE,
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: 14.5,
                    letterSpacing: "0.02em",
                    cursor:
                      submitState === "submitting" ? "wait" : "pointer",
                    boxShadow: `0 12px 30px ${BLUE}55, inset 0 1px 0 rgba(255,255,255,0.4)`,
                    transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
                    opacity: submitState === "submitting" ? 0.7 : 1,
                  }}
                >
                  {submitState === "submitting"
                    ? "Submitting…"
                    : "Request my seat"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
    </div>
  );
}

// ─── Combined: Audience + Reserve in one section ──────────────────────────
function AudienceAndReserve() {
  return (
    <section className="poka-who-section poka-audreserve">
      <span aria-hidden className="poka-who-section__grid" />
      <div className="poka-audreserve__inner">
        <WhoForBlock />
        <span aria-hidden className="poka-audreserve__divider" />
        <ReserveBlock />
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="poka-footer">
      <span aria-hidden className="poka-footer__hairline" />
      <div className="poka-footer__inner">
        <div className="poka-footer__poka-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/ifs_logo_negative_rgb-1.svg"
            alt="IFS"
            style={{ height: 72, width: "auto", display: "block" }}
          />
        </div>
        <div className="poka-footer__right">
          <span className="poka-footer__initiative-label">An initiative by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={EFG_LOGO}
            alt="Events First Group"
            className="poka-footer__efg-logo"
            width={120}
            height={42}
          />
        </div>
      </div>
    </footer>
  );
}

// â”€â”€â”€ Page styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PAGE_STYLES = `
  /* Hero */
  .poka-hero {
    position: relative;
    height: 100vh;
    height: 100svh;
    min-height: 640px;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: clamp(88px, 10vw, 112px) 0 clamp(28px, 4vw, 48px);
    background: ${NAVY_DEEP};
  }
  .poka-hero__bg {
    position: absolute; inset: 0; z-index: 0;
    background-image: url("${HERO_BG}");
    background-size: cover;
    background-position: center;
    /* Full strength — image is the hero. */
  }
  .poka-hero__content {
    position: relative; z-index: 3;
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 clamp(20px, 4vw, 56px);
    width: 100%;
  }
  .poka-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 12px;
    padding: 9px 18px;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02));
    border: 1px solid rgba(255,255,255,0.16);
    backdrop-filter: blur(14px) saturate(170%);
    -webkit-backdrop-filter: blur(14px) saturate(170%);
    box-shadow: 0 8px 22px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.20);
    margin-bottom: clamp(14px, 1.8vw, 22px);
  }
  .poka-hero-eyebrow__text {
    font-family: var(--font-outfit);
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
    white-space: nowrap;
  }
  .poka-hero-eyebrow__dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: ${YELLOW};
    box-shadow: 0 0 12px ${YELLOW}, 0 0 4px ${YELLOW}, inset 0 1px 1px rgba(255,255,255,0.6);
    animation: poka-pulse 3s ease-in-out infinite;
  }
  @keyframes poka-pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.2); }
  }
  .poka-hero-headline {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(36px, 5vw, 76px);
    font-weight: 700;
    letter-spacing: -0.028em;
    line-height: 1.04;
    max-width: 920px;
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 45%, #cbd5e1 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    filter:
      drop-shadow(0 2px 8px rgba(0,0,0,0.55))
      drop-shadow(0 0 32px rgba(0,0,0,0.35));
  }
  .poka-hero-headline__accent {
    background: linear-gradient(135deg, ${BLUE_GLOW} 0%, ${YELLOW} 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
  .poka-hero-sub {
    display: inline-block;
    margin: clamp(20px, 2.5vw, 30px) 0 0;
    padding: 10px 16px;
    font-family: var(--font-outfit);
    font-size: clamp(15px, 1.25vw, 18px);
    line-height: 1.55;
    color: ${WHITE};
    max-width: 600px;
    font-weight: 500;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(7,13,26,0.62) 0%, rgba(7,13,26,0.46) 100%);
    border: 1px solid rgba(255,255,255,0.10);
    backdrop-filter: blur(10px) saturate(140%);
    -webkit-backdrop-filter: blur(10px) saturate(140%);
    box-shadow: 0 8px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10);
    text-shadow: 0 1px 6px rgba(0,0,0,0.7);
  }
  .poka-hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 28px;
    border-radius: 999px;
    background: linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DEEP} 100%);
    color: ${WHITE};
    font-family: var(--font-outfit);
    font-weight: 700;
    font-size: 15px;
    text-decoration: none;
    box-shadow:
      0 18px 40px ${BLUE}55,
      0 0 0 1px ${BLUE_GLOW}55,
      inset 0 1px 0 rgba(255,255,255,0.30);
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s;
  }
  .poka-hero-cta:hover {
    transform: translateY(-2px);
    box-shadow:
      0 24px 50px ${BLUE}66,
      0 0 0 1px ${BLUE_GLOW},
      inset 0 1px 0 rgba(255,255,255,0.35);
  }

  /* Countdown */
  .poka-countdown { display: inline-flex; flex-direction: column; gap: 14px; }
  .poka-countdown__eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    align-self: flex-start;
    padding: 6px 12px;
    border-radius: 999px;
    font-family: var(--font-outfit);
    font-size: 10.5px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: ${WHITE};
    font-weight: 700;
    background: linear-gradient(180deg, rgba(7,13,26,0.62) 0%, rgba(7,13,26,0.46) 100%);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(10px) saturate(140%);
    -webkit-backdrop-filter: blur(10px) saturate(140%);
    box-shadow: 0 6px 18px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.10);
    text-shadow: 0 1px 4px rgba(0,0,0,0.6);
  }
  .poka-countdown__dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: ${BLUE_GLOW};
    box-shadow: 0 0 10px ${BLUE_GLOW};
  }
  .poka-countdown__row {
    display: inline-flex; align-items: center;
    gap: clamp(12px, 1.2vw, 16px);
    padding: 10px clamp(14px, 1.6vw, 20px);
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(7,13,26,0.62) 0%, rgba(7,13,26,0.46) 100%);
    border: 1px solid rgba(255,255,255,0.10);
    backdrop-filter: blur(10px) saturate(140%);
    -webkit-backdrop-filter: blur(10px) saturate(140%);
    box-shadow: 0 8px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10);
  }
  .poka-countdown__cell {
    display: inline-flex; flex-direction: column; align-items: center;
    gap: 4px; min-width: 44px;
  }
  .poka-countdown__num {
    font-family: var(--font-display);
    font-size: clamp(22px, 2vw, 28px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${WHITE};
    font-variant-numeric: tabular-nums;
    line-height: 1;
    text-shadow: 0 1px 6px rgba(0,0,0,0.55);
  }
  .poka-countdown__label {
    font-family: var(--font-outfit);
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.88);
    font-weight: 600;
    text-shadow: 0 1px 4px rgba(0,0,0,0.6);
  }
  .poka-countdown__sep {
    width: 1px; height: 22px; background: ${HAIR_STRONG}; align-self: center;
  }

  /* Event detail strip */
  .poka-event-strip {
    margin-top: clamp(20px, 2.5vw, 32px);
    display: inline-flex;
    align-items: center;
    gap: clamp(10px, 1.2vw, 16px);
    padding: clamp(10px, 1.2vw, 14px) clamp(18px, 2vw, 24px);
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 100%);
    border: 1px solid rgba(255,255,255,0.10);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    box-shadow: 0 18px 50px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset;
    width: auto;
  }
  .poka-event-strip__cell {
    position: relative;
    display: inline-flex; align-items: baseline; gap: 10px;
    padding: 0;
    min-width: 0;
  }
  .poka-event-strip__cell + .poka-event-strip__cell {
    padding-left: clamp(12px, 1.4vw, 18px);
  }
  .poka-event-strip__cell + .poka-event-strip__cell::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 14px;
    background: rgba(255,255,255,0.16);
  }
  .poka-event-strip__label {
    font-family: var(--font-outfit);
    font-size: 10px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.50);
    font-weight: 600;
  }
  .poka-event-strip__value {
    font-family: var(--font-outfit);
    font-size: clamp(13.5px, 1.1vw, 15px);
    color: ${WHITE};
    font-weight: 600;
    line-height: 1.3;
  }
  @media (max-width: 720px) {
    .poka-event-strip {
      flex-direction: column;
      align-items: flex-start;
      border-radius: 18px;
      padding: 14px 18px;
      gap: 6px;
      max-width: 100%;
    }
    .poka-event-strip__cell + .poka-event-strip__cell {
      padding-left: 0;
    }
    .poka-event-strip__cell + .poka-event-strip__cell::before {
      display: none;
    }
    .poka-event-strip__cell {
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .poka-event-strip__value {
      font-size: 13px;
    }
  }

  /* Light section base */
  .poka-light-section {
    position: relative;
    padding: clamp(40px, 4.5vw, 68px) 0;
    background:
      radial-gradient(ellipse 55% 50% at 12% 18%, rgba(132,39,226,0.30) 0%, rgba(132,39,226,0.10) 35%, transparent 70%),
      radial-gradient(ellipse 50% 45% at 88% 82%, rgba(205,146,255,0.18) 0%, transparent 72%),
      linear-gradient(180deg, ${PAPER_SOFT} 0%, ${PAPER} 38%, ${PAPER} 62%, ${PAPER_SOFT} 100%);
    overflow: hidden;
    isolation: isolate;
  }
  .poka-light-section--alt {
    background:
      radial-gradient(ellipse 55% 50% at 88% 18%, rgba(205,146,255,0.22) 0%, transparent 70%),
      radial-gradient(ellipse 50% 45% at 12% 82%, rgba(132,39,226,0.22) 0%, transparent 72%),
      linear-gradient(180deg, ${PAPER} 0%, ${PAPER_SOFT} 50%, ${PAPER} 100%);
  }
  .poka-light-section__dots {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(rgba(205,146,255,0.18) 1px, transparent 1.4px);
    background-size: 28px 28px;
    opacity: 0.42;
    -webkit-mask-image: radial-gradient(ellipse at 50% 50%, #000 25%, transparent 80%);
    mask-image: radial-gradient(ellipse at 50% 50%, #000 25%, transparent 80%);
    z-index: 1;
  }

  /* Combined Audience + Reserve section */
  .poka-audreserve__inner {
    position: relative;
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 clamp(20px, 4vw, 48px);
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: clamp(48px, 5.5vw, 80px);
  }
  .poka-audreserve__block {
    position: relative;
  }
  .poka-audreserve__divider {
    display: block;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${LINE}, transparent);
    margin: 0 auto;
    width: 78%;
    opacity: 0.9;
  }

  /* Combined Learn + Why section */
  .poka-learnwhy__inner {
    position: relative;
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 clamp(20px, 4vw, 48px);
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: clamp(48px, 5.5vw, 80px);
  }
  .poka-learnwhy__block {
    position: relative;
  }
  .poka-learnwhy__divider {
    display: block;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${LINE}, transparent);
    margin: 0 auto;
    width: 78%;
    opacity: 0.9;
  }

  /* Takeaway grid */
  .poka-takeaway-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(20px, 2.2vw, 28px);
    margin-top: 16px;
  }
  .poka-takeaway-card {
    position: relative;
    padding: clamp(26px, 2.6vw, 34px) clamp(24px, 2.4vw, 30px) clamp(22px, 2.3vw, 28px);
    border-radius: 20px;
    background:
      linear-gradient(180deg, rgba(37,1,70,0.85) 0%, rgba(23,4,48,0.85) 100%);
    border: 1px solid ${LINE};
    box-shadow:
      0 1px 0 rgba(205,146,255,0.16) inset,
      0 1px 2px rgba(0,0,0,0.25),
      0 18px 44px rgba(0,0,0,0.35);
    overflow: hidden;
    isolation: isolate;
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    transition:
      transform 0.5s cubic-bezier(0.22,1,0.36,1),
      border-color 0.4s,
      box-shadow 0.4s;
  }
  .poka-takeaway-card:hover {
    transform: translateY(-4px);
    border-color: rgba(205,146,255,0.42);
    box-shadow:
      0 1px 0 rgba(205,146,255,0.24) inset,
      0 1px 2px rgba(0,0,0,0.25),
      0 26px 60px rgba(0,0,0,0.45),
      0 0 0 6px rgba(132,39,226,0.18);
  }
  /* Soft sheen sweeping across the card top — premium glassy feel */
  .poka-takeaway-card__sheen {
    position: absolute;
    inset: 0 0 auto 0;
    height: 60%;
    background: linear-gradient(180deg, rgba(205,146,255,0.10) 0%, rgba(205,146,255,0) 100%);
    pointer-events: none;
    z-index: 0;
  }
  /* Decorative purple corner blur that brightens on hover */
  .poka-takeaway-card__corner {
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(205,146,255,0.20) 0%, rgba(205,146,255,0.06) 50%, transparent 75%);
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.5s, transform 0.6s cubic-bezier(0.22,1,0.36,1);
    opacity: 0.7;
  }
  .poka-takeaway-card:hover .poka-takeaway-card__corner {
    opacity: 1;
    transform: scale(1.15);
  }
  .poka-takeaway-card__top {
    position: relative; z-index: 2;
    display: flex; align-items: center;
    margin-bottom: clamp(18px, 2vw, 24px);
  }
  .poka-takeaway-card__num {
    font-family: var(--font-display);
    font-size: 13px;
    letter-spacing: 0.18em;
    font-weight: 700;
    color: rgba(205,146,255,0.85);
    font-variant-numeric: tabular-nums;
  }
  .poka-takeaway-card__num::before {
    content: "·";
    margin-right: 10px;
    opacity: 0.5;
  }
  .poka-takeaway-card__title {
    position: relative; z-index: 2;
    margin: 0 0 12px;
    font-family: var(--font-display);
    font-size: clamp(18px, 1.5vw, 22px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${INK_DARK};
    line-height: 1.22;
  }
  .poka-takeaway-card__body {
    position: relative; z-index: 2;
    margin: 0;
    font-family: var(--font-outfit);
    font-size: 14.5px;
    line-height: 1.62;
    color: ${INK_BODY};
    font-weight: 500;
  }
  /* Animated bottom rule that scales in on hover */
  .poka-takeaway-card__rule {
    position: absolute;
    bottom: 0; left: clamp(24px, 2.4vw, 30px); right: clamp(24px, 2.4vw, 30px);
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, ${BLUE}, ${BLUE_GLOW});
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
    z-index: 1;
  }
  .poka-takeaway-card:hover .poka-takeaway-card__rule {
    transform: scaleX(1);
  }

  /* Who-for section (light) */
  .poka-who-section {
    position: relative;
    padding: clamp(40px, 4.5vw, 68px) 0;
    background:
      radial-gradient(ellipse 55% 50% at 88% 18%, rgba(132,39,226,0.20) 0%, transparent 70%),
      radial-gradient(ellipse 50% 45% at 12% 82%, rgba(205,146,255,0.15) 0%, transparent 72%),
      linear-gradient(180deg, ${PAPER} 0%, ${PAPER_SOFT} 100%);
    overflow: hidden;
    isolation: isolate;
  }
  .poka-who-section__grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(rgba(205,146,255,0.18) 1px, transparent 1.4px);
    background-size: 28px 28px;
    opacity: 0.40;
    -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 35%, transparent 80%);
    mask-image: radial-gradient(ellipse at 50% 40%, #000 35%, transparent 80%);
    z-index: 1;
  }

  /* Who is this roundtable for — Apple-style ladder */
  .poka-who-intro {
    margin: 0 0 clamp(36px, 4.5vw, 64px);
    font-family: var(--font-outfit);
    font-size: clamp(16px, 1.32vw, 19px);
    line-height: 1.6;
    color: ${INK_BODY};
    max-width: 760px;
    font-weight: 500;
  }
  .poka-who-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(12px, 1.4vw, 18px);
  }
  /* Skeuomorphic outer bezel — dark purple metallic frame (IFS theme) */
  .poka-who-card {
    position: relative;
    padding: 4px;
    border-radius: 20px;
    background:
      linear-gradient(
        165deg,
        rgba(205,146,255,0.45) 0%,
        rgba(132,39,226,0.30) 28%,
        rgba(205,146,255,0.55) 52%,
        rgba(132,39,226,0.30) 78%,
        rgba(205,146,255,0.45) 100%
      );
    box-shadow:
      /* Bezel inset highlights (top) — light purple */
      0 1px 0 rgba(205,146,255,0.55) inset,
      /* Bezel inset shadows (bottom) */
      0 -1px 0 rgba(0,0,0,0.45) inset,
      /* Floating depth */
      0 1px 2px rgba(0,0,0,0.30),
      0 10px 24px rgba(0,0,0,0.35),
      0 22px 44px rgba(0,0,0,0.30);
    transition:
      transform 0.55s cubic-bezier(0.22,1,0.36,1),
      box-shadow 0.5s;
    isolation: isolate;
    cursor: default;
  }
  .poka-who-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 1px 0 rgba(205,146,255,0.7) inset,
      0 -1px 0 rgba(132,39,226,0.40) inset,
      0 2px 4px rgba(0,0,0,0.30),
      0 18px 38px rgba(0,0,0,0.45),
      0 28px 56px rgba(132,39,226,0.30);
  }

  /* Inner glass panel — recessed into the bezel */
  .poka-who-card__panel {
    position: relative;
    padding: clamp(16px, 1.8vw, 22px) clamp(20px, 2vw, 26px);
    border-radius: 16px;
    background:
      linear-gradient(
        180deg,
        rgba(37,1,70,0.92) 0%,
        rgba(23,4,48,0.92) 100%
      );
    backdrop-filter: blur(22px) saturate(150%);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    /* Recessed: inner shadow + edge highlights */
    box-shadow:
      0 1px 0 rgba(205,146,255,0.16) inset,
      0 -1px 0 rgba(0,0,0,0.35) inset,
      inset 0 0 0 1px rgba(205,146,255,0.10),
      inset 0 2px 6px rgba(0,0,0,0.25);
    overflow: hidden;
    isolation: isolate;
  }

  /* Curved glass reflection — top arc highlight (purple-tinted) */
  .poka-who-card__reflection {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 55%;
    background: linear-gradient(
      180deg,
      rgba(205,146,255,0.18) 0%,
      rgba(205,146,255,0.05) 60%,
      transparent 100%
    );
    border-radius: 16px 16px 0 0;
    pointer-events: none;
    z-index: 1;
  }

  /* Thin specular line right at the top edge of the glass */
  .poka-who-card__sheen {
    position: absolute;
    top: 1px; left: 14%; right: 14%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(205,146,255,0.7),
      transparent
    );
    pointer-events: none;
    z-index: 2;
  }

  /* Blue corner orb */
  .poka-who-card__corner {
    position: absolute;
    top: -38px; right: -38px;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(205,146,255,0.20) 0%,
      rgba(205,146,255,0.07) 50%,
      transparent 75%
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0.7;
    transition: opacity 0.5s, transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .poka-who-card:hover .poka-who-card__corner {
    opacity: 1;
    transform: scale(1.2);
  }

  /* Big decorative watermark number in the background */
  .poka-who-card__watermark {
    position: absolute;
    top: -10px;
    right: clamp(14px, 1.8vw, 22px);
    font-family: var(--font-display);
    font-size: clamp(48px, 5.6vw, 76px);
    font-weight: 900;
    letter-spacing: -0.05em;
    line-height: 1;
    color: transparent;
    background: linear-gradient(180deg, rgba(205,146,255,0.32) 0%, rgba(205,146,255,0.04) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    pointer-events: none;
    font-variant-numeric: tabular-nums;
    z-index: 1;
    transition: opacity 0.55s, transform 0.6s cubic-bezier(0.22,1,0.36,1);
    opacity: 0.85;
  }
  .poka-who-card:hover .poka-who-card__watermark {
    opacity: 1;
    transform: translateY(-2px) scale(1.04);
  }

  /* Vertical accent stripe on the left edge */
  .poka-who-card__stripe {
    position: absolute;
    top: clamp(16px, 1.8vw, 22px);
    bottom: clamp(16px, 1.8vw, 22px);
    left: 0;
    width: 3px;
    border-radius: 0 4px 4px 0;
    background: linear-gradient(180deg, ${BLUE} 0%, ${BLUE_GLOW} 100%);
    box-shadow: 0 0 14px rgba(205,146,255,0.40);
    transform: scaleY(0);
    transform-origin: center;
    transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
    pointer-events: none;
    z-index: 2;
  }
  .poka-who-card:hover .poka-who-card__stripe {
    transform: scaleY(1);
  }

  /* Diagonal shimmer sweep on hover */
  .poka-who-card__shimmer {
    position: absolute;
    top: 0; bottom: 0;
    left: -120%;
    width: 55%;
    background: linear-gradient(
      105deg,
      transparent 0%,
      rgba(255,255,255,0.45) 50%,
      transparent 100%
    );
    transform: skewX(-14deg);
    pointer-events: none;
    z-index: 4;
    transition: left 0.95s cubic-bezier(0.22,1,0.36,1);
  }
  .poka-who-card:hover .poka-who-card__shimmer {
    left: 145%;
  }

  .poka-who-card__role {
    position: relative; z-index: 3;
    margin: 0 0 6px;
    font-family: var(--font-display);
    font-size: clamp(15px, 1.3vw, 18px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${INK_DARK};
    line-height: 1.22;
  }
  .poka-who-card__sub {
    position: relative; z-index: 3;
    margin: 0;
    font-family: var(--font-outfit);
    font-size: clamp(12.5px, 1vw, 14px);
    line-height: 1.5;
    color: ${INK_MUTE};
    font-weight: 500;
  }
  .poka-who-card__rule {
    position: absolute;
    bottom: 0; left: clamp(20px, 2vw, 26px); right: clamp(20px, 2vw, 26px);
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, ${BLUE}, ${BLUE_GLOW});
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
    z-index: 2;
  }
  .poka-who-card:hover .poka-who-card__rule {
    transform: scaleX(1);
  }

  /* Facing block — Apple-style two-column ledger */
  .poka-facing-block {
    margin-top: clamp(56px, 6vw, 96px);
  }
  .poka-facing-block__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-outfit);
    font-size: 11.5px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: ${BLUE_GLOW};
    font-weight: 700;
  }
  .poka-facing-block__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${BLUE_GLOW};
    box-shadow: 0 0 12px ${BLUE_GLOW};
  }
  .poka-facing-block__title {
    margin: 14px 0 clamp(28px, 3.4vw, 48px);
    font-family: var(--font-display);
    font-size: clamp(22px, 2.4vw, 32px);
    font-weight: 700;
    letter-spacing: -0.028em;
    line-height: 1.14;
    color: ${INK_DARK};
    max-width: 680px;
  }
  /* Facing — editorial grid-table (typography-led, no card chrome) */
  .poka-facing-table {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
    border-top: 1px solid ${LINE};
    border-bottom: 1px solid ${LINE};
    border-radius: 4px;
    overflow: hidden;
    isolation: isolate;
  }
  .poka-facing-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: clamp(8px, 1vw, 12px);
    padding: clamp(16px, 1.8vw, 22px) clamp(16px, 1.8vw, 22px) clamp(16px, 1.8vw, 22px) clamp(18px, 2vw, 26px);
    transition: padding-left 0.5s cubic-bezier(0.22,1,0.36,1);
    cursor: default;
    overflow: hidden;
    isolation: isolate;
  }
  /* Vertical separators — columns 1 and 2 get a right border (column 3 doesn't) */
  .poka-facing-cell:nth-child(3n + 1),
  .poka-facing-cell:nth-child(3n + 2) {
    border-right: 1px solid ${LINE};
  }
  /* Horizontal separator after the first row (items 4, 5, 6) */
  .poka-facing-cell:nth-child(n + 4) {
    border-top: 1px solid ${LINE};
  }
  /* Soft hover wash that fills the cell behind the content */
  .poka-facing-cell__highlight {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 90% at 0% 50%, rgba(132,39,226,0.18) 0%, transparent 70%),
      linear-gradient(90deg, rgba(132,39,226,0.10) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.45s cubic-bezier(0.22,1,0.36,1);
    pointer-events: none;
    z-index: 0;
  }
  .poka-facing-cell:hover .poka-facing-cell__highlight {
    opacity: 1;
  }
  /* Left-edge indicator bar that animates in on hover */
  .poka-facing-cell::before {
    content: "";
    position: absolute;
    left: 0; top: 18%; bottom: 18%;
    width: 3px;
    background: linear-gradient(180deg, ${BLUE} 0%, ${BLUE_GLOW} 100%);
    box-shadow: 0 0 12px rgba(205,146,255,0.45);
    transform: scaleY(0);
    transform-origin: center;
    transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
    z-index: 1;
  }
  .poka-facing-cell:hover::before {
    transform: scaleY(1);
  }
  .poka-facing-cell:hover {
    padding-left: clamp(26px, 2.8vw, 38px);
  }
  /* Big display number — the editorial anchor */
  .poka-facing-cell__num {
    position: relative; z-index: 2;
    font-family: var(--font-display);
    font-size: clamp(24px, 2.6vw, 36px);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: ${INK_DARK};
    font-variant-numeric: tabular-nums;
    transition: color 0.4s;
  }
  .poka-facing-cell:hover .poka-facing-cell__num {
    color: ${BLUE_GLOW};
  }
  .poka-facing-cell__text {
    position: relative; z-index: 2;
    margin: 0;
    padding-right: 22px;
    font-family: var(--font-outfit);
    font-size: clamp(13px, 1vw, 14.5px);
    line-height: 1.5;
    color: ${INK_BODY};
    font-weight: 500;
  }
  /* Trailing chevron that fades in on hover */
  .poka-facing-cell__caret {
    position: absolute;
    right: clamp(14px, 1.6vw, 20px);
    bottom: clamp(16px, 1.8vw, 22px);
    color: ${BLUE};
    opacity: 0;
    transform: translateX(-6px);
    transition:
      opacity 0.4s,
      transform 0.5s cubic-bezier(0.22,1,0.36,1);
    pointer-events: none;
    z-index: 2;
  }
  .poka-facing-cell:hover .poka-facing-cell__caret {
    opacity: 1;
    transform: translateX(0);
  }

  /* Why Attend section */
  .poka-why-grid {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: clamp(36px, 5vw, 72px);
    align-items: center;
  }
  .poka-why-headline {
    display: flex; flex-direction: column;
    gap: clamp(14px, 1.6vw, 22px);
  }
  .poka-why-headline__eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    align-self: flex-start;
    font-family: var(--font-outfit);
    font-size: 11.5px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: ${BLUE_GLOW};
    font-weight: 700;
  }
  .poka-why-headline__dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: ${BLUE_GLOW};
    box-shadow: 0 0 12px ${BLUE_GLOW};
  }
  .poka-why-headline__title {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(64px, 9vw, 132px);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 0.92;
    color: ${BLUE_GLOW};
  }
  .poka-why-list {
    display: flex; flex-direction: column;
    gap: clamp(14px, 1.5vw, 20px);
  }
  .poka-why-row {
    display: flex; align-items: flex-start; gap: 14px;
  }
  .poka-why-check {
    flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(16,185,129,0.14);
    color: #10B981;
    margin-top: 2px;
  }
  .poka-why-row__text {
    margin: 0;
    font-family: var(--font-outfit);
    font-size: clamp(15px, 1.2vw, 17px);
    line-height: 1.55;
    color: ${INK_BODY};
    font-weight: 500;
  }
  .poka-why-closing {
    margin: clamp(18px, 2.2vw, 28px) 0 0;
    padding-top: clamp(18px, 2vw, 26px);
    border-top: 1px solid ${LINE};
    font-family: var(--font-outfit);
    font-size: clamp(15px, 1.2vw, 17px);
    line-height: 1.65;
    color: ${INK_DARK};
    font-weight: 600;
  }

  /* Agenda section */
  .poka-agenda__inner {
    position: relative;
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 clamp(20px, 4vw, 48px);
    z-index: 2;
  }
  .poka-agenda-list {
    display: flex;
    flex-direction: column;
    margin-top: clamp(28px, 3vw, 44px);
    border-top: 1px solid ${LINE};
  }
  .poka-agenda-row {
    position: relative;
    display: grid;
    grid-template-columns: minmax(140px, 180px) 18px 1fr auto;
    align-items: center;
    gap: clamp(14px, 2vw, 28px);
    padding: clamp(18px, 1.9vw, 24px) 4px;
    border-bottom: 1px solid ${LINE};
    transition: background 0.3s ease, padding-left 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .poka-agenda-row:hover {
    background: linear-gradient(90deg, rgba(205,146,255,0.06) 0%, transparent 80%);
    padding-left: 14px;
  }
  .poka-agenda-row__time {
    font-family: var(--font-display);
    font-size: clamp(14px, 1.2vw, 17px);
    font-weight: 700;
    letter-spacing: 0.06em;
    color: ${BLUE_GLOW};
    text-shadow: 0 0 12px rgba(205,146,255,0.25);
    white-space: nowrap;
  }
  .poka-agenda-row__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${BLUE_GLOW};
    box-shadow: 0 0 10px ${BLUE_GLOW};
    opacity: 0.85;
  }
  .poka-agenda-row__title {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(16px, 1.4vw, 20px);
    font-weight: 700;
    letter-spacing: -0.3px;
    line-height: 1.32;
    color: ${INK_DARK};
  }
  .poka-agenda-row__badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 5px 11px;
    border-radius: 999px;
    border: 1px solid rgba(205,146,255,0.35);
    background: rgba(205,146,255,0.08);
    font-family: var(--font-outfit);
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${BLUE_GLOW};
  }
  .poka-agenda-row.is-break .poka-agenda-row__title {
    font-style: italic;
    font-weight: 500;
    color: ${INK_MUTE};
  }
  .poka-agenda-row.is-break .poka-agenda-row__dot {
    background: transparent;
    border: 1px solid rgba(205,146,255,0.45);
    box-shadow: none;
  }
  @media (max-width: 720px) {
    .poka-agenda-row {
      grid-template-columns: 1fr auto;
      grid-template-areas:
        "time badge"
        "title title";
      row-gap: 8px;
    }
    .poka-agenda-row__time { grid-area: time; }
    .poka-agenda-row__title { grid-area: title; }
    .poka-agenda-row__badge { grid-area: badge; }
    .poka-agenda-row__dot { display: none; }
  }

  /* Speakers section (dark slate) */
  .poka-speakers-section {
    position: relative;
    padding: clamp(40px, 4.5vw, 68px) 0;
    background: linear-gradient(180deg, ${PAPER_SOFT} 0%, ${NAVY} 100%);
    overflow: hidden;
    isolation: isolate;
  }
  .poka-speakers-section__grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(rgba(96,165,250,0.18) 1px, transparent 1.4px);
    background-size: 30px 30px;
    opacity: 0.30;
    -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%);
    mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%);
    z-index: 1;
  }
  .poka-speakers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(20px, 2.2vw, 28px);
    margin-top: 8px;
  }
  .poka-speaker-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 18px;
    padding: clamp(28px, 2.6vw, 36px) clamp(22px, 2.2vw, 28px) clamp(24px, 2.4vw, 32px);
    border-radius: 22px;
    background:
      radial-gradient(ellipse 80% 50% at 50% 0%, rgba(132,39,226,0.10) 0%, transparent 65%),
      linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%);
    border: 1px solid rgba(255,255,255,0.09);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    box-shadow:
      0 16px 40px rgba(0,0,0,0.40),
      0 1px 0 rgba(255,255,255,0.08) inset;
    overflow: hidden;
    isolation: isolate;
    transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s, box-shadow 0.4s;
  }
  .poka-speaker-card:hover {
    transform: translateY(-4px);
    border-color: rgba(132,39,226,0.40);
    box-shadow:
      0 26px 56px rgba(0,0,0,0.50),
      0 1px 0 rgba(255,255,255,0.10) inset,
      0 0 38px rgba(132,39,226,0.22);
  }
  .poka-speaker-card__hairline {
    position: absolute;
    top: 0; left: 14%; right: 14%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${BLUE_GLOW} 30%, rgba(205,146,255,0.85) 50%, ${BLUE_GLOW} 70%, transparent);
    opacity: 0.55;
    pointer-events: none;
    z-index: 2;
  }
  /* Corner accents — top-left and bottom-right */
  .poka-speaker-card::before,
  .poka-speaker-card::after {
    content: "";
    position: absolute;
    width: 14px; height: 14px;
    border-color: rgba(205,146,255,0.55);
    opacity: 0.5;
    pointer-events: none;
    z-index: 2;
    transition: opacity 0.4s, border-color 0.4s;
  }
  .poka-speaker-card::before {
    top: 12px; left: 12px;
    border-top: 1px solid;
    border-left: 1px solid;
    border-top-left-radius: 4px;
  }
  .poka-speaker-card::after {
    bottom: 12px; right: 12px;
    border-bottom: 1px solid;
    border-right: 1px solid;
    border-bottom-right-radius: 4px;
  }
  .poka-speaker-card:hover::before,
  .poka-speaker-card:hover::after {
    opacity: 1;
    border-color: rgba(205,146,255,0.85);
  }

  .poka-speaker-card__avatar {
    flex-shrink: 0;
    width: clamp(112px, 11vw, 140px);
    height: clamp(112px, 11vw, 140px);
    border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%);
    color: ${BLUE_GLOW};
    border: 1px solid rgba(255,255,255,0.14);
    box-shadow:
      0 12px 28px rgba(0,0,0,0.35),
      0 0 0 4px rgba(132,39,226,0.10),
      inset 0 1px 0 rgba(255,255,255,0.12);
    position: relative;
    z-index: 3;
  }
  .poka-speaker-card__body {
    flex: 1; min-width: 0;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    position: relative;
    z-index: 3;
    width: 100%;
  }
  .poka-speaker-card__role {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(205,146,255,0.14);
    border: 1px solid rgba(205,146,255,0.32);
    font-family: var(--font-outfit);
    font-size: 10px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: rgba(205,146,255,0.95);
    font-weight: 700;
    margin-bottom: 4px;
  }
  .poka-speaker-card__name {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(19px, 1.55vw, 23px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${WHITE};
    line-height: 1.18;
  }
  .poka-speaker-card__note {
    margin: 4px 0 0;
    font-family: var(--font-outfit);
    font-size: 12.5px;
    line-height: 1.5;
    color: rgba(255,255,255,0.55);
    font-style: italic;
    max-width: 220px;
  }
  .poka-speaker-card__avatar.has-photo {
    padding: 0;
    overflow: hidden;
    background: linear-gradient(160deg, rgba(132,39,226,0.32) 0%, rgba(205,146,255,0.10) 50%, rgba(255,255,255,0.04) 100%);
  }
  .poka-speaker-card__title {
    margin: 2px 0 0;
    font-family: var(--font-outfit);
    font-size: 13px;
    line-height: 1.5;
    color: rgba(255,255,255,0.7);
    font-weight: 500;
    max-width: 260px;
  }
  .poka-speaker-card__ln {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 14px;
    padding: 7px 14px;
    border-radius: 999px;
    background: rgba(205,146,255,0.10);
    border: 1px solid rgba(205,146,255,0.30);
    font-family: var(--font-outfit);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(205,146,255,0.95);
    text-decoration: none;
    align-self: center;
    transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }
  .poka-speaker-card__ln:hover {
    background: rgba(205,146,255,0.22);
    border-color: rgba(205,146,255,0.55);
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(132,39,226,0.30);
  }

  /* Reserve section (IFS purple) */
  .poka-reserve-section {
    position: relative;
    padding: clamp(40px, 4.5vw, 68px) 0 clamp(36px, 4vw, 60px);
    background:
      radial-gradient(ellipse 55% 50% at 12% 18%, rgba(132,39,226,0.22) 0%, transparent 70%),
      radial-gradient(ellipse 50% 45% at 88% 82%, rgba(205,146,255,0.14) 0%, transparent 72%),
      linear-gradient(180deg, ${PAPER_SOFT} 0%, ${PAPER} 100%);
    overflow: hidden;
    isolation: isolate;
  }
  .poka-reserve-section__grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(rgba(205,146,255,0.16) 1px, transparent 1.4px);
    background-size: 30px 30px;
    opacity: 0.32;
    -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%);
    mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%);
    z-index: 1;
  }
  .poka-reserve-info {
    position: relative;
    display: flex; flex-direction: column;
    padding: clamp(18px, 1.8vw, 24px) clamp(20px, 2vw, 26px) clamp(20px, 2vw, 26px);
    border-radius: 16px;
    background: linear-gradient(180deg, rgba(37,1,70,0.85) 0%, rgba(23,4,48,0.85) 100%);
    border: 1px solid ${LINE};
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    box-shadow: 0 14px 36px rgba(0,0,0,0.35), 0 1px 0 rgba(205,146,255,0.16) inset;
    overflow: hidden;
    max-width: 460px;
  }
  .poka-reserve-info__hairline {
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${BLUE}, transparent);
    opacity: 0.7;
    pointer-events: none;
  }
  .poka-reserve-detail {
    display: flex; flex-direction: column; gap: 4px;
    padding: 12px 0;
  }
  .poka-reserve-detail + .poka-reserve-detail {
    border-top: 1px solid ${LINE};
  }
  .poka-reserve-detail__label {
    font-family: var(--font-outfit);
    font-size: 10.5px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: ${BLUE_GLOW};
    font-weight: 700;
  }
  .poka-reserve-detail__value {
    font-family: var(--font-outfit);
    font-size: 14.5px;
    color: ${INK_DARK};
    font-weight: 700;
    line-height: 1.35;
  }
  .poka-reserve-detail__sub {
    font-family: var(--font-outfit);
    font-size: 12px;
    color: ${INK_MUTE};
  }

  /* Form panel (IFS purple glass) */
  .poka-form-panel {
    position: relative;
    padding: clamp(24px, 3vw, 36px);
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(37,1,70,0.92) 0%, rgba(23,4,48,0.92) 100%);
    border: 1px solid ${LINE};
    backdrop-filter: blur(22px) saturate(150%);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    box-shadow: 0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(205,146,255,0.18);
    overflow: hidden;
  }
  .poka-form-panel__hairline {
    position: absolute;
    top: 0; left: 8%; right: 8%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${BLUE}, transparent);
    opacity: 0.7;
  }

  /* Footer (light) */
  .poka-footer {
    position: relative;
    padding: clamp(14px, 1.6vw, 22px) clamp(20px, 4vw, 48px);
    background: linear-gradient(180deg, ${PAPER} 0%, ${PAPER_SOFT} 100%);
    border-top: 1px solid ${LINE};
    overflow: hidden;
    isolation: isolate;
  }
  .poka-footer__hairline {
    position: absolute;
    top: 0; left: 25%; right: 25%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${BLUE}, transparent);
    opacity: 0.4;
    pointer-events: none;
  }
  .poka-footer__inner {
    position: relative;
    max-width: 1180px;
    margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    gap: 18px;
    flex-wrap: wrap;
  }
  .poka-footer__right {
    display: inline-flex; align-items: center; gap: 14px;
  }
  .poka-footer__initiative-label {
    font-family: var(--font-outfit);
    font-size: 10.5px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: ${INK_MUTE};
    font-weight: 700;
  }
  .poka-footer__efg-logo {
    height: 36px; width: auto; display: block; opacity: 1;
  }

  /* Focus + selects */
  input:focus, select:focus, textarea:focus {
    border-color: ${BLUE_GLOW} !important;
    background: rgba(10,2,24,0.7) !important;
    box-shadow: 0 0 0 3px rgba(132,39,226,0.30) !important;
  }
  select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23CD92FF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 34px !important;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .poka-takeaway-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .poka-speakers-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .poka-facing-table { grid-template-columns: repeat(2, 1fr) !important; }
    .poka-facing-cell:nth-child(3n + 1),
    .poka-facing-cell:nth-child(3n + 2) { border-right: none !important; }
    .poka-facing-cell:nth-child(2n + 1) { border-right: 1px solid ${LINE} !important; }
    .poka-facing-cell:nth-child(n + 4) { border-top: 1px solid ${LINE} !important; }
    .poka-facing-cell:nth-child(n + 3) { border-top: 1px solid ${LINE} !important; }
  }
  @media (max-width: 880px) {
    .poka-form-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
    .poka-form-row, .poka-phone-row { grid-template-columns: 1fr !important; }
    .poka-takeaway-grid, .poka-speakers-grid { grid-template-columns: 1fr !important; }
    .poka-why-grid { grid-template-columns: 1fr !important; gap: 28px !important; align-items: flex-start !important; }
    .poka-why-headline__title { font-size: clamp(48px, 14vw, 80px) !important; }
    .poka-facing-table { grid-template-columns: 1fr !important; }
    .poka-facing-cell:nth-child(2n + 1) { border-right: none !important; }
    .poka-facing-cell:nth-child(n + 2) { border-top: 1px solid ${LINE} !important; }
    .poka-who-list { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 640px) {
    .poka-hero { padding: clamp(90px, 22vw, 110px) 0 clamp(48px, 10vw, 64px) !important; }
    .poka-hero-eyebrow {
      padding: 7px 14px !important;
      margin-bottom: 22px !important;
    }
    .poka-hero-eyebrow__text { font-size: 10px !important; letter-spacing: 0.22em !important; }
    .poka-hero-headline { font-size: 32px !important; line-height: 1.06 !important; }
    .poka-hero-cta { padding: 14px 24px !important; font-size: 14px !important; }
    input, select, textarea { font-size: 16px !important; }
    .poka-nav-cta { display: none !important; }
    .poka-nav-links { display: none !important; }
    .poka-footer__inner {
      flex-wrap: nowrap !important;
      gap: 12px !important;
    }
    .poka-footer__poka-logo img { height: 56px !important; }
    .poka-footer__right { gap: 8px !important; flex-wrap: nowrap; }
    .poka-footer__initiative-label { display: none !important; }
    .poka-footer__efg-logo { height: 42px !important; }
  }

  /* Nav section links */
  .poka-nav-links {
    display: inline-flex;
    align-items: center;
    gap: clamp(18px, 2.2vw, 32px);
  }
  .poka-nav-links a {
    position: relative;
    font-family: var(--font-outfit);
    font-size: 13.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    text-decoration: none;
    white-space: nowrap;
    padding: 6px 0;
    transition: color 0.25s, opacity 0.25s;
  }
  .poka-nav-links a::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 1.5px;
    background: ${BLUE};
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
  }
  .poka-nav-links a:hover::after {
    transform: scaleX(1);
  }
  .poka-nav-links--light a {
    color: rgba(255,255,255,0.78);
    text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  }
  .poka-nav-links--light a:hover {
    color: ${WHITE};
  }
  .poka-nav-links--dark a {
    color: ${INK_BODY};
  }
  .poka-nav-links--dark a:hover {
    color: ${BLUE_GLOW};
  }
  @media (max-width: 1024px) {
    .poka-nav-links { display: none !important; }
  }
`;

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function PokaPage() {
  return (
    <div style={{ background: PAPER, color: INK_BODY, minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />
      <TopBar />
      <main>
        <Hero />
        <LearnAndWhy />
        <Agenda />
        <Speakers />
        <AudienceAndReserve />
      </main>
      <Footer />
    </div>
  );
}
