"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const AMBER = "#C9935A";
const EASE = [0.16, 1, 0.3, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";

const pillars = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Curated Attendance",
    body: "15 to 20 hand-selected executives per session. Every seat is earned — no walk-ins, no exceptions.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Chatham House Rule",
    body: "No recordings. No press. No slides. The freedom to speak about real challenges with the people who actually share them.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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



export default function NetworkFirst() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#07060A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient left glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AMBER}18 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      {/* Ambient right glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "10%",
          right: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AMBER}10 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "clamp(80px, 8vw, 120px) clamp(20px, 4vw, 60px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 100px)",
          alignItems: "center",
        }}
        className="nf-grid"
      >
        {/* ═══════════════════════════════════
            LEFT — THE PHOTO
            ═══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="nf-photo"
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            aspectRatio: "4 / 5",
          }}
        >
          {/* Photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-245.jpg`}
            alt="NetworkFirst boardroom attendees"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.55) saturate(0.85)",
            }}
          />

          {/* Amber color wash */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(160deg, ${AMBER}28 0%, ${AMBER}08 50%, transparent 100%)`,
            }}
          />

          {/* Bottom gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(7,6,10,0.85) 0%, transparent 50%)",
            }}
          />

          {/* Amber border */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              border: `1px solid ${AMBER}30`,
              pointerEvents: "none",
            }}
          />

          {/* Bottom label */}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 28,
              right: 28,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: AMBER,
                margin: "0 0 6px",
              }}
            >
              Invitation Only
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(16px, 1.4vw, 20px)",
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              Closed-door sessions for the GCC&apos;s most senior technology leaders
            </p>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════
            RIGHT — THE CONTENT
            ═══════════════════════════════════ */}
        <div>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}
          >
            <span style={{ width: 28, height: 1, background: AMBER }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: AMBER,
              }}
            >
              NetworkFirst Boardrooms
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 58px)",
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              color: "#fff",
              margin: "0 0 8px",
            }}
          >
            A Different
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 58px)",
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              color: AMBER,
              margin: "0 0 28px",
            }}
          >
            Kind of Room.
          </motion.h2>

          {/* Scarcity line */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(14px, 1.2vw, 16px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: 460,
              margin: "0 0 36px",
            }}
          >
            15-seat executive roundtables. Hand-selected leaders. No keynotes, no slides, no recordings.
            Just the conversations that actually move industries — held under Chatham House Rule.
          </motion.p>

          {/* Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.42 }}
            className="nf-pillars"
            style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}
          >
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: 0.45 + i * 0.08 }}
                className="nf-pillar-item"
                style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
              >
                <div
                  className="nf-pillar-icon"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${AMBER}15`,
                    border: `1px solid ${AMBER}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: AMBER,
                    marginTop: 2,
                  }}
                >
                  {p.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="nf-pillar-title"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      margin: "0 0 3px",
                    }}
                  >
                    {p.title}
                  </p>
                  <p
                    className="nf-pillar-body"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
            className="nf-cta-row"
            style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}
          >
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 60,
                background: AMBER,
                color: "#07060A",
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#DBA96A";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 12px 40px ${AMBER}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = AMBER;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Request an Invitation
              <span style={{ fontSize: 16 }}>→</span>
            </Link>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Limited seats per session
            </span>
          </motion.div>

          {/* Participant titles marquee strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                margin: "0 0 10px",
              }}
            >
              Past participants include
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 16px",
              }}
            >
              {titles.map((title, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: 500,
                    color: `${AMBER}70`,
                    letterSpacing: "0.04em",
                  }}
                >
                  {title}{i < titles.length - 1 && <span style={{ color: "rgba(255,255,255,0.1)", marginLeft: 16 }}>·</span>}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .nf-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .nf-photo {
            order: -1 !important;
            aspect-ratio: 4 / 3 !important;
            max-height: 320px !important;
          }
        }
        
        @media (max-width: 768px) {
          .nf-grid {
            gap: 40px !important;
            padding-top: 60px !important;
            padding-bottom: 60px !important;
          }
          .nf-photo {
            aspect-ratio: 16 / 10 !important;
            max-height: 280px !important;
            border-radius: 16px !important;
          }
          .nf-cta-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .nf-cta-row a {
            text-align: center !important;
            justify-content: center !important;
          }
        }
        
        @media (max-width: 480px) {
          .nf-grid {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }
          .nf-photo {
            aspect-ratio: 16 / 9 !important;
            max-height: 220px !important;
            border-radius: 12px !important;
          }
          .nf-photo > div:last-child {
            bottom: 16px !important;
            left: 16px !important;
            right: 16px !important;
          }
          .nf-photo > div:last-child p:first-child {
            font-size: 10px !important;
          }
          .nf-photo > div:last-child p:last-child {
            font-size: 14px !important;
          }
          /* Pillar cards */
          .nf-pillars {
            gap: 16px !important;
          }
          .nf-pillar-item {
            gap: 12px !important;
          }
          .nf-pillar-icon {
            width: 28px !important;
            height: 28px !important;
          }
          .nf-pillar-title {
            font-size: 13px !important;
          }
          .nf-pillar-body {
            font-size: 12px !important;
            line-height: 1.5 !important;
          }
        }
        
        /* Titles wrap better on mobile */
        @media (max-width: 640px) {
          .nf-grid h2 {
            font-size: clamp(28px, 8vw, 36px) !important;
          }
        }
      `}</style>
    </section>
  );
}
