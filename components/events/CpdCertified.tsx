"use client";

import React from "react";

// General CPD accreditation badge (event-specific artwork can override via `logoUrl`).
const CPD_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/CPD.png";

/**
 * CpdCertified — a self-contained "We are a CPD Certified Event" band for EFG
 * event pages. Deliberately uses a slightly different background from the
 * surrounding sections so the accreditation reads as its own beat.
 *
 * - `theme`   drives the eyebrow/button accent (pass the page's primary colour).
 * - `dark`    toggles the light/dark treatment (default dark — most event pages).
 * - `points`  CPD hours attendees can earn (default 7).
 * - Register CTA: pass `onRegister` for modal pages, otherwise it links to
 *   `registerHref` (defaults to the `#register` anchor).
 */
export default function CpdCertified({
  eventName,
  theme,
  points = 7,
  registerHref = "#register",
  onRegister,
  logoUrl = CPD_LOGO,
  logoWide = false,
  dark = true,
}: {
  eventName: string;
  theme: string;
  points?: number;
  registerHref?: string;
  onRegister?: () => void;
  logoUrl?: string;
  /** true when logoUrl is a self-contained "Approved Provider" plaque (already framed + numbered). */
  logoWide?: boolean;
  dark?: boolean;
}) {
  const text = dark ? "#ffffff" : "#0e1a2b";
  const sub = dark ? "rgba(255,255,255,0.72)" : "rgba(20,34,54,0.7)";
  const sectionBg = dark
    ? `radial-gradient(130% 140% at 100% 0%, ${theme}22, transparent 58%), linear-gradient(180deg, #10141c 0%, #0b0e13 100%)`
    : `radial-gradient(130% 140% at 100% 0%, ${theme}14, transparent 58%), linear-gradient(180deg, #f5f7fa 0%, #eef1f5 100%)`;

  const handleClick = (e: React.MouseEvent) => {
    if (onRegister) {
      e.preventDefault();
      onRegister();
      return;
    }
    // Lenis (global smooth-scroll) resets native hash jumps, so drive it directly.
    if (registerHref.startsWith("#") && typeof document !== "undefined") {
      const el = document.getElementById(registerHref.slice(1));
      if (el) {
        e.preventDefault();
        const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).__lenis;
        if (lenis && typeof lenis.scrollTo === "function") lenis.scrollTo(el, { offset: -80 });
        else el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section aria-label="CPD accreditation" style={{ position: "relative", overflow: "hidden", padding: "clamp(48px,7vw,92px) clamp(20px,5vw,64px)", background: sectionBg, borderTop: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(20,34,54,0.08)", borderBottom: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(20,34,54,0.08)" }}>
      <div className="cpd-grid" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1.35fr 0.9fr", gap: "clamp(28px,4vw,64px)", alignItems: "center" }}>
        {/* Copy */}
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: theme }}>
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: theme, boxShadow: `0 0 10px ${theme}` }} />
            Accredited Event
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,42px)", letterSpacing: "-0.02em", lineHeight: 1.08, color: text, margin: "14px 0 0" }}>
            We are a CPD Certified Event.
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: "clamp(14.5px,1.4vw,16.5px)", lineHeight: 1.7, color: sub, margin: "16px 0 0", maxWidth: 560 }}>
            <strong style={{ color: text, fontWeight: 700 }}>{eventName}</strong> is certified by the CPD Certification Service. Attendees receive a CPD certificate after attending the event.
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(16px,1.7vw,20px)", color: text, margin: "18px 0 0", letterSpacing: "-0.01em" }}>
            Earn up to {points} hours of CPD points.
          </p>
          <a
            href={registerHref}
            onClick={handleClick}
            style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 26, padding: "14px 28px", borderRadius: 12, background: theme, color: "#ffffff", fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: `0 14px 32px ${theme}55`, transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
            className="cpd-cta"
          >
            Register Now
            <span aria-hidden style={{ fontSize: 16 }}>→</span>
          </a>
        </div>

        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {logoWide ? (
            // Self-contained "Approved Provider" plaque (already framed + numbered).
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={`${eventName} — CPD certified`} loading="lazy" decoding="async" style={{ width: "min(100%, 400px)", height: "auto", display: "block", borderRadius: 14, boxShadow: "0 24px 60px rgba(10,18,34,0.28)" }} />
          ) : (
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "clamp(22px,2.6vw,32px)", borderRadius: 22, background: "#ffffff", border: "1px solid rgba(20,34,54,0.1)", boxShadow: "0 24px 60px rgba(10,18,34,0.28)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt={`${eventName} — CPD certified`} loading="lazy" decoding="async" style={{ width: "clamp(130px,15vw,180px)", height: "auto", display: "block" }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E38B00" }}>Approved Provider</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .cpd-cta:hover { transform: translateY(-2px); box-shadow: 0 20px 42px ${theme}66; }
        @media (max-width: 780px) {
          .cpd-grid { grid-template-columns: 1fr !important; gap: 34px !important; }
        }
      `}</style>
    </section>
  );
}
