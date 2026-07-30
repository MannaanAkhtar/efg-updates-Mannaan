"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

// ─── The Inner Circle — brand tokens (charcoal · red · gold) ──────────────────
const INK = "#100E0C";          // near-black charcoal base
const INK_2 = "#17130F";        // slightly warmer panel
const SURFACE = "rgba(255,255,255,0.028)";
const LINE = "rgba(232,222,206,0.12)";
const LINE_STRONG = "rgba(232,222,206,0.20)";
const RED = "#E14B3A";          // signature accent — "The Art of Knowing"
const RED_SOFT = "#E4695A";
const GOLD = "#C8A25B";         // eyebrows, stats, hairlines
const GOLD_BRIGHT = "#E6C888";
const WHITE = "#F5F0E8";        // warm off-white
const MUTE = "#F5F0E8";         // was 0.64 opacity, flattened to white per request
const DIM = "#F5F0E8";          // was 0.42 opacity, flattened to white per request

const DISPLAY = "var(--font-display), system-ui, sans-serif"; // Plus Jakarta Sans
const BODY = "var(--font-outfit), system-ui, sans-serif";     // Outfit
const ITALIC = "var(--font-dm-sans), Georgia, serif";         // DM Sans italic

const LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/The+Inner+circle+black1+(1).png";
const CT_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/CleverTap_Logotype.png";
const HERO_BG = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/clevertap_innercircle_bg.png";
// Venue — Hilton Riyadh Hotel & Residences (Step Into The Inner Circle band)
const VENUE_BG = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/Hilton+Riyadh+and+residences.png";
const EFG_LOGO = "/events-first-group_logo_alt.svg";
const PRIVACY_URL = "https://clevertap.com/privacy-policy/";

// Preview — Javier Saba, The Mentalist
const MENTALIST_VIDEO = "https://efg-final.s3.eu-north-1.amazonaws.com/clevertap/CleverTap+Mentalist+Video.mp4";
const MENTALIST_IMG = "https://efg-final.s3.eu-north-1.amazonaws.com/clevertap/Javier+Saba%2C+The+Mentalist.jpeg";

// Event: 19 August 2026, Riyadh (UTC+03:00), 4:30 PM onwards — drives the hero countdown.
const EVENT_DATE = "2026-08-19T16:30:00+03:00";

// ─── Content (verbatim from the brief — placeholders kept in [brackets]) ───────
const OVERVIEW_STATS = [
  { num: "90", label: "Minutes" },
  { num: "C-Suite", label: "Leaders Only" },
  { num: "1", label: "Unforgettable Reveal" },
];

const OVERVIEW_P1 =
  "As AI rewrites the rules of customer engagement faster than any playbook can keep up with, Riyadh's most influential growth, marketing, and digital leaders are being asked to make bigger bets with far less certainty. The Inner Circle brings a hand-picked few to a room built for exactly that: direct answers, candid exchange, and a clearer sense of where personalisation, retention, and AI-led engagement are really headed.";
const OVERVIEW_P2 =
  "Presented by CleverTap, The Inner Circle is an invitation to rethink what it truly means to know your customer, and before the evening is through, to experience firsthand just how far that idea can be taken.";

const IN_STORE = [
  { title: "Curated Insight", desc: "A closed-door session unpacking how AI Agents turn personalisation into a true 1:1 discipline, at scale." },
  { title: "High-Trust Exchange", desc: "An intimate, invite-only setting built for candour among Riyadh's most senior decision-makers." },
  { title: "From Segments to Individuals", desc: "See what “knowing your customer” looks like when AI moves from theory into practice." },
  { title: "The Reveal", desc: "The evening closes with an experience that will make you question what “knowing” really means." },
];

const FORMAT_P1 =
  "The Inner Circle unfolds in two parts. The first is a focused, closed-door conversation on the state of AI-led engagement, built for candid exchange among Riyadh's C-suite. The second is something else entirely: a live mentalist experience that turns the evening's central idea, the art of knowing, into something you'll feel, not just discuss.";
const FORMAT_P2 =
  "Two languages of “knowing” (the customer and the mind) held up against each other, in the same room.";

const PREVIEW_P =
  "Before you take your seat, a glimpse of what “knowing” looks like when it has nothing to do with data at all.";

const ATTEND_P =
  "CMOs, CGOs, Heads of Digital, and senior growth leaders shaping how Saudi Arabia's top brands engage their customers.";

const VOICES: { name: string; role: string; initials: string; photo?: string; linkedin?: string }[] = [
  {
    name: "Mohammad Tannous",
    role: "Regional Director, MEA & Turkey, CleverTap",
    initials: "MT",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Tannous.png",
    linkedin: "https://www.linkedin.com/in/mohammadtannous/",
  },
  {
    name: "Suhaib Abu Taleb",
    role: "Business Head, Saudi Arabia, Egypt, Jordan, CleverTap",
    initials: "SA",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Suhaib+Abu+Taleb.png",
    linkedin: "https://www.linkedin.com/in/suhaib-abu-taleb-09718b123/",
  },
  {
    name: "Ahmed Fahmy Mohamed",
    role: "Head of Digital",
    initials: "AF",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Ahmed_Fahmy!.png",
  },
];

const AGENDA: { time: string; title: string; sub?: string }[] = [
  { time: "5:30 PM", title: "Registrations & Red-Carpet Welcome" },
  { time: "6:00 PM", title: "Welcome Note" },
  { time: "6:05 PM", title: "Keynote", sub: "Beyond Automation: How AI Agents Deliver True 1:1 Engagement At Scale" },
  { time: "6:20 PM", title: "Fireside Chat", sub: "Insight-Led, AI-Driven: How Saudi Arabia's Top Brands Are Winning On Retention" },
  { time: "6:40 PM", title: "The Art of Knowing", sub: "A Live Mentalist Experience" },
  { time: "7:10 PM", title: "Closing Remarks" },
  { time: "7:15 PM", title: "Dinner & Networking" },
];

// ─── Reveal helper ─────────────────────────────────────────────────────────────
function rise(inView: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : "translateY(24px)",
    transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  };
}

// ─── Shared eyebrow ────────────────────────────────────────────────────────────
function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, justifyContent: center ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 26, height: 1, background: GOLD }} />
      <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: RED, boxShadow: `0 0 10px ${RED}` }} />
      <span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD }}>
        {children}
      </span>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Overview", id: "overview" },
  { label: "The Format", id: "format" },
  { label: "Speakers", id: "speakers" },
  { label: "Agenda", id: "agenda" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <header
      className="ic-nav"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 60, height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,64px)",
        background: scrolled ? "rgba(16,14,12,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: `1px solid ${scrolled ? LINE : "transparent"}`,
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        aria-label="CleverTap, back to top"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CT_LOGO} alt="CleverTap" style={{ height: 40, width: "auto", filter: "brightness(0) invert(1)" }} />
      </a>

      <nav className="ic-nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(20px,2.4vw,36px)" }}>
        {NAV_LINKS.map((l) => (
          <button key={l.id} onClick={() => go(l.id)} className="ic-nav-link" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: BODY, fontSize: 13.5, fontWeight: 600, letterSpacing: "0.02em", color: MUTE, padding: 0, transition: "color 0.3s ease" }}>{l.label}</button>
        ))}
      </nav>

      <a
        href="#register"
        onClick={(e) => { e.preventDefault(); go("register"); }}
        className="ic-btn ic-nav-cta"
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 999, background: `linear-gradient(135deg, ${RED}, ${RED_SOFT})`, color: "#fff", fontFamily: BODY, fontSize: 13.5, fontWeight: 700, textDecoration: "none", boxShadow: `0 10px 30px ${RED}44, inset 0 1px 0 rgba(255,255,255,0.25)`, whiteSpace: "nowrap" }}
      >
        Request Invite
      </a>
    </header>
  );
}

// ─── COUNTDOWN ─────────────────────────────────────────────────────────────────
function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    setMounted(true);
    const target = new Date(EVENT_DATE).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const s = Math.floor(diff / 1000);
      setT({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const units = [
    { v: t.d, l: "Days" },
    { v: t.h, l: "Hours" },
    { v: t.m, l: "Minutes" },
    { v: t.s, l: "Seconds" },
  ];
  return (
    <div style={{ display: "inline-flex", alignItems: "stretch", gap: "clamp(7px,1.1vw,11px)" }}>
      {units.map((u) => (
        <div key={u.l} style={{ minWidth: "clamp(48px,6vw,66px)", padding: "clamp(7px,0.9vw,11px) clamp(6px,0.9vw,11px)", borderRadius: 12, background: "rgba(16,14,12,0.5)", border: `1px solid ${LINE_STRONG}`, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: "0 14px 34px rgba(0,0,0,0.4)", textAlign: "center" }}>
          <div suppressHydrationWarning style={{ fontFamily: DISPLAY, fontSize: "clamp(20px,2.4vw,30px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums", background: `linear-gradient(160deg, ${GOLD_BRIGHT}, ${GOLD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {mounted ? String(u.v).padStart(2, "0") : "--"}
          </div>
          <div style={{ fontFamily: BODY, fontSize: "clamp(8px,0.75vw,10px)", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTE, marginTop: 6 }}>{u.l}</div>
        </div>
      ))}
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="ic-hero" style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", background: INK, padding: "clamp(76px,9vh,104px) clamp(22px,5vw,80px) clamp(34px,5vh,54px)" }}>
      {/* Background image — slow Ken Burns drift */}
      <div className="ic-hero-bg" aria-hidden style={{ position: "absolute", inset: "-4%", zIndex: 0, backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
      {/* Scrims for legibility */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(16,14,12,0.32) 0%, rgba(16,14,12,0.58) 55%, rgba(16,14,12,0.8) 100%)" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(180deg, rgba(16,14,12,0.7) 0%, transparent 26%, transparent 62%, rgba(16,14,12,0.9) 100%)" }} />
      {/* Warm red haze — breathing */}
      <div className="ic-hero-haze" aria-hidden style={{ position: "absolute", top: "46%", left: "50%", transform: "translate(-50%,-50%)", width: "clamp(320px,44vmin,620px)", height: "clamp(320px,44vmin,620px)", borderRadius: "50%", background: `radial-gradient(circle, ${RED}22 0%, ${RED}08 38%, transparent 66%)`, zIndex: 0, mixBlendMode: "screen", pointerEvents: "none" }} />
      {/* Floating dust motes */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
        {[
          { l: "12%", t: "70%", s: 3, dur: "13s", dl: "0s" },
          { l: "28%", t: "82%", s: 2, dur: "17s", dl: "2s" },
          { l: "44%", t: "76%", s: 4, dur: "15s", dl: "4s" },
          { l: "63%", t: "84%", s: 2.5, dur: "19s", dl: "1s" },
          { l: "78%", t: "72%", s: 3, dur: "14s", dl: "3s" },
          { l: "88%", t: "80%", s: 2, dur: "18s", dl: "5s" },
        ].map((p, i) => (
          <span key={i} className="ic-dust" style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDuration: p.dur, animationDelay: p.dl }} />
        ))}
      </div>
      {/* Slow-rotating light rays */}
      <div className="ic-hero-rays" aria-hidden style={{ position: "absolute", top: "44%", left: "50%", width: "130vmax", height: "130vmax", zIndex: 0, background: `conic-gradient(from 0deg, transparent 0deg, ${GOLD}0d 8deg, transparent 20deg, transparent 170deg, ${RED}0b 182deg, transparent 196deg, transparent 340deg, ${GOLD}0a 350deg, transparent 360deg)`, mixBlendMode: "screen", pointerEvents: "none" }} />

      <div className="ic-hero-inner" style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(8px,1.1vh,14px)" }}>
        {/* The Inner Circle — full lockup logo (CleverTap · Presents · The Inner Circle · The Art of Knowing) */}
        <div className="ic-fade ic-d2" style={{ display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ic-hero-logo" src={LOGO} alt="CleverTap Presents The Inner Circle: The Art of Knowing" style={{ display: "block", height: "clamp(160px,25vw,340px)", width: "auto", maxWidth: "100%", filter: "brightness(0) invert(1) drop-shadow(0 10px 44px rgba(0,0,0,0.55))" }} />
        </div>

        {/* Tagline */}
        <p className="ic-fade ic-d4 ic-tagline" style={{ fontFamily: ITALIC, fontStyle: "italic", fontSize: "clamp(14px,1.4vw,18px)", fontWeight: 400, color: "#F5F0E8", lineHeight: 1.55, margin: "2px auto 0", maxWidth: "none", whiteSpace: "nowrap", textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}>
          An invite-only evening for Riyadh&apos;s senior growth and marketing leaders.
        </p>

        {/* Meta strip */}
        <div className="ic-fade ic-d5 ic-meta ic-meta-shine" style={{ position: "relative", overflow: "hidden", display: "inline-flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "clamp(14px,2vw,26px)", marginTop: 6, padding: "11px clamp(20px,3vw,34px)", borderRadius: 999, background: "rgba(16,14,12,0.5)", border: `1px solid ${LINE_STRONG}`, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: "0 22px 54px rgba(0,0,0,0.5)" }}>
          {["19 August 2026", "Hilton Riyadh & Residences", "4:30 PM Onwards"].map((m, i, arr) => (
            <React.Fragment key={m}>
              <span style={{ fontFamily: BODY, fontSize: "clamp(12px,1.2vw,14.5px)", fontWeight: 600, letterSpacing: "0.04em", color: WHITE, whiteSpace: "nowrap" }}>{m}</span>
              {i < arr.length - 1 && <span aria-hidden style={{ width: 1, height: 15, background: LINE_STRONG }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Countdown */}
        <div className="ic-fade ic-d6" style={{ marginTop: "clamp(6px,1vh,12px)" }}>
          <Countdown />
        </div>

        {/* CTA */}
        <div className="ic-fade ic-d7" style={{ marginTop: "clamp(8px,1.2vh,14px)" }}>
          <a href="#register" onClick={(e) => { e.preventDefault(); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }} className="ic-btn ic-shine" style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 34px", borderRadius: 999, background: `linear-gradient(135deg, ${RED} 0%, ${RED_SOFT} 100%)`, color: "#fff", fontFamily: BODY, fontSize: 14.5, fontWeight: 700, letterSpacing: "0.02em", textDecoration: "none", boxShadow: `0 16px 44px ${RED}55, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
            <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, zIndex: 1 }}>Request Invite <span aria-hidden>→</span></span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── OVERVIEW ──────────────────────────────────────────────────────────────────
function Overview() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const attendRef = useRef<HTMLDivElement>(null);
  const attendInView = useInView(attendRef, { once: true, margin: "-90px" });
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-120px" });
  const [flipped, setFlipped] = useState(false);

  // Hold the logo face for ~1.1s once the card is in view, then auto-flip
  useEffect(() => {
    if (!cardInView) return;
    const t = setTimeout(() => setFlipped(true), 1100);
    return () => clearTimeout(t);
  }, [cardInView]);

  return (
    <section ref={ref} id="overview" style={{ position: "relative", background: INK, borderTop: `1px solid ${LINE}`, padding: "clamp(58px,8vh,100px) clamp(22px,5vw,80px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* Cinematic centered heading */}
        <div style={{ textAlign: "center", maxWidth: 980, margin: "0 auto" }}>
          <div style={{ ...rise(inView, 0), display: "flex", justifyContent: "center" }}><Eyebrow center>Overview</Eyebrow></div>
          <h2 style={{ ...rise(inView, 0.08), fontFamily: DISPLAY, fontSize: "clamp(30px,4.6vw,58px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.05, color: WHITE, margin: "20px auto 0" }}>
            Ninety Minutes. One Room.<br />A Single Idea Worth Knowing.
          </h2>
          <span aria-hidden style={{ ...rise(inView, 0.16), display: "block", width: 64, height: 1, margin: "26px auto 0", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        </div>

        {/* Stats — single full-width row */}
        <div className="ic-stats" style={{ ...rise(inView, 0.2), display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, margin: "clamp(40px,6vh,68px) 0 0", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
          {OVERVIEW_STATS.map((s, i) => (
            <div key={s.label} style={{ padding: "clamp(22px,3vw,34px) 16px", borderLeft: i === 0 ? "none" : `1px solid ${LINE}`, textAlign: "center" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: "clamp(32px,4.2vw,54px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, background: `linear-gradient(160deg, ${GOLD_BRIGHT}, ${GOLD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.num}</div>
              <div style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTE, marginTop: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Flip card — full width below stats */}
        <div ref={cardRef} style={{ ...rise(inView, 0.28), marginTop: "clamp(30px,4.5vh,52px)", maxWidth: 1080, marginLeft: "auto", marginRight: "auto" }}>
          <div
            className="ic-flip"
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped((f) => !f); } }}
            aria-label="Flip card to reveal the overview"
            style={{ perspective: 2000, cursor: "pointer" }}
          >
            <div className={`ic-flip-inner${flipped ? " is-flipped" : ""}`} style={{ display: "grid", transformStyle: "preserve-3d", transition: "transform 1.7s cubic-bezier(0.76,0,0.24,1)", minHeight: "clamp(340px,42vh,430px)" }}>
              {/* FRONT — logo */}
              <div className="ic-face" style={{ gridArea: "1 / 1", position: "relative", borderRadius: 22, overflow: "hidden", border: `1px solid ${LINE_STRONG}`, background: `linear-gradient(160deg, ${INK_2}, ${INK})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, boxShadow: "0 40px 90px rgba(0,0,0,0.5)" }}>
                <span aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)` }} />
                <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 50% 42%, ${RED}1f, transparent 58%)` }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO} alt="The Inner Circle" style={{ position: "relative", height: "clamp(130px,15vw,200px)", width: "auto", maxWidth: "64%", filter: "brightness(0) invert(1) drop-shadow(0 8px 30px rgba(0,0,0,0.5))" }} />
                <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: DIM }}>
                  <span aria-hidden style={{ fontSize: 13 }}>↻</span> Reveal
                </span>
              </div>
              {/* BACK — content */}
              <div className="ic-face ic-face-back" style={{ gridArea: "1 / 1", borderRadius: 22, overflow: "hidden", border: `1px solid ${LINE}`, background: SURFACE, padding: "clamp(28px,4vw,52px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 40px 90px rgba(0,0,0,0.45)" }}>
                <div style={{ maxWidth: 800 }}>
                  <div style={{ marginBottom: 18 }}><Eyebrow>The Invitation</Eyebrow></div>
                  <p style={{ fontFamily: BODY, fontSize: "clamp(15.5px,1.55vw,19px)", lineHeight: 1.76, color: MUTE, margin: 0 }}>{OVERVIEW_P1}</p>
                  <p style={{ fontFamily: BODY, fontSize: "clamp(15.5px,1.55vw,19px)", lineHeight: 1.76, color: "#F5F0E8", margin: "18px 0 0" }}>{OVERVIEW_P2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Who Should Attend — merged into Overview */}
        <div ref={attendRef} style={{ position: "relative", overflow: "hidden", marginTop: "clamp(52px,7vh,84px)", paddingTop: "clamp(44px,5.5vh,68px)", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          {/* Flowing-wave backdrop */}
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 90% at 50% 60%, ${RED}12, transparent 62%)` }} />
            <svg width="100%" height="100%" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
              <defs>
                <linearGradient id="icWaveGold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={GOLD} stopOpacity="0" />
                  <stop offset="50%" stopColor={GOLD_BRIGHT} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="icWaveRed" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={RED} stopOpacity="0" />
                  <stop offset="50%" stopColor={RED_SOFT} stopOpacity="0.45" />
                  <stop offset="100%" stopColor={RED} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="ic-wave ic-wave-1" d="M-100 210 C 240 130, 480 280, 720 210 S 1200 130, 1540 210" fill="none" stroke="url(#icWaveGold)" strokeWidth="1.4" />
              <path className="ic-wave ic-wave-2" d="M-100 250 C 260 180, 520 320, 760 250 S 1240 170, 1540 250" fill="none" stroke="url(#icWaveRed)" strokeWidth="1.2" />
              <path className="ic-wave ic-wave-3" d="M-100 180 C 220 260, 500 110, 740 180 S 1220 260, 1540 180" fill="none" stroke="url(#icWaveGold)" strokeWidth="1" opacity="0.7" />
            </svg>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${INK} 0%, transparent 26%, transparent 74%, ${INK} 100%)` }} />
          </div>

          <div className="ic-attend-grid" style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "clamp(30px,5vw,72px)", alignItems: "center", textAlign: "left" }}>
            <div>
              <div style={rise(attendInView, 0)}><Eyebrow>Who Should Attend</Eyebrow></div>
              <h2 style={{ ...rise(attendInView, 0.08), fontFamily: DISPLAY, fontSize: "clamp(26px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: WHITE, margin: "18px 0 0" }}>
                Built For The Room That Matters.
              </h2>
            </div>
            <div style={{ position: "relative", paddingLeft: "clamp(0px,2vw,28px)" }}>
              <span aria-hidden className="ic-attend-rule" style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 1, background: `linear-gradient(180deg, ${GOLD}66, ${RED}44, transparent)` }} />
              <p style={{ ...rise(attendInView, 0.16), fontFamily: BODY, fontSize: "clamp(16px,1.6vw,19px)", lineHeight: 1.78, color: MUTE, margin: 0 }}>{ATTEND_P}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WHAT'S IN STORE (expanding panels) ────────────────────────────────────────
function InStore() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance every 4.5s; pauses on hover, resets on any manual change
  useEffect(() => {
    if (paused || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % IN_STORE.length), 4500);
    return () => clearTimeout(t);
  }, [active, paused, inView]);

  return (
    <section ref={ref} style={{ position: "relative", background: INK_2, borderTop: `1px solid ${LINE}`, padding: "clamp(64px,9vh,110px) clamp(22px,5vw,80px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ ...rise(inView, 0), textAlign: "center" }}><Eyebrow center>What&apos;s In Store</Eyebrow></div>
        <h2 style={{ ...rise(inView, 0.08), fontFamily: DISPLAY, fontSize: "clamp(26px,4vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: WHITE, margin: "18px auto 10px", textAlign: "center" }}>
          Here&apos;s What The Evening Holds.
        </h2>
        <p style={{ ...rise(inView, 0.12), fontFamily: BODY, fontSize: 13.5, color: DIM, textAlign: "center", margin: "0 auto clamp(28px,4vh,44px)" }}>Click to explore each moment of the evening.</p>

        <div className="ic-store-tabs" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{ ...rise(inView, 0.16), display: "flex", gap: 12, height: "clamp(248px,31vh,300px)" }}>
          {IN_STORE.map((it, i) => {
            const isActive = active === i;
            const climax = i === IN_STORE.length - 1;
            const accent = climax ? RED : GOLD;
            const accentSoft = climax ? RED_SOFT : GOLD_BRIGHT;
            const num = String(i + 1).padStart(2, "0");
            return (
              <div
                key={it.title}
                onClick={() => setActive(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); } }}
                aria-expanded={isActive}
                className={`ic-store-tab${isActive ? " is-active" : ""}`}
                style={{
                  flexGrow: isActive ? 3.4 : 1,
                  flexBasis: 0,
                  minWidth: 0,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 18,
                  background: isActive
                    ? (climax ? "linear-gradient(160deg, rgba(225,75,58,0.12), rgba(23,19,15,0.6))" : "linear-gradient(160deg, rgba(232,222,206,0.05), rgba(23,19,15,0.5))")
                    : SURFACE,
                  border: `1px solid ${isActive ? (climax ? "rgba(225,75,58,0.32)" : "rgba(232,222,206,0.18)") : LINE}`,
                  boxShadow: isActive ? "0 30px 70px rgba(0,0,0,0.45)" : "none",
                  transition: "flex-grow 0.7s cubic-bezier(0.22,1,0.36,1), background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
                }}
              >
                {/* Top hairline */}
                <span aria-hidden style={{ position: "absolute", top: 0, left: isActive ? "5%" : "18%", right: isActive ? "5%" : "18%", height: 1, background: `linear-gradient(90deg, transparent, ${accent}${isActive ? "" : "60"}, transparent)`, transition: "all 0.5s ease" }} />
                {/* Ghost number on active */}
                {isActive && <span aria-hidden style={{ position: "absolute", right: "3%", bottom: "-20px", fontFamily: DISPLAY, fontSize: "clamp(96px,10vw,158px)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", color: accent, opacity: climax ? 0.13 : 0.07, pointerEvents: "none" }}>{num}</span>}
                {climax && isActive && <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 82% 108%, ${RED}22, transparent 55%)`, pointerEvents: "none" }} />}

                {/* Collapsed */}
                <div className="ic-tab-collapsed" style={{ display: isActive ? "none" : "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: "0 8px" }}>
                  <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: accentSoft, opacity: 0.85 }}>{climax ? "Finale" : "Chapter"}</span>
                  <span style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: accent, opacity: 0.5 }}>{num}</span>
                  <span className="ic-tab-ctitle" style={{ fontFamily: BODY, fontSize: 15, fontWeight: 600, color: MUTE, textAlign: "center", lineHeight: 1.35 }}>{it.title}</span>
                </div>

                {/* Expanded */}
                {isActive && (
                  <div className="ic-tab-expanded" style={{ position: "relative", zIndex: 1, height: "100%", width: "clamp(420px,44vw,600px)", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(26px,3vw,44px)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}` }} />
                      <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: accentSoft }}>{climax ? "The Finale" : `Chapter ${num}`}</span>
                    </span>
                    <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(25px,2.9vw,38px)", fontWeight: 700, letterSpacing: "-0.02em", color: WHITE, margin: "14px 0 12px", lineHeight: 1.1 }}>{it.title}</h3>
                    <p style={{ fontFamily: BODY, fontSize: "clamp(16px,1.55vw,20px)", lineHeight: 1.62, color: MUTE, margin: 0, maxWidth: 560 }}>{it.desc}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination — dots double as an auto-advance progress bar */}
        <div style={{ ...rise(inView, 0.18), display: "flex", justifyContent: "center", alignItems: "center", gap: 9, marginTop: "clamp(20px,2.6vh,30px)" }}>
          {IN_STORE.map((it, i) => {
            const on = active === i;
            const acc = i === IN_STORE.length - 1 ? RED : GOLD;
            return (
              <button
                key={it.title}
                onClick={() => setActive(i)}
                aria-label={`Show ${it.title}`}
                aria-current={on}
                style={{ position: "relative", height: 6, width: on ? 34 : 6, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", background: on ? "rgba(232,222,206,0.16)" : "rgba(232,222,206,0.3)", overflow: "hidden", transition: "width 0.5s cubic-bezier(0.22,1,0.36,1), background 0.4s ease" }}
              >
                {on && <span key={active} className="ic-dot-fill" style={{ position: "absolute", inset: 0, background: acc, animation: "icDotFill 4.5s linear forwards", animationPlayState: paused ? "paused" : "running" }} />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── THE FORMAT ──────────────────────────────────────────────────────────────────
function Format() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  return (
    <section ref={ref} id="format" style={{ position: "relative", background: INK, borderTop: `1px solid ${LINE}`, padding: "clamp(64px,9vh,110px) clamp(22px,5vw,80px)" }}>
      <div className="ic-format" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
        <div>
          <div style={rise(inView, 0)}><Eyebrow>The Format</Eyebrow></div>
          <h2 style={{ ...rise(inView, 0.08), fontFamily: DISPLAY, fontSize: "clamp(26px,3.6vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: WHITE, margin: "18px 0 0" }}>
            Where Strategy Meets The Unexpected.
          </h2>
        </div>
        <div style={{ position: "relative", paddingLeft: "clamp(0px,2vw,28px)" }}>
          <span aria-hidden className="ic-format-rule" style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 1, background: `linear-gradient(180deg, ${GOLD}66, ${RED}44, transparent)` }} />
          <p style={{ ...rise(inView, 0.16), fontFamily: BODY, fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.82, color: MUTE, margin: 0 }}>{FORMAT_P1}</p>
          <p style={{ ...rise(inView, 0.24), fontFamily: ITALIC, fontStyle: "italic", fontSize: "clamp(15px,1.5vw,19px)", lineHeight: 1.7, color: "#F5F0E8", margin: "22px 0 0" }}>{FORMAT_P2}</p>
        </div>
      </div>
    </section>
  );
}

// ─── A PREVIEW ────────────────────────────────────────────────────────────────────
function Preview() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  };

  return (
    <section ref={ref} style={{ position: "relative", background: INK_2, borderTop: `1px solid ${LINE}`, padding: "clamp(64px,9vh,110px) clamp(22px,5vw,80px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse 52% 42% at 50% 0%, ${RED}12, transparent 62%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ ...rise(inView, 0), display: "flex", justifyContent: "center" }}><Eyebrow center>A Preview</Eyebrow></div>
        <h2 style={{ ...rise(inView, 0.08), fontFamily: DISPLAY, fontSize: "clamp(26px,4vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: WHITE, margin: "18px auto 0", maxWidth: 720, textAlign: "center" }}>
          The Art of Knowing, Demonstrated.
        </h2>
        <p style={{ ...rise(inView, 0.16), fontFamily: BODY, fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.75, color: MUTE, margin: "20px auto clamp(40px,5vh,58px)", maxWidth: 640, textAlign: "center" }}>{PREVIEW_P}</p>

        {/* Editorial split — content panel (left) · teaser video (right) */}
        <div className="ic-preview-split" style={{ ...rise(inView, 0.24), display: "grid", gridTemplateColumns: "minmax(0, 0.86fr) minmax(0, 1.14fr)", borderRadius: 24, overflow: "hidden", border: `1px solid ${LINE_STRONG}`, background: INK, boxShadow: "0 44px 96px rgba(0,0,0,0.5)" }}>

          {/* LEFT — content panel */}
          <div className="ic-preview-copy" style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(30px,3.4vw,46px)", background: "linear-gradient(160deg, rgba(225,75,58,0.1), rgba(16,14,12,0.4) 55%), radial-gradient(ellipse 90% 60% at 0% 0%, rgba(200,162,91,0.1), transparent 60%)", overflow: "hidden" }}>
            <span aria-hidden className="ic-preview-divider" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 1, background: LINE_STRONG }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: RED, boxShadow: `0 0 10px ${RED}` }} />
              <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: RED_SOFT }}>The Reveal</span>
            </div>
            <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 700, letterSpacing: "-0.025em", color: WHITE, lineHeight: 1.02, margin: 0 }}>Javier Saba</h3>
            <div style={{ fontFamily: ITALIC, fontStyle: "italic", fontSize: "clamp(14px,1.5vw,17px)", color: GOLD_BRIGHT, marginTop: 10, letterSpacing: "0.01em" }}>The Illusionist &amp; Mentalist</div>
            <span aria-hidden style={{ display: "block", width: 46, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${RED}, transparent)`, margin: "22px 0" }} />
            <p style={{ fontFamily: BODY, fontSize: "clamp(14px,1.4vw,16px)", lineHeight: 1.7, color: MUTE, margin: 0, maxWidth: 380 }}>
              The evening closes with an experience that will make you question what “knowing” really means: a live act where the mind becomes the stage.
            </p>
          </div>

          {/* RIGHT — teaser video */}
          <div className="ic-preview-video" style={{ position: "relative", minHeight: 360, background: "#000" }}>
            <video
              ref={videoRef}
              src={MENTALIST_VIDEO}
              poster={MENTALIST_IMG}
              playsInline
              controls={playing}
              preload="metadata"
              onEnded={() => setPlaying(false)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            {!playing && (
              <button onClick={play} aria-label="Play the teaser" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", cursor: "pointer", padding: 0, background: "linear-gradient(150deg, rgba(16,14,12,0.22), rgba(16,14,12,0.5))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span aria-hidden style={{ position: "absolute", top: 20, left: 22, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: RED, boxShadow: `0 0 10px ${RED}` }} />
                  <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: WHITE }}>Watch The Teaser</span>
                </span>
                <span className="ic-teaser-pulse ic-preview-play" style={{ width: 78, height: 78, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(245,240,232,0.12)", border: `1px solid ${LINE_STRONG}`, backdropFilter: "blur(6px)", transition: "background 0.3s ease, transform 0.3s ease, border-color 0.3s ease" }}>
                  <svg width="27" height="27" viewBox="0 0 24 24" fill={WHITE} aria-hidden style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z" /></svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── THE VOICES ────────────────────────────────────────────────────────────────────
function Voices() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  return (
    <section ref={ref} id="speakers" style={{ position: "relative", background: INK_2, borderTop: `1px solid ${LINE}`, padding: "clamp(64px,9vh,110px) clamp(22px,5vw,80px)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ ...rise(inView, 0), textAlign: "center" }}><Eyebrow center>The Voices Behind The Evening</Eyebrow></div>
        <h2 style={{ ...rise(inView, 0.08), fontFamily: DISPLAY, fontSize: "clamp(26px,4vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: WHITE, margin: "18px auto clamp(40px,5vh,56px)", textAlign: "center" }}>
          The Minds Behind The Inner Circle.
        </h2>
        <div className="ic-voices" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 262px))", gap: 22, justifyContent: "center" }}>
          {VOICES.map((v, i) => (
            <article key={i} className="ic-card" style={{ ...rise(inView, 0.14 + i * 0.09), position: "relative", overflow: "hidden", borderRadius: 20, background: SURFACE, border: `1px solid ${LINE}`, transition: "border-color 0.4s ease, transform 0.4s ease" }}>
              <div style={{ position: "relative", aspectRatio: "4 / 5", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(155deg, rgba(225,75,58,0.16), rgba(16,14,12,0.92))`, overflow: "hidden" }}>
                <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 78% -8%, ${GOLD}22, transparent 58%)`, zIndex: 1, pointerEvents: "none" }} />
                {v.photo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.photo} alt={v.name} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                    <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(16,14,12,0.55) 100%)", zIndex: 1 }} />
                  </>
                ) : (
                  <span style={{ position: "relative", zIndex: 2, fontFamily: DISPLAY, fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em", color: "#F5F0E8" }}>{v.initials}</span>
                )}
                {v.linkedin && (
                  <a className="ic-li" href={v.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${v.name} on LinkedIn`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
                  </a>
                )}
              </div>
              <div style={{ padding: "16px 18px" }}>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: WHITE, margin: 0 }}>{v.name}</h3>
                <p style={{ fontFamily: BODY, fontSize: 12.5, color: MUTE, margin: "6px 0 0", lineHeight: 1.4 }}>{v.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AGENDA ──────────────────────────────────────────────────────────────────────
function Agenda() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  return (
    <section ref={ref} id="agenda" style={{ position: "relative", background: INK, borderTop: `1px solid ${LINE}`, padding: "clamp(64px,9vh,110px) clamp(22px,5vw,80px)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ ...rise(inView, 0), textAlign: "center" }}><Eyebrow center>Agenda</Eyebrow></div>
        <h2 style={{ ...rise(inView, 0.08), fontFamily: DISPLAY, fontSize: "clamp(26px,4vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: WHITE, margin: "18px auto clamp(38px,5vh,52px)", textAlign: "center" }}>
          Ninety Minutes, By The Clock.
        </h2>
        <div style={{ ...rise(inView, 0.16), maxWidth: 820, margin: "0 auto" }}>
          {AGENDA.map((a, i) => {
            const climax = a.title === "The Art of Knowing";
            const isFirst = i === 0;
            const isLast = i === AGENDA.length - 1;
            const accent = climax ? RED : GOLD;
            return (
              <div key={i} className="ic-agenda-row" style={{ display: "grid", gridTemplateColumns: "96px 30px 1fr", gap: "clamp(12px,2vw,24px)", alignItems: "start", padding: "clamp(16px,2.1vw,24px) clamp(8px,1.4vw,16px)", borderRadius: 12, transition: "background 0.35s ease" }}>
                {/* Time */}
                <div style={{ fontFamily: DISPLAY, fontSize: "clamp(14px,1.45vw,17px)", fontWeight: 700, letterSpacing: "-0.01em", color: climax ? RED_SOFT : GOLD, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right", paddingTop: 2 }}>{a.time}</div>
                {/* Rail + node */}
                <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                  <span aria-hidden style={{ position: "absolute", top: isFirst ? "10px" : 0, bottom: isLast ? "calc(100% - 18px)" : 0, width: 1, background: LINE_STRONG }} />
                  <span aria-hidden style={{ position: "relative", marginTop: 6, width: climax ? 13 : 10, height: climax ? 13 : 10, borderRadius: "50%", background: accent, boxShadow: `0 0 12px ${accent}${climax ? "" : "aa"}`, outline: `4px solid ${INK}` }} />
                </div>
                {/* Content */}
                <div>
                  {climax && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                      <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: RED_SOFT, border: `1px solid rgba(225,75,58,0.4)`, borderRadius: 999, padding: "3px 9px" }}>The Featured Moment</span>
                    </span>
                  )}
                  <div style={{ fontFamily: DISPLAY, fontSize: "clamp(16px,1.7vw,21px)", fontWeight: 600, letterSpacing: "-0.01em", color: climax ? "#fff" : WHITE, lineHeight: 1.25 }}>{a.title}</div>
                  {a.sub && <div style={{ fontFamily: ITALIC, fontStyle: "italic", fontSize: "clamp(13.5px,1.35vw,15.5px)", color: climax ? "rgba(245,240,232,0.78)" : MUTE, marginTop: 6, lineHeight: 1.5 }}>{a.sub}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── STEP INTO THE INNER CIRCLE (CTA band) ────────────────────────────────────────
function CtaBand() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", borderTop: `1px solid ${LINE}`, padding: "clamp(72px,11vh,140px) clamp(22px,5vw,80px)", textAlign: "center" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `url(${VENUE_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.9 }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(180deg, rgba(16,14,12,0.74) 0%, rgba(16,14,12,0.38) 45%, rgba(16,14,12,0.86) 100%)" }} />
      {/* Central darkening behind the copy for legibility */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 76% 72% at 50% 46%, rgba(16,14,12,0.62) 0%, rgba(16,14,12,0.2) 58%, transparent 82%)" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(ellipse 62% 62% at 50% 46%, ${RED}1e, transparent 62%)`, mixBlendMode: "screen" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
        <div style={{ ...rise(inView, 0), display: "flex", justifyContent: "center" }}><Eyebrow center>Step Into The Inner Circle</Eyebrow></div>
        <h2 style={{ ...rise(inView, 0.08), fontFamily: DISPLAY, fontSize: "clamp(30px,5vw,58px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.05, color: WHITE, margin: "20px auto 0", maxWidth: 700, textShadow: "0 2px 30px rgba(0,0,0,0.6)" }}>
          An Evening Crafted For Leaders Like You.
        </h2>
        <p style={{ ...rise(inView, 0.16), fontFamily: BODY, fontSize: "clamp(15px,1.6vw,19px)", fontWeight: 600, letterSpacing: "0.02em", color: GOLD_BRIGHT, margin: "22px 0 0", textShadow: "0 2px 18px rgba(0,0,0,0.7)" }}>
          Hilton Riyadh &amp; Residences &nbsp;&mdash;&nbsp; 19 August 2026
        </p>
        <div style={{ ...rise(inView, 0.24), marginTop: 30, display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
          <a href="#register" onClick={(e) => { e.preventDefault(); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }} className="ic-btn" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 38px", borderRadius: 999, background: `linear-gradient(135deg, ${RED} 0%, ${RED_SOFT} 100%)`, color: "#fff", fontFamily: BODY, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: `0 16px 44px ${RED}55, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
            Request Invite <span aria-hidden>→</span>
          </a>
          <a href="https://maps.app.goo.gl/3TYtpHRTYJLwGC1S7" target="_blank" rel="noopener noreferrer" className="ic-btn" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "16px 30px", borderRadius: 999, background: "rgba(16,14,12,0.5)", border: `1px solid ${LINE_STRONG}`, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", color: WHITE, fontFamily: BODY, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD_BRIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── REGISTRATION ──────────────────────────────────────────────────────────────────
const EMPTY = { name: "", title: "", email: "", company: "", phone: "", country: "Saudi Arabia" };

function Registration() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const [form, setForm] = useState({ ...EMPTY });
  const [dialCountry, setDialCountry] = useState<CountryCode>(COUNTRY_CODES.find((c) => c.country === "SA") ?? COUNTRY_CODES[0]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Phone — allow only digits, hard-capped to the selected country's length
  const onPhone = (v: string) => set("phone", v.replace(/\D/g, "").slice(0, dialCountry.length));
  const onDial = (c: CountryCode) => { setDialCountry(c); setForm((p) => ({ ...p, phone: p.phone.replace(/\D/g, "").slice(0, c.length) })); };

  // Email — flag a non-work address the moment the field loses focus
  const checkEmail = () => {
    const e = form.email.trim();
    setEmailErr(e && !isWorkEmail(e) ? "Please enter your work email address." : null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!form.name.trim()) { setErr("Please enter your name."); return; }
    if (!isWorkEmail(form.email)) { setEmailErr("Please enter your work email address."); setErr("Please use your work email address."); return; }
    const phoneErr = validatePhone(form.phone, dialCountry);
    if (phoneErr) { setErr(phoneErr); return; }
    setLoading(true);
    const res = await submitForm({
      type: "attend",
      full_name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      job_title: form.title.trim(),
      phone: `${dialCountry.code}${form.phone.replace(/[\s\-()]/g, "")}`,
      event_name: "The Inner Circle Riyadh 2026",
      metadata: { country: form.country },
    });
    setLoading(false);
    if (res.success) setDone(true);
    else setErr(res.error || "Something went wrong. Please try again.");
  };

  const field: React.CSSProperties = { width: "100%", padding: "13px 15px", borderRadius: 11, border: `1px solid ${LINE_STRONG}`, background: "rgba(245,240,232,0.04)", color: WHITE, fontFamily: BODY, fontSize: 14.5, fontWeight: 500, outline: "none" };
  const label: React.CSSProperties = { fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: DIM, marginBottom: 7, display: "block" };

  return (
    <section ref={ref} id="register" style={{ position: "relative", background: INK_2, borderTop: `1px solid ${LINE}`, padding: "clamp(64px,9vh,110px) clamp(22px,5vw,80px)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...rise(inView, 0), display: "flex", justifyContent: "center" }}><Eyebrow center>Registration</Eyebrow></div>
        <h2 style={{ ...rise(inView, 0.08), fontFamily: DISPLAY, fontSize: "clamp(26px,4vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: WHITE, margin: "18px auto clamp(34px,4.5vh,48px)", maxWidth: 560 }}>
          Seats Are Limited. By Invitation Only.
        </h2>

        <div style={{ ...rise(inView, 0.16), position: "relative", padding: "clamp(28px,4vw,44px)", borderRadius: 22, background: SURFACE, border: `1px solid ${LINE}`, textAlign: "left", boxShadow: "0 40px 90px rgba(0,0,0,0.45)" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 58, height: 58, margin: "0 auto 18px", borderRadius: "50%", background: `linear-gradient(135deg, ${RED}, ${RED_SOFT})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: WHITE, margin: 0 }}>Request received.</h3>
              <p style={{ fontFamily: BODY, fontSize: 15, color: MUTE, margin: "12px auto 0", maxWidth: 420, lineHeight: 1.6 }}>Thank you. Our team will review your request and be in touch regarding your seat at The Inner Circle.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="ic-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><label style={label}>Name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" suppressHydrationWarning style={field} /></div>
                <div><label style={label}>Job Title</label><input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Job title" suppressHydrationWarning style={field} /></div>
                <div>
                  <label style={label}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => { set("email", e.target.value); if (emailErr) setEmailErr(null); }} onBlur={checkEmail} placeholder="Work email" suppressHydrationWarning style={{ ...field, borderColor: emailErr ? RED : LINE_STRONG }} />
                  {emailErr && <span style={{ display: "block", fontFamily: BODY, fontSize: 12, color: RED_SOFT, marginTop: 6 }}>{emailErr}</span>}
                </div>
                <div><label style={label}>Company Name</label><input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company" suppressHydrationWarning style={field} /></div>
                <div>
                  <label style={label}>Phone Number</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select aria-label="Dial code" value={dialCountry.code + dialCountry.country} onChange={(e) => { const c = COUNTRY_CODES.find((x) => x.code + x.country === e.target.value); if (c) onDial(c); }} suppressHydrationWarning style={{ ...field, width: 104, flex: "0 0 auto" }}>
                      {COUNTRY_CODES.map((c) => (<option key={c.code + c.country} value={c.code + c.country} style={{ background: INK }}>{c.country} {c.code}</option>))}
                    </select>
                    <input type="tel" inputMode="numeric" value={form.phone} onChange={(e) => onPhone(e.target.value)} placeholder={dialCountry.placeholder} suppressHydrationWarning style={{ ...field, flex: 1 }} />
                  </div>
                </div>
                <div>
                  <label style={label}>Country</label>
                  <select value={form.country} onChange={(e) => set("country", e.target.value)} suppressHydrationWarning style={field}>
                    {COUNTRY_CODES.map((c) => (<option key={c.country} value={c.name} style={{ background: INK }}>{c.name}</option>))}
                  </select>
                </div>
              </div>

              {err && <p style={{ fontFamily: BODY, fontSize: 13.5, color: RED_SOFT, margin: "16px 0 0" }}>{err}</p>}

              <button type="submit" disabled={loading} className="ic-btn" style={{ width: "100%", marginTop: 22, padding: "16px", borderRadius: 12, border: "none", cursor: loading ? "default" : "pointer", background: `linear-gradient(135deg, ${RED} 0%, ${RED_SOFT} 100%)`, color: "#fff", fontFamily: BODY, fontSize: 15.5, fontWeight: 700, boxShadow: `0 14px 38px ${RED}44`, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Submitting…" : "Request My Invitation"}
              </button>

              <p style={{ fontFamily: BODY, fontSize: 12.5, color: DIM, margin: "16px 0 0", textAlign: "center", lineHeight: 1.6 }}>
                By submitting this form, you agree to CleverTap&apos;s{" "}
                <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: INK, borderTop: `1px solid ${LINE}`, padding: "36px clamp(22px,5vw,80px)" }}>
      <div className="ic-footer" style={{ maxWidth: 1160, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "18px 28px", alignItems: "center", justifyContent: "space-between" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CT_LOGO} alt="CleverTap" style={{ height: 34, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.92 }} />
        <a href="https://www.eventsfirstgroup.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 11, textDecoration: "none" }} aria-label="Produced by Events First Group">
          <span style={{ fontFamily: BODY, fontSize: 12, color: DIM, letterSpacing: "0.04em" }}>Produced by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={EFG_LOGO} alt="Events First Group" loading="lazy" style={{ height: 24, width: "auto", opacity: 0.9 }} />
        </a>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function InnerCirclePage() {
  return (
    <main style={{ background: INK, color: WHITE, fontFamily: BODY, overflowX: "hidden" }}>
      <Nav />
      <Hero />
      <Overview />
      <Preview />
      <Format />
      <InStore />
      <Voices />
      <Agenda />
      <CtaBand />
      <Registration />
      <Footer />

      <style jsx global>{`
        .ic-btn { transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease; }
        .ic-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .ic-card:hover { border-color: ${GOLD}55 !important; transform: translateY(-3px); }
        .ic-store-tab.is-active { will-change: flex-grow; }
        .ic-dot-fill { transform-origin: left; transform: scaleX(0); }
        @keyframes icDotFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .ic-dot-fill { animation: none !important; transform: scaleX(1); } }
        .ic-agenda-row:hover { background: rgba(245,240,232,0.03); }
        .ic-teaser-pulse { animation: icTeaserPulse 2.4s ease-in-out infinite; }
        .ic-preview-video:hover .ic-preview-play { background: rgba(225,75,58,0.9); border-color: rgba(225,75,58,0.9); transform: scale(1.06); }
        @keyframes icTeaserPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(225,75,58,0.35); }
          50% { box-shadow: 0 0 0 12px rgba(225,75,58,0); }
        }
        @media (prefers-reduced-motion: reduce) { .ic-teaser-pulse { animation: none; } }

        .ic-wave { transform-box: view-box; transform-origin: center; }
        .ic-wave-1 { animation: icWaveDrift 14s ease-in-out infinite; }
        .ic-wave-2 { animation: icWaveDrift 18s ease-in-out infinite reverse; }
        .ic-wave-3 { animation: icWaveDrift 22s ease-in-out infinite; }
        @keyframes icWaveDrift {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-26px) translateY(-12px); }
        }
        @media (prefers-reduced-motion: reduce) { .ic-wave { animation: none !important; } }
        select.ic-sel option { color: #111; }

        .ic-nav-link:hover { color: ${WHITE}; }
        section[id] { scroll-margin-top: 84px; }

        .ic-face { -webkit-backface-visibility: hidden; backface-visibility: hidden; }
        .ic-face-back { transform: rotateY(180deg); }
        .ic-flip-inner.is-flipped { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) {
          .ic-flip-inner { transition: none !important; }
        }

        .ic-fade { opacity: 0; transform: translateY(22px); animation: icFade 1s cubic-bezier(0.16,1,0.3,1) forwards; }
        .ic-d1 { animation-delay: 0.15s; }
        .ic-d2 { animation-delay: 0.3s; }
        .ic-d3 { animation-delay: 0.5s; }
        .ic-d4 { animation-delay: 0.65s; }
        .ic-d5 { animation-delay: 0.8s; }
        .ic-d6 { animation-delay: 0.95s; }
        .ic-d7 { animation-delay: 1.1s; }
        @keyframes icFade { to { opacity: 1; transform: none; } }

        .ic-hero-bg { animation: icKenBurns 26s ease-in-out infinite alternate; will-change: transform; }
        @keyframes icKenBurns {
          0% { transform: scale(1.04) translate(0, 0); }
          100% { transform: scale(1.14) translate(-1.6%, -1.4%); }
        }
        .ic-hero-haze { animation: icHaze 7.5s ease-in-out infinite; }
        @keyframes icHaze {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 1; }
        }
        .ic-dust { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(245,240,232,0.9), rgba(245,240,232,0) 70%); opacity: 0; animation-name: icDust; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        @keyframes icDust {
          0% { opacity: 0; transform: translateY(14px) scale(0.8); }
          20% { opacity: 0.55; }
          80% { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-46px) scale(1.1); }
        }
        .ic-hero-logo { animation: icLogoGlow 6.5s ease-in-out infinite; }
        @keyframes icLogoGlow {
          0%, 100% { filter: brightness(0) invert(1) drop-shadow(0 10px 44px rgba(0,0,0,0.55)); }
          50% { filter: brightness(0) invert(1) drop-shadow(0 10px 44px rgba(0,0,0,0.55)) drop-shadow(0 0 24px rgba(230,200,136,0.42)); }
        }
        .ic-hero-rays { transform: translate(-50%, -50%); animation: icRays 44s linear infinite; }
        @keyframes icRays { to { transform: translate(-50%, -50%) rotate(360deg); } }
        .ic-meta-shine::after { content: ""; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 34%, rgba(255,255,255,0.14) 50%, transparent 66%); transform: translateX(-120%); animation: icMetaShine 6.5s ease-in-out infinite; animation-delay: 2.2s; pointer-events: none; }
        @keyframes icMetaShine { 0% { transform: translateX(-120%); } 45%, 100% { transform: translateX(120%); } }
        .ic-shine::after { content: ""; position: absolute; top: 0; left: -60%; width: 42%; height: 100%; background: linear-gradient(105deg, transparent, rgba(255,255,255,0.5), transparent); transform: skewX(-20deg); animation: icBtnShine 4.8s ease-in-out infinite; animation-delay: 1s; pointer-events: none; }
        @keyframes icBtnShine { 0% { left: -60%; } 38%, 100% { left: 130%; } }

        .ic-li {
          position: absolute; top: 12px; right: 12px; z-index: 2;
          width: 32px; height: 32px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(16,14,12,0.55); border: 1px solid rgba(245,240,232,0.16);
          color: rgba(245,240,232,0.82); backdrop-filter: blur(6px);
          transition: background 0.28s ease, color 0.28s ease, border-color 0.28s ease, transform 0.28s ease, box-shadow 0.28s ease;
        }
        .ic-li:hover {
          background: #0A66C2; border-color: #0A66C2; color: #fff;
          transform: translateY(-1px) scale(1.06);
          box-shadow: 0 6px 18px rgba(10,102,194,0.42);
        }
        .ic-li svg { display: block; }

        @media (prefers-reduced-motion: reduce) {
          .ic-fade { animation: none; opacity: 1; transform: none; }
          .ic-hero-bg, .ic-hero-haze, .ic-dust, .ic-hero-logo, .ic-hero-rays { animation: none !important; }
          .ic-meta-shine::after, .ic-shine::after { animation: none !important; display: none; }
        }
        @media (max-width: 860px) {
          .ic-format { grid-template-columns: 1fr !important; }
          .ic-format-rule { display: none !important; }
          .ic-voices { grid-template-columns: minmax(0, 320px) !important; }
          .ic-preview-split { grid-template-columns: 1fr !important; }
          .ic-preview-video { min-height: 230px !important; order: -1; }
          .ic-preview-divider { display: none !important; }
          .ic-nav-links { display: none !important; }
          .ic-ov-grid { grid-template-columns: 1fr !important; gap: 22px !important; }
          .ic-attend-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .ic-attend-rule { display: none !important; }
        }
        @media (max-width: 420px) {
          .ic-nav-cta { padding: 9px 16px !important; font-size: 12.5px !important; }
        }
        @media (max-width: 640px) {
          .ic-tagline { white-space: normal !important; max-width: 340px !important; }
        }
        @media (max-width: 760px) {
          .ic-store-tabs { flex-direction: column !important; height: auto !important; }
          .ic-store-tab { min-height: 0 !important; }
          .ic-tab-collapsed { flex-direction: row !important; height: auto !important; justify-content: flex-start !important; gap: 16px !important; padding: 18px 20px !important; }
          .ic-tab-ctitle { text-align: left !important; }
          .ic-tab-expanded { width: auto !important; }
        }
        @media (max-width: 680px) {
          .ic-stats { grid-template-columns: 1fr !important; }
          .ic-stats > div { border-left: none !important; border-top: 1px solid ${LINE}; }
          .ic-stats > div:first-child { border-top: none; }
          .ic-form-grid { grid-template-columns: 1fr !important; }
          .ic-agenda-row { grid-template-columns: 62px 22px 1fr !important; gap: 10px !important; }
        }
      `}</style>
    </main>
  );
}
