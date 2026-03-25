"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { NetworkFirst, Footer, InquiryForm } from "@/components/sections";
import SectionTransition from "@/components/effects/SectionTransition";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const PAD = "0 clamp(20px, 4vw, 60px)";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const impactStats = [
  { value: 14, suffix: "", label: "Events in 2026", comma: false },
  { value: 7, suffix: "", label: "Cities", comma: false },
  { value: 5000, suffix: "+", label: "Leaders Reached", comma: true },
  { value: 4, suffix: "", label: "Distinct Series", comma: false },
];

const cities = [
  "Kuwait City",
  "New Delhi",
  "Nairobi",
  "Jubail",
  "Doha",
  "Riyadh",
  "Muscat",
];

type SeriesStatus = "open" | "soon";

const allEvents = [
  {
    id: "braze-roundtable-1",
    category: "networkfirst",
    title: "Braze Virtual Roundtable",
    tagline: "Marketing Through Uncertainty",
    description:
      "A private virtual roundtable for senior martech leaders in MENAT — customer engagement strategies during uncertain times.",
    color: "#C9935A",
    image: "/braze/sg-heat1-5.png",
    href: "https://braze-webinar.eventsfirstgroup.com",
    date: "2026-04-08",
    nextDate: "8 Apr 2026",
    nextCity: "Virtual",
    editions: "",
    regions: "MENAT",
    attendees: "15-20",
    status: "open" as SeriesStatus,
  },
  {
    id: "braze-roundtable-2",
    category: "networkfirst",
    title: "Braze Virtual Roundtable 2",
    tagline: "Marketing Through Uncertainty",
    description:
      "A private virtual roundtable for senior martech leaders in MENAT — customer engagement strategies during uncertain times.",
    color: "#C9935A",
    image: "/braze2/hero-bg.jpg",
    href: "https://braze-webinar-2.eventsfirstgroup.com",
    date: "2026-04-15",
    nextDate: "15 Apr 2026",
    nextCity: "Virtual",
    editions: "",
    regions: "MENAT",
    attendees: "15-20",
    status: "open" as SeriesStatus,
  },
  {
    id: "networkfirst-outsystems-ksa",
    category: "networkfirst",
    title: "ONE Executive Day KSA",
    tagline: "Agentic Enterprise & Low-Code",
    description:
      "An intimate executive boardroom exploring the power of agentic enterprise and low-code platforms.",
    color: "#C9935A",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/networkfirst/events/2026/02/outsystems-one.jpg",
    href: "/network-first",
    date: "2026-04-29",
    nextDate: "29 Apr 2026",
    nextCity: "Riyadh, KSA",
    editions: "",
    regions: "Saudi Arabia",
    attendees: "15-20",
    status: "open" as SeriesStatus,
  },
  {
    id: "cyber-first-kuwait",
    category: "cyber-first",
    title: "Cyber First Kuwait",
    tagline: "Defending the Digital Frontier",
    description:
      "The premier cybersecurity leadership summit — bringing together CISOs, government cyber leaders, and security innovators.",
    color: "#01BBF5",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    href: "/events/cyber-first/kuwait-2026",
    date: "2026-06-09",
    nextDate: "9 Jun 2026",
    nextCity: "Kuwait City",
    editions: "3rd Edition",
    regions: "Kuwait",
    attendees: "500+",
    status: "open" as SeriesStatus,
  },
  {
    id: "data-first-kuwait",
    category: "data-ai-first",
    title: "Data & AI First Kuwait",
    tagline: "Intelligence at Scale",
    description:
      "Data strategy, AI, and machine learning — for the leaders building the intelligent enterprise in Kuwait.",
    color: "#0F735E",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    href: "/events/data-ai-first/kuwait-2026",
    date: "2026-06-10",
    nextDate: "10 Jun 2026",
    nextCity: "Kuwait City",
    editions: "1st Edition",
    regions: "Kuwait",
    attendees: "500+",
    status: "soon" as SeriesStatus,
  },
  {
    id: "cyber-first-new-delhi",
    category: "cyber-first",
    title: "Cyber First New Delhi",
    tagline: "Cyber Resilience for India's Digital Future",
    description:
      "India's premier cybersecurity summit bringing together CISOs, government leaders, and enterprise security executives.",
    color: "#09B7AA",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/delhi2-bg.png",
    href: "/events/cyber-first/india-2026",
    date: "2026-06-16",
    nextDate: "16 Jun 2026",
    nextCity: "New Delhi, India",
    editions: "1st Edition",
    regions: "India",
    attendees: "400+",
    status: "open" as SeriesStatus,
  },
  {
    id: "cyber-first-nairobi",
    category: "cyber-first",
    title: "Cyber First East Africa",
    tagline: "Beyond Firewalls",
    description:
      "East Africa's premier cybersecurity summit — where C-level executives and policymakers synchronize efforts against digital warfare.",
    color: "#8B1A22",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/cyber-first-kenya/kenya-cyber.png",
    href: "/events/cyber-first/kenya-2026",
    date: "2026-07-08",
    nextDate: "8 Jul 2026",
    nextCity: "Nairobi, Kenya",
    editions: "1st Edition",
    regions: "Kenya",
    attendees: "400+",
    status: "open" as SeriesStatus,
  },
  {
    id: "ot-security-jubail",
    category: "ot-security-first",
    title: "OT Security Jubail",
    tagline: "Securing Critical Infrastructure",
    description:
      "Bridging IT and OT security for the industries that keep the world running — focused on Jubail's industrial heartland.",
    color: "#D34B9A",
    image:
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80",
    href: "/events/ot-security-first",
    date: "2026-10-07",
    nextDate: "7 Oct 2026",
    nextCity: "Jubail, KSA",
    editions: "2nd Edition",
    regions: "Saudi Arabia",
    attendees: "300+",
    status: "soon" as SeriesStatus,
  },
  {
    id: "digital-first-qatar",
    category: "data-ai-first",
    title: "Digital First Qatar",
    tagline: "Intelligence at Scale",
    description:
      "AI governance, data platforms, and enterprise intelligence — built for Qatar's digital vision.",
    color: "#0F735E",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    href: "/events/data-ai-first",
    date: "2026-09-23",
    nextDate: "23 Sep 2026",
    nextCity: "Doha, Qatar",
    editions: "2nd Edition",
    regions: "Qatar",
    attendees: "500+",
    status: "soon" as SeriesStatus,
  },
  {
    id: "cyber-first-qatar",
    category: "cyber-first",
    title: "Cyber First Qatar",
    tagline: "Defending the Digital Frontier",
    description:
      "Qatar's leading cybersecurity platform for CISOs, government security leaders, and enterprise defenders.",
    color: "#01BBF5",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    href: "/events/cyber-first",
    date: "2026-09-22",
    nextDate: "22 Sep 2026",
    nextCity: "Doha, Qatar",
    editions: "4th Edition",
    regions: "Qatar",
    attendees: "500+",
    status: "soon" as SeriesStatus,
  },
  {
    id: "opex-first-saudi",
    category: "opex-first",
    title: "OPEX First Saudi",
    tagline: "Engineering Operational Excellence",
    description:
      "Process transformation, automation, and the frameworks driving efficiency at scale across Saudi Arabia.",
    color: "#7C3AED",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    href: "/events/opex-first",
    date: "2026-09-15",
    nextDate: "15 Sep 2026",
    nextCity: "Riyadh, KSA",
    editions: "3rd Edition",
    regions: "Saudi Arabia",
    attendees: "400+",
    status: "soon" as SeriesStatus,
  },
  {
    id: "digital-resilience-ksa",
    category: "cyber-first",
    title: "Digital Resilience KSA",
    tagline: "Resilience Beyond Defence",
    description:
      "Saudi Arabia's premier digital resilience summit — national strategy, threat intelligence, and enterprise continuity.",
    color: "#01BBF5",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    href: "/events/cyber-first",
    date: "2026-10-10",
    nextDate: "10 Oct 2026",
    nextCity: "Riyadh, KSA",
    editions: "1st Edition",
    regions: "Saudi Arabia",
    attendees: "400+",
    status: "soon" as SeriesStatus,
  },
  {
    id: "cyber-first-oman",
    category: "cyber-first",
    title: "Cyber First Oman",
    tagline: "Defending the Digital Frontier",
    description:
      "Oman's premier cybersecurity summit bringing together CISOs, regulators, and security leaders.",
    color: "#01BBF5",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    href: "/events/cyber-first",
    date: "2026-10-13",
    nextDate: "13 Oct 2026",
    nextCity: "Muscat, Oman",
    editions: "5th Edition",
    regions: "Oman",
    attendees: "400+",
    status: "soon" as SeriesStatus,
  },
  {
    id: "ot-security-oman",
    category: "ot-security-first",
    title: "OT Security Oman",
    tagline: "Securing Critical Infrastructure",
    description:
      "Protecting Oman's energy, utilities, and industrial sectors through IT/OT convergence.",
    color: "#D34B9A",
    image:
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80",
    href: "/events/ot-security-first",
    date: "2026-10-14",
    nextDate: "14 Oct 2026",
    nextCity: "Muscat, Oman",
    editions: "3rd Edition",
    regions: "Oman",
    attendees: "300+",
    status: "soon" as SeriesStatus,
  },
];

// Backward-compat alias for components that reference seriesData (e.g. EventsCTA dots)
const seriesData = allEvents;

const NEXT_EVENT = {
  series: "Cyber First",
  seriesColor: "#01BBF5",
  edition: "3RD EDITION",
  title: "Cyber First Kuwait",
  date: new Date("2026-06-09"),
  location: "Kuwait City, Kuwait",
  venue: "Venue TBA",
  attendees: "500+ Attendees",
  href: "/events/cyber-first",
  image:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  description:
    "The premier cybersecurity leadership summit returns to Kuwait — bringing together CISOs, government cyber leaders, and security innovators for a day of practitioner-led insight.",
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

function SectionLabel({
  text,
  centered,
}: {
  text: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
      style={{ marginBottom: 16 }}
    >
      <span
        style={{
          width: 30,
          height: 1,
          background: "var(--orange)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "var(--orange)",
          fontFamily: "var(--font-outfit)",
        }}
      >
        {text}
      </span>
      {centered && (
        <span
          style={{
            width: 30,
            height: 1,
            background: "var(--orange)",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}

function CountStat({
  value,
  suffix,
  label,
  comma,
  delay,
  isInView,
}: {
  value: number;
  suffix: string;
  label: string;
  comma: boolean;
  delay: number;
  isInView: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const [showSuffix, setShowSuffix] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now() + delay;
    const duration = 1800;
    const frame = () => {
      const elapsed = Date.now() - start;
      if (elapsed < 0) {
        requestAnimationFrame(frame);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.floor(easeOutExpo(progress) * value));
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setDisplay(value);
        if (suffix) setTimeout(() => setShowSuffix(true), 50);
      }
    };
    requestAnimationFrame(frame);
  }, [isInView, value, delay, suffix]);

  return (
    <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(36px, 4vw, 52px)",
          letterSpacing: "-1.5px",
          color: "var(--white)",
          lineHeight: 1,
        }}
      >
        {comma ? display.toLocaleString() : display}
        {suffix && (
          <span
            style={{
              color: "var(--orange)",
              opacity: showSuffix ? 1 : 0,
              transform: showSuffix ? "scale(1)" : "scale(1.4)",
              display: "inline-block",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "var(--white-muted)",
          margin: "7px 0 0",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function CountdownDisplay({
  date,
  accentColor,
}: {
  date: Date;
  accentColor: string;
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = date.getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [date]);

  const units = [
    { value: timeLeft.days, label: "D" },
    { value: timeLeft.hours, label: "H" },
    { value: timeLeft.minutes, label: "M" },
    { value: timeLeft.seconds, label: "S" },
  ];

  return (
    <div className="flex items-center gap-1">
      {units.map((unit, i) => (
        <span key={unit.label} className="flex items-center gap-1">
          {i > 0 && (
            <span
              style={{
                color: `${accentColor}66`,
                fontSize: 18,
                marginRight: 2,
              }}
            >
              :
            </span>
          )}
          <span className="flex items-baseline gap-0.5">
            <span
              className="tabular-nums"
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--white)",
                fontFamily: "var(--font-display)",
                minWidth: 32,
                textAlign: "center",
              }}
            >
              {unit.value.toString().padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                color: "var(--white-muted)",
                fontFamily: "var(--font-outfit)",
              }}
            >
              {unit.label}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — HERO
// ─────────────────────────────────────────────────────────────────────────────

function EventsHero() {
  const handleScrollToCalendar = () => {
    const el = document.getElementById("upcoming-events");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToForm = () => {
    const el = document.getElementById("get-involved");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "var(--black)", minHeight: "100vh" }}
    >
      {/* Multi-color ambient atmosphere — four series colors + orange */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 45% at 50% -5%, rgba(232,101,26,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 35% 25% at 90% 10%, rgba(1,187,245,0.04) 0%, transparent 50%),
            radial-gradient(ellipse 25% 20% at 10% 85%, rgba(124,58,237,0.035) 0%, transparent 50%),
            radial-gradient(ellipse 30% 20% at 80% 90%, rgba(17,163,133,0.03) 0%, transparent 50%),
            radial-gradient(ellipse 20% 15% at 5% 30%, rgba(211,75,154,0.025) 0%, transparent 50%)
          `,
        }}
      />

      {/* Ghost watermark */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -52%)",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(120px, 22vw, 300px)",
          letterSpacing: "-10px",
          color: "rgba(255,255,255,0.02)",
          whiteSpace: "nowrap",
          zIndex: 0,
          userSelect: "none",
        }}
      >
        EVENTS
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          paddingTop: "clamp(90px, 10vw, 130px)",
          paddingBottom: "clamp(32px, 4vw, 48px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <SectionLabel text="The 2026 Calendar" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(52px, 8vw, 110px)",
            letterSpacing: "-3px",
            color: "var(--white)",
            lineHeight: 1.0,
            margin: "16px 0 0",
            maxWidth: 900,
          }}
        >
          Find Your Next
          <br />
          <span
            style={{
              background:
                "linear-gradient(90deg, #FFFFFF 0%, #E8651A 35%, #FF7A2E 65%, #FFFFFF 100%)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "eventsHeroShimmer 6s ease-in-out infinite alternate",
            }}
          >
            Summit.
          </span>
        </motion.h1>

        {/* Defining line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 400,
            fontSize: "clamp(15px, 1.4vw, 17.5px)",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.55)",
            maxWidth: 560,
            margin: "clamp(24px, 3vw, 36px) 0 0",
          }}
        >
          We design executive-grade tech events worldwide — curated rooms,
          serious conversations, real outcomes.
        </motion.p>

        {/* Micro bullets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
          className="flex flex-wrap gap-x-6 gap-y-2"
          style={{ margin: "20px 0 0" }}
        >
          {[
            "Invite-only rooms with 15–20 leaders",
            "Speaker lineups drop first to subscribers",
            "Multiple cities worldwide",
          ].map((bullet) => (
            <div
              key={bullet}
              className="flex items-center gap-2"
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--orange)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.2px",
                }}
              >
                {bullet}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Next Event Chip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
          style={{ margin: "32px 0 0" }}
        >
          <Link
            href={NEXT_EVENT.href}
            className="events-next-chip"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 22px 12px 16px",
              borderRadius: 60,
              border: `1px solid ${NEXT_EVENT.seriesColor}25`,
              background: `${NEXT_EVENT.seriesColor}08`,
              textDecoration: "none",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Pulsing dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: NEXT_EVENT.seriesColor }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ background: NEXT_EVENT.seriesColor }}
              />
            </span>

            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--white-dim)",
              }}
            >
              <span style={{ color: NEXT_EVENT.seriesColor, fontWeight: 600 }}>
                Next Event
              </span>
              {"  "}·{"  "}
              {NEXT_EVENT.title}
              {"  "}·{"  "}
              9 Jun 2026
            </span>

            <span
              style={{
                fontSize: 12,
                color: NEXT_EVENT.seriesColor,
                transition: "transform 0.3s ease",
              }}
            >
              →
            </span>
          </Link>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05, ease: EASE }}
          className="flex items-center flex-wrap gap-4"
          style={{ margin: "clamp(32px, 4vw, 44px) 0 0" }}
        >
          <button
            onClick={handleScrollToForm}
            style={{
              padding: "15px 36px",
              borderRadius: 60,
              background: "var(--orange)",
              color: "white",
              fontFamily: "var(--font-outfit)",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--orange-bright)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px var(--orange-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--orange)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Get Involved <span>↓</span>
          </button>
          <button
            onClick={handleScrollToCalendar}
            style={{
              padding: "15px 36px",
              borderRadius: 60,
              background: "transparent",
              color: "var(--white)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "var(--font-outfit)",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            Browse Events
          </button>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
          className="flex flex-wrap items-center gap-3 sm:gap-0"
          style={{ margin: "28px 0 0" }}
        >
          {[
            "Trusted by 60+ partners",
            "5,000+ leaders reached",
          ].map((stat, i) => (
            <div key={stat} className="flex items-center">
              {i > 0 && (
                <span
                  className="hidden sm:inline-block"
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    margin: "0 14px",
                  }}
                />
              )}
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.3px",
                }}
              >
                {stat}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 120,
          background: "linear-gradient(to bottom, transparent, var(--black))",
        }}
      />

      <style jsx global>{`
        @keyframes eventsHeroShimmer {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .events-next-chip:hover {
          border-color: ${NEXT_EVENT.seriesColor}40 !important;
          background: ${NEXT_EVENT.seriesColor}12 !important;
          transform: translateY(-2px);
        }
        .events-next-chip:hover span:last-child {
          transform: translateX(3px);
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — IMPACT NUMBERS
// ─────────────────────────────────────────────────────────────────────────────

function EventsImpact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black-light)",
        padding: "44px 0 48px",
        borderTop: "1px solid var(--gray-border)",
        borderBottom: "1px solid var(--gray-border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* City watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0, overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px 48px",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 40px",
            opacity: 0.04,
          }}
        >
          {[...cities, ...cities, ...cities].map((city, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(22px, 3vw, 40px)",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              {city}
            </span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 300,
            fontSize: "clamp(13px, 1.2vw, 15px)",
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
            margin: "0 0 28px",
            letterSpacing: "0.2px",
            lineHeight: 1.6,
          }}
        >
          Since launching in the region, our events have brought together
          thousands of leaders across critical industries.
        </p>
        <div className="events-impact-row">
          {impactStats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && (
                <div
                  className="events-impact-divider"
                  style={{
                    width: 1,
                    height: 44,
                    background: "var(--gray-border)",
                    margin: "0 clamp(24px, 4vw, 56px)",
                    flexShrink: 0,
                  }}
                />
              )}
              <CountStat {...stat} delay={i * 120} isInView={isInView} />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .events-impact-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .events-impact-row {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px !important;
            justify-items: center;
          }
          .events-impact-row > div:last-child {
            grid-column: span 2;
          }
          .events-impact-divider {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — EVENT SERIES GRID (brand new, not reused)
// ─────────────────────────────────────────────────────────────────────────────

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const target = new Date(targetDate + "T09:00:00").getTime();
    const calc = () => {
      const diff = target - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
        });
      }
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function SeriesCard({
  series,
  index,
}: {
  series: (typeof allEvents)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const countdown = useCountdown(series.date);

  return (
    <Link
      href={series.href}
      className="events-series-card group relative block overflow-hidden"
      style={{
        borderRadius: 16,
        border: hovered
          ? `1px solid ${series.color}33`
          : "1px solid rgba(255, 255, 255, 0.05)",
        aspectRatio: "5 / 4",
        transition:
          "border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "none",
        boxShadow: hovered
          ? `0 16px 48px rgba(0,0,0,0.4), 0 0 32px ${series.color}12`
          : "none",
        textDecoration: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={series.image}
        alt={`${series.title} - ${series.tagline} - ${series.nextCity}`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: hovered
            ? "brightness(0.25) saturate(0.8)"
            : "brightness(0.12) saturate(0.5)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      />

      {/* Color wash */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `linear-gradient(160deg, ${series.color}${hovered ? "18" : "08"} 0%, transparent 50%)`,
        }}
      />

      {/* Darkness gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top,
            rgba(10,10,10,0.97) 0%,
            rgba(10,10,10,0.65) 40%,
            rgba(10,10,10,0.15) 75%,
            rgba(10,10,10,0.4) 100%
          )`,
        }}
      />

      {/* Ambient glow on hover */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: series.color,
          filter: "blur(48px)",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: hovered ? 0.08 : 0,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: 3,
          background: series.color,
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Countdown badge — top right */}
      <div
        className="absolute z-10"
        style={{ top: 12, right: 12 }}
      >
        <span
          className="flex items-center gap-1.5"
          style={{
            padding: "4px 10px",
            borderRadius: 40,
            background:
              series.status === "open"
                ? "rgba(34,197,94,0.12)"
                : `${series.color}10`,
            border:
              series.status === "open"
                ? "1px solid rgba(34,197,94,0.25)"
                : `1px solid ${series.color}20`,
          }}
        >
          {series.status === "open" && (
            <span className="relative flex h-1 w-1">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#22C55E" }}
              />
              <span
                className="relative inline-flex rounded-full h-1 w-1"
                style={{ background: "#22C55E" }}
              />
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              color:
                series.status === "open" ? "#22C55E" : series.color,
            }}
          >
            {countdown.days > 0
              ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`
              : series.status === "open"
                ? "Today"
                : "Coming Soon"}
          </span>
        </span>
      </div>

      {/* Content — bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ padding: "clamp(14px, 2vw, 22px)" }}
      >
        {/* Series color accent line */}
        <div
          style={{
            width: hovered ? 32 : 18,
            height: 2,
            background: series.color,
            marginBottom: 10,
            transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(15px, 1.4vw, 20px)",
            fontWeight: 800,
            letterSpacing: "-0.3px",
            color: "var(--white)",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {series.title}
        </h3>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 11,
            fontWeight: 500,
            color: series.color,
            letterSpacing: "0.4px",
            margin: "6px 0 0",
          }}
        >
          {series.tagline}
        </p>

        {/* Description — reveal on hover */}
        <div
          style={{
            maxHeight: hovered ? 48 : 0,
            opacity: hovered ? 1 : 0,
            overflow: "hidden",
            transition:
              "max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 300,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.5,
              margin: "6px 0 0",
            }}
          >
            {series.description}
          </p>
        </div>

        {/* Next event + meta row */}
        <div
          className="flex items-center flex-wrap gap-1.5"
          style={{ marginTop: 10 }}
        >
          {/* Next event date */}
          <span
            className="flex items-center gap-1"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ opacity: 0.5 }}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {series.nextDate}
          </span>

          <span
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
            }}
          />

          {/* City */}
          <span
            className="flex items-center gap-1"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 400,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ opacity: 0.4 }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {series.nextCity}
          </span>

          <span
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
            }}
          />

          {/* Attendees */}
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 400,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {series.attendees}
          </span>
        </div>
      </div>

      {/* Arrow top-left */}
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{
          top: 12,
          left: 12,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: hovered
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.04)",
          border: hovered
            ? `1px solid ${series.color}66`
            : "1px solid rgba(255, 255, 255, 0.06)",
          transition: "all 0.4s ease",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: hovered ? series.color : "white",
            opacity: hovered ? 1 : 0.4,
            display: "inline-block",
            transform: hovered ? "rotate(-45deg)" : "none",
            transition: "all 0.4s ease",
          }}
        >
          →
        </span>
      </div>
    </Link>
  );
}

// Filter option types
const INTEREST_FILTERS = [
  { label: "All", value: "all" },
  { label: "Cybersecurity", value: "cyber-first", color: "#01BBF5" },
  { label: "OT Security", value: "ot-security-first", color: "#D34B9A" },
  { label: "Data & AI", value: "data-ai-first", color: "#0F735E" },
  { label: "Opex", value: "opex-first", color: "#7C3AED" },
] as const;

function EventsSeriesGrid() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [interest, setInterest] = useState("all");
  const [city, setCity] = useState("all");
  const [month, setMonth] = useState("all");

  // Only show future events
  const futureEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return allEvents
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  // Derive city filters from actual event data
  const cityFilters = useMemo(() => {
    const cities = new Set<string>();
    futureEvents.forEach((e) => {
      const city = e.nextCity.split(",")[0].trim();
      cities.add(city);
    });
    return [
      { label: "All Cities", value: "all" },
      ...[...cities].sort().map((c) => ({ label: c, value: c })),
    ];
  }, [futureEvents]);

  // Derive month filters from actual event data
  const monthFilters = useMemo(() => {
    const months = new Map<string, string>();
    futureEvents.forEach((e) => {
      const parts = e.nextDate.split(" ");
      const mon = parts[1]; // "Apr", "May", etc.
      if (!months.has(mon)) months.set(mon, mon);
    });
    return [
      { label: "All Months", value: "all" },
      ...[...months.entries()].map(([key, val]) => ({
        label: key,
        value: val,
      })),
    ];
  }, [futureEvents]);

  const filtered = useMemo(() => {
    return futureEvents.filter((e) => {
      if (interest !== "all" && e.category !== interest) return false;
      if (city !== "all") {
        if (!e.nextCity.includes(city) && !e.regions.includes(city))
          return false;
      }
      if (month !== "all" && !e.nextDate.includes(month)) return false;
      return true;
    });
  }, [interest, city, month, futureEvents]);

  const activeCount =
    (interest !== "all" ? 1 : 0) +
    (city !== "all" ? 1 : 0) +
    (month !== "all" ? 1 : 0);

  return (
    <section
      id="upcoming-events"
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(36px, 4.5vw, 52px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <SectionLabel text="Events Calendar" centered />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.12,
              margin: 0,
            }}
          >
            Upcoming Events
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(14px, 1.3vw, 16px)",
              color: "#A0A0A0",
              lineHeight: 1.65,
              maxWidth: 560,
              margin: "14px auto 0",
            }}
          >
            Browse every upcoming EFG event — filter by interest, city, or
            month to find the right room for you.
          </p>
        </motion.div>

        {/* ── Filter Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          style={{ marginBottom: 40 }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
              justifyContent: "center",
            }}
          >
            {/* Interest pills */}
            <FilterGroup
              options={INTEREST_FILTERS}
              value={interest}
              onChange={setInterest}
            />

            {/* Divider */}
            <span
              className="hidden md:block"
              style={{
                width: 1,
                height: 20,
                background: "rgba(255,255,255,0.08)",
              }}
            />

            {/* City dropdown */}
            <FilterDropdown
              options={cityFilters}
              value={city}
              onChange={setCity}
              icon="location"
            />

            {/* Month dropdown */}
            <FilterDropdown
              options={monthFilters}
              value={month}
              onChange={setMonth}
              icon="calendar"
            />

            {/* Clear all */}
            {activeCount > 0 && (
              <button
                onClick={() => {
                  setInterest("all");
                  setCity("all");
                  setMonth("all");
                }}
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.35)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 10px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Events Grid with AnimatePresence */}
        <div
          className="events-series-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
            gap: 14,
            minHeight: 200,
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((series, i) => (
              <motion.div
                key={series.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: EASE,
                  layout: { duration: 0.4, ease: EASE },
                }}
              >
                <SeriesCard series={series} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 20px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.3)",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  No series match your current filters.
                </p>
                <button
                  onClick={() => {
                    setInterest("all");
                    setCity("all");
                    setMonth("all");
                  }}
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--orange)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginTop: 12,
                    padding: 0,
                  }}
                >
                  Reset filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .events-series-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .events-series-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ── Filter pill group (used for Interest) ──────────────────────────────────
function FilterGroup({
  options,
  value,
  onChange,
}: {
  options: readonly { label: string; value: string; color?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        const accentColor = opt.color || "var(--orange)";
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              letterSpacing: "0.2px",
              padding: "7px 16px",
              borderRadius: 40,
              border: active
                ? `1px solid ${accentColor}55`
                : "1px solid rgba(255,255,255,0.07)",
              background: active ? `${accentColor}14` : "rgba(255,255,255,0.03)",
              color: active ? accentColor : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              }
            }}
          >
            {opt.color && active && (
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: accentColor,
                  marginRight: 6,
                  verticalAlign: "middle",
                }}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Filter dropdown (used for City / Month) ────────────────────────────────
function FilterDropdown({
  options,
  value,
  onChange,
  icon,
}: {
  options: readonly { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  icon: "location" | "calendar";
}) {
  const active = value !== "all";

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      {/* Inline icon */}
      <span
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: active ? "var(--orange)" : "rgba(255,255,255,0.3)",
          transition: "color 0.2s ease",
        }}
      >
        {icon === "location" ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: active ? 600 : 400,
          color: active ? "var(--white)" : "rgba(255,255,255,0.4)",
          background: active
            ? "rgba(232,101,26,0.08)"
            : "rgba(255,255,255,0.03)",
          border: active
            ? "1px solid rgba(232,101,26,0.25)"
            : "1px solid rgba(255,255,255,0.07)",
          borderRadius: 40,
          padding: "7px 32px 7px 30px",
          cursor: "pointer",
          appearance: "none",
          WebkitAppearance: "none",
          outline: "none",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ color: "#222", background: "#fff" }}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Chevron */}
      <span
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "rgba(255,255,255,0.25)",
          fontSize: 10,
        }}
      >
        ▾
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — UP NEXT (spotlight on nearest upcoming event)
// ─────────────────────────────────────────────────────────────────────────────

function EventsUpNext() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const ev = NEXT_EVENT;

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(36px, 4.5vw, 52px) 0",
      }}
    >
      <div
        className="events-upnext-grid"
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(48px, 8vw, 100px)",
          alignItems: "center",
        }}
      >
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <SectionLabel text="Experience an EFG Event" />
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.7,
              margin: "0 0 24px",
              maxWidth: 440,
            }}
          >
            This is what a typical EFG summit looks like — focused, senior,
            and outcome-driven.
          </p>

          {/* Series badge */}
          <div
            className="flex items-center gap-2"
            style={{ margin: "0 0 16px" }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: ev.seriesColor,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: ev.seriesColor,
              }}
            >
              {ev.series} · {ev.edition}
            </span>
          </div>

          {/* Event name */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 46px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.12,
              margin: 0,
            }}
          >
            {ev.title}
          </h2>

          {/* Date & Location */}
          <div
            className="flex items-center flex-wrap gap-3"
            style={{ margin: "16px 0 0" }}
          >
            <span
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 400,
                color: "var(--white-dim)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.5 }}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              9 June 2026
            </span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
              }}
            />
            <span
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 400,
                color: "var(--white-dim)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.5 }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {ev.location}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(14px, 1.2vw, 16px)",
              lineHeight: 1.8,
              color: "var(--white-dim)",
              margin: "20px 0 0",
            }}
          >
            {ev.description}
          </p>

          {/* Format chips */}
          <div
            className="flex flex-wrap gap-2"
            style={{ margin: "20px 0 0" }}
          >
            {["Keynotes", "Boardrooms", "Workshops", "Awards"].map((fmt) => (
              <span
                key={fmt}
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.4px",
                  color: "rgba(255,255,255,0.45)",
                  padding: "5px 14px",
                  borderRadius: 40,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.025)",
                }}
              >
                {fmt}
              </span>
            ))}
          </div>

          {/* What you'll get */}
          <div style={{ margin: "24px 0 0" }}>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                margin: "0 0 10px",
              }}
            >
              What you&apos;ll get
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {[
                "Closed-door CISO boardroom",
                "Global threat landscape briefing",
                "Vendor-free practitioner panels",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5"
                  style={{ marginBottom: 8 }}
                >
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: ev.seriesColor,
                      flexShrink: 0,
                      opacity: 0.6,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scarcity cue */}
          <div
            className="flex items-center gap-2"
            style={{ margin: "18px 0 0" }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--orange)", opacity: 0.6 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--orange)",
                opacity: 0.7,
                letterSpacing: "0.3px",
              }}
            >
              Limited seats · RSVP required
            </span>
          </div>

          {/* Countdown */}
          <div
            style={{
              margin: "28px 0 0",
              padding: "20px 24px",
              borderRadius: 16,
              border: `1px solid ${ev.seriesColor}20`,
              background: `${ev.seriesColor}08`,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "var(--white-muted)",
                margin: "0 0 10px",
              }}
            >
              Countdown to Event
            </p>
            <CountdownDisplay date={ev.date} accentColor={ev.seriesColor} />
          </div>

          {/* CTA */}
          <Link
            href={ev.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 28,
              padding: "14px 32px",
              borderRadius: 60,
              background: ev.seriesColor,
              color: "white",
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 40px ${ev.seriesColor}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Learn More <span>→</span>
          </Link>
        </motion.div>

        {/* Right: Visual card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          style={{
            width: "100%",
            borderRadius: 24,
            border: `1px solid ${ev.seriesColor}20`,
            overflow: "hidden",
            position: "relative",
            aspectRatio: "4/5",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ev.image}
            alt="Events First Group technology summit"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.2) saturate(0.6)",
            }}
          />

          {/* Color wash */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, ${ev.seriesColor}12 0%, transparent 50%)`,
            }}
          />

          {/* Darkness gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top,
                rgba(10,10,10,0.97) 0%,
                rgba(10,10,10,0.6) 40%,
                rgba(10,10,10,0.15) 70%,
                rgba(10,10,10,0.4) 100%
              )`,
            }}
          />

          {/* Registration badge */}
          <div className="absolute z-10" style={{ top: 24, right: 24 }}>
            <span
              className="flex items-center gap-2"
              style={{
                padding: "7px 14px",
                borderRadius: 40,
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "#22C55E" }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: "#22C55E" }}
                />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#22C55E",
                }}
              >
                Registration Open
              </span>
            </span>
          </div>

          {/* Card content overlay */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ padding: "clamp(24px, 3vw, 40px)" }}
          >
            <div
              style={{
                width: 32,
                height: 2,
                background: ev.seriesColor,
                marginBottom: 16,
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: ev.seriesColor,
                margin: "0 0 8px",
              }}
            >
              {ev.edition}
            </p>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(24px, 2.5vw, 32px)",
                letterSpacing: "-0.5px",
                color: "var(--white)",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {ev.title}
            </h3>

            <div
              className="flex items-center flex-wrap gap-3"
              style={{ marginTop: 16 }}
            >
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {ev.venue}
              </span>
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {ev.attendees}
              </span>
            </div>
          </div>

          {/* Top corner glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: -40,
              right: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: ev.seriesColor,
              filter: "blur(80px)",
              opacity: 0.08,
            }}
          />
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .events-upnext-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: TRUSTED BY — Scrolling logo marquee
// ─────────────────────────────────────────────────────────────────────────────

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";

const trustedLogos = [
  { src: `${S3}/Microsoft.png`, name: "Microsoft" },
  { src: `${S3}/Google-Cloud.png`, name: "Google Cloud" },
  { src: `${S3}/SAP.png`, name: "SAP" },
  { src: `${S3}/Oracle.png`, name: "Oracle" },
  { src: `${S3}/paloalto.png`, name: "Palo Alto Networks" },
  { src: `${S3}/Google-Cloud-Security.png`, name: "Google Cloud Security" },
  { src: `${S3}/sentinelone.png`, name: "SentinelOne" },
  { src: `${S3}/kaspersky.png`, name: "Kaspersky" },
  { src: `${S3}/fortinet.png`, name: "Fortinet" },
  { src: `${S3}/Celonis.png`, name: "Celonis" },
  { src: `${S3}/YOKOGAWA.png`, name: "Yokogawa" },
  { src: `${S3}/Dragos.png`, name: "Dragos" },
  { src: `${S3}/Akamai.png`, name: "Akamai" },
  { src: `${S3}/EY.png`, name: "EY" },
  { src: `${S3}/Claroty.png`, name: "Claroty" },
  { src: `${S3}/GBM.png`, name: "GBM" },
  { src: `${S3}/Group-IB.png`, name: "Group-IB" },
  { src: `${S3}/nozomi-networks.png`, name: "Nozomi Networks" },
  { src: `${S3}/OPSWAT-logo.png`, name: "OPSWAT" },
  { src: `${S3}/Tenable-logo.png`, name: "Tenable" },
  { src: `${S3}/ManageEngine.png`, name: "ManageEngine" },
  { src: `${S3}/secureworks.png`, name: "Secureworks" },
  { src: `${S3}/Sonicwall.png`, name: "SonicWall" },
  { src: `${S3}/CPX.png`, name: "CPX" },
  { src: `${S3}/PENTERA.png`, name: "Pentera" },
  { src: `${S3}/Securonix-logo.png`, name: "Securonix" },
  { src: `${S3}/Wallix.png`, name: "Wallix" },
  { src: `${S3}/EC-Council.png`, name: "EC-Council" },
];

function TrustedBy() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(28px, 3.5vw, 40px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* Label */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <SectionLabel text="Trusted By Industry Leaders" centered />
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "rgba(255,255,255,0.3)",
              lineHeight: 1.6,
              margin: "8px auto 0",
              letterSpacing: "0.2px",
            }}
          >
            Trusted by global technology leaders and enterprises worldwide
          </p>
        </div>

        {/* Marquee container with edge fades */}
        <div style={{ position: "relative" }}>
          {/* Left fade */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              background:
                "linear-gradient(to right, var(--black) 0%, transparent 100%)",
            }}
          />
          {/* Right fade */}
          <div
            className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              background:
                "linear-gradient(to left, var(--black) 0%, transparent 100%)",
            }}
          />

          {/* Row 1 — scrolls left */}
          <div className="trusted-marquee-track" style={{ marginBottom: 16 }}>
            <div className="trusted-marquee-inner trusted-scroll-left">
              {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                <div
                  key={`r1-${i}`}
                  className="trusted-logo-item"
                  style={{
                    width: 140,
                    height: 44,
                    margin: "0 clamp(14px, 2vw, 28px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.5,
                    transition: "opacity 0.3s ease",
                    cursor: "default",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right */}
          <div className="trusted-marquee-track">
            <div className="trusted-marquee-inner trusted-scroll-right">
              {[...trustedLogos.slice(12), ...trustedLogos.slice(0, 12), ...trustedLogos.slice(12), ...trustedLogos.slice(0, 12)].map(
                (logo, i) => (
                  <div
                    key={`r2-${i}`}
                    className="trusted-logo-item"
                    style={{
                      width: 140,
                      height: 44,
                      margin: "0 clamp(14px, 2vw, 28px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.5,
                      transition: "opacity 0.3s ease",
                      cursor: "default",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .trusted-marquee-track {
          overflow: hidden;
        }
        .trusted-marquee-inner {
          display: flex;
          width: max-content;
        }
        .trusted-scroll-left {
          animation: trustedScrollLeft 40s linear infinite;
        }
        .trusted-scroll-right {
          animation: trustedScrollRight 45s linear infinite;
        }
        @keyframes trustedScrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes trustedScrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .trusted-logo-item:hover {
          opacity: 0.6 !important;
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: PAST EVENTS — Flagship event showcase
// ─────────────────────────────────────────────────────────────────────────────

const flagshipEvents = [
  {
    id: "cyberfirst-uae",
    series: "Cyber First",
    seriesColor: "#01BBF5",
    title: "CyberFirst UAE Summit",
    edition: "1ST EDITION",
    date: "February 3, 2026",
    city: "Abu Dhabi",
    venue: "Conference venue, Abu Dhabi",
    highlight: "Chaired by H.E. Dr. Mohamed Al Kuwaiti",
    audience: "CISOs & Govt Leaders",
    metric: "100% boardroom seats filled",
    stats: { speakers: "25+", attendees: "300+", sponsors: "15+" },
  },
  {
    id: "ot-security-mena",
    series: "OT Security First",
    seriesColor: "#D34B9A",
    title: "OT Security First MENA",
    edition: "1ST EDITION",
    date: "February 4, 2026",
    city: "Abu Dhabi",
    venue: "Rosewood Hotel",
    highlight: "Yokogawa Platinum · OT Security Awards",
    audience: "OT Security Directors & CISOs",
    metric: "3 boardroom sessions sold out",
    stats: { speakers: "20+", attendees: "250+", sponsors: "12+" },
  },
  {
    id: "opex-first-ksa",
    series: "Opex First",
    seriesColor: "#7C3AED",
    title: "OPEX First KSA",
    edition: "INAUGURAL",
    date: "September 9, 2025",
    city: "Riyadh",
    venue: "Riyadh Airport Marriott",
    highlight: "Celonis Lead Sponsor · OELeap Launch",
    audience: "COOs & Process Leaders",
    metric: "200+ attendees",
    stats: { speakers: "20+", attendees: "200+", sponsors: "10+" },
  },
  {
    id: "digital-first-qatar",
    series: "Data & AI First",
    seriesColor: "#0F735E",
    title: "Digital First Qatar",
    edition: "1ST EDITION",
    date: "February 20, 2024",
    city: "Doha",
    venue: "Hilton Doha",
    highlight: "30+ Speakers · Government Participation",
    audience: "CDOs & Data Leaders",
    metric: "18 sponsors onboarded",
    stats: { speakers: "30+", attendees: "300+", sponsors: "18+" },
  },
];

const trackRecordStats = [
  { value: "112+", label: "Events Delivered" },
  { value: "7", label: "Countries" },
  { value: "60+", label: "Partners" },
  { value: "300+", label: "Speakers" },
];

function PastEvents() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <section
      id="past-events"
      ref={ref}
      style={{
        background: "var(--black-light)",
        padding: "clamp(36px, 4.5vw, 52px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle warm gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,101,26,0.03) 0%, transparent 60%)",
        }}
      />

      <div
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          position: "relative",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <SectionLabel text="Our Track Record" centered />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 4vw, 52px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            112+ Events. 7 Countries.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(14px, 1.3vw, 16px)",
              color: "#A0A0A0",
              lineHeight: 1.65,
              maxWidth: 480,
              margin: "14px auto 0",
            }}
          >
            Since 2023, EFG has delivered conferences, executive boardrooms, and
            managed events across multiple continents.
          </p>
        </motion.div>

        {/* Mini stats row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="flex items-center justify-center flex-wrap gap-6 sm:gap-0"
          style={{ marginBottom: 48 }}
        >
          {trackRecordStats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && (
                <div
                  className="hidden sm:block"
                  style={{
                    width: 1,
                    height: 28,
                    background: "rgba(255,255,255,0.06)",
                    margin: "0 clamp(20px, 3vw, 40px)",
                  }}
                />
              )}
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(24px, 2.5vw, 32px)",
                    letterSpacing: "-1px",
                    color: "white",
                  }}
                >
                  {stat.value}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "var(--white-muted)",
                    margin: "4px 0 0",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Framing line above grid */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 300,
            fontSize: "clamp(13px, 1.2vw, 15px)",
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
            lineHeight: 1.6,
            margin: "0 0 32px",
            letterSpacing: "0.2px",
          }}
        >
          Across cybersecurity, data, operations and digital transformation —
          these are the rooms we&apos;ve built.
        </motion.p>

        {/* Flagship cards grid */}
        <div
          className="past-events-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {flagshipEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.3 + i * 0.1,
                ease: EASE,
              }}
            >
              <FlagshipCard event={event} />
            </motion.div>
          ))}
        </div>

        {/* View Highlights button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
          style={{ textAlign: "center", marginTop: 36 }}
        >
          <button
            onClick={() => setGalleryOpen(true)}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--orange)",
              background: "rgba(232,101,26,0.06)",
              border: "1px solid rgba(232,101,26,0.18)",
              borderRadius: 60,
              padding: "12px 32px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(232,101,26,0.12)";
              e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(232,101,26,0.06)";
              e.currentTarget.style.borderColor = "rgba(232,101,26,0.18)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            View Highlights
          </button>
        </motion.div>

        {/* Bottom context */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 400,
            color: "#404040",
            textAlign: "center",
            margin: "24px 0 0",
          }}
        >
          And 100+ more managed events, executive boardrooms, and industry
          roundtables worldwide.
        </motion.p>
      </div>

      {/* ── Highlights Gallery Modal ── */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setGalleryOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "90vw",
                maxWidth: 900,
                maxHeight: "80vh",
                background: "#111114",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between"
                style={{
                  padding: "20px 28px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "white",
                      letterSpacing: "-0.5px",
                      margin: 0,
                    }}
                  >
                    Event Highlights
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.4)",
                      margin: "4px 0 0",
                    }}
                  >
                    Moments from our flagship events
                  </p>
                </div>
                <button
                  onClick={() => setGalleryOpen(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 18,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  ×
                </button>
              </div>

              {/* Gallery grid */}
              <div
                style={{
                  padding: 24,
                  overflowY: "auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                {[
                  { label: "CyberFirst UAE — Keynote Stage", color: "#01BBF5" },
                  { label: "OT Security MENA — Awards Ceremony", color: "#D34B9A" },
                  { label: "OPEX First KSA — Panel Discussion", color: "#7C3AED" },
                  { label: "Digital First Qatar — Networking", color: "#0F735E" },
                  { label: "Executive Boardroom — In Session", color: "#C9935A" },
                  { label: "Sponsor Exhibition Hall", color: "#E8651A" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      aspectRatio: "4/3",
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${item.color}12 0%, rgba(255,255,255,0.02) 100%)`,
                      border: `1px solid ${item.color}18`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 20,
                      gap: 12,
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 11,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.4)",
                        textAlign: "center",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Modal footer */}
              <div
                style={{
                  padding: "16px 28px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.25)",
                    margin: 0,
                  }}
                >
                  Photo gallery coming soon — placeholder cards shown above
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 768px) {
          .past-events-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function FlagshipCard({ event }: { event: (typeof flagshipEvents)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden transition-all"
      style={{
        borderRadius: 18,
        border: `1px solid ${hovered ? event.seriesColor + "30" : "rgba(255,255,255,0.06)"}`,
        background: hovered ? "rgba(255,255,255,0.03)" : "var(--black-card)",
        padding: "clamp(24px, 3vw, 32px)",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered
          ? `0 16px 50px rgba(0,0,0,0.3), 0 0 30px ${event.seriesColor}08`
          : "none",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 transition-all duration-500"
        style={{
          width: 3,
          background: event.seriesColor,
          opacity: hovered ? 1 : 0.4,
        }}
      />

      {/* Top: badges */}
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="flex items-center gap-3">
          {/* Series badge */}
          <span
            className="inline-flex items-center gap-1.5"
            style={{
              background: `${event.seriesColor}12`,
              border: `1px solid ${event.seriesColor}25`,
              borderRadius: 50,
              padding: "3px 10px",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: event.seriesColor,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 9,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: event.seriesColor,
              }}
            >
              {event.series}
            </span>
          </span>

          {/* Edition badge */}
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 9,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#484848",
              background: "rgba(255,255,255,0.04)",
              padding: "3px 10px",
              borderRadius: 4,
            }}
          >
            {event.edition}
          </span>
        </div>

        {/* Completed badge */}
        <span
          className="flex items-center gap-1.5"
          style={{
            padding: "3px 10px",
            borderRadius: 40,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22C55E"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#22C55E",
            }}
          >
            Completed
          </span>
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(18px, 2vw, 22px)",
          fontWeight: 800,
          color: "white",
          letterSpacing: "-0.5px",
          margin: "0 0 6px",
        }}
      >
        {event.title}
      </h3>

      {/* Date + City + Venue */}
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: 400,
          color: "#606060",
          margin: "0 0 12px",
        }}
      >
        {event.date} · {event.city} · {event.venue}
      </p>

      {/* Highlight */}
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: 500,
          color: event.seriesColor,
          opacity: 0.7,
          margin: "0 0 10px",
        }}
      >
        {event.highlight}
      </p>

      {/* Audience */}
      <div
        className="flex items-center gap-2"
        style={{ margin: "0 0 6px" }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 11,
            fontWeight: 400,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Audience: {event.audience}
        </span>
      </div>

      {/* Concrete metric */}
      <div
        className="flex items-center gap-2"
        style={{ margin: "0 0 16px" }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#22C55E", opacity: 0.5, flexShrink: 0 }}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {event.metric}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4">
        {Object.entries(event.stats).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                color: "white",
              }}
            >
              {val}
            </span>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 400,
                textTransform: "capitalize",
                color: "#505050",
              }}
            >
              {key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: VOICES — Testimonials
// ─────────────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    id: 1,
    quote:
      "The executive boardroom was very transformative for us — our brand got exposure with the right connections.",
    name: "Srikanth Rayaprolu",
    title: "CEO & Co-Founder, Ad Scholars",
    badge: "NetworkFirst Boardroom",
    badgeColor: "#C9935A",
    role: "Sponsor" as const,
    outcomes: ["Lead gen", "Brand authority"],
  },
  {
    id: 2,
    quote:
      "Cyber First brought together the exact room of CISOs and government leaders I needed. The conversations here don't happen anywhere else.",
    name: "Regional CISO",
    title: "Fortune 500 Enterprise",
    badge: "Cyber First Kuwait",
    badgeColor: "#01BBF5",
    role: "Delegate" as const,
    outcomes: ["Policy access", "Peer network"],
  },
  {
    id: 3,
    quote:
      "The event exceeded expectations and gave our brand center stage. The caliber of attendees — from ministers to CIOs — was exceptional.",
    name: "Sheryan Gandhi",
    title: "COO, Tap1ce",
    badge: "Sponsor Partner",
    badgeColor: "#E8651A",
    role: "Sponsor" as const,
    outcomes: ["Brand authority", "Lead gen"],
  },
  {
    id: 4,
    quote:
      "OPEX First KSA was Saudi Arabia's first dedicated operational excellence platform. The caliber of speakers set a new benchmark for the region.",
    name: "Industry Leader",
    title: "Enterprise Operations",
    badge: "OPEX First KSA",
    badgeColor: "#7C3AED",
    role: "Speaker" as const,
    outcomes: ["Thought leadership", "Policy access"],
  },
];

function Voices() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isInView, next]);

  // Touch swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
    },
    [next, prev],
  );

  const t = testimonials[active];

  const roleColors: Record<string, string> = {
    Sponsor: "#E8651A",
    Delegate: "#01BBF5",
    Speaker: "#7C3AED",
  };

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(40px, 5vw, 60px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(232,101,26,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Ghost quote mark */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(200px, 30vw, 400px)",
          fontWeight: 800,
          color: "rgba(255,255,255,0.015)",
          lineHeight: 1,
        }}
      >
        &ldquo;
      </div>

      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: PAD,
          position: "relative",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <SectionLabel text="Voices from the Floor" centered />
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.6,
              margin: "0 0 8px",
              letterSpacing: "0.2px",
            }}
          >
            What attendees say after being in the room.
          </p>
        </motion.div>

        {/* Quote area — swipeable */}
        <div
          style={{ minHeight: 280, position: "relative" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Badge row — event badge + role tag */}
              <div
                className="flex items-center justify-center flex-wrap gap-2"
                style={{ marginBottom: 24 }}
              >
                {/* Event badge */}
                <span
                  className="inline-flex items-center gap-2"
                  style={{
                    padding: "5px 14px",
                    borderRadius: 40,
                    background: `${t.badgeColor}12`,
                    border: `1px solid ${t.badgeColor}25`,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: t.badgeColor,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: t.badgeColor,
                    }}
                  >
                    {t.badge}
                  </span>
                </span>

                {/* Role tag */}
                <span
                  style={{
                    padding: "5px 12px",
                    borderRadius: 40,
                    background: `${roleColors[t.role]}10`,
                    border: `1px solid ${roleColors[t.role]}20`,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: roleColors[t.role],
                  }}
                >
                  {t.role}
                </span>
              </div>

              {/* Quote */}
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 2vw, 24px)",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.8)",
                  margin: "0 0 24px",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 4px",
                }}
              >
                {t.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 300,
                  color: "#606060",
                  margin: "0 0 16px",
                }}
              >
                {t.title}
              </p>

              {/* "What they got" outcome tags */}
              <div
                className="flex items-center justify-center flex-wrap gap-2"
              >
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.3px",
                    marginRight: 4,
                  }}
                >
                  What they got:
                </span>
                {t.outcomes.map((outcome) => (
                  <span
                    key={outcome}
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.45)",
                      padding: "3px 10px",
                      borderRadius: 40,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.025)",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {outcome}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation: prev/next arrows + dots */}
        <div
          className="flex items-center justify-center gap-4"
          style={{ marginTop: 28 }}
        >
          {/* Prev */}
          <button
            onClick={prev}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            ←
          </button>

          {/* Dots */}
          <div className="flex items-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="transition-all"
                style={{
                  width: active === i ? 24 : 8,
                  height: 8,
                  borderRadius: 50,
                  background:
                    active === i
                      ? testimonials[i].badgeColor
                      : "rgba(255,255,255,0.1)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transitionDuration: "0.3s",
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: MEDIA COVERAGE — Press strip
// ─────────────────────────────────────────────────────────────────────────────

const mediaPartners = [
  { src: `${S3}/Industrial-Cyber.png`, name: "Industrial Cyber" },
  { src: `${S3}/SC-Media.png`, name: "SC Media" },
  { src: `${S3}/Dark-Reading.png`, name: "Dark Reading" },
  { src: `${S3}/CSO-Online.png`, name: "CSO Online" },
  { src: `${S3}/Cyber-Defense-Magazi.png`, name: "Cyber Defense Magazine" },
  { src: `${S3}/Help-Net-Security.png`, name: "Help Net Security" },
  { src: `${S3}/Security-Middle-East.png`, name: "Security Middle East" },
  { src: `${S3}/Cybersecurity-Insiders.png`, name: "Cybersecurity Insiders" },
  { src: `${S3}/Control-Engineering.png`, name: "Control Engineering" },
  { src: `${S3}/Industry-Events.png`, name: "Industry Events" },
];

function MediaCoverage() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(28px, 3.5vw, 40px) 0",
        borderTop: "1px solid var(--gray-border)",
        borderBottom: "1px solid var(--gray-border)",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Label */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#404040",
              }}
            >
              As Featured In
            </span>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 300,
                fontSize: "clamp(13px, 1.2vw, 15px)",
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1.6,
                margin: "8px auto 0",
                letterSpacing: "0.2px",
              }}
            >
              Our events and insights are covered by leading industry
              publications
            </p>
          </div>

          {/* Media logos row */}
          <div
            className="flex items-center justify-center flex-wrap"
            style={{ gap: "16px clamp(20px, 3vw, 36px)" }}
          >
            {mediaPartners.map((partner) => (
              <div
                key={partner.name}
                className="media-logo-item"
                style={{
                  width: 120,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.45,
                  transition: "opacity 0.3s ease",
                  cursor: "default",
                }}
              >
                <img
                  src={partner.src}
                  alt={partner.name}
                  loading="lazy"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .media-logo-item:hover {
          opacity: 0.75 !important;
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: INQUIRY FORM — Split Layout (Left editorial + Right form)
// ─────────────────────────────────────────────────────────────────────────────
// SECTION: HOW EFG EVENTS ARE DIFFERENT
// ─────────────────────────────────────────────────────────────────────────────

const differentiators = [
  {
    title: "Curated Rooms, Not Crowded Halls",
    description:
      "Every seat is intentional. We hand-select CISOs, CIOs, CTOs, and VP-level leaders \u2014 no open registration, no trade-show crowds. The result is a room where every conversation moves the needle.",
    metric: "15\u201320",
    metricLabel: "Leaders per boardroom",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Executive-Only Formats",
    description:
      "Summits, closed-door boardrooms, practitioner workshops, and leadership awards \u2014 designed for decision-makers who don\u2019t have time for filler. Every format is built to deliver signal, not noise.",
    metric: "4",
    metricLabel: "Distinct event formats",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 7V5a4 4 0 0 0-8 0v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
      </svg>
    ),
  },
  {
    title: "Practitioners on Stage, Not Salespeople",
    description:
      "Our speaker lineups are built on one rule: real-world experience only. No vendor pitches, no pay-to-play slots. Every keynote and panel features hands-on leaders sharing what actually worked \u2014 and what didn\u2019t.",
    metric: "0%",
    metricLabel: "Vendor pitches on stage",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    title: "Built Ground-Up, Not Imported",
    description:
      "These aren't repackaged conferences dropped into any hotel. Every agenda, speaker brief, and format is designed ground-up for each market's regulatory landscape, talent ecosystem, and digital ambitions.",
    metric: "6+",
    metricLabel: "Markets worldwide",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

function HowDifferent() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(36px, 4.5vw, 52px) 0",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <SectionLabel text="The EFG Difference" centered />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.2vw, 42px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.12,
              margin: 0,
            }}
          >
            How EFG Events Are Different
          </h2>
        </motion.div>

        {/* Lead-in */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(15px, 1.3vw, 17px)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.65,
            textAlign: "center",
            maxWidth: 680,
            margin: "0 auto 56px",
          }}
        >
          Most tech events are trade shows in disguise. EFG designs invite-only
          rooms where senior leaders exchange real insight — no expo halls, no
          badge scanners, no filler.
        </motion.p>

        {/* Cards — 2x2 grid */}
        <div
          className="how-diff-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {differentiators.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}
            >
              <DifferentiatorCard {...item} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 700px) {
          .how-diff-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function DifferentiatorCard({
  title,
  description,
  metric,
  metricLabel,
  icon,
}: {
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "clamp(28px, 3vw, 40px) clamp(24px, 2.5vw, 36px)",
        borderRadius: 20,
        border: hovered
          ? "1px solid rgba(232,101,26,0.18)"
          : "1px solid rgba(255,255,255,0.05)",
        background: hovered
          ? "rgba(232,101,26,0.03)"
          : "rgba(255,255,255,0.02)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      {/* Top row: Icon + Metric */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: hovered
              ? "rgba(232,101,26,0.10)"
              : "rgba(255,255,255,0.04)",
            border: hovered
              ? "1px solid rgba(232,101,26,0.15)"
              : "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: hovered ? "var(--orange)" : "rgba(255,255,255,0.35)",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        {/* Metric */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 2.5vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1,
              color: hovered ? "var(--orange)" : "rgba(255,255,255,0.15)",
              transition: "color 0.4s ease",
            }}
          >
            {metric}
          </div>
          <div
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 400,
              color: "rgba(255,255,255,0.3)",
              marginTop: 4,
              letterSpacing: "0.3px",
            }}
          >
            {metricLabel}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(17px, 1.5vw, 20px)",
          fontWeight: 700,
          color: "var(--white)",
          letterSpacing: "-0.4px",
          lineHeight: 1.25,
          margin: "0 0 12px",
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          fontWeight: 300,
          color: "rgba(255,255,255,0.4)",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: CTA
// ─────────────────────────────────────────────────────────────────────────────

function EventsCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(56px,7vw,90px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            borderRadius: 28,
            border: "1px solid rgba(232,101,26,0.12)",
            background: "rgba(232,101,26,0.04)",
            padding: "clamp(40px,5vw,64px) clamp(28px,5vw,56px)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 600,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(232,101,26,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "var(--orange)",
                margin: "0 0 20px",
              }}
            >
              Don&apos;t Miss a Single Event
            </p>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(28px,4vw,52px)",
                letterSpacing: "-1.5px",
                color: "var(--white)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Ready to Explore the EFG Event World?
            </h2>

            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 300,
                fontSize: "clamp(14px,1.3vw,17px)",
                lineHeight: 1.7,
                color: "var(--white-dim)",
                maxWidth: 500,
                margin: "18px auto 36px",
              }}
            >
              Subscribe to get early access to registrations, speaker
              announcements, and exclusive invitations across every EFG series.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center flex-wrap gap-4">
              <Link
                href="/contact"
                style={{
                  padding: "15px 36px",
                  borderRadius: 60,
                  background: "var(--orange)",
                  color: "white",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--orange-bright)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px var(--orange-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--orange)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Explore Our Events <span>→</span>
              </Link>
              <Link
                href="/contact"
                style={{
                  padding: "15px 36px",
                  borderRadius: 60,
                  background: "transparent",
                  color: "var(--white)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                Talk to Our Team
              </Link>
            </div>

            {/* Series color dots */}
            <div
              className="flex items-center justify-center flex-wrap gap-5"
              style={{ marginTop: 36 }}
            >
              {seriesData.map((s) => (
                <span key={s.id} className="flex items-center gap-2">
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: s.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {s.title}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING CTA — Always-visible pill that scrolls to the inquiry form
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// EVENT HIGHLIGHTS — Long-form video section
// ─────────────────────────────────────────────────────────────────────────────

const HIGHLIGHT_VIDEOS = [
  { id: "JA1X4cN2-t0", title: "Event Highlights" },
  { id: "-a481Lbz55o", title: "Event Highlights" },
  { id: "dbL42utoYW4", title: "Event Highlights" },
  { id: "gR-IUI7yJLg", title: "Event Highlights" },
  { id: "0d_2Itsg6ec", title: "Event Highlights" },
  { id: "wcEeU0UEl0o", title: "Event Highlights" },
  { id: "Bc3L3iTsaIg", title: "Event Highlights" },
  { id: "3uvw31I1tq8", title: "Event Highlights" },
  { id: "6H11mOM-aJc", title: "Event Highlights" },
  { id: "kjro4AVXUhM", title: "Event Highlights" },
  { id: "8xluYDV_07g", title: "Event Highlights" },
  { id: "ktsauwzmb-Q", title: "Event Highlights" },
  { id: "iFVU9upOXyM", title: "Event Highlights" },
  { id: "_ogyuzwQWYo", title: "Event Highlights" },
  { id: "j7g0eRb7hsQ", title: "Event Highlights" },
  { id: "Klt-iNu1g4g", title: "Event Highlights" },
];

const HIGHLIGHTS_INITIAL_SHOW = 6;

function HighlightVideoCard({
  videoId,
  index,
}: {
  videoId: string;
  index: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        aspectRatio: "16 / 9",
        background: "#111",
        cursor: isPlaying ? "default" : "pointer",
      }}
      onClick={() => !isPlaying && setIsPlaying(true)}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      ) : (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Events First Group event highlights video"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.3) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(232, 101, 26, 0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s, background 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.background = "rgba(255, 122, 46, 0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(232, 101, 26, 0.9)";
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="white"
                style={{ marginLeft: 2 }}
              >
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

function EventHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [showAll, setShowAll] = useState(false);

  const visibleVideos = showAll
    ? HIGHLIGHT_VIDEOS
    : HIGHLIGHT_VIDEOS.slice(0, HIGHLIGHTS_INITIAL_SHOW);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
        padding: "clamp(36px, 4.5vw, 52px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,101,26,0.03) 0%, transparent 60%)",
        }}
      />

      <div
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <SectionLabel text="From the Stage" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 3.5vw, 44px)",
            letterSpacing: "-1.5px",
            color: "var(--white)",
            lineHeight: 1.15,
            margin: "0 0 8px",
          }}
        >
          Event Highlights
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 300,
            fontSize: "clamp(14px, 1.2vw, 16px)",
            color: "#707070",
            lineHeight: 1.7,
            margin: "0 0 clamp(28px, 3.5vw, 44px)",
            maxWidth: 540,
          }}
        >
          Keynotes, panels, and conversations captured live from our events
          worldwide.
        </motion.p>

        <div
          className="events-highlights-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(12px, 2vw, 20px)",
          }}
        >
          <AnimatePresence mode="popLayout">
            {visibleVideos.map((video, i) => (
              <HighlightVideoCard
                key={video.id}
                videoId={video.id}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>

        {HIGHLIGHT_VIDEOS.length > HIGHLIGHTS_INITIAL_SHOW && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "clamp(28px, 3vw, 40px)",
            }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 500,
                color: "#E8651A",
                background: "rgba(232, 101, 26, 0.08)",
                border: "1px solid rgba(232, 101, 26, 0.2)",
                borderRadius: 100,
                padding: "12px 32px",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(232, 101, 26, 0.14)";
                e.currentTarget.style.borderColor =
                  "rgba(232, 101, 26, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(232, 101, 26, 0.08)";
                e.currentTarget.style.borderColor =
                  "rgba(232, 101, 26, 0.2)";
              }}
            >
              {showAll
                ? "Show Less"
                : `Show All ${HIGHLIGHT_VIDEOS.length} Videos`}
            </button>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .events-highlights-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .events-highlights-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  return (
    <div>
      <EventsHero />
      <EventsSeriesGrid />
      <SectionTransition variant="expand" />
      <HowDifferent />
      <SectionTransition variant="sweep" />
      <EventsImpact />
      <SectionTransition variant="sweep" />
      <TrustedBy />
      <SectionTransition variant="expand" />
      <EventsUpNext />
      <SectionTransition variant="sweep" />
      <PastEvents />
      <SectionTransition variant="sweep" />
      <MediaCoverage />
      <SectionTransition variant="expand" />
      <EventHighlights />
      <InquiryForm />
      <SectionTransition variant="sweep" />
      <Footer />
    </div>
  );
}
