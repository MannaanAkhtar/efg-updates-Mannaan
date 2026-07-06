"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone, type CountryCode } from "@/lib/form-helpers";

// Fine paper grain — premium, non-flat surface
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ─── EDB brand tokens ─────────────────────────────────────────────────────────
// Premium, Apple-white palette: ivory light field, deep-navy ink, EDB cobalt.
const BLUE = "#1636C9";          // EDB primary cobalt
const BLUE_BRIGHT = "#3E63F0";   // Brighter accent / hovers
const BLUE_DEEP = "#0A1A6B";     // Deep blue for blooms
const SKY = "#6E93FF";           // Light accent for dark bands

const INK = "#0A1222";           // Near-black navy — primary text
const INK_SOFT = "#38445A";      // Secondary text on light
const MUTE = "#6B7789";          // Muted labels on light
const LINE = "rgba(10,18,34,0.10)";
const LINE_STRONG = "rgba(10,18,34,0.16)";

const BG = "#FFFFFF";            // Page base
const BG_SOFT = "#F5F7FC";       // Alternating soft surface
const DARK = "#28495A";          // EDB slate — signature dark band (manifesto + register)
const DARK_2 = "#203C4A";        // Slightly deeper slate — inset card surface

const WHITE = "#ffffff";
const DIM = "rgba(255,255,255,0.70)";
const DIM_2 = "rgba(255,255,255,0.46)";

const DISPLAY = "var(--font-display), system-ui, sans-serif"; // Plus Jakarta Sans
const BODY = "var(--font-outfit), system-ui, sans-serif";     // Outfit

const LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/edb_postgres_ai_lightmode%402x+(4).png";
const HERO_IMG = "https://efg-final.s3.eu-north-1.amazonaws.com/magnific_cinematic-hero-background_J9jswnYOq4.png";

const EVENT_DATE = "2026-09-29T09:00:00+03:00"; // 29 September 2026, Saudi Arabia (time TBC)

// ─── Content (verbatim from the brief) ────────────────────────────────────────
const TITLE_LINE_1 = "The Sovereign Data Estate";
const TITLE_LINE_2 = "How Middle East enterprises are breaking free from proprietary lock-in";
const TAGLINE =
  "In an era of rising geopolitical risk and AI-driven data demands, the enterprises that own their data stack will own their future.";

const ABOUT =
  "Middle East enterprises are under mounting pressure — escalating proprietary database costs, tightening data sovereignty regulations, and the race to deliver AI-powered outcomes. This executive roundtable brings together senior IT and data leaders to explore how organisations can build a truly sovereign data estate: one grounded in open-source Postgres, free from vendor dependency, and architected to scale with AI. Drawing on EDB's experience with 1,600+ enterprises across 79 countries, we'll examine what it practically takes to modernise your data infrastructure without disruption, and why the window to act is now.";

const PROBLEM_RESOLUTION =
  "This roundtable gives attendees a peer-validated, practical roadmap to resolve all three — reducing cost, meeting sovereignty requirements, and future-proofing their data estate in a single strategic move.";

// The three simultaneous pressures (from the problem statement)
const PROBLEM_LEAD =
  "Senior technology leaders in the ME region are caught between three competing pressures simultaneously.";

const PRESSURES = [
  {
    kicker: "Cost",
    title: "Licensing costs with no exit path",
    body: "Spiralling proprietary database licensing costs, with no clear exit path.",
  },
  {
    kicker: "Sovereignty",
    title: "Tightening residency mandates",
    body: "Tightening national data residency and compliance mandates.",
  },
  {
    kicker: "AI",
    title: "AI on infrastructure not built for it",
    body: "Board-level expectations to deliver AI innovation on infrastructure that wasn't built for it.",
  },
];

const WHY_LEAD =
  "Most database conversations happen between vendors and procurement teams. This one is different — it's a closed-room peer discussion between senior technology leaders who are navigating the same decisions, pressures, and political realities you are.";

const IN_THE_ROOM = [
  "You're paying Oracle or Microsoft more than you should and know it, but don't have a credible internal case for change yet.",
  "Your organisation is under pressure to comply with national data sovereignty requirements and you're not confident your current stack gets you there.",
  "You're being asked to deliver AI initiatives but your data infrastructure is the bottleneck nobody wants to talk about.",
  "You want an honest, vendor-neutral view of what Postgres modernisation actually looks like at enterprise scale — not a sales pitch.",
];

const TAKEAWAYS = [
  {
    tag: "The proprietary trap is real — and quantifiable",
    text: "Understand what vendor lock-in is actually costing your organisation in licence fees, agility, and innovation capacity.",
  },
  {
    tag: "Postgres is enterprise-ready, today",
    text: "See why the world's fastest-growing database is already trusted by the largest, most compliance-sensitive organisations globally.",
  },
  {
    tag: "A sovereign data estate is a strategic asset",
    text: "Learn how to frame database modernisation as a boardroom-level initiative tied to national data strategy and AI readiness — not just an IT decision.",
  },
];

const EDB_LEAD =
  "EnterpriseDB (EDB) is the leading enterprise data platform provider, built entirely on the foundation of PostgreSQL.";
const EDB_BODY =
  "The company helps organisations modernise their database infrastructure by unifying transactional, analytical, and AI workloads into a single, highly available platform. With products like EDB Postgres AI and WarehousePG, EDB enables businesses to eliminate costly data silos and securely deploy real-time AI applications across hybrid and multi-cloud environments — significantly reducing total cost of ownership while maintaining absolute control and data sovereignty.";

const EDB_STATS = [
  { num: "1,600+", label: "Enterprises served" },
  { num: "79", label: "Countries" },
];

const EDB_PRODUCTS = ["EDB Postgres AI", "WarehousePG"];

const SPEAKERS = [
  { name: "Kash Rafique", role: "Director, Sales EMEA", org: "EDB", tag: "Moderator", photo: "", initials: "KR", linkedin: "https://www.linkedin.com/in/kash-rafique-3a007997/" },
];

const NAV_LINKS = [
  { id: "overview", label: "The Session" },
  { id: "room", label: "Who Attends" },
  { id: "takeaways", label: "Takeaways" },
  { id: "about", label: "About EDB" },
];

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(targetIso: string) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const target = new Date(targetIso).getTime();
  if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0, mounted: false };
  const diff = Math.max(0, target - now.getTime());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    mounted: true,
  };
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -88 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" });
}

// ─── Countdown — dark variant, lives inside the invitation monolith ───────────
function Countdown() {
  const cd = useCountdown(EVENT_DATE);
  const cells: [string, number][] = [["Days", cd.days], ["Hrs", cd.hours], ["Min", cd.minutes], ["Sec", cd.seconds]];
  return (
    <div>
      <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>Begins in</div>
      <div style={{ display: "flex", gap: 10 }}>
        {cells.map(([l, v], i) => (
          <div key={l} className="edb-cd-cell" style={{
            position: "relative", flex: 1, textAlign: "center", padding: "16px 6px 13px", borderRadius: 17, overflow: "hidden",
            background: "linear-gradient(155deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.07) 48%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(22px) saturate(160%)", WebkitBackdropFilter: "blur(22px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -10px 22px rgba(255,255,255,0.05), inset 0 0 24px rgba(255,255,255,0.03), 0 18px 40px rgba(0,0,0,0.38)",
          }}>
            {/* top specular gloss */}
            <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "48%", background: "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.04) 60%, transparent 100%)", pointerEvents: "none", zIndex: 1 }} />
            {/* corner specular bloom */}
            <span aria-hidden style={{ position: "absolute", top: -34, left: -22, width: 130, height: 90, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.28), transparent 70%)", filter: "blur(12px)", pointerEvents: "none", zIndex: 1 }} />
            {/* bright top rim */}
            <span aria-hidden style={{ position: "absolute", top: 0, left: "14%", right: "14%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75) 50%, transparent)", pointerEvents: "none", zIndex: 2 }} />
            {/* liquid sheen sweep */}
            <span aria-hidden className="edb-cd-sheen" style={{ position: "absolute", top: 0, bottom: 0, left: "-150%", width: "58%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.22), transparent)", transform: "skewX(-18deg)", pointerEvents: "none", zIndex: 2, animationDelay: `${i * 0.35}s` }} />
            <div className="edb-cd-num" style={{ position: "relative", zIndex: 3, fontFamily: DISPLAY, fontSize: "clamp(23px,2.5vw,32px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{cd.mounted ? String(v).padStart(2, "0") : "--"}</div>
            <div style={{ position: "relative", zIndex: 3, fontFamily: BODY, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginTop: 9 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function EnterpriseDBRoundtablePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main style={{ background: BG, color: INK, fontFamily: BODY, overflowX: "hidden", position: "relative" }}>
      {/* ── Nav ── */}
      <nav className={`edb-nav ${scrolled ? "edb-nav--scrolled" : "edb-nav--top"}`} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(18px, 4vw, 56px)", height: 76,
        background: scrolled ? "#ffffff" : "linear-gradient(180deg, rgba(5,9,18,0.5) 0%, rgba(5,9,18,0) 100%)",
        backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
        borderBottom: scrolled ? `1px solid ${LINE}` : "1px solid transparent",
        boxShadow: scrolled ? "0 6px 24px rgba(10,18,34,0.07)" : "none",
        transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }} aria-label="EDB Postgres AI">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="edb-nav-logo" src={LOGO} alt="EDB Postgres AI" style={{ height: 46, width: "auto", filter: scrolled ? "none" : "brightness(0) invert(1)", transition: "filter 0.3s ease" }} />
        </button>
        <div className="edb-nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 2.6vw, 38px)" }}>
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => scrollToId(l.id)} className="edb-navlink" style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: BODY, fontSize: 14.5, fontWeight: 500, letterSpacing: "-0.01em",
              transition: "color 0.2s ease",
            }}>{l.label}</button>
          ))}
          <button onClick={() => scrollToId("register")} className="edb-cta-sm" style={{
            fontFamily: BODY, fontSize: 14.5, fontWeight: 600, color: WHITE,
            background: DARK, border: "none", borderRadius: 10, padding: "11px 22px", cursor: "pointer",
            boxShadow: `0 8px 22px ${DARK}44`, transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
          }}>Request a Seat</button>
        </div>
        {/* Mobile: register shortcut */}
        <button onClick={() => scrollToId("register")} className="edb-cta-mobile" style={{
          display: "none", fontFamily: BODY, fontSize: 13.5, fontWeight: 600, color: WHITE,
          background: DARK, border: "none", borderRadius: 9, padding: "10px 16px", cursor: "pointer",
        }}>Request a Seat</button>
      </nav>

      {/* ── Hero — full-bleed cinematic image ── */}
      <section className="edb-hero" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", background: "#0a1220", padding: "clamp(92px,10vh,116px) clamp(24px,6vw,92px) clamp(40px,5vh,60px)" }}>
        {/* Background image — zoomed in to crop the letterbox bars in the source PNG */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMG} alt="" aria-hidden fetchPriority="high" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", transform: "scale(1.45)", transformOrigin: "center", zIndex: 0 }} />
        {/* Readability scrim — darker on the left where the content sits, image stays clear on the right */}
        <div className="edb-hero-scrim-x" aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(90deg, rgba(5,9,18,0.88) 0%, rgba(5,9,18,0.66) 32%, rgba(5,9,18,0.28) 58%, rgba(5,9,18,0) 82%)" }} />
        <div className="edb-hero-scrim-y" aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(180deg, transparent 0%, transparent 66%, rgba(5,9,18,0.34) 100%)" }} />
        {/* Cobalt tint pool + grain */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(60% 80% at 8% 60%, ${BLUE}1f 0%, transparent 55%)`, mixBlendMode: "screen" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.22, mixBlendMode: "overlay", pointerEvents: "none", backgroundImage: GRAIN }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", width: "100%" }}>
          <div className="edb-hero-content" style={{ maxWidth: 780 }}>
            <div className="edb-rise edb-badge" style={{
              position: "relative", display: "inline-flex", alignItems: "center", overflow: "hidden",
              padding: "9px 18px 9px 15px", borderRadius: 100, marginBottom: 18,
              background: "linear-gradient(140deg, rgba(12,20,36,0.58) 0%, rgba(12,20,36,0.40) 55%, rgba(12,20,36,0.28) 100%)",
              backdropFilter: "blur(20px) saturate(150%)", WebkitBackdropFilter: "blur(20px) saturate(150%)",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 12px 30px rgba(0,0,0,0.38)",
            }}>
              {/* top gloss */}
              <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52%", background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)", pointerEvents: "none", zIndex: 1 }} />
              {/* bright top rim */}
              <span aria-hidden style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 50%, transparent)", pointerEvents: "none", zIndex: 2 }} />
              {/* liquid sheen sweep */}
              <span aria-hidden className="edb-badge-sheen" style={{ position: "absolute", top: 0, bottom: 0, left: "-140%", width: "45%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent)", transform: "skewX(-18deg)", pointerEvents: "none", zIndex: 2 }} />

              <div style={{ position: "relative", zIndex: 3, display: "inline-flex", alignItems: "center", gap: 11 }}>
                {/* live pulsing dot */}
                <span className="edb-badge-dot" aria-hidden style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
                  <span className="edb-badge-pulse" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: SKY }} />
                  <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: SKY, boxShadow: `0 0 10px ${SKY}` }} />
                </span>
                <span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}>Executive Roundtable</span>
                <span style={{ width: 1, height: 13, background: "rgba(255,255,255,0.36)" }} />
                <span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)", textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}>Saudi Arabia · By Invitation</span>
              </div>
            </div>

            <h1 className="edb-rise edb-d1" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(40px,5.4vw,80px)", lineHeight: 0.98, letterSpacing: "-0.04em", margin: 0, color: "#fff", textShadow: "0 2px 50px rgba(0,0,0,0.5)" }}>
              {TITLE_LINE_1}
            </h1>
            <p className="edb-rise edb-d2" style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: "clamp(17px,1.9vw,26px)", lineHeight: 1.2, letterSpacing: "-0.02em", margin: "16px 0 0", color: "rgba(255,255,255,0.88)", maxWidth: 620, textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}>
              {TITLE_LINE_2}
            </p>
            <p className="edb-rise edb-d3" style={{ fontFamily: BODY, fontSize: "clamp(14.5px,1.35vw,17px)", lineHeight: 1.58, color: "rgba(255,255,255,0.68)", margin: "14px 0 0", maxWidth: 540 }}>
              {TAGLINE}
            </p>

            {/* Meta glass strip */}
            <div className="edb-rise edb-d4 edb-meta" style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "stretch", marginTop: 24, padding: 4, borderRadius: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "0 22px 54px rgba(0,0,0,0.38)" }}>
              {[["Date", "29 September 2026"], ["Setting", "Saudi Arabia"], ["Format", "Closed-door"], ["Duration", "180 minutes"]].map(([l, v], i) => (
                <div key={l} className="edb-metafact" style={{ padding: "10px 20px", borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.14)" }}>
                  <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{l}</div>
                  <div style={{ fontFamily: DISPLAY, fontSize: "clamp(14px,1.35vw,16px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Countdown */}
            <div className="edb-rise edb-d4" style={{ marginTop: 20, maxWidth: 470 }}>
              <Countdown />
            </div>

            <div className="edb-rise edb-d5 edb-hero-cta" style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
              <button onClick={() => scrollToId("register")} className="edb-cta" style={{
                fontFamily: BODY, fontSize: 15.5, fontWeight: 600, color: WHITE, background: DARK,
                border: "none", borderRadius: 12, padding: "16px 32px", cursor: "pointer",
                boxShadow: `0 14px 34px ${DARK}66`, transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
              }}>Request your seat <span aria-hidden style={{ marginLeft: 6 }}>→</span></button>
              <button onClick={() => scrollToId("overview")} className="edb-cta-ghost-dark" style={{
                fontFamily: BODY, fontSize: 15.5, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "16px 32px", cursor: "pointer",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}>Why this room</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem / three pressures ── */}
      <ProblemSection />

      {/* ── Overview / The Session (dark) ── */}
      <section id="overview" style={{ position: "relative", background: "linear-gradient(160deg, #2F5366 0%, #28495A 52%, #1E3846 100%)", color: WHITE, padding: "clamp(56px,7vh,92px) clamp(18px,5vw,64px)", overflow: "hidden", contentVisibility: "auto", containIntrinsicSize: "auto 680px" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(780px 500px at 3% -12%, rgba(110,147,255,0.24), transparent 58%), radial-gradient(700px 580px at 105% 118%, rgba(110,147,255,0.13), transparent 56%), radial-gradient(130% 110% at 50% 44%, transparent 58%, rgba(0,0,0,0.24) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 15px 7px 13px", borderRadius: 100, background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)" }}>
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: SKY, boxShadow: `0 0 9px ${SKY}` }} />
              <span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#E4EBFF" }}>The Session</span>
            </span>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px,4.2vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: WHITE, margin: "16px 0 0", maxWidth: 820 }}>Building a data estate you actually own.</h2>
          </div>
          <div className="edb-overview" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "clamp(28px,4vw,64px)", alignItems: "start" }}>
            <p style={{ fontFamily: BODY, fontSize: "clamp(16px,1.5vw,19px)", lineHeight: 1.72, color: "rgba(255,255,255,0.74)", margin: 0 }}>{ABOUT}</p>
            <div className="edb-overview-side" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Open-source foundation", "Grounded in PostgreSQL — free from vendor dependency."],
                ["Sovereign by design", "Architected for national data-residency and compliance."],
                ["Built to scale with AI", "Modernise without disruption — and stay ready for what's next."],
              ].map(([t, d], i) => (
                <div key={i} className="edb-ov-card" style={{
                  position: "relative", overflow: "hidden", padding: "20px 22px", borderRadius: 16,
                  background: "linear-gradient(155deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.045) 55%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.24), 0 12px 30px rgba(0,0,0,0.22)",
                  transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, box-shadow 0.35s ease",
                }}>
                  <span aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 50%, transparent)" }} />
                  <div style={{ fontFamily: DISPLAY, fontSize: 16.5, fontWeight: 700, color: WHITE, letterSpacing: "-0.01em" }}>{t}</div>
                  <div style={{ fontFamily: BODY, fontSize: 13.5, lineHeight: 1.55, color: "rgba(255,255,255,0.64)", marginTop: 7 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Who Attends (soft) ── */}
      <RoomSection />

      {/* ── Key Takeaways (light) ── */}
      <Section id="takeaways" eyebrow="Key Takeaways" title="What you'll walk away with." tint>
        <div className="edb-takeaways" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, maxWidth: 1120, margin: "0 auto", borderTop: `1px solid ${LINE}` }}>
          {TAKEAWAYS.map((t, i) => (
            <div key={i} className="edb-tk" style={{ position: "relative", overflow: "hidden", padding: "clamp(30px,3.2vw,44px) clamp(22px,2.4vw,34px)", borderLeft: i === 0 ? "none" : `1px solid ${LINE}` }}>
              <span className="edb-tk-num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
              <div className="edb-tk-body">
                <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(19px,2vw,24px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.18, color: INK, margin: "0 0 14px" }}>{t.tag}</h3>
                <p style={{ fontFamily: BODY, fontSize: "clamp(14.5px,1.35vw,16px)", lineHeight: 1.62, color: INK_SOFT, margin: 0 }}>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Speakers — announced soon (soft) ── */}
      <section id="speakers" style={{ position: "relative", background: BG_SOFT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: "clamp(56px,7vh,88px) clamp(18px,5vw,64px)", contentVisibility: "auto", containIntrinsicSize: "auto 640px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE }}>The Table</span>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px,4.2vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: INK, margin: "14px auto 0", maxWidth: 760 }}>A curated table of senior IT &amp; data leaders.</h2>
          <p style={{ fontFamily: BODY, fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.68, color: INK_SOFT, margin: "20px auto 0", maxWidth: 640 }}>
            Guided by EDB, the discussion stays peer-to-peer — senior leaders comparing notes on the same decisions and pressures.
          </p>

          <div className="edb-speakers" style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", margin: "40px auto 0", maxWidth: 760 }}>
            {SPEAKERS.map((s) => (
              <article key={s.name} className="edb-sp-card" style={{ width: 320, textAlign: "left", borderRadius: 20, overflow: "hidden", background: WHITE, border: `1px solid ${LINE}`, transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease" }}>
                <div style={{ position: "relative", aspectRatio: "4 / 3", background: `linear-gradient(155deg, ${DARK} 0%, ${DARK_2} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(360px 220px at 80% -10%, rgba(110,147,255,0.28), transparent 62%)` }} />
                  {s.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.photo} alt={s.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                  ) : (
                    <span style={{ position: "relative", fontFamily: DISPLAY, fontSize: 54, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em" }}>{s.initials}</span>
                  )}
                  <span style={{ position: "absolute", top: 14, left: 14, fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: WHITE, background: BLUE, padding: "6px 12px", borderRadius: 7 }}>{s.tag}</span>
                </div>
                <div style={{ padding: "22px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
                  <div>
                    <h3 style={{ fontFamily: DISPLAY, fontSize: 21, fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.02em" }}>{s.name}</h3>
                    <p style={{ fontFamily: BODY, fontSize: 13.5, color: INK_SOFT, margin: "8px 0 0", lineHeight: 1.45 }}>{s.role} · {s.org}</p>
                  </div>
                  {s.linkedin && (
                    <a href={s.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} on LinkedIn`} className="edb-sp-li" style={{ flex: "0 0 auto", width: 34, height: 34, borderRadius: 9, background: WHITE, border: `1px solid ${LINE_STRONG}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: INK_SOFT, transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" /></svg>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 30, padding: "11px 20px", borderRadius: 100, background: WHITE, border: `1px solid ${LINE}` }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: BLUE }} />
            <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 600, color: INK_SOFT, letterSpacing: "0.02em" }}>Panellists announced soon</span>
          </div>
        </div>
      </section>

      {/* ── About EDB (light + dark stat inset) ── */}
      <Section id="about" eyebrow="About EDB" title="The enterprise data platform, built on Postgres.">
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="edb-about" style={{ display: "grid", gridTemplateColumns: "1fr 0.86fr", gap: "clamp(30px,4.5vw,64px)", alignItems: "center" }}>
            {/* Left — narrative */}
            <div>
              <p style={{ fontFamily: DISPLAY, fontSize: "clamp(20px,2.2vw,27px)", fontWeight: 600, lineHeight: 1.32, letterSpacing: "-0.02em", color: INK, margin: 0, maxWidth: 540 }}>{EDB_LEAD}</p>
              <p style={{ fontFamily: BODY, fontSize: "clamp(15px,1.45vw,17px)", lineHeight: 1.74, color: INK_SOFT, margin: "20px 0 0", maxWidth: 560 }}>{EDB_BODY}</p>
              <div style={{ display: "flex", gap: 13, flexWrap: "wrap", marginTop: 30 }}>
                <a href="https://www.enterprisedb.com/" target="_blank" rel="noopener noreferrer" className="edb-link-btn" style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 600, color: WHITE, background: BLUE, borderRadius: 11, padding: "13px 24px", textDecoration: "none", transition: "background 0.2s ease, transform 0.2s ease" }}>Visit enterprisedb.com →</a>
                <button onClick={() => scrollToId("register")} className="edb-link-ghost" style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 600, color: INK, background: "transparent", border: `1px solid ${LINE_STRONG}`, borderRadius: 11, padding: "13px 24px", cursor: "pointer", transition: "background 0.2s ease, border-color 0.2s ease" }}>Request a seat</button>
              </div>
            </div>

            {/* Right — premium credential card */}
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: `linear-gradient(158deg, #2F5366 0%, ${DARK} 54%, ${DARK_2} 100%)`, padding: "clamp(30px,3vw,42px)", boxShadow: "0 34px 78px rgba(10,18,34,0.22)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(520px 340px at 92% -18%, rgba(110,147,255,0.26), transparent 60%), radial-gradient(420px 380px at -10% 120%, rgba(110,147,255,0.12), transparent 58%)` }} />
              <span aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4) 50%, transparent)" }} />
              <div style={{ position: "relative", textAlign: "center" }}>
                {/* EDB mark */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO} alt="EDB Postgres AI" style={{ height: 30, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.92 }} />

                {/* Stat pair */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px,2vw,26px)", marginTop: "clamp(26px,3vw,36px)" }}>
                  {EDB_STATS.map((s, i) => (
                    <div key={i} style={{ borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.12)" }}>
                      <div style={{ fontFamily: DISPLAY, fontSize: "clamp(38px,4.6vw,54px)", fontWeight: 700, color: WHITE, lineHeight: 1, letterSpacing: "-0.035em" }}>{s.num}</div>
                      <div style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: DIM_2, marginTop: 11 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Products */}
                <div style={{ marginTop: "clamp(26px,3vw,34px)", paddingTop: "clamp(22px,2.4vw,28px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                  <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginBottom: 14 }}>Platform</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                    {EDB_PRODUCTS.map((p) => (
                      <span key={p} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: BODY, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 100, padding: "8px 15px", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                        <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: SKY, boxShadow: `0 0 7px ${SKY}` }} />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Register (dark) ── */}
      <section id="register" style={{ position: "relative", background: DARK, color: WHITE, padding: "clamp(64px,9vh,112px) clamp(18px,5vw,64px)", overflow: "hidden", contentVisibility: "auto", containIntrinsicSize: "auto 900px" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: `
          radial-gradient(760px 500px at 12% -10%, rgba(110,147,255,0.15), transparent 60%),
          radial-gradient(720px 720px at 98% 112%, rgba(0,0,0,0.22), transparent 58%)
        ` }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
          <div className="edb-reg-copy">
            <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: SKY }}>Request a Seat</span>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.06, color: WHITE, margin: "16px 0 0" }}>Reserve your place at the table.</h2>
            <p style={{ fontFamily: BODY, fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.7, color: DIM, margin: "20px 0 0", maxWidth: 460 }}>
              Attendance is by invitation and curated for senior IT and data leaders. Request a seat and our team will confirm your place and share the full details.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 32 }}>
              {[["29 September 2026", "cal"], ["Saudi Arabia · Venue disclosed to confirmed guests", "pin"], ["180 minutes · Closed-door", "clock"]].map(([label, icon]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span aria-hidden style={{ flex: "0 0 auto", width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <RegIcon type={icon as "cal" | "pin" | "clock"} />
                  </span>
                  <span style={{ fontFamily: BODY, fontSize: 14.5, color: "rgba(255,255,255,0.82)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <RegistrationForm />
        </div>
      </section>

      {/* ── Footer (dark — bookends the register band) ── */}
      <footer className="edb-footer" style={{ background: DARK, borderTop: "1px solid rgba(255,255,255,0.08)", padding: "34px clamp(18px,5vw,64px)", contentVisibility: "auto", containIntrinsicSize: "auto 130px" }}>
        <div className="edb-footer-inner" style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "20px 32px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px 26px", flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="EDB Postgres AI" loading="lazy" decoding="async" style={{ height: 30, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.94 }} />
            <span aria-hidden style={{ width: 1, height: 16, background: "rgba(255,255,255,0.16)" }} />
            <a href="https://www.enterprisedb.com/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY, fontSize: 13.5, color: DIM, textDecoration: "none" }}>enterprisedb.com</a>
            <a href="mailto:grace.trott@enterprisedb.com" style={{ fontFamily: BODY, fontSize: 13.5, color: DIM, textDecoration: "none" }}>Contact EDB</a>
          </div>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 11, textDecoration: "none" }} aria-label="Produced by Events First Group">
            <span style={{ fontFamily: BODY, fontSize: 12, color: DIM_2, letterSpacing: "0.04em" }}>Produced by</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/events-first-group_logo_alt.svg" alt="Events First Group" loading="lazy" decoding="async" style={{ height: 26, width: "auto", opacity: 0.92 }} />
          </Link>
        </div>
      </footer>

      <style jsx global>{`
        .edb-nav--top .edb-navlink { color: rgba(255,255,255,0.86); }
        .edb-nav--top .edb-navlink:hover { color: #fff; }
        .edb-nav--scrolled .edb-navlink { color: ${INK_SOFT}; }
        .edb-nav--scrolled .edb-navlink:hover { color: ${INK}; }
        .edb-link-btn:hover { background: ${BLUE_BRIGHT} !important; transform: translateY(-1px); }
        .edb-cta-sm:hover, .edb-cta:hover { background: #33596E !important; transform: translateY(-1px); }
        .edb-cta-ghost:hover, .edb-link-ghost:hover { background: rgba(10,18,34,0.03) !important; border-color: ${BLUE}66 !important; }
        .edb-ov-card:hover { transform: translateY(-3px); border-color: rgba(110,147,255,0.5) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.32), 0 20px 44px rgba(0,0,0,0.3) !important; }
        .edb-sp-card:hover { transform: translateY(-4px); border-color: ${BLUE}44 !important; box-shadow: 0 24px 54px rgba(10,18,34,0.12) !important; }
        .edb-sp-li:hover { background: ${BLUE} !important; color: #fff !important; border-color: ${BLUE} !important; }
        .edb-tk { transition: background 0.35s ease; }
        .edb-tk:hover { background: rgba(255,255,255,0.5); }
        .edb-tk-num { position: absolute; bottom: clamp(-10px,-0.5vw,2px); right: clamp(10px,1.6vw,22px); font-family: ${DISPLAY}; font-size: clamp(84px,9vw,140px); font-weight: 700; line-height: 1; letter-spacing: -0.05em; color: rgba(10,18,34,0.06); font-variant-numeric: tabular-nums; z-index: 0; pointer-events: none; transition: color 0.45s ease; }
        .edb-tk:hover .edb-tk-num { color: rgba(22,54,201,0.12); }
        .edb-tk-body { position: relative; z-index: 1; }

        .edb-cd-num { background: linear-gradient(180deg, #ffffff 0%, #cfe0ff 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; text-shadow: 0 2px 18px rgba(110,147,255,0.35); }
        .edb-cd-cell { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.4s ease; }
        .edb-cd-cell:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.4) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), inset 0 0 26px rgba(255,255,255,0.06), 0 26px 52px rgba(0,0,0,0.46) !important; }
        .edb-cd-sheen { animation: edbCdSheen 6.5s ease-in-out infinite; }
        @keyframes edbCdSheen { 0%, 18% { left: -150%; } 62%, 100% { left: 160%; } }
        .edb-badge-pulse { animation: edbBadgePulse 2.6s ease-out infinite; }
        @keyframes edbBadgePulse { 0% { transform: scale(1); opacity: 0.55; } 70%, 100% { transform: scale(2.8); opacity: 0; } }
        .edb-badge-sheen { animation: edbCdSheen 7s ease-in-out infinite 1.2s; }
        @media (prefers-reduced-motion: reduce) { .edb-cd-sheen, .edb-badge-sheen, .edb-badge-pulse { animation: none !important; } }

        .edb-rise { opacity: 0; transform: translateY(16px); animation: edbRise 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .edb-d1 { animation-delay: 0.06s; }
        .edb-d2 { animation-delay: 0.14s; }
        .edb-d4 { animation-delay: 0.26s; }
        .edb-d5 { animation-delay: 0.34s; }
        @keyframes edbRise { to { opacity: 1; transform: none; } }

        @media (prefers-reduced-motion: reduce) { .edb-rise { animation: none; opacity: 1; transform: none; } }

        .edb-cta-ghost-dark:hover { background: rgba(255,255,255,0.18) !important; border-color: rgba(255,255,255,0.5) !important; }

        @media (max-width: 900px) {
          .edb-overview, .edb-about, #register > div { grid-template-columns: 1fr !important; }
          .edb-pressures { grid-template-columns: 1fr !important; }
          .edb-pressures .edb-pressure { border-left: none !important; border-top: 1px solid ${LINE} !important; }
          .edb-pressures .edb-pressure:first-child { border-top: none !important; }
          .edb-takeaways { grid-template-columns: 1fr !important; }
          .edb-takeaways .edb-tk { border-left: none !important; border-top: 1px solid ${LINE} !important; }
          .edb-takeaways .edb-tk:first-child { border-top: none !important; }
          .edb-reg-copy { order: -1; }
        }
        @media (max-width: 720px) {
          .edb-nav-links { display: none !important; }
          .edb-cta-mobile { display: inline-block !important; }
          .edb-nav-logo { height: 36px !important; }
          .edb-meta { width: 100%; }
          .edb-metafact { flex: 1 1 42%; border-left: none !important; }
          /* Content is full-width on mobile — darken the image uniformly for readability */
          .edb-hero-scrim-x { background: linear-gradient(180deg, rgba(5,9,18,0.86) 0%, rgba(5,9,18,0.72) 44%, rgba(5,9,18,0.66) 100%) !important; }
          .edb-hero-scrim-y { background: linear-gradient(180deg, rgba(5,9,18,0.28) 0%, transparent 34%, transparent 72%, rgba(5,9,18,0.5) 100%) !important; }
        }
        @media (max-width: 560px) {
          .edb-hero { min-height: auto !important; align-items: flex-start !important; padding: 92px 18px 48px !important; }
          .edb-nav-logo { height: 32px !important; }
          .edb-badge { flex-wrap: wrap; }
          .edb-meta { width: 100%; gap: 0; }
          .edb-metafact { flex: 1 1 44% !important; border-left: none !important; padding: 9px 14px !important; }
          .edb-hero-cta { flex-direction: column !important; gap: 12px !important; }
          .edb-hero-cta .edb-cta, .edb-hero-cta .edb-cta-ghost-dark { width: 100% !important; text-align: center !important; }
          .edb-footer { padding: 24px 18px 100px !important; }
          .edb-footer-inner { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </main>
  );
}

// ─── Small components ─────────────────────────────────────────────────────────
function RegIcon({ type }: { type: "cal" | "pin" | "clock" }) {
  const p: Record<string, React.ReactNode> = {
    cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  };
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={SKY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p[type]}</svg>;
}

function Section({ id, eyebrow, title, children, tint }: { id: string; eyebrow: string; title: string; children: React.ReactNode; tint?: boolean }) {
  return (
    <section id={id} style={{ position: "relative", background: tint ? "linear-gradient(160deg, #FBFCFF 0%, #E9F0FB 50%, #D6E3F5 100%)" : BG, borderTop: tint ? `1px solid ${LINE}` : undefined, borderBottom: tint ? `1px solid ${LINE}` : undefined, padding: "clamp(56px,7vh,92px) clamp(18px,5vw,64px)", overflow: "hidden", contentVisibility: "auto", containIntrinsicSize: "auto 680px" }}>
      {tint && <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(780px 500px at 98% -14%, ${BLUE}2b, transparent 58%), radial-gradient(700px 580px at -8% 118%, ${DARK}26, transparent 56%), radial-gradient(130% 110% at 50% 42%, transparent 60%, rgba(10,18,34,0.06) 100%)` }} />}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto 40px" }}>
        <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE }}>{eyebrow}</span>
        <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px,4.2vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: INK, margin: "14px 0 0", maxWidth: 820 }}>{title}</h2>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
}

// ─── Problem / three pressures — big editorial rows with scroll-reveal ─────────
function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="edb-problem" style={{ position: "relative", background: "linear-gradient(160deg, #FBFCFF 0%, #E9F0FB 50%, #D6E3F5 100%)", color: INK, padding: "clamp(38px,4.5vh,60px) clamp(18px,5vw,64px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(780px 500px at 98% -14%, ${BLUE}2b, transparent 58%), radial-gradient(700px 580px at -8% 118%, ${DARK}26, transparent 56%), radial-gradient(130% 110% at 50% 42%, transparent 60%, rgba(10,18,34,0.06) 100%)` }} />
      <div ref={ref} className={seen ? "is-in" : ""} style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto" }}>
        <div className="edb-pr-rise" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span aria-hidden style={{ width: 32, height: 1, background: BLUE }} />
          <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BLUE }}>The Problem It Solves</span>
        </div>

        <p className="edb-pr-rise edb-pr-d1" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(26px,3.6vw,46px)", lineHeight: 1.1, letterSpacing: "-0.035em", color: INK, margin: "18px 0 0", maxWidth: 1000 }}>{TAGLINE}</p>
        <p className="edb-pr-rise edb-pr-d2" style={{ fontFamily: BODY, fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.6, color: INK_SOFT, margin: "14px 0 0", maxWidth: 660 }}>{PROBLEM_LEAD}</p>

        {/* Three pressures — side-by-side, premium */}
        <div className="edb-prows" style={{ margin: "clamp(26px,3vw,40px) 0 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `1px solid ${LINE}` }}>
          {PRESSURES.map((p, i) => (
            <div key={i} className="edb-prow edb-pr-rise" style={{ borderLeft: i === 0 ? "none" : `1px solid ${LINE}` }}>
              <span className="edb-prow-num" aria-hidden>0{i + 1}</span>
              <div className="edb-prow-body">
                <span className="edb-prow-kicker">{p.kicker}</span>
                <h3 className="edb-prow-title">{p.title}</h3>
                <p className="edb-prow-desc">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="edb-pr-rise edb-pr-move" style={{ fontFamily: BODY, fontSize: "clamp(14.5px,1.4vw,16.5px)", lineHeight: 1.62, color: INK_SOFT, margin: "clamp(22px,2.6vw,32px) 0 0", maxWidth: 920 }}>
          <span style={{ color: BLUE, fontWeight: 700 }}>The move — </span>{PROBLEM_RESOLUTION}
        </p>
      </div>

      <style jsx global>{`
        .edb-pr-rise { opacity: 0; transform: translateY(22px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .is-in .edb-pr-rise { opacity: 1; transform: none; }
        .is-in .edb-pr-d1 { transition-delay: 0.08s; }
        .is-in .edb-pr-d2 { transition-delay: 0.16s; }
        .is-in .edb-prow:nth-of-type(1) { transition-delay: 0.24s; }
        .is-in .edb-prow:nth-of-type(2) { transition-delay: 0.33s; }
        .is-in .edb-prow:nth-of-type(3) { transition-delay: 0.42s; }
        .is-in .edb-pr-move { transition-delay: 0.5s; }

        .edb-prow { position: relative; padding: clamp(16px,1.8vw,24px) clamp(20px,2.4vw,34px); overflow: hidden; }
        .edb-prow-num { position: absolute; bottom: clamp(-6px,-0.3vw,4px); right: clamp(12px,2vw,26px); font-family: ${DISPLAY}; font-size: clamp(76px,8.4vw,124px); font-weight: 700; line-height: 1; letter-spacing: -0.05em; color: rgba(10,18,34,0.06); font-variant-numeric: tabular-nums; z-index: 0; pointer-events: none; transition: color 0.45s ease; }
        .edb-prow:hover .edb-prow-num { color: rgba(22,54,201,0.12); }
        .edb-prow-body { position: relative; z-index: 1; }
        .edb-prow-kicker { display: block; margin: 0; font-family: ${BODY}; font-size: 12.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: ${BLUE}; }
        .edb-prow-title { font-family: ${DISPLAY}; font-size: clamp(18px,1.9vw,23px); font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; color: ${INK}; margin: 11px 0 0; }
        .edb-prow-desc { font-family: ${BODY}; font-size: clamp(14px,1.3vw,15.5px); line-height: 1.55; color: ${INK_SOFT}; margin: 10px 0 0; }

        @media (prefers-reduced-motion: reduce) { .edb-pr-rise { opacity: 1 !important; transform: none !important; transition: none !important; } }
        @media (max-width: 760px) {
          .edb-prows { grid-template-columns: 1fr !important; }
          .edb-prow { border-left: none !important; border-top: 1px solid ${LINE}; }
          .edb-prow:first-of-type { border-top: none; }
        }
      `}</style>
    </section>
  );
}

// ─── Who Attends — editorial split, hairline qualifying list ──────────────────
function RoomSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="room" className="edb-room" style={{ position: "relative", background: BG_SOFT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: "clamp(48px,6vh,78px) clamp(18px,5vw,64px)", overflow: "hidden", contentVisibility: "auto", containIntrinsicSize: "auto 620px" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(720px 460px at 100% -12%, ${BLUE}14, transparent 58%), radial-gradient(680px 520px at -6% 116%, ${DARK}12, transparent 56%)` }} />
      <div ref={ref} className={seen ? "is-in" : ""} style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto" }}>
        <div className="edb-room-inner" style={{ display: "grid", gridTemplateColumns: "0.82fr 1.18fr", gap: "clamp(30px,5vw,84px)", alignItems: "center" }}>
          {/* Left — intro */}
          <div className="edb-room-intro">
            <div className="edb-rm-rise" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span aria-hidden style={{ width: 32, height: 1, background: BLUE }} />
              <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: BLUE }}>Who Attends</span>
            </div>
            <h2 className="edb-rm-rise edb-rm-d1" style={{ fontFamily: DISPLAY, fontSize: "clamp(28px,4.2vw,48px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.08, color: INK, margin: "18px 0 0" }}>You should be in the room if…</h2>
            <p className="edb-rm-rise edb-rm-d2" style={{ fontFamily: BODY, fontSize: "clamp(15px,1.45vw,17px)", lineHeight: 1.68, color: INK_SOFT, margin: "20px 0 0" }}>{WHY_LEAD}</p>
            <div className="edb-rm-rise edb-rm-d3" style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 26, padding: "8px 15px 8px 13px", borderRadius: 100, background: WHITE, border: `1px solid ${LINE_STRONG}`, boxShadow: "0 6px 18px rgba(10,18,34,0.05)" }}>
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE }} />
              <span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: INK_SOFT }}>By invitation · Peer discussion</span>
            </div>
          </div>

          {/* Right — qualifying criteria as a hairline list */}
          <div className="edb-rm-list">
            {IN_THE_ROOM.map((t, i) => (
              <div key={i} className="edb-rm-row edb-rm-rise">
                <span className="edb-rm-bar" aria-hidden />
                <span className="edb-rm-idx" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <p className="edb-rm-txt">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .edb-rm-rise { opacity: 0; transform: translateY(22px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .is-in .edb-rm-rise { opacity: 1; transform: none; }
        .is-in .edb-rm-d1 { transition-delay: 0.08s; }
        .is-in .edb-rm-d2 { transition-delay: 0.16s; }
        .is-in .edb-rm-d3 { transition-delay: 0.24s; }
        .is-in .edb-rm-list .edb-rm-row:nth-of-type(1) { transition-delay: 0.20s; }
        .is-in .edb-rm-list .edb-rm-row:nth-of-type(2) { transition-delay: 0.29s; }
        .is-in .edb-rm-list .edb-rm-row:nth-of-type(3) { transition-delay: 0.38s; }
        .is-in .edb-rm-list .edb-rm-row:nth-of-type(4) { transition-delay: 0.47s; }

        .edb-rm-list { border-top: 1px solid ${LINE}; }
        .edb-rm-row { position: relative; display: grid; grid-template-columns: auto 1fr; align-items: baseline; column-gap: clamp(18px,2.2vw,30px); padding: clamp(22px,2.6vw,30px) clamp(16px,1.8vw,26px) clamp(22px,2.6vw,30px) clamp(20px,2.2vw,28px); border-bottom: 1px solid ${LINE}; transition: background 0.35s ease; }
        .edb-rm-bar { position: absolute; left: 0; top: 50%; transform: translateY(-50%) scaleY(0); transform-origin: center; width: 3px; height: 62%; border-radius: 3px; background: ${BLUE}; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .edb-rm-idx { font-family: ${DISPLAY}; font-size: clamp(24px,2.6vw,34px); font-weight: 700; line-height: 1; letter-spacing: -0.03em; color: ${MUTE}; opacity: 0.5; font-variant-numeric: tabular-nums; transition: color 0.35s ease, opacity 0.35s ease; }
        .edb-rm-txt { font-family: ${BODY}; font-size: clamp(15px,1.5vw,17.5px); line-height: 1.58; color: ${INK}; margin: 0; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .edb-rm-row:hover { background: linear-gradient(90deg, ${BLUE}0a 0%, transparent 70%); }
        .edb-rm-row:hover .edb-rm-bar { transform: translateY(-50%) scaleY(1); }
        .edb-rm-row:hover .edb-rm-idx { color: ${BLUE}; opacity: 1; }
        .edb-rm-row:hover .edb-rm-txt { transform: translateX(4px); }

        @media (prefers-reduced-motion: reduce) { .edb-rm-rise { opacity: 1 !important; transform: none !important; transition: none !important; } }
        @media (max-width: 860px) {
          .edb-room-inner { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Registration form ────────────────────────────────────────────────────────
const EMPTY = { firstName: "", lastName: "", email: "", company: "", jobTitle: "", phone: "" };

function RegistrationForm() {
  const [form, setForm] = useState({ ...EMPTY });
  const [country, setCountry] = useState<CountryCode>(COUNTRY_CODES.find((c) => c.country === "SA") ?? COUNTRY_CODES[0]);
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
      event_name: "EnterpriseDB Executive Roundtable — The Sovereign Data Estate (Saudi Arabia)",
    });
    setLoading(false);
    if (res.success) { setDone(true); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else setErr(res.error || "Something went wrong. Please try again.");
  };

  return (
    <div ref={topRef} className="edb-form-wrap" style={{ position: "relative" }}>
      <div style={{ padding: "clamp(26px, 3.4vw, 40px)", borderRadius: 22, background: DARK_2, border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 40px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: BLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 8px 26px ${BLUE}66` }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: WHITE, margin: 0, letterSpacing: "-0.02em" }}>Request received.</h3>
            <p style={{ fontFamily: BODY, fontSize: 15, color: DIM, margin: "12px auto 0", maxWidth: 420, lineHeight: 1.6 }}>Thank you — our team will review your request and be in touch to confirm your seat at the roundtable on 29 September 2026.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="edb-form" noValidate>
            <div className="edb-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="First name" req><input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First name" suppressHydrationWarning /></Field>
              <Field label="Last name" req><input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last name" suppressHydrationWarning /></Field>
            </div>
            <Field label="Work email" req><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" suppressHydrationWarning /></Field>
            <div className="edb-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Company" req><input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company" suppressHydrationWarning /></Field>
              <Field label="Job title"><input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="Job title" suppressHydrationWarning /></Field>
            </div>
            <Field label="Phone" req>
              <div style={{ display: "flex", gap: 10 }}>
                <select
                  value={country.code + country.country}
                  onChange={(e) => {
                    const c = COUNTRY_CODES.find((x) => x.code + x.country === e.target.value);
                    if (c) { setCountry(c); setForm((p) => ({ ...p, phone: p.phone.replace(/\D/g, "").slice(0, c.length) })); }
                  }}
                  suppressHydrationWarning
                  style={{ flex: "0 0 auto", width: 112 }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code + c.country} value={c.code + c.country}>{c.country} {c.code}</option>
                  ))}
                </select>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, country.length))} placeholder={country.placeholder} inputMode="numeric" maxLength={country.length} suppressHydrationWarning style={{ flex: 1 }} />
              </div>
            </Field>

            {err && <p style={{ fontFamily: BODY, fontSize: 13.5, color: "#ff8f8f", margin: "16px 0 0" }}>{err}</p>}

            <button type="submit" disabled={loading} suppressHydrationWarning style={{
              width: "100%", marginTop: 22, height: 54, border: "none", borderRadius: 13, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: BODY, fontSize: 15.5, fontWeight: 600, color: WHITE, background: BLUE, opacity: loading ? 0.65 : 1,
              boxShadow: `0 12px 32px ${BLUE}66`, transition: "background 0.2s ease, transform 0.2s ease",
            }} className="edb-form-submit">{loading ? "Submitting…" : "Request your seat"}</button>
            <p style={{ fontFamily: BODY, fontSize: 11.5, color: DIM_2, textAlign: "center", margin: "14px 0 0", lineHeight: 1.5 }}>By requesting a seat you agree to be contacted by Events First Group and EDB about this roundtable.</p>
          </form>
        )}
      </div>

      <style jsx global>{`
        .edb-form label { font-family: ${BODY}; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${DIM_2}; }
        .edb-form input, .edb-form select {
          width: 100%; padding: 14px 14px; margin-top: 8px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.14); border-radius: 11px;
          font-family: ${BODY}; font-size: 16px; color: ${WHITE}; outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .edb-form select { margin-top: 0; }
        .edb-form input::placeholder { color: rgba(255,255,255,0.34); }
        .edb-form input:focus, .edb-form select:focus { border-color: ${SKY}; box-shadow: 0 0 0 3px ${BLUE}44; background: rgba(255,255,255,0.06); }
        .edb-form > .edb-field, .edb-form .edb-form-row { margin-top: 16px; }
        .edb-form option { background: ${DARK_2}; color: ${WHITE}; }
        .edb-form-submit:hover { background: ${BLUE_BRIGHT} !important; transform: translateY(-1px); }
        @media (max-width: 560px) { .edb-form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Field({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div className="edb-field">
      <label>{label}{req && <span style={{ color: SKY }}> *</span>}</label>
      {children}
    </div>
  );
}
