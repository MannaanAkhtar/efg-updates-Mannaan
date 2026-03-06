"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const EASE = [0.16, 1, 0.3, 1] as const;

const editions = [
  {
    id: 1,
    number: "01",
    edition: "1st Edition",
    name: "Opex First KSA",
    city: "Riyadh",
    country: "KSA",
    date: "Sep 9, 2025",
    venue: "Marriott Hotel",
    stat: "300+ Leaders",
    status: "completed" as const,
    image:
      "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&q=80",
  },
  {
    id: 2,
    number: "02",
    edition: "2nd Edition",
    name: "Opex First UAE",
    city: "Abu Dhabi",
    country: "UAE",
    date: "Feb 10, 2026",
    venue: "St. Regis Hotel",
    stat: null,
    status: "completed" as const,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
  },
  {
    id: 3,
    number: "03",
    edition: "3rd Edition",
    name: "Opex First Kuwait",
    city: "Kuwait City",
    country: "Kuwait",
    date: "2027",
    venue: null,
    stat: null,
    status: "planned" as const,
  },
  {
    id: 4,
    number: "04",
    edition: "4th Edition",
    name: "Opex First Qatar",
    city: "Doha",
    country: "Qatar",
    date: "2027",
    venue: null,
    stat: null,
    status: "planned" as const,
  },
];

const journeyStats = [
  { value: "4+", label: "Nations" },
  { value: "2", label: "Editions Complete" },
  { value: "300+", label: "Leaders Engaged" },
  { value: "2025–2027", label: "Series Horizon" },
];

export default function OpexSeriesJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="editions"
      style={{
        background: "var(--black)",
        padding: "clamp(36px, 4vw, 56px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient Background Orbs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(124,58,237,0.035) 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(124,58,237,0.025) 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: VIOLET }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: VIOLET,
                fontFamily: "var(--font-outfit)",
              }}
            >
              Series Journey
            </span>
            <span style={{ width: 30, height: 1, background: VIOLET }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 52px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            From Riyadh to the Region
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(14px, 1.1vw, 16px)",
              color: "#555",
              marginTop: 12,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            Building a premier operational excellence community,
            one city at a time.
          </p>
        </motion.div>

        {/* Timeline Connector + Numbered Markers (Desktop) */}
        <div
          className="opex-journey-connector"
          style={{
            position: "relative",
            height: 64,
            marginBottom: 0,
          }}
        >
          {/* Background track */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "12.5%",
              right: "12.5%",
              height: 1,
              background: "rgba(255,255,255,0.04)",
              transform: "translateY(-50%)",
            }}
          />

          {/* Animated filled track */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
            style={{
              position: "absolute",
              top: "50%",
              left: "12.5%",
              width: "25%",
              height: 1,
              background: `linear-gradient(90deg, ${VIOLET}, ${VIOLET_BRIGHT})`,
              transformOrigin: "left",
              transform: "translateY(-50%)",
            }}
          />

          {/* Dashed track for planned editions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "37.5%",
              right: "12.5%",
              height: 0,
              borderTop: "1px dashed rgba(124,58,237,0.15)",
              transform: "translateY(-50%)",
            }}
          />

          {/* Marker nodes */}
          {editions.map((edition, index) => (
            <motion.div
              key={edition.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isInView
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0, opacity: 0 }
              }
              transition={{
                duration: 0.5,
                delay: 0.5 + index * 0.15,
                ease: EASE,
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: `${12.5 + index * 25}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              <MarkerNode edition={edition} />
            </motion.div>
          ))}
        </div>

        {/* Edition Cards Grid */}
        <div
          className="opex-journey-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {editions.map((edition, index) => (
            <motion.div
              key={edition.id}
              initial={{ opacity: 0, y: 24 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
              }
              transition={{
                duration: 0.6,
                delay: 0.7 + index * 0.12,
                ease: EASE,
              }}
            >
              <EditionCard edition={edition} />
            </motion.div>
          ))}
        </div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 1.3, ease: EASE }}
          className="opex-journey-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            marginTop: 32,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.04)",
            overflow: "hidden",
          }}
        >
          {journeyStats.map((stat, index) => (
            <StatCell key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .opex-journey-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .opex-journey-connector {
            display: none !important;
          }
          .opex-journey-stats {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .opex-journey-grid {
            grid-template-columns: 1fr !important;
            max-width: 420px;
            margin-left: auto;
            margin-right: auto;
          }
          .opex-journey-stats {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Marker Node ─────────────────────────────────────────── */

function MarkerNode({ edition }: { edition: (typeof editions)[0] }) {
  const isCompleted = edition.status === "completed";

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Outer glow ring for completed */}
      <div
        style={{
          width: isCompleted ? 40 : 36,
          height: isCompleted ? 40 : 36,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isCompleted
            ? `radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)`
            : "transparent",
          transition: "all 0.4s",
        }}
      >
        {/* Inner dot */}
        <div
          style={{
            width: isCompleted ? 14 : 10,
            height: isCompleted ? 14 : 10,
            borderRadius: "50%",
            background: isCompleted ? VIOLET : "transparent",
            border: isCompleted
              ? `2px solid ${VIOLET_BRIGHT}`
              : "1.5px dashed rgba(124,58,237,0.25)",
            boxShadow: isCompleted
              ? `0 0 16px rgba(124,58,237,0.4), 0 0 4px rgba(124,58,237,0.6)`
              : "none",
            transition: "all 0.4s",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Edition Card ────────────────────────────────────────── */

function EditionCard({ edition }: { edition: (typeof editions)[0] }) {
  const [hovered, setHovered] = useState(false);
  const isCompleted = edition.status === "completed";
  const isPlanned = edition.status === "planned";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        border: isPlanned
          ? "1px dashed rgba(124,58,237,0.12)"
          : hovered
            ? "1px solid rgba(124,58,237,0.2)"
            : "1px solid rgba(255,255,255,0.06)",
        background: "#111111",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.05)"
          : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
        opacity: isPlanned ? 0.7 : 1,
      }}
    >
      {/* Image area for completed editions */}
      {isCompleted && edition.image && (
        <div
          style={{
            position: "relative",
            height: 160,
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={edition.image}
            alt={edition.city}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: hovered
                ? "brightness(0.35) saturate(0.7)"
                : "brightness(0.2) saturate(0.4)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #111111 0%, rgba(17,17,17,0.6) 40%, transparent 100%)",
            }}
          />

          {/* Top-left edition number */}
          <span
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 800,
              color: "rgba(124,58,237,0.15)",
              lineHeight: 1,
              letterSpacing: "-1px",
            }}
          >
            {edition.number}
          </span>

          {/* Top-right violet accent glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              right: 0,
              width: 120,
              height: 120,
              background: `radial-gradient(circle at top right, rgba(124,58,237,${hovered ? 0.12 : 0.05}), transparent 70%)`,
              transition: "all 0.5s",
            }}
          />
        </div>
      )}

      {/* Ghost placeholder for planned editions */}
      {isPlanned && (
        <div
          style={{
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Large ghost number */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 56,
              fontWeight: 800,
              color: "rgba(255,255,255,0.03)",
              lineHeight: 1,
              letterSpacing: "-2px",
            }}
          >
            {edition.number}
          </span>

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(124,58,237,0.04) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      )}

      {/* Content area */}
      <div style={{ padding: "16px 20px 20px" }}>
        {/* Status badge */}
        <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
          {isCompleted && (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke={VIOLET}
                strokeWidth="1.5"
              />
              <path
                d="M5.5 8L7 9.5L10.5 6"
                stroke={VIOLET}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: isCompleted ? VIOLET : "#353535",
            }}
          >
            {isCompleted ? "Completed" : "Announcing Soon"}
          </span>
        </div>

        {/* City + Country */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(18px, 1.5vw, 22px)",
            color: "var(--white)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {edition.city}
          <span
            style={{
              fontWeight: 400,
              fontSize: "0.6em",
              color: "#505050",
              marginLeft: 8,
            }}
          >
            {edition.country}
          </span>
        </h3>

        {/* Edition + Date + Venue */}
        <div
          className="flex flex-wrap items-center gap-1.5"
          style={{ marginTop: 6 }}
        >
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              color: "#505050",
            }}
          >
            {edition.edition}
          </span>
          <span style={{ color: "#303030", fontSize: 10 }}>&middot;</span>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              color: "#505050",
            }}
          >
            {edition.date}
          </span>
          {edition.venue && (
            <>
              <span style={{ color: "#303030", fontSize: 10 }}>&middot;</span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  color: "#454545",
                }}
              >
                {edition.venue}
              </span>
            </>
          )}
        </div>

        {/* Stat badge for completed editions */}
        {edition.stat && (
          <div
            style={{
              marginTop: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 50,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.12)",
            }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: VIOLET,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 500,
                color: VIOLET_BRIGHT,
              }}
            >
              {edition.stat}
            </span>
          </div>
        )}

        {/* Planned editions - subtle message */}
        {isPlanned && (
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              color: "#303030",
              marginTop: 10,
              fontStyle: "italic",
            }}
          >
            Details coming soon
          </p>
        )}
      </div>

      {/* Bottom accent line on hover (completed editions) */}
      {isCompleted && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${VIOLET}, ${VIOLET_BRIGHT})`,
            opacity: hovered ? 0.8 : 0,
            transition: "opacity 0.4s",
          }}
        />
      )}
    </div>
  );
}

/* ─── Stat Cell ───────────────────────────────────────────── */

function StatCell({
  stat,
  index,
}: {
  stat: (typeof journeyStats)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "20px 16px",
        textAlign: "center",
        background: hovered
          ? "rgba(124,58,237,0.04)"
          : index % 2 === 0
            ? "rgba(255,255,255,0.01)"
            : "transparent",
        transition: "background 0.3s",
        cursor: "default",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(20px, 2vw, 28px)",
          color: hovered ? VIOLET_BRIGHT : VIOLET,
          letterSpacing: "-0.5px",
          transition: "color 0.3s",
          lineHeight: 1,
        }}
      >
        {stat.value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          color: "#505050",
          marginTop: 6,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}
