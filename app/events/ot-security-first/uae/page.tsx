"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Footer, InquiryForm } from "@/components/sections";
import EventNavigation from "@/components/ui/EventNavigation";

// ─── Design tokens (OT Security First UAE 2027 — magenta on near-black) ───────
const C = "#D34B9A";        // Magenta
const C_BRIGHT = "#EE7CBC"; // Bright pink
const C_LIGHT = "#F2AED2";  // Light pink (text on tint)
const C_DEEP = "#B03A80";   // Deep magenta
const BG = "#0A0A0A";       // Base
const BG_2 = "#0E0E0E";     // Alt section
const INK = "#0A0A0A";
const EASE = [0.16, 1, 0.3, 1] as const;

const FD = "var(--font-display)";   // Plus Jakarta Sans
const FO = "var(--font-outfit)";    // Outfit
const FDM = "var(--font-dm-sans)";  // DM Sans

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;
const HERO_VIDEO = `${S3}/hero+videos/OTSEC+cuts+text.mp4`;
const HERO_POSTER = "/ot-uae/hero-poster.jpg";

// Reused OT / EFG event photography for the section image slots
const IMG = {
  eventHero: `${S3}/events/cyberqatar/ARU00722.jpg`,
  skyline: `${S3}/venues/intercontinental-riyadh_15466355611.jpg`,
  mandate: `${S3}/events/opex+KSA+few/DSC08456.jpg`,
  plant: `${S3}/assets/magnific_cinematic-wideangle-hero-_CHoH66yEEy.png`,
  keynote: `${S3}/events/cyberqatar/ARU00500.jpg`,
  attend: `${S3}/events/opex+KSA+few/DSC08580.jpg`,
  network: `${S3}/events/opex+KSA+few/DSC08585.jpg`,
  question: `${S3}/events/cyberqatar/ARU00574.jpg`,
  partner: `${S3}/events/opex+KSA+few/DSC08336.jpg`,
};

// ─── Reusable style fragments ────────────────────────────────────────────────
const CARD_BG = "linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.012))";
const CARD_BORDER = "1px solid rgba(255,255,255,0.09)";
const CARD_SHADOW = "inset 0 1px 0 rgba(255,255,255,0.09),0 24px 48px -30px rgba(0,0,0,0.9)";
const TINT_CARD = `linear-gradient(160deg,${C_BRIGHT} 0%,${C} 44%,#8E2A64 100%)`;

const wrap: React.CSSProperties = { maxWidth: 1320, margin: "0 auto", padding: "clamp(56px,7vw,110px) clamp(20px,4vw,60px)", position: "relative", zIndex: 1 };

// ─── Numbered section header ─────────────────────────────────────────────────
function SectionHead({ num, label, note, right }: { num: string; label: string; note?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 20, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "clamp(28px,4vw,44px)" }}>
      <span style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,3.4vw,44px)", letterSpacing: "-2px", lineHeight: 1, color: "rgba(255,255,255,0.14)" }}>{num}</span>
      <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "2.6px", textTransform: "uppercase", color: C }}>{label}</span>
      {right ?? (note ? <span style={{ marginLeft: "auto", fontFamily: FO, fontSize: 11, letterSpacing: "1.6px", textTransform: "uppercase", color: "#585858" }}>{note}</span> : null)}
    </div>
  );
}

const tagPill: React.CSSProperties = {
  fontFamily: FO, fontSize: 12, padding: "7px 13px", borderRadius: 9999,
  background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.11)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.68)",
};
const tagPillHot: React.CSSProperties = {
  fontFamily: FO, fontSize: 12, padding: "7px 13px", borderRadius: 9999,
  background: `linear-gradient(180deg,${C}33,${C}0f)`, border: `1px solid ${C}61`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)", color: C_LIGHT,
};

function Tag({ children, hot }: { children: React.ReactNode; hot?: boolean }) {
  return <span style={hot ? tagPillHot : tagPill}>{children}</span>;
}

// ─── Fixed ambient background (magenta radial glows) ─────────────────────────
function AmbientBg() {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse 60% 40% at 15% 0%, ${C}1a 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 95% 30%, ${C}0f 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(232,101,26,0.05) 0%, transparent 55%)` }} />
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const industries = ["Government", "Energy", "Oil & Gas", "Utilities", "Petrochemicals", "Manufacturing", "Critical Infrastructure"];
  return (
    <section id="top" style={{ position: "relative", minHeight: "min(880px,94vh)", display: "flex", alignItems: "flex-end", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <video autoPlay muted loop playsInline poster={HERO_POSTER} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.72) brightness(0.4)", zIndex: 0 }}>
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(10,10,10,0.86) 0%, rgba(10,10,10,0.35) 32%, rgba(10,10,10,0.78) 72%, #0A0A0A 100%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: `radial-gradient(ellipse 70% 60% at 12% 100%, ${C}42 0%, transparent 62%)` }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.35, backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize: "88px 88px", maskImage: "linear-gradient(180deg,transparent,#000 40%,transparent)", WebkitMaskImage: "linear-gradient(180deg,transparent,#000 40%,transparent)" }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1320, margin: "0 auto", padding: "clamp(150px,18vh,210px) clamp(20px,4vw,60px) clamp(40px,5vw,64px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
          style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 28, padding: "8px 16px 8px 12px", borderRadius: 9999, border: `1px solid ${C}59`, background: `${C}14`, backdropFilter: "blur(8px)" }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C, animation: "uaePulse 2.6s cubic-bezier(0.16,1,0.3,1) infinite" }} />
          <span style={{ fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2.2px", textTransform: "uppercase", color: C }}>2nd UAE Edition · 5th Global Edition</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
          style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(44px,6.4vw,92px)", letterSpacing: "-3px", lineHeight: 0.98, margin: 0, maxWidth: 1060, textWrap: "balance" }}
        >
          OT Security First<br />UAE 2027.
          <span style={{ display: "block", color: "rgba(255,255,255,0.28)", fontSize: "clamp(26px,3.2vw,46px)", letterSpacing: "-1.4px", lineHeight: 1.1, marginTop: 18 }}>
            Securing the UAE&rsquo;s operational technology<br />and critical infrastructure.
          </span>
        </motion.h1>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 28, marginTop: 44, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,3vw,40px)", letterSpacing: "-1.4px", color: "#fff", lineHeight: 1 }}>27 January 2027</span>
            <span style={{ fontFamily: FO, fontSize: 12, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", color: C }}>Abu Dhabi · UAE</span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginLeft: "auto" }}>
            <a href="#register" className="uae-cta-solid" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FO, fontSize: 14, fontWeight: 600, padding: "15px 30px", borderRadius: 9999, background: C, color: INK }}>Request an invitation →</a>
            <a href="#partner" className="uae-cta-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FO, fontSize: 14, fontWeight: 600, padding: "15px 30px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.03)", color: "#fff", backdropFilter: "blur(10px)" }}>Partnership enquiry</a>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 34 }}>
          {industries.map((t) => (
            <span key={t} style={{ fontFamily: FO, fontSize: 11.5, fontWeight: 500, letterSpacing: "1.2px", textTransform: "uppercase", padding: "9px 16px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)" }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STAT PLATES ─────────────────────────────────────────────────────────────
function StatPlates() {
  const plates: { big: React.ReactNode; label: string; hot?: boolean }[] = [
    { big: <>2<span style={{ color: C, fontSize: "0.6em" }}>nd</span></>, label: "UAE Edition" },
    { big: <>5<span style={{ color: C, fontSize: "0.6em" }}>th</span></>, label: "Global Edition" },
    { big: <>250<span style={{ fontSize: "0.6em", color: "rgba(255,255,255,0.75)" }}>+</span></>, label: "Senior Delegates", hot: true },
    { big: <>35<span style={{ color: C, fontSize: "0.6em" }}>+</span></>, label: "Speakers" },
    { big: <>6<span style={{ color: C, fontSize: "0.6em" }}>+</span></>, label: "Critical Industries" },
  ];
  return (
    <section style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "clamp(28px,4vw,52px) clamp(20px,4vw,60px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 }}>
        {plates.map((p, i) => (
          <div key={i} style={{
            borderRadius: 24, padding: "26px 24px",
            background: p.hot ? `linear-gradient(160deg,${C_BRIGHT} 0%,${C} 44%,#8E2A64 100%)` : "linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))",
            border: p.hot ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.09)",
            boxShadow: p.hot ? "inset 0 1px 0 rgba(255,255,255,0.5),inset 0 -20px 34px -22px rgba(0,0,0,0.6),0 26px 46px -24px " + C + "99" : "inset 0 1px 0 rgba(255,255,255,0.1),0 22px 40px -28px rgba(0,0,0,0.9)",
          }}>
            <div style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(36px,3.8vw,52px)", letterSpacing: "-2px", lineHeight: 1, color: "#fff", textShadow: p.hot ? "0 2px 12px rgba(0,0,0,0.35)" : undefined }}>{p.big}</div>
            <div style={{ width: 26, height: 3, borderRadius: 2, background: p.hot ? "rgba(255,255,255,0.7)" : `linear-gradient(90deg,${C_BRIGHT},${C_DEEP})`, boxShadow: p.hot ? undefined : `0 0 14px ${C}b3`, margin: "16px 0 12px" }} />
            <div style={{ fontFamily: FO, fontSize: 11, fontWeight: p.hot ? 600 : 500, letterSpacing: "1.4px", textTransform: "uppercase", color: p.hot ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}>{p.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Image tile ──────────────────────────────────────────────────────────────
function ImageTile({ src, alt, radius = 32, minHeight, pos, children }: { src: string; alt: string; radius?: number; minHeight?: string | number; pos?: string; children?: React.ReactNode }) {
  return (
    <div style={{ position: "relative", minHeight, borderRadius: radius, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12),0 34px 70px -34px rgba(0,0,0,0.95)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos || "center" }} />
      {children}
    </div>
  );
}

// ─── 01 · THE EVENT ──────────────────────────────────────────────────────────
function TheEvent() {
  const facts = [
    { t: "Convened", b: "Regulators, CISOs, OT leaders, plant executives" },
    { t: "Framed by", b: "The UAE’s CIIP national framework" },
    { t: "Format", b: "Invite-only · one day · executive" },
  ];
  return (
    <section id="event" style={wrap}>
      <SectionHead num="01" label="The Event" note="Abu Dhabi · 27.01.2027" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "clamp(20px,3vw,40px)", alignItems: "stretch" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32 }}>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(32px,4.2vw,62px)", letterSpacing: "-2.4px", lineHeight: 1.02, margin: 0, textWrap: "balance" }}>
            OT is the backbone of the UAE&rsquo;s critical infrastructure.
            <span style={{ display: "block", color: "rgba(255,255,255,0.26)", marginTop: 14 }}>A compromise stops production, not just data.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
            {facts.map((f) => (
              <div key={f.t} style={{ borderRadius: 20, padding: 20, background: "linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.012))", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: "-0.3px", marginBottom: 8 }}>{f.t}</div>
                <div style={{ fontFamily: FO, fontSize: 13, lineHeight: 1.6, color: "#8E8E8E" }}>{f.b}</div>
              </div>
            ))}
          </div>
        </div>
        <ImageTile src={IMG.eventHero} alt="OT Security First — the executive platform for the UAE's OT ecosystem" minHeight="clamp(360px,42vw,540px)">
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, pointerEvents: "none", padding: 28, background: "linear-gradient(0deg,rgba(10,10,10,0.92),transparent)" }}>
            <div style={{ fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C, marginBottom: 8 }}>From policy to implementation</div>
            <div style={{ fontFamily: FD, fontWeight: 700, fontSize: "clamp(17px,1.7vw,22px)", letterSpacing: "-0.6px", lineHeight: 1.25, color: "#fff", maxWidth: 420 }}>The executive platform for the UAE&rsquo;s OT ecosystem.</div>
          </div>
        </ImageTile>
      </div>
    </section>
  );
}

// ─── 02 · WHY ABU DHABI ──────────────────────────────────────────────────────
function WhyAbuDhabi() {
  return (
    <section id="abudhabi" style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={wrap}>
        <SectionHead num="02" label="Why Abu Dhabi" />
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,60px)", letterSpacing: "-2.2px", lineHeight: 1.03, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 900 }}>
          The heart of the UAE&rsquo;s critical infrastructure ecosystem.
          <span style={{ display: "block", color: "rgba(255,255,255,0.26)" }}>Energy, industry and intelligence, one emirate.</span>
        </h2>
        <div className="uae-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 14 }}>
          <div style={{ gridColumn: "span 4" }}>
            <ImageTile src={IMG.skyline} alt="Abu Dhabi — capital of the UAE and heart of its critical infrastructure" minHeight="clamp(300px,32vw,420px)">
              <div style={{ position: "absolute", top: 24, left: 24, pointerEvents: "none", padding: "9px 16px", borderRadius: 9999, background: "rgba(10,10,10,0.6)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#fff" }}>Abu Dhabi, UAE</div>
            </ImageTile>
          </div>
          <div style={{ gridColumn: "span 2", borderRadius: 32, padding: "clamp(26px,2.6vw,36px)", background: TINT_CARD, border: "1px solid rgba(255,255,255,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5),inset 0 -24px 40px -24px rgba(0,0,0,0.55),0 30px 56px -26px " + C + "99", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 }}>
            <div style={{ fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>Industrial Strategy</div>
            <div>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(40px,4.4vw,64px)", letterSpacing: "-2.8px", lineHeight: 0.95, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.35)" }}>AED 10<span style={{ fontSize: "0.45em", color: "rgba(255,255,255,0.8)" }}> bn</span></div>
              <div style={{ fontFamily: FO, fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.88)", marginTop: 14 }}>Government investment in Industry 4.0 and smart manufacturing.</div>
            </div>
          </div>
          <MiniCard span={2} title="Department of Energy" body="Security of supply and sustainability of energy and water." />
          <MiniCard span={2} title="2050 Framework" body="Decarbonisation, digital transformation, AI-driven innovation." />
          <div style={{ gridColumn: "span 2", borderRadius: 28, padding: "clamp(24px,2.4vw,32px)", background: `radial-gradient(ellipse 90% 120% at 100% 0%, ${C}33, transparent 62%), linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))`, border: `1px solid ${C}47`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12),0 24px 48px -30px rgba(0,0,0,0.9)", display: "flex", alignItems: "center" }}>
            <p style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(17px,1.7vw,21px)", letterSpacing: "-0.7px", lineHeight: 1.25, color: "#fff", margin: 0 }}>An ideal setting for a dedicated OT cybersecurity summit.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniCard({ span, title, body }: { span: number; title: string; body: string }) {
  return (
    <div className="uae-card" style={{ gridColumn: `span ${span}`, borderRadius: 28, padding: "clamp(24px,2.4vw,32px)", background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}>
      <div style={{ width: 26, height: 3, borderRadius: 2, background: `linear-gradient(90deg,${C_BRIGHT},${C_DEEP})`, marginBottom: 18 }} />
      <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 19, letterSpacing: "-0.6px", color: "#fff", margin: "0 0 10px" }}>{title}</h3>
      <p style={{ fontFamily: FO, fontSize: 14, lineHeight: 1.65, color: "#8E8E8E", margin: 0 }}>{body}</p>
    </div>
  );
}

// ─── 03 · THE MANDATE (accordion) ────────────────────────────────────────────
const QUESTIONS: [string, string, string][] = [
  ["01", "Securing legacy OT without disrupting operations", "Brownfield plants, unsupported controllers and 24/7 availability — sequencing security into environments that cannot stop."],
  ["02", "IT/OT convergence without expanding the attack surface", "Segmentation, identity, secure remote access and cloud designed so convergence adds visibility, not exposure."],
  ["03", "Risk-based OT security for critical infrastructure operators", "Translating the CIIP baseline into asset criticality, risk profiles and investment the board can sign off."],
  ["04", "Government, regulators and industry on national OT resilience", "Information sharing, sector threat intelligence and joint exercises across authorities and operators."],
  ["05", "Protecting ICS while maintaining safety and production", "Where security controls meet safety instrumented systems, change management and production KPIs."],
  ["06", "What effective OT incident response looks like", "Playbooks, cross-functional command and recovery of physical processes when engineering and security respond together."],
  ["07", "AI that strengthens rather than compromises OT security", "Anomaly detection weighed against model security, data integrity and autonomous decision-making in OT."],
];

function TheMandate() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="mandate" style={wrap}>
      <SectionHead num="03" label="The Mandate" note="Seven questions" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))", gap: "clamp(24px,3.5vw,56px)", alignItems: "start" }}>
        <div>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "-2px", lineHeight: 1.04, margin: "0 0 28px" }}>
            From national policy<span style={{ display: "block", color: "rgba(255,255,255,0.26)" }}>to industrial resilience.</span>
          </h2>
          <ImageTile src={IMG.mandate} alt="Boardroom panel discussion at an OT Security First summit" minHeight="clamp(260px,26vw,360px)" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {QUESTIONS.map(([n, t, b], i) => {
            const isOpen = open === i;
            return (
              <button key={n} onClick={() => setOpen(isOpen ? null : i)} className="uae-q" style={{ textAlign: "left", borderRadius: 24, padding: "22px 26px", cursor: "pointer", background: "linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.012))", border: isOpen ? `1px solid ${C}73` : "1px solid rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09),0 18px 36px -28px rgba(0,0,0,0.9)", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "start", transition: "border-color 0.35s, transform 0.35s" }}>
                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 12, letterSpacing: "1px", color: C, paddingTop: 5 }}>{n}</span>
                <div>
                  <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: "clamp(15.5px,1.4vw,18px)", letterSpacing: "-0.4px", lineHeight: 1.4, color: "#fff", margin: 0 }}>{t}</h3>
                  {isOpen && (
                    <p style={{ fontFamily: FO, fontSize: 14, lineHeight: 1.65, color: "#8E8E8E", margin: "14px 0 0", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>{b}</p>
                  )}
                </div>
                <span aria-hidden style={{ width: 30, height: 30, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, lineHeight: 1, color: "#fff", background: "linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)" }}>{isOpen ? "−" : "+"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 04 · MARKET DRIVERS ─────────────────────────────────────────────────────
function MarketDrivers() {
  return (
    <section id="drivers" style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={wrap}>
        <SectionHead num="04" label="Market Drivers" note="Six forces" />
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,60px)", letterSpacing: "-2.2px", lineHeight: 1.03, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 860 }}>
          Why OT security became<span style={{ display: "block", color: "rgba(255,255,255,0.26)" }}>a board-level priority.</span>
        </h2>
        <div className="uae-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 14 }}>
          <DriverCard span={2} n="01" title="Digital Transformation" body="Isolated operational environments are connecting to enterprise networks, cloud and AI." />
          <div style={{ gridColumn: "span 2" }}>
            <ImageTile src={IMG.plant} alt="Industrial plant and pipeline infrastructure" radius={28} minHeight={280} />
          </div>
          <div className="uae-card" style={{ gridColumn: "span 2", position: "relative", overflow: "hidden", borderRadius: 28, padding: "clamp(24px,2.4vw,34px)", background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}>
            <span style={{ position: "absolute", top: -14, right: 14, fontFamily: FD, fontWeight: 800, fontSize: 96, lineHeight: 1, color: "rgba(255,255,255,0.035)" }}>02</span>
            <div style={{ width: 26, height: 3, borderRadius: 2, background: `linear-gradient(90deg,${C_BRIGHT},${C_DEEP})`, marginBottom: 20 }} />
            <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 21, letterSpacing: "-0.7px", color: "#fff", margin: "0 0 16px" }}>IT/OT Convergence</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {["Cloud", "Remote access", "IIoT", "Digital twins", "Analytics"].map((t) => <Tag key={t} hot>{t}</Tag>)}
            </div>
            <p style={{ fontFamily: FO, fontSize: 13.5, lineHeight: 1.6, color: "#707070", margin: "16px 0 0" }}>New opportunities. New attack paths.</p>
          </div>
          <DriverCard span={3} n="03" title="Critical Infrastructure Protection" body="CIIP sets baseline security, assurance and enforcement. Cyber becomes operational governance." />
          <DriverCard span={3} n="04" title="Energy Transition" body="Smart grids, storage, EV infrastructure and digital energy management create new OT estates." />
          <DriverCard span={3} n="05" title="Smart Manufacturing" body="Connected factories require connected cybersecurity." tags={["PLC", "DCS", "SCADA", "HMI", "Robotics", "IIoT"]} />
          <DriverCard span={3} n="06" title="AI & Automation" body="Intelligence moves closer to the plant floor — and must be secured with it." tags={["Model security", "Data integrity", "Adversarial attacks", "OT visibility"]} />
        </div>
      </div>
    </section>
  );
}

function DriverCard({ span, n, title, body, tags }: { span: number; n: string; title: string; body: string; tags?: string[] }) {
  return (
    <div className="uae-card" style={{ gridColumn: `span ${span}`, position: "relative", overflow: "hidden", borderRadius: 28, padding: "clamp(24px,2.4vw,34px)", background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}>
      <span style={{ position: "absolute", top: -14, right: 14, fontFamily: FD, fontWeight: 800, fontSize: 96, lineHeight: 1, color: "rgba(255,255,255,0.035)" }}>{n}</span>
      <div style={{ width: 26, height: 3, borderRadius: 2, background: `linear-gradient(90deg,${C_BRIGHT},${C_DEEP})`, marginBottom: 20 }} />
      <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 21, letterSpacing: "-0.7px", color: "#fff", margin: "0 0 12px" }}>{title}</h3>
      <p style={{ fontFamily: FO, fontSize: 14, lineHeight: 1.65, color: "#8E8E8E", margin: 0 }}>{body}</p>
      {tags && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 16 }}>
          {tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      )}
    </div>
  );
}

// ─── 05 · KEY THEMES ─────────────────────────────────────────────────────────
const THEMES: { eyebrow: string; title: string; tags: string[]; hot?: boolean }[] = [
  { eyebrow: "Governance & Regulation", title: "From national mandates to board-level OT governance", tags: ["UAE CIIP", "Cyber risk", "Compliance", "Board accountability"] },
  { eyebrow: "Energy & Critical Infrastructure", title: "Protecting the systems that keep the UAE running", tags: ["Power", "Water", "Oil & gas", "Nuclear", "Ports"] },
  { eyebrow: "IT/OT Convergence", title: "Breaking down the IT/OT security divide", tags: ["Segmentation", "Zero Trust", "Asset visibility", "Third-party risk"] },
  { eyebrow: "ICS / SCADA Security", title: "Protecting the industrial control layer", tags: ["PLC / DCS", "HMI", "Legacy systems", "OT monitoring"] },
  { eyebrow: "Incident Response & Resilience", title: "When prevention fails", tags: ["OT IR", "Ransomware", "Recovery", "Continuity"] },
  { eyebrow: "AI & the Future of OT", title: "Securing the intelligent industrial environment", tags: ["Predictive security", "Digital twins", "Autonomous ops", "AI risk"], hot: true },
];

function KeyThemes() {
  return (
    <section id="themes" style={wrap}>
      <SectionHead num="05" label="Key Themes" right={<a href="#register" className="uae-link" style={{ marginLeft: "auto", fontFamily: FO, fontSize: 12, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", color: "#fff" }}>Request the agenda →</a>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14, marginBottom: 14 }}>
        <ImageTile src={IMG.keynote} alt="Keynote stage at an OT Security First summit" minHeight={240} />
        <div style={{ borderRadius: 32, padding: "clamp(28px,3vw,44px)", background: `radial-gradient(ellipse 90% 120% at 0% 0%, ${C}38, transparent 60%), linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))`, border: `1px solid ${C}42`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12),0 30px 62px -34px rgba(0,0,0,0.95)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(26px,3.2vw,44px)", letterSpacing: "-1.8px", lineHeight: 1.03, margin: 0 }}>Six tracks.<span style={{ display: "block", color: "rgba(255,255,255,0.28)" }}>One operating reality.</span></h2>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {THEMES.map((th, i) => (
          <div key={th.eyebrow} className={th.hot ? undefined : "uae-card"} style={{ borderRadius: 26, padding: "clamp(22px,2.2vw,30px) clamp(24px,2.4vw,34px)", background: th.hot ? `radial-gradient(ellipse 70% 140% at 100% 0%, ${C}33, transparent 60%), linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.012))` : "linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.012))", border: th.hot ? `1px solid ${C}47` : "1px solid rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09),0 20px 44px -30px rgba(0,0,0,0.9)", display: "flex", flexWrap: "wrap", gap: "clamp(14px,2.5vw,40px)", alignItems: "center" }}>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(22px,2.4vw,32px)", letterSpacing: "-1.4px", color: th.hot ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.16)" }}>{String(i + 1).padStart(2, "0")}</span>
            <div style={{ flex: "1 1 260px" }}>
              <div style={{ fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C, marginBottom: 8 }}>{th.eyebrow}</div>
              <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(18px,1.9vw,25px)", letterSpacing: "-0.8px", lineHeight: 1.15, color: "#fff", margin: 0 }}>{th.title}</h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "flex-end", flex: "1 1 260px" }}>
              {th.tags.map((t) => <Tag key={t} hot={th.hot}>{t}</Tag>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 06 · WHO ATTENDS ────────────────────────────────────────────────────────
const AUDIENCE: { title: string; count: string; roles: string[] }[] = [
  { title: "Executive Leadership", count: "07", roles: ["CISO", "CIO", "CTO", "CDO", "Chief Risk Officer", "COO", "Chief Engineering Officer"] },
  { title: "Cybersecurity Leadership", count: "10", roles: ["VP Cybersecurity", "Head of OT Security", "Head of ICS Security", "Head of SOC", "Threat Intelligence", "Cyber Risk Directors", "OT Security Managers"] },
  { title: "Industrial & Engineering", count: "10", roles: ["Plant Directors", "Operations Directors", "Automation Directors", "SCADA Managers", "Process Control", "IT/OT Convergence Leads", "Asset Management"] },
];

function WhoAttends() {
  return (
    <section id="attend" style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={wrap}>
        <SectionHead num="06" label="Who Attends" note="No fillers" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 14 }}>
          <ImageTile src={IMG.attend} alt="Executives in conversation at an OT Security First summit" minHeight="clamp(280px,30vw,420px)">
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, pointerEvents: "none", padding: 26, background: "linear-gradient(180deg,rgba(10,10,10,0.85),transparent)" }}>
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: "-1px", lineHeight: 1.15, color: "#fff" }}>One room. The people who keep it running.</div>
            </div>
          </ImageTile>
          {AUDIENCE.map((a) => (
            <div key={a.title} style={{ borderRadius: 28, padding: "clamp(24px,2.4vw,34px)", background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
                <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, letterSpacing: "-0.7px", color: "#fff", margin: 0 }}>{a.title}</h3>
                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 13, color: C }}>{a.count}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {a.roles.map((r) => <span key={r} style={{ ...tagPill, fontSize: 12.5, padding: "8px 14px", color: "rgba(255,255,255,0.72)" }}>{r}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 07 · INDUSTRIES ─────────────────────────────────────────────────────────
const INDUSTRIES = ["Oil & Gas", "Petrochemicals", "Energy & Power", "Water & Utilities", "Nuclear", "Manufacturing", "Mining & Minerals", "Transportation", "Ports & Maritime", "Critical Infrastructure", "Advanced Manufacturing", "Smart Infrastructure"];

function Industries() {
  return (
    <section style={{ ...wrap, padding: "clamp(56px,7vw,100px) clamp(20px,4vw,60px)" }}>
      <SectionHead num="07" label="The Industries" right={<span style={{ marginLeft: "auto", fontFamily: FD, fontWeight: 800, fontSize: "clamp(15px,1.6vw,22px)", letterSpacing: "-0.6px", color: "rgba(255,255,255,0.5)" }}>Where IT meets the physical world</span>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 }}>
        {INDUSTRIES.map((n) => (
          <div key={n} className="uae-industry" style={{ borderRadius: 22, padding: "22px 24px", fontFamily: FD, fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px", color: "#fff", background: "linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1),0 18px 36px -28px rgba(0,0,0,0.9)", transition: "border-color 0.35s, color 0.35s, transform 0.35s" }}>{n}</div>
        ))}
      </div>
    </section>
  );
}

// ─── 08 · WHY ATTEND ─────────────────────────────────────────────────────────
function WhyAttend() {
  return (
    <section id="why" style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={wrap}>
        <SectionHead num="08" label="Why Attend" />
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.2vw,60px)", letterSpacing: "-2.2px", lineHeight: 1.03, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 880 }}>
          Frameworks you implement on Monday.<span style={{ display: "block", color: "rgba(255,255,255,0.26)" }}>Not buzzwords you forget by Friday.</span>
        </h2>
        <div className="uae-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 14 }}>
          <WhyCard n="01" title="Learn from Government" body="How UAE policy and regulatory expectations are evolving." />
          <WhyCard n="02" title="Hear from Operators" body="Real-world OT security programmes from energy and industry." />
          <WhyCard n="03" title="Benchmark Your Strategy" body="Compare maturity, governance and architecture with peers." />
          <div style={{ gridColumn: "span 3" }}>
            <ImageTile src={IMG.network} alt="Networking between delegates at an OT Security First summit" radius={28} minHeight={220}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, pointerEvents: "none", padding: 26, background: "linear-gradient(0deg,rgba(10,10,10,0.9),transparent)" }}>
                <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 19, letterSpacing: "-0.6px", color: "#fff", marginBottom: 6 }}>Build Strategic Relationships</div>
                <div style={{ fontFamily: FO, fontSize: 13.5, color: "rgba(255,255,255,0.6)" }}>CISOs · OT leaders · plant executives · authorities</div>
              </div>
            </ImageTile>
          </div>
          <div style={{ gridColumn: "span 3", borderRadius: 28, padding: "clamp(26px,2.6vw,38px)", background: TINT_CARD, border: "1px solid rgba(255,255,255,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5),inset 0 -24px 40px -24px rgba(0,0,0,0.55),0 30px 56px -26px " + C + "99", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: FO, fontSize: 10.5, fontWeight: 700, letterSpacing: "2.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>05 · Practical Solutions</div>
            <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: "-1px", lineHeight: 1.15, color: "#fff", margin: "0 0 16px", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>Visibility, segmentation, detection, response.</h3>
            <p style={{ fontFamily: FO, fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.88)", margin: 0 }}>Technology showcases and boardroom demos across the OT stack.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="uae-card" style={{ gridColumn: "span 2", position: "relative", overflow: "hidden", borderRadius: 28, padding: "clamp(24px,2.4vw,34px)", background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}>
      <span style={{ position: "absolute", top: -12, right: 14, fontFamily: FD, fontWeight: 800, fontSize: 86, lineHeight: 1, color: "rgba(255,255,255,0.035)" }}>{n}</span>
      <div style={{ width: 26, height: 3, borderRadius: 2, background: `linear-gradient(90deg,${C_BRIGHT},${C_DEEP})`, marginBottom: 18 }} />
      <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 19, letterSpacing: "-0.6px", color: "#fff", margin: "0 0 10px" }}>{title}</h3>
      <p style={{ fontFamily: FO, fontSize: 14, lineHeight: 1.65, color: "#8E8E8E", margin: 0 }}>{body}</p>
    </div>
  );
}

// ─── 09 · THE QUESTION ───────────────────────────────────────────────────────
const CONVO: { n: string; label: string; body: string }[] = [
  { n: "01", label: "National Cyber Resilience", body: "CIIP policy is strengthening governance and baseline requirements." },
  { n: "02", label: "Industry 4.0", body: "AED 10 billion accelerating industrial growth and smart manufacturing." },
  { n: "03", label: "Digital Energy", body: "Energy and water infrastructure are increasingly data-driven." },
  { n: "04", label: "AI + Infrastructure", body: "AI, ML and robotics move closer to operational environments." },
  { n: "05", label: "IT/OT Convergence", body: "Cloud, remote access and IIoT dissolve traditional OT boundaries." },
  { n: "06", label: "Cyber-Physical Resilience", body: "Safe, continuous and resilient physical operations." },
];

function TheQuestion() {
  return (
    <section style={wrap}>
      <div style={{ position: "relative", borderRadius: 40, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12),0 40px 90px -40px rgba(0,0,0,0.95)", minHeight: "clamp(420px,48vw,600px)", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG.question} alt="Wide industrial landscape at dusk" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(0deg,rgba(10,10,10,0.94) 12%,rgba(10,10,10,0.35) 60%,rgba(10,10,10,0.6) 100%)" }} />
        <div style={{ position: "relative", padding: "clamp(28px,4vw,64px)", maxWidth: 900 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>09 · The Conversation</span>
          </div>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,4.6vw,68px)", letterSpacing: "-2.6px", lineHeight: 1.02, margin: "0 0 22px", textWrap: "balance" }}>Are we protecting our most critical systems as aggressively as we protect our data?</h2>
          <p style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(18px,2vw,28px)", letterSpacing: "-1px", lineHeight: 1.2, color: C, margin: 0 }}>Industrial environments will become more connected. The question is how securely.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginTop: 14 }}>
        {CONVO.map((c) => (
          <div key={c.n} style={{ borderRadius: 24, padding: "24px 26px", background: "linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.012))", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09)" }}>
            <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 11.5, letterSpacing: "1.4px", textTransform: "uppercase", color: C, marginBottom: 10 }}>{c.n} · {c.label}</div>
            <p style={{ fontFamily: FO, fontSize: 13.5, lineHeight: 1.6, color: "#8E8E8E", margin: 0 }}>{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 10 · THE FOCUS ──────────────────────────────────────────────────────────
function TheFocus() {
  const layers = ["Cybersecurity", "Operational Technology", "Industrial Control Systems", "Critical Infrastructure", "National Resilience"];
  return (
    <section style={{ position: "relative", zIndex: 1, background: BG_2, borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "clamp(28px,4vw,64px)", alignItems: "center" }}>
        <div>
          <SectionHead num="10" label="The Focus" />
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "-2px", lineHeight: 1.04, margin: "0 0 20px" }}>
            Not a broad cyber conference.<span style={{ display: "block", color: "rgba(255,255,255,0.26)" }}>One intersection, in depth.</span>
          </h2>
          <p style={{ fontFamily: FO, fontSize: 15, lineHeight: 1.7, color: "#8E8E8E", margin: 0, maxWidth: 460 }}>Technical, operational, regulatory and strategic realities of protecting industrial environments.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {layers.map((l, i) => {
            const last = i === layers.length - 1;
            const first = i === 0;
            return (
              <div key={l} style={{
                borderRadius: first ? "24px 24px 6px 6px" : last ? "6px 6px 24px 24px" : 6,
                padding: "22px 28px", fontFamily: FD, fontWeight: 800, fontSize: "clamp(16px,1.7vw,22px)", letterSpacing: "-0.5px", color: "#fff",
                background: last ? `linear-gradient(160deg,${C_BRIGHT} 0%,${C} 45%,#8E2A64 100%)` : `linear-gradient(180deg,${C}3d,${C}0d)`,
                border: last ? "1px solid rgba(255,255,255,0.22)" : `1px solid ${C}52`,
                boxShadow: last ? "inset 0 1px 0 rgba(255,255,255,0.45),0 24px 44px -26px " + C + "99" : "inset 0 1px 0 rgba(255,255,255,0.16)",
              }}>{l}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SPEAKERS (coming soon) ──────────────────────────────────────────────────
function SpeakersComingSoon() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="speakers" ref={ref} style={wrap}>
      <SectionHead num="—" label="Speakers" note="Announcing soon" />
      <div style={{ position: "relative", borderRadius: 36, overflow: "hidden", border: `1px solid ${C}2e`, background: `radial-gradient(ellipse 70% 120% at 20% 0%, ${C}1f, transparent 60%), linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1),0 34px 70px -38px rgba(0,0,0,0.95)", padding: "clamp(40px,6vw,88px) clamp(24px,4vw,64px)", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 18px", borderRadius: 9999, border: `1px solid ${C}4d`, background: `${C}14`, fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "2.4px", textTransform: "uppercase", color: C }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C, animation: "uaePulse 2.6s cubic-bezier(0.16,1,0.3,1) infinite" }} />
            Coming Soon
          </span>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(30px,4.4vw,58px)", letterSpacing: "-2.2px", lineHeight: 1.03, margin: "26px 0 16px" }}>
            The 2027 speaker faculty<span style={{ display: "block", color: "rgba(255,255,255,0.28)" }}>is being assembled.</span>
          </h2>
          <p style={{ fontFamily: FO, fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.65, color: "rgba(255,255,255,0.7)", margin: "0 auto 30px", maxWidth: 620 }}>
            Regulators, CISOs, OT leaders and plant executives from across the UAE&rsquo;s critical infrastructure. Announcements roll out ahead of 27 January 2027.
          </p>
          <a href="#register" className="uae-cta-solid" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FO, fontSize: 14, fontWeight: 600, padding: "15px 30px", borderRadius: 9999, background: C, color: INK }}>Register to be notified →</a>
        </motion.div>
        {/* Placeholder speaker tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginTop: 44, maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ aspectRatio: "3 / 4", borderRadius: 20, background: "linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.012))", border: "1px dashed rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: "rgba(255,255,255,0.09)" }}>?</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PAST SERIES SPONSORS MARQUEE ────────────────────────────────────────────
const MARQUEE_ROW_1 = [
  `${S3_LOGOS}/paloalto.png`, `${S3_LOGOS}/fortinet.png`, `${S3_LOGOS}/Claroty.png`, `${S3_LOGOS}/Dragos.png`,
  `${S3_LOGOS}/nozomi-networks.png`, `${S3_LOGOS}/Tenable-logo.png`, `${S3_LOGOS}/kaspersky.png`, `${S3_LOGOS}/sentinelone.png`,
  `${S3_LOGOS}/Microsoft_logo.png`, `${S3_LOGOS}/Google-Cloud-Security.png`, `${S3_LOGOS}/Sonicwall.png`, `${S3_LOGOS}/threatlocker.png`,
  `${S3_LOGOS}/OPSWAT-logo.png`, `${S3_LOGOS}/Xage.png`, `${S3_LOGOS}/corelight.png`,
];
const MARQUEE_ROW_2 = [
  `${S3_LOGOS}/Oracle.png`, `${S3_LOGOS}/EY.png`, `${S3_LOGOS}/Group-IB.png`, `${S3_LOGOS}/Acronis.png`,
  `${S3_LOGOS}/ManageEngine.png`, `${S3_LOGOS}/Wallix.png`, `${S3_LOGOS}/PENTERA.png`, `${S3_LOGOS}/Akamai.png`,
  `${S3_LOGOS}/secureworks.png`, `${S3_LOGOS}/filigran.png`, `${S3_LOGOS}/Anomali.png`, `${S3_LOGOS}/AmiViz.png`,
  `${S3_LOGOS}/GBM.png`, `${S3_LOGOS}/Paramount.png`, `${S3_LOGOS}/YOKOGAWA.png`,
];

function MarqueeRow({ logos, direction }: { logos: string[]; direction: "left" | "right" }) {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to right, ${BG}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to left, ${BG}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div className={`uae-marquee-track is-${direction}`}>
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className="uae-marquee-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={`${logo.split("/").pop()?.replace(/\.(png|jpg|svg|webp)$/i, "").replace(/[-_]/g, " ")} — past sponsor/partner of the OT Security First industrial cybersecurity series`} width={160} height={64} loading="lazy" decoding="async" style={{ maxHeight: 64, maxWidth: 160, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PastSponsorsMarquee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", zIndex: 1, padding: "clamp(64px,7vw,96px) 0", background: BG, overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto 40px", padding: "0 clamp(24px,5vw,80px)", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C}4d)` }} />
          <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: C_BRIGHT }}>Past Series Sponsors & Partners</span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}4d, transparent)` }} />
        </motion.div>
      </div>
      <MarqueeRow logos={MARQUEE_ROW_1} direction="left" />
      <div style={{ height: 16 }} />
      <MarqueeRow logos={MARQUEE_ROW_2} direction="right" />
    </section>
  );
}

// ─── 11 · PARTNER ────────────────────────────────────────────────────────────
function Partner() {
  const tiers = ["Strategic Government", "Lead Industry", "OT Cybersecurity Technology", "Energy & Utilities", "Knowledge", "Networking", "Technology Showcases"];
  return (
    <section id="partner" style={wrap}>
      <SectionHead num="11" label="Why Partner" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))", gap: "clamp(20px,3vw,44px)", alignItems: "start" }}>
        <div>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(28px,3.6vw,52px)", letterSpacing: "-2px", lineHeight: 1.03, margin: "0 0 20px" }}>At the centre of the UAE&rsquo;s industrial cybersecurity conversation.</h2>
          <p style={{ fontFamily: FO, fontSize: 15, lineHeight: 1.7, color: "#8E8E8E", margin: "0 0 26px", maxWidth: 440 }}>Direct engagement with senior decision-makers across critical infrastructure.</p>
          <a href="#register" className="uae-cta-solid" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FO, fontSize: 14, fontWeight: 600, padding: "15px 30px", borderRadius: 9999, background: `linear-gradient(160deg,${C_BRIGHT} 0%,${C} 45%,${C_DEEP} 100%)`, border: "1px solid rgba(255,255,255,0.2)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45),0 14px 30px -14px ${C}bf`, color: INK }}>Request the partnership pack →</a>
          <div style={{ marginTop: 32 }}>
            <ImageTile src={IMG.partner} alt="Technology showcase and exhibition at an OT Security First summit" minHeight="clamp(220px,22vw,300px)" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          {tiers.map((t, i) => {
            const last = i === tiers.length - 1;
            return (
              <div key={t} className={last ? undefined : "uae-card"} style={{ borderRadius: 24, padding: 24, fontFamily: FD, fontWeight: 700, fontSize: 15.5, letterSpacing: "-0.3px", lineHeight: 1.35, color: last ? INK : "#fff", background: last ? `linear-gradient(160deg,${C_BRIGHT} 0%,${C} 45%,${C_DEEP} 100%)` : "linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.012))", border: last ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.09)", boxShadow: last ? `inset 0 1px 0 rgba(255,255,255,0.45),0 24px 44px -26px ${C}99` : "inset 0 1px 0 rgba(255,255,255,0.1),0 20px 40px -30px rgba(0,0,0,0.9)" }}>{t}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── COMMUNITY QUOTE ─────────────────────────────────────────────────────────
function Community() {
  return (
    <section style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px,4vw,60px) clamp(48px,6vw,90px)" }}>
      <div style={{ borderRadius: 36, padding: "clamp(32px,4.5vw,64px)", background: `radial-gradient(ellipse 60% 90% at 90% 10%, ${C}29, transparent 60%), linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))`, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12),0 34px 70px -38px rgba(0,0,0,0.95)" }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(26px,3.4vw,48px)", letterSpacing: "-1.8px", lineHeight: 1.05, margin: "0 0 28px" }}>Government <span style={{ color: C }}>×</span> Industry <span style={{ color: C }}>×</span> Technology</h2>
        <div style={{ paddingLeft: 28, borderLeft: `2px solid ${C}`, maxWidth: 820 }}>
          <p style={{ fontFamily: FDM, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px,2.2vw,28px)", lineHeight: 1.45, letterSpacing: "-0.3px", color: "#fff", margin: 0 }}>Cybersecurity must protect not only information — but the physical systems, processes and people that keep society and industry operating.</p>
        </div>
      </div>
    </section>
  );
}

// ─── REGISTER (shared InquiryForm) ───────────────────────────────────────────
function RegisterSection() {
  return (
    <section id="register" style={{ position: "relative", zIndex: 1, padding: "clamp(56px,7vw,96px) 0", background: BG, overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 55% 50% at 50% 0%, ${C}14 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 80% 100%, ${C}0f 0%, transparent 70%)` }} />
      <div className="uae-register-wrap" style={{ position: "relative", zIndex: 1 }}>
        <InquiryForm
          defaultCountry="AE"
          eventName="OT Security First UAE 2027"
          labelText="Request an Invitation"
        />
      </div>
      <style jsx global>{`
        .uae-register-wrap #get-involved { background: transparent !important; }
        .uae-register-wrap #get-involved > .absolute { display: none; }
        .uae-register-wrap .inquiry-split > div:last-child {
          background: rgba(10,10,10,0.78) !important;
          backdrop-filter: blur(28px) saturate(1.2) !important;
          -webkit-backdrop-filter: blur(28px) saturate(1.2) !important;
          border: 1px solid ${C}25 !important;
          box-shadow: 0 22px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
      `}</style>
    </section>
  );
}

// ─── AGENDA ADVISORY & SPEAKING OPPORTUNITIES (Anna / Hassan / Mayur) ─────────
function ContactCard({ delay, eyebrow, name, role, photo, email, whatsapp, inView, photoPos, photoTransform }: { delay: number; eyebrow: string; name: string; role: string; photo: string; email: string; whatsapp: string; inView: boolean; photoPos?: string; photoTransform?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay, ease: EASE }}
      style={{ position: "relative", borderRadius: 22, border: `1.5px solid ${C}66`, background: "linear-gradient(180deg, rgba(20,14,20,0.85) 0%, rgba(10,10,10,0.96) 100%)", boxShadow: `0 28px 60px ${C}30, 0 0 50px ${C_BRIGHT}15, inset 0 1px 0 rgba(255,255,255,0.05)`, overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <span style={{ position: "absolute", top: 18, left: 18, zIndex: 3, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 12px", borderRadius: 999, background: "rgba(10,10,10,0.78)", border: `1px solid ${C_BRIGHT}66`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", fontFamily: FO, fontSize: 10, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: C_BRIGHT }}>
        <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
        {eyebrow}
      </span>
      <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={`${name}, ${role} at Events First Group — contact for OT Security First UAE 2027`} width={420} height={560} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: photoPos || "center 18%", transform: photoTransform || undefined }} />
        <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "45%", background: "linear-gradient(180deg, transparent 0%, rgba(10,10,10,0.65) 55%, rgba(10,10,10,0.98) 100%)", pointerEvents: "none" }} />
      </div>
      <div style={{ position: "relative", marginTop: -84, padding: "0 22px 22px", zIndex: 2 }}>
        <h3 style={{ fontFamily: FD, fontSize: "clamp(22px,2vw,28px)", fontWeight: 800, letterSpacing: "-1px", color: "white", margin: 0, lineHeight: 1.1, textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>{name}</h3>
        <div style={{ fontFamily: FO, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.6)", margin: "8px 0 18px" }}>{role}</div>
        <div className="uae-contact-pills">
          <a href={`mailto:${email}`} className="uae-contact-pill" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, fontFamily: FO, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>Email</a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="uae-contact-pill" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, fontFamily: FO, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>WhatsApp</a>
        </div>
      </div>
    </motion.div>
  );
}

function AdvisorySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} id="register-interest" style={{ position: "relative", zIndex: 1, padding: "clamp(64px,7vw,96px) 0", background: BG }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 55% 50% at 50% 0%, ${C}12 0%, transparent 65%)` }} />
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(24px,5vw,80px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <span style={{ width: 26, height: 1, background: C }} />
          <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color: C_BRIGHT }}>Agenda Advisory &amp; Speaking Opportunities</span>
          <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, transparent 70%)" }} />
        </div>
        <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.1, ease: EASE }} style={{ fontFamily: FD, fontWeight: 800, fontSize: "clamp(34px,5vw,64px)", letterSpacing: "-2.2px", lineHeight: 0.98, color: "white", margin: "0 0 20px", maxWidth: 880 }}>
          Shape the conversation &mdash;{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C }}>start it here.</em>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay: 0.18, ease: EASE }} style={{ fontFamily: FO, fontSize: "clamp(14px,1.1vw,16px)", fontWeight: 400, lineHeight: 1.55, color: "rgba(255,255,255,0.78)", margin: "0 0 44px", maxWidth: 680 }}>
          Real people, ready to help you with speaking and sponsorship enquiries.
        </motion.p>
        <div className="uae-contact-split" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(20px,2.4vw,32px)", alignItems: "stretch" }}>
          <ContactCard delay={0.2} eyebrow="Speaking" name="Anna Firdouse Shah" role="Senior Conference Producer" photo={`${S3}/team/anna+blur+bg.png`} photoPos="center center" photoTransform="scale(1.4) translateX(-12%)" email="anna@eventsfirstgroup.com" whatsapp="https://wa.me/971545714377" inView={inView} />
          <ContactCard delay={0.32} eyebrow="Sponsorship" name="Mohammed Hassan" role="Partnership Manager" photo={`${S3}/about-us-photos/hassan.jpg`} email="hassan@eventsfirstgroup.com" whatsapp="https://wa.me/971545714377" inView={inView} />
          <ContactCard delay={0.44} eyebrow="Sponsorship" name="Mayur Methi" role="Partnership Manager" photo={`${S3}/about-us-photos/Mayur-Methi.png`} email="mayur@eventsfirstgroup.com" whatsapp="https://wa.me/971545714377" inView={inView} />
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function OTUaePage() {
  return (
    <main style={{ background: BG, color: "#fff", fontFamily: FO, fontWeight: 300, position: "relative", overflowX: "hidden" }}>
      <AmbientBg />
      <EventNavigation />
      <Hero />
      <StatPlates />
      <TheEvent />
      <WhyAbuDhabi />
      <TheMandate />
      <MarketDrivers />
      <KeyThemes />
      <WhoAttends />
      <Industries />
      <WhyAttend />
      <TheQuestion />
      <TheFocus />
      <SpeakersComingSoon />
      <PastSponsorsMarquee />
      <Partner />
      <Community />
      <RegisterSection />
      <AdvisorySection />
      <Footer />

      <style jsx global>{`
        @keyframes uaePulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.25); } }
        @keyframes uaeMarqueeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes uaeMarqueeRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .uae-marquee-track { display: flex; width: max-content; will-change: transform; }
        .uae-marquee-track.is-left { animation: uaeMarqueeLeft 35s linear infinite; }
        .uae-marquee-track.is-right { animation: uaeMarqueeRight 35s linear infinite; }
        .uae-marquee-item { flex-shrink: 0; height: 80px; width: 180px; margin-right: 40px; display: flex; align-items: center; justify-content: center; opacity: 0.55; }
        .uae-card { transition: border-color 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .uae-card:hover { border-color: ${C}66 !important; transform: translateY(-2px); }
        .uae-industry { }
        .uae-industry:hover { border-color: ${C}80 !important; color: ${C_LIGHT} !important; transform: translateY(-2px); }
        .uae-q:hover { border-color: ${C}73 !important; transform: translateY(-1px); }
        .uae-cta-solid { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s; }
        .uae-cta-solid:hover { transform: translateY(-2px); box-shadow: 0 12px 34px ${C}73; color: ${INK}; }
        .uae-cta-ghost { transition: border-color 0.35s, color 0.35s; }
        .uae-cta-ghost:hover { border-color: ${C} !important; color: ${C} !important; }
        .uae-link:hover { color: ${C} !important; }
        .uae-contact-pills { display: flex; flex-direction: row; gap: 10px; align-items: center; flex-wrap: wrap; }
        .uae-contact-pill { transition: background 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, color 0.35s, transform 0.35s; }
        .uae-contact-pill:hover { background: ${C}18 !important; border-color: ${C}55 !important; color: ${C_LIGHT} !important; transform: translateY(-1px); }
        @media (max-width: 1100px) {
          .uae-bento { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .uae-bento > * { grid-column: span 1 !important; }
        }
        @media (max-width: 700px) {
          .uae-bento { grid-template-columns: 1fr !important; }
          .uae-bento > * { grid-column: auto !important; }
        }
        @media (max-width: 880px) {
          .uae-contact-split { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .uae-marquee-track { animation: none !important; }
        }
      `}</style>
    </main>
  );
}
