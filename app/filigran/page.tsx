"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone, type CountryCode } from "@/lib/form-helpers";

// ─── Filigran brand tokens (sampled from the brand mark) ─────────────────────
const BLUE = "#0018D8";          // Filigran cobalt — primary brand accent
const BLUE_BRIGHT = "#3D5BFF";   // Brighter blue for glows / hovers
const BLUE_DEEP = "#000B6E";     // Deep blue for blooms
const TEAL = "#0E7E9E";          // Cool teal — ambient background orbs
const CYAN = "#23A8CC";          // Brighter cyan — ambient background orbs
const BG = "#06070F";            // Near-black navy field (hero)
const BG_2 = "#090B16";          // Card / inset surface
const SECTION_BG = "#01101E";    // Filigran deep-navy — single surface for all sections below the hero
const CARD = "rgba(255,255,255,0.025)";
const BORDER = "rgba(255,255,255,0.09)";
const WHITE = "#ffffff";
const DIM = "rgba(255,255,255,0.66)";
const MUTE = "rgba(255,255,255,0.42)";

const DISPLAY = "var(--font-outfit), system-ui, sans-serif";
const BODY = "var(--font-dm-sans), system-ui, sans-serif";

const LOGO_WHITE = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/LOGO_FILIGRAN_BLANC.png";

const EVENT_DATE = "2026-07-07T12:00:00Z"; // 7 July 2026 — time TBC

// ─── Content (verbatim from the brief) ───────────────────────────────────────
const TITLE = "Agentic CTEM in Practice";
const SUBTITLE = "Supercharge your CTI and Exposure Validation teams with AI Agents";
const TAGLINE = "Uniting threat intelligence (CTI) and adversarial exposure validation (AEV) with AI agents.";

const ABOUT =
  "This roundtable explores “Agentic CTEM” and how AI agents are transforming Continuous Threat Exposure Management from a periodic exercise into a daily operating model. It demonstrates how combining threat intelligence (CTI) with adversarial exposure validation (AEV) bridges the gap between understanding threats and proving defenses. Using XTM One as a practical example, the session highlights where AI agents deliver meaningful impact. Designed to be interactive, it brings security leaders together to compare approaches, share what works, and identify where agentic automation fits within their own programs.";

const PROBLEM =
  "Continuous Threat Exposure Management (CTEM) provides security leaders with the right framework but executing it manually doesn’t scale. Threat intelligence (CTI) accumulates faster than teams can act, and validation of whether controls actually stop those threats happens too infrequently to be effective. As a result, security teams understand their adversaries but struggle to prove their defenses. Agentic AI provides the missing leverage by operationalizing the full loop and turning intelligence into prioritized, validated action. This roundtable brings these elements together, exploring how AI agents can run CTEM continuously so that CTI and exposure validation work in tandem to close the gap between understanding threats and proving resilience.";

const WHY =
  "You’ll leave with a practical operating model for continuously running CTEM with agentic AI, grounded in real-world application rather than theory. The session will also provide a clear, balanced perspective on where agents can meaningfully accelerate your program. This conversation is designed for leaders who are actively evaluating how to adopt agentic AI in security, with a strong emphasis on doing so responsibly, effectively, and with a clear understanding of both the opportunities and the boundaries.";

// Split a paragraph into its first sentence (lead) + the remainder (supporting)
const splitLead = (s: string): [string, string] => {
  const i = s.indexOf(". ");
  return i === -1 ? [s, ""] : [s.slice(0, i + 1), s.slice(i + 2)];
};
const [ABOUT_LEAD, ABOUT_REST] = splitLead(ABOUT);
const [PROBLEM_LEAD, PROBLEM_REST] = splitLead(PROBLEM);
const [WHY_LEAD, WHY_REST] = splitLead(WHY);

const TAKEAWAYS = [
  { tag: "CTEM", text: "How Continues Threat Exposure Management Program could be adopted by leveraging OpenCTI and OpenAEV" },
  { tag: "CTI/AEV", text: "From intelligence to proof: validating with AEV whether your controls actually stop the techniques your intel flags." },
  { tag: "Agentic AI", text: "Where AI agents genuinely add leverage across the threat lifecycle" },
];

const SPEAKERS = [
  { name: "Abdessabour Arous", role: "Senior Solution Engineer", org: "Filigran", photo: "", initials: "AA" },
  { name: "Ali Bawazeer", role: "Senior Solution Engineer", org: "Filigran", photo: "", initials: "AB" },
];

const RESOURCES: { title: string; url: string }[] = [
  { title: "The Continuous advantage – CTEM eBook", url: "https://filigran-prod.s3.eu-west-3.amazonaws.com/app/uploads/2026/05/13150618/filigran_ctem-ebook_0426_compressed.pdf?utm_medium=webinar&utm_source=thirdpartywebinar&utm_campaign=Webinar-with-EFG" },
  { title: "A practical guide to threat-informed defense", url: "https://filigran.io/app/uploads/2025/11/threat-informed-defense_white-paper_filigran_112025.pdf?utm_medium=webinar&utm_source=thirdpartywebinar&utm_campaign=Webinar-with-EFG" },
  { title: "Cyberthreats in the financial sector – industry report", url: "https://filigran-prod.s3.eu-west-3.amazonaws.com/app/uploads/2026/03/27182814/filigran-report_financial_sector-2026-compressed.pdf" },
  { title: "Strengthening National Cyber-Resilience in Government - Webinar", url: "https://filigran.io/resources/strengthening-national-cyber-resilience-in-government/?utm_medium=webinar&utm_source=thirdpartywebinar&utm_campaign=Webinar-with-EFG" },
];

const CUSTOMER_STORIES: { tag: string; title: string; url: string }[] = [
  { tag: "Rivian", title: "How Rivian achieves a 95% reduction in response time with OpenCTI", url: "https://filigran.io/customer-stories/how-rivian-achieves-a-95-reduction-in-response-time-with-opencti/?utm_medium=webinar&utm_source=thirdpartywebinar&utm_campaign=Webinar-with-EFG" },
  { tag: "Switzerland FDFA", title: "How Switzerland’s FDFA trains smarter with OpenAEV", url: "https://filigran.io/customer-stories/how-switzerlands-fdfa-trains-smarter-with-openaev/?utm_medium=webinar&utm_source=thirdpartywebinar&utm_campaign=Webinar-with-EFG" },
];

const NAV_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "takeaways", label: "Takeaways" },
  { id: "speakers", label: "Speakers" },
  { id: "about", label: "About Filigran" },
  { id: "register", label: "Register" },
];

// ─── Countdown ───────────────────────────────────────────────────────────────
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
  if (lenis) lenis.scrollTo(el, { offset: -90 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
}

// ─── Countdown (own component → only this re-renders each second) ─────────────
function Countdown() {
  const cd = useCountdown(EVENT_DATE);
  return (
    <div className="fil-rise fil-d3" style={{ margin: "34px 0 0" }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTE, marginBottom: 12 }}>The roundtable begins in</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {([["Days", cd.days], ["Hours", cd.hours], ["Mins", cd.minutes], ["Secs", cd.seconds]] as const).map(([l, v]) => (
          <div key={l} style={{
            position: "relative", minWidth: 80, padding: "16px 18px", borderRadius: 16,
            background: "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 12px 32px rgba(0,0,0,0.32)",
            textAlign: "center", overflow: "hidden",
          }}>
            <span aria-hidden style={{ position: "absolute", top: 0, left: "14%", right: "14%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 50%, transparent)", pointerEvents: "none" }} />
            <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: WHITE, lineHeight: 1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{cd.mounted ? String(v).padStart(2, "0") : "--"}</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTE, marginTop: 8 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function FiligranPage() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor-reactive spotlight over the hero (updates the layer directly — no re-render)
  useEffect(() => {
    const hero = heroRef.current;
    const spot = spotRef.current;
    if (!hero || !spot || window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        spot.style.background = `radial-gradient(460px circle at ${x}px ${y}px, ${BLUE_BRIGHT}26, transparent 68%)`;
        spot.style.opacity = "1";
      });
    };
    const onLeave = () => { spot.style.opacity = "0"; };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => { hero.removeEventListener("mousemove", onMove); hero.removeEventListener("mouseleave", onLeave); cancelAnimationFrame(raf); };
  }, []);

  return (
    <main style={{ background: BG, color: WHITE, fontFamily: BODY, overflowX: "hidden", position: "relative" }}>
      {/* ── Nav ── */}
      <nav className="fil-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(18px, 4vw, 56px)", height: 82,
        background: scrolled ? "rgba(6,7,15,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
      }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }} aria-label="Filigran">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="Filigran" style={{ height: 32, width: "auto" }} />
        </button>
        <div className="fil-nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 2.6vw, 38px)" }}>
          {NAV_LINKS.slice(0, 4).map((l) => (
            <button key={l.id} onClick={() => scrollToId(l.id)} className="fil-navlink" style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: DISPLAY, fontSize: 15, fontWeight: 500, color: DIM, letterSpacing: "-0.01em",
              transition: "color 0.2s ease",
            }}>{l.label}</button>
          ))}
        </div>
        <button onClick={() => scrollToId("register")} className="fil-cta-sm" style={{
          fontFamily: DISPLAY, fontSize: 14.5, fontWeight: 600, color: WHITE,
          background: BLUE, border: "none", borderRadius: 10, padding: "12px 24px", cursor: "pointer",
          boxShadow: `0 6px 22px ${BLUE}55`, transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        }}>Register</button>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "112px clamp(18px, 5vw, 64px) 56px", overflow: "hidden" }}>
        {/* Base field — deep navy (top-left) flowing into electric cobalt (bottom-right) */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: `
          radial-gradient(135% 100% at 80% 118%, ${BLUE} 0%, ${BLUE_DEEP} 30%, transparent 60%),
          linear-gradient(162deg, ${BG} 0%, #070A1E 40%, #0A1140 74%, #0E1A66 100%)
        ` }} />
        {/* Slow-drifting aurora blooms */}
        <div className="fil-bloom fil-bloom-a" aria-hidden style={{
          position: "absolute", zIndex: 0, width: "70vw", height: "70vw", maxWidth: 960, maxHeight: 960,
          right: "-12%", bottom: "-26%", borderRadius: "50%",
          background: `radial-gradient(circle, ${BLUE_BRIGHT}55 0%, ${BLUE}26 38%, transparent 66%)`,
          filter: "blur(20px)",
        }} />
        <div className="fil-bloom fil-bloom-b" aria-hidden style={{
          position: "absolute", zIndex: 0, width: "52vw", height: "52vw", maxWidth: 680, maxHeight: 680,
          left: "-14%", top: "-18%", borderRadius: "50%",
          background: `radial-gradient(circle, ${BLUE}30 0%, ${BLUE_DEEP}33 42%, transparent 68%)`,
          filter: "blur(24px)",
        }} />
        {/* Hot electric core rising from the lower-right — the Filigran "Take Action" glow */}
        <div className="fil-bloom fil-bloom-c" aria-hidden style={{
          position: "absolute", zIndex: 0, width: "44vw", height: "30vw", maxWidth: 620, maxHeight: 420,
          right: "6%", bottom: "-6%", borderRadius: "50%",
          background: `radial-gradient(circle, ${BLUE_BRIGHT}4d 0%, transparent 70%)`,
          filter: "blur(40px)",
        }} />
        {/* Grid texture */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.42,
          backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(120% 100% at 50% 32%, #000 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(120% 100% at 50% 32%, #000 0%, transparent 78%)",
        }} />
        {/* Fine grain for a premium, non-flat surface */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.5, mixBlendMode: "overlay", pointerEvents: "none",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }} />
        {/* Edge vignette + top fade to keep nav + type crisp */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: `radial-gradient(120% 90% at 50% 46%, transparent 52%, ${BG}cc 100%), linear-gradient(180deg, ${BG}d9 0%, transparent 24%)`,
        }} />
        {/* Cursor-reactive spotlight (updated imperatively on mousemove) */}
        <div ref={spotRef} aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0, transition: "opacity 0.4s ease", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto", width: "100%" }}>
          <div className="fil-rise" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 16px", borderRadius: 100, border: `1px solid ${BLUE_BRIGHT}55`, background: `linear-gradient(${BLUE}2e, ${BLUE}12)`, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 18px ${BLUE}33`, marginBottom: 26 }}>
            <span className="fil-live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE_BRIGHT, boxShadow: `0 0 10px ${BLUE_BRIGHT}` }} />
            <span style={{ fontFamily: DISPLAY, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>Online Roundtable</span>
          </div>

          <h1 className="fil-rise fil-d1" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(38px, 6.6vw, 86px)", lineHeight: 1.02, letterSpacing: "-0.035em", margin: 0, color: WHITE }}>
            {TITLE}
            <span style={{ display: "block", fontWeight: 600, fontSize: "clamp(19px, 2.6vw, 34px)", lineHeight: 1.18, letterSpacing: "-0.02em", marginTop: 18, color: DIM }}>
              Supercharge your CTI and Exposure Validation teams{" "}
              <span className="fil-shimmer">with AI Agents</span>
            </span>
          </h1>

          <p className="fil-rise fil-d2" style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.6, color: DIM, maxWidth: 660, margin: "26px 0 0" }}>{TAGLINE}</p>

          {/* Info bar */}
          <div className="fil-rise fil-d3 fil-infobar" style={{ display: "inline-flex", alignItems: "center", flexWrap: "wrap", gap: "clamp(14px, 2vw, 26px)", margin: "34px 0 0", padding: "14px 22px", borderRadius: 16, background: "rgba(255,255,255,0.045)", border: `1px solid ${BORDER}`, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 10px 34px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <InfoItem icon="cal" label="7 July 2026" />
            <Divider />
            <InfoItem icon="clock" label="11:00 AM GST" />
            <Divider />
            <InfoItem icon="time" label="70 minutes" />
            <Divider />
            <InfoItem icon="globe" label="Online Roundtable" />
          </div>

          {/* Countdown (isolated so the per-second tick doesn't re-render the page) */}
          <Countdown />

          <div className="fil-rise fil-d4" style={{ display: "flex", gap: 14, margin: "36px 0 0", flexWrap: "wrap" }}>
            <button onClick={() => scrollToId("register")} className="fil-cta fil-cta-hero" style={{
              position: "relative", overflow: "hidden",
              fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: WHITE, background: BLUE,
              border: "none", borderRadius: 11, padding: "15px 30px", cursor: "pointer",
              boxShadow: `0 10px 32px ${BLUE}66`, transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
            }}><span style={{ position: "relative", zIndex: 1 }}>Reserve your seat <span aria-hidden style={{ marginLeft: 6 }}>→</span></span></button>
            <button onClick={() => scrollToId("overview")} className="fil-cta-ghost" style={{
              fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: WHITE, background: "transparent",
              border: `1px solid ${BORDER}`, borderRadius: 11, padding: "15px 30px", cursor: "pointer",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}>What you&apos;ll learn</button>
          </div>
        </div>
      </section>

      {/* ══ One continuous surface for everything below the hero ══ */}
      <div style={{ position: "relative", background: SECTION_BG }}>
        {/* Ambient glow orbs drifting down the surface (matches Filigran's lit background) */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `
            radial-gradient(960px 420px at 50% 0%, ${CYAN}22, transparent 70%),
            radial-gradient(620px 620px at -4% 7%, ${TEAL}48, transparent 66%),
            radial-gradient(720px 720px at 105% 18%, ${BLUE}3a, transparent 66%),
            radial-gradient(520px 520px at 5% 37%, ${CYAN}30, transparent 66%),
            radial-gradient(660px 660px at 103% 54%, ${TEAL}4a, transparent 66%),
            radial-gradient(600px 600px at -5% 73%, ${BLUE}34, transparent 66%),
            radial-gradient(580px 580px at 101% 90%, ${TEAL}40, transparent 66%)
          `,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>

      {/* ── Overview ── */}
      <Section id="overview" eyebrow="The Session" title="From periodic exercise to daily operating model.">
        <div className="fil-overview" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 22, maxWidth: 1080, margin: "0 auto" }}>
          {/* From → To transformation strip */}
          <div className="fil-transform" style={{ display: "flex", alignItems: "stretch", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px", padding: "20px 24px", borderRadius: 16, background: CARD, border: `1px solid ${BORDER}` }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTE, marginBottom: 8 }}>Today</div>
              <div style={{ fontFamily: DISPLAY, fontSize: "clamp(18px,2vw,22px)", fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}>Periodic exercise</div>
            </div>
            <div className="fil-arrow" aria-hidden style={{ display: "flex", alignItems: "center", justifyContent: "center", color: BLUE_BRIGHT, padding: "0 4px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
            </div>
            <div style={{ flex: "1 1 240px", padding: "20px 24px", borderRadius: 16, background: `linear-gradient(150deg, ${BLUE}26, ${CARD})`, border: `1px solid ${BLUE_BRIGHT}55`, boxShadow: `0 10px 34px ${BLUE}26` }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: BLUE_BRIGHT, marginBottom: 8 }}>Agentic CTEM</div>
              <div style={{ fontFamily: DISPLAY, fontSize: "clamp(18px,2vw,22px)", fontWeight: 600, color: WHITE, letterSpacing: "-0.01em" }}>Daily operating model</div>
            </div>
          </div>

          {/* Lead intro — headline sentence + supporting detail */}
          <div className="fil-intro" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(24px,3.4vw,48px)", alignItems: "start", padding: "clamp(26px,3vw,42px)", borderRadius: 20, background: CARD, border: `1px solid ${BORDER}` }}>
            <p style={{ fontFamily: DISPLAY, fontSize: "clamp(19px,2vw,25px)", lineHeight: 1.38, fontWeight: 500, color: WHITE, letterSpacing: "-0.015em", margin: 0 }}>{ABOUT_LEAD}</p>
            <p style={{ fontFamily: BODY, fontSize: "clamp(14px,1.3vw,16px)", lineHeight: 1.72, color: DIM, margin: 0 }}>{ABOUT_REST}</p>
          </div>

          {/* Problem / Why — tabbed to cut visible text */}
          <SessionTabs />
        </div>
      </Section>

      {/* ── Takeaways ── */}
      <Section id="takeaways" eyebrow="Key Takeaways" title="What you'll walk away with.">
        <div className="fil-takeaways" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 1080, margin: "0 auto" }}>
          {TAKEAWAYS.map((t, i) => (
            <div key={i} className="fil-tk-card" style={{
              position: "relative", display: "flex", flexDirection: "column", contain: "content",
              padding: "clamp(30px,3.2vw,44px) clamp(28px,2.8vw,38px)",
              borderRadius: 22,
              background: "linear-gradient(150deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.035) 42%, rgba(255,255,255,0.012) 100%)",
              backdropFilter: "blur(22px) saturate(150%)", WebkitBackdropFilter: "blur(22px) saturate(150%)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 1px rgba(255,255,255,0.05), inset 0 0 28px rgba(255,255,255,0.03), 0 24px 60px rgba(0,0,0,0.45)",
              overflow: "hidden",
              transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.45s ease, box-shadow 0.45s ease",
            }}>
              {/* blue refraction glow rising from the base */}
              <span aria-hidden className="fil-tk-glow" style={{ position: "absolute", left: "50%", bottom: -120, transform: "translateX(-50%)", width: "140%", height: 230, borderRadius: "50%", background: `radial-gradient(ellipse at center, ${BLUE}33, transparent 66%)`, pointerEvents: "none", opacity: i === 0 ? 0.9 : 0.55, transition: "opacity 0.45s ease", zIndex: 0 }} />
              {/* top specular gloss — light reflecting across the glass */}
              <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "48%", background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 38%, transparent 100%)", pointerEvents: "none", zIndex: 1 }} />
              {/* corner specular bloom */}
              <span aria-hidden style={{ position: "absolute", top: -40, left: -30, width: 180, height: 130, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.20), transparent 70%)", filter: "blur(12px)", pointerEvents: "none", zIndex: 1 }} />
              {/* bright top rim */}
              <span aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 50%, transparent)", pointerEvents: "none", zIndex: 2 }} />
              {/* liquid sheen sweep on hover */}
              <span aria-hidden className="fil-tk-sheen" style={{ position: "absolute", top: 0, bottom: 0, left: "-150%", width: "60%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.14), transparent)", transform: "skewX(-18deg)", pointerEvents: "none", zIndex: 2 }} />
              {/* hero topic */}
              <h3 style={{ position: "relative", zIndex: 3, fontFamily: DISPLAY, fontSize: "clamp(24px,2.5vw,33px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.06, color: WHITE, margin: "0 0 16px" }}>{t.tag}</h3>
              {/* description */}
              <p style={{ position: "relative", zIndex: 3, fontFamily: BODY, fontSize: "clamp(14.5px,1.35vw,16px)", lineHeight: 1.62, color: "rgba(255,255,255,0.66)", margin: 0 }}>{t.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Speakers ── */}
      <Section id="speakers" eyebrow="Speakers" title="Meet the practitioners.">
        <div className="fil-speakers" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 340px))", gap: 24, justifyContent: "center", maxWidth: 1080, margin: "0 auto" }}>
          {SPEAKERS.map((s) => (
            <article key={s.name} className="fil-sp-card" style={{ borderRadius: 18, overflow: "hidden", background: CARD, border: `1px solid ${BORDER}`, transition: "transform 0.3s ease, border-color 0.3s ease" }}>
              <div style={{ position: "relative", aspectRatio: "1 / 1", background: `linear-gradient(160deg, ${BLUE_DEEP}66, ${BG_2})`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {s.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.photo} alt={s.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                ) : (
                  <span style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 700, color: "rgba(255,255,255,0.22)", letterSpacing: "-0.03em" }}>{s.initials}</span>
                )}
                <span style={{ position: "absolute", top: 14, left: 14, fontFamily: DISPLAY, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: WHITE, background: BLUE, padding: "5px 11px", borderRadius: 6 }}>Panelist</span>
              </div>
              <div style={{ padding: "20px 22px" }}>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, color: WHITE, margin: 0, letterSpacing: "-0.02em" }}>{s.name}</h3>
                <p style={{ fontFamily: BODY, fontSize: 13.5, color: DIM, margin: "7px 0 0", lineHeight: 1.45 }}>{s.role} · {s.org}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ── About Filigran ── */}
      <Section id="about" eyebrow="About Filigran" title="Open-source, threat-informed security.">
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ padding: "clamp(26px,3.4vw,42px)", borderRadius: 20, background: CARD, border: `1px solid ${BORDER}` }}>
            <p style={{ fontFamily: BODY, fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.78, color: DIM, margin: 0 }}>
              Filigran, a cybersecurity company founded in France in 2022, stands out in the cybersecurity landscape with its unique open-source, threat-informed approach to Continuous Threat Exposure Management (CTEM). Underpinned by an agentic foundation, Filigran&apos;s eXtended Threat Management (XTM) platform delivers proactive security. The platform is trusted by over 6,000 organizations worldwide and includes OpenCTI for threat intelligence, OpenAEV for adversarial exposure validation, and OpenGRC (forthcoming) for governance, risk, and compliance.
            </p>
            <div style={{ display: "flex", gap: 13, flexWrap: "wrap", marginTop: 26 }}>
              <a href="https://filigran.io/platform/xtm-one/" target="_blank" rel="noopener noreferrer" className="fil-link-btn" style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 600, color: WHITE, background: BLUE, borderRadius: 10, padding: "12px 22px", textDecoration: "none", transition: "background 0.2s ease, transform 0.2s ease" }}>Discover XTM One →</a>
              <a href="https://filigran.io/book-a-demo/?utm_medium=webinar&utm_source=thirdpartywebinar&utm_campaign=Webinar-with-EFG" target="_blank" rel="noopener noreferrer" className="fil-link-btn" style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 600, color: WHITE, background: BLUE, borderRadius: 10, padding: "12px 22px", textDecoration: "none", transition: "background 0.2s ease, transform 0.2s ease" }}>Book a demo →</a>
              <a href="https://filigran.io/" target="_blank" rel="noopener noreferrer" className="fil-link-ghost" style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 600, color: WHITE, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 22px", textDecoration: "none", transition: "background 0.2s ease, border-color 0.2s ease" }}>filigran.io</a>
            </div>
          </div>

          {/* Customer stories */}
          <h3 style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BLUE_BRIGHT, margin: "32px 0 16px", textAlign: "center" }}>Customer stories</h3>
          <div className="fil-res" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {CUSTOMER_STORIES.map((c) => (
              <a key={c.url} href={c.url} target="_blank" rel="noopener noreferrer" className="fil-res-card" style={{ display: "flex", alignItems: "center", gap: 13, padding: "16px 18px", borderRadius: 13, background: CARD, border: `1px solid ${BORDER}`, textDecoration: "none", transition: "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease" }}>
                <span aria-hidden style={{ flex: "0 0 auto", width: 34, height: 34, borderRadius: 9, background: `${BLUE}1f`, border: `1px solid ${BLUE_BRIGHT}3a`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE_BRIGHT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </span>
                <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BLUE_BRIGHT }}>{c.tag}</span>
                  <span style={{ fontFamily: BODY, fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{c.title}</span>
                </span>
                <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MUTE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
              </a>
            ))}
          </div>

          {/* Resources */}
          <h3 style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BLUE_BRIGHT, margin: "32px 0 16px", textAlign: "center" }}>Resources for attendees</h3>
          <div className="fil-res" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {RESOURCES.map((r) => (
              <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="fil-res-card" style={{ display: "flex", alignItems: "center", gap: 13, padding: "16px 18px", borderRadius: 13, background: CARD, border: `1px solid ${BORDER}`, textDecoration: "none", transition: "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease" }}>
                <span aria-hidden style={{ flex: "0 0 auto", width: 34, height: 34, borderRadius: 9, background: `${BLUE}1f`, border: `1px solid ${BLUE_BRIGHT}3a`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE_BRIGHT} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                </span>
                <span style={{ flex: 1, fontFamily: BODY, fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{r.title}</span>
                <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MUTE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Registration ── */}
      <Section id="register" eyebrow="Register" title="Reserve your seat.">
        <RegistrationForm />
      </Section>

      {/* ── Footer ── */}
      <footer style={{ background: "transparent", borderTop: `1px solid ${BORDER}`, padding: "26px clamp(18px,5vw,64px)", contentVisibility: "auto", containIntrinsicSize: "auto 120px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "20px 32px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px 28px", flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="Filigran" loading="lazy" decoding="async" style={{ height: 24, width: "auto", opacity: 0.92 }} />
            <a href="https://www.linkedin.com/company/filigran" target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY, fontSize: 13.5, color: DIM, textDecoration: "none" }}>LinkedIn</a>
            <a href="https://filigran.io/contact?utm_medium=webinar&utm_source=thirdpartywebinar&utm_campaign=Webinar-with-EFG" target="_blank" rel="noopener noreferrer" style={{ fontFamily: BODY, fontSize: 13.5, color: DIM, textDecoration: "none" }}>Contact</a>
          </div>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 11, textDecoration: "none" }} aria-label="Produced by Events First Group">
            <span style={{ fontFamily: BODY, fontSize: 12, color: MUTE, letterSpacing: "0.04em" }}>Produced by</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/events-first-group_logo_alt.svg" alt="Events First Group" loading="lazy" decoding="async" style={{ height: 26, width: "auto", opacity: 0.9 }} />
          </Link>
        </div>
      </footer>

        </div>
      </div>
      {/* ══ end shared surface ══ */}

      <style jsx global>{`
        .fil-navlink:hover { color: ${WHITE} !important; }
        .fil-cta-sm:hover, .fil-cta:hover, .fil-link-btn:hover { background: ${BLUE_BRIGHT} !important; transform: translateY(-1px); }
        .fil-cta-ghost:hover, .fil-link-ghost:hover { background: rgba(255,255,255,0.05) !important; border-color: ${BLUE_BRIGHT}66 !important; }
        .fil-sp-card:hover { transform: translateY(-3px); border-color: ${BLUE_BRIGHT}55 !important; }
        .fil-res-card:hover { background: rgba(255,255,255,0.05) !important; border-color: ${BLUE_BRIGHT}55 !important; transform: translateY(-2px); }
        .fil-tk-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.28) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.42), inset 0 0 30px rgba(255,255,255,0.05), 0 32px 72px rgba(0,0,0,0.5) !important; }
        .fil-tk-card:hover .fil-tk-glow { opacity: 1; }
        .fil-tk-sheen { transition: left 0.95s cubic-bezier(0.22,1,0.36,1); }
        .fil-tk-card:hover .fil-tk-sheen { left: 150%; }

        .fil-rise { opacity: 0; transform: translateY(16px); animation: filRise 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .fil-d1 { animation-delay: 0.06s; }
        .fil-d2 { animation-delay: 0.14s; }
        .fil-d3 { animation-delay: 0.22s; }
        .fil-d4 { animation-delay: 0.30s; }
        @keyframes filRise { to { opacity: 1; transform: none; } }

        .fil-bloom { will-change: transform, opacity; }
        .fil-bloom-a { animation: filDriftA 16s ease-in-out infinite; }
        .fil-bloom-b { animation: filDriftB 19s ease-in-out infinite; }
        .fil-bloom-c { animation: filPulse 9s ease-in-out infinite; }
        @keyframes filDriftA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-4%,-5%) scale(1.08); } }
        @keyframes filDriftB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(5%,4%) scale(1.1); } }
        @keyframes filPulse { 0%,100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }

        .fil-shimmer {
          background: linear-gradient(100deg, ${BLUE_BRIGHT} 0%, ${BLUE_BRIGHT} 32%, #aebcff 50%, ${BLUE_BRIGHT} 68%, ${BLUE_BRIGHT} 100%);
          background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: filShimmer 5s linear infinite;
        }
        @keyframes filShimmer { to { background-position: -220% 0; } }

        .fil-live-dot { animation: filLive 2.4s ease-in-out infinite; }
        @keyframes filLive { 0%,100% { opacity: 1; box-shadow: 0 0 10px ${BLUE_BRIGHT}; } 50% { opacity: 0.55; box-shadow: 0 0 4px ${BLUE_BRIGHT}; } }

        .fil-cta-hero::after {
          content: ""; position: absolute; top: 0; bottom: 0; left: -160%; width: 55%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.32), transparent);
          transform: skewX(-20deg); pointer-events: none;
          animation: filSheen 5s ease-in-out infinite;
        }
        @keyframes filSheen { 0%,12% { left: -160%; } 48%,100% { left: 180%; } }

        .fil-tabpanel { animation: filFade 0.34s ease; }
        @keyframes filFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        @media (prefers-reduced-motion: reduce) { .fil-rise { animation: none; opacity: 1; transform: none; } .fil-bloom, .fil-shimmer, .fil-cta-hero::after, .fil-live-dot { animation: none !important; } }

        @media (max-width: 860px) {
          .fil-nav-links { display: none !important; }
          .fil-two, .fil-takeaways, .fil-res, .fil-xtm, .fil-intro { grid-template-columns: 1fr !important; }
          .fil-transform .fil-arrow { transform: rotate(90deg); }
          .fil-speakers { grid-template-columns: minmax(0, 360px) !important; }
        }
        @media (max-width: 560px) {
          .fil-infobar .fil-div { display: none !important; }
          .fil-infobar { gap: 12px !important; }
        }
      `}</style>
    </main>
  );
}

// ─── Small components ────────────────────────────────────────────────────────
function Divider() {
  return <span className="fil-div" aria-hidden style={{ width: 1, height: 18, background: BORDER }} />;
}

function InfoItem({ icon, label }: { icon: "cal" | "clock" | "time" | "globe"; label: string }) {
  const paths: Record<string, React.ReactNode> = {
    cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    time: <><circle cx="12" cy="12" r="10" /><polyline points="12 7 12 12 15 15" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE_BRIGHT} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[icon]}</svg>
      <span style={{ fontFamily: DISPLAY, fontSize: 14.5, fontWeight: 500, color: "rgba(255,255,255,0.84)" }}>{label}</span>
    </span>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ position: "relative", padding: "clamp(40px, 4.2vh, 60px) clamp(18px, 5vw, 64px)", background: "transparent", contentVisibility: "auto", containIntrinsicSize: "auto 640px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto 30px" }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE_BRIGHT }}>{eyebrow}</span>
        <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4.2vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: WHITE, margin: "14px 0 0", maxWidth: 760 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ─── Session tabs (Problem / Why attend) ─────────────────────────────────────
const SESSION_TABS = {
  problem: {
    label: "The problem",
    lead: PROBLEM_LEAD, rest: PROBLEM_REST,
    icon: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  },
  why: {
    label: "Why attend",
    lead: WHY_LEAD, rest: WHY_REST,
    icon: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  },
} as const;

function SessionTabs() {
  const [tab, setTab] = useState<keyof typeof SESSION_TABS>("problem");
  const active = SESSION_TABS[tab];
  return (
    <div style={{ padding: "clamp(22px,3vw,34px)", borderRadius: 20, background: `linear-gradient(160deg, ${BLUE}14, ${CARD})`, border: `1px solid ${BORDER}` }}>
      <div role="tablist" aria-label="Session detail" style={{ display: "inline-flex", gap: 5, padding: 5, borderRadius: 14, background: BG, border: `1px solid ${BORDER}`, marginBottom: 26 }}>
        {(Object.keys(SESSION_TABS) as Array<keyof typeof SESSION_TABS>).map((k) => {
          const on = tab === k;
          return (
            <button key={k} role="tab" aria-selected={on} onClick={() => setTab(k)} style={{
              display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
              fontFamily: DISPLAY, fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em",
              padding: "10px 18px", borderRadius: 10, border: "none",
              background: on ? BLUE : "transparent", color: on ? WHITE : DIM,
              boxShadow: on ? `0 6px 18px ${BLUE}55` : "none", transition: "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={on ? WHITE : BLUE_BRIGHT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{SESSION_TABS[k].icon}</svg>
              {SESSION_TABS[k].label}
            </button>
          );
        })}
      </div>
      <div key={tab} className="fil-tabpanel" role="tabpanel">
        <p style={{ fontFamily: BODY, fontSize: "clamp(17px,1.7vw,20px)", lineHeight: 1.5, color: WHITE, fontWeight: 500, letterSpacing: "-0.01em", margin: "0 0 14px", maxWidth: 880 }}>{active.lead}</p>
        <p style={{ fontFamily: BODY, fontSize: "clamp(14px,1.3vw,15.5px)", lineHeight: 1.74, color: DIM, margin: 0, maxWidth: 880 }}>{active.rest}</p>
      </div>
    </div>
  );
}

// ─── Registration form ───────────────────────────────────────────────────────
const EMPTY = { firstName: "", lastName: "", email: "", company: "", jobTitle: "", phone: "" };

function RegistrationForm() {
  const [form, setForm] = useState({ ...EMPTY });
  const [country, setCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
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
      event_name: "Filigran Roundtable — Agentic CTEM in Practice",
    });
    setLoading(false);
    if (res.success) { setDone(true); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else setErr(res.error || "Something went wrong. Please try again.");
  };

  return (
    <div ref={topRef} style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ padding: "clamp(24px, 3.4vw, 42px)", borderRadius: 20, background: CARD, border: `1px solid ${BORDER}`, boxShadow: `0 30px 80px rgba(0,0,0,0.45)` }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: BLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 8px 26px ${BLUE}66` }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: WHITE, margin: 0, letterSpacing: "-0.02em" }}>You&apos;re registered.</h3>
            <p style={{ fontFamily: BODY, fontSize: 15, color: DIM, margin: "12px auto 0", maxWidth: 420, lineHeight: 1.6 }}>Thank you — we&apos;ll be in touch with joining details for the roundtable on 7 July 2026.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fil-form" noValidate>
            <div className="fil-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="First name" req><input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First name" suppressHydrationWarning /></Field>
              <Field label="Last name" req><input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last name" suppressHydrationWarning /></Field>
            </div>
            <Field label="Work email" req><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" suppressHydrationWarning /></Field>
            <div className="fil-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Company" req><input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company" suppressHydrationWarning /></Field>
              <Field label="Job title"><input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="Job title" suppressHydrationWarning /></Field>
            </div>
            <Field label="Phone" req>
              <div style={{ display: "flex", gap: 10 }}>
                <select
                  value={country.code + country.country}
                  onChange={(e) => {
                    const c = COUNTRY_CODES.find((x) => x.code + x.country === e.target.value);
                    if (c) {
                      setCountry(c);
                      // Re-clamp the existing number to the new country's digit length
                      setForm((p) => ({ ...p, phone: p.phone.replace(/\D/g, "").slice(0, c.length) }));
                    }
                  }}
                  suppressHydrationWarning
                  style={{ flex: "0 0 auto", width: 110 }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code + c.country} value={c.code + c.country}>{c.country} {c.code}</option>
                  ))}
                </select>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, country.length))} placeholder={country.placeholder} inputMode="numeric" maxLength={country.length} suppressHydrationWarning style={{ flex: 1 }} />
              </div>
            </Field>

            {err && <p style={{ fontFamily: BODY, fontSize: 13.5, color: "#ff7a7a", margin: "16px 0 0" }}>{err}</p>}

            <button type="submit" disabled={loading} suppressHydrationWarning className="fil-cta" style={{
              width: "100%", marginTop: 20, height: 52, border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: WHITE, background: BLUE, opacity: loading ? 0.65 : 1,
              boxShadow: `0 10px 30px ${BLUE}55`, transition: "background 0.2s ease, transform 0.2s ease",
            }}>{loading ? "Submitting…" : "Reserve your seat"}</button>
            <p style={{ fontFamily: BODY, fontSize: 11.5, color: MUTE, textAlign: "center", margin: "14px 0 0", lineHeight: 1.5 }}>By registering you agree to be contacted by Events First Group and Filigran about this roundtable.</p>
          </form>
        )}
      </div>

      <style jsx global>{`
        .fil-form label { font-family: ${DISPLAY}; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${MUTE}; }
        .fil-form input, .fil-form select {
          width: 100%; padding: 13px 14px; margin-top: 8px;
          background: ${BG}; border: 1px solid ${BORDER}; border-radius: 10px;
          font-family: ${BODY}; font-size: 16px; color: ${WHITE}; outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .fil-form select { margin-top: 0; }
        .fil-form input::placeholder { color: rgba(255,255,255,0.32); }
        .fil-form input:focus, .fil-form select:focus { border-color: ${BLUE_BRIGHT}; box-shadow: 0 0 0 3px ${BLUE}33; }
        .fil-form > .fil-field, .fil-form .fil-form-row { margin-top: 16px; }
        .fil-form option { background: ${BG}; color: ${WHITE}; }
        @media (max-width: 560px) { .fil-form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Field({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div className="fil-field">
      <label>{label}{req && <span style={{ color: BLUE_BRIGHT }}> *</span>}</label>
      {children}
    </div>
  );
}
