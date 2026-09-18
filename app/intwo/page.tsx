"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { submitForm, isWorkEmail, validatePhone, COUNTRY_CODES, type CountryCode } from "@/lib/form-helpers";

/* ═══════════════════════════════════════════════════════════════════════════
   Intwo CXO Roundtable — "AI Agents in Action", Dubai, 8 October 2026.

   Visual system, drawn from the Intwo brand styleguide (2023):
   · Light world. The book calls the dark blue a substitute for black — type,
     icons and buttons — and asks for a lot of whitespace, so the page is ice
     and white throughout, with ONE dark act (the live build) as the pivot.
   · Inter only, but on a real scale: Inter Light for headlines (the book's H1
     rule), caps micro-labels for section heads.
   · The panel — their peach/blue colour-burn device — appears as a vertical
     rail on section heads and full-strength behind the dark act.
   · Their asymmetric card corner (30px 0 30px 30px) and 80px pill buttons.
   · The amber node: the hero photograph resolves on a single warm node where
     the data lines converge. That node is the agent, and it recurs as the
     agenda marker and as the only light source in the dark act.
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Brand tokens (Intwo styleguide, "Colours") ──────────────────────────────
const INK = "#002A3B";        // dark blue — type, buttons, the dark act
const BLUE = "#0474A2";       // support blue
const SKY = "#A4D7EC";        // light support blue
const ICE = "#EFF5F8";        // light ground
const WHITE = "#FFFFFF";
const PEACH = "#FF8C59";      // the happy accent — used only as the agent node

const INK_80 = "rgba(0,42,59,0.80)";
const INK_62 = "rgba(0,42,59,0.62)";
const INK_45 = "rgba(0,42,59,0.45)";
const LINE = "rgba(0,42,59,0.12)";
const LINE_SOFT = "rgba(0,42,59,0.07)";

const FONT = "var(--font-inter), system-ui, -apple-system, sans-serif";
const CORNER = "30px 0 30px 30px"; // Intwo card corner

// One vertical rhythm for every section, so the page breathes evenly instead of
// each band inventing its own padding. SECTION_GAP is the space between a
// section head and its content; BLOCK_GAP separates blocks inside a section.
const SECTION_X = "clamp(20px,4vw,44px)";
const SECTION_Y = "clamp(54px,6.2vw,96px)";
const SECTION_PAD = `${SECTION_Y} ${SECTION_X}`;
const SECTION_GAP = "clamp(24px,2.8vw,40px)";
const BLOCK_GAP = "clamp(34px,4vw,60px)";

// ─── Assets ──────────────────────────────────────────────────────────────────
const LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/intwo+logo.svg";
const HERO = "https://efg-final.s3.eu-north-1.amazonaws.com/heros/intwo+hero.png";
// Premise photograph: Unsplash (free licence), Vitaly Gariev — two colleagues
// leaning in over a laptop. Chosen against the Intwo imagery rules: people who
// lean in, two-person interaction, inclusive, no "old economy" paper props.
const PREMISE_IMG =
  "https://images.unsplash.com/photo-1758691737083-0e7fdbde0f05?w=1100&h=1100&q=80&auto=format&fit=crop&crop=faces";

// ─── Event ───────────────────────────────────────────────────────────────────
const EVENT = {
  strapA: "Your ERP knows.",
  strapB: "It just doesn't act.",
  date: "Thursday 8 October 2026",
  dateShort: "8 Oct 2026",
  time: "10:30 – 14:15 GST",
  city: "Dubai",
  venue: "Venue to be confirmed",
  seats: "20 – 25 seats",
};

const NAV_LINKS = [
  { href: "#overview", label: "The session" },
  { href: "#agenda", label: "Agenda" },
  { href: "#live", label: "Agents in Action" },
  { href: "#speakers", label: "Speakers" },
];

const QUESTIONS = [
  "What can an agent actually do inside Dynamics 365 today, as against what the market claims?",
  "Where does the efficiency come from when a business adds agents to a system it already owns?",
  "Where is Microsoft taking Dynamics 365 and agents over the next eighteen months?",
  "Which single process in your business would deliver the most from an agent, and what would it take to get there?",
];

const TAKEAWAYS = [
  {
    t: "Agents, seen and used",
    d: "A working understanding of what agents do inside Dynamics 365 today — seen live, rather than described.",
  },
  {
    t: "Real use cases, on the platform you already run",
    d: "Four to five agents demonstrated as business problem, agent working, result in the system — reskinned to the companies in the room.",
  },
  {
    t: "A named next step",
    d: "You name the process you would automate first, and leave with the offer of a 90-minute discovery session on it.",
  },
];

type Act = {
  time: string;
  dur: string;
  title: string;
  body: string;
  who?: string;
  act?: string;
  hero?: boolean;
};

const AGENDA: Act[] = [
  {
    time: "10:30",
    dur: "30 min",
    title: "Arrival and registration",
    body: "Welcome refreshments. Your badge carries the QR code for the polls. The Agents in Action station is set up and running before the first guest arrives.",
  },
  {
    time: "11:00",
    dur: "10 min",
    title: "Opening",
    body: "We open on the problem, not on Intwo. First poll goes up on screen: have you used an AI agent yourself? Results shown live.",
    who: "Anilesh Kumar",
  },
  {
    time: "11:10",
    dur: "20 min",
    act: "Act 1",
    title: "Wake up: your ERP knows, it just doesn't act",
    body: "Real examples of businesses transformed by AI, and where the efficiency came from. What if your ERP could act before your people knew there was a problem? Automation is added in pieces alongside the ERP, starting now.",
    who: "Pawan Poojari",
  },
  {
    time: "11:30",
    dur: "15 min",
    act: "Act 2",
    title: "Where Microsoft is taking Dynamics 365",
    body: "The direction of travel on agents in the Microsoft stack, from Microsoft.",
    who: "Khurram Zaki, Microsoft",
  },
  {
    time: "11:45",
    dur: "45 min",
    act: "Act 3",
    title: "See it: live agents, start to finish",
    body: "Four to five agents, each shown as business problem, agent working, result in the system. Demo content reskinned to the companies in the room. Working lunch is served from here. Poll midway: which of these would you want first?",
    who: "Pawan Poojari · Harris Muhammed · Ritesh Kumar Singh",
  },
  {
    time: "12:30",
    dur: "30 min",
    title: "Break and lunch",
    body: "The Agents in Action station stays open for anyone who wants to see it early.",
  },
  {
    time: "13:00",
    dur: "35 min",
    act: "Act 4",
    title: "Agents in Action: built for you, live",
    body: "A real requirement is taken from the room, and Intwo's team customizes the agent to it live, in plain language, in front of everyone. You then message the finished agent from your own phone while its work is projected on the main screen.",
    who: "Harris Muhammed · Pawan Poojari",
    hero: true,
  },
  {
    time: "13:35",
    dur: "20 min",
    act: "Act 5",
    title: "Act: your process, not ours",
    body: "Final poll: what is the one process in your business you would hand to an agent tomorrow? Answers appear on screen unattributed, and the room discusses three or four of them live.",
    who: "Anilesh Kumar · Oommen P Oommen",
  },
  {
    time: "13:55",
    dur: "10 min",
    title: "Who we are, and how we help",
    body: "Intwo, the Microsoft credentials, and how agents are delivered and kept running alongside Dynamics 365.",
    who: "Oommen P Oommen",
  },
  {
    time: "14:05",
    dur: "10 min",
    title: "Close and call to action",
    body: "The offer: a 90-minute discovery session on the process you named, at your office, at no cost.",
    who: "Anilesh Kumar",
  },
  {
    time: "14:15",
    dur: "",
    title: "Networking",
    body: "The team stays on the floor until the last guest leaves.",
  },
];

// The five acts run in the rail; everything else (arrival, lunch, the close)
// is the shape of the day and sits on the strip beneath it.
const ACTS = AGENDA.filter((a) => a.act);
const DAY = AGENDA.filter((a) => !a.act);

const EXPERIENCE = [
  {
    t: "The live build",
    d: "A real requirement is taken from the room, in your own words, and Intwo's team customizes the agent to it live, in front of everyone. Ninety seconds, start to finish.",
  },
  {
    t: "Hands-on over WhatsApp",
    d: "Message the finished agent from your own phone on a temporary Intwo number. No terminals, no logins, no MFA. The agent responds while its work inside the system is projected on the main screen, so the room sees both sides at once.",
  },
  {
    t: "A station in the room",
    d: "A laptop running the same agent, for anyone who would rather not use their own phone. It is running before the first guest arrives and stays open through lunch.",
  },
  {
    t: "Guided prompts",
    d: "A card at each seat with three suggested prompts, and an open invitation to try your own.",
  },
];

// `photo` and `linkedin` are optional on purpose: headshots and profile links
// are still to come. Until a speaker has a photo the card shows their initials
// in the same frame, so dropping the real image in later changes nothing else.
type Speaker = { name: string; role: string; org: string; ms?: boolean; photo?: string; linkedin?: string };

const SPEAKERS: Speaker[] = [
  {
    name: "Anilesh Kumar",
    role: "Managing Director MEI and EVP Agentic Applications",
    org: "Intwo",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Anilesh.jpeg",
    linkedin: "https://www.linkedin.com/in/ak2210/",
  },
  {
    name: "Khurram Zaki",
    role: "Product Strategy & Commercial Lead, Business Applications, Dynamics 365 and AI-driven ERP — CEMA",
    org: "Microsoft",
    ms: true,
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Khurram+Zaki.jpg",
    linkedin: "https://www.linkedin.com/in/khurramzaki/",
  },
  {
    name: "Pawan Poojari",
    role: "Senior Manager, Digital Transformation",
    org: "Intwo",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/pawan.jpg",
    linkedin: "https://www.linkedin.com/in/pawanpoojari/",
  },
  {
    name: "Harris Muhammed",
    role: "Project Manager CRM",
    org: "Intwo",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Harris.png",
    linkedin: "https://www.linkedin.com/in/harris-muhammed-76b49214/",
  },
  {
    name: "Ritesh Kumar Singh",
    role: "Senior Pre-Sales Manager",
    org: "Intwo",
  },
  {
    name: "Oommen P Oommen",
    role: "AVP Digital Transformation MEIA",
    org: "Intwo",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Oommen+P+Oommen.jpg",
    linkedin: "https://www.linkedin.com/in/oommen-p-oommen-46921244/",
  },
];

const FACTS = [
  { n: "350+", l: "experts" },
  { n: "9", l: "offices worldwide" },
  { n: "400+", l: "clients" },
  { n: "40+", l: "countries" },
];

// ─── Small pieces ────────────────────────────────────────────────────────────

/* One observer for every reveal on the page, rather than one per element.
   The page has ~20 of them, and 20 IntersectionObservers all watching the same
   root is 20 lots of bookkeeping the browser does on each scroll. Created
   lazily so it never runs during server render. */
const revealCallbacks = new WeakMap<Element, () => void>();
let revealObserver: IntersectionObserver | null = null;

function watchReveal(el: Element, onSeen: () => void) {
  revealObserver ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        revealObserver?.unobserve(e.target);
        revealCallbacks.get(e.target)?.();
        revealCallbacks.delete(e.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
  );
  revealCallbacks.set(el, onSeen);
  revealObserver.observe(el);
  return () => {
    revealObserver?.unobserve(el);
    revealCallbacks.delete(el);
  };
}

/** Quiet scroll reveal: opacity + a short rise, once, and nothing if the
 *  visitor prefers reduced motion. */
function Reveal({ children, delay = 0, as = "div" }: { children: React.ReactNode; delay?: number; as?: "div" | "li" }) {
  const ref = useRef<HTMLDivElement | HTMLLIElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setSeen(true); return; }
    return watchReveal(el, () => setSeen(true));
  }, []);
  const style: React.CSSProperties = {
    opacity: seen ? 1 : 0,
    transform: seen ? "none" : "translateY(18px)",
    transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  };
  if (as === "li") return <li ref={ref as React.RefObject<HTMLLIElement>} style={style}>{children}</li>;
  return <div ref={ref as React.RefObject<HTMLDivElement>} style={style}>{children}</div>;
}

/** Section head: the Intwo panel reduced to a vertical peach→blue rail. */
function SectionHead({ label, title, lead, light = false, id }: { label: string; title: React.ReactNode; lead?: React.ReactNode; light?: boolean; id?: string }) {
  return (
    <div id={id} style={{ display: "flex", gap: "clamp(16px,2vw,28px)", alignItems: "stretch", marginBottom: SECTION_GAP }}>
      <span aria-hidden style={{ flex: "0 0 auto", width: 6, borderRadius: 3, background: `linear-gradient(180deg, ${PEACH} 0%, ${BLUE} 100%)`, opacity: light ? 0.95 : 1 }} />
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: light ? SKY : BLUE }}>{label}</p>
        <h2 style={{ margin: "14px 0 0", fontWeight: 300, fontSize: "clamp(30px,4.2vw,58px)", lineHeight: 1.06, letterSpacing: "-0.03em", color: light ? WHITE : INK, textWrap: "balance", maxWidth: 900 }}>{title}</h2>
        {lead && (
          <p style={{ margin: "20px 0 0", fontSize: "clamp(16px,1.25vw,18px)", lineHeight: 1.7, color: light ? "rgba(255,255,255,0.74)" : INK_80, maxWidth: "64ch" }}>{lead}</p>
        )}
      </div>
    </div>
  );
}

/** The agent: lines converge from the left, one warm node, lines leave right.
 *  The halo and ring loop forever, so they stand down while the node is off
 *  screen — otherwise they repaint a 920px area for the whole of the page. */
function AgentNode({ size = 420 }: { size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setLive(es.some((e) => e.isIntersecting)), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg ref={ref} className={live ? undefined : "iw-node-idle"} viewBox="0 0 420 300" width={size} height={(size * 300) / 420} aria-hidden fill="none">
      <defs>
        <radialGradient id="iw-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={PEACH} stopOpacity="0.95" />
          <stop offset="45%" stopColor={PEACH} stopOpacity="0.28" />
          <stop offset="100%" stopColor={PEACH} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="iw-in" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={SKY} stopOpacity="0.05" />
          <stop offset="100%" stopColor={SKY} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="iw-out" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={PEACH} stopOpacity="0.9" />
          <stop offset="100%" stopColor={PEACH} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* signals arriving — the data the system already holds */}
      {[40, 84, 128, 172, 216, 260].map((y, i) => (
        <path
          key={`in-${y}`}
          className="iw-line"
          style={{ animationDelay: `${i * 90}ms` }}
          d={`M0 ${y} C 70 ${y}, 120 150, 200 150`}
          stroke="url(#iw-in)"
          strokeWidth="1.5"
        />
      ))}
      {/* the agent acting — lines that leave */}
      {[110, 150, 190].map((y, i) => (
        <path
          key={`out-${y}`}
          className="iw-line"
          style={{ animationDelay: `${700 + i * 120}ms` }}
          d={`M220 150 C 300 150, 330 ${y}, 420 ${y}`}
          stroke="url(#iw-out)"
          strokeWidth="1.5"
        />
      ))}
      <circle cx="210" cy="150" r="78" fill="url(#iw-glow)" className="iw-halo" />
      <circle cx="210" cy="150" r="9" fill={PEACH} className="iw-core" />
      <circle cx="210" cy="150" r="17" stroke={PEACH} strokeOpacity="0.55" strokeWidth="1" className="iw-ring" />
    </svg>
  );
}

function PillLink({ href, children, tone = "ink" }: { href: string; children: React.ReactNode; tone?: "ink" | "ghost" | "light" }) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 28px", borderRadius: 80,
    fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", textDecoration: "none",
    transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, background 0.3s ease, color 0.3s ease",
  };
  const tones: Record<string, React.CSSProperties> = {
    ink: { background: INK, color: WHITE, boxShadow: "0 14px 34px rgba(0,42,59,0.24)" },
    ghost: { background: "transparent", color: INK, border: `1px solid ${LINE}` },
    light: { background: WHITE, color: INK, boxShadow: "0 14px 34px rgba(0,0,0,0.26)" },
  };
  return (
    <a href={href} className="iw-pill" style={{ ...base, ...tones[tone] }}>
      {children}
    </a>
  );
}

/** The floating nav. It owns the `scrolled` state itself: when the page owned
 *  it, crossing 24px re-rendered every section, every reveal and the whole
 *  stylesheet. Now only this bar re-renders. */
function IntwoNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let last = false;
    const onScroll = () => {
      const now = window.scrollY > 24;
      if (now !== last) { last = now; setScrolled(now); }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 60, padding: "clamp(12px,1.6vw,20px) clamp(14px,3vw,34px)" }}>
      <nav
        style={{
          maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", gap: 18,
          padding: "10px 10px 10px 18px", borderRadius: 80,
          background: scrolled ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.62)",
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
          border: `1px solid ${scrolled ? LINE : "rgba(255,255,255,0.7)"}`,
          boxShadow: scrolled ? "0 18px 44px rgba(0,42,59,0.12)" : "0 10px 30px rgba(0,42,59,0.06)",
          transition: "background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* White-only wordmark sits on the brand panel, per the logo rules */}
        <a href="#top" aria-label="Intwo" style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
          <span style={{ display: "inline-flex", alignItems: "center", padding: "9px 16px", borderRadius: 40, background: INK }}>
            {/* SVG wordmark: next/image can't optimise SVG, so it stays a plain img. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="Intwo" width={72} height={19} style={{ height: 19, width: "auto", display: "block" }} />
          </span>
        </a>

        <ul className="iw-nav-links" style={{ display: "flex", gap: "clamp(14px,1.6vw,26px)", listStyle: "none", margin: 0, padding: 0, flex: 1, justifyContent: "center" }}>
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="iw-nav-link" style={{ fontSize: 14, fontWeight: 500, color: INK_80, textDecoration: "none", whiteSpace: "nowrap" }}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#rsvp"
          className="iw-pill"
          style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 80, background: INK, color: WHITE, fontSize: 14, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
        >
          Request a seat
        </a>
      </nav>
    </header>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function IntwoPage() {
  // Deep links (/intwo#rsvp) have to wait for hydration, and Lenis owns the
  // scroll, so a native hash jump gets overridden.
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    let tries = 0;
    let timer = 0;
    const go = () => {
      const el = document.getElementById(id);
      if (!el) { if (tries++ < 20) timer = window.setTimeout(go, 150); return; }
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement | number, o?: { offset?: number; duration?: number }) => void } }).__lenis;
      if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.0 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    timer = window.setTimeout(go, 450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main style={{ fontFamily: FONT, background: WHITE, color: INK, overflowX: "hidden" }}>
      <IntwoNav />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      {/* hero-no-pad-override opts out of the site-wide mobile section padding in
          globals.css, so the hero's own one-screen sizing is what applies. */}
      <section id="top" className="hero-no-pad-override" style={{ position: "relative", minHeight: "min(100svh, 940px)", display: "flex", alignItems: "center", background: ICE, overflow: "hidden" }}>
        {/* The LCP image. object-fit/position live in the stylesheet, not inline,
            so the portrait crop in the media query can actually win. */}
        <Image src={HERO} alt="" aria-hidden fill priority sizes="100vw" className="iw-hero-img" />
        {/* legibility scrim, left-weighted so the glass panels stay visible */}
        <div aria-hidden className="iw-hero-scrim" style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, #fff 0%, rgba(255,255,255,0.95) 34%, rgba(255,255,255,0.62) 52%, rgba(255,255,255,0.05) 74%, rgba(255,255,255,0) 100%)" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 72%, ${ICE} 100%)` }} />

        {/* Every vertical step below is min(vw, vh) so the hero fits one screen
            on a short laptop as well as a tall monitor — no scroll to finish it. */}
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1320, margin: "0 auto", padding: "clamp(86px,12vh,180px) clamp(20px,4vw,44px) clamp(26px,7vh,100px)" }}>
          <div style={{ maxWidth: 780 }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: "clamp(14px,2.6vh,32px)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 15px 8px 12px", borderRadius: 80, background: "rgba(255,255,255,0.8)", border: `1px solid ${LINE}`, fontSize: 12.5, fontWeight: 600, letterSpacing: "0.02em", color: INK }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: PEACH, boxShadow: `0 0 0 4px ${PEACH}22` }} />
                  By invitation
                </span>
                <span className="iw-hero-date" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: INK_62 }}>
                  {EVENT.city} · {EVENT.date}
                </span>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <h1 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(34px,min(7.4vw,9.4vh),104px)", lineHeight: 0.95, letterSpacing: "-0.045em", color: INK, textWrap: "balance" }}>
                AI Agents<br />in Action
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p style={{ margin: "clamp(14px,2.7vh,38px) 0 0", fontSize: "clamp(17px,min(2.5vw,3vh),34px)", lineHeight: 1.25, letterSpacing: "-0.02em", fontWeight: 300, color: INK_45 }}>
                {EVENT.strapA}{" "}
                <span style={{ display: "inline-block", position: "relative", fontWeight: 500, color: INK }}>
                  {EVENT.strapB}
                  <span aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: "-0.14em", height: 2, background: PEACH, borderRadius: 2 }} />
                </span>
              </p>
            </Reveal>

            <Reveal delay={260}>
              <p className="iw-hero-lead" style={{ margin: "clamp(13px,2.3vh,30px) 0 0", maxWidth: "56ch", fontSize: "clamp(14.5px,min(1.25vw,1.95vh),18px)", lineHeight: 1.65, color: INK_80 }}>
                A half-day working session for Dynamics 365 customers. Live agents running inside the
                system — then Intwo customizes one live, to a real request from the room
                <span className="iw-hero-tail">, while you interact with the result yourself</span>.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "clamp(17px,3vh,42px) 0 0" }}>
                <PillLink href="#rsvp">
                  Request a seat
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </PillLink>
                <PillLink href="#agenda" tone="ghost">See the five acts</PillLink>
              </div>
            </Reveal>

            <Reveal delay={420}>
              <dl className="iw-hero-meta" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px,2.4vh,44px) clamp(20px,3vw,44px)", margin: "clamp(16px,3.4vh,54px) 0 0", paddingTop: "clamp(13px,2.2vh,28px)", borderTop: `1px solid ${LINE}` }}>
                {[
                  { k: "Time", v: EVENT.time },
                  { k: "Format", v: "Five acts · working lunch" },
                  { k: "Room", v: EVENT.seats },
                  { k: "Venue", v: EVENT.venue },
                ].map((m) => (
                  <div key={m.k}>
                    <dt style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: INK_45, margin: 0 }}>{m.k}</dt>
                    <dd style={{ margin: "7px 0 0", fontSize: 15.5, fontWeight: 500, color: INK, fontVariantNumeric: "tabular-nums" }}>{m.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── THE PREMISE ─────────────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: SECTION_PAD }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="iw-premise" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)", gap: "clamp(34px,5vw,80px)", alignItems: "start" }}>
            <div>
              <Reveal>
                <SectionHead
                  id="overview"
                  label="The premise"
                  title={<>Everyone&apos;s talking about agents.<br />Almost nobody has used one.</>}
                />
              </Reveal>
              <Reveal delay={80}>
                <p style={{ margin: 0, fontSize: "clamp(16px,1.25vw,18px)", lineHeight: 1.75, color: INK_80, maxWidth: "62ch" }}>
                  Every vendor in the market is running an AI event this quarter. Almost nobody in the
                  room has seen an AI agent built or customized in front of them. This session closes
                  that gap. You spend three hours with agents running live inside Dynamics 365, working
                  on processes you recognise from your own business, and then watch Intwo&apos;s team
                  customize one to a real request from the room, live.
                </p>
              </Reveal>
              <Reveal delay={140}>
                <p style={{ margin: "22px 0 0", fontSize: "clamp(16px,1.25vw,18px)", lineHeight: 1.75, color: INK_80, maxWidth: "62ch" }}>
                  The session opens on a problem rather than on Intwo: the ERP holds the data, the
                  signals were there for months, and nothing happened. It closes with each guest naming
                  the one process in their own business they would hand to an agent tomorrow.
                </p>
              </Reveal>
            </div>

            <Reveal delay={120}>
              {/* Square, as the Intwo book prefers, with their colour panel run up
                  from the base to carry the line in white. */}
              <figure
                style={{ position: "relative", margin: 0, aspectRatio: "1 / 1", borderRadius: CORNER, overflow: "hidden", background: ICE, border: `1px solid ${LINE_SOFT}` }}
              >
                <Image
                  src={PREMISE_IMG}
                  alt="Two colleagues leaning in over a laptop in an open-plan office"
                  fill
                  sizes="(max-width: 1080px) 100vw, 530px"
                  style={{ objectFit: "cover", filter: "saturate(0.94) contrast(0.97)" }}
                />
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,42,59,0) 40%, rgba(0,42,59,0.55) 66%, rgba(0,42,59,0.93) 100%)" }} />
                <figcaption style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "clamp(24px,2.6vw,36px)" }}>
                  <span aria-hidden style={{ display: "block", width: 34, height: 2, borderRadius: 2, background: PEACH, marginBottom: 16 }} />
                  <blockquote style={{ margin: 0, fontSize: "clamp(19px,1.75vw,26px)", fontWeight: 300, lineHeight: 1.32, letterSpacing: "-0.02em", color: WHITE }}>
                    Your system has been telling you for months. Nobody was listening.
                  </blockquote>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* the four questions */}
          <ul className="iw-questions" style={{ listStyle: "none", margin: `${BLOCK_GAP} 0 0`, padding: 0, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "clamp(16px,2vw,28px)" }}>
            {QUESTIONS.map((q, i) => (
              <Reveal as="li" key={q} delay={i * 70}>
                <div style={{ height: "100%", padding: "clamp(24px,2.6vw,34px)", borderRadius: CORNER, background: WHITE, border: `1px solid ${LINE}`, transition: "box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)" }} className="iw-qcard">
                  <span aria-hidden style={{ display: "block", width: 34, height: 2, borderRadius: 2, background: PEACH, marginBottom: 20 }} />
                  <p style={{ margin: 0, fontSize: "clamp(16px,1.35vw,19px)", lineHeight: 1.55, fontWeight: 400, color: INK, letterSpacing: "-0.015em" }}>{q}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── NO PITCH ────────────────────────────────────────────────────── */}
      <section style={{ background: ICE, padding: SECTION_PAD }}>
        {/* Copy stays on a readable measure; the cards run the full page width so
            the three points sit on fewer lines and the band stays shallow. */}
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ maxWidth: 940, margin: "0 auto", textAlign: "center" }}>
            <Reveal>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE }}>Why attend</p>
            <h2 style={{ margin: "18px 0 0", fontWeight: 300, fontSize: "clamp(30px,4.4vw,60px)", lineHeight: 1.08, letterSpacing: "-0.035em", color: INK, textWrap: "balance" }}>
              No product pitch. No portfolio slide.<br />No pricing on stage.
            </h2>
            <p style={{ margin: "clamp(24px,3vw,32px) auto 0", maxWidth: "62ch", fontSize: "clamp(16px,1.25vw,18px)", lineHeight: 1.75, color: INK_80 }}>
              Live agents demonstrated start to finish on content reskinned to the companies in the
              room, a joint Intwo and Microsoft view of where the platform is heading, and a live
              segment in which Intwo customizes a working agent to a real request from the room while
              you interact with the result. You leave with a clear view of what agents can do on the
              platform you already run, a sense of how quickly Intwo can build for you, and a named
              process to take forward.
            </p>
            </Reveal>
          </div>

          <div className="iw-takeaways" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "clamp(16px,1.8vw,24px)", margin: `${SECTION_GAP} 0 0`, textAlign: "left" }}>
            {TAKEAWAYS.map((t, i) => (
              <Reveal key={t.t} delay={i * 90}>
                <div style={{ height: "100%", padding: "clamp(24px,2.4vw,30px) clamp(24px,2.6vw,34px)", borderRadius: CORNER, background: WHITE, border: `1px solid ${LINE_SOFT}`, boxShadow: "0 18px 40px rgba(0,42,59,0.05)" }}>
                  <h3 style={{ margin: 0, fontSize: "clamp(17px,1.4vw,20px)", fontWeight: 600, letterSpacing: "-0.02em", color: INK, lineHeight: 1.25 }}>{t.t}</h3>
                  <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.65, color: INK_62 }}>{t.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENDA ──────────────────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: SECTION_PAD }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <Reveal>
            <SectionHead
              id="agenda"
              label="The five acts"
              title={<>Wake up, where this is going,<br />see it, built for you live, act.</>}
              lead={<>{EVENT.time} · {EVENT.date}. Three and a half hours door to door, three hours of programme, with the working lunch served at the table from Act 3. Intwo&apos;s own introduction sits at the end, not the start.</>}
            />
          </Reveal>

          <ActsRail />
          <DayStrip />
        </div>
      </section>

      {/* ── THE DARK ACT: AGENTS IN ACTION ──────────────────────────────── */}
      <section id="live" style={{ position: "relative", background: INK, color: WHITE, padding: SECTION_PAD, overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-6%", width: "min(920px, 78vw)", opacity: 0.75, pointerEvents: "none" }}>
          <AgentNode size={920} />
        </div>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 78% 30%, rgba(255,140,89,0.16) 0%, rgba(0,42,59,0) 55%)`, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <SectionHead
              light
              label="Act 4 · 13:00"
              title={<>Tell us what you need.<br />Watch us build it, live.</>}
              lead="A real requirement is taken from the room, in your own words. Intwo's team customizes a working agent to it in front of everyone — then you use the result yourself, from your own phone."
            />
          </Reveal>

          <ExperienceTabs />

          <Reveal delay={120}>
            <p style={{ margin: `${SECTION_GAP} 0 0`, fontSize: "clamp(19px,1.8vw,26px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.4, color: SKY, maxWidth: "34ch" }}>
              Three hours. Real agents. Yours to try.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SPEAKERS ────────────────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: SECTION_PAD }}>
        {/* Narrower than the other bands on purpose: six speakers then fall into
            two balanced rows of three, and the cards stay small. */}
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <Reveal>
            <SectionHead id="speakers" label="On the floor" title={<>Two on stage at a time,<br />six in the room all day.</>} />
          </Reveal>

          <Reveal delay={60}>
            <div style={{ display: "flex", gap: "clamp(16px,2vw,26px)", alignItems: "flex-start", padding: "clamp(22px,2.6vw,30px)", borderRadius: CORNER, background: ICE, border: `1px solid ${LINE_SOFT}`, marginBottom: SECTION_GAP }}>
              <span aria-hidden style={{ flex: "0 0 auto", width: 4, alignSelf: "stretch", borderRadius: 2, background: PEACH }} />
              <p style={{ margin: 0, fontSize: "clamp(16px,1.3vw,19px)", lineHeight: 1.6, color: INK, letterSpacing: "-0.01em" }}>
                Due to our longstanding partnership with Microsoft and our status as an accredited
                Microsoft Solutions Partner, we are honoured to welcome{" "}
                <strong style={{ fontWeight: 600 }}>Khurram Zaki</strong> to speak on the future of
                Dynamics 365 and agents.
              </p>
            </div>
          </Reveal>

          <div className="iw-speakers" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "clamp(14px,1.5vw,20px)" }}>
            {SPEAKERS.map((s, i) => {
              const initials = s.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
              return (
                <Reveal key={s.name} delay={(i % 3) * 70}>
                  <article className="iw-spk">
                    <div className={`iw-spk-frame${s.ms ? " iw-spk-frame-ms" : ""}`}>
                      {s.photo ? (
                        <Image src={s.photo} alt={s.name} fill sizes="(max-width: 860px) 50vw, 340px" className="iw-spk-photo" />
                      ) : (
                        <span className="iw-spk-initials" aria-hidden>{initials}</span>
                      )}
                      {s.ms && <span className="iw-spk-chip">Microsoft</span>}
                      {s.linkedin && (
                        <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className="iw-spk-li" aria-label={`${s.name} on LinkedIn`}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H9z" /></svg>
                        </a>
                      )}
                    </div>
                    <div className="iw-spk-meta">
                      <h3>{s.name}</h3>
                      <p className="iw-spk-role">{s.role}</p>
                      <p className="iw-spk-org" style={{ color: s.ms ? BLUE : INK }}>{s.org}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHO'S IN THE ROOM + RSVP ────────────────────────────────────── */}
      <section style={{ background: ICE, padding: SECTION_PAD }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="iw-rsvp" style={{ display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)", gap: "clamp(34px,4.5vw,72px)", alignItems: "start" }}>
            <div>
              <Reveal>
                <SectionHead id="rsvp" label="Who's in the room" title={<>Twenty-five seats,<br />by invitation.</>} />
              </Reveal>
              <Reveal delay={70}>
                <p style={{ margin: 0, fontSize: "clamp(16px,1.25vw,18px)", lineHeight: 1.75, color: INK_80, maxWidth: "48ch" }}>
                  CIOs, CFOs, Heads of IT, Finance Directors and COOs from organisations running
                  Dynamics 365 Finance &amp; Operations or Customer Engagement. All industries —
                  finance, procure-to-pay and supply chain processes are common enough to carry a
                  mixed room.
                </p>
              </Reveal>
              <Reveal delay={130}>
                <ul style={{ listStyle: "none", margin: `${SECTION_GAP} 0 0`, padding: 0, display: "grid", gap: 14 }}>
                  {[
                    ["Date", EVENT.date],
                    ["Time", `${EVENT.time} · networking from 14:15`],
                    ["Place", `${EVENT.city} · ${EVENT.venue}`],
                    ["Room", `${EVENT.seats} · invitation and RSVP only`],
                  ].map(([k, v]) => (
                    <li key={k} style={{ display: "flex", gap: 16, paddingBottom: 14, borderBottom: `1px solid ${LINE_SOFT}` }}>
                      <span style={{ flex: "0 0 86px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: INK_45, paddingTop: 3 }}>{k}</span>
                      <span style={{ fontSize: 15.5, fontWeight: 500, color: INK, fontVariantNumeric: "tabular-nums" }}>{v}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={180}>
                <p style={{ margin: "clamp(26px,3vw,34px) 0 0", fontSize: 14.5, lineHeight: 1.7, color: INK_45, maxWidth: "46ch" }}>
                  The questions in this form tailor the session to your environment — your answers set
                  the mix of agents demonstrated on the day.
                </p>
              </Reveal>
            </div>

            <Reveal delay={90}>
              <RsvpForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── ABOUT INTWO ─────────────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: SECTION_PAD }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="iw-about" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px,5vw,80px)", alignItems: "center" }}>
            <Reveal>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE }}>The convener</p>
                <p style={{ margin: "22px 0 0", fontSize: "clamp(17px,1.4vw,20px)", lineHeight: 1.7, color: INK_80 }}>
                  Intwo is a Microsoft Solutions Partner and Inner Circle for Microsoft Dynamics member,
                  working with midmarket organisations across the GCC, MEA and Europe on cloud, data, AI
                  and Dynamics 365 solutions. Intwo helps businesses modernise operations and turn
                  digital investment into measurable business advantage.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 26 }}>
                  {["Microsoft Solutions Partner", "Inner Circle for Microsoft Dynamics"].map((c) => (
                    <span key={c} style={{ padding: "9px 16px", borderRadius: 80, background: ICE, border: `1px solid ${LINE}`, fontSize: 13, fontWeight: 600, color: INK }}>{c}</span>
                  ))}
                </div>
                <a href="https://www.intwo.cloud" target="_blank" rel="noopener noreferrer" className="iw-link" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 26, fontSize: 15, fontWeight: 600, color: BLUE, textDecoration: "none" }}>
                  intwo.cloud
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
                </a>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <dl className="iw-facts" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "clamp(14px,1.8vw,22px)", margin: 0 }}>
                {FACTS.map((f) => (
                  <div key={f.l} style={{ padding: "clamp(24px,2.6vw,32px)", borderRadius: CORNER, background: ICE, border: `1px solid ${LINE_SOFT}` }}>
                    <dt style={{ fontSize: "clamp(30px,3.4vw,44px)", fontWeight: 300, letterSpacing: "-0.04em", color: INK, fontVariantNumeric: "tabular-nums" }}>{f.n}</dt>
                    <dd style={{ margin: "8px 0 0", fontSize: 13.5, fontWeight: 500, letterSpacing: "0.02em", color: INK_62 }}>{f.l}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: INK, color: "rgba(255,255,255,0.72)", padding: `clamp(34px,4vw,54px) ${SECTION_X}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="iw-foot" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="Intwo" width={106} height={28} style={{ height: 28, width: "auto", display: "block" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                Hosted by
              </span>
              <Image src="/Events-First-logo-02.png" alt="Events First Group" width={101} height={40} style={{ height: 40, width: "auto", display: "block" }} />
            </div>
          </div>
        </div>
      </footer>

      {/* ── STYLES ──────────────────────────────────────────────────────── */}
      <style jsx global>{`
        .iw-nav-link { position: relative; transition: color 0.3s ease; }
        .iw-nav-link::after {
          content: ""; position: absolute; left: 0; right: 100%; bottom: -6px; height: 1.5px;
          background: ${PEACH}; border-radius: 2px; transition: right 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .iw-nav-link:hover { color: ${INK}; }
        .iw-nav-link:hover::after { right: 0; }

        .iw-pill:hover { transform: translateY(-2px); }
        .iw-pill { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease; }

        .iw-qcard:hover { transform: translateY(-3px); box-shadow: 0 22px 50px rgba(0,42,59,0.10); }

        .iw-link:hover { color: ${INK}; }

        /* hero: kept in the stylesheet rather than inline so the portrait crop
           further down can override it */
        .iw-hero-img { object-fit: cover; object-position: 72% center; }

        /* speakers */
        .iw-spk {
          height: 100%; display: flex; flex-direction: column;
          border-radius: ${CORNER}; overflow: hidden;
          background: ${WHITE}; border: 1px solid ${LINE};
          transition: box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease;
        }
        .iw-spk:hover { transform: translateY(-4px); box-shadow: 0 26px 56px rgba(0,42,59,0.12); }
        .iw-spk-frame {
          position: relative; aspect-ratio: 1; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          background:
            radial-gradient(120% 90% at 30% 15%, rgba(164,215,236,0.35) 0%, rgba(239,245,248,0) 60%),
            linear-gradient(160deg, ${ICE} 0%, #fbfdfe 100%);
          border-bottom: 1px solid ${LINE_SOFT};
        }
        .iw-spk-frame-ms {
          background:
            radial-gradient(120% 90% at 30% 15%, rgba(4,116,162,0.5) 0%, rgba(0,42,59,0) 62%),
            linear-gradient(160deg, ${INK} 0%, #013a52 100%);
        }
        .iw-spk-photo {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center 18%;
          transition: transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .iw-spk:hover .iw-spk-photo { transform: scale(1.05); }
        .iw-spk-initials {
          font-size: clamp(34px, 3.2vw, 46px); font-weight: 200; letter-spacing: -0.04em;
          color: rgba(4,116,162,0.42); user-select: none;
        }
        .iw-spk-frame-ms .iw-spk-initials { color: rgba(255,255,255,0.72); }
        .iw-spk-chip {
          position: absolute; top: 14px; left: 14px;
          padding: 6px 12px; border-radius: 80px;
          background: rgba(255,255,255,0.92); border: 1px solid ${LINE};
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${BLUE};
        }
        /* always visible, so the profile link is discoverable without hovering */
        .iw-spk-li {
          position: absolute; right: 12px; bottom: 12px;
          width: 32px; height: 32px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.94); color: ${INK};
          border: 1px solid rgba(0,42,59,0.08);
          box-shadow: 0 4px 14px rgba(0,42,59,0.2);
          transition: background 0.3s ease, color 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .iw-spk-li:hover { background: ${INK}; color: ${WHITE}; transform: translateY(-2px); }
        .iw-spk-meta { padding: clamp(15px, 1.4vw, 19px); display: flex; flex-direction: column; gap: 5px; }
        .iw-spk-meta h3 {
          margin: 0; font-size: clamp(15.5px, 1.15vw, 17px); font-weight: 600;
          letter-spacing: -0.02em; color: ${INK}; line-height: 1.25;
        }
        .iw-spk-role { margin: 1px 0 0; font-size: 12.5px; line-height: 1.45; color: ${INK_62}; }
        .iw-spk-org { margin: 0; font-size: 12.5px; font-weight: 600; }

        /* act 4: cards that open */
        .iw-cardtabs {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(10px, 1.2vw, 16px);
        }
        .iw-cardtab {
          position: relative; display: flex; flex-direction: column; align-items: flex-start;
          gap: 10px; text-align: left; cursor: pointer; font-family: inherit;
          padding: clamp(18px, 1.8vw, 24px);
          border-radius: ${CORNER};
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.72);
          transition: background 0.35s ease, border-color 0.35s ease, color 0.35s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .iw-cardtab:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.28); color: ${WHITE}; }
        .iw-cardtab-title {
          font-size: clamp(15px, 1.25vw, 17px); font-weight: 600; letter-spacing: -0.015em; line-height: 1.3;
          padding-right: 34px; /* clears the plus in the corner */
        }
        .iw-cardtab-icon {
          position: absolute; top: clamp(16px, 1.7vw, 22px); right: clamp(16px, 1.7vw, 22px);
          width: 26px; height: 26px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.22); color: rgba(255,255,255,0.7);
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
        }
        .iw-cardtab-hint {
          font-size: 11.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.42); transition: color 0.35s ease;
        }
        .iw-cardtab-on {
          background: linear-gradient(180deg, rgba(255,140,89,0.16) 0%, rgba(255,140,89,0.04) 100%);
          border-color: rgba(255,140,89,0.55);
          color: ${WHITE};
        }
        .iw-cardtab-on .iw-cardtab-icon {
          transform: rotate(45deg);
          background: ${PEACH}; border-color: ${PEACH}; color: ${INK};
        }
        .iw-cardtab-on .iw-cardtab-hint { color: ${PEACH}; }

        .iw-panel {
          display: flex; gap: clamp(16px, 1.8vw, 24px);
          margin-top: clamp(14px, 1.6vw, 20px);
          padding: clamp(24px, 2.6vw, 34px);
          border-radius: ${CORNER};
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          min-height: 150px;
          animation: iw-panel-in 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        .iw-panel-rail {
          flex: 0 0 auto; width: 4px; align-self: stretch; border-radius: 2px;
          background: linear-gradient(180deg, ${PEACH} 0%, rgba(255,140,89,0.2) 100%);
        }
        @keyframes iw-panel-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

        /* acts rail */
        .iw-rail {
          display: flex;
          gap: clamp(14px, 1.6vw, 20px);
          overflow-x: auto;
          overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 0 8px;
          cursor: grab;
        }
        .iw-rail::-webkit-scrollbar { display: none; }
        .iw-rail-dragging { cursor: grabbing; scroll-snap-type: none; scroll-behavior: auto; }
        .iw-rail-card {
          flex: 0 0 clamp(268px, 30vw, 380px);
          scroll-snap-align: start;
          display: flex;
        }
        .iw-card-inner {
          display: flex; flex-direction: column; width: 100%;
          padding: clamp(24px, 2.4vw, 32px);
          border-radius: ${CORNER};
          background: ${WHITE};
          border: 1px solid ${LINE};
          transition: box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease;
        }
        .iw-rail:not(.iw-rail-dragging) .iw-rail-card:hover .iw-card-inner {
          transform: translateY(-3px);
          box-shadow: 0 22px 50px rgba(0,42,59,0.10);
        }
        .iw-card-hero {
          border-color: rgba(255,140,89,0.45);
          background: linear-gradient(180deg, rgba(255,140,89,0.07) 0%, rgba(255,255,255,0) 58%), ${WHITE};
        }
        .iw-rail-btn {
          width: 42px; height: 42px; border-radius: 50%; border: 1px solid ${LINE};
          background: ${WHITE}; color: ${INK}; display: inline-flex; align-items: center;
          justify-content: center; cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
        }
        .iw-rail-btn:hover:not(:disabled) { background: ${INK}; color: ${WHITE}; border-color: ${INK}; }
        .iw-rail-btn:disabled { opacity: 0.32; cursor: default; }

        /* the shape of the day */
        .iw-day {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: clamp(10px, 1.4vw, 18px);
          margin-top: clamp(26px, 3vw, 40px);
          padding-top: clamp(18px, 2vw, 26px);
          border-top: 1px solid ${LINE_SOFT};
        }
        .iw-day-item { display: flex; flex-direction: column; gap: 6px; }
        .iw-day-item::before {
          content: ""; width: 7px; height: 7px; border-radius: 50%;
          background: ${WHITE}; border: 1.5px solid rgba(0,42,59,0.28); margin-bottom: 4px;
        }

        /* the agent node: signals arrive, the node lights, lines leave */
        .iw-line { stroke-dasharray: 340; stroke-dashoffset: 340; animation: iw-draw 2.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .iw-halo { transform-origin: 210px 150px; animation: iw-breathe 5.5s ease-in-out infinite; }
        .iw-core { animation: iw-ignite 2.4s ease-out forwards; }
        .iw-ring { transform-origin: 210px 150px; animation: iw-ring 5.5s ease-out infinite; }
        @keyframes iw-draw { to { stroke-dashoffset: 0; } }
        @keyframes iw-breathe { 0%,100% { opacity: 0.75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
        @keyframes iw-ignite { 0% { opacity: 0; r: 2; } 60% { opacity: 1; } 100% { opacity: 1; r: 9; } }
        @keyframes iw-ring { 0% { opacity: 0.6; transform: scale(0.7); } 70%,100% { opacity: 0; transform: scale(1.9); } }
        /* nothing to look at off screen — stop repainting it */
        .iw-node-idle .iw-halo, .iw-node-idle .iw-ring { animation-play-state: paused; }

        /* form */
        .iw-form label {
          display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: ${INK_45}; margin-bottom: 9px;
        }
        .iw-form input, .iw-form select, .iw-form textarea {
          width: 100%; padding: 14px 16px; border-radius: 14px; background: ${WHITE};
          border: 1px solid ${LINE}; font-family: inherit; font-size: 15px; color: ${INK};
          outline: none; transition: border-color 0.25s ease, box-shadow 0.25s ease;
          -webkit-appearance: none; appearance: none;
        }
        .iw-form textarea { min-height: 92px; resize: vertical; line-height: 1.6; }
        .iw-form select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5l5-5' stroke='%23002A3B' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px;
        }
        .iw-form input:focus, .iw-form select:focus, .iw-form textarea:focus {
          border-color: ${BLUE}; box-shadow: 0 0 0 4px rgba(4,116,162,0.12);
        }
        .iw-form input::placeholder, .iw-form textarea::placeholder { color: rgba(0,42,59,0.32); }
        /* chips are <label>s too, so they have to opt out of the field-label style */
        .iw-form label.iw-chip {
          text-transform: none; letter-spacing: -0.005em; font-size: 13.5px;
          font-weight: 500; color: ${INK}; margin-bottom: 0;
        }
        .iw-form label.iw-chip-on { color: ${WHITE}; }
        .iw-chip {
          display: inline-flex; align-items: center; gap: 8px; padding: 10px 15px; border-radius: 80px;
          border: 1px solid ${LINE}; background: ${WHITE}; font-size: 13.5px; font-weight: 500;
          color: ${INK}; cursor: pointer; user-select: none;
          transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .iw-chip:hover { border-color: rgba(0,42,59,0.28); }
        .iw-chip input { position: absolute; opacity: 0; width: 0; height: 0; }
        .iw-chip-on { background: ${INK}; border-color: ${INK}; color: ${WHITE}; }

        a:focus-visible, button:focus-visible, .iw-chip:focus-within {
          outline: 2px solid ${BLUE}; outline-offset: 3px;
        }

        /* responsive */
        @media (max-width: 1080px) {
          /* the nav list carries an inline display, so the override has to win */
          .iw-nav-links { display: none !important; }
          .iw-premise, .iw-rsvp, .iw-about { grid-template-columns: minmax(0,1fr) !important; }
          .iw-speakers { grid-template-columns: repeat(3, minmax(0,1fr)) !important; }
          .iw-takeaways { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .iw-day { grid-template-columns: repeat(3, minmax(0,1fr)); }
          .iw-cardtabs { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }
        @media (max-width: 860px) {
          .iw-hero-img { object-position: 70% 46%; }
          /* Portrait: the copy runs the full width, so the scrim holds the top of
             the frame and opens up underneath, where the glass and the node sit. */
          .iw-hero-scrim {
            background: linear-gradient(178deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.93) 46%, rgba(255,255,255,0.78) 68%, rgba(255,255,255,0.46) 86%, rgba(255,255,255,0.2) 100%) !important;
          }
          /* Phones: the hero still has to end at the fold, so the meta strip goes
             two-up and drops the two facts that repeat in "Who's in the room". */
          .iw-hero-meta {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 12px 20px !important;
          }
          .iw-hero-meta > div:nth-child(2), .iw-hero-meta > div:nth-child(4) { display: none; }
          .iw-hero-tail { display: none; }
          .iw-hero-date { font-size: 11.5px !important; letter-spacing: 0.1em !important; }
          .iw-questions, .iw-takeaways, .iw-facts { grid-template-columns: minmax(0,1fr) !important; }
          /* headshots stay two-up on phones: one per row makes the section endless */
          .iw-speakers { grid-template-columns: repeat(2, minmax(0,1fr)) !important; gap: 12px !important; }
          .iw-spk-meta { padding: 14px 14px 16px; }
          .iw-spk-meta h3 { font-size: 15px; }
          .iw-spk-role, .iw-spk-org { font-size: 12.5px; }
          .iw-spk-chip { top: 10px; left: 10px; padding: 5px 9px; font-size: 9.5px; }
          .iw-day { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .iw-rail-card { flex-basis: min(82vw, 330px); }
          .iw-panel { min-height: 0; }
          .iw-foot { flex-direction: column; align-items: flex-start; gap: 22px; }
        }
        /* Short phones (iPhone SE and similar): drop the lead paragraph so the
           headline, strapline, CTAs and key facts still land on one screen. */
        @media (max-width: 640px) and (max-height: 730px) {
          .iw-hero-lead { display: none; }
        }
        @media (max-width: 560px) {
          .iw-form-row { grid-template-columns: minmax(0,1fr) !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .iw-line, .iw-halo, .iw-core, .iw-ring { animation: none !important; stroke-dashoffset: 0 !important; }
          .iw-pill:hover, .iw-qcard:hover, .iw-spk:hover { transform: none; }
        }
      `}</style>
    </main>
  );
}

// ─── Act 4: the experience, one part at a time ───────────────────────────────

/** The four parts of Agents in Action as clickable cards: each card shows its
 *  title and a plus, and opening one reveals its detail in the panel beneath.
 *  Card semantics, tab behaviour — arrow keys move, Home/End jump to the ends. */
function ExperienceTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = EXPERIENCE.length - 1;
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Reveal delay={60}>
      <div style={{ marginTop: SECTION_GAP }}>
        <div role="tablist" aria-label="What happens in Act 4" className="iw-cardtabs" onKeyDown={onKeyDown}>
          {EXPERIENCE.map((e, i) => (
            <button
              key={e.t}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`iw-tab-${i}`}
              aria-selected={i === active}
              aria-controls="iw-exp-panel"
              tabIndex={i === active ? 0 : -1}
              className={`iw-cardtab${i === active ? " iw-cardtab-on" : ""}`}
            onClick={() => setActive(i)}
            >
              <span className="iw-cardtab-title">{e.t}</span>
              <span className="iw-cardtab-icon" aria-hidden>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
              <span className="iw-cardtab-hint" aria-hidden>{i === active ? "Showing" : "Read more"}</span>
            </button>
          ))}
        </div>

        <div key={active} role="tabpanel" id="iw-exp-panel" aria-labelledby={`iw-tab-${active}`} className="iw-panel">
          <span aria-hidden className="iw-panel-rail" />
          <div>
            <h3 style={{ margin: 0, fontSize: "clamp(17px,1.4vw,20px)", fontWeight: 600, letterSpacing: "-0.02em", color: WHITE }}>
              {EXPERIENCE[active].t}
            </h3>
            <p style={{ margin: "12px 0 0", maxWidth: "62ch", fontSize: "clamp(15.5px,1.35vw,18px)", lineHeight: 1.65, color: "rgba(255,255,255,0.78)" }}>
              {EXPERIENCE[active].d}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ─── The five acts, as a rail ────────────────────────────────────────────────

/** Horizontal, snap-scrolling rail of the five acts.
 *  Touch swipes natively; desktop gets arrows, pointer-drag and the keyboard.
 *  data-lenis-prevent-wheel hands wheel events back to the browser over the
 *  rail, so a trackpad's sideways swipe reaches it instead of Lenis. */
function ActsRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const drag = useRef<{ on: boolean; x: number; left: number }>({ on: false, x: 0, left: 0 });
  const [hold, setHold] = useState(false);   // pointer or keyboard is on the rail
  const [inView, setInView] = useState(false);
  const quietUntil = useRef(0);              // set by any manual move, pauses autoplay
  const frame = useRef(0);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // Rounded to a whole percent: the bar is a few hundred pixels wide, so finer
    // values are invisible and only cost a render. Identical values let React
    // bail out of the re-render entirely.
    setProgress(max > 4 ? Math.round((el.scrollLeft / max) * 100) / 100 : 1);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  /* Scroll fires many times per frame while the rail glides. Coalescing into one
     measurement per frame stops the five cards re-rendering on every event. */
  const onScroll = useCallback(() => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => { frame.current = 0; sync(); });
  }, [sync]);

  useEffect(() => {
    sync();
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [sync, onScroll]);

  // Autoplay only matters while the rail is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => setInView(e.isIntersecting)), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Auto-advance: one card every few seconds, looping back at the end. It stands
     down whenever the reader takes over (hover, focus, drag, swipe, arrows), when
     the tab is hidden, when the rail is off screen, or for reduced motion. */
  useEffect(() => {
    // No timer at all unless the rail is on screen and unattended.
    if (!inView || hold) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const el = ref.current;
      if (!el || document.hidden || Date.now() < quietUntil.current) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 4) return;
      if (el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: "smooth" });
      else step(1);
    }, 4200);
    return () => window.clearInterval(id);
  }, [hold, inView]);

  const step = (dir: 1 | -1, manual = false) => {
    const el = ref.current;
    if (!el) return;
    if (manual) quietUntil.current = Date.now() + 9000;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const by = card ? card.offsetWidth + 18 : Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: dir * by, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    quietUntil.current = Date.now() + 9000;
    if (e.pointerType === "touch") return; // let the browser do touch itself
    const el = ref.current;
    if (!el) return;
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft };
    el.classList.add("iw-rail-dragging");
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !drag.current.on) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !drag.current.on) return;
    drag.current.on = false;
    el.classList.remove("iw-rail-dragging");
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    sync();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2vw,28px)", marginBottom: 18 }}>
        <div aria-hidden style={{ position: "relative", flex: 1, height: 2, borderRadius: 2, background: LINE }}>
          <span
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 2, background: INK,
              width: `${Math.max(12, Math.min(100, progress * 100))}%`,
              transition: "width 0.25s ease",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 10, flex: "0 0 auto" }}>
          <button type="button" className="iw-rail-btn" onClick={() => step(-1, true)} disabled={atStart} aria-label="Previous act">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="iw-rail-btn" onClick={() => step(1, true)} disabled={atEnd} aria-label="Next act">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="iw-rail"
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
        onTouchStart={() => { quietUntil.current = Date.now() + 9000; }}
        data-lenis-prevent-wheel
        tabIndex={0}
        role="group"
        aria-label="The five acts — scroll sideways"
      >
        {ACTS.map((a) => (
          <div className="iw-rail-card" data-card key={a.time + a.title}>
            <article className={`iw-card-inner${a.hero ? " iw-card-hero" : ""}`}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: a.hero ? PEACH : BLUE }}>{a.act}</span>
                <span style={{ fontSize: 12.5, color: INK_45, fontVariantNumeric: "tabular-nums" }}>{a.dur}</span>
              </div>
              <p style={{ margin: "14px 0 0", fontSize: "clamp(22px,2vw,28px)", fontWeight: 300, letterSpacing: "-0.03em", color: INK, fontVariantNumeric: "tabular-nums" }}>{a.time}</p>
              <h3 style={{ margin: "10px 0 0", fontSize: "clamp(17px,1.4vw,20px)", fontWeight: 600, letterSpacing: "-0.02em", color: INK, lineHeight: 1.3 }}>{a.title}</h3>
              <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.65, color: INK_62 }}>{a.body}</p>
              {a.who && (
                <p style={{ margin: "auto 0 0", paddingTop: 18, fontSize: 13, fontWeight: 500, color: INK_45 }}>{a.who}</p>
              )}
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The rest of the day: arrival, lunch, the close, networking. */
function DayStrip() {
  return (
    <Reveal delay={80}>
      <ul className="iw-day" style={{ listStyle: "none", padding: 0 }}>
        {DAY.map((d) => (
          <li className="iw-day-item" key={d.time + d.title}>
            <span style={{ fontSize: 15, fontWeight: 500, color: INK, fontVariantNumeric: "tabular-nums" }}>{d.time}</span>
            <span style={{ fontSize: 13.5, lineHeight: 1.45, color: INK_62 }}>{d.title}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

// ─── RSVP ────────────────────────────────────────────────────────────────────

const D365_APPS = ["Finance", "Supply Chain", "Sales", "Customer Service", "Commerce", "Field Service", "Project Operations", "Other"];

const EMPTY = {
  firstName: "", lastName: "", email: "", company: "", jobTitle: "", phone: "",
  version: "", otherSystems: "", powerPlatform: "", copilot: "", support: "", process: "",
};

function Field({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label>{label}{req && <span style={{ color: PEACH }}> *</span>}</label>
      {children}
    </div>
  );
}

function RsvpForm() {
  const [form, setForm] = useState({ ...EMPTY });
  const [apps, setApps] = useState<string[]>([]);
  const [country, setCountry] = useState<CountryCode>(COUNTRY_CODES.find((c) => c.country === "AE") ?? COUNTRY_CODES[0]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const set = (k: keyof typeof EMPTY, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const toggleApp = (a: string) => setApps((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!form.firstName.trim() || !form.lastName.trim()) { setErr("Please enter your first and last name."); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) { setErr("Please enter a valid email address."); return; }
    if (!isWorkEmail(form.email.trim())) { setErr("Please use your work email address."); return; }
    if (!form.company.trim()) { setErr("Please enter your company."); return; }
    if (!form.jobTitle.trim()) { setErr("Please enter your job title."); return; }
    const phoneErr = validatePhone(form.phone, country);
    if (phoneErr) { setErr(phoneErr); return; }
    if (apps.length === 0) { setErr("Please tell us which Dynamics 365 applications you run."); return; }
    if (!form.version.trim()) { setErr("Please tell us which version you run and when you last upgraded."); return; }
    if (!form.powerPlatform) { setErr("Please tell us whether you use Power Platform, Power BI or Fabric."); return; }
    if (!form.copilot) { setErr("Please tell us whether you have deployed Copilot or any agents yet."); return; }
    if (!form.support) { setErr("Please tell us who supports your Dynamics environment today."); return; }
    if (!form.process.trim()) { setErr("Please name the process you would most want to automate."); return; }

    setLoading(true);
    const res = await submitForm({
      type: "attend",
      full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email.trim(),
      company: form.company.trim(),
      job_title: form.jobTitle.trim(),
      phone: `${country.code} ${form.phone.trim()}`,
      event_name: "Intwo CXO Roundtable - AI Agents in Action (Dubai, 8 Oct 2026)",
      metadata: {
        "Dynamics 365 applications": apps.join(", "),
        "Version & last upgrade": form.version.trim(),
        "Other ERP / CRM alongside Dynamics": form.otherSystems.trim() || "Not stated",
        "Power Platform / Power BI / Fabric": form.powerPlatform,
        "Copilot or agents deployed": form.copilot,
        "Who supports Dynamics today": form.support,
        "Process they would most want to automate": form.process.trim(),
      },
    });
    setLoading(false);
    if (res.success) { setDone(true); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else setErr(res.error || "Something went wrong. Please try again.");
  };

  return (
    <div ref={topRef}>
      <div style={{ padding: "clamp(26px,3.2vw,44px)", borderRadius: 26, background: WHITE, border: `1px solid ${LINE_SOFT}`, boxShadow: "0 40px 90px rgba(0,42,59,0.10)" }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: INK, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 400, letterSpacing: "-0.03em", color: INK }}>Request received.</h3>
            <p style={{ margin: "14px auto 0", maxWidth: "44ch", fontSize: 15.5, lineHeight: 1.7, color: INK_62 }}>
              Thank you. The room is limited to {EVENT.seats.toLowerCase()}, so we will confirm your
              place by email — and your answers go straight into the mix of agents demonstrated on
              {" "}{EVENT.dateShort}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="iw-form" noValidate style={{ display: "grid", gap: 18 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE }}>About you</p>

            <div className="iw-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="First name" req><input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First name" suppressHydrationWarning /></Field>
              <Field label="Last name" req><input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last name" suppressHydrationWarning /></Field>
            </div>

            <Field label="Work email" req><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" suppressHydrationWarning /></Field>

            <div className="iw-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Company" req><input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company" suppressHydrationWarning /></Field>
              <Field label="Job title" req><input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="Job title" suppressHydrationWarning /></Field>
            </div>

            <Field label="Phone" req>
              <div style={{ display: "flex", gap: 10 }}>
                <select
                  value={country.code + country.country}
                  onChange={(e) => { const c = COUNTRY_CODES.find((x) => x.code + x.country === e.target.value); if (c) { setCountry(c); setForm((p) => ({ ...p, phone: p.phone.replace(/\D/g, "").slice(0, c.length) })); } }}
                  suppressHydrationWarning
                  style={{ flex: "0 0 auto", width: 118 }}
                >
                  {COUNTRY_CODES.map((c) => (<option key={c.code + c.country} value={c.code + c.country}>{c.country} {c.code}</option>))}
                </select>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, country.length))} placeholder={country.placeholder} inputMode="numeric" maxLength={country.length} suppressHydrationWarning style={{ flex: 1 }} />
              </div>
            </Field>

            <p style={{ margin: "10px 0 0", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE }}>Your environment</p>

            <Field label="Which Dynamics 365 applications do you run?" req>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                {D365_APPS.map((a) => (
                  <label key={a} className={`iw-chip${apps.includes(a) ? " iw-chip-on" : ""}`} style={{ position: "relative" }}>
                    <input type="checkbox" checked={apps.includes(a)} onChange={() => toggleApp(a)} suppressHydrationWarning />
                    {a}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Which version, and when did you last upgrade?" req>
              <input value={form.version} onChange={(e) => set("version", e.target.value)} placeholder="e.g. D365 F&O 10.0.39, upgraded March 2026" suppressHydrationWarning />
            </Field>

            <Field label="Do you run any other ERP or CRM alongside Dynamics?">
              <input value={form.otherSystems} onChange={(e) => set("otherSystems", e.target.value)} placeholder="Name them, or leave blank if none" suppressHydrationWarning />
            </Field>

            <div className="iw-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Using Power Platform, Power BI or Fabric?" req>
                <select value={form.powerPlatform} onChange={(e) => set("powerPlatform", e.target.value)} suppressHydrationWarning>
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Not sure</option>
                </select>
              </Field>
              <Field label="Deployed Copilot or any agents yet?" req>
                <select value={form.copilot} onChange={(e) => set("copilot", e.target.value)} suppressHydrationWarning>
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Not sure</option>
                </select>
              </Field>
            </div>

            <Field label="Who supports your Dynamics environment today?" req>
              <select value={form.support} onChange={(e) => set("support", e.target.value)} suppressHydrationWarning>
                <option value="">Select</option>
                <option>Internal team</option>
                <option>Partner</option>
                <option>Both</option>
              </select>
            </Field>

            <Field label="Which single process would you most want to automate?" req>
              <textarea value={form.process} onChange={(e) => set("process", e.target.value)} placeholder="One process, in your own words" suppressHydrationWarning />
            </Field>

            {err && (
              <p style={{ margin: 0, padding: "12px 16px", borderRadius: 14, background: "rgba(255,140,89,0.12)", border: `1px solid rgba(255,140,89,0.4)`, fontSize: 14, color: INK }}>{err}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="iw-pill"
              style={{ marginTop: 4, padding: "16px 28px", borderRadius: 80, border: "none", background: loading ? INK_45 : INK, color: WHITE, fontFamily: "inherit", fontSize: 15.5, fontWeight: 600, cursor: loading ? "default" : "pointer", boxShadow: "0 14px 34px rgba(0,42,59,0.22)" }}
            >
              {loading ? "Sending…" : "Request a seat"}
            </button>

            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: INK_45 }}>
              Seats are confirmed by the Intwo team. We use your answers only to tailor the session.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
