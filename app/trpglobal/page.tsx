"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { submitForm, isWorkEmail, validatePhone, COUNTRY_CODES, type CountryCode } from "@/lib/form-helpers";

// ─── TRPGLOBAL × EFG — AI-Powered Risk Command Center for Oracle Fusion ─────────
// Built on TRPGLOBAL's own identity: Source Serif 4 / Source Sans 3 (the faces on
// techriskpartners.com), their ember accent #FF4E13 and navy #0E326C. The four
// dot colours of the logo (red → green) are the event's four stages — Detect,
// Prevent, Control, Assure — and appear only where a stage is meant.

const INK = "#0B0E13";
const INK_2 = "#131820";
const NAVY = "#0E326C";
const NAVY_DEEP = "#08244D";
const EMBER = "#FF4E13";
const EMBER_DEEP = "#D94310";
const PAPER = "#FFFFFF";
const MIST = "#F2F4F7";
const TEXT = "#161A21";
const SLATE = "#4A5262";
const MUTED = "#7F8797";
const LINE = "rgba(14,50,108,0.12)";
const LINE_DARK = "rgba(255,255,255,0.1)";
const SERIF = "var(--font-trp-serif), Georgia, serif";
const SANS = "var(--font-trp-sans), system-ui, sans-serif";
const MONO = "var(--font-trp-mono), ui-monospace, monospace";
const EASE = [0.16, 1, 0.3, 1] as const;

// Stage colours, sampled from the logo dots. *.hi is lifted for dark grounds.
const SIG = {
  detect: { c: "#E5302A", hi: "#FF5B4F" },
  prevent: { c: "#EE8A0C", hi: "#FFA23A" },
  control: { c: "#93A80C", hi: "#C4D93A" },
  assure: { c: "#2E9E1C", hi: "#52D23A" },
};
const SIG_ORDER = [SIG.detect, SIG.prevent, SIG.control, SIG.assure];

const LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/TRPGLOBAL_logo.png";
const LOGO_CANVAS = { w: 1920, h: 1080 };
const LOGO_BOX = { x: 182, y: 454, w: 1567, h: 171 };

const UNSPLASH = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const WHY_IMAGE = UNSPLASH("1791472656672-79d47c383e94", 2000);
const ABOUT_IMAGE = UNSPLASH("1462396240927-52058a6a84ec", 1200);
// Strategy at the board, for the objective band; dominoes set to fall, for the challenges.
const OBJECTIVE_IMAGE = UNSPLASH("1523875194681-bedd468c58bf", 1400);
const CHALLENGE_IMAGE = UNSPLASH("1768839722117-da92d4acc9ef", 900);

const EVENT_START_ISO = "2026-11-26T10:00:00+04:00";
const TRP_SITE = "https://www.techriskpartners.com/";

// ─── CONTENT (verbatim from the brochure content brief) ─────────────────────────
const TAGLINE =
  "Turn risk signals into decisive action — detect exposure before it escalates, prevent control failures before they materialize, and give leadership confidence that the business is in control.";

const OVERVIEW = [
  "The AI-Powered Risk Command Center for Oracle Fusion is an executive-focused experience that demonstrates how organizations can move beyond fragmented risk reporting, manual control testing and retrospective audits toward a more connected, proactive and intelligent control environment.",
  "Combining the capabilities of Oracle Fusion Cloud Risk Management with AI enablers developed by TRP, the session explores how organizations can identify segregation-of-duties (SoD) conflicts, strengthen joiner-mover-leaver governance, monitor compliance, improve audit readiness and bring greater visibility to application and configuration changes.",
  "Through a leadership keynote, an Oracle capability walkthrough and a practical educational demonstration, participants will see how risk signals can be translated into prioritized actions, accountable remediation and stronger control oversight.",
  "The focus is not simply on detecting violations, but on preventing avoidable exposure, embedding controls into business processes and creating a more evidence-driven approach to assurance.",
];

const PROBLEMS = [
  { title: "Limited strategic visibility", body: "Risk information is distributed across finance, operations, compliance, audit and technology, making it difficult to understand cumulative exposure and its implications for business objectives." },
  { title: "Controls that do not always keep pace with change", body: "Organizational growth, employee movements, new business models, ERP changes and evolving regulatory obligations can introduce risk faster than periodic control reviews can identify it." },
  { title: "Fragmented accountability and remediation", body: "Risks can be identified without being resolved promptly because ownership, escalation, remediation and evidence are disconnected across teams and processes." },
  { title: "Underutilized intelligence and automation", body: "Valuable data and control signals may remain trapped in operational systems, while teams spend considerable effort interpreting exceptions, assembling evidence and preparing reports." },
  { title: "Difficulty translating control performance into business confidence", body: "Leadership needs to know whether risk is within tolerance, whether remediation is effective, where control weaknesses recur, and whether governance can support the organization's growth ambitions." },
];

const WHY_ATTEND =
  "This is an opportunity to explore how risk and control management can evolve from a compliance necessity into a strategic capability that protects enterprise value, supports transformation and strengthens leadership confidence. Through executive perspectives and practical demonstrations, participants will gain a clearer view of how Oracle Fusion Risk Management and TRP's AI-enabled solutions can help build a more resilient, accountable and assurance-driven organization.";

const TAKEAWAYS = [
  { stage: "Detect", title: "Build strategic risk visibility", body: "Understand how access, financial transactions, compliance obligations and control signals can reveal emerging exposure, helping leadership focus attention on risks that matter to enterprise objectives.", sig: SIG.detect },
  { stage: "Prevent", title: "Embed governance into business execution", body: "Explore how preventive checks, subscription-driven joiner-mover-leaver processes and risk-aware workflows can reduce avoidable exposure as people, roles, processes and systems change.", sig: SIG.prevent },
  { stage: "Control", title: "Connect risk to accountability and action", body: "Discover how risk ownership, remediation workflows, compliance oversight and change governance can create a more disciplined operating model across business functions.", sig: SIG.control },
  { stage: "Assure", title: "Demonstrate control effectiveness and business confidence", body: "Explore how structured evidence, traceable remediation and executive risk insights can strengthen audit readiness, support governance decisions and provide a stronger basis for assurance.", sig: SIG.assure },
];

// `tone` styles each slot: talks, the demo, the interactive roundtable, and breaks.
type Tone = "talk" | "demo" | "discuss" | "pause";
type AgendaItem = { start: string; end: string; mins: number; kind: string; title?: string; body: string; tone: Tone; stages?: { label: string; text: string; sig: { c: string; hi: string } }[] };
const AGENDA: AgendaItem[] = [
  { start: "9:30", end: "10:00", mins: 30, kind: "Registration, Networking & Welcome Coffee", body: "Arrival, executive networking and informal introductions among finance, risk, audit and compliance leaders.", tone: "pause" },
  { start: "10:00", end: "10:10", mins: 10, kind: "Opening", title: "Welcome & The Executive Imperative", body: "Set the context for building a resilient, intelligent and continuously assured enterprise.", tone: "talk" },
  { start: "10:10", end: "10:30", mins: 20, kind: "Keynote", title: "From Risk Management to Enterprise Resilience", body: "Explore how proactive risk intelligence and AI-enabled governance can protect enterprise value, support strategic growth and strengthen leadership confidence.", tone: "talk" },
  { start: "10:30", end: "11:00", mins: 30, kind: "Oracle Session", title: "Oracle Fusion Cloud Risk Management: The Foundation for Intelligent Governance", body: "Explore native capabilities for access risk, financial controls, risk and control management, compliance oversight and audit readiness.", tone: "talk" },
  {
    start: "11:00", end: "11:40", mins: 40, kind: "TRP Educational Demo", title: "Inside the AI-Powered Risk Command Center", tone: "demo",
    body: "A connected demonstration of how Oracle capabilities and TRP's AI-enabled solutions support four executive priorities:",
    stages: [
      { label: "Detect", text: "Identify and prioritize risk exposure", sig: SIG.detect },
      { label: "Prevent", text: "Strengthen SoD-aware access and subscription-driven joiner-mover-leaver workflows", sig: SIG.prevent },
      { label: "Control", text: "Connect compliance, remediation and change management", sig: SIG.control },
      { label: "Assure", text: "Improve evidence traceability, audit readiness and executive oversight", sig: SIG.assure },
    ],
  },
  { start: "11:40", end: "12:00", mins: 20, kind: "Executive Networking Break", body: "Coffee, refreshments and peer exchange.", tone: "pause" },
  { start: "12:00", end: "12:25", mins: 25, kind: "Leadership Roundtable", title: "Beyond Compliance: Building Enterprise Confidence", body: "An interactive discussion on strategic risk visibility, control effectiveness, AI governance, accountability and measuring business outcomes.", tone: "discuss" },
  { start: "12:25", end: "12:30", mins: 5, kind: "Closing Remarks & Call to Action", body: "Key takeaways, acknowledgements and invitation for follow-up executive discussions.", tone: "talk" },
];

const ABOUT = [
  "TRPGLOBAL excels in SAP and Oracle implementations, renowned for conducting thorough SAP Health Checks and managing Oracle Risk Management Cloud (RMC). Our RiskSuccess© methodology significantly boosts cybersecurity and compliance across over 100 global enterprises.",
  "We deliver sophisticated risk assessment tools for SAP and Oracle Business Processes, focusing on mitigating security risks and enhancing governance, risk, and compliance (GRC) frameworks.",
  "Collaborating closely with IT, Finance, and Audit Executives, TRPGLOBAL optimizes operational efficiencies, transforming ERP management into strategic business growth. We embody our commitment to global collaboration and success, inviting partners to “Join Forces, Collaborate, and Thrive Worldwide.”",
];

const NAV_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "challenges", label: "Challenges" },
  { id: "takeaways", label: "Takeaways" },
  { id: "agenda", label: "Agenda" },
  { id: "about", label: "About TRP" },
];

// ─── SHARED BITS ────────────────────────────────────────────────────────────────
function Logo({ height }: { height: number }) {
  const k = height / LOGO_BOX.h;
  return (
    <span aria-label="TRPGLOBAL" role="img" style={{ display: "inline-block", position: "relative", overflow: "hidden", width: LOGO_BOX.w * k, height, flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO} alt="" style={{ position: "absolute", maxWidth: "none", width: LOGO_CANVAS.w * k, height: LOGO_CANVAS.h * k, left: -LOGO_BOX.x * k, top: -LOGO_BOX.y * k }} />
    </span>
  );
}

function Reveal({ children, delay = 0, style, className }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className="trp-label" style={{ color: dark ? "rgba(255,255,255,0.66)" : SLATE }}>
      <i aria-hidden style={{ background: EMBER }} />
      {children}
    </p>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number; duration?: number }) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -84, duration: 1.1 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const jump = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToId(id); };

function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// ─── NAV — a floating white bar, so the navy wordmark stays true over the dark hero
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`trp-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="trp-nav-bar">
        <a href="#top" onClick={jump("top")} aria-label="TRPGLOBAL — back to top" style={{ display: "flex" }}>
          <Logo height={20} />
        </a>
        <nav className="trp-nav-links" aria-label="Page sections">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={jump(l.id)}>{l.label}</a>
          ))}
        </nav>
        <a href="#register" onClick={jump("register")} className="trp-btn trp-btn-ember trp-btn-sm">Register</a>
      </div>
    </header>
  );
}

// ─── HERO — a live risk radar ───────────────────────────────────────────────────
// Each blip is a risk signal. The sweep picks it up in red (detected), and every
// pass moves it a stage on — prevent, control — until it settles green
// (assured), then a new exposure appears elsewhere. Seeded so it starts the same
// every load; draws one still frame when reduced motion is requested.
function Radar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const TAU = Math.PI * 2;
    let seed = 11;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    type Blip = { a: number; d: number; s: number; flash: number; fade: number };
    const blips: Blip[] = Array.from({ length: 26 }, () => ({ a: rnd() * TAU, d: 0.16 + rnd() * 0.78, s: Math.floor(rnd() * 4), flash: 0, fade: 1 }));
    let w = 0, h = 0, raf = 0, sweep = -Math.PI / 2, last = performance.now();

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (dt: number) => {
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 4;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(cx, cy, (R * i) / 4, 0, TAU); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * TAU, l = i % 6 === 0 ? 9 : 4;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.lineTo(cx + Math.cos(a) * (R - l), cy + Math.sin(a) * (R - l)); ctx.stroke();
      }

      const prev = sweep;
      sweep += dt * 0.0011;
      // trailing wedge, built from thin slices for a soft falloff
      for (let k = 0; k < 44; k++) {
        const a1 = sweep - k * 0.022;
        ctx.fillStyle = `rgba(255,78,19,${0.2 * (1 - k / 44) ** 1.6})`;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a1 - 0.024, a1); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = "rgba(255,130,80,0.9)"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R); ctx.stroke();

      for (const b of blips) {
        if (dt > 0 && Math.floor((prev - b.a) / TAU) !== Math.floor((sweep - b.a) / TAU)) {
          if (b.s < 3) { b.s += 1; b.flash = 1; }
          else if (Math.random() < 0.55) { b.fade = 0; b.a = Math.random() * TAU; b.d = 0.16 + Math.random() * 0.78; b.s = 0; b.flash = 1; }
        }
        b.flash = Math.max(0, b.flash - dt * 0.0011);
        b.fade = Math.min(1, b.fade + dt * 0.002);
        const x = cx + Math.cos(b.a) * b.d * R, y = cy + Math.sin(b.a) * b.d * R;
        const col = SIG_ORDER[b.s].hi;
        ctx.globalAlpha = b.fade;
        if (b.s === 0) {
          ctx.strokeStyle = col; ctx.lineWidth = 1.4;
          ctx.globalAlpha = b.fade * (0.25 + b.flash * 0.6);
          ctx.beginPath(); ctx.arc(x, y, 7 + (1 - b.flash) * 9, 0, TAU); ctx.stroke();
          ctx.globalAlpha = b.fade;
        }
        ctx.shadowColor = col; ctx.shadowBlur = 8 + b.flash * 16;
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(x, y, 3.6 + b.flash * 2.2, 0, TAU); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
      ctx.fillStyle = EMBER;
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, TAU); ctx.fill();
    };

    size();
    draw(0);
    const ro = new ResizeObserver(() => { size(); draw(0); });
    ro.observe(cv);
    if (!reduce) {
      const loop = (t: number) => { const dt = Math.min(64, t - last); last = t; draw(dt); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame((t) => { last = t; loop(t); });
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div className="trp-radar">
      <span aria-hidden className="trp-bracket tl" /><span aria-hidden className="trp-bracket tr" />
      <span aria-hidden className="trp-bracket bl" /><span aria-hidden className="trp-bracket br" />
      <div className="trp-radar-head" aria-hidden>
        <span><i className="trp-live" />Risk signal view</span>
        <span>Oracle Fusion</span>
      </div>
      <canvas ref={ref} role="img" aria-label="Illustrative radar of risk signals moving from detected to assured" />
      <div className="trp-radar-legend" aria-hidden>
        {TAKEAWAYS.map((t) => (
          <span key={t.stage}><i style={{ background: t.sig.hi, boxShadow: `0 0 8px ${t.sig.hi}` }} />{t.stage}</span>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const facts = [
    { k: "Date", v: "Thursday, 26 November 2026" },
    { k: "Time", v: "10:00 AM – 12:30 PM", sub: "Dubai time" },
    { k: "Format", v: "Executive roundtable", sub: "Keynote · Oracle session · Demo · Discussion" },
    { k: "Venue", v: "Oracle office", sub: "Dubai Internet City, UAE", keep: true },
  ];
  return (
    <section id="top" className="trp-hero">
      <div aria-hidden className="trp-hero-glow" />
      <div aria-hidden className="trp-hero-grid" />
      <div className="trp-wrap trp-hero-inner">
        <div className="trp-hero-copy">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <span className="trp-label" style={{ color: "rgba(255,255,255,0.72)", margin: 0 }}><i aria-hidden style={{ background: EMBER }} />Executive Roundtable · Hosted by TRPGLOBAL</span>
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: EASE }} className="trp-h1">
            AI-Powered Risk <em>Command Center</em> <span className="trp-h1-for">for Oracle Fusion</span>
          </motion.h1>
          <motion.ol initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }} className="trp-hero-stages" aria-label="Four stages">
            {TAKEAWAYS.map((t) => (
              <li key={t.stage}><i style={{ background: t.sig.hi, boxShadow: `0 0 10px ${t.sig.hi}` }} />{t.stage}</li>
            ))}
          </motion.ol>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.28, ease: EASE }} className="trp-hero-lede">
            {TAGLINE}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.36, ease: EASE }} className="trp-hero-ctas">
            <a href="#register" onClick={jump("register")} className="trp-btn trp-btn-ember">Reserve your seat <Arrow /></a>
            <a href="#agenda" onClick={jump("agenda")} className="trp-btn trp-btn-ghost">View the agenda</a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.15, ease: EASE }} className="trp-hero-visual">
          <Radar />
        </motion.div>
      </div>
      <div className="trp-wrap">
        <motion.dl initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: EASE }} className="trp-facts">
          {facts.map((f) => (
            <div key={f.k} className="trp-fact">
              <dt>{f.k}</dt>
              <dd>
                {f.v}
                {f.sub && <small className={"keep" in f && f.keep ? "trp-keep" : undefined}>{f.sub}</small>}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

// ─── OVERVIEW ───────────────────────────────────────────────────────────────────
function Overview() {
  return (
    <section id="overview" className="trp-sec">
      <div className="trp-wrap">
        <Reveal><Label>Event overview</Label></Reveal>
        <Reveal delay={0.05}>
          <p className="trp-overview-lead">{OVERVIEW[0]}</p>
        </Reveal>
        <div className="trp-overview-cols">
          {OVERVIEW.slice(1).map((p, i) => (
            <Reveal key={i} delay={0.08 + i * 0.07}>
              <p className="trp-body">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── THE OBJECTIVE — the old question gets struck out as you arrive ─────────────
function Objective() {
  const lines = [
    { t: "Where are we exposed,", sig: SIG.detect },
    { t: "what are we doing about it,", sig: SIG.control },
    { t: "and how can we prove it?", sig: SIG.assure },
  ];
  return (
    <section className="trp-obj">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={OBJECTIVE_IMAGE} alt="" aria-hidden loading="lazy" className="trp-obj-img" />
      <div aria-hidden className="trp-obj-glow" />
      <div className="trp-wrap" style={{ position: "relative" }}>
        <Reveal><Label dark>The ultimate objective</Label></Reveal>
        <Reveal delay={0.05}><p className="trp-obj-from">Help leadership move from asking</p></Reveal>
        <div className="trp-obj-old">
          <motion.span initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: EASE }}>
            “What went wrong?”
          </motion.span>
          <motion.i
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
        <Reveal delay={0.1}><p className="trp-obj-from" style={{ marginTop: "clamp(22px,3vw,40px)" }}>to knowing</p></Reveal>
        <ul className="trp-obj-new">
          {lines.map((l, i) => (
            <motion.li
              key={l.t}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.9 + i * 0.18, ease: EASE }}
            >
              <i aria-hidden style={{ background: l.sig.hi, boxShadow: `0 0 14px ${l.sig.hi}` }} />
              {i === 0 ? "“" : ""}{l.t}{i === lines.length - 1 ? "”" : ""}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── CHALLENGES — cards that stack as you scroll ────────────────────────────────
function Challenges() {
  return (
    <section id="challenges" className="trp-sec" style={{ background: MIST }}>
      <div className="trp-wrap trp-chal">
        <div className="trp-chal-head">
          <Reveal>
            <Label>The challenge</Label>
            <h2 className="trp-h2">What problem does it solve?</h2>
          </Reveal>
          <Reveal delay={0.1} className="trp-chal-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CHALLENGE_IMAGE} alt="A line of dominoes poised to fall" loading="lazy" />
          </Reveal>
        </div>
        <ol className="trp-chal-stack">
          {PROBLEMS.map((p, i) => (
            <li key={p.title} className="trp-chal-card" style={{ top: `calc(118px + ${i * 22}px)` }}>
              <div className="trp-chal-meta">
                <span className="trp-mono">{String(i + 1).padStart(2, "0")} / {String(PROBLEMS.length).padStart(2, "0")}</span>
                <i aria-hidden />
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── TAKEAWAYS — four stages as panels that open on hover ───────────────────────
function Takeaways() {
  const [active, setActive] = useState(0);
  return (
    <section id="takeaways" className="trp-sec trp-dark">
      <div className="trp-wrap">
        <Reveal className="trp-take-head">
          <div>
            <Label dark>Key takeaways</Label>
            <h2 className="trp-h2" style={{ color: "#fff" }}>Detect. Prevent. Control. <em style={{ color: SIG.assure.hi }}>Assure.</em></h2>
          </div>
          <p className="trp-body" style={{ color: "rgba(255,255,255,0.62)", maxWidth: 360, margin: 0 }}>
            What you will walk away with — one stage of the command center at a time.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="trp-panels">
            {TAKEAWAYS.map((t, i) => {
              const on = active === i;
              return (
                <div
                  key={t.stage}
                  className={`trp-panel${on ? " is-on" : ""}`}
                  style={{ ["--c" as string]: t.sig.hi }}
                  onMouseEnter={() => setActive(i)}
                >
                  <button type="button" className="trp-panel-btn" aria-expanded={on} onClick={() => setActive(i)} onFocus={() => setActive(i)}>
                    <span className="trp-panel-num trp-mono">0{i + 1}</span>
                    <span className="trp-panel-word">{t.stage}</span>
                  </button>
                  <div className="trp-panel-body">
                    <p className="trp-panel-tag trp-mono">0{i + 1} · {t.stage}</p>
                    <h3>{t.title}</h3>
                    <p>{t.body}</p>
                  </div>
                  <span aria-hidden className="trp-panel-bar" />
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── WHY ATTEND — full-bleed photograph ─────────────────────────────────────────
function WhyAttend() {
  return (
    <section className="trp-why">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={WHY_IMAGE} alt="" aria-hidden loading="lazy" className="trp-why-img" />
      <div aria-hidden className="trp-why-shade" />
      <div className="trp-wrap" style={{ position: "relative" }}>
        <Reveal className="trp-why-copy">
          <Label dark>Why attend</Label>
          <p className="trp-why-text">{WHY_ATTEND}</p>
          <a href="#register" onClick={jump("register")} className="trp-btn trp-btn-ember" style={{ marginTop: 34 }}>Request your seat <Arrow /></a>
        </Reveal>
      </div>
    </section>
  );
}

// ─── AGENDA ─────────────────────────────────────────────────────────────────────
function Agenda() {
  return (
    <section id="agenda" className="trp-sec">
      <div className="trp-wrap">
        <Reveal className="trp-agenda-head">
          <div>
            <Label>Agenda</Label>
            <h2 className="trp-h2">Thursday, 26 November</h2>
          </div>
          <p className="trp-mono" style={{ margin: 0, fontSize: 13, color: SLATE }}>9:30 AM – 12:30 PM · Dubai time</p>
        </Reveal>

        <ol className="trp-agenda">
          {AGENDA.map((a, i) => (
            <motion.li
              key={a.start}
              className={`trp-slot is-${a.tone}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: Math.min(i * 0.03, 0.15), ease: EASE }}
            >
              <div className="trp-slot-time">
                <span className="trp-slot-start">{a.start}</span>
                <span className="trp-mono trp-slot-range">– {a.end} · {a.mins} min</span>
              </div>
              <div className="trp-slot-body">
                <p className="trp-slot-kind trp-mono">{a.kind}</p>
                {a.title && <h3>{a.title}</h3>}
                <p className="trp-slot-text">{a.body}</p>
                {a.stages && (
                  <ul className="trp-slot-stages">
                    {a.stages.map((s) => (
                      <li key={s.label} style={{ ["--c" as string]: s.sig.c }}>
                        <span className="trp-mono">{s.label}</span>
                        {s.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── ABOUT TRPGLOBAL ────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="trp-sec" style={{ background: MIST }}>
      <div className="trp-wrap trp-about">
        <Reveal className="trp-about-copy">
          <Label>About the host</Label>
          <div style={{ margin: "6px 0 30px" }}><Logo height={34} /></div>
          <p className="trp-about-lead">{ABOUT[0]}</p>
          <div className="trp-about-cols">
            {ABOUT.slice(1).map((p, i) => <p key={i} className="trp-body">{p}</p>)}
          </div>
          <a href={TRP_SITE} target="_blank" rel="noopener noreferrer" className="trp-link" style={{ marginTop: 30 }}>
            techriskpartners.com
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 17L17 7M8 7h9v9" /></svg>
          </a>
        </Reveal>
        <Reveal delay={0.08} className="trp-about-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ABOUT_IMAGE} alt="Glass office towers seen from street level" loading="lazy" />
          <div aria-hidden className="trp-about-dots">
            {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ background: SIG_ORDER[Math.min(3, Math.floor(((i % 3) * 4) / 3))].c }} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── REGISTER ───────────────────────────────────────────────────────────────────
function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(EVENT_START_ISO).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);
  const parts = left === null ? null : [Math.floor(left / 86400000), Math.floor((left % 86400000) / 3600000), Math.floor((left % 3600000) / 60000), Math.floor((left % 60000) / 1000)];
  return (
    <div className="trp-count">
      {["Days", "Hours", "Minutes", "Seconds"].map((l, i) => (
        <div key={l}>
          <span>{parts ? String(parts[i]).padStart(2, "0") : "--"}</span>
          <small className="trp-mono">{l}</small>
        </div>
      ))}
    </div>
  );
}

const EMPTY = { firstName: "", lastName: "", email: "", company: "", jobTitle: "", phone: "" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="trp-field">
      <label>{label}<span style={{ color: EMBER }}> *</span></label>
      {children}
    </div>
  );
}

function RegistrationForm() {
  const [form, setForm] = useState({ ...EMPTY });
  const [country, setCountry] = useState<CountryCode>(COUNTRY_CODES.find((c) => c.country === "AE") ?? COUNTRY_CODES[0]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const set = (k: keyof typeof EMPTY, v: string) => setForm((p) => ({ ...p, [k]: v }));

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
    setLoading(true);
    const res = await submitForm({
      type: "attend",
      full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email.trim(),
      company: form.company.trim(),
      job_title: form.jobTitle.trim(),
      phone: `${country.code} ${form.phone.trim()}`,
      event_name: "TRPGLOBAL Executive Roundtable — AI-Powered Risk Command Center for Oracle Fusion · 26 November 2026",
      metadata: { "Event Page": "TRPGLOBAL · AI-Powered Risk Command Center for Oracle Fusion" },
    });
    setLoading(false);
    if (res.success) { setDone(true); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else setErr(res.error || "Something went wrong. Please try again.");
  };

  return (
    <div ref={topRef} className="trp-form-card">
      {done ? (
        <div style={{ textAlign: "center", padding: "34px 0" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: "50%", background: SIG.assure.c, marginBottom: 22, boxShadow: `0 0 0 8px ${SIG.assure.c}22` }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <h3 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 500, color: TEXT, margin: 0 }}>Request received.</h3>
          <p className="trp-body" style={{ margin: "12px auto 0", maxWidth: 400 }}>Thank you. Our team will be in touch to confirm your seat and share the final details.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="trp-form" noValidate>
          <h3 className="trp-form-title">Register your interest</h3>
          <div className="trp-form-row">
            <Field label="First name"><input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First name" autoComplete="given-name" suppressHydrationWarning /></Field>
            <Field label="Last name"><input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last name" autoComplete="family-name" suppressHydrationWarning /></Field>
          </div>
          <Field label="Work email"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" autoComplete="email" suppressHydrationWarning /></Field>
          <div className="trp-form-row">
            <Field label="Company"><input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company" autoComplete="organization" suppressHydrationWarning /></Field>
            <Field label="Job title"><input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="Job title" autoComplete="organization-title" suppressHydrationWarning /></Field>
          </div>
          <Field label="Phone">
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <select value={country.code + country.country} onChange={(e) => { const c = COUNTRY_CODES.find((x) => x.code + x.country === e.target.value); if (c) { setCountry(c); setForm((p) => ({ ...p, phone: p.phone.replace(/\D/g, "").slice(0, c.length) })); } }} aria-label="Country code" suppressHydrationWarning style={{ flex: "0 0 auto", width: 116, marginTop: 0 }}>
                {COUNTRY_CODES.map((c) => (<option key={c.code + c.country} value={c.code + c.country}>{c.country} {c.code}</option>))}
              </select>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, country.length))} placeholder={country.placeholder} inputMode="numeric" maxLength={country.length} autoComplete="tel-national" suppressHydrationWarning style={{ flex: 1, marginTop: 0 }} />
            </div>
          </Field>
          {err && <p role="alert" style={{ fontSize: 14, color: "#B3261E", margin: "16px 0 0" }}>{err}</p>}
          <button type="submit" disabled={loading} suppressHydrationWarning className="trp-btn trp-btn-ember" style={{ width: "100%", marginTop: 22, justifyContent: "center", opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Submitting…" : "Reserve your seat"}
          </button>
          <p style={{ fontSize: 12.5, color: MUTED, textAlign: "center", margin: "16px 0 0", lineHeight: 1.6 }}>
            By registering you agree to be contacted by Events First Group and TRPGLOBAL about this roundtable.
          </p>
        </form>
      )}
    </div>
  );
}

function Register() {
  return (
    <section id="register" className="trp-sec trp-dark trp-reg-sec">
      <div aria-hidden className="trp-reg-glow" />
      <div className="trp-wrap trp-reg">
        <Reveal>
          <Label dark>Registration</Label>
          <h2 className="trp-h2" style={{ color: "#fff" }}>Reserve your seat <em style={{ color: EMBER }}>at the table.</em></h2>
          <p className="trp-body" style={{ marginTop: 18, maxWidth: 480, color: "rgba(255,255,255,0.66)" }}>
            Places are limited and confirmed individually. Register below and our team will be in touch with the final details.
          </p>
          <div style={{ marginTop: 36 }}><Countdown /></div>
          <p className="trp-mono" style={{ margin: "20px 0 0", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Thursday, 26 November 2026 · 10:00 AM – 12:30 PM, Dubai time<br />Oracle office, Dubai Internet City, UAE</p>
        </Reveal>
        <Reveal delay={0.1}>
          <RegistrationForm />
        </Reveal>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="trp-footer">
      <div className="trp-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Navy wordmark needs a light ground; a white tile keeps it true. */}
          <span style={{ display: "inline-flex", padding: "12px 16px", borderRadius: 10, background: PAPER, alignSelf: "flex-start" }}><Logo height={20} /></span>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>AI-Powered Risk Command Center for Oracle Fusion · 26 November 2026</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="trp-label" style={{ color: "rgba(255,255,255,0.5)", margin: 0 }}>Organised by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/events-first-group_logo_alt.svg" alt="Events First Group" style={{ height: 38, width: "auto", display: "block" }} />
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────────────────────
export default function TrpGlobalPage() {
  // Land deep links (#register etc.) on their section. Lenis rewrites scrollTop
  // every frame, so a native #hash jump gets swallowed on load.
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    let tries = 0;
    const go = () => {
      if (!document.getElementById(id)) { if (tries++ < 20) window.setTimeout(go, 150); return; }
      scrollToId(id);
    };
    window.setTimeout(go, 450);
  }, []);

  return (
    <main className="trp-page" style={{ position: "relative", background: PAPER, color: TEXT, width: "100%", maxWidth: "100%", fontFamily: SANS }}>
      <style jsx global>{`
        /* globals.css sets overflow-x:hidden on html and body, which turns body into
           a scroll container and silently disables position:sticky. clip keeps the
           horizontal guard without that side effect. */
        html, body { max-width: 100%; overflow-x: clip !important; }
        .trp-page { overflow-x: clip; }
        .trp-page ::selection { background: ${EMBER}; color: #fff; }
        .trp-wrap { max-width: 1320px; margin: 0 auto; padding-left: clamp(20px, 5vw, 72px); padding-right: clamp(20px, 5vw, 72px); }
        .trp-sec { padding: clamp(64px, 7.5vw, 108px) 0; position: relative; }
        .trp-label { display: inline-flex; align-items: center; gap: 10px; font-family: ${MONO}; font-size: 12px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 18px; }
        .trp-label i { width: 7px; height: 7px; border-radius: 50%; flex: none; }
        .trp-mono { font-family: ${MONO}; font-variant-numeric: tabular-nums; }
        .trp-h1 { font-family: ${SERIF}; font-weight: 400; font-size: clamp(38px, min(4.9vw, 8vh), 80px); line-height: 1.0; letter-spacing: -0.025em; color: #fff; margin: clamp(12px, 2vh, 20px) 0 0; text-wrap: balance; font-optical-sizing: auto; }
        .trp-h1 em { font-style: italic; color: ${EMBER}; font-weight: 400; }
        .trp-h1-for { display: block; font-family: ${SANS}; font-weight: 300; font-size: 0.42em; letter-spacing: -0.01em; color: rgba(255,255,255,0.72); margin-top: 0.45em; }
        .trp-h2 { font-family: ${SERIF}; font-weight: 400; font-size: clamp(32px, 3.4vw, 52px); line-height: 1.04; letter-spacing: -0.022em; color: ${TEXT}; margin: 0; text-wrap: balance; }
        .trp-h2 em { font-style: italic; }
        .trp-body { font-size: clamp(16px, 1.08vw, 17.5px); line-height: 1.72; color: ${SLATE}; margin: 0; }

        .trp-btn { display: inline-flex; align-items: center; gap: 10px; padding: 15px 26px; border-radius: 999px; font-family: ${SANS}; font-size: 15.5px; font-weight: 600; text-decoration: none; border: 1px solid transparent; cursor: pointer; transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease; }
        .trp-btn:hover { transform: translateY(-1px); }
        .trp-btn svg { transition: transform 0.25s ease; }
        .trp-btn:hover svg { transform: translateX(3px); }
        .trp-btn:focus-visible, .trp-link:focus-visible, .trp-nav-links a:focus-visible, .trp-panel-btn:focus-visible { outline: 2px solid ${EMBER}; outline-offset: 3px; }
        .trp-btn-sm { padding: 10px 18px; font-size: 14px; }
        .trp-btn-ember { background: ${EMBER}; color: #fff; box-shadow: 0 12px 30px rgba(255,78,19,0.3); }
        .trp-btn-ember:hover { background: ${EMBER_DEEP}; box-shadow: 0 14px 36px rgba(255,78,19,0.4); }
        .trp-btn-ghost { background: rgba(255,255,255,0.04); color: #fff; border-color: rgba(255,255,255,0.28); }
        .trp-btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); }
        .trp-link { display: inline-flex; align-items: center; gap: 8px; font-family: ${MONO}; font-size: 14px; font-weight: 500; color: ${NAVY}; text-decoration: none; border-bottom: 1px solid ${NAVY}55; padding-bottom: 3px; }
        .trp-link:hover { color: ${EMBER_DEEP}; border-color: ${EMBER}; }

        /* nav */
        .trp-nav { position: fixed; top: 14px; left: 0; right: 0; z-index: 50; padding: 0 clamp(12px, 3vw, 40px); pointer-events: none; }
        .trp-nav-bar { pointer-events: auto; max-width: 1240px; margin: 0 auto; height: 62px; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 0 10px 0 22px; border-radius: 16px; background: rgba(255,255,255,0.94); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 10px 30px rgba(0,0,0,0.18); transition: box-shadow 0.3s ease; }
        .trp-nav.is-scrolled .trp-nav-bar { box-shadow: 0 14px 40px rgba(11,14,19,0.16); border-color: ${LINE}; }
        .trp-nav-links { display: flex; gap: clamp(18px, 2vw, 32px); }
        .trp-nav-links a { position: relative; font-size: 15px; font-weight: 500; color: ${SLATE}; text-decoration: none; transition: color 0.2s ease; }
        .trp-nav-links a::after { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: ${EMBER}; transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
        .trp-nav-links a:hover { color: ${TEXT}; }
        .trp-nav-links a:hover::after { transform: scaleX(1); }

        /* hero */
        .trp-hero { position: relative; background: ${INK}; overflow: hidden; min-height: 100svh; display: flex; flex-direction: column; padding: clamp(96px, 13vh, 124px) 0 0; }
        .trp-hero-glow { position: absolute; inset: 0; background:
          radial-gradient(ellipse 50% 60% at 76% 42%, rgba(14,50,108,0.75), transparent 70%),
          radial-gradient(ellipse 30% 40% at 80% 50%, rgba(255,78,19,0.12), transparent 70%),
          radial-gradient(ellipse 50% 50% at 0% 100%, rgba(14,50,108,0.4), transparent 70%); }
        .trp-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px); background-size: 56px 56px; mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, #000 30%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, #000 30%, transparent 80%); }
        .trp-hero-inner { position: relative; z-index: 2; flex: 1; display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr); gap: clamp(32px, 5vw, 80px); align-items: center; }
        .trp-hero-stages { list-style: none; display: flex; flex-wrap: wrap; gap: 10px; margin: clamp(14px, 2.6vh, 26px) 0 0; padding: 0; }
        .trp-hero-stages li { display: inline-flex; align-items: center; gap: 9px; padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.04); font-family: ${MONO}; font-size: 12.5px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.86); }
        .trp-hero-stages i { width: 7px; height: 7px; border-radius: 50%; }
        .trp-hero-lede { font-size: clamp(16px, 1.15vw, 18.5px); line-height: 1.6; color: rgba(255,255,255,0.7); margin: clamp(14px, 2.4vh, 24px) 0 0; max-width: 56ch; }
        .trp-hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(18px, 3.4vh, 34px); }
        .trp-hero-visual { justify-self: end; width: 100%; max-width: min(560px, calc(100svh - 330px)); }

        .trp-radar { position: relative; padding: 14px; }
        .trp-radar canvas { display: block; width: 100%; aspect-ratio: 1 / 1; }
        .trp-bracket { position: absolute; width: 22px; height: 22px; border-color: rgba(255,255,255,0.35); border-style: solid; border-width: 0; }
        .trp-bracket.tl { top: 0; left: 0; border-top-width: 1.5px; border-left-width: 1.5px; }
        .trp-bracket.tr { top: 0; right: 0; border-top-width: 1.5px; border-right-width: 1.5px; }
        .trp-bracket.bl { bottom: 0; left: 0; border-bottom-width: 1.5px; border-left-width: 1.5px; }
        .trp-bracket.br { bottom: 0; right: 0; border-bottom-width: 1.5px; border-right-width: 1.5px; }
        .trp-radar-head, .trp-radar-legend { display: flex; justify-content: space-between; gap: 10px 18px; flex-wrap: wrap; font-family: ${MONO}; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
        .trp-radar-head { margin-bottom: 12px; }
        .trp-radar-head span, .trp-radar-legend span { display: inline-flex; align-items: center; gap: 8px; }
        .trp-radar-legend { margin-top: 12px; justify-content: center; color: rgba(255,255,255,0.72); }
        .trp-radar-legend i { width: 7px; height: 7px; border-radius: 50%; }
        .trp-live { width: 7px; height: 7px; border-radius: 50%; background: ${EMBER}; box-shadow: 0 0 8px ${EMBER}; animation: trp-blink 2s ease-in-out infinite; }
        @keyframes trp-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .trp-facts { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: clamp(20px, 4vh, 44px) 0 0; border-top: 1px solid ${LINE_DARK}; }
        .trp-fact { padding: clamp(14px, 2.4vh, 24px) clamp(0px, 1.6vw, 26px) clamp(16px, 3vh, 28px); }
        .trp-fact:first-child { padding-left: 0; }
        .trp-fact + .trp-fact { border-left: 1px solid ${LINE_DARK}; }
        .trp-fact dt { font-family: ${MONO}; font-size: 11.5px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .trp-fact dd { margin: 8px 0 0; font-family: ${SERIF}; font-size: clamp(17px, 1.35vw, 21px); line-height: 1.25; color: #fff; }
        .trp-fact small { display: block; margin-top: 4px; font-family: ${SANS}; font-size: 13px; color: rgba(255,255,255,0.55); }

        /* overview */
        .trp-overview-lead { font-family: ${SERIF}; font-weight: 400; font-size: clamp(24px, 2.4vw, 38px); line-height: 1.28; letter-spacing: -0.015em; color: ${TEXT}; margin: 0; max-width: 30em; text-wrap: pretty; }
        .trp-overview-cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(24px, 3.4vw, 56px); margin-top: clamp(44px, 5vw, 72px); }
        .trp-overview-cols > div { padding-top: 22px; border-top: 2px solid ${TEXT}; }
        .trp-overview-cols > div:last-child { border-top-color: ${EMBER}; }

        /* objective */
        .trp-obj { position: relative; background: ${NAVY_DEEP}; color: #fff; padding: clamp(72px, 8vw, 116px) 0; overflow: hidden; }
        .trp-obj-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 100% 0%, rgba(255,78,19,0.18), transparent 60%), radial-gradient(ellipse 60% 70% at 0% 100%, rgba(0,0,0,0.45), transparent 70%); }
        .trp-obj-img { position: absolute; top: 0; right: 0; bottom: 0; width: 52%; height: 100%; object-fit: cover; object-position: 50% 50%; opacity: 0.9; mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 30%, #000 65%); -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 30%, #000 65%); }
        .trp-obj-from { margin: 0; font-family: ${SANS}; font-weight: 300; font-size: clamp(18px, 1.6vw, 24px); color: rgba(255,255,255,0.66); }
        .trp-obj-old { position: relative; display: inline-block; margin-top: 10px; }
        .trp-obj-old span { display: inline-block; white-space: nowrap; font-family: ${SERIF}; font-style: italic; font-weight: 300; font-size: clamp(42px, 6vw, 92px); line-height: 1.05; letter-spacing: -0.025em; color: rgba(255,255,255,0.42); }
        .trp-obj-old i { position: absolute; left: -2%; right: -2%; top: 54%; height: clamp(3px, 0.4vw, 6px); background: ${SIG.detect.hi}; transform-origin: left; border-radius: 3px; box-shadow: 0 0 18px rgba(255,91,79,0.6); }
        .trp-obj-new { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 4px; }
        .trp-obj-new li { display: flex; align-items: baseline; gap: clamp(14px, 1.6vw, 24px); font-family: ${SERIF}; font-weight: 400; font-size: clamp(28px, 3.6vw, 56px); line-height: 1.12; letter-spacing: -0.02em; color: #fff; }
        .trp-obj-new i { flex: none; width: clamp(10px, 0.9vw, 14px); height: clamp(10px, 0.9vw, 14px); border-radius: 50%; transform: translateY(-0.12em); }

        /* challenges */
        .trp-chal { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 96px); align-items: start; }
        .trp-chal-head { position: sticky; top: 130px; }
        .trp-chal-img { margin-top: clamp(28px, 3vw, 40px); border-radius: 20px; overflow: hidden; height: min(440px, calc(100svh - 400px)); min-height: 220px; box-shadow: 0 30px 60px rgba(11,14,19,0.16); }
        .trp-chal-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .trp-chal-stack { list-style: none; margin: 0; padding: 0; display: grid; gap: 28px; }
        .trp-chal-card { position: sticky; background: ${PAPER}; border: 1px solid ${LINE}; border-radius: 20px; padding: clamp(26px, 3vw, 42px); box-shadow: 0 -8px 30px rgba(11,14,19,0.05), 0 24px 50px rgba(11,14,19,0.07); min-height: 250px; }
        .trp-chal-meta { display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: ${MUTED}; letter-spacing: 0.08em; }
        .trp-chal-meta i { width: 34px; height: 3px; border-radius: 3px; background: ${EMBER}; }
        .trp-chal-card h3 { margin: clamp(26px, 3vw, 44px) 0 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(25px, 2.2vw, 36px); line-height: 1.15; letter-spacing: -0.018em; color: ${TEXT}; text-wrap: balance; }
        .trp-chal-card p { margin: 16px 0 0; font-size: 16.5px; line-height: 1.72; color: ${SLATE}; max-width: 60ch; }

        /* takeaways */
        .trp-dark { background: ${INK}; color: #fff; }
        .trp-take-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; flex-wrap: wrap; }
        .trp-panels { display: flex; gap: 12px; height: clamp(400px, min(40vw, 62vh), 500px); margin-top: clamp(40px, 4.6vw, 64px); }
        .trp-panel { position: relative; flex: 1 1 0; min-width: 0; border-radius: 20px; overflow: hidden; background: ${INK_2}; border: 1px solid ${LINE_DARK}; transition: flex-grow 0.7s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s ease, border-color 0.5s ease; }
        .trp-panel.is-on { flex-grow: 3.4; background: linear-gradient(160deg, color-mix(in srgb, var(--c) 18%, ${INK_2}) 0%, ${INK_2} 60%); border-color: color-mix(in srgb, var(--c) 40%, transparent); }
        .trp-panel-btn { position: absolute; inset: 0; width: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; padding: 26px 22px; background: none; border: 0; color: #fff; cursor: pointer; text-align: left; }
        .trp-panel-num { font-size: 13px; color: var(--c); letter-spacing: 0.1em; }
        .trp-panel-word { font-family: ${SERIF}; font-style: italic; font-size: clamp(36px, 3.4vw, 54px); line-height: 1; color: var(--c); writing-mode: vertical-rl; transform: rotate(180deg); transition: opacity 0.35s ease; }
        .trp-panel.is-on .trp-panel-btn { pointer-events: none; }
        .trp-panel.is-on .trp-panel-word, .trp-panel.is-on .trp-panel-num { opacity: 0; }
        .trp-panel-body { position: absolute; left: 0; right: 0; bottom: 0; padding: clamp(26px, 3vw, 44px); opacity: 0; transform: translateY(14px); transition: opacity 0.4s ease, transform 0.5s ease; pointer-events: none; }
        .trp-panel.is-on .trp-panel-body { opacity: 1; transform: none; transition-delay: 0.25s; pointer-events: auto; }
        .trp-panel-tag { margin: 0; font-size: 12.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--c); }
        .trp-panel-body h3 { margin: 16px 0 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(28px, 2.6vw, 42px); line-height: 1.1; letter-spacing: -0.02em; color: #fff; max-width: 16em; text-wrap: balance; }
        .trp-panel-body p:last-child { margin: 16px 0 0; font-size: 16.5px; line-height: 1.7; color: rgba(255,255,255,0.7); max-width: 52ch; }
        .trp-panel-bar { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: var(--c); opacity: 0.35; transition: opacity 0.4s ease; }
        .trp-panel.is-on .trp-panel-bar { opacity: 1; }

        /* why attend */
        .trp-why { position: relative; overflow: hidden; background: ${INK}; padding: clamp(88px, 10vw, 150px) 0; }
        .trp-why-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; }
        .trp-why-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(11,14,19,0.94) 0%, rgba(11,14,19,0.82) 45%, rgba(11,14,19,0.3) 100%); }
        .trp-why-copy { max-width: 760px; }
        .trp-why-text { margin: 0; font-family: ${SERIF}; font-weight: 300; font-size: clamp(21px, 1.85vw, 28px); line-height: 1.42; letter-spacing: -0.01em; color: #fff; text-wrap: pretty; }

        /* agenda */
        .trp-agenda-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }


        .trp-agenda { list-style: none; margin: clamp(28px, 3vw, 40px) 0 0; padding: 0; border-top: 1px solid ${LINE}; }
        .trp-slot { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: clamp(16px, 2.6vw, 44px); padding: clamp(16px, 1.6vw, 22px) 0; border-bottom: 1px solid ${LINE}; }
        .trp-slot-time { display: flex; flex-direction: column; gap: 4px; padding-top: 2px; }
        .trp-slot-start { font-family: ${SERIF}; font-size: clamp(24px, 2vw, 30px); line-height: 1; letter-spacing: -0.015em; color: ${TEXT}; font-variant-numeric: lining-nums tabular-nums; }
        .trp-slot-range { font-size: 12px; color: ${MUTED}; }
        .trp-slot-kind { margin: 0; font-size: 11.5px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: ${NAVY}; }
        .trp-slot.is-discuss .trp-slot-kind, .trp-slot.is-demo .trp-slot-kind { color: ${EMBER_DEEP}; }
        .trp-slot h3 { margin: 6px 0 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(20px, 1.6vw, 25px); line-height: 1.2; letter-spacing: -0.012em; color: ${TEXT}; text-wrap: balance; }
        .trp-slot-text { margin: 6px 0 0; font-size: 15.5px; line-height: 1.6; color: ${SLATE}; max-width: 78ch; }
        /* breaks read as a single quiet line */
        .trp-slot.is-pause { padding: 12px 0; align-items: baseline; }
        .trp-slot.is-pause .trp-slot-start { font-size: clamp(20px, 1.6vw, 24px); color: ${MUTED}; }
        .trp-slot.is-pause .trp-slot-range { display: none; }
        .trp-slot.is-pause .trp-slot-body { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 14px; }
        .trp-slot.is-pause .trp-slot-kind { color: ${SLATE}; }
        .trp-slot.is-pause .trp-slot-text { margin: 0; font-size: 14.5px; color: ${MUTED}; }
        .trp-slot-stages { list-style: none; margin: 14px 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
        .trp-slot-stages li { padding: 12px 14px 14px; border-radius: 12px; background: ${MIST}; border-top: 3px solid var(--c); font-size: 14px; line-height: 1.5; color: ${TEXT}; }
        .trp-slot-stages span { display: block; margin-bottom: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--c); }

        /* about */
        .trp-about { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr); gap: clamp(32px, 6vw, 96px); align-items: center; }
        .trp-about-lead { margin: 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(22px, 1.9vw, 30px); line-height: 1.4; letter-spacing: -0.01em; color: ${TEXT}; }
        .trp-about-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(20px, 2.6vw, 40px); margin-top: 28px; }
        .trp-about-img { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 4 / 5; box-shadow: 0 30px 70px rgba(11,14,19,0.18); }
        .trp-about-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .trp-about-dots { position: absolute; left: 20px; bottom: 20px; display: grid; grid-template-columns: repeat(3, 12px); gap: 8px; padding: 14px; border-radius: 12px; background: rgba(255,255,255,0.94); }
        .trp-about-dots i { width: 12px; height: 12px; border-radius: 50%; }

        /* register */
        .trp-reg-sec { overflow: hidden; }
        .trp-reg-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 50% 60% at 0% 0%, rgba(14,50,108,0.7), transparent 70%), radial-gradient(ellipse 40% 50% at 100% 100%, rgba(255,78,19,0.14), transparent 70%); }
        .trp-reg { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(36px, 6vw, 90px); align-items: center; }
        .trp-count { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); max-width: 480px; border-top: 1px solid ${LINE_DARK}; border-bottom: 1px solid ${LINE_DARK}; }
        .trp-count > div { padding: 18px 4px 16px; }
        .trp-count > div + div { border-left: 1px solid ${LINE_DARK}; padding-left: 16px; }
        .trp-count span { display: block; font-family: ${SERIF}; font-size: clamp(36px, 3.2vw, 50px); font-weight: 300; line-height: 1; color: #fff; font-variant-numeric: lining-nums tabular-nums; }
        .trp-count small { display: block; margin-top: 10px; font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .trp-form-card { padding: clamp(26px, 2.8vw, 40px); border-radius: 22px; background: ${PAPER}; box-shadow: 0 40px 90px rgba(0,0,0,0.4); }
        .trp-form-title { margin: 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(26px, 2vw, 32px); letter-spacing: -0.015em; color: ${TEXT}; }
        .trp-form label { font-family: ${MONO}; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: ${SLATE}; }
        .trp-form input, .trp-form select { width: 100%; padding: 12px 14px; margin-top: 6px; background: ${MIST}; border: 1px solid rgba(14,50,108,0.14); border-radius: 10px; font-family: ${SANS}; font-size: 16px; color: ${TEXT}; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease; }
        .trp-form input::placeholder { color: rgba(74,82,98,0.55); }
        .trp-form input:focus, .trp-form select:focus { border-color: ${EMBER}; box-shadow: 0 0 0 3px rgba(255,78,19,0.16); background: #fff; }
        .trp-form > .trp-field, .trp-form .trp-form-row { margin-top: 16px; }
        .trp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .trp-footer { background: #07090C; padding: clamp(36px, 5vh, 54px) 0; border-top: 1px solid ${LINE_DARK}; }

        @media (max-width: 1080px) {
          .trp-hero-inner { grid-template-columns: 1fr; }
          .trp-hero-visual { position: absolute; z-index: -1; right: -12%; top: 50%; transform: translateY(-50%); width: min(78vw, 560px); max-width: none; opacity: 0.32; pointer-events: none; }
          .trp-hero-visual .trp-radar-head, .trp-hero-visual .trp-radar-legend, .trp-hero-visual .trp-bracket { display: none; }
          .trp-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .trp-fact:nth-child(3) { border-left: none; padding-left: 0; }
          .trp-fact:nth-child(n+3) { border-top: 1px solid ${LINE_DARK}; }
          .trp-overview-cols { grid-template-columns: 1fr; gap: 28px; }
        }
        @media (max-width: 960px) {
          .trp-nav-links { display: none; }
          .trp-slot { grid-template-columns: 1fr; gap: 6px; }
          .trp-slot-time { flex-direction: row; align-items: baseline; gap: 10px; }
          .trp-slot-stages { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .trp-chal, .trp-about, .trp-reg { grid-template-columns: 1fr; }
          .trp-chal-head { position: static; }
          .trp-chal-img { height: 220px; min-height: 0; }
          .trp-obj-img { width: 100%; opacity: 0.22; mask-image: none; -webkit-mask-image: none; }
          .trp-chal-card { position: relative; top: auto !important; min-height: 0; }
          .trp-panels { flex-direction: column; height: auto; }
          .trp-panel, .trp-panel.is-on { flex: none; background: linear-gradient(160deg, color-mix(in srgb, var(--c) 14%, ${INK_2}) 0%, ${INK_2} 70%); }
          .trp-panel-btn { display: none; }
          .trp-panel-body, .trp-panel.is-on .trp-panel-body { position: relative; opacity: 1; transform: none; pointer-events: auto; }
          .trp-panel-bar { opacity: 1; }
          .trp-about-img { aspect-ratio: 16 / 10; }
          .trp-why-shade { background: linear-gradient(180deg, rgba(11,14,19,0.82), rgba(11,14,19,0.9)); }
        }
        @media (max-width: 640px) {
          /* globals.css resets every <section> padding below 640px; the hero has to clear the floating nav. */
          section.trp-hero { padding-top: 92px !important; padding-bottom: 0 !important; }
          .trp-hero-visual { right: -58%; top: 44%; width: 100vw; opacity: 0.2; }
          .trp-fact dd { font-size: 14.5px; }
          .trp-label { font-size: 11px; letter-spacing: 0.12em; }
          .trp-hero-ctas { gap: 10px; }
          .trp-overview-lead { font-size: 20px; line-height: 1.42; }
          .trp-overview-cols { margin-top: 32px; gap: 22px; }
          .trp-obj-old span { font-size: clamp(30px, 9.6vw, 40px); }
          .trp-obj-old i { height: 3px; }
          .trp-obj-from { font-size: 16px; }
          .trp-chal-card { padding: 24px 22px; border-radius: 16px; }
          .trp-chal-card h3 { font-size: 23px; margin-top: 18px; }
          .trp-chal-card p, .trp-panel-body p:last-child { font-size: 15.5px; }
          .trp-chal-stack { gap: 14px; }
          .trp-panels { gap: 10px; margin-top: 32px; }
          .trp-panel { border-radius: 16px; }
          .trp-panel-body { padding: 24px 22px; }
          .trp-panel-body h3 { font-size: 25px; }
          .trp-why-text { font-size: 19px; line-height: 1.5; }
          .trp-about-lead { font-size: 19px; }
          .trp-form-card { padding: 22px 18px; border-radius: 18px; }
          .trp-count span { font-size: 32px; }
          .trp-fact dt { font-size: 10.5px; }
          .trp-hero-ctas .trp-btn { padding: 12px 16px; font-size: 14px; }
          section.trp-why { padding-top: 88px !important; padding-bottom: 88px !important; }
          .trp-nav { top: 10px; }
          .trp-nav-bar { height: 56px; padding-left: 16px; }
          .trp-fact { padding: 12px 10px 14px 0; }
          .trp-fact:nth-child(even) { padding-left: 14px; }
          .trp-fact small { display: none; }
          .trp-fact small.trp-keep { display: block; font-size: 12px; }
          .trp-about-cols, .trp-form-row { grid-template-columns: 1fr; }
          .trp-count > div + div { padding-left: 10px; }
          .trp-hero-stages { gap: 6px; }
          .trp-hero-stages li { padding: 5px 9px; font-size: 10px; letter-spacing: 0.06em; gap: 6px; }
          .trp-obj-new li { font-size: 25px; }
          .trp-radar-legend { gap: 8px 14px; }
        }
        @media (max-width: 400px) {
          .trp-hero-stages { gap: 4px; }
          .trp-hero-stages li { padding: 5px 7px; font-size: 9.5px; letter-spacing: 0.04em; gap: 5px; }
          .trp-hero-stages i { width: 6px; height: 6px; }
        }
        @media (max-width: 640px) and (max-height: 700px) {
          section.trp-hero { padding-top: 84px !important; }
          .trp-h1 { font-size: 34px; }
          .trp-hero-lede { font-size: 15px; line-height: 1.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          .trp-live { animation: none; }
          .trp-btn, .trp-panel, .trp-panel-body { transition: none; }
        }
      `}</style>
      <Nav />
      <Hero />
      <Overview />
      <Objective />
      <Challenges />
      <Takeaways />
      <WhyAttend />
      <Agenda />
      <About />
      <Register />
      <Footer />
    </main>
  );
}
