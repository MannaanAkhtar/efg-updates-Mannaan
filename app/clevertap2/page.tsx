"use client";

import React, { useRef, useState, useEffect, memo } from "react";
import { useInView } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

// ─── CleverTap Design Tokens ────────────────────────────────────────────────
const CT_BLUE = "#133B58";
const CT_RED = "#EF4444";
const CT_BLACK = "#000D26";
const CT_CADET = "#50596A";
const CT_SLATE = "#858B97";
const CT_SALT = "#F7F7F8";
const CT_WHITE = "#ffffff";
const CT_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/CleverTap_Logotype.png";

// ─── Data ────────────────────────────────────────────────────────────────────
const TAKEAWAYS = [
  { heading: "Operationalizing Trust at Scale", desc: "Turning strategy into repeatable workflows with real-time triggers and smart segmentation." },
  { heading: "Real-World Engagement Playbooks", desc: "Examples from fintech, ecommerce, telco, and subscription brands on proactive, context-aware customer engagement." },
  { heading: "Live Demo: From Strategy to Execution", desc: "A hands-on walkthrough of building a retention campaign end to end." },
  { heading: "Retention Strategy Powered by Trust", desc: "How trust-based retention drives measurable impact on churn, NPS, and customer lifetime value." },
];

const AGENDA = [
  { time: "11:03 AM", duration: "5 min", title: "Welcome & Ground Rules", presenter: "Event Host / Moderator" },
  { time: "11:03 AM", duration: "10 min", title: "Keynote", presenter: "Mohammad Tannous", highlight: true },
  { time: "11:13 AM", duration: "20 min", title: "Panel Discussion", presenter: "Mohammad Tannous + Panelists", highlight: true },
  { time: "11:33 AM", duration: "12 min", title: "Teaser Demo", presenter: "Growth & Retention Consultant" },
  { time: "11:45 AM", duration: "12 min", title: "Audience Q&A", presenter: "Moderator + Panelists" },
  { time: "11:57 AM", duration: "15 min", title: "Closing Remarks & Next Steps", presenter: "Moderator + Panelists" },
];

const OVERVIEW_WORDS = "Is trust the missing piece in your retention strategy?".split(" ");

// ─── COUNTDOWN ──────────────────────────────────────────────────────────────
const CountdownDisplay = memo(function CountdownDisplay({ target }: { target: string }) {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, t - Date.now());
      setCd({ d: Math.floor(diff / 864e5), h: Math.floor((diff % 864e5) / 36e5), m: Math.floor((diff % 36e5) / 6e4), s: Math.floor((diff % 6e4) / 1e3) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hrs" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map((item) => (
        <div key={item.l} className="ct-cd-tile" style={{
          textAlign: "center", padding: "12px 16px", borderRadius: 14, minWidth: 58,
          background: "rgba(19,59,88,0.04)",
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          boxShadow: "0 4px 12px rgba(19,59,88,0.05), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(19,59,88,0.03)",
        }}>
          <span style={{ fontFamily: "var(--font-opensans)", fontSize: 24, fontWeight: 700, color: CT_BLUE, display: "block", letterSpacing: "-1px", lineHeight: 1.2 }}>{String(item.v).padStart(2, "0")}</span>
          <span style={{ fontFamily: "var(--font-opensans)", fontSize: 8, fontWeight: 500, color: CT_SLATE, textTransform: "uppercase", letterSpacing: "1px" }}>{item.l}</span>
        </div>
      ))}
    </div>
  );
});

// ─── HERO ────────────────────────────────────────────────────────────────────
function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    COUNTRY_CODES.find(c => c.country === "AE") || COUNTRY_CODES[0]
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useGSAP(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const lines = heroRef.current.querySelectorAll(".ct-title-line");
    const kicker = heroRef.current.querySelector(".ct-kicker");
    const staggerItems = heroRef.current.querySelectorAll(".ct-hero-stagger");
    const tiles = heroRef.current.querySelectorAll(".ct-cd-tile");

    if (kicker) tl.fromTo(kicker, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)" }, 0.1);
    tl.fromTo(lines, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.9, stagger: 0.15 }, 0.3);
    tl.fromTo(staggerItems, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out" }, 0.9);
    tl.fromTo(tiles, { y: -20, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.6)" }, 1.2);
    if (formRef.current) tl.fromTo(formRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, 0.5);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    if (formData.email && !isWorkEmail(formData.email)) { setEmailError("Please use your work email"); setSubmitting(false); return; }
    const phoneErr = validatePhone(formData.phone || "", selectedCountry);
    if (phoneErr) { setPhoneError(phoneErr); setSubmitting(false); return; }
    const combinedPhone = `${selectedCountry.code}${(formData.phone || "").replace(/[\s\-()]/g, "")}`;
    const result = await submitForm({
      type: "attend", full_name: formData.name || "", email: formData.email || "",
      company: formData.company || "", job_title: formData.title || "", phone: combinedPhone,
      event_name: "CleverTap Engaging Customers Webinar 2026", metadata: { country: formData.country || "", message: formData.message || "" },
    });
    setSubmitting(false);
    if (result.success) setSubmitted(true);
    else setFormError(result.error || "Something went wrong.");
  };

  const handleChange = (n: string, v: string) => setFormData(p => ({ ...p, [n]: v }));
  const resetForm = () => { setSubmitted(false); setFormError(null); setFormData({}); setPhoneError(null); setEmailError(null); };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1px solid rgba(19,59,88,0.1)", background: "rgba(255,255,255,0.35)",
    color: CT_BLACK, fontFamily: "var(--font-opensans)", fontSize: 13.5, fontWeight: 400,
    outline: "none", transition: "all 0.3s ease",
    backdropFilter: "blur(12px)",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-opensans)", fontSize: 11, fontWeight: 500,
    color: CT_CADET, marginBottom: 5, display: "block", letterSpacing: "0.3px",
  };

  return (
    <section ref={heroRef} style={{ position: "relative", overflow: "hidden", minHeight: "100dvh" }}>
      {/* Light base */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: CT_SALT }} />

      {/* Aurora layer 1 — main streaks */}
      <div className="ct-aurora-1" />
      {/* Aurora layer 2 — offset for depth */}
      <div className="ct-aurora-2" />

      {/* Soft radial vignette — keeps center text crisp */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "radial-gradient(ellipse 60% 50% at 35% 50%, rgba(247,247,248,0.7) 0%, transparent 70%)" }} />

      <style>{`
        .ct-aurora-1, .ct-aurora-2 {
          position: absolute; inset: -20px; z-index: 1; pointer-events: none;
          background-size: 300%, 200%;
          will-change: background-position;
        }
        .ct-aurora-1 {
          background-image:
            repeating-linear-gradient(100deg, ${CT_SALT} 0%, ${CT_SALT} 7%, transparent 10%, transparent 12%, ${CT_SALT} 16%),
            repeating-linear-gradient(100deg, rgba(19,59,88,0.4) 10%, rgba(59,130,246,0.3) 15%, rgba(19,59,88,0.2) 20%, rgba(99,102,241,0.25) 25%, rgba(59,130,246,0.15) 30%);
          filter: blur(8px);
          opacity: 0.6;
          animation: ctAurora 45s linear infinite;
        }
        .ct-aurora-2 {
          background-image:
            repeating-linear-gradient(100deg, transparent 0%, transparent 7%, rgba(247,247,248,0.5) 10%, transparent 12%, transparent 16%),
            repeating-linear-gradient(100deg, rgba(59,130,246,0.3) 10%, rgba(19,59,88,0.2) 15%, rgba(99,102,241,0.15) 20%, rgba(59,130,246,0.25) 25%, rgba(19,59,88,0.1) 30%);
          background-size: 200%, 100%;
          filter: blur(6px);
          opacity: 0.4;
          mix-blend-mode: multiply;
          animation: ctAurora 45s linear infinite reverse;
        }
        @keyframes ctAurora {
          from { background-position: 50% 50%, 50% 50%; }
          to { background-position: 350% 50%, 350% 50%; }
        }
        .ct-form-input:focus { border-color: rgba(19,59,88,0.3) !important; box-shadow: 0 0 0 3px rgba(19,59,88,0.06); }
        .ct-form-input::placeholder { color: rgba(19,59,88,0.3); }
        .ct-submit { transition: all 0.35s cubic-bezier(0.165,0.84,0.44,1); }
        .ct-submit:hover:not(:disabled) { background: #dc2626 !important; transform: translateY(-1px); box-shadow: 0 8px 30px rgba(239,68,68,0.3); }
        @media (max-width: 768px) {
          .ct-hero-grid { grid-template-columns: 1fr !important; }
          .ct-hero-left { text-align: center !important; }
          .ct-hero-left > div { justify-content: center !important; }
          .ct-hero-left > h1 { font-size: clamp(28px, 8vw, 40px) !important; }
          .ct-hero-stagger[style*="inline-flex"] { justify-content: center !important; }
        }
        @media (max-width: 500px) {
          .ct-form-fields { grid-template-columns: 1fr !important; }
          .ct-cd-tile { min-width: 48px !important; padding: 8px 10px !important; }
          .ct-cd-tile span:first-child { font-size: 20px !important; }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 5, maxWidth: 1200, margin: "0 auto", padding: "clamp(100px, 12vh, 120px) clamp(24px, 5vw, 80px) clamp(60px, 8vh, 80px)", width: "100%" }}>
        <div className="ct-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 60px)", alignItems: "center" }}>

          {/* Left — Content */}
          <div className="ct-hero-left">
            {/* Kicker — liquid glass pill */}
            <div className="ct-kicker" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "clamp(7px, 1vh, 9px) clamp(14px, 2vw, 20px) clamp(7px, 1vh, 9px) clamp(12px, 1.5vw, 16px)", borderRadius: 50,
              background: "rgba(19,59,88,0.04)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              boxShadow: "0 4px 16px rgba(19,59,88,0.06), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(19,59,88,0.03)",
              marginBottom: "clamp(16px, 3vh, 28px)", opacity: 0,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: CT_RED, boxShadow: `0 0 8px ${CT_RED}60` }} />
              <span style={{ fontFamily: "var(--font-opensans)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: CT_BLUE }}>Webinar</span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "var(--font-opensans)", fontSize: "clamp(24px, 4.4vw, 44px)", lineHeight: 1.1, letterSpacing: "-1.8px", color: CT_BLACK, margin: "0 0 clamp(12px, 2vh, 22px)", textShadow: "0 1px 2px rgba(255,255,255,0.5)" }}>
              <span style={{ display: "block", overflow: "hidden" }}><span className="ct-title-line" style={{ display: "block", fontWeight: 800, opacity: 0 }}>Engaging Customers in</span></span>
              <span style={{ display: "block", overflow: "hidden" }}><span className="ct-title-line" style={{ display: "block", fontWeight: 800, opacity: 0 }}><span style={{ color: CT_BLUE }}>Uncertain Times</span></span></span>
              <span style={{ display: "block", overflow: "hidden" }}><span className="ct-title-line" style={{ display: "block", fontWeight: 800, opacity: 0, fontSize: "0.6em" }}>How Middle East Brands Are Making Retention Their Growth Strategy</span></span>
            </h1>

            {/* Tagline */}
            <p className="ct-hero-stagger" style={{ fontFamily: "var(--font-opensans)", fontSize: "clamp(13px, 1.3vw, 16px)", fontWeight: 400, color: CT_CADET, margin: "0 0 clamp(16px, 3vh, 28px)", lineHeight: 1.7, opacity: 0, maxWidth: 460 }}>
              A peer-led session for marketing, CRM, and growth leaders across Middle East.
            </p>

            {/* Meta strip — liquid glass */}
            <div className="ct-hero-stagger" style={{
              display: "inline-flex", gap: 0, marginBottom: "clamp(16px, 3vh, 28px)", borderRadius: 14, overflow: "hidden",
              background: "rgba(19,59,88,0.04)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              boxShadow: "0 4px 16px rgba(19,59,88,0.06), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(19,59,88,0.03)",
              opacity: 0,
            }}>
              {[
                { label: "Date", value: "10 June 2026", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { label: "Time", value: "11:00 AM GST", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "Format", value: "Virtual · 60 min", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
              ].map((item, i) => (
                <div key={item.label} style={{ padding: "clamp(10px, 1.5vh, 14px) clamp(14px, 2vw, 22px)", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.15)" : "none", display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 12px)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CT_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, flexShrink: 0 }}><path d={item.icon} /></svg>
                  <div>
                    <span style={{ fontFamily: "var(--font-opensans)", fontSize: 9, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", color: CT_SLATE, display: "block", marginBottom: 3 }}>{item.label}</span>
                    <span style={{ fontFamily: "var(--font-opensans)", fontSize: 14, fontWeight: 700, color: CT_BLACK, letterSpacing: "-0.3px" }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Countdown */}
            <div className="ct-hero-stagger" style={{ opacity: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "6px 14px 6px 10px", borderRadius: 50, background: "rgba(19,59,88,0.04)", border: "1px solid rgba(19,59,88,0.06)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: CT_BLUE, opacity: 0.4 }} />
                <span style={{ fontFamily: "var(--font-opensans)", fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: CT_BLUE, opacity: 0.5 }}>Starts In</span>
              </div>
              <CountdownDisplay target="2026-06-10T11:00:00+04:00" />
            </div>
          </div>

          {/* Right — Form card — transparent liquid glass */}
          <div ref={formRef} style={{
            borderRadius: 28, padding: 2, opacity: 0, marginTop: -2,
            background: "linear-gradient(145deg, rgba(255,255,255,0.35) 0%, rgba(19,59,88,0.08) 50%, rgba(255,255,255,0.2) 100%)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 -1px 0 rgba(19,59,88,0.08) inset, 0 32px 80px rgba(19,59,88,0.1), 0 4px 16px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              borderRadius: 26, padding: "clamp(28px, 3.5vw, 40px)",
              background: "linear-gradient(165deg, rgba(19,59,88,0.04) 0%, rgba(19,59,88,0.06) 50%, rgba(19,59,88,0.03) 100%)",
              backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(19,59,88,0.04)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Top glass reflection */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.3) 70%, transparent 95%)" }} />
              {/* Corner blue tint */}
              <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(19,59,88,0.06), transparent 65%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.04), transparent 65%)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CT_RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
              <h3 style={{ fontFamily: "var(--font-opensans)", fontWeight: 700, fontSize: 22, color: CT_BLACK, margin: 0, letterSpacing: "-0.5px" }}>Register Your Interest</h3>
            </div>
            <p style={{ fontFamily: "var(--font-opensans)", fontSize: 13, color: CT_CADET, margin: "0 0 8px", lineHeight: 1.5 }}>Secure your seat for this exclusive session.</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 50, background: `${CT_RED}10`, border: `1px solid ${CT_RED}30`, marginBottom: 16 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: CT_RED, boxShadow: `0 0 6px ${CT_RED}` }} />
              <span style={{ fontFamily: "var(--font-opensans)", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: CT_RED }}>Limited to 100 Seats</span>
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-opensans)", fontWeight: 700, fontSize: 20, color: CT_BLACK, margin: "0 0 6px" }}>You&apos;re Registered</h3>
                <p style={{ fontFamily: "var(--font-opensans)", fontSize: 13, color: CT_CADET, margin: "0 0 16px" }}>We&apos;ll confirm your seat within 24 hours.</p>
                <button onClick={resetForm} style={{ fontFamily: "var(--font-opensans)", fontSize: 13, fontWeight: 500, color: CT_RED, background: "none", border: "none", cursor: "pointer" }}>Submit another &rarr;</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="ct-form-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" value={formData.name || ""} onChange={e => handleChange("name", e.target.value)} placeholder="Your full name" required className="ct-form-input" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Work Email</label>
                    <input type="email" value={formData.email || ""} onChange={e => { handleChange("email", e.target.value); setEmailError(null); }} placeholder="you@company.com" required className="ct-form-input" style={inputStyle}
                      onBlur={e => { const val = formData.email || e.currentTarget.value; if (val && !isWorkEmail(val)) setEmailError("Please use your work email"); }} />
                    {emailError && <p style={{ color: CT_RED, fontSize: 11, margin: "4px 0 0" }}>{emailError}</p>}
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Phone Number</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <select value={`${selectedCountry.code}|${selectedCountry.country}`} onChange={e => { const [code, country] = e.target.value.split("|"); const c = COUNTRY_CODES.find(cc => cc.code === code && cc.country === country); if (c) { setSelectedCountry(c); setPhoneError(null); } }} className="ct-form-input" style={{ ...inputStyle, width: 120, flexShrink: 0, appearance: "none", cursor: "pointer" }}>
                        {COUNTRY_CODES.map(cc => (<option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>{cc.country} {cc.code}</option>))}
                      </select>
                      <input type="tel" value={formData.phone || ""} onChange={e => { handleChange("phone", e.target.value); setPhoneError(null); }} placeholder={selectedCountry.placeholder} maxLength={selectedCountry.length} className="ct-form-input" style={{ ...inputStyle, flex: 1 }} />
                    </div>
                    {phoneError && <p style={{ color: CT_RED, fontSize: 11, margin: "4px 0 0" }}>{phoneError}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input type="text" value={formData.company || ""} onChange={e => handleChange("company", e.target.value)} placeholder="Company name" required className="ct-form-input" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Job Title</label>
                    <input type="text" value={formData.title || ""} onChange={e => handleChange("title", e.target.value)} placeholder="Your role" required className="ct-form-input" style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Country</label>
                    <select value={formData.country || ""} onChange={e => handleChange("country", e.target.value)} required className="ct-form-input" style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                      <option value="" style={{ color: "#222", background: "#fff" }}>Select your country</option>
                      {COUNTRY_CODES.map(cc => (<option key={cc.country} value={cc.name} style={{ color: "#222", background: "#fff" }}>{cc.name}</option>))}
                    </select>
                  </div>
                </div>
                <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                {formError && <p style={{ color: CT_RED, fontFamily: "var(--font-opensans)", fontSize: 12, margin: "8px 0 0" }}>{formError}</p>}
                <button type="submit" disabled={submitting} className="ct-submit" style={{
                  width: "100%", marginTop: 18, padding: "14px 28px", borderRadius: 12,
                  background: CT_RED, color: "#fff",
                  fontFamily: "var(--font-opensans)", fontSize: 14, fontWeight: 600,
                  border: "none", cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: `0 4px 16px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.2)`,
                  letterSpacing: "0.3px",
                }}>
                  {submitting ? "Submitting..." : "Register Your Interest"} {!submitting && <span>&rarr;</span>}
                </button>
                <p style={{ fontFamily: "var(--font-opensans)", fontSize: 11, color: "rgba(19,59,88,0.45)", textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}>
                  By submitting this form, you agree to CleverTap&apos;s{" "}
                  <a href="https://clevertap.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: CT_BLUE, textDecoration: "underline", fontWeight: 600 }}>Privacy Policy</a>.
                </p>
              </form>
            )}
            {/* Bottom inner glow */}
            <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(19,59,88,0.06), transparent)" }} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────
function OverviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  useGSAP(() => {
    if (!inView) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (headerRef.current) {
      const dashes = headerRef.current.querySelectorAll(".ct-ov-dash");
      const kicker = headerRef.current.querySelector(".ct-ov-kicker");
      tl.fromTo(dashes, { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.05 }, 0)
        .fromTo(kicker, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1);
    }
    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll(".ct-reveal-word");
      tl.fromTo(words, { opacity: 0.05, filter: "blur(8px)", y: 8 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.5, stagger: 0.04, ease: "power2.out" }, 0.2);
    }
    if (headerRef.current) {
      const divider = headerRef.current.querySelector(".ct-ov-divider");
      if (divider) tl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.6, transformOrigin: "center" }, 0.6);
    }
    if (bodyRef.current) {
      const paras = bodyRef.current.querySelectorAll(".ct-ov-para");
      tl.fromTo(paras, { clipPath: "inset(0 0 30% 0)", opacity: 0, y: 14 }, { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.7);
    }
  }, [inView]);

  return (
    <section ref={sectionRef} id="overview" style={{
      background: CT_SALT, padding: "clamp(56px, 7vw, 80px) 0", position: "relative", overflow: "hidden",
    }}>
      {/* Static aurora-inspired bg — visible orbs, no animation */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 70% 60% at 10% 20%, rgba(19,59,88,0.12) 0%, transparent 55%),
          radial-gradient(ellipse 60% 55% at 90% 70%, rgba(59,130,246,0.1) 0%, transparent 55%),
          radial-gradient(ellipse 50% 50% at 50% 90%, rgba(99,102,241,0.08) 0%, transparent 50%),
          radial-gradient(ellipse 45% 40% at 70% 15%, rgba(19,59,88,0.07) 0%, transparent 50%)
        `,
      }} />
      {/* Static repeating streaks — mimics aurora without animation */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.15,
        backgroundImage: `
          repeating-linear-gradient(100deg, transparent 0%, transparent 7%, rgba(19,59,88,0.08) 10%, transparent 12%, transparent 16%),
          repeating-linear-gradient(100deg, rgba(19,59,88,0.15) 10%, rgba(59,130,246,0.1) 15%, rgba(19,59,88,0.06) 20%, rgba(99,102,241,0.08) 25%, rgba(59,130,246,0.05) 30%)
        `,
        backgroundSize: "300% 200%",
        backgroundPosition: "30% 50%",
      }} />
      {/* Top transition line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(19,59,88,0.1), transparent)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        {/* Split layout */}
        <div className="ct-ov-split" style={{ display: "grid", gridTemplateColumns: "0.42fr 1fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "start" }}>

          {/* Left — Heading + pull quote */}
          <div ref={headerRef} style={{ position: "sticky", top: 100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div className="ct-ov-dash" style={{ width: 28, height: 2, background: CT_BLUE, borderRadius: 1, transform: "scaleX(0)" }} />
              <span className="ct-ov-kicker" style={{ fontFamily: "var(--font-opensans)", fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: CT_BLUE, opacity: 0 }}>About This Webinar</span>
            </div>

            <div ref={headingRef} style={{ display: "flex", flexWrap: "wrap", gap: "0 10px", marginBottom: 22 }}>
              {OVERVIEW_WORDS.map((word, i) => (
                <span key={i} className="ct-reveal-word" style={{
                  fontFamily: "var(--font-opensans)", fontWeight: 700,
                  fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-1px",
                  color: word === "trust." || word === "revenue." ? CT_BLUE : CT_BLACK,
                  lineHeight: 1.2, display: "inline-block", opacity: 0,
                }}>{word}</span>
              ))}
            </div>

            <div className="ct-ov-divider" style={{ width: 48, height: 2, background: CT_RED, borderRadius: 1, transform: "scaleX(0)", marginBottom: 20 }} />

            <p style={{ fontFamily: "var(--font-opensans)", fontSize: 14, color: CT_SLATE, lineHeight: 1.7, margin: "0 0 28px" }}>
              Relevance builds trust. Trust builds revenue.
            </p>

          </div>

          {/* Right — Body text in liquid glass card */}
          <div ref={bodyRef}>
            {/* Outer bezel */}
            <div style={{
              borderRadius: 26, padding: 2,
              background: "linear-gradient(145deg, rgba(255,255,255,0.45) 0%, rgba(19,59,88,0.08) 50%, rgba(255,255,255,0.3) 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 -1px 0 rgba(19,59,88,0.06) inset, 0 24px 64px rgba(19,59,88,0.08), 0 4px 12px rgba(0,0,0,0.03)",
            }}>
              {/* Inner glass panel */}
              <div style={{
                borderRadius: 24, padding: "clamp(28px, 3.5vw, 40px)",
                background: "rgba(19,59,88,0.03)",
                backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(19,59,88,0.03)",
                position: "relative", overflow: "hidden",
              }}>
                {/* Top glass reflection */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.65) 25%, rgba(255,255,255,0.3) 75%, transparent 95%)" }} />
                {/* Inner border ring */}
                <div style={{ position: "absolute", inset: 8, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)", pointerEvents: "none" }} />
                {/* Corner orb */}
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(19,59,88,0.05), transparent 65%)", pointerEvents: "none" }} />

                {/* Quote icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(19,59,88,0.08)" style={{ marginBottom: 16 }}>
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
                </svg>

                <p className="ct-ov-para" style={{ fontFamily: "var(--font-opensans)", fontSize: "clamp(14px, 1.3vw, 15.5px)", fontWeight: 400, color: CT_CADET, lineHeight: 1.85, margin: "0 0 18px", opacity: 0 }}>
                  The brands customers trust most are the ones that stay <span style={{ color: CT_BLACK, fontWeight: 600 }}>present, relevant, and helpful</span>. In this webinar, senior marketing and CRM leaders share how they are shifting from promotional, broadcast-style messaging to personalised, context-aware engagement that deepens customer relationships.
                </p>
                <p className="ct-ov-para" style={{ fontFamily: "var(--font-opensans)", fontSize: "clamp(14px, 1.3vw, 15.5px)", fontWeight: 400, color: CT_CADET, lineHeight: 1.85, margin: "0 0 22px", opacity: 0 }}>
                  You will leave with a clear framework for making <span style={{ color: CT_BLACK, fontWeight: 600 }}>retention a trust-building strategy</span>, not just a cost metric.
                </p>

                {/* Bottom accent */}
                <div style={{ position: "absolute", bottom: 0, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(19,59,88,0.05), transparent)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .ct-ov-split { grid-template-columns: 1fr !important; }
          .ct-ov-split > div:first-child { position: relative !important; top: auto !important; }
        }
      `}</style>
    </section>
  );
}

// ─── KEY TAKEAWAYS ───────────────────────────────────────────────────────────
function TakeawaysSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useGSAP(() => {
    if (!inView) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (headerRef.current) {
      const dash = headerRef.current.querySelector(".ct-tk-dash");
      const kicker = headerRef.current.querySelector(".ct-tk-kicker");
      const heading = headerRef.current.querySelector(".ct-tk-heading");
      tl.fromTo(dash, { scaleX: 0 }, { scaleX: 1, duration: 0.5, transformOrigin: "left" }, 0)
        .fromTo(kicker, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.5 }, 0.1)
        .fromTo(heading, { opacity: 0, filter: "blur(6px)", y: 8 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.6 }, 0.15);
    }
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".ct-tk-card");
      tl.fromTo(cards, { opacity: 0, y: 28, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1, ease: "power2.out" }, 0.3);
    }
  }, [inView]);

  return (
    <section ref={ref} style={{
      background: CT_SALT, padding: "clamp(56px, 7vw, 80px) 0", position: "relative", overflow: "hidden",
    }}>
      {/* Static aurora-inspired bg — same as Overview for seamless flow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 70% 60% at 10% 20%, rgba(19,59,88,0.12) 0%, transparent 55%),
          radial-gradient(ellipse 60% 55% at 90% 70%, rgba(59,130,246,0.1) 0%, transparent 55%),
          radial-gradient(ellipse 50% 50% at 50% 90%, rgba(99,102,241,0.08) 0%, transparent 50%),
          radial-gradient(ellipse 45% 40% at 70% 15%, rgba(19,59,88,0.07) 0%, transparent 50%)
        `,
      }} />
      {/* Static repeating streaks — same as Overview */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.15,
        backgroundImage: `
          repeating-linear-gradient(100deg, transparent 0%, transparent 7%, rgba(19,59,88,0.08) 10%, transparent 12%, transparent 16%),
          repeating-linear-gradient(100deg, rgba(19,59,88,0.15) 10%, rgba(59,130,246,0.1) 15%, rgba(19,59,88,0.06) 20%, rgba(99,102,241,0.08) 25%, rgba(59,130,246,0.05) 30%)
        `,
        backgroundSize: "300% 200%",
        backgroundPosition: "30% 50%",
      }} />

      <style>{`
        .ct-tk-card { transition: transform 0.45s cubic-bezier(0.22,1,0.36,1); }
        .ct-tk-card:hover { transform: translateY(-7px) scale(1.012); }
        .ct-tk-card:hover .ct-tk-bezel {
          box-shadow:
            0 2px 0 rgba(255,255,255,0.6) inset,
            0 -2px 0 rgba(19,59,88,0.06) inset,
            0 32px 64px rgba(19,59,88,0.14),
            0 8px 20px rgba(0,0,0,0.05),
            0 0 0 1px rgba(19,59,88,0.04);
        }
        .ct-tk-card:hover .ct-tk-glass {
          background: rgba(255,255,255,0.72) !important;
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,0.7),
            inset 0 -2px 4px rgba(19,59,88,0.04),
            inset 2px 0 8px rgba(255,255,255,0.15),
            inset -2px 0 8px rgba(255,255,255,0.15) !important;
        }
        .ct-tk-card:hover .ct-tk-watermark { opacity: 0.09 !important; transform: scale(1.06) translateY(-2px); }
        .ct-tk-card:hover .ct-tk-accent { transform: scaleX(1) !important; }
        .ct-tk-card:hover .ct-tk-ring { border-color: rgba(19,59,88,0.06) !important; }
        .ct-tk-card:hover .ct-tk-orb-tr { opacity: 0.09 !important; }
        .ct-tk-card:hover .ct-tk-orb-bl { opacity: 0.06 !important; }
        .ct-tk-card:hover .ct-tk-refl { opacity: 1 !important; }
        @media (max-width: 640px) { .ct-tk-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        {/* Header — centered */}
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "clamp(32px, 4vw, 48px)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div className="ct-tk-dash" style={{ width: 28, height: 2, background: CT_BLUE, borderRadius: 1, transform: "scaleX(0)" }} />
            <span className="ct-tk-kicker" style={{ fontFamily: "var(--font-opensans)", fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: CT_BLUE, opacity: 0 }}>What You Will Learn</span>
            <div className="ct-tk-dash" style={{ width: 28, height: 2, background: CT_BLUE, borderRadius: 1, transform: "scaleX(0)" }} />
          </div>
          <h2 className="ct-tk-heading" style={{ fontFamily: "var(--font-opensans)", fontWeight: 700, fontSize: "clamp(24px, 3.4vw, 38px)", letterSpacing: "-1.2px", color: CT_BLACK, lineHeight: 1.15, margin: 0, opacity: 0 }}>60 Minutes That Could Redefine Your Retention Strategy</h2>
        </div>

        {/* 2x2 Glass card grid */}
        <div ref={gridRef} className="ct-tk-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(18px, 2.2vw, 26px)" }}>
          {TAKEAWAYS.map((item, i) => (
            <div key={i} className="ct-tk-card" style={{ opacity: 0 }}>
              {/* Outer bezel — thick skeuomorphic frame */}
              <div className="ct-tk-bezel" style={{
                borderRadius: 26, padding: 3, height: "100%",
                background: `linear-gradient(160deg, rgba(255,255,255,0.7) 0%, rgba(19,59,88,0.05) 30%, rgba(255,255,255,0.35) 60%, rgba(19,59,88,0.08) 100%)`,
                boxShadow: `
                  0 2px 0 rgba(255,255,255,0.55) inset,
                  0 -2px 0 rgba(19,59,88,0.05) inset,
                  0 16px 48px rgba(19,59,88,0.08),
                  0 4px 12px rgba(0,0,0,0.03),
                  0 0 0 0.5px rgba(19,59,88,0.06)
                `,
                transition: "box-shadow 0.45s cubic-bezier(0.22,1,0.36,1)",
              }}>
                {/* Inner recessed glass panel */}
                <div className="ct-tk-glass" style={{
                  borderRadius: 23, padding: "clamp(28px, 3.2vw, 38px)",
                  background: "rgba(255,255,255,0.62)",
                  backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: `
                    inset 0 2px 0 rgba(255,255,255,0.6),
                    inset 0 -2px 4px rgba(19,59,88,0.03),
                    inset 2px 0 8px rgba(255,255,255,0.1),
                    inset -2px 0 8px rgba(255,255,255,0.1)
                  `,
                  position: "relative", overflow: "hidden", height: "100%",
                  transition: "background 0.4s ease, box-shadow 0.4s ease",
                }}>
                  {/* ── Skeuomorphic light layers ── */}
                  {/* Top glass reflection — wide highlight band */}
                  <div className="ct-tk-refl" style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: "linear-gradient(90deg, transparent 3%, rgba(255,255,255,0.85) 15%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.85) 85%, transparent 97%)",
                    opacity: 0.8, transition: "opacity 0.4s ease",
                  }} />
                  {/* Second reflection — soft midline shine */}
                  <div style={{
                    position: "absolute", top: "38%", left: "5%", right: "5%", height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    pointerEvents: "none",
                  }} />
                  {/* Inner recessed border ring */}
                  <div className="ct-tk-ring" style={{
                    position: "absolute", inset: 5, borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.22)",
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.15)",
                    pointerEvents: "none", transition: "border-color 0.4s ease",
                  }} />
                  {/* Top-right orb — cool ambient light */}
                  <div className="ct-tk-orb-tr" style={{
                    position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%",
                    background: `radial-gradient(circle, ${CT_BLUE}, transparent 60%)`,
                    opacity: 0.05, pointerEvents: "none", transition: "opacity 0.4s ease",
                  }} />
                  {/* Bottom-left orb — warm fill */}
                  <div className="ct-tk-orb-bl" style={{
                    position: "absolute", bottom: -40, left: -40, width: 120, height: 120, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(59,130,246,0.6), transparent 60%)",
                    opacity: 0.03, pointerEvents: "none", transition: "opacity 0.4s ease",
                  }} />
                  {/* Bottom edge glow */}
                  <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${CT_BLUE}18, transparent)` }} />
                  {/* Left edge highlight */}
                  <div style={{ position: "absolute", top: "15%", bottom: "15%", left: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.4), transparent)" }} />

                  {/* ── Content ── */}
                  {/* Watermark number */}
                  <span className="ct-tk-watermark" style={{
                    position: "absolute", top: -12, right: 4,
                    fontFamily: "var(--font-opensans)", fontWeight: 800, fontSize: 120,
                    color: CT_BLUE, opacity: 0.035, lineHeight: 1, letterSpacing: "-6px",
                    pointerEvents: "none", transition: "opacity 0.45s ease, transform 0.45s ease",
                  }}>{String(i + 1).padStart(2, "0")}</span>

                  {/* Accent gradient bar */}
                  <div className="ct-tk-accent" style={{
                    width: 40, height: 3, borderRadius: 2, marginBottom: 20,
                    background: `linear-gradient(90deg, ${CT_BLUE}, rgba(59,130,246,0.5))`,
                    boxShadow: `0 0 8px ${CT_BLUE}20`,
                    transform: "scaleX(0.45)", transformOrigin: "left", transition: "transform 0.45s ease",
                  }} />

                  <h4 style={{
                    fontFamily: "var(--font-opensans)", fontWeight: 700,
                    fontSize: "clamp(17px, 1.7vw, 20px)", color: CT_BLACK,
                    margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.3,
                  }}>{item.heading}</h4>

                  <p style={{
                    fontFamily: "var(--font-opensans)", fontSize: "clamp(13px, 1.2vw, 14.5px)",
                    fontWeight: 400, color: CT_CADET, lineHeight: 1.85, margin: 0,
                  }}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AGENDA ──────────────────────────────────────────────────────────────────
function AgendaSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useGSAP(() => {
    if (!inView) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (headerRef.current) {
      const dashes = headerRef.current.querySelectorAll(".ct-ag-dash");
      const kicker = headerRef.current.querySelector(".ct-ag-kicker");
      const heading = headerRef.current.querySelector(".ct-ag-heading");
      const sub = headerRef.current.querySelector(".ct-ag-sub");
      tl.fromTo(dashes, { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.05 }, 0)
        .fromTo(kicker, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.5 }, 0.1)
        .fromTo(heading, { opacity: 0, filter: "blur(6px)", y: 8 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.65 }, 0.15);
      if (sub) tl.fromTo(sub, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 0.35);
    }
    if (listRef.current) {
      const line = listRef.current.querySelector(".ct-ag-line");
      const cards = listRef.current.querySelectorAll(".ct-ag-card");
      const dots = listRef.current.querySelectorAll(".ct-ag-dot");
      if (line) tl.fromTo(line, { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, duration: 1, ease: "power2.out" }, 0.3);
      tl.fromTo(cards, { opacity: 0, x: -20, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }, 0.4);
      tl.fromTo(dots, { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(3)" }, 0.5);
    }
  }, [inView]);

  return (
    <section ref={ref} id="agenda" style={{
      background: CT_SALT, padding: "clamp(56px, 7vw, 80px) 0", position: "relative", overflow: "hidden",
    }}>
      {/* Static aurora-inspired bg — same as Overview for seamless flow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 70% 60% at 10% 20%, rgba(19,59,88,0.12) 0%, transparent 55%),
          radial-gradient(ellipse 60% 55% at 90% 70%, rgba(59,130,246,0.1) 0%, transparent 55%),
          radial-gradient(ellipse 50% 50% at 50% 90%, rgba(99,102,241,0.08) 0%, transparent 50%),
          radial-gradient(ellipse 45% 40% at 70% 15%, rgba(19,59,88,0.07) 0%, transparent 50%)
        `,
      }} />
      {/* Static repeating streaks — same as Overview */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.15,
        backgroundImage: `
          repeating-linear-gradient(100deg, transparent 0%, transparent 7%, rgba(19,59,88,0.08) 10%, transparent 12%, transparent 16%),
          repeating-linear-gradient(100deg, rgba(19,59,88,0.15) 10%, rgba(59,130,246,0.1) 15%, rgba(19,59,88,0.06) 20%, rgba(99,102,241,0.08) 25%, rgba(59,130,246,0.05) 30%)
        `,
        backgroundSize: "300% 200%",
        backgroundPosition: "30% 50%",
      }} />
      {/* Bottom line only */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(19,59,88,0.06), transparent)" }} />

      <style>{`
        .ct-ag-card { transition: transform 0.45s cubic-bezier(0.22,1,0.36,1); }
        .ct-ag-card:hover { transform: translateX(6px); }
        .ct-ag-card:hover .ct-ag-bezel {
          box-shadow:
            0 2px 0 rgba(255,255,255,0.65) inset,
            0 -2px 0 rgba(19,59,88,0.06) inset,
            0 24px 56px rgba(19,59,88,0.12),
            0 6px 16px rgba(0,0,0,0.04),
            0 0 0 0.5px rgba(19,59,88,0.04) !important;
        }
        .ct-ag-card:hover .ct-ag-glass {
          background: rgba(255,255,255,0.75) !important;
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,0.7),
            inset 0 -2px 4px rgba(19,59,88,0.03),
            inset 2px 0 6px rgba(255,255,255,0.12),
            inset -2px 0 6px rgba(255,255,255,0.12) !important;
        }
        .ct-ag-card:hover .ct-ag-time { color: ${CT_BLUE} !important; }
        .ct-ag-card:hover .ct-ag-dot-ring { box-shadow: 0 0 0 5px ${CT_BLUE}15, 0 0 12px ${CT_BLUE}18 !important; }
        .ct-ag-card:hover .ct-ag-connector { opacity: 0.12 !important; }
        .ct-ag-card:hover .ct-ag-ring { border-color: rgba(19,59,88,0.06) !important; }
        .ct-ag-card:hover .ct-ag-orb { opacity: 0.08 !important; }
        @media (max-width: 640px) {
          .ct-ag-split { grid-template-columns: 1fr !important; }
          .ct-ag-split > div:first-child { position: relative !important; top: auto !important; }
          .ct-ag-dot-col { display: none !important; }
          .ct-ag-connector-wrap { display: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        {/* Split layout — header left, timeline right */}
        <div className="ct-ag-split" style={{ display: "grid", gridTemplateColumns: "0.38fr 1fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "start" }}>

          {/* Left — sticky header */}
          <div ref={headerRef} style={{ position: "sticky", top: 100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div className="ct-ag-dash" style={{ width: 28, height: 2, background: CT_BLUE, borderRadius: 1, transform: "scaleX(0)" }} />
              <span className="ct-ag-kicker" style={{ fontFamily: "var(--font-opensans)", fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: CT_BLUE, opacity: 0 }}>Programme</span>
            </div>
            <h2 className="ct-ag-heading" style={{
              fontFamily: "var(--font-opensans)", fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-1.5px",
              color: CT_BLACK, lineHeight: 1.15, margin: "0 0 16px", opacity: 0,
            }}>Agenda</h2>
            <p className="ct-ag-sub" style={{
              fontFamily: "var(--font-opensans)", fontSize: 14, color: CT_SLATE,
              lineHeight: 1.7, margin: "0 0 28px", opacity: 0,
            }}>60 minutes of focused discussion, peer insights, and actionable frameworks.</p>
            <div style={{ width: 40, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${CT_BLUE}, rgba(59,130,246,0.4))` }} />
          </div>

          {/* Right — timeline cards */}
          <div ref={listRef} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "clamp(10px, 1.4vw, 14px)" }}>
            {/* Timeline line — glowing */}
            <div className="ct-ag-line" style={{
              position: "absolute", left: 27, top: 20, bottom: 20, width: 3, borderRadius: 2,
              background: `linear-gradient(to bottom, ${CT_BLUE}08, ${CT_BLUE}25, ${CT_BLUE}35, ${CT_BLUE}25, ${CT_BLUE}08)`,
              boxShadow: `0 0 8px ${CT_BLUE}08`,
              transform: "scaleY(0)",
            }} />

            {AGENDA.map((item) => (
              <div key={item.title} className="ct-ag-card" style={{ opacity: 0, display: "flex", alignItems: "flex-start", gap: 0 }}>
                {/* Dot column */}
                <div className="ct-ag-dot-col" style={{ flexShrink: 0, width: 56, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, zIndex: 2 }}>
                  {/* Glass dot */}
                  <div className="ct-ag-dot-ring" style={{
                    width: item.highlight ? 16 : 11, height: item.highlight ? 16 : 11, borderRadius: "50%",
                    background: item.highlight
                      ? `radial-gradient(circle at 35% 35%, rgba(59,130,246,0.6), ${CT_BLUE})`
                      : "radial-gradient(circle at 35% 35%, #e2e5ea, #c0c4cc)",
                    boxShadow: item.highlight
                      ? `0 0 0 3px ${CT_BLUE}10, 0 2px 8px rgba(19,59,88,0.18), inset 0 1px 2px rgba(255,255,255,0.3)`
                      : "0 1px 4px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.4)",
                    transform: "scale(0)", transition: "box-shadow 0.4s ease",
                  }} />
                  {/* Connector line to card */}
                  <div className="ct-ag-connector-wrap" style={{ position: "absolute", top: 27, left: 56, width: 0, height: 1 }}>
                    <div className="ct-ag-connector" style={{
                      width: "100%", height: 1,
                      background: `linear-gradient(90deg, ${CT_BLUE}20, transparent)`,
                      opacity: 0.06, transition: "opacity 0.4s ease",
                    }} />
                  </div>
                </div>

                {/* Card */}
                <div style={{ flex: 1 }}>
                  {/* Outer bezel — thicker, richer gradient */}
                  <div className="ct-ag-bezel" style={{
                    borderRadius: 22, padding: 3,
                    background: item.highlight
                      ? `linear-gradient(160deg, rgba(255,255,255,0.7) 0%, ${CT_BLUE}0d 40%, rgba(255,255,255,0.5) 70%, ${CT_BLUE}08 100%)`
                      : "linear-gradient(160deg, rgba(255,255,255,0.65) 0%, rgba(19,59,88,0.05) 40%, rgba(255,255,255,0.45) 70%, rgba(19,59,88,0.06) 100%)",
                    boxShadow: `
                      0 2px 0 rgba(255,255,255,0.55) inset,
                      0 -2px 0 rgba(19,59,88,0.04) inset,
                      0 10px 32px rgba(19,59,88,0.06),
                      0 3px 8px rgba(0,0,0,0.02),
                      0 0 0 0.5px rgba(19,59,88,0.04)
                    `,
                    transition: "box-shadow 0.45s cubic-bezier(0.22,1,0.36,1)",
                  }}>
                    {/* Inner recessed glass panel */}
                    <div className="ct-ag-glass" style={{
                      borderRadius: 19,
                      padding: "clamp(18px, 2.2vw, 24px) clamp(20px, 2.8vw, 28px)",
                      background: item.highlight ? "rgba(255,255,255,0.68)" : "rgba(255,255,255,0.58)",
                      backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                      border: "1px solid rgba(255,255,255,0.5)",
                      boxShadow: `
                        inset 0 2px 0 rgba(255,255,255,0.6),
                        inset 0 -2px 4px rgba(19,59,88,0.025),
                        inset 2px 0 6px rgba(255,255,255,0.08),
                        inset -2px 0 6px rgba(255,255,255,0.08)
                      `,
                      position: "relative", overflow: "hidden",
                      transition: "background 0.4s ease, box-shadow 0.4s ease",
                    }}>
                      {/* Top glass reflection — 2px highlight */}
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 2,
                        background: "linear-gradient(90deg, transparent 3%, rgba(255,255,255,0.8) 15%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.8) 85%, transparent 97%)",
                      }} />
                      {/* Inner recessed ring */}
                      <div className="ct-ag-ring" style={{
                        position: "absolute", inset: 5, borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.2)",
                        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.12)",
                        pointerEvents: "none", transition: "border-color 0.4s ease",
                      }} />
                      {/* Corner orb for highlighted */}
                      {item.highlight && <div className="ct-ag-orb" style={{
                        position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%",
                        background: `radial-gradient(circle, ${CT_BLUE}, transparent 60%)`,
                        opacity: 0.04, pointerEvents: "none", transition: "opacity 0.4s ease",
                      }} />}
                      {/* Bottom edge glow */}
                      <div style={{ position: "absolute", bottom: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, ${item.highlight ? CT_BLUE : "rgba(19,59,88,0.5)"}15, transparent)` }} />
                      {/* Left edge light */}
                      <div style={{ position: "absolute", top: "20%", bottom: "20%", left: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.35), transparent)" }} />

                      {/* Content row */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(16px, 2vw, 24px)", position: "relative" }}>
                        {/* Time block */}
                        <div style={{ flexShrink: 0, minWidth: 65, paddingTop: 1 }}>
                          <span className="ct-ag-time" style={{
                            fontFamily: "var(--font-opensans)", fontSize: "clamp(14px, 1.4vw, 16px)",
                            fontWeight: 700, color: item.highlight ? CT_BLUE : CT_BLACK,
                            letterSpacing: "-0.3px", transition: "color 0.35s ease",
                          }}>{item.time}</span>
                          <span style={{
                            fontFamily: "var(--font-opensans)", fontSize: 10, fontWeight: 500,
                            color: CT_SLATE, display: "block", marginTop: 4,
                            letterSpacing: "0.8px", textTransform: "uppercase",
                          }}>{item.duration}</span>
                        </div>

                        {/* Glass vertical divider */}
                        <div style={{
                          width: 2, alignSelf: "stretch", flexShrink: 0, borderRadius: 1,
                          background: `linear-gradient(180deg, transparent, ${item.highlight ? CT_BLUE + "18" : "rgba(19,59,88,0.06)"}, transparent)`,
                          boxShadow: item.highlight ? `0 0 4px ${CT_BLUE}08` : "none",
                        }} />

                        {/* Title + presenter */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                            <h4 style={{
                              fontFamily: "var(--font-opensans)", fontWeight: 700,
                              fontSize: "clamp(14px, 1.35vw, 16.5px)", color: CT_BLACK,
                              margin: 0, lineHeight: 1.35,
                            }}>{item.title}</h4>
                            {item.highlight && (
                              <span style={{
                                fontFamily: "var(--font-opensans)", fontSize: 8.5, fontWeight: 600,
                                letterSpacing: "1.2px", textTransform: "uppercase", color: CT_BLUE,
                                background: `linear-gradient(135deg, ${CT_BLUE}06, ${CT_BLUE}10)`,
                                border: `1px solid ${CT_BLUE}18`,
                                padding: "3px 10px", borderRadius: 8,
                                backdropFilter: "blur(12px)",
                                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 4px ${CT_BLUE}08`,
                              }}>Featured</span>
                            )}
                          </div>
                          <p style={{
                            fontFamily: "var(--font-opensans)", fontSize: "clamp(12px, 1.1vw, 13.5px)",
                            fontWeight: 400, color: CT_SLATE, margin: 0, lineHeight: 1.5,
                          }}>{item.presenter}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT CLEVERTAP ─────────────────────────────────────────────────────────
function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useGSAP(() => {
    if (!inView || !sectionRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const el = sectionRef.current;

    const heading = el.querySelector(".ct-abt-heading");
    const card = el.querySelector(".ct-abt-card");
    const paras = el.querySelectorAll(".ct-abt-p");
    const links = el.querySelector(".ct-abt-links");

    if (heading) tl.fromTo(heading, { opacity: 0, y: 20, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 }, 0);
    if (card) tl.fromTo(card, { opacity: 0, y: 28, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.65 }, 0.3);
    tl.fromTo(paras, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 0.55);
    if (links) tl.fromTo(links, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.85);
  }, [inView]);

  return (
    <section ref={ref} style={{
      background: CT_BLUE, padding: "clamp(40px, 5vw, 56px) 0", position: "relative", overflow: "hidden",
    }}>
      {/* Aurora orbs — boosted for dark, same positions as light sections */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 70% 60% at 10% 20%, rgba(100,160,255,0.18) 0%, transparent 55%),
          radial-gradient(ellipse 60% 55% at 90% 70%, rgba(130,150,255,0.14) 0%, transparent 55%),
          radial-gradient(ellipse 50% 50% at 50% 90%, rgba(150,170,255,0.1) 0%, transparent 50%),
          radial-gradient(ellipse 45% 40% at 70% 15%, rgba(80,140,255,0.12) 0%, transparent 50%)
        `,
      }} />
      {/* Repeating streaks — stronger on dark */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.25,
        backgroundImage: `
          repeating-linear-gradient(100deg, transparent 0%, transparent 7%, rgba(140,180,255,0.1) 10%, transparent 12%, transparent 16%),
          repeating-linear-gradient(100deg, rgba(100,160,255,0.14) 10%, rgba(130,150,255,0.1) 15%, rgba(80,140,255,0.06) 20%, rgba(150,170,255,0.09) 25%, rgba(100,160,255,0.05) 30%)
        `,
        backgroundSize: "300% 200%",
        backgroundPosition: "30% 50%",
      }} />
      {/* Top transition line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(120,170,255,0.2), transparent)" }} />

      <style>{`
        .ct-abt-link { transition: color 0.3s ease, border-color 0.3s ease; }
        .ct-abt-link:hover { color: rgba(255,255,255,0.9) !important; border-color: rgba(255,255,255,0.2) !important; }
      `}</style>

      <div ref={sectionRef} style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>

        {/* Cinematic centered title with eyebrow */}
        <div style={{ textAlign: "center", marginBottom: "clamp(20px, 2.5vw, 28px)" }}>
          <div className="ct-abt-heading" style={{ opacity: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, transparent, ${CT_RED})`, borderRadius: 1 }} />
              <span style={{ fontFamily: "var(--font-opensans)", fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: CT_RED }}>About</span>
              <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${CT_RED}, transparent)`, borderRadius: 1 }} />
            </div>
            <h2 style={{
              fontFamily: "var(--font-opensans)", fontWeight: 700,
              fontSize: "clamp(26px, 3.5vw, 38px)", letterSpacing: "-1.5px",
              color: CT_WHITE, lineHeight: 1.1, margin: 0,
            }}>
              CleverTap
            </h2>
          </div>
        </div>

        {/* Dark liquid glass card — 4K polished */}
        <div className="ct-abt-card" style={{ opacity: 0 }}>
          {/* Outer bezel — double-ring effect */}
          <div style={{
            borderRadius: 28, padding: 3,
            background: `linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(100,160,255,0.1) 25%, rgba(255,255,255,0.06) 50%, rgba(130,150,255,0.08) 75%, rgba(255,255,255,0.12) 100%)`,
            boxShadow: `
              0 2px 0 rgba(255,255,255,0.12) inset,
              0 -2px 0 rgba(0,0,0,0.18) inset,
              0 28px 72px rgba(0,0,0,0.25),
              0 8px 20px rgba(0,0,0,0.12),
              0 0 0 0.5px rgba(255,255,255,0.1)
            `,
          }}>
            {/* Inner dark glass panel */}
            <div style={{
              borderRadius: 25, padding: "clamp(28px, 3.5vw, 40px)",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px) saturate(1.2)", WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: `
                inset 0 2px 0 rgba(255,255,255,0.1),
                inset 0 -2px 6px rgba(0,0,0,0.1),
                inset 3px 0 12px rgba(255,255,255,0.03),
                inset -3px 0 12px rgba(255,255,255,0.03)
              `,
              position: "relative", overflow: "hidden",
            }}>
              {/* ── Skeuomorphic light layers ── */}
              {/* Top glass reflection — bright 2px band */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent 3%, rgba(255,255,255,0.22) 12%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.22) 88%, transparent 97%)",
              }} />
              {/* Midline reflection */}
              <div style={{
                position: "absolute", top: "48%", left: "4%", right: "4%", height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.035), transparent)",
                pointerEvents: "none",
              }} />
              {/* Inner recessed ring */}
              <div style={{
                position: "absolute", inset: 5, borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "inset 0 1px 3px rgba(255,255,255,0.04)",
                pointerEvents: "none",
              }} />
              {/* Corner orbs */}
              <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(100,160,255,0.14), transparent 60%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -50, left: -50, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.07), transparent 60%)", pointerEvents: "none" }} />
              {/* Center ambient glow */}
              <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "40%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(100,160,255,0.04), transparent 70%)", pointerEvents: "none" }} />
              {/* Edge highlights — all 4 sides */}
              <div style={{ position: "absolute", bottom: 0, left: "6%", right: "6%", height: 1, background: "linear-gradient(90deg, transparent, rgba(100,160,255,0.18), transparent)" }} />
              <div style={{ position: "absolute", top: "10%", bottom: "10%", left: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
              <div style={{ position: "absolute", top: "15%", bottom: "15%", right: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

              {/* ── Content ── */}
              {/* Logo row with glow + accent bar inline */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 120, height: 36, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.08), transparent 70%)", pointerEvents: "none" }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={CT_LOGO} alt="CleverTap" width={140} height={32} style={{
                    height: 30, width: "auto", position: "relative",
                    filter: "brightness(0) invert(1)",
                  }} />
                </div>
                <div style={{ flex: 1, height: 2, borderRadius: 1, background: `linear-gradient(90deg, rgba(255,255,255,0.08), transparent)` }} />
              </div>

              <p className="ct-abt-p" style={{
                fontFamily: "var(--font-opensans)", fontSize: "clamp(14px, 1.3vw, 15.5px)",
                fontWeight: 400, color: "rgba(255,255,255,0.68)", lineHeight: 1.85,
                margin: "0 0 14px", opacity: 0,
              }}>
                CleverTap is the all-in-one engagement platform that helps brands unlock limitless customer lifetime value — built for personalised experiences powered by <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>real-time data</span>, <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>AI-driven insights</span>, and <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>unified customer profiles</span>.
              </p>
              <p className="ct-abt-p" style={{
                fontFamily: "var(--font-opensans)", fontSize: "clamp(14px, 1.3vw, 15.5px)",
                fontWeight: 400, color: "rgba(255,255,255,0.68)", lineHeight: 1.85,
                margin: "0 0 24px", opacity: 0,
              }}>
                Trusted by <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>2,000+ brands</span> globally, CleverTap enables marketing and growth teams to orchestrate omnichannel campaigns that drive engagement, retention, and revenue.
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function CleverTapFooter() {
  return (
    <footer style={{ background: CT_WHITE, borderTop: "1px solid rgba(0,0,0,0.06)", padding: "24px 0 20px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CT_LOGO} alt="CleverTap" width={140} height={32} style={{ height: 26, width: "auto" }} />
        </div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginBottom: 12 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontFamily: "var(--font-opensans)", fontSize: 11, color: CT_SLATE, margin: 0 }}>&copy; {new Date().getFullYear()} CleverTap. All rights reserved.</p>
          <p style={{ fontFamily: "var(--font-opensans)", fontSize: 11, color: CT_SLATE, margin: 0 }}>Produced by <a href="https://eventsfirstgroup.com" target="_blank" rel="noopener noreferrer" style={{ color: CT_RED, textDecoration: "none", fontWeight: 500 }}>Events First Group</a></p>
        </div>
      </div>
    </footer>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function CleverTapNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#overview", label: "Overview" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "10px clamp(28px, 5vw, 80px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
      boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={CT_LOGO} alt="CleverTap" width={180} height={46} style={{ height: 42, width: "auto", cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {navLinks.map(link => (
          <a key={link.href} href={link.href} style={{ fontFamily: "var(--font-opensans)", fontSize: 14, fontWeight: 400, color: scrolled ? CT_BLACK : CT_CADET, textDecoration: "none", transition: "color 0.3s" }}>{link.label}</a>
        ))}
        <a href="#register" style={{ fontFamily: "var(--font-opensans)", fontSize: 13, fontWeight: 500, color: CT_WHITE, background: CT_RED, padding: "9px 22px", borderRadius: 50, textDecoration: "none", transition: "all 0.3s" }}>Register Now</a>
      </div>
    </nav>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function CleverTapPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div style={{ background: CT_WHITE }}>
      <style jsx global>{`
        @media (max-width: 768px) {
          section { padding-top: 28px !important; padding-bottom: 28px !important; }
          footer > div:first-child { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          footer > div:last-child { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
      <CleverTapNav />
      <HeroSection />
      <OverviewSection />
      <TakeawaysSection />
      {/* <AgendaSection /> — hidden for now */}
      <AboutSection />
      <CleverTapFooter />
    </div>
  );
}
