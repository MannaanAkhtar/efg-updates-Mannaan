"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const OT_CRIMSON = "#D34B9A";
const EASE = [0.16, 1, 0.3, 1] as const;

// Featured edition (completed)
const featured = {
  city: "Abu Dhabi",
  country: "UAE",
  edition: "1st Edition",
  date: "Feb 4, 2026",
  venue: "Rosewood Abu Dhabi",
  image:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
  speakers: 34,
  leaders: "150+",
  recapUrl: "https://otsecurityfirst.com/",
};

// Upcoming cities
const upcoming = [
  {
    id: 2,
    city: "Riyadh",
    country: "KSA",
    image:
      "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&q=80",
  },
  {
    id: 3,
    city: "Kuwait City",
    country: "Kuwait",
    image:
      "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=400&q=80",
  },
  {
    id: 4,
    city: "Doha",
    country: "Qatar",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&q=80",
  },
];

// Post-event reports
const reports = [
  {
    id: 1,
    title: "OT Security First Abu Dhabi 2026 — Post-Event Report",
    tag: "Abu Dhabi 2026",
    href: "#",
  },
];

export default function OTEditionsMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#111111",
        padding: "clamp(48px, 6vw, 80px) 0",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: OT_CRIMSON,
              }}
            >
              Editions
            </span>
            <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "20px 0 0",
            }}
          >
            Expanding Worldwide
          </h2>
        </motion.div>

        {/* Timeline Pipeline */}
        <TimelinePipeline isInView={isInView} />

        {/* Asymmetric Grid: Featured (left) + Upcoming stack (right) */}
        <div
          className="editions-asym-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "55% 1fr",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          {/* LEFT — Featured Abu Dhabi card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <FeaturedCard />
          </motion.div>

          {/* RIGHT — 3 stacked upcoming city cards */}
          <div className="flex flex-col gap-3">
            {upcoming.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, x: 15 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }
                }
                transition={{
                  duration: 0.5,
                  delay: 0.25 + index * 0.1,
                  ease: EASE,
                }}
                style={{ flex: 1 }}
              >
                <UpcomingCard city={city} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reports Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
          style={{ marginTop: 14 }}
        >
          <ReportsStrip />
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .editions-asym-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .ot-timeline-pipeline {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 20px !important;
            padding: 0 !important;
          }
          .ot-timeline-line {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * TimelinePipeline — Horizontal SCADA-style pipeline showing edition progression
 */
function TimelinePipeline({ isInView }: { isInView: boolean }) {
  const nodes = [
    { city: "Abu Dhabi", label: "Feb 4, 2026", status: "completed" as const },
    { city: "Riyadh", label: "TBA", status: "upcoming" as const },
    { city: "Kuwait City", label: "TBA", status: "upcoming" as const },
    { city: "Doha", label: "TBA", status: "upcoming" as const },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
      style={{ marginBottom: 40 }}
    >
      <div
        className="ot-timeline-pipeline"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* Connecting line */}
        <div
          className="ot-timeline-line"
          style={{
            position: "absolute",
            top: 15,
            left: "calc(12.5% + 12px)",
            right: "calc(12.5% + 12px)",
            height: 2,
          }}
        >
          <div
            style={{
              height: "100%",
              background: `linear-gradient(to right, ${OT_CRIMSON} 0%, ${OT_CRIMSON}40 30%, rgba(255,255,255,0.06) 100%)`,
              borderRadius: 1,
            }}
          />
        </div>

        {nodes.map((node, index) => (
          <motion.div
            key={node.city}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.15 + index * 0.1, ease: EASE }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Node circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background:
                  node.status === "completed" ? OT_CRIMSON : "#0a0a0a",
                border:
                  node.status === "completed"
                    ? `2px solid ${OT_CRIMSON}`
                    : "2px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  node.status === "completed"
                    ? `0 0 20px ${OT_CRIMSON}30`
                    : "none",
              }}
            >
              {node.status === "completed" ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                  }}
                />
              )}
            </div>

            {/* City label */}
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                fontWeight: node.status === "completed" ? 700 : 500,
                color:
                  node.status === "completed" ? "var(--white)" : "#505050",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              {node.city}
            </p>

            {/* Status */}
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 500,
                color:
                  node.status === "completed" ? OT_CRIMSON : "#505050",
                marginTop: 2,
                textAlign: "center",
                letterSpacing: "0.5px",
              }}
            >
              {node.status === "completed" ? node.label : "Announcing Soon"}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * FeaturedCard — Large Abu Dhabi completed edition card
 */
function FeaturedCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden transition-all"
      style={{
        height: "100%",
        minHeight: 420,
        borderRadius: 10,
        background: "#0a0a0a",
        border: isHovered
          ? `1px solid ${OT_CRIMSON}40`
          : "1px solid rgba(255, 255, 255, 0.05)",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={featured.image}
          alt={featured.city}
          className="w-full h-full object-cover transition-all"
          style={{
            filter: isHovered
              ? "brightness(0.3) saturate(0.6)"
              : "brightness(0.18) saturate(0.4)",
            transform: isHovered ? "scale(1.04)" : "scale(1)",
            transitionDuration: "0.7s",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 40%, transparent 70%)",
        }}
      />
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity"
          style={{
            background: `linear-gradient(to top, ${OT_CRIMSON}15 0%, transparent 40%)`,
            transitionDuration: "0.5s",
          }}
        />
      )}

      {/* Left edge bar */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 transition-all"
        style={{
          width: 3,
          background: OT_CRIMSON,
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.3s",
        }}
      />

      {/* Content */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ padding: "28px 28px 24px" }}
      >
        {/* Completed badge */}
        <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              background: `${OT_CRIMSON}20`,
              border: `1px solid ${OT_CRIMSON}40`,
              borderRadius: 4,
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: OT_CRIMSON,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={OT_CRIMSON} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Completed
          </span>
        </div>

        {/* City */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3vw, 36px)",
            fontWeight: 800,
            color: "var(--white)",
            letterSpacing: "-1px",
            margin: 0,
          }}
        >
          {featured.city}, {featured.country}
        </h3>

        {/* Details */}
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 400,
            color: "#808080",
            marginTop: 8,
          }}
        >
          {featured.edition} &middot; {featured.date} &middot; {featured.venue}
        </p>

        {/* Stats + CTA row */}
        <div
          className="flex items-center justify-between flex-wrap gap-3"
          style={{ marginTop: 16 }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 500,
              color: "#606060",
              margin: 0,
            }}
          >
            <span style={{ color: "#909090" }}>{featured.speakers}</span>{" "}
            Speakers &middot;{" "}
            <span style={{ color: "#909090" }}>{featured.leaders}</span> Leaders
          </p>

          <a
            href={featured.recapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 500,
              color: OT_CRIMSON,
            }}
          >
            View Recap
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>

      {/* Crimson bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-opacity"
        style={{
          height: 2,
          background: OT_CRIMSON,
          opacity: isHovered ? 0.8 : 0,
          transitionDuration: "0.4s",
        }}
      />
    </div>
  );
}

/**
 * UpcomingCard — Compact horizontal card for upcoming cities
 */
function UpcomingCard({ city }: { city: (typeof upcoming)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-4 transition-all"
      style={{
        height: "100%",
        background: "#0a0a0a",
        border: isHovered
          ? "1px dashed rgba(211, 75, 154, 0.25)"
          : "1px dashed rgba(255, 255, 255, 0.06)",
        borderRadius: 10,
        padding: 16,
        opacity: isHovered ? 0.85 : 0.7,
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* City thumbnail */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{
          width: 72,
          height: 72,
          borderRadius: 8,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={city.image}
          alt={city.city}
          loading="lazy"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.4) saturate(0.3)",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--white)",
            margin: 0,
            opacity: 0.7,
          }}
        >
          {city.city}, {city.country}
        </h4>
        <div className="flex items-center gap-3" style={{ marginTop: 6 }}>
          <span
            style={{
              display: "inline-block",
              padding: "3px 8px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 3,
              fontFamily: "var(--font-outfit)",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            Announcing Soon
          </span>
          <a
            href="#register"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 500,
              color: OT_CRIMSON,
              textDecoration: "none",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            Get Notified →
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * ReportsStrip — Post-event reports dropdown
 */
function ReportsStrip() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (stripRef.current && !stripRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div ref={stripRef} style={{ position: "relative" }}>
      {/* Trigger strip */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full flex items-center justify-between transition-all"
        style={{
          background: isHovered ? `${OT_CRIMSON}10` : "#161616",
          border: `1px solid ${isHovered ? `${OT_CRIMSON}30` : "rgba(255,255,255,0.06)"}`,
          borderLeft: `3px solid ${isHovered ? OT_CRIMSON : `${OT_CRIMSON}50`}`,
          borderRadius: 10,
          padding: "18px 24px",
          cursor: "pointer",
          transitionDuration: "0.3s",
        }}
      >
        <div className="flex items-center gap-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={OT_CRIMSON}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: "#909090",
            }}
          >
            Post-Event Reports
          </span>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 500,
              color: "#404040",
              background: "rgba(255,255,255,0.03)",
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            {reports.length} Available
          </span>
        </div>

        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#505050"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#0f0f0f",
            border: `1px solid ${OT_CRIMSON}20`,
            borderRadius: 10,
            padding: 6,
            zIndex: 20,
          }}
        >
          {reports.map((report) => (
            <ReportItem key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * ReportItem — Individual report download link
 */
function ReportItem({ report }: { report: (typeof reports)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={report.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between transition-all"
      style={{
        padding: "12px 16px",
        borderRadius: 8,
        background: isHovered ? `${OT_CRIMSON}08` : "transparent",
        transitionDuration: "0.2s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isHovered ? OT_CRIMSON : "#505050"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.2s" }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 400,
            color: isHovered ? "var(--white)" : "#808080",
            transition: "color 0.2s",
          }}
        >
          {report.title}
        </span>
      </div>

      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 10,
          fontWeight: 500,
          color: OT_CRIMSON,
          background: `${OT_CRIMSON}15`,
          padding: "3px 8px",
          borderRadius: 4,
          letterSpacing: "0.5px",
        }}
      >
        PDF
      </span>
    </a>
  );
}
