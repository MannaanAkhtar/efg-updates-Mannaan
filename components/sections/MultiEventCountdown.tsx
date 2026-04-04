"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
// UPCOMING EVENTS DATA
// ═══════════════════════════════════════════════════════════════

interface UpcomingEvent {
  id: string;
  series: string;
  seriesColor: string;
  title: string;
  date: Date;
  location: string;
  href: string;
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: "cyber-first-kuwait",
    series: "Cyber First",
    seriesColor: "#01BBF5",
    title: "Cyber First Kuwait",
    date: new Date("2026-06-09T09:00:00"),
    location: "Kuwait City, Kuwait",
    href: "/events/cyber-first/kuwait-2026",
  },
  {
    id: "data-first-kuwait",
    series: "Digital First",
    seriesColor: "#0F735E",
    title: "Digital First Kuwait",
    date: new Date("2026-06-10T09:00:00"),
    location: "Kuwait City, Kuwait",
    href: "/events/data-ai-first/kuwait-2026",
  },
  {
    id: "ot-security-jubail",
    series: "OT Security First",
    seriesColor: "#D34B9A",
    title: "OT Security Jubail",
    date: new Date("2026-06-15T09:00:00"),
    location: "Jubail, Saudi Arabia",
    href: "/events/ot-security-first",
  },
  {
    id: "cyber-first-qatar",
    series: "Cyber First",
    seriesColor: "#01BBF5",
    title: "Cyber First Qatar",
    date: new Date("2026-09-16T09:00:00"),
    location: "Doha, Qatar",
    href: "/events/cyber-first",
  },
];

// ═══════════════════════════════════════════════════════════════
// COUNTDOWN LOGIC
// ═══════════════════════════════════════════════════════════════

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

// ═══════════════════════════════════════════════════════════════
// SINGLE EVENT COUNTDOWN CARD
// ═══════════════════════════════════════════════════════════════

function EventCountdownCard({
  event,
  index,
  isInView,
}: {
  event: UpcomingEvent;
  index: number;
  isInView: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(event.date)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(event.date));
    }, 1000);

    return () => clearInterval(timer);
  }, [event.date]);

  const formatNumber = (n: number) => n.toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={event.href} className="group block">
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 16,
            padding: "clamp(20px, 3vw, 28px)",
            transition: "all 0.4s ease",
            position: "relative",
            overflow: "hidden",
          }}
          className="hover:bg-white/[0.06] hover:border-white/[0.12]"
        >
          {/* Accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: event.seriesColor,
              opacity: 0.8,
            }}
          />

          {/* Series badge */}
          <div
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 20,
              background: `${event.seriesColor}20`,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: event.seriesColor,
              }}
            >
              {event.series}
            </span>
          </div>

          {/* Event title */}
          <h3
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 600,
              color: "white",
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {event.title}
          </h3>

          {/* Location */}
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              color: "rgba(255, 255, 255, 0.5)",
              marginBottom: 20,
            }}
          >
            {event.location}
          </p>

          {/* Countdown */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hrs" },
              { value: timeLeft.minutes, label: "Min" },
              { value: timeLeft.seconds, label: "Sec" },
            ].map((unit, i) => (
              <div
                key={unit.label}
                style={{
                  textAlign: "center",
                  padding: "10px 0",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: 8,
                }}
              >
                <motion.div
                  key={unit.value}
                  initial={{ opacity: 0.5, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  {formatNumber(unit.value)}
                </motion.div>
                <div
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.4)",
                    marginTop: 4,
                  }}
                >
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Register CTA */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 500,
                color: event.seriesColor,
                transition: "all 0.3s ease",
              }}
              className="group-hover:translate-x-1"
            >
              Register Now →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function MultiEventCountdown() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
        padding: "clamp(60px, 8vw, 100px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(232, 101, 26, 0.03) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
        }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: "center",
            marginBottom: "clamp(36px, 5vw, 56px)",
          }}
        >
          {/* Label */}
          <div
            className="flex items-center justify-center gap-3"
            style={{ marginBottom: 16 }}
          >
            <span style={{ width: 30, height: 1, background: "var(--orange)" }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--orange)",
              }}
            >
              Upcoming Events
            </span>
            <span style={{ width: 30, height: 1, background: "var(--orange)" }} />
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 600,
              color: "white",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Upcoming Summit Dates — Register Now
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 300,
              color: "rgba(255, 255, 255, 0.5)",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            The world's most influential technology summits are coming.
            Secure your seat.
          </p>
        </motion.div>

        {/* Event Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(16px, 2vw, 24px)",
          }}
        >
          {upcomingEvents.slice(0, 4).map((event, index) => (
            <EventCountdownCard
              key={event.id}
              event={event}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: "center",
            marginTop: "clamp(32px, 4vw, 48px)",
          }}
        >
          <Link
            href="/events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 50,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "transparent",
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            className="hover:border-orange-500 hover:bg-orange-500/10"
          >
            View All Events
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
