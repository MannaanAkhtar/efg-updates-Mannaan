"use client";

import React, { useEffect, useRef, useState } from "react";
import { submitForm, isWorkEmail, validatePhone, COUNTRY_CODES, type CountryCode } from "@/lib/form-helpers";

/* ═══════════════════════════════════════════════════════════════════════════
   AlgoSec Executive Roundtable: "AlgoCity: Escape the Complexity"
   Brand system (AlgoSec brandbook): Lato, blue/green palette, curved swoosh
   shapes, line-art icons. Event theme: escape-challenge / city-grid route,
   locks & keys, moving complexity → visibility → control → secure connectivity.
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const INK = "#0B1B3A";      // deepest page dark (matches AlgoCity night-grid)
const UDB = "#152e53";      // AlgoSec ultra-dark-blue
const NAVY = "#00528b";     // AlgoSec primary dark blue
const UIBLUE = "#0070C1";   // AlgoSec UI blue
const SKY = "#44ade2";      // AlgoSec light blue
const GREEN = "#a6ce39";    // AlgoSec green
const GOLD = "#F2B950";     // escape-challenge key / checkpoint accent

const PAPER = "#FFFFFF";
const SOFT = "#F2F7FC";
const INKT = "#152e53";     // ink text on light
const INK_SOFT = "#41506a"; // secondary text on light
const MUTE = "#7688a3";     // muted labels on light
const LINE = "rgba(21,46,83,0.10)";
const LINE_STRONG = "rgba(21,46,83,0.16)";

const WHITE = "#ffffff";
const DIM = "rgba(255,255,255,0.74)";
const DIM2 = "rgba(255,255,255,0.5)";

const FONT = "var(--font-lato), system-ui, sans-serif";

// ─── Assets ───────────────────────────────────────────────────────────────────
const HERO_IMG = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/ChatGPT+Image+Aug+24%2C+2026%2C+10_04_44+AM.png";
// Official AlgoSec master logo (full-colour). Rendered white on dark nav/footer via a knockout filter.
const LOGO_ALGOSEC = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/AlgoSecLOGO-eps.png";

const EVENT = {
  title: "AlgoCity: Escape the Complexity",
  sub: "Securing Application Connectivity Across the Hybrid Enterprise",
  tagline:
    "An executive roundtable where security leaders decode Real-world Application Connectivity challenges, escape policy complexity, and explore how application context, automation and AI-assisted discovery can accelerate secure application delivery.",
  date: "24 September 2026",
  city: "Dubai, UAE",
  venue: "Waldorf Astoria Dubai International Financial Centre",
  time: "11:00 AM – 1:00 PM GST (UTC+4)",
  duration: "120 minutes",
  format: "Closed-door executive roundtable + gamified opening challenge + networking lunch",
};

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#agenda", label: "Agenda" },
  { href: "#speakers", label: "Speakers" },
  { href: "#about", label: "About AlgoSec" },
];

// ─── Brand mark (official logo with a temporary wordmark fallback) ────────────
// NOTE: LOGO_ALGOSEC must point at the official AlgoSec master logo. Until that
// asset is uploaded, this falls back to a plain Lato wordmark so the nav/footer
// never render a broken image. Replace with master artwork; do not recreate.
function BrandMark({ height, white }: { height: number; white: boolean }) {
  const [ok, setOk] = useState(true);
  if (ok) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={LOGO_ALGOSEC} onError={() => setOk(false)} alt="AlgoSec" style={{ height, width: "auto", filter: white ? "brightness(0) invert(1)" : "none", transition: "filter 0.3s ease", display: "block" }} />
    );
  }
  return (
    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: Math.round(height * 0.72), letterSpacing: "-0.03em", lineHeight: 1, color: white ? "#fff" : INKT }}>
      algo<span style={{ color: SKY }}>sec</span>
    </span>
  );
}

// ─── Reveal-on-scroll hook ────────────────────────────────────────────────────
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
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
  return { ref, seen } as const;
}
const rise = (seen: boolean, d = 0) => ({
  opacity: seen ? 1 : 0,
  transform: seen ? "translateY(0)" : "translateY(20px)",
  transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${d}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${d}s`,
});

// ─── Shared decorative bits ───────────────────────────────────────────────────
function GridBg({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity, zIndex: 0 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${SKY}14 1px, transparent 1px), linear-gradient(90deg, ${SKY}14 1px, transparent 1px)`, backgroundSize: "46px 46px", maskImage: "radial-gradient(120% 90% at 50% 0%, #000 30%, transparent 78%)", WebkitMaskImage: "radial-gradient(120% 90% at 50% 0%, #000 30%, transparent 78%)" }} />
      <div style={{ position: "absolute", top: "-12%", right: "-6%", width: 620, height: 620, borderRadius: "50%", background: `radial-gradient(circle, ${UIBLUE}30, transparent 66%)`, filter: "blur(20px)" }} />
      <div style={{ position: "absolute", bottom: "-16%", left: "-8%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${NAVY}44, transparent 66%)`, filter: "blur(20px)" }} />
    </div>
  );
}


// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav className={`ac-nav ${scrolled ? "ac-nav--solid" : "ac-nav--top"}`} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 5vw, 56px)", height: 74, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="AlgoSec" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
          <BrandMark height={40} white={!scrolled} />
        </button>
        <div className="ac-nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(18px, 2.4vw, 34px)" }}>
          {NAV_LINKS.map((l) => (
            <button key={l.href} onClick={() => go(l.href)} className="ac-navlink" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 14.5, fontWeight: 600, padding: "6px 2px", transition: "color 0.2s ease" }}>{l.label}</button>
          ))}
          <button onClick={() => go("#register")} className="ac-nav-cta" style={{ fontFamily: FONT, fontSize: 14.5, fontWeight: 700, color: WHITE, background: UIBLUE, border: "none", borderRadius: 10, padding: "11px 20px", cursor: "pointer", boxShadow: `0 8px 22px ${UIBLUE}55`, transition: "background 0.2s ease, transform 0.2s ease" }}>Reserve a seat</button>
        </div>
        <button className="ac-nav-burger" onClick={() => setOpen((v) => !v)} aria-label="Menu" style={{ display: "none", background: "none", border: "none", cursor: "pointer" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={scrolled ? INKT : "#fff"} strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
      {open && (
        <div className="ac-nav-mobile" style={{ background: WHITE, borderTop: `1px solid ${LINE}`, padding: "10px clamp(20px,5vw,56px) 18px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map((l) => (
            <button key={l.href} onClick={() => go(l.href)} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 16, fontWeight: 600, color: INKT, padding: "12px 0", borderBottom: `1px solid ${LINE}` }}>{l.label}</button>
          ))}
          <button onClick={() => go("#register")} style={{ marginTop: 12, fontFamily: FONT, fontSize: 15.5, fontWeight: 700, color: WHITE, background: UIBLUE, border: "none", borderRadius: 10, padding: "13px 20px", cursor: "pointer" }}>Reserve a seat</button>
        </div>
      )}
      <style jsx global>{`
        .ac-nav--top { background: transparent; border-bottom: 1px solid transparent; }
        .ac-nav--solid { background: rgba(255,255,255,0.94); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid ${LINE}; box-shadow: 0 6px 26px rgba(10,18,34,0.06); }
        .ac-nav--top .ac-navlink { color: rgba(255,255,255,0.88); }
        .ac-nav--top .ac-navlink:hover { color: #fff; }
        .ac-nav--solid .ac-navlink { color: ${INK_SOFT}; }
        .ac-nav--solid .ac-navlink:hover { color: ${NAVY}; }
        .ac-nav-cta:hover { background: ${SKY} !important; transform: translateY(-1px); }
        @media (max-width: 900px) {
          .ac-nav-links { display: none !important; }
          .ac-nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="ac-hero" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", background: INK, padding: "clamp(84px,10vh,108px) clamp(20px,5vw,56px) clamp(28px,4vh,48px)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_IMG} alt="AlgoCity: a night city-grid with a single illuminated, locked-down connectivity route" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "right center", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(90deg, ${INK} 0%, ${INK}f0 26%, ${INK}9c 52%, rgba(11,27,58,0.15) 78%, transparent 100%)` }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(180deg, ${INK}cc 0%, transparent 26%, transparent 66%, ${INK}dd 100%)` }} />
      {/* Mobile-only: the horizontal scrim above only darkens the left half, so on narrow screens
          the full-width copy sits over the bright grid. This flat vertical scrim keeps it legible. */}
      <div aria-hidden className="ac-hero-mobile-scrim" style={{ position: "absolute", inset: 0, zIndex: 1, display: "none", background: `linear-gradient(180deg, rgba(11,27,58,0.90) 0%, rgba(11,27,58,0.80) 50%, rgba(11,27,58,0.94) 100%)` }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <div className="ac-rise ac-d1" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 15px", borderRadius: 100, background: "rgba(68,173,226,0.12)", border: `1px solid ${SKY}44`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN, boxShadow: `0 0 10px ${GREEN}` }} />
            <span style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#DDEEFB" }}>Executive Roundtable · Dubai</span>
          </div>

          <h1 className="ac-rise ac-d2" style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(36px, 5.6vw, 66px)", lineHeight: 1.02, letterSpacing: "-0.03em", color: WHITE, margin: "16px 0 0", textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}>
            AlgoCity:<br /><span style={{ color: SKY }}>Escape</span> the Complexity
          </h1>

          <p className="ac-rise ac-d3" style={{ fontFamily: FONT, fontWeight: 700, fontSize: "clamp(16px, 1.7vw, 21px)", color: "#CFE3F5", margin: "14px 0 0", letterSpacing: "-0.01em" }}>
            {EVENT.sub}
          </p>

          <p className="ac-rise ac-d3" style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(14.5px, 1.35vw, 16.5px)", lineHeight: 1.6, color: DIM, margin: "12px 0 0", maxWidth: 620 }}>
            {EVENT.tagline}
          </p>

          {/* Meta chips */}
          <div className="ac-rise ac-d4" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
            {[
              [`${EVENT.date} · ${EVENT.city}`, "cal"],
              [EVENT.venue, "pin"],
              [EVENT.time, "clock"],
              [EVENT.duration, "hourglass"],
              ["Closed-door", "lock"],
            ].map(([label, icon]) => (
              <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "10px 15px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                <HeroIcon type={icon as string} />
                <span style={{ fontFamily: FONT, fontSize: 13.5, fontWeight: 600, color: "#EAF3FB" }}>{label}</span>
              </span>
            ))}
          </div>

          <Countdown />

          <div className="ac-rise ac-d6" style={{ display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
            <button onClick={() => document.querySelector("#register")?.scrollIntoView({ behavior: "smooth" })} className="ac-cta-primary" style={{ fontFamily: FONT, fontSize: 15.5, fontWeight: 700, color: WHITE, background: UIBLUE, border: "none", borderRadius: 12, padding: "15px 28px", cursor: "pointer", boxShadow: `0 14px 34px ${UIBLUE}66`, transition: "background 0.2s, transform 0.2s" }}>Reserve a seat</button>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .ac-rise { opacity: 0; transform: translateY(24px); animation: ac-rise 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
        .ac-d1 { animation-delay: 0.05s; } .ac-d2 { animation-delay: 0.16s; } .ac-d3 { animation-delay: 0.28s; } .ac-d4 { animation-delay: 0.4s; } .ac-d5 { animation-delay: 0.52s; } .ac-d6 { animation-delay: 0.62s; }
        @keyframes ac-rise { to { opacity: 1; transform: translateY(0); } }
        .ac-cta-primary:hover { background: ${SKY} !important; transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) { .ac-rise { animation: none; opacity: 1; transform: none; } }
        @media (max-width: 640px) { .ac-hero img { object-position: 72% center !important; } .ac-hero-mobile-scrim { display: block !important; } }
      `}</style>
    </section>
  );
}
function HeroIcon({ type }: { type: string }) {
  const p = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: SKY, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "cal") return <svg {...p}><rect x="3.5" y="4.5" width="17" height="16" rx="2" /><path d="M3.5 9h17M8 2.5v4M16 2.5v4" /></svg>;
  if (type === "clock") return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
  if (type === "hourglass") return <svg {...p}><path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" /></svg>;
  if (type === "pin") return <svg {...p}><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>;
  return <svg {...p} stroke={GOLD}><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></svg>;
}
// Live countdown to the roundtable (24 Sep 2026, 11:00 AM GST / UTC+4)
const EVENT_TS = new Date("2026-09-24T11:00:00+04:00").getTime();
function Countdown() {
  const [diff, setDiff] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setDiff(Math.max(0, EVENT_TS - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const d = diff ?? 0;
  const units: [string, number][] = [
    ["Days", Math.floor(d / 86400000)],
    ["Hours", Math.floor((d % 86400000) / 3600000)],
    ["Mins", Math.floor((d % 3600000) / 60000)],
    ["Secs", Math.floor((d % 60000) / 1000)],
  ];
  return (
    <div className="ac-rise ac-d5" style={{ marginTop: 22 }}>
      <span style={{ display: "block", fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: SKY, marginBottom: 9 }}>Roundtable begins in</span>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {units.map(([label, val]) => (
          <div key={label} style={{ minWidth: 64, padding: "9px 13px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", textAlign: "center" }}>
            <div suppressHydrationWarning style={{ fontFamily: FONT, fontSize: 25, fontWeight: 900, color: WHITE, lineHeight: 1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{diff === null ? "––" : String(val).padStart(2, "0")}</div>
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: DIM2, marginTop: 5 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ESCAPE-ROUTE NARRATIVE (complexity → visibility → control → secure) ──────
const ROUTE = [
  { k: "Complexity", t: "Fragmented connectivity", d: "Application connectivity sprawls across data centers, cloud and distributed controls; policies are manual, siloed and hard to govern.", icon: "maze" },
  { k: "Visibility", t: "Application context", d: "See what actually needs to communicate, why, and which business service it supports, beyond IP addresses, ports and subnets.", icon: "eye" },
  { k: "Control", t: "Govern every change", d: "Automate policy change with guardrails so routine updates stop being slow, manual and risky.", icon: "shield" },
  { k: "Secure connectivity", t: "Anywhere", d: "Move from fragmented information to faster, application-centric decisions: secure delivery across the hybrid enterprise.", icon: "key" },
];
function RouteStrip() {
  const { ref, seen } = useReveal<HTMLDivElement>();
  return (
    <section style={{ position: "relative", background: `linear-gradient(180deg, ${PAPER} 0%, ${SOFT} 100%)`, color: INKT, padding: "clamp(46px,6vh,80px) clamp(20px,5vw,56px)", overflow: "hidden" }}>
      {/* faint light grid + soft glow */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `linear-gradient(${NAVY}0d 1px, transparent 1px), linear-gradient(90deg, ${NAVY}0d 1px, transparent 1px)`, backgroundSize: "48px 48px", maskImage: "radial-gradient(115% 80% at 50% 0%, #000 22%, transparent 78%)", WebkitMaskImage: "radial-gradient(115% 80% at 50% 0%, #000 22%, transparent 78%)" }} />
      <div aria-hidden style={{ position: "absolute", top: "-16%", right: "-6%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${SKY}1f, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-18%", left: "-8%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${GREEN}14, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />

      <div ref={ref} style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", ...rise(seen) }}>
          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: UIBLUE }}>The escape route</span>
          <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", letterSpacing: "-0.03em", lineHeight: 1.06, color: INKT, margin: "14px auto 0", maxWidth: 780 }}>
            From complexity to <span style={{ color: UIBLUE }}>secure application connectivity</span>.
          </h2>
          <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.6, color: INK_SOFT, margin: "16px auto 0", maxWidth: 620 }}>
            Four checkpoints on the way out: the arc the roundtable follows, from fragmented connectivity to secure delivery across the hybrid enterprise.
          </p>
        </div>

        <div className="ac-route" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "start", gap: "clamp(16px,1.6vw,22px)", marginTop: "clamp(48px,5.5vw,72px)" }}>
          {/* connective route line (complexity → secure) running behind the checkpoint badges */}
          <div aria-hidden className="ac-route-line" style={{ position: "absolute", top: 33, left: "12.5%", right: "12.5%", height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${UIBLUE}, ${SKY}, ${GREEN})`, opacity: seen ? 0.55 : 0, transition: "opacity 0.9s ease 0.35s", zIndex: 0 }} />
          {ROUTE.map((s, i) => {
            const end = i === 3;
            const accent = end ? GREEN : UIBLUE;
            const badge = end ? `linear-gradient(160deg, ${GREEN}, #7ba22c)` : `linear-gradient(160deg, ${SKY} -10%, ${UIBLUE} 55%, ${NAVY})`;
            return (
              <div key={s.k} className="ac-route-col" style={{ position: "relative", zIndex: 1, ...rise(seen, 0.14 + i * 0.1) }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span style={{ position: "relative", width: 66, height: 66, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: badge, border: `4px solid ${PAPER}`, boxShadow: `0 12px 26px ${accent}40, 0 0 0 7px ${accent}12` }}>
                    <RouteIcon type={s.icon} />
                    <span aria-hidden style={{ position: "absolute", top: -6, right: -6, minWidth: 22, height: 22, padding: "0 5px", borderRadius: 11, background: PAPER, color: accent, border: `1px solid ${accent}44`, fontFamily: FONT, fontSize: 11, fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(21,46,83,0.12)" }}>{i + 1}</span>
                  </span>
                </div>
                <div className="ac-route-card" style={{ marginTop: 18, background: PAPER, border: `1px solid ${LINE}`, borderRadius: 18, padding: "24px 20px", textAlign: "center", boxShadow: "0 12px 30px rgba(21,46,83,0.06)", transition: "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease" }}>
                  <div style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: accent }}>{s.k}</div>
                  <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(16px,1.5vw,19px)", color: INKT, margin: "8px 0 0", letterSpacing: "-0.01em" }}>{s.t}</h3>
                  <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 14, lineHeight: 1.62, color: INK_SOFT, margin: "10px 0 0" }}>{s.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx global>{`
        .ac-route-col:hover .ac-route-card { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(21,46,83,0.12); border-color: ${LINE_STRONG}; }
        @media (max-width: 860px) { .ac-route { grid-template-columns: 1fr 1fr !important; } .ac-route-line { display: none; } }
        @media (max-width: 480px) { .ac-route { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
function RouteIcon({ type, color = "#fff", size = 29 }: { type: string; color?: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "maze") return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="1.5" /><path d="M8 3.5v9h4v-5h4M8 20.5v-4h8v-4" /></svg>;
  if (type === "eye") return <svg {...p}><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.6" /></svg>;
  if (type === "shield") return <svg {...p}><path d="M12 2.5l7.5 3v5.5c0 5-3.4 8-7.5 10-4.1-2-7.5-5-7.5-10V5.5z" /><path d="M8.6 12l2.2 2.2 4.6-4.6" /></svg>;
  return <svg {...p}><circle cx="8" cy="8" r="4" /><path d="M11 11l7 7M15 15l2-2M17 17l2-2" /></svg>;
}

// ─── EVENT OVERVIEW ────────────────────────────────────────────────────────────
const OVERVIEW = [
  {
    eyebrow: "The roundtable",
    tag: "Complexity",
    icon: "maze",
    img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1100&q=80",
    label: "What is this roundtable about?",
    lead: "A closed-door session on how application-centric security improves visibility, reduces risk and accelerates policy change across hybrid environments.",
    points: [
      "Senior CISOs, CIOs, CTOs and network, cloud & security leaders in one room",
      "Opens with the AlgoCity “Escape the Complexity” challenge: real connectivity, ownership and change scenarios",
      "A core question: how much application context do teams get beyond IPs, ports and subnets?",
      "Explores discovery, automation and AI-assisted capabilities for faster, more informed decisions",
    ],
  },
  {
    eyebrow: "The problem",
    tag: "Visibility",
    icon: "eye",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1100&q=80",
    label: "What problem does it solve?",
    lead: "Security teams often lack a clear, application-centric view of what needs to communicate, why, and which business service it supports.",
    points: [
      "Connectivity spans increasingly complex hybrid and multi-cloud environments",
      "Fragmented context and ownership make even routine policy changes slow and manual",
      "An application-centric approach with automation and AI-assisted discovery reduces complexity",
      "Accelerates change while maintaining continuous security and compliance",
    ],
  },
  {
    eyebrow: "Why attend",
    tag: "Control",
    icon: "key",
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1100&q=80",
    label: "Why should you attend?",
    lead: "Benchmark your approach with senior peers and pressure-test real-world decisions inside the AlgoCity challenge.",
    points: [
      "Unify visibility, policy governance and secure change across hybrid environments",
      "Align connectivity decisions with business intent",
      "Connect the challenge to application-centric visibility, automation and AI-assisted discovery",
    ],
  },
];
function Overview() {
  return (
    <>
      {OVERVIEW.map((o, i) => (
        <OverviewBlock key={o.label} o={o} i={i} />
      ))}
    </>
  );
}
function OverviewBlock({ o, i }: { o: (typeof OVERVIEW)[number]; i: number }) {
  const { ref, seen } = useReveal<HTMLDivElement>();
  const flip = i % 2 === 1;
  const bg = i % 2 === 0 ? PAPER : SOFT;
  return (
    <section id={i === 0 ? "overview" : undefined} style={{ position: "relative", background: bg, padding: "clamp(38px,4.5vh,60px) clamp(20px,5vw,56px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: flip ? "auto" : "-10%", bottom: flip ? "-10%" : "auto", [flip ? "left" : "right"]: "-6%", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${SKY}12, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />
      <div ref={ref} style={{ position: "relative", zIndex: 1, maxWidth: 1140, margin: "0 auto" }}>
        <div className={`ac-ovb ${flip ? "ac-ovb--flip" : ""}`} style={{ display: "grid", gridTemplateColumns: "1.08fr 0.92fr", alignItems: "center", gap: "clamp(30px,4.5vw,68px)" }}>
          {/* text */}
          <div className="ac-ovb-text" style={{ ...rise(seen) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: UIBLUE }}>{`0${i + 1}`}</span>
              <span aria-hidden style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${UIBLUE}, ${SKY})`, borderRadius: 2 }} />
              <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTE }}>{o.eyebrow}</span>
            </div>
            <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(26px,3.4vw,40px)", letterSpacing: "-0.03em", lineHeight: 1.08, color: INKT, margin: "16px 0 0", maxWidth: 520 }}>{o.label}</h2>
            <p style={{ fontFamily: FONT, fontWeight: 400, fontSize: "clamp(15.5px,1.5vw,18px)", lineHeight: 1.6, color: INK_SOFT, margin: "18px 0 0", maxWidth: 520 }}>{o.lead}</p>
            <ul style={{ listStyle: "none", margin: "22px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {o.points.map((p) => (
                <li key={p} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={UIBLUE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden><path d="M20 6L9 17l-5-5" /></svg>
                  <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(14px,1.3vw,15px)", lineHeight: 1.55, color: INK_SOFT }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* visual */}
          <div className="ac-ovb-visual" style={{ ...rise(seen, 0.14) }}>
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4 / 3", border: `1px solid ${LINE}`, boxShadow: "0 24px 60px rgba(21,46,83,0.18)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.img} alt="" aria-hidden loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              {/* navy scrim keeps every photo brand-cohesive and text legible */}
              <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(150deg, ${INK}c2 0%, ${INK}52 42%, ${NAVY}70 100%)` }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${SKY}12 1px, transparent 1px), linear-gradient(90deg, ${SKY}12 1px, transparent 1px)`, backgroundSize: "40px 40px", maskImage: "radial-gradient(120% 100% at 82% 8%, #000 18%, transparent 72%)", WebkitMaskImage: "radial-gradient(120% 100% at 82% 8%, #000 18%, transparent 72%)" }} />
              <span aria-hidden style={{ position: "absolute", top: -22, right: 12, fontFamily: FONT, fontSize: 150, fontWeight: 900, lineHeight: 1, color: "rgba(255,255,255,0.10)", letterSpacing: "-0.05em" }}>{`0${i + 1}`}</span>
              {/* content: tag chip top-left, icon badge bottom-left */}
              <div style={{ position: "absolute", inset: 0, padding: "clamp(20px,2.4vw,28px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start", padding: "8px 14px", borderRadius: 100, background: "rgba(11,27,58,0.42)", border: `1px solid ${SKY}55`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                  <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN, boxShadow: `0 0 10px ${GREEN}` }} />
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#EAF3FB" }}>{o.tag}</span>
                </div>
                <span style={{ width: 62, height: 62, borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(11,27,58,0.42)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                  <RouteIcon type={o.icon} color="#fff" size={30} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .ac-ovb--flip .ac-ovb-text { order: 2; }
        .ac-ovb--flip .ac-ovb-visual { order: 1; }
        @media (max-width: 860px) {
          .ac-ovb { grid-template-columns: 1fr !important; gap: 30px !important; }
          .ac-ovb--flip .ac-ovb-text { order: 1; }
          .ac-ovb--flip .ac-ovb-visual { order: 2; }
        }
      `}</style>
    </section>
  );
}

// ─── KEY TAKEAWAYS ─────────────────────────────────────────────────────────────
const TAKEAWAYS = [
  { icon: "layers", title: "From context to policy", body: "A clearer framework for connecting application context to network security policy decisions across hybrid environments." },
  { icon: "search", title: "Sharper application discovery", body: "Practical ways to improve application discovery when connectivity requirements are incomplete, unclear or limited to IP addresses, ports and subnets." },
  { icon: "spark", title: "Automation & AI-assisted discovery", body: "How automation and AI-assisted discovery can reduce manual dependency and help security teams build richer application context for policy decisions." },
  { icon: "people", title: "Peer perspectives", body: "Peer perspectives on moving from fragmented policy management toward unified, application-centric control." },
];
function TakeIcon({ type }: { type: string }) {
  const p = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "layers") return <svg {...p}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 16l9 5 9-5" /></svg>;
  if (type === "search") return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>;
  if (type === "spark") return <svg {...p}><path d="M12 3l1.7 4.6L18.5 9l-4.8 1.4L12 15l-1.7-4.6L5.5 9l4.8-1.4L12 3z" /><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8 .8-2z" /></svg>;
  return <svg {...p}><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.3a3 3 0 0 1 0 5.5M15.6 20a5.5 5.5 0 0 0-2-4.4" /></svg>;
}
function Takeaways() {
  const { ref, seen } = useReveal<HTMLDivElement>();
  return (
    <section style={{ position: "relative", background: `linear-gradient(180deg, ${UDB} 0%, ${INK} 100%)`, color: WHITE, padding: "clamp(46px,6vh,80px) clamp(20px,5vw,56px)", overflow: "hidden" }}>
      <GridBg opacity={0.35} />
      <div ref={ref} style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", ...rise(seen) }}>
          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: SKY }}>Key Takeaways</span>
          <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", letterSpacing: "-0.03em", lineHeight: 1.06, color: WHITE, margin: "14px auto 0", maxWidth: 720 }}>
            What you&rsquo;ll walk away with.
          </h2>
          <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.6, color: DIM, margin: "16px auto 0", maxWidth: 600 }}>
            Four practical outcomes every attendee leaves the roundtable with.
          </p>
        </div>
        <div className="ac-tk-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px,1.6vw,22px)", marginTop: "clamp(40px,4.5vw,60px)" }}>
          {TAKEAWAYS.map((t, i) => (
            <div key={i} className="ac-tk-card" style={{ position: "relative", overflow: "hidden", padding: "clamp(18px,2vw,24px) clamp(26px,2.8vw,36px)", borderRadius: 20, background: "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 60%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(255,255,255,0.13)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)", ...rise(seen, 0.1 + i * 0.08) }}>
              <span aria-hidden style={{ position: "absolute", top: -1, left: "8%", right: "8%", height: 1.5, background: `linear-gradient(90deg, transparent, ${SKY}, transparent)` }} />
              <span aria-hidden style={{ position: "absolute", top: 4, right: 18, fontFamily: FONT, fontSize: "clamp(56px,6vw,84px)", fontWeight: 900, lineHeight: 1, color: "rgba(255,255,255,0.05)", letterSpacing: "-0.05em", pointerEvents: "none" }}>{`0${i + 1}`}</span>
              <span style={{ position: "relative", width: 54, height: 54, borderRadius: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(150deg, ${SKY}, ${UIBLUE})`, boxShadow: `0 12px 26px ${UIBLUE}40, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
                <TakeIcon type={t.icon} />
              </span>
              <h3 style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: "clamp(18px,1.8vw,22px)", color: WHITE, margin: "20px 0 0", letterSpacing: "-0.01em" }}>{t.title}</h3>
              <p style={{ position: "relative", fontFamily: FONT, fontWeight: 300, fontSize: "clamp(14.5px,1.4vw,16px)", lineHeight: 1.64, color: "rgba(255,255,255,0.78)", margin: "12px 0 0" }}>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .ac-tk-card { transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease; }
        .ac-tk-card:hover { transform: translateY(-4px); border-color: ${SKY}66 !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 20px 44px rgba(0,0,0,0.34) !important; }
        @media (max-width: 720px) { .ac-tk-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── THE CHALLENGE + AGENDA (gamified run-of-show as a route of checkpoints) ───
const AGENDA = [
  { time: "10:30 – 11:00 AM", title: "Registration, arrival & networking", kind: "reception" },
  { time: "11:00 – 11:10 AM", title: "Welcome: Why application connectivity has become an executive security issue", kind: "welcome" },
  { time: "11:10 – 11:30 AM", title: "AlgoCity: Escape the Complexity, gamified challenge on application visibility, ownership and connectivity requirements", kind: "challenge" },
  { time: "11:30 AM – 12:00 PM", title: "Presentations by AlgoSec", kind: "debrief" },
  { time: "12:00 – 12:15 PM", title: "Networking break", kind: "reception" },
  { time: "12:15 – 12:45 PM", title: "Panel discussion", kind: "roundtable" },
  { time: "12:45 – 12:55 PM", title: "Deep dive", kind: "deepdive" },
  { time: "12:55 – 1:00 PM", title: "Closing remarks", kind: "exchange" },
  { time: "1:00 PM onwards", title: "Networking lunch", kind: "reception" },
];
function Agenda() {
  const { ref, seen } = useReveal<HTMLDivElement>();
  return (
    <section id="challenge" style={{ position: "relative", background: `linear-gradient(180deg, ${INK} 0%, ${UDB} 60%, ${INK} 100%)`, color: WHITE, padding: "clamp(46px,6vh,80px) clamp(20px,5vw,56px)", overflow: "hidden" }}>
      <GridBg opacity={0.45} />
      <div ref={ref} style={{ position: "relative", zIndex: 2, maxWidth: 980, margin: "0 auto" }}>
        <div style={{ ...rise(seen) }}>
          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>The Challenge · 120-minute run-of-show</span>
          <h2 id="agenda" style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", letterSpacing: "-0.03em", lineHeight: 1.06, color: WHITE, margin: "14px 0 0", maxWidth: 760, scrollMarginTop: 90 }}>
            Navigate the Challenge.
          </h2>
          <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.65, color: DIM, margin: "16px 0 0", maxWidth: 680 }}>
            The session runs as a single route: from an opening gamified challenge through a closed-door roundtable to a networking lunch. Each checkpoint moves the group closer to application-centric control.
          </p>
        </div>

        <div style={{ position: "relative", marginTop: "clamp(40px,5vw,60px)" }}>
          {/* vertical route spine */}
          <div aria-hidden style={{ position: "absolute", left: 27, top: 8, bottom: 8, width: 2, background: `linear-gradient(180deg, ${SKY}, ${GOLD}, ${GREEN})`, opacity: seen ? 0.55 : 0, transition: "opacity 0.9s ease 0.2s" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {AGENDA.map((a, i) => {
              const isChallenge = a.kind === "challenge";
              return (
                <div key={i} style={{ position: "relative", display: "grid", gridTemplateColumns: "56px 1fr", gap: 18, alignItems: "stretch", ...rise(seen, 0.08 + i * 0.06) }}>
                  <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
                    <span style={{ width: 54, height: 54, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: isChallenge ? `linear-gradient(160deg, ${GOLD}, #C98A1E)` : `linear-gradient(160deg, ${NAVY}, ${INK})`, border: `1px solid ${isChallenge ? GOLD : SKY + "55"}`, boxShadow: isChallenge ? `0 0 0 6px ${GOLD}1f, 0 12px 28px rgba(0,0,0,0.4)` : `0 8px 20px rgba(0,0,0,0.35)`, flexShrink: 0 }}>
                      <AgendaIcon kind={a.kind} />
                    </span>
                  </div>
                  <div className={isChallenge ? "ac-ag-card ac-ag-hero" : "ac-ag-card"} style={{ padding: "16px 20px", borderRadius: 15, background: isChallenge ? `linear-gradient(135deg, ${GOLD}1c, ${NAVY}2e)` : "rgba(255,255,255,0.045)", border: `1px solid ${isChallenge ? GOLD + "55" : "rgba(255,255,255,0.11)"}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ fontFamily: FONT, fontSize: 13.5, fontWeight: 700, color: isChallenge ? GOLD : SKY, letterSpacing: "0.01em" }}>{a.time}</span>
                      {isChallenge && <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1b1204", background: GOLD, borderRadius: 100, padding: "3px 10px" }}>Gamified Challenge</span>}
                    </div>
                    <p style={{ fontFamily: FONT, fontWeight: isChallenge ? 700 : 600, fontSize: "clamp(14.5px,1.4vw,16.5px)", lineHeight: 1.45, color: WHITE, margin: 0, letterSpacing: "-0.01em" }}>{a.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .ac-ag-card { transition: transform 0.3s ease, border-color 0.3s ease; }
        .ac-ag-card:hover { transform: translateX(3px); }
      `}</style>
    </section>
  );
}
function AgendaIcon({ kind }: { kind: string }) {
  const gold = kind === "challenge";
  const c = gold ? "#1b1204" : SKY;
  const p = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "reception": return <svg {...p}><path d="M5 8.5h11v4.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" /><path d="M16 9.5h2.4a2.1 2.1 0 0 1 0 4.2H16M8 3v2.2M11.5 3v2.2" /></svg>;
    case "welcome": return <svg {...p}><path d="M12 21v-9M8 15l4-4 4 4" /><path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11" /></svg>;
    case "challenge": return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="1.6" /><path d="M8 4v8h4V8h4" /><circle cx="16" cy="16" r="1.4" fill={c} stroke="none" /></svg>;
    case "debrief": return <svg {...p}><path d="M4 5h16v11H8l-4 3z" /><path d="M8 9.5h8M8 12.5h5" /></svg>;
    case "roundtable": return <svg {...p}><circle cx="8" cy="9.5" r="2.2" /><circle cx="16" cy="9.5" r="2.2" /><path d="M3.5 18.5c0-2.3 2-3.8 4.5-3.8M12 18.5c0-2.3 2-3.8 4.5-3.8" /></svg>;
    case "deepdive": return <svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></svg>;
    case "exchange": return <svg {...p}><path d="M4 8h13l-3-3M20 16H7l3 3" /></svg>;
    default: return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
  }
}

// ─── SPEAKERS ──────────────────────────────────────────────────────────────────
const SPEAKERS = [
  { name: "Nitin Rajput", title: "Director, Solution Engineering, APAC & Middle East", org: "AlgoSec", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Nitin+Rajput.jpeg", linkedin: "https://www.linkedin.com/in/nitin-rajput-cissp-ccsp-cisa-36587352/" },
  { name: "Gurinder Singh", title: "Regional Pre-Sales Engineer, India & Middle East", org: "AlgoSec", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Gurinder+Singh.jpeg", linkedin: "https://www.linkedin.com/in/gurinder-sandhu-6a04a63b/" },
];
function Speakers() {
  const { ref, seen } = useReveal<HTMLDivElement>();
  return (
    <section id="speakers" style={{ position: "relative", background: PAPER, padding: "clamp(46px,6vh,80px) clamp(20px,5vw,56px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", bottom: "-10%", left: "-6%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${GREEN}12, transparent 66%)`, pointerEvents: "none" }} />
      <div ref={ref} style={{ position: "relative", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", ...rise(seen) }}>
          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: UIBLUE }}>Speakers</span>
          <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.03em", lineHeight: 1.06, color: INKT, margin: "14px auto 0", maxWidth: 720 }}>
            Meet the speakers.
          </h2>
          <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(14.5px,1.4vw,16.5px)", color: INK_SOFT, margin: "16px auto 0", maxWidth: 600, lineHeight: 1.6 }}>
            AlgoSec&rsquo;s engineering leaders bring an application-centric perspective on securing connectivity across the hybrid enterprise.
          </p>
        </div>
        <div className="ac-spk-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 300px))", justifyContent: "center", gap: "clamp(20px,2.4vw,30px)", marginTop: "clamp(40px,5vw,60px)" }}>
          {SPEAKERS.map((s, i) => (
            <div key={s.name} className="ac-spk-card" style={{ position: "relative", overflow: "hidden", borderRadius: 20, background: `linear-gradient(162deg, ${UIBLUE} 0%, ${NAVY} 56%, ${UDB} 100%)`, border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 22px 48px rgba(10,18,34,0.24), inset 0 1px 0 rgba(255,255,255,0.12)", ...rise(seen, 0.1 + i * 0.1) }}>
              <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, zIndex: 3, background: `linear-gradient(90deg, ${SKY}, ${GREEN})` }} />
              <div style={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden", background: UDB }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ac-spk-photo" src={s.photo} alt={s.name} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 18%" }} />
                <a href={s.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} on LinkedIn`} className="ac-spk-li" style={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(11,27,58,0.55)", border: `1px solid ${SKY}66`, color: "#fff", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", transition: "background 0.2s ease, transform 0.2s ease" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 8.5h4V21H3zM9 8.5h3.6v1.7h.05c.5-.9 1.7-1.85 3.5-1.85 3.75 0 4.45 2.35 4.45 5.4V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.05 1.4-2.05 2.85V21H9z" /></svg>
                </a>
              </div>
              <div style={{ padding: "18px 18px 22px", textAlign: "center" }}>
                <h3 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(16px,1.5vw,18px)", color: WHITE, margin: 0, letterSpacing: "-0.01em" }}>{s.name}</h3>
                <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12.5, lineHeight: 1.4, color: "#BFE3F7", margin: "8px 0 0" }}>{s.title}</p>
                <p style={{ fontFamily: FONT, fontWeight: 400, fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "3px 0 0" }}>{s.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .ac-spk-card { transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease; }
        .ac-spk-card .ac-spk-photo { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .ac-spk-card:hover { transform: translateY(-5px); border-color: ${SKY}66; box-shadow: 0 32px 66px rgba(10,18,34,0.34), inset 0 1px 0 rgba(255,255,255,0.14); }
        .ac-spk-card:hover .ac-spk-photo { transform: scale(1.04); }
        .ac-spk-li:hover { background: ${SKY} !important; transform: translateY(-1px); }
        @media (max-width: 620px) { .ac-spk-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
        @media (max-width: 380px) { .ac-spk-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── ABOUT ALGOSEC ─────────────────────────────────────────────────────────────
const ALGO_STATS = [
  ["1,800+", "Enterprises secured"],
  ["50+", "Countries"],
  ["20+", "Years application-centric"],
];
const ALGO_PILLARS = [
  ["Application-centric visibility", "See what needs to communicate, why, and which business service it supports."],
  ["Automated policy change", "Push changes across the hybrid network with guardrails and continuous compliance."],
  ["AI-assisted discovery", "Reduce the manual effort of building richer application connectivity context."],
];
function About() {
  const { ref, seen } = useReveal<HTMLDivElement>();
  return (
    <section id="about" style={{ position: "relative", background: `linear-gradient(165deg, ${NAVY} 0%, ${UDB} 55%, ${INK} 100%)`, color: WHITE, padding: "clamp(46px,6vh,80px) clamp(20px,5vw,56px)", overflow: "hidden" }}>
      <GridBg opacity={0.3} />
      {/* signature green accent circle */}
      <div aria-hidden style={{ position: "absolute", top: "-14%", right: "-8%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${GREEN}22, transparent 62%)`, pointerEvents: "none" }} />
      <div ref={ref} style={{ position: "relative", zIndex: 2, maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }} className="ac-about-grid">
        <div style={{ ...rise(seen) }}>
          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: SKY }}>About the partner</span>
          <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", letterSpacing: "-0.03em", lineHeight: 1.06, color: WHITE, margin: "14px 0 0" }}>
            AlgoSec: secure application connectivity. <span style={{ color: GREEN }}>Anywhere.</span>
          </h2>
          <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(15px,1.5vw,17px)", lineHeight: 1.72, color: DIM, margin: "18px 0 0" }}>
            AlgoSec helps organizations secure application connectivity across complex hybrid environments. The AlgoSec Horizon platform provides an application-centric approach to network security management, helping teams gain visibility, automate security policy changes, reduce risk and maintain continuous compliance across data center and multi-cloud networks.
          </p>
          <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(15px,1.5vw,17px)", lineHeight: 1.72, color: DIM, margin: "16px 0 0" }}>
            By connecting application context with security policy and change workflows, AlgoSec helps security, network, cloud and application teams deliver business applications faster while maintaining control. During the roundtable, AlgoSec will also explore how AI-assisted discovery can reduce the manual effort of building richer application connectivity context.
          </p>
          <div style={{ display: "flex", gap: "clamp(20px,3vw,40px)", marginTop: "clamp(26px,3vw,36px)", paddingTop: "clamp(22px,2.4vw,28px)", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            {ALGO_STATS.map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(26px,3.4vw,40px)", color: WHITE, lineHeight: 1, letterSpacing: "-0.03em" }}>{n}</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: DIM2, marginTop: 10 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, ...rise(seen, 0.15) }}>
          {ALGO_PILLARS.map(([t, d], i) => (
            <div key={i} className="ac-pillar" style={{ position: "relative", overflow: "hidden", padding: "20px 22px", borderRadius: 16, background: "linear-gradient(155deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)", transition: "transform 0.35s ease, border-color 0.35s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", background: `${SKY}1c`, border: `1px solid ${SKY}44`, flexShrink: 0 }}>
                  <PillarIcon i={i} />
                </span>
                <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16.5, color: WHITE, margin: 0, letterSpacing: "-0.01em" }}>{t}</h3>
              </div>
              <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 14, lineHeight: 1.6, color: DIM, margin: "12px 0 0" }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .ac-pillar:hover { transform: translateY(-3px); border-color: ${SKY}55 !important; }
        @media (max-width: 880px) { .ac-about-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
function PillarIcon({ i }: { i: number }) {
  const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: SKY, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (i === 0) return <svg {...p}><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.6" stroke={GREEN} /></svg>;
  if (i === 1) return <svg {...p}><path d="M12 2.5l7.5 3v5.5c0 5-3.4 8-7.5 10-4.1-2-7.5-5-7.5-10V5.5z" /><path d="M8.6 12l2.2 2.2 4.6-4.6" stroke={GREEN} /></svg>;
  return <svg {...p}><circle cx="12" cy="12" r="3" stroke={GREEN} /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2 19 19M19 5l-2.8 2.8M7.8 16.2 5 19" /></svg>;
}

// ─── REGISTER ──────────────────────────────────────────────────────────────────
const EMPTY = { firstName: "", lastName: "", email: "", company: "", jobTitle: "", phone: "" };
function Register() {
  return (
    <section id="register" style={{ position: "relative", background: `linear-gradient(180deg, ${PAPER} 0%, ${SOFT} 100%)`, color: INKT, padding: "clamp(46px,6vh,80px) clamp(20px,5vw,56px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-6%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${SKY}16, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-14%", left: "-8%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${GREEN}12, transparent 66%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }} className="ac-reg-grid">
        <div>
          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: UIBLUE }}>Request a seat</span>
          <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(28px,4.2vw,50px)", letterSpacing: "-0.03em", lineHeight: 1.05, color: INKT, margin: "14px 0 0" }}>
            Reserve your place at the table.
          </h2>
          <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(15px,1.5vw,17px)", lineHeight: 1.7, color: INK_SOFT, margin: "18px 0 0", maxWidth: 460 }}>
            Attendance is by invitation and curated for senior security, network, cloud and technology leaders. Request a seat and our team will confirm your place and share the full details.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginTop: 30 }}>
            {[
              [`${EVENT.date} · ${EVENT.city}`, "cal"],
              [EVENT.venue, "pin"],
              [EVENT.time, "clock"],
              [EVENT.format, "lock"],
            ].map(([label, icon]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ flex: "0 0 auto", width: 34, height: 34, borderRadius: 9, background: PAPER, border: `1px solid ${LINE}`, display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(21,46,83,0.05)" }}>
                  <HeroIcon type={icon as string} />
                </span>
                <span style={{ fontFamily: FONT, fontSize: 14.5, fontWeight: 400, color: INK_SOFT }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <RegistrationForm />
      </div>
      <style jsx global>{`@media (max-width: 900px) { .ac-reg-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
function Field({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div className="ac-field">
      <label>{label}{req && <span style={{ color: SKY }}> *</span>}</label>
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
      event_name: "AlgoSec Executive Roundtable - AlgoCity: Escape the Complexity (Dubai)",
    });
    setLoading(false);
    if (res.success) { setDone(true); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else setErr(res.error || "Something went wrong. Please try again.");
  };

  return (
    <div ref={topRef} style={{ position: "relative" }}>
      <div style={{ padding: "clamp(26px,3.4vw,40px)", borderRadius: 22, background: PAPER, border: `1px solid ${LINE}`, boxShadow: "0 40px 90px rgba(21,46,83,0.14), inset 0 1px 0 rgba(255,255,255,0.7)" }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: UIBLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 8px 26px ${UIBLUE}66` }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 900, color: INKT, margin: 0, letterSpacing: "-0.02em" }}>Request received.</h3>
            <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 300, color: INK_SOFT, margin: "12px auto 0", maxWidth: 420, lineHeight: 1.6 }}>Thank you. Our team will review your request and be in touch to confirm your seat at the roundtable on {EVENT.date} in Dubai.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="ac-form" noValidate>
            <div className="ac-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="First name" req><input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First name" suppressHydrationWarning /></Field>
              <Field label="Last name" req><input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last name" suppressHydrationWarning /></Field>
            </div>
            <Field label="Work email" req><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" suppressHydrationWarning /></Field>
            <div className="ac-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Company" req><input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company" suppressHydrationWarning /></Field>
              <Field label="Job title"><input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="Job title" suppressHydrationWarning /></Field>
            </div>
            <Field label="Phone" req>
              <div style={{ display: "flex", gap: 10 }}>
                <select value={country.code + country.country} onChange={(e) => { const c = COUNTRY_CODES.find((x) => x.code + x.country === e.target.value); if (c) { setCountry(c); setForm((p) => ({ ...p, phone: p.phone.replace(/\D/g, "").slice(0, c.length) })); } }} suppressHydrationWarning style={{ flex: "0 0 auto", width: 112 }}>
                  {COUNTRY_CODES.map((c) => (<option key={c.code + c.country} value={c.code + c.country}>{c.country} {c.code}</option>))}
                </select>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, country.length))} placeholder={country.placeholder} inputMode="numeric" maxLength={country.length} suppressHydrationWarning style={{ flex: 1 }} />
              </div>
            </Field>
            {err && <p style={{ fontFamily: FONT, fontSize: 13.5, color: "#d64545", margin: "16px 0 0" }}>{err}</p>}
            <button type="submit" disabled={loading} suppressHydrationWarning className="ac-form-submit" style={{ width: "100%", marginTop: 22, height: 54, border: "none", borderRadius: 13, cursor: loading ? "not-allowed" : "pointer", fontFamily: FONT, fontSize: 15.5, fontWeight: 700, color: WHITE, background: UIBLUE, opacity: loading ? 0.65 : 1, boxShadow: `0 12px 32px ${UIBLUE}66`, transition: "background 0.2s ease, transform 0.2s ease" }}>{loading ? "Submitting…" : "Request your seat"}</button>
            <p style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 300, color: INK_SOFT, textAlign: "center", margin: "16px 0 0", lineHeight: 1.6 }}>By requesting a seat you agree to be contacted by Events First Group and AlgoSec about this roundtable. <span style={{ fontWeight: 700, color: UIBLUE }}>By registering, you also agree that AlgoSec may contact you after the event for a follow-up discussion.</span></p>
          </form>
        )}
      </div>
      <style jsx global>{`
        .ac-form label { font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${MUTE}; }
        .ac-form input, .ac-form select { width: 100%; padding: 14px; margin-top: 8px; background: ${SOFT}; border: 1px solid ${LINE_STRONG}; border-radius: 11px; font-family: ${FONT}; font-size: 16px; color: ${INKT}; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease; }
        .ac-form select { margin-top: 0; }
        .ac-form input::placeholder { color: ${MUTE}; }
        .ac-form input:focus, .ac-form select:focus { border-color: ${UIBLUE}; box-shadow: 0 0 0 3px ${UIBLUE}22; background: ${PAPER}; }
        .ac-form > .ac-field, .ac-form .ac-form-row { margin-top: 16px; }
        .ac-form option { background: ${PAPER}; color: ${INKT}; }
        .ac-form-submit:hover { background: ${SKY} !important; transform: translateY(-1px); }
        @media (max-width: 560px) { .ac-form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

// ─── FOOTER (AlgoSec mark + "Produced by" EFG) ─────────────────────────────────
function Footer() {
  return (
    <footer style={{ position: "relative", background: UDB, color: WHITE, padding: "clamp(34px,5vh,52px) clamp(20px,5vw,56px)", overflow: "hidden", borderTop: `1px solid rgba(255,255,255,0.08)` }}>
      <div aria-hidden style={{ position: "absolute", top: 0, right: "-6%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${GREEN}14, transparent 64%)`, pointerEvents: "none" }} />
      <div className="ac-foot-row" style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
        <BrandMark height={32} white />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM2 }}>Hosted by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Events-First-logo-02.png" alt="Events First Group" style={{ height: 42, width: "auto", display: "block" }} />
        </div>
      </div>
      <style jsx global>{`@media (max-width: 560px) { .ac-foot-row { justify-content: center; text-align: center; } }`}</style>
    </footer>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────────────────────
export default function AlgoSecRoundtablePage() {
  return (
    <main style={{ position: "relative", background: INK, color: WHITE, overflowX: "hidden", width: "100%", maxWidth: "100%", fontFamily: FONT }}>
      <style jsx global>{`
        html, body { max-width: 100%; overflow-x: hidden; }
      `}</style>
      <Nav />
      <Hero />
      <RouteStrip />
      <Overview />
      <Takeaways />
      <Agenda />
      <Speakers />
      <About />
      <Register />
      <Footer />
    </main>
  );
}
