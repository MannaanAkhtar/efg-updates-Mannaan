"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, SPACING, GRADIENTS, PREMIUM_IMAGES } from "@/lib/cyber-design-tokens";

// Flagship — the upcoming edition
const flagship = {
  id: "kuwait",
  city: "Kuwait City",
  country: "Kuwait",
  image: PREMIUM_IMAGES.kuwaitCity,
  edition: "3rd Edition",
  date: new Date("2026-04-21T09:00:00"),
  dateString: "April 21, 2026",
  venue: "Jumeirah Messilah Beach Hotel",
  href: "/events/cyber-first/kuwait-2026",
  external: false,
};

// Supporting editions
const supporting = [
  {
    id: "uae",
    city: "Abu Dhabi",
    country: "UAE",
    image: PREMIUM_IMAGES.abuDhabi,
    status: "completed" as const,
    edition: "2nd Edition",
    dateString: "Feb 3, 2026",
    venue: "Rosewood Abu Dhabi",
    stat: "380+ Leaders",
    href: "https://uae.cyberfirstseries.com/",
    external: true,
  },
  {
    id: "india",
    city: "New Delhi",
    country: "India",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
    status: "upcoming" as const,
    edition: "1st Edition",
    dateString: "Jun 11, 2026",
    venue: "Delhi",
    stat: null,
    href: "/events/cyber-first/india-2026",
    external: false,
  },
  {
    id: "kenya",
    city: "Nairobi",
    country: "Kenya",
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=600&q=80",
    status: "upcoming" as const,
    edition: "1st Edition",
    dateString: "Jun 2026",
    venue: "Nairobi",
    stat: null,
    href: "/events/cyber-first/kenya-2026",
    external: false,
  },
];

export default function EditionsMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: COLORS.bgBase,
        padding: `${SPACING.sectionPadding} 0`,
      }}
    >
      <div
        style={{
          maxWidth: SPACING.maxWidth,
          margin: "0 auto",
          padding: `0 ${SPACING.containerPadding}`,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: ANIMATION.ease }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
            <span
              style={{
                ...TYPOGRAPHY.sectionLabel,
                color: COLORS.cyan,
                fontFamily: TYPOGRAPHY.fontBody,
              }}
            >
              Editions
            </span>
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
          </div>

          <h2
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              ...TYPOGRAPHY.sectionTitle,
              color: COLORS.textPrimary,
              margin: "16px 0 0",
            }}
          >
            Choose Your City. Join the Same Room.
          </h2>
        </motion.div>

        {/* Flagship Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.15, ease: ANIMATION.ease }}
        >
          <FlagshipCard />
        </motion.div>

        {/* Supporting Editions Row */}
        <div
          className="editions-supporting"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            marginTop: 24,
          }}
        >
          {supporting.map((edition, index) => (
            <motion.div
              key={edition.id}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{
                duration: 0.6,
                delay: 0.4 + index * 0.1,
                ease: ANIMATION.ease,
              }}
            >
              <SupportingCard edition={edition} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .editions-supporting {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * FlagshipCard — Cinematic wide banner for the upcoming edition
 */
function FlagshipCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [daysUntil, setDaysUntil] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = flagship.date.getTime() - Date.now();
      setDaysUntil(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, []);

  const Wrapper = flagship.external ? "a" : Link;
  const linkProps = flagship.external
    ? { href: flagship.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: flagship.href };

  return (
    <Wrapper
      {...linkProps}
      className="flagship-card relative block overflow-hidden"
      style={{
        borderRadius: RADIUS.xl,
        border: isHovered
          ? `1px solid ${COLORS.borderAccentHover}`
          : `1px solid ${COLORS.borderAccent}`,
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: isHovered
          ? `${SHADOWS.xl}, 0 0 80px ${COLORS.cyanSubtle}`
          : "none",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        textDecoration: "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={flagship.image}
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: isHovered
              ? "brightness(0.3) saturate(0.7)"
              : "brightness(0.18) saturate(0.4)",
            transform: isHovered ? "scale(1.04)" : "scale(1)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${COLORS.bgDeep}F2 0%, ${COLORS.bgDeep}80 50%, ${COLORS.bgDeep}4D 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${COLORS.bgDeep}CC 0%, transparent 40%)`,
        }}
      />

      {/* Ambient Cyan Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -60,
          right: "15%",
          width: 300,
          height: 200,
          background: `radial-gradient(ellipse, ${isHovered ? COLORS.cyanSubtle : "rgba(1, 187, 245, 0.04)"} 0%, transparent 70%)`,
          transition: "all 0.6s",
          filter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flagship-content"
        style={{
          padding: "clamp(36px, 5vw, 56px) clamp(32px, 5vw, 56px)",
          minHeight: "clamp(260px, 28vw, 380px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Upcoming Badge */}
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ background: COLORS.cyan }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: COLORS.cyan }}
            />
          </span>
          <span
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.sectionLabel,
              color: COLORS.cyan,
            }}
          >
            Next Edition
          </span>
        </div>

        {/* City Name */}
        <h3
          style={{
            fontFamily: TYPOGRAPHY.fontDisplay,
            fontWeight: 800,
            fontSize: "clamp(36px, 4.5vw, 60px)",
            letterSpacing: "-2px",
            color: COLORS.textPrimary,
            lineHeight: 1,
            margin: 0,
          }}
        >
          {flagship.city}
        </h3>

        {/* Details Row */}
        <div
          className="flex flex-wrap items-center gap-2"
          style={{ marginTop: 12 }}
        >
          {[
            flagship.edition,
            flagship.dateString,
            flagship.venue,
          ].map((item, i, arr) => (
            <span key={item} className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: TYPOGRAPHY.fontBody,
                  fontSize: 15,
                  fontWeight: 400,
                  color: COLORS.textSecondary,
                }}
              >
                {item}
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: COLORS.textMuted }}>&middot;</span>
              )}
            </span>
          ))}
        </div>

        {/* Countdown + CTA Row */}
        <div
          className="flex flex-wrap items-center gap-6"
          style={{ marginTop: 20 }}
        >
          {/* Countdown */}
          <span
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              fontWeight: 800,
              fontSize: "clamp(18px, 2vw, 24px)",
              color: COLORS.cyan,
              letterSpacing: "-0.5px",
            }}
          >
            IN {daysUntil} DAYS
          </span>

          {/* Register CTA */}
          <span
            className="inline-flex items-center gap-2 transition-all"
            style={{
              padding: "10px 24px",
              borderRadius: RADIUS.round,
              background: isHovered ? COLORS.cyanSubtle : "rgba(1, 187, 245, 0.06)",
              border: isHovered
                ? `1px solid ${COLORS.cyan}`
                : `1px solid ${COLORS.borderAccent}`,
              fontFamily: TYPOGRAPHY.fontBody,
              fontSize: 13,
              fontWeight: 500,
              color: COLORS.cyan,
              transitionDuration: "0.4s",
            }}
          >
            Explore Kuwait 2026
            <span
              className="transition-transform"
              style={{
                transform: isHovered ? "translateX(3px)" : "translateX(0)",
                transitionDuration: "0.3s",
              }}
            >
              →
            </span>
          </span>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 3,
          background: GRADIENTS.cyanLine,
          opacity: isHovered ? 0.8 : 0.3,
          transition: "opacity 0.4s",
        }}
      />
    </Wrapper>
  );
}

/**
 * SupportingCard — Compact card for completed / planned editions
 */
function SupportingCard({
  edition,
}: {
  edition: (typeof supporting)[0];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = edition.status === "completed";
  const isUpcoming = edition.status === "upcoming";

  const CardWrapper = edition.external ? "a" : Link;
  const cardLinkProps = edition.external
    ? { href: edition.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: edition.href };

  return (
    <CardWrapper
      {...cardLinkProps}
      className="relative block overflow-hidden transition-all"
      style={{
        borderRadius: RADIUS.md,
        border: isHovered
            ? `1px solid ${COLORS.borderAccent}`
            : `1px solid ${COLORS.borderSubtle}`,
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: isHovered ? SHADOWS.cardHover : "none",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={edition.image}
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: isHovered
              ? `brightness(0.3) saturate(${isCompleted ? "0.3" : "0.6"})`
              : `brightness(0.15) saturate(${isCompleted ? "0" : "0.3"})`,
            transform: isHovered ? "scale(1.06)" : "scale(1)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: GRADIENTS.cardOverlay,
        }}
      />

      {/* Content */}
      <div
        className="relative z-10"
        style={{
          padding: "clamp(20px, 3vw, 28px)",
          minHeight: "clamp(140px, 14vw, 180px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Status */}
        <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          {isCompleted && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              style={{ opacity: 1 }}
            >
              <circle cx="8" cy="8" r="7" stroke={COLORS.cyan} strokeWidth="1.5" />
              <path
                d="M5 8L7 10L11 6"
                stroke={COLORS.cyan}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {isUpcoming && (
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                style={{ background: COLORS.cyan }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ background: COLORS.cyan }}
              />
            </span>
          )}
          <span
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: isCompleted || isUpcoming ? `${COLORS.cyan}99` : COLORS.textMuted,
            }}
          >
            {isCompleted ? "Completed" : isUpcoming ? "Upcoming" : "Announcing Soon"}
          </span>
        </div>

        {/* City */}
        <h3
          style={{
            fontFamily: TYPOGRAPHY.fontDisplay,
            fontWeight: 800,
            fontSize: "clamp(20px, 2.2vw, 28px)",
            letterSpacing: "-0.5px",
            color: COLORS.textPrimary,
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {edition.city}
          <span
            style={{
              fontWeight: 400,
              fontSize: "0.6em",
              color: COLORS.textSecondary,
              marginLeft: 8,
            }}
          >
            {edition.country}
          </span>
        </h3>

        {/* Info line */}
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontBody,
            fontSize: 13,
            fontWeight: 300,
            color: COLORS.textTertiary,
            marginTop: 4,
          }}
        >
          {edition.edition} &middot; {edition.dateString}
          {edition.venue && ` · ${edition.venue}`}
        </p>

        {/* Stat for completed */}
        {isCompleted && edition.stat && (
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              fontSize: 12,
              fontWeight: 500,
              color: `${COLORS.cyan}80`,
              marginTop: 6,
            }}
          >
            {edition.stat}
          </p>
        )}

        {/* Hover arrow */}
        <span
          className="transition-all"
          style={{
            fontFamily: TYPOGRAPHY.fontBody,
            fontSize: 12,
            fontWeight: 500,
            color: COLORS.cyan,
            marginTop: 8,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(-6px)",
            transitionDuration: "0.3s",
          }}
        >
          {isCompleted ? "View Recap" : isUpcoming ? "Visit Event Site" : "Learn More"}{" "}
          {edition.external ? "↗" : "→"}
        </span>
      </div>

      {/* Bottom accent */}
      {(isCompleted || isUpcoming) && (
        <div
          className="absolute bottom-0 left-0 right-0 transition-opacity"
          style={{
            height: 2,
            background: COLORS.cyan,
            opacity: isHovered ? 0.5 : 0,
            transitionDuration: "0.4s",
          }}
        />
      )}
    </CardWrapper>
  );
}
