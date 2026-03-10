"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// Event data
const upcomingEvents = [
  {
    id: "cyber-first-kuwait",
    series: "Cyber First",
    seriesColor: "#01BBF5",
    edition: "3RD EDITION",
    title: "Cyber First Kuwait",
    date: new Date("2026-04-20"),
    dateDisplay: "April 20, 2026",
    location: "Kuwait City, Kuwait",
    venue: "Venue TBA",
    image: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=900&q=80",
    href: "/events/cyber-first/kuwait-2026",
  },
  {
    id: "data-ai-kuwait",
    series: "Data & AI First",
    seriesColor: "#0F735E",
    edition: "1ST EDITION",
    title: "Data & AI First Kuwait",
    date: new Date("2026-05-18"),
    dateDisplay: "May 18, 2026",
    location: "Kuwait City, Kuwait",
    venue: "Venue TBA",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&q=80",
    href: "/events/data-ai-first/kuwait-2026",
  },
];

// Calculate days until event
function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function UpcomingEvents() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black-light)",
        padding: "clamp(80px, 10vw, 140px) 0 clamp(80px, 10vw, 120px)",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            SECTION HEADER
            ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex flex-wrap items-end justify-between gap-6"
          style={{ marginBottom: 52 }}
        >
          {/* Left side */}
          <div>
            {/* Label */}
            <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
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
                Upcoming Events
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(34px, 4.5vw, 56px)",
                letterSpacing: "-1.5px",
                color: "var(--white)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              What's Next
            </h2>
          </div>

          {/* Right side */}
          <Link
            href="/events"
            className="group flex items-center gap-2 transition-all duration-300"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: "#FF7A2E",
            }}
          >
            <span>View Full Calendar</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            FEATURED EVENT CARDS
            ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-5">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
          >
            <FeaturedEventCard event={upcomingEvents[0]} />
          </motion.div>

          {/* Back to Back Connector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center gap-2"
            style={{ margin: "12px 0" }}
          >
            <div
              style={{
                width: 1,
                height: 30,
                background: "rgba(255, 255, 255, 0.08)",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#383838",
              }}
            >
              Back to Back in Kuwait City
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
          >
            <FeaturedEventCard event={upcomingEvents[1]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * FeaturedEventCard — Large horizontal event card
 */
function FeaturedEventCard({
  event,
}: {
  event: (typeof upcomingEvents)[0];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [daysUntil, setDaysUntil] = useState(0);

  const accentColor = event.seriesColor;

  // Calculate days until event
  useEffect(() => {
    setDaysUntil(getDaysUntil(event.date));
  }, [event.date]);

  return (
    <Link
      href={event.href}
      className="featured-card group block relative overflow-hidden transition-all duration-500"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: 280,
        background: "var(--black-card)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: 22,
        cursor: "pointer",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 20px 60px rgba(0, 0, 0, 0.3)" : "none",
        borderColor: isHovered
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(255, 255, 255, 0.06)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LEFT HALF — THE IMAGE SIDE */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 transition-all duration-800"
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image}
            alt=""
            className="w-full h-full object-cover transition-all duration-800"
            style={{
              filter: isHovered
                ? "brightness(0.35) saturate(0.9)"
                : "brightness(0.25) saturate(0.7)",
              transform: isHovered ? "scale(1.06)" : "scale(1)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </div>

        {/* Gradient fade to content side */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent 0%, #141414 100%)",
          }}
        />

        {/* Edition Badge */}
        <div
          className="absolute"
          style={{
            top: 24,
            left: 24,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 50,
            padding: "7px 16px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "white",
            }}
          >
            {event.edition}
          </span>
        </div>
      </div>

      {/* RIGHT HALF — THE CONTENT SIDE */}
      <div
        className="flex flex-col justify-center relative"
        style={{ padding: "36px 40px 36px 20px" }}
      >
        {/* Top-right accent gradient */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: 200,
            height: 200,
            background: `radial-gradient(circle at top right, ${accentColor}0F, transparent 70%)`,
          }}
        />

        {/* Urgency Indicator */}
        <div className="flex items-center gap-2">
          <PulsingDot color={accentColor} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            IN {daysUntil} DAYS
          </span>
        </div>

        {/* Series Badge */}
        <div
          className="inline-flex items-center gap-2 self-start"
          style={{
            marginTop: 14,
            background: `${accentColor}14`,
            border: `1px solid ${accentColor}26`,
            borderRadius: 50,
            padding: "4px 13px",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: accentColor,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            {event.series}
          </span>
        </div>

        {/* Event Title */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 2.5vw, 32px)",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "var(--white)",
            lineHeight: 1.15,
            margin: "14px 0 0",
          }}
        >
          {event.title}
        </h3>

        {/* Event Details */}
        <div
          className="flex flex-col gap-2"
          style={{ marginTop: 12 }}
        >
          <DetailRow
            icon={<CalendarIcon />}
            text={event.dateDisplay}
          />
          <DetailRow
            icon={<MapPinIcon />}
            text={event.location}
          />
          <DetailRow
            icon={<BuildingIcon />}
            text={event.venue}
          />
        </div>

        {/* Register Button */}
        <div
          className="inline-flex items-center gap-2 self-start transition-all duration-400"
          style={{
            marginTop: 24,
            padding: "13px 32px",
            background: isHovered ? accentColor : "transparent",
            border: `1px solid ${isHovered ? accentColor : "rgba(255, 255, 255, 0.12)"}`,
            borderRadius: 50,
            color: isHovered ? "#0A0A0A" : "white",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Register Now
          </span>
          <span>→</span>
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .featured-card {
            grid-template-columns: 1fr !important;
          }
          .featured-card > div:first-child {
            min-height: 200px;
          }
        }
      `}</style>
    </Link>
  );
}

/**
 * PulsingDot — Animated urgency indicator
 */
function PulsingDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
        style={{ background: color, animationDuration: "2s" }}
      />
      <span
        className="relative inline-flex rounded-full h-1.5 w-1.5"
        style={{ background: color }}
      />
    </span>
  );
}

/**
 * DetailRow — Event detail with icon
 */
function DetailRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ opacity: 0.3 }}>{icon}</span>
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          fontWeight: 300,
          color: "#808080",
        }}
      >
        {text}
      </span>
    </div>
  );
}

// Icons
function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "white" }}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "white" }}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "white" }}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="2" />
      <line x1="15" y1="22" x2="15" y2="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}
