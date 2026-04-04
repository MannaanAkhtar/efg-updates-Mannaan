"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const AMBER = "#C9935A";
const AMBER_50 = "rgba(201, 147, 90, 0.5)";
const AMBER_30 = "rgba(201, 147, 90, 0.3)";
const AMBER_15 = "rgba(201, 147, 90, 0.15)";
const TEXT = "#ffffff";
const TEXT_50 = "rgba(255, 255, 255, 0.5)";
const TEXT_30 = "rgba(255, 255, 255, 0.3)";
const BG = "#000000";
const BG_ALT = "#050505";
const EASE = [0.22, 1, 0.36, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";

const rules = [
  {
    num: "01",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Curated Attendance",
    body: "15 to 20 hand-selected executives per session. Every seat is earned, no walk-ins, no exceptions.",
  },
  {
    num: "02",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Chatham House Rule",
    body: "No recordings. No press. The freedom to speak about real challenges with the people who actually share them.",
  },
  {
    num: "03",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Sponsor-Hosted",
    body: "One strategic partner owns the room. They shape the agenda, select the topic, and build relationships that no exhibition stand can replicate.",
  },
];

const titles = [
  "CISO", "CDO", "Chief Digital Officer", "VP Engineering",
  "Minister of Digital Economy", "Head of Cybersecurity",
  "Chief Information Officer", "Director of OT Security",
  "Chief Data Officer", "VP Technology",
];

const stats = [
  { val: "15-20", label: "Executives" },
  { val: "1", label: "Sponsor" },
  { val: "5-Star", label: "Venues" },
  { val: "100%", label: "Confidential" },
];

export default function NetworkFirst() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: BG_ALT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div className="absolute pointer-events-none" style={{ top: "15%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${AMBER_15} 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "5%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,147,90,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />

      {/* Gold border top */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${AMBER_30}, transparent)` }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(100px, 12vw, 140px) 24px", position: "relative" }}>

        {/* ── Premium Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, margin: "0 0 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ width: 24, height: 1, background: AMBER_50 }} />
            NetworkFirst Boardrooms
            <span style={{ width: 24, height: 1, background: AMBER_50 }} />
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 16px", letterSpacing: "-0.03em", color: TEXT }}>
            Invite-Only Executive Boardrooms<span style={{ color: AMBER }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: TEXT_30, margin: "0 auto", maxWidth: 560, lineHeight: 1.65 }}>
            15-seat executive roundtables. Hand-selected CISOs, CTOs, and C-suite leaders. No keynotes, no slides, no recordings. Sponsor-hosted, invite-only boardroom sessions where the conversations that actually move industries happen , across Dubai, Riyadh, Kuwait, and Doha.
          </p>
        </motion.div>

        {/* ── Cinematic Photo Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 32,
            border: `1px solid rgba(201,147,90,0.12)`,
          }}
        >
          {/* Gold top accent */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${AMBER}, ${AMBER_30}, transparent)`, zIndex: 2 }} />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy"
            src={`${S3}/networkfirst/boardrooms/boardroom-14.jpg`}
            alt="NetworkFirst boardroom"
            style={{ width: "100%", height: "clamp(260px, 32vw, 380px)", objectFit: "cover", display: "block", filter: "brightness(0.4) saturate(0.75)" }}
          />

          {/* Gold tint + vignette overlays */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${AMBER_15} 0%, transparent 40%)` }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(5,5,5,0.7) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,5,0.95) 0%, transparent 35%)" }} />

          {/* Subtle wireframe grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, rgba(201,147,90,0.03) 0px, rgba(201,147,90,0.03) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(201,147,90,0.03) 0px, rgba(201,147,90,0.03) 1px, transparent 1px, transparent 60px)`,
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)",
            }}
          />

          {/* Center content */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, paddingBottom: 40 }}>
            <div style={{
              padding: "6px 18px",
              borderRadius: 20,
              background: "rgba(201,147,90,0.1)",
              border: `1px solid ${AMBER_30}`,
              backdropFilter: "blur(12px)",
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER }}>Invitation Only</span>
            </div>
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 2.8vw, 28px)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: 480,
              letterSpacing: "-0.01em",
            }}>
              Closed-door sessions for the most senior technology leaders
            </p>
          </div>

          {/* Bottom stats strip */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(16px)",
            borderTop: `1px solid rgba(201,147,90,0.1)`,
          }}
          className="nf-photo-stats"
          >
            {stats.map((s, i) => (
              <div key={i} style={{
                textAlign: "center",
                padding: "14px clamp(16px, 3vw, 36px)",
                borderRight: i < stats.length - 1 ? `1px solid rgba(201,147,90,0.1)` : "none",
              }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2vw, 22px)", fontWeight: 700, color: AMBER, display: "block", lineHeight: 1, marginBottom: 3 }}>{s.val}</span>
                <span style={{ fontSize: 10, fontWeight: 500, color: TEXT_30, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── The Rules Label ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          style={{ marginBottom: 20 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 16, background: AMBER, borderRadius: 2 }} />
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: AMBER, margin: 0 }}>The Rules</p>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${AMBER_30}, transparent 70%)`, marginLeft: 8 }} />
          </div>
        </motion.div>

        {/* ── Rule Cards Grid ── */}
        <div className="nf-rules-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
          {rules.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.35 + i * 0.1 }}
              className="nf-rule-card"
              style={{
                position: "relative",
                padding: "36px 28px 32px",
                background: "rgba(255,255,255,0.02)",
                border: `1px solid rgba(201,147,90,0.08)`,
                borderRadius: 14,
                overflow: "hidden",
                transition: "all 0.35s ease",
              }}
            >
              {/* Gold top accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${AMBER}, ${AMBER_30}, transparent)` }} />

              {/* Gold left accent bar */}
              <div className="nf-card-left-bar" style={{
                position: "absolute",
                left: 0,
                top: "20%",
                bottom: "20%",
                width: 2,
                background: AMBER_30,
                borderRadius: 2,
                transition: "all 0.3s ease",
              }} />

              {/* Large faded background number */}
              <span className="nf-card-bg-num" style={{
                position: "absolute",
                top: 8,
                right: 14,
                fontFamily: "var(--font-display)",
                fontSize: 88,
                fontWeight: 800,
                color: "rgba(201,147,90,0.04)",
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
                transition: "color 0.3s ease",
              }}>
                {rule.num}
              </span>

              {/* Icon */}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: "rgba(201,147,90,0.07)",
                border: `1px solid rgba(201,147,90,0.15)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: AMBER,
                marginBottom: 22,
                transition: "all 0.3s ease",
              }} className="nf-rule-card-icon">
                {rule.icon}
              </div>

              {/* Rule label */}
              <p style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: AMBER_50,
                margin: "0 0 8px",
              }}>
                Rule {rule.num}
              </p>

              {/* Title */}
              <h4 style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                color: TEXT,
                margin: "0 0 14px",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
              }}>
                {rule.title}
              </h4>

              {/* Gold divider */}
              <div style={{ width: 36, height: 2, background: `linear-gradient(90deg, ${AMBER}, transparent)`, marginBottom: 14, borderRadius: 1 }} />

              {/* Body */}
              <p style={{
                fontSize: 14,
                fontWeight: 400,
                color: TEXT_50,
                lineHeight: 1.75,
                margin: 0,
              }}>
                {rule.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom Row: Participants + CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
          className="nf-bottom-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 28,
            padding: "22px 28px",
            background: "rgba(255,255,255,0.02)",
            border: `1px solid rgba(201,147,90,0.08)`,
            borderRadius: 12,
            position: "relative",
            overflow: "hidden",
            flexWrap: "wrap",
          }}
        >
          {/* Gold top accent */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${AMBER_30}, rgba(201,147,90,0.06))` }} />
          {/* Gold left accent */}
          <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 2, background: `linear-gradient(to bottom, ${AMBER}, ${AMBER_30})`, borderRadius: 2 }} />

          {/* Participants */}
          <div style={{ flex: 1, minWidth: 260, paddingLeft: 10 }}>
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: TEXT_30,
              margin: "0 0 8px",
            }}>
              Past Participants Include
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 0" }}>
              {titles.map((title, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 500, color: AMBER_50, letterSpacing: "0.03em" }}>
                  {title}{i < titles.length - 1 && <span style={{ color: "rgba(255,255,255,0.06)", margin: "0 8px" }}>·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="nf-cta-wrap" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/network-first#get-started"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 26px",
                borderRadius: 60,
                background: "transparent",
                border: `1.5px solid ${AMBER}`,
                color: AMBER,
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = AMBER;
                e.currentTarget.style.color = BG;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,147,90,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = AMBER;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Request an Invitation <span style={{ fontSize: 15 }}>→</span>
            </Link>
            <span style={{ fontSize: 11, color: TEXT_30, whiteSpace: "nowrap" }}>Limited seats</span>
          </div>
        </motion.div>
      </div>

      {/* Gold border bottom */}
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${AMBER_30}, transparent)` }} />

      {/* Styles */}
      <style jsx global>{`
        .nf-rule-card:hover {
          border-color: ${AMBER_30} !important;
          background: rgba(201,147,90,0.04) !important;
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(201,147,90,0.08);
        }
        .nf-rule-card:hover .nf-rule-card-icon {
          background: rgba(201,147,90,0.15) !important;
          border-color: ${AMBER_50} !important;
        }
        .nf-rule-card:hover .nf-card-left-bar {
          background: ${AMBER} !important;
        }
        .nf-rule-card:hover .nf-card-bg-num {
          color: rgba(201,147,90,0.07) !important;
        }
        @media (max-width: 900px) {
          .nf-rules-grid {
            grid-template-columns: 1fr !important;
          }
          .nf-bottom-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .nf-cta-wrap {
            width: 100% !important;
          }
          .nf-cta-wrap a {
            flex: 1 !important;
            text-align: center !important;
            justify-content: center !important;
          }
        }
        @media (max-width: 640px) {
          .nf-photo-stats {
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
          .nf-photo-stats > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(201,147,90,0.08) !important;
            flex: 1 1 40% !important;
          }
          .nf-photo-stats > div:last-child,
          .nf-photo-stats > div:nth-child(3) {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  );
}
