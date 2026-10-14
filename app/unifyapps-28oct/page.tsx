"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { submitForm, isWorkEmail, validatePhone, COUNTRY_CODES, type CountryCode } from "@/lib/form-helpers";

// ─── Brand tokens (sampled from UnifyApps' own event pages) ─────────────────────
const SAND = "#F5F1E9";
const SAND_DEEP = "#ECE4D5";
const PAPER = "#FBF9F4";
const INK = "#16301B";
const INK_SOFT = "#4D5B4B";
const GOLD = "#81652F";
const GOLD_SOFT = "#B8975A";
const LINE = "rgba(22,48,27,0.12)";
const SERIF = "var(--font-spectral), Georgia, serif";
const SANS = "var(--font-ua-inter), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/heros/b2.png";
// The logo file is a 1890×1063 transparent canvas with the mark in the box
// below; <Logo> crops to that box so it can be sized like a normal wordmark.
const LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/unifyapps.png";
const LOGO_CANVAS = { w: 1890, h: 1063 };
const LOGO_BOX = { x: 442, y: 347, w: 1076, h: 285 };

const EVENT_START_ISO = "2026-10-28T15:30:00+04:00";
const VENUE_MAP_URL = "https://www.google.com/maps/search/?api=1&query=Five+Iron+Golf+The+Westin+Dubai+Marina";

// ─── Content (verbatim from the UnifyApps event page) ───────────────────────────
const SPEAKERS = {
  ramzi: {
    name: "Ramzi Touma",
    role: "Regional Industry Lead, UnifyApps",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/ramzi-touma.jpeg",
    linkedin: "https://www.linkedin.com/in/ramzi-touma-77796213/",
  },
  paul: {
    name: "Paul Poliwoda",
    role: "Principal Solutions Consultant, Dell Technologies",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/paul-poliwoda.jpg",
    linkedin: "https://www.linkedin.com/in/paulpoliwoda/",
  },
  ahmed: {
    name: "Ahmed Sadek",
    role: "Solution Architects Manager, UnifyApps",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/ahmed-sadek-airlines.jpg",
    linkedin: "https://www.linkedin.com/in/ahmedsadek/",
  },
} as const;
type SpeakerKey = keyof typeof SPEAKERS;
const SPEAKER_ORDER: SpeakerKey[] = ["ramzi", "paul", "ahmed"];

const AUDIENCE = [
  "CIOs, CTOs, and CDOs",
  "Chief AI Officers and Heads of AI",
  "VPs of IT and Digital Transformation",
  "VPs of Enterprise Architecture and Platforms",
  "GMs of IT",
  "Senior technology and data leaders across the airlines, ports, energy, and contracting sectors",
];

const REASONS = [
  {
    title: "Scale Beyond Pilots",
    body: "Learn how leadership in these industries must evolve as AI moves from isolated tests to mission-critical, enterprise-wide deployment.",
    icon: "M3 17l6-6 4 4 8-8M15 7h6v6",
  },
  {
    title: "Stop Rebuilding Systems",
    body: "Master operating models that scale AI across organizations in these industries seamlessly, eliminating redundant, use-case-specific builds.",
    icon: "M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5",
  },
  {
    title: "Build an Enterprise Brain",
    body: "Get the architectural blueprints to replace disconnected silos with a single, secure, and unified AI ecosystem.",
    icon: "M12 5a3 3 0 100 6 3 3 0 000-6zM5 16a3 3 0 100 6 3 3 0 000-6zM19 16a3 3 0 100 6 3 3 0 000-6zM10.5 10.5L6.5 16.5M13.5 10.5l4 6M8 19h8",
  },
  {
    title: "Master Governance & Sovereignty",
    body: "Acquire practical frameworks built for the realities of the mandates in these industries and strict data sovereignty.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  },
];

const AGENDA: { time: string; title: string; desc?: string; speakers?: SpeakerKey[]; quiet?: boolean }[] = [
  { time: "3:30 – 4:00 PM", title: "Registration & Networking", quiet: true },
  { time: "4:00 – 4:15 PM", title: "Welcome Remarks", desc: "Coffee, introductions, and welcome for arriving delegates." },
  { time: "4:15 – 4:30 PM", title: "Attendee Introductions & Icebreaker" },
  { time: "4:30 – 4:50 PM", title: "UnifyApps Presentation", desc: "The Agentic Shift - Beyond the Model.", speakers: ["ramzi"] },
  { time: "4:50 – 5:10 PM", title: "Executive Discussion with Q&A", speakers: ["ramzi", "paul"] },
  { time: "5:10 – 5:30 PM", title: "AI in Action & Closing Remarks", desc: "Connecting Systems, Context, Governance, Workflows, Agents & People Across Aviation & Ports Use Cases.", speakers: ["ahmed"] },
  { time: "5:30 – 7:30 PM", title: "Dinner & Networking", desc: "Games, drinks, and networking.", quiet: true },
];

// ─── Small pieces ───────────────────────────────────────────────────────────────
function Logo({ height, onDark = false }: { height: number; onDark?: boolean }) {
  const k = height / LOGO_BOX.h;
  return (
    <span aria-label="UnifyApps" role="img" style={{ display: "inline-block", position: "relative", overflow: "hidden", width: LOGO_BOX.w * k, height, flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO} alt="" style={{ position: "absolute", maxWidth: "none", width: LOGO_CANVAS.w * k, height: LOGO_CANVAS.h * k, left: -LOGO_BOX.x * k, top: -LOGO_BOX.y * k, filter: onDark ? "brightness(2.1) saturate(0.85)" : undefined }} />
    </span>
  );
}

function Reveal({ children, delay = 0, style, className }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: SERIF, fontSize: "clamp(11.5px,0.75vw,13px)", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, margin: 0 }}>{children}</p>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number; duration?: number }) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.1 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="ua-ghost">
      {children}
    </button>
  );
}

function SolidButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="ua-solid">
      {children}
    </button>
  );
}

// ─── NAV (UnifyApps only; EFG sits in the footer) ───────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(245,241,233,0.88)" : "rgba(245,241,233,0)",
        backdropFilter: scrolled ? "blur(14px) saturate(1.2)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.2)" : "none",
        borderBottom: `1px solid ${scrolled ? LINE : "transparent"}`,
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
    >
      <div className="ua-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollToId("top"); }} aria-label="UnifyApps — back to top" style={{ display: "inline-flex" }}>
          <span className="ua-nav-logo"><Logo height={36} /></span>
        </a>
        <GhostButton onClick={() => scrollToId("register")}>Register now</GhostButton>
      </div>
    </header>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="top" style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", overflow: "hidden", background: SAND }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_IMAGE} alt="Dubai skyline at golden hour" className="ua-hero-img" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "70% 40%" }} />
      <div aria-hidden className="ua-hero-wash" style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${SAND} 0%, rgba(245,241,233,0.82) 34%, rgba(245,241,233,0) 62%)` }} />
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 220, background: `linear-gradient(180deg, rgba(245,241,233,0) 0%, ${SAND} 100%)` }} />

      <div className="ua-wrap" style={{ position: "relative", zIndex: 1, flex: 1, width: "100%", display: "flex", flexDirection: "column", paddingTop: 96, paddingBottom: "clamp(28px,5vh,56px)" }}>
        <div style={{ maxWidth: 780, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <p className="ua-hero-eyebrow">Executive Boardroom — Airlines, Ports, Energy, &amp; Contracting</p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(40px,5.2vw,92px)", lineHeight: 1.02, letterSpacing: "-0.02em", color: INK, margin: "20px 0 0", textWrap: "balance" }}
          >
            Building <span style={{ fontStyle: "italic", fontWeight: 500, color: GOLD, whiteSpace: "nowrap" }}>AI-Native</span><br /><span style={{ fontStyle: "italic", fontWeight: 500, color: GOLD }}>Organizations</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: EASE }} style={{ marginTop: "clamp(24px,3.5vh,40px)" }}>
            <SolidButton onClick={() => scrollToId("register")}>Reserve Your Seat</SolidButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          className="ua-facts"
          style={{ marginTop: "clamp(24px,4vh,48px)", display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 18, background: "rgba(251,249,244,0.72)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 24px 60px rgba(70,52,20,0.10), inset 0 1px 0 rgba(255,255,255,0.8)" }}
        >
          <div className="ua-fact">
            <Eyebrow>Date</Eyebrow>
            <p className="ua-fact-main">Wednesday, 28 October 2026</p>
            <p className="ua-fact-sub">3:30 PM – 7:30 PM</p>
          </div>
          <div className="ua-fact ua-fact-split">
            <Eyebrow>Venue</Eyebrow>
            <p className="ua-fact-main">
              <a href={VENUE_MAP_URL} target="_blank" rel="noopener noreferrer" className="ua-link">Five Iron Golf, The Westin Dubai Marina</a>, Dubai, UAE
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── OVERVIEW ───────────────────────────────────────────────────────────────────
function Overview() {
  return (
    <section style={{ background: SAND, padding: "clamp(44px,5.5vw,76px) 0" }}>
      <div className="ua-wrap ua-two" style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: "clamp(32px,5vw,72px)", alignItems: "start" }}>
        <Reveal>
          <h2 className="ua-h2">AI Ambition to <span style={{ fontStyle: "italic", fontWeight: 500, color: GOLD }}>Execution</span></h2>
          <p className="ua-body" style={{ marginTop: 20 }}>
            Hosted by <em style={{ color: INK, fontWeight: 500 }}>UnifyApps</em>, this exclusive boardroom brings together senior leaders from across the airlines, ports, energy, and contracting sectors for a candid, peer-level conversation on what it takes to move AI from ambition and isolated pilots into real-world operations.
          </p>
          <p className="ua-body" style={{ marginTop: 20 }}>
            In industries defined by complex infrastructure, interconnected systems, mission-critical operations, and stringent safety and regulatory requirements, the discussion will explore how organizations can operationalize AI securely and at scale, with a live look at how AI can connect systems, data, workflows, and people to transform operations.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <dl style={{ margin: 0, borderTop: `1px solid ${LINE}` }}>
            {[
              { k: "Date", v: "Wednesday, 28 October 2026" },
              { k: "Time", v: "3:30 PM – 7:30 PM" },
              { k: "Venue", v: "Five Iron Golf, The Westin Dubai Marina" },
            ].map((row) => (
              <div key={row.k} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "15px 0", borderBottom: `1px solid ${LINE}` }}>
                <dt><Eyebrow>{row.k}</Eyebrow></dt>
                <dd style={{ margin: 0, fontFamily: SERIF, fontSize: "clamp(17px,1.2vw,21px)", fontWeight: 500, color: INK, lineHeight: 1.35 }}>{row.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

// ─── WHO SHOULD ATTEND ──────────────────────────────────────────────────────────
function Audience() {
  return (
    <section style={{ background: SAND_DEEP, padding: "clamp(44px,5.5vw,76px) 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", right: "-12%", top: "-30%", width: 620, height: 620, borderRadius: "50%", background: `radial-gradient(circle, rgba(184,151,90,0.20), transparent 65%)` }} />
      <div className="ua-wrap ua-two" style={{ position: "relative", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "clamp(32px,5vw,72px)", alignItems: "start" }}>
        <Reveal>
          <h2 className="ua-h2">Who Should <span style={{ fontStyle: "italic", fontWeight: 500, color: GOLD }}>Attend?</span></h2>
        </Reveal>
        <Reveal delay={0.1}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: `1px solid ${LINE}` }}>
            {AUDIENCE.map((a) => (
              <li key={a} style={{ display: "flex", gap: 18, alignItems: "baseline", padding: "12px 0", borderBottom: `1px solid ${LINE}`, fontFamily: SERIF, fontSize: "clamp(16px,1.2vw,20px)", color: INK, lineHeight: 1.4 }}>
                <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD_SOFT, flexShrink: 0, transform: "translateY(-3px)" }} />
                {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// ─── WHY JOIN ───────────────────────────────────────────────────────────────────
function Reasons() {
  return (
    <section style={{ background: SAND, padding: "clamp(44px,5.5vw,76px) 0" }}>
      <div className="ua-wrap">
        <Reveal style={{ maxWidth: 860 }}>
          <h2 className="ua-h2">Why Do Senior Leaders Join This Room?</h2>
          <p className="ua-body" style={{ marginTop: 14 }}>A candid, peer-level session focused on moving AI beyond isolated pilots and into secure, mission-critical operations.</p>
        </Reveal>
        <Reveal delay={0.1} className="ua-reasons" style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", borderRadius: 20, border: `1px solid ${LINE}`, background: PAPER, overflow: "hidden" }}>
          {REASONS.map((r, i) => (
            <div key={r.title} className="ua-reason" data-i={i} style={{ padding: "clamp(22px,2.4vw,30px)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(145deg, #F3EAD8, #E6D8BC)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 12px rgba(129,101,47,0.12)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={r.icon} /></svg>
              </span>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(19px,1.3vw,23px)", fontWeight: 600, color: INK, margin: "16px 0 0", letterSpacing: "-0.01em" }}>{r.title}</h3>
              <p className="ua-body" style={{ marginTop: 8, fontSize: "clamp(15px,0.95vw,17px)" }}>{r.body}</p>
            </div>
          ))}
        </Reveal>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
          <SolidButton onClick={() => scrollToId("register")}>Register Now</SolidButton>
        </div>
      </div>
    </section>
  );
}

// ─── AGENDA ─────────────────────────────────────────────────────────────────────
function Agenda() {
  return (
    <section id="agenda" style={{ background: `linear-gradient(180deg, ${SAND} 0%, ${SAND_DEEP} 100%)`, padding: "clamp(44px,5.5vw,76px) 0" }}>
      <div className="ua-wrap">
        <Reveal>
          <Eyebrow>Agenda</Eyebrow>
          <h2 className="ua-h2" style={{ marginTop: 10 }}>Wednesday, 28 October</h2>
        </Reveal>
        <div style={{ marginTop: 28, borderTop: `1px solid ${LINE}` }}>
          {AGENDA.map((row, i) => (
            <Reveal key={row.time} delay={Math.min(i * 0.04, 0.2)}>
              <div className="ua-agenda-row" style={{ display: "grid", gridTemplateColumns: "clamp(150px,13vw,210px) 1fr clamp(280px,24vw,360px)", gap: 24, padding: row.quiet ? "14px 0" : "18px 0", borderBottom: `1px solid ${LINE}` }}>
                <p style={{ margin: 0, fontFamily: SERIF, fontSize: "clamp(16px,1.1vw,19px)", fontWeight: 500, color: GOLD, fontVariantNumeric: "tabular-nums", lineHeight: 1.3 }}>{row.time}</p>
                <div>
                  <h3 style={{ margin: 0, fontFamily: SERIF, fontSize: "clamp(17px,1.2vw,21px)", fontWeight: 600, color: INK, lineHeight: 1.3 }}>{row.title}</h3>
                  {row.desc && <p className="ua-body" style={{ marginTop: 5, fontSize: "clamp(15px,0.95vw,17px)" }}>{row.desc}</p>}
                </div>
                <div className="ua-agenda-people" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {row.speakers?.map((k) => {
                    const s = SPEAKERS[k];
                    return (
                      <div key={k} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.photo} alt={s.name} style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 6px 18px rgba(70,52,20,0.14)" }} />
                        <div>
                          <p style={{ margin: 0, fontFamily: SERIF, fontSize: "clamp(15px,1vw,17px)", fontWeight: 600, color: INK }}>{s.name}</p>
                          <p style={{ margin: "2px 0 0", fontFamily: SERIF, fontSize: "clamp(13.5px,0.9vw,15.5px)", color: INK_SOFT, lineHeight: 1.45 }}>{s.role}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SPEAKERS ───────────────────────────────────────────────────────────────────
function Speakers() {
  return (
    <section id="speakers" style={{ background: SAND_DEEP, padding: "clamp(44px,5.5vw,76px) 0" }}>
      <div className="ua-wrap">
        <Reveal style={{ textAlign: "center" }}>
          <Eyebrow>Speakers</Eyebrow>
          <h2 className="ua-h2" style={{ marginTop: 10 }}>In the <span style={{ fontStyle: "italic", fontWeight: 500, color: GOLD }}>Room</span></h2>
        </Reveal>
        <div className="ua-speakers" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, clamp(240px,20vw,320px)))", gap: 24, justifyContent: "center" }}>
          {SPEAKER_ORDER.map((k, i) => {
            const s = SPEAKERS[k];
            return (
              <Reveal key={k} delay={i * 0.08}>
                <article className="ua-speaker" style={{ borderRadius: 20, overflow: "hidden", background: PAPER, border: `1px solid ${LINE}`, boxShadow: "0 18px 44px rgba(70,52,20,0.08)" }}>
                  <div style={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.photo} alt={s.name} className="ua-speaker-img" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", display: "block" }} />
                    {/* Warm wash ties three different studio backdrops together */}
                    <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(245,241,233,0) 55%, rgba(129,101,47,0.28) 100%)", mixBlendMode: "multiply" }} />
                    <a href={s.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} on LinkedIn`} className="ua-li">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
                    </a>
                  </div>
                  <div style={{ padding: "14px 16px 16px" }}>
                    <h3 style={{ margin: 0, fontFamily: SERIF, fontSize: "clamp(18px,1.25vw,22px)", fontWeight: 600, color: INK }}>{s.name}</h3>
                    <p style={{ margin: "3px 0 0", fontFamily: SERIF, fontSize: "clamp(14px,0.95vw,16.5px)", color: INK_SOFT, lineHeight: 1.45 }}>{s.role}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── COUNTDOWN ──────────────────────────────────────────────────────────────────
function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(EVENT_START_ISO).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);
  const parts = left === null
    ? null
    : [Math.floor(left / 86400000), Math.floor((left % 86400000) / 3600000), Math.floor((left % 3600000) / 60000), Math.floor((left % 60000) / 1000)];
  const labels = ["Days", "Hours", "Minutes", "Seconds"];
  return (
    <div className="ua-count" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {labels.map((l, i) => (
        <div key={l} style={{ textAlign: "center", padding: "12px 6px", borderRadius: 12, background: "rgba(251,249,244,0.7)", border: `1px solid ${LINE}` }}>
          <p style={{ margin: 0, fontFamily: SERIF, fontSize: "clamp(24px,2.4vw,32px)", fontWeight: 500, color: INK, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {parts ? String(parts[i]).padStart(2, "0") : "--"}
          </p>
          <p style={{ margin: "10px 0 0", fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD }}>{l}</p>
        </div>
      ))}
    </div>
  );
}

// ─── REGISTER ───────────────────────────────────────────────────────────────────
const EMPTY = { firstName: "", lastName: "", email: "", company: "", jobTitle: "", phone: "" };

function Field({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div className="ua-field">
      <label>{label}{req && <span style={{ color: GOLD }}> *</span>}</label>
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
      event_name: "UnifyApps Executive Boardroom — Airlines, Ports, Energy & Contracting · 28 October 2026 (Dubai)",
      metadata: { "Event Page": "UnifyApps Executive Boardroom · Airlines, Ports, Energy & Contracting" },
    });
    setLoading(false);
    if (res.success) { setDone(true); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else setErr(res.error || "Something went wrong. Please try again.");
  };

  return (
    <div ref={topRef} style={{ padding: "clamp(20px,2.4vw,28px)", borderRadius: 18, background: PAPER, border: `1px solid ${LINE}`, boxShadow: "0 30px 80px rgba(70,52,20,0.12), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
      {done ? (
        <div style={{ textAlign: "center", padding: "28px 0" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 58, height: 58, borderRadius: "50%", background: INK, marginBottom: 20 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={SAND} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: INK, margin: 0 }}>Request received.</h3>
          <p className="ua-body" style={{ margin: "12px auto 0", maxWidth: 420, fontSize: 16.5 }}>Thank you. Seating is confirmed on an individual basis, and our team will be in touch with the final details.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="ua-form" noValidate>
          <h3 style={{ fontFamily: SERIF, fontSize: "clamp(21px,1.4vw,26px)", fontWeight: 600, color: INK, margin: 0 }}>Register Here</h3>
          <div className="ua-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="First name" req><input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First name" autoComplete="given-name" suppressHydrationWarning /></Field>
            <Field label="Last name" req><input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last name" autoComplete="family-name" suppressHydrationWarning /></Field>
          </div>
          <Field label="Work email" req><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" autoComplete="email" suppressHydrationWarning /></Field>
          <div className="ua-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Company" req><input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company" autoComplete="organization" suppressHydrationWarning /></Field>
            <Field label="Job title" req><input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="Job title" autoComplete="organization-title" suppressHydrationWarning /></Field>
          </div>
          <Field label="Phone" req>
            <div className="ua-phone" style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <select value={country.code + country.country} onChange={(e) => { const c = COUNTRY_CODES.find((x) => x.code + x.country === e.target.value); if (c) { setCountry(c); setForm((p) => ({ ...p, phone: p.phone.replace(/\D/g, "").slice(0, c.length) })); } }} aria-label="Country code" suppressHydrationWarning style={{ flex: "0 0 auto", width: 116 }}>
                {COUNTRY_CODES.map((c) => (<option key={c.code + c.country} value={c.code + c.country}>{c.country} {c.code}</option>))}
              </select>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, country.length))} placeholder={country.placeholder} inputMode="numeric" maxLength={country.length} autoComplete="tel-national" suppressHydrationWarning style={{ flex: 1 }} />
            </div>
          </Field>
          {err && <p role="alert" style={{ fontFamily: SANS, fontSize: 13.5, color: "#B3261E", margin: "16px 0 0" }}>{err}</p>}
          <button type="submit" disabled={loading} suppressHydrationWarning className="ua-solid" style={{ width: "100%", marginTop: 18, justifyContent: "center", opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Submitting…" : "Reserve Your Seat"}
          </button>
          <p style={{ fontFamily: SANS, fontSize: 12, color: INK_SOFT, textAlign: "center", margin: "16px 0 0", lineHeight: 1.6 }}>
            By registering you agree to be contacted by Events First Group and UnifyApps about this boardroom.
          </p>
        </form>
      )}
    </div>
  );
}

function Register() {
  return (
    <section id="register" style={{ background: SAND, padding: "clamp(44px,5.5vw,76px) 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", left: "-14%", bottom: "-30%", width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(circle, rgba(184,151,90,0.18), transparent 65%)` }} />
      <div className="ua-wrap ua-two" style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,64px)", alignItems: "start" }}>
        <Reveal>
          <h2 className="ua-h2">Please RSVP to <span style={{ fontStyle: "italic", fontWeight: 500, color: GOLD }}>save your seat</span></h2>
          <p className="ua-body" style={{ marginTop: 14 }}>Seating is limited and confirmed on an individual basis. Register below and our team will be in touch with the final details.</p>
          <div style={{ marginTop: 26 }}><Countdown /></div>
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
    // Deep green ground: the EFG mark has white lettering, and the UnifyApps
    // gold is lifted (see <Logo onDark>) so it holds up here too.
    <footer style={{ background: INK, padding: "clamp(36px,5vh,52px) 0" }}>
      <div className="ua-wrap ua-foot" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Logo height={28} onDark />
          <p style={{ margin: 0, fontFamily: SANS, fontSize: 12, color: "rgba(245,241,233,0.6)" }}>© 2026 UnifyApps. All rights reserved.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,241,233,0.6)" }}>Organised by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/events-first-group_logo_alt.svg" alt="Events First Group" style={{ height: 38, width: "auto", display: "block" }} />
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────────────────────
export default function UnifyApps28OctPage() {
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
    <main style={{ position: "relative", background: SAND, color: INK, overflowX: "hidden", width: "100%", maxWidth: "100%", fontFamily: SERIF }}>
      <style jsx global>{`
        html, body { max-width: 100%; overflow-x: hidden; }
        .ua-hero-eyebrow { font-family: ${SERIF}; font-size: clamp(12px, 0.85vw, 15px); font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: ${GOLD}; margin: 0; }
        .ua-wrap { max-width: 1340px; margin: 0 auto; padding-left: clamp(20px, 5vw, 72px); padding-right: clamp(20px, 5vw, 72px); }
        .ua-h2 { font-family: ${SERIF}; font-weight: 600; font-size: clamp(28px, 2.8vw, 48px); line-height: 1.1; letter-spacing: -0.015em; color: ${INK}; margin: 0; text-wrap: balance; }
        .ua-body { font-family: ${SERIF}; font-size: clamp(16px, 1.05vw, 19px); line-height: 1.65; color: ${INK_SOFT}; margin: 0; max-width: 64ch; }
        .ua-solid, .ua-ghost { display: inline-flex; align-items: center; gap: 10px; font-family: ${SERIF}; font-size: clamp(12px, 0.8vw, 14px); font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease; }
        .ua-solid { padding: clamp(13px, 1vw, 17px) clamp(24px, 1.8vw, 32px); border-radius: 6px; border: none; background: ${INK}; color: ${SAND}; box-shadow: 0 10px 26px rgba(22,48,27,0.22); }
        .ua-solid:hover { background: ${GOLD}; transform: translateY(-1px); }
        .ua-ghost { padding: 11px 20px; border-radius: 6px; border: 1px solid rgba(22,48,27,0.35); background: transparent; color: ${INK}; }
        .ua-ghost:hover { background: ${INK}; color: ${SAND}; }
        .ua-solid:focus-visible, .ua-ghost:focus-visible, .ua-link:focus-visible, .ua-li:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 3px; }
        .ua-link { color: ${INK}; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; transition: color 0.2s ease; }
        .ua-link:hover { color: ${GOLD}; }
        .ua-fact { padding: clamp(18px, 1.8vw, 28px) clamp(22px, 2.2vw, 36px); }
        .ua-fact-split { border-left: 1px solid ${LINE}; }
        .ua-fact-main { font-family: ${SERIF}; font-size: clamp(17px, 1.3vw, 23px); font-weight: 500; color: ${INK}; margin: 8px 0 0; line-height: 1.4; }
        .ua-fact-sub { font-family: ${SERIF}; font-size: clamp(14.5px, 1vw, 17px); color: ${INK_SOFT}; margin: 6px 0 0; }
        .ua-reason:not(:last-child) { border-right: 1px solid ${LINE}; }
        .ua-li { position: absolute; right: 10px; bottom: 10px; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: rgba(251,249,244,0.92); color: ${INK}; box-shadow: 0 6px 16px rgba(0,0,0,0.14); transition: background 0.2s ease, color 0.2s ease; }
        .ua-li:hover { background: ${INK}; color: ${SAND}; }
        .ua-speaker-img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .ua-speaker:hover .ua-speaker-img { transform: scale(1.03); }
        .ua-form label { font-family: ${SANS}; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${INK_SOFT}; }
        .ua-form input, .ua-form select { width: 100%; padding: 10px 12px; margin-top: 6px; background: ${SAND}; border: 1px solid rgba(22,48,27,0.16); border-radius: 10px; font-family: ${SANS}; font-size: 16px; color: ${INK}; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease; }
        .ua-form select, .ua-form .ua-phone input { margin-top: 0; }
        .ua-form input::placeholder { color: rgba(77,91,75,0.6); }
        .ua-form input:focus, .ua-form select:focus { border-color: ${GOLD}; box-shadow: 0 0 0 3px rgba(129,101,47,0.16); background: ${PAPER}; }
        .ua-form > .ua-field, .ua-form .ua-form-row { margin-top: 12px; }
        .ua-form option { background: ${PAPER}; color: ${INK}; }
        @media (max-width: 960px) {
          .ua-two { grid-template-columns: 1fr !important; }
          .ua-agenda-row { grid-template-columns: 1fr !important; gap: 12px !important; }
          .ua-agenda-people:empty { display: none !important; }
          .ua-speakers { grid-template-columns: repeat(2, minmax(0, 260px)) !important; }
          .ua-reasons { grid-template-columns: 1fr 1fr !important; }
          .ua-reason:nth-child(2) { border-right: none !important; }
          .ua-reason:nth-child(-n+2) { border-bottom: 1px solid ${LINE}; }
        }
        @media (max-width: 720px) {
          .ua-facts { grid-template-columns: 1fr !important; }
          .ua-fact-split { border-left: none; border-top: 1px solid ${LINE}; }
          .ua-reasons { grid-template-columns: 1fr !important; }
          .ua-reason { border-right: none !important; border-bottom: 1px solid ${LINE}; }
          .ua-reason:last-child { border-bottom: none; }
          .ua-hero-wash { background: linear-gradient(180deg, rgba(245,241,233,0.92) 0%, rgba(245,241,233,0.78) 45%, rgba(245,241,233,0.35) 75%, rgba(245,241,233,0.6) 100%) !important; }
          .ua-hero-img { object-position: 78% 50% !important; }
        }
        @media (max-width: 600px) {
          .ua-speakers { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 12px !important; }
          .ua-speakers > :last-child:nth-child(odd) { grid-column: 1 / -1; justify-self: center; width: calc(50% - 6px); }
          .ua-form-row { grid-template-columns: 1fr !important; }
          .ua-count { gap: 8px !important; }
          .ua-nav-logo { transform: scale(0.85); transform-origin: left center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ua-speaker-img, .ua-solid, .ua-ghost { transition: none; }
        }
      `}</style>
      <Nav />
      <Hero />
      <Overview />
      <Audience />
      <Reasons />
      <Agenda />
      <Speakers />
      <Register />
      <Footer />
    </main>
  );
}
