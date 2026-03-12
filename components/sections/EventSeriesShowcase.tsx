"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const CFK = `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos`;
const HOME = `${S3}/home-event-spec`;
const OT = `${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos`;

// Event series data
const OPEX = `${S3}/events/Opex%20First%20UAE`;
const GOOD = `${S3}/Good`;

const eventSeries = [
  {
    id: "cyber-first",
    title: "Cyber First",
    tagline: "Defending the Digital Frontier",
    description:
      "Where CISOs, security architects, and cyber leaders gather to shape the future of enterprise defense.",
    editions: 6,
    nations: 4,
    stats: "Kuwait · Qatar · KSA · UAE",
    color: "#01BBF5",
    image: `${GOOD}/4N8A0045.JPG`,
    href: "/events/cyber-first",
  },
  {
    id: "ot-security-first",
    title: "OT Security First",
    tagline: "Securing Critical Infrastructure",
    description:
      "Bridging IT and OT security for the industries that keep the world running — energy, manufacturing, utilities.",
    editions: 3,
    nations: 2,
    stats: "Saudi Arabia · Oman",
    color: "#D34B9A",
    image: `${OT}/4N8A0394.JPG`,
    href: "/events/ot-security-first",
  },
  {
    id: "opex-first",
    title: "Opex First",
    tagline: "Engineering Operational Excellence",
    description:
      "Process transformation, automation, and the frameworks driving efficiency at scale across the modern enterprise.",
    editions: 3,
    nations: 3,
    stats: "Dubai · Doha · Riyadh",
    color: "#7C3AED",
    image: `${GOOD}/opex-ksa-minister.jpg`,
    objectPosition: "left center",
    href: "/events/opex-first",
  },
  {
    id: "data-ai-first",
    title: "Data & AI First",
    tagline: "Intelligence at Scale",
    description:
      "Data strategy, artificial intelligence, and machine learning — for the leaders building the intelligent, autonomous enterprise.",
    editions: 2,
    nations: 2,
    stats: "Kuwait · Qatar",
    color: "#11A385",
    image: `${OPEX}/4N8A1492.JPG`,
    href: "/events/data-ai-first",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = [
  {
    hidden: { opacity: 0, y: 40, x: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  },
  {
    hidden: { opacity: 0, y: 40, x: 10, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  },
  {
    hidden: { opacity: 0, y: 40, x: -10, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  },
  {
    hidden: { opacity: 0, y: 40, x: -30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function EventSeriesShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        background: "var(--black)",
        padding: "clamp(96px, 8vw, 120px) 0 clamp(56px, 6vw, 80px)",
      }}
    >
      {/* Gradient fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 120,
          background: "linear-gradient(to bottom, transparent 0%, var(--black-light) 100%)",
        }}
      />
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            SECTION HEADER — Centered Grand Reveal
            ═══════════════════════════════════════════════════════════════ */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          {/* Label */}
          <motion.div
            custom={0}
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex items-center justify-center gap-3"
            style={{ marginBottom: 16 }}
          >
            <span
              style={{
                width: 30,
                height: 1,
                background: "var(--orange)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--orange)",
                fontFamily: "var(--font-outfit)",
              }}
            >
              Our Event Series
            </span>
            <span
              style={{
                width: 30,
                height: 1,
                background: "var(--orange)",
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            custom={1}
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 60px)",
              letterSpacing: "-2px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Four Worlds. One Stage.
          </motion.h2>

          {/* Description */}
          <motion.p
            custom={2}
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(15px, 1.4vw, 17.5px)",
              color: "#A0A0A0",
              lineHeight: 1.65,
              maxWidth: 600,
              margin: "14px auto 0",
            }}
          >
            Each series is a universe of its own — built for a specific
            community, sharpened around a specific mission, alive with the
            people who are shaping that industry's future.
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            THE FOUR PORTAL CARDS — Desktop grid
            ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="series-grid hidden sm:grid gap-6"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {eventSeries.map((series, index) => (
            <motion.div
              key={series.id}
              variants={cardVariants[index]}
              custom={index}
              style={{
                marginTop: index % 2 === 1 ? 28 : 0,
              }}
            >
              <PortalCard series={series} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginTop: 56 }}
        >
          <Link
            href="/events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 36px",
              borderRadius: 60,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.75)",
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.3s ease",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--orange)";
              e.currentTarget.style.color = "var(--orange)";
              e.currentTarget.style.background = "rgba(232,101,26,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "rgba(255,255,255,0.75)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
          >
            View All 9 Events in 2026 →
          </Link>
        </motion.div>

        {/* Mobile horizontal scroll snap */}
        <div
          className="series-mobile-slider flex sm:hidden gap-4 overflow-x-auto pb-4"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            marginLeft: "-20px",
            marginRight: "-20px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {eventSeries.map((series) => (
            <div
              key={series.id}
              style={{
                flex: "0 0 72vw",
                maxWidth: 280,
                scrollSnapAlign: "start",
              }}
            >
              <PortalCard series={series} />
            </div>
          ))}
        </div>
      </div>

      {/* Responsive grid styles */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .series-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        .series-mobile-slider::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

/**
 * PortalCard — A cinematic gateway into each event series
 */
function PortalCard({
  series,
}: {
  series: (typeof eventSeries)[0];
}) {
  const accentColor = series.color;
  const glowOpacity = 0.08;

  return (
    <Link
      href={series.href}
      className="portal-card group relative block overflow-hidden cursor-pointer transition-all duration-500"
      style={{
        borderRadius: 22,
        border: "1px solid rgba(255, 255, 255, 0.05)",
        aspectRatio: "3 / 4.5",
      }}
    >
      {/* LAYER 1 — THE PHOTOGRAPH */}
      <div
        className="absolute inset-0 transition-all duration-800"
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={series.image}
          alt=""
          className="w-full h-full object-cover transition-all duration-800 group-hover:scale-108"
          style={{
            filter: "brightness(0.38) saturate(0.9)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            objectPosition: (series as { objectPosition?: string }).objectPosition || "center",
          }}
        />
      </div>

      {/* LAYER 2 — THE COLOR WASH */}
      <div
        className="absolute inset-0 transition-all duration-800"
        style={{
          background: `linear-gradient(160deg, ${accentColor}30 0%, ${accentColor}10 40%, transparent 70%)`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* LAYER 3 — THE DARKNESS GRADIENT */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top,
            rgba(10, 10, 10, 0.97) 0%,
            rgba(10, 10, 10, 0.7) 35%,
            rgba(10, 10, 10, 0.2) 70%,
            rgba(10, 10, 10, 0.4) 100%
          )`,
        }}
      />

      {/* LAYER 4 — THE AMBIENT GLOW */}
      <div
        className="absolute pointer-events-none transition-opacity duration-800 opacity-0 group-hover:opacity-100"
        style={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: accentColor,
          filter: "blur(60px)",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0,
          ["--glow-opacity" as string]: glowOpacity,
        }}
      />

      {/* LAYER 5 — THE CONTENT */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ padding: 32 }}
      >
        {/* Series Marker Line */}
        <div
          className="transition-all duration-400 group-hover:w-10"
          style={{
            width: 24,
            height: 2,
            background: accentColor,
            marginBottom: 16,
          }}
        />

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "var(--white)",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {series.title}
        </h3>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 500,
            color: accentColor,
            letterSpacing: "0.5px",
            margin: "12px 0 8px",
          }}
        >
          {series.tagline}
        </p>

        {/* Description — Hidden by default, reveals on hover */}
        <div
          className="overflow-hidden transition-all duration-600 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100"
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13.5,
              fontWeight: 300,
              color: "rgba(255, 255, 255, 0.5)",
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {series.description}
          </p>
        </div>

        {/* Stats Line */}
        <div
          className="flex items-center gap-1.5"
          style={{ marginTop: 16 }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ opacity: 0.3, color: "white" }}
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.3)",
              letterSpacing: "0.3px",
            }}
          >
            {series.stats}
          </span>
        </div>

        {/* Explore Series — Reveals on hover */}
        <div
          className="overflow-hidden transition-all duration-600 max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100"
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            marginTop: 12,
          }}
        >
          <span
            className="inline-flex items-center gap-1"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 600,
              color: accentColor,
            }}
          >
            Explore Series <span>→</span>
          </span>
        </div>
      </div>

      {/* LAYER 6 — TOP BADGES & ARROW */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between"
        style={{ padding: "18px 20px" }}
      >
        {/* Edition & Nation badges */}
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
              borderRadius: 20,
              padding: "5px 10px",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: "var(--white)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: accentColor,
                flexShrink: 0,
              }}
            />
            {series.editions} EDITIONS
          </span>
          <span
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
              borderRadius: 20,
              padding: "5px 10px",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: accentColor,
              fontFamily: "var(--font-outfit)",
            }}
          >
            {series.nations} NATIONS
          </span>
        </div>

        {/* Arrow */}
        <div
          className="arrow-container flex items-center justify-center transition-all duration-400"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <span
            className="transition-all duration-400 group-hover:-rotate-45 group-hover:opacity-100"
            style={{
              fontSize: 12,
              color: "white",
              opacity: 0.4,
              display: "inline-block",
            }}
          >
            →
          </span>
        </div>
      </div>

      {/* Hover styles */}
      <style jsx>{`
        .portal-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: ${accentColor}33 !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px ${accentColor}15;
        }
        .portal-card:hover img {
          filter: brightness(0.70) saturate(1) !important;
          transform: scale(1.12);
        }
        .portal-card:hover > div:nth-child(2) {
          background: linear-gradient(160deg, ${accentColor}50 0%, ${accentColor}20 40%, transparent 70%) !important;
        }
        .portal-card:hover > div:nth-child(4) {
          opacity: ${glowOpacity} !important;
        }
        .portal-card:hover .arrow-container {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: ${accentColor}66 !important;
        }
        .portal-card:hover .arrow-container span {
          color: ${accentColor} !important;
        }
        @media (max-width: 640px) {
          .portal-card {
            aspect-ratio: 3 / 4.2 !important;
            min-height: unset;
          }
          .portal-card:hover {
            transform: translateY(-4px) scale(1.01);
          }
        }
      `}</style>
    </Link>
  );
}
