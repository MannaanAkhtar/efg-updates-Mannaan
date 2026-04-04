"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, SPACING, GRADIENTS, PREMIUM_IMAGES } from "@/lib/cyber-design-tokens";

// Conference elements with background images
const elements = [
  {
    id: "keynotes",
    title: "Keynotes & Panels",
    description:
      "High-level presentations and moderated discussions featuring CISOs, government leaders, and security practitioners.",
    image: PREMIUM_IMAGES.conferenceKeynote,
  },
  {
    id: "awards",
    title: "Awards Ceremony",
    description:
      "Recognizing excellence in cybersecurity, from innovative defenders to visionary leaders shaping the region.",
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80",
  },
  {
    id: "meetings",
    title: "1-on-1 Meetings",
    description:
      "Pre-scheduled face-to-face meetings between enterprise buyers and solution providers. Every meeting is curated.",
    image: PREMIUM_IMAGES.conferenceMeeting,
  },
  {
    id: "hackathon",
    title: "Hackathon & CTF",
    description:
      "Hands-on cybersecurity challenges testing real-world skills, from penetration testing to incident response.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  },
  {
    id: "networking",
    title: "Networking & Luncheons",
    description:
      "Structured networking sessions and sit-down luncheons designed to build lasting professional relationships.",
    image: PREMIUM_IMAGES.conferenceNetworking,
  },
  {
    id: "media",
    title: "Media & Live Broadcast",
    description:
      "Full media coverage including live streaming, post-event highlights, and industry press engagement.",
    image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&q=80",
  },
];

export default function ConferenceElements() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: COLORS.bgDeep,
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
          style={{ textAlign: "center", marginBottom: 48 }}
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
              The Experience
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
            Six Formats. One Outcome: You Leave Sharper.
          </h2>

          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.bodyLarge,
              color: COLORS.textTertiary,
              maxWidth: 520,
              margin: "14px auto 0",
            }}
          >
            Keynotes for strategy. Roundtables for honesty. 1-on-1s for deals.
            Every format exists because it earns its place.
          </p>
        </motion.div>

        {/* Elements Grid */}
        <div
          className="elements-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: SPACING.gridGapDefault,
          }}
        >
          {elements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.08,
                ease: ANIMATION.ease,
              }}
            >
              <ElementCard element={element} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .elements-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .elements-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * ElementCard, Photo-backed conference element card
 */
function ElementCard({
  element,
}: {
  element: (typeof elements)[0];
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: RADIUS.lg,
        border: `1px solid ${isHovered ? COLORS.borderAccent : COLORS.borderSubtle}`,
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: isHovered ? SHADOWS.cardHover : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={element.image}
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: isHovered
              ? "brightness(0.35) saturate(0.6)"
              : "brightness(0.2) saturate(0.4)",
            transform: isHovered ? "scale(1.06)" : "scale(1)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: GRADIENTS.cardOverlay,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        className="relative"
        style={{
          zIndex: 2,
          padding: 32,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <h3
          style={{
            fontFamily: TYPOGRAPHY.fontDisplay,
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.textPrimary,
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          {element.title}
        </h3>

        <p
          style={{
            fontFamily: TYPOGRAPHY.fontBody,
            fontSize: 14,
            fontWeight: 300,
            color: isHovered ? COLORS.textSecondary : COLORS.textTertiary,
            lineHeight: 1.65,
            marginTop: 8,
            transition: "color 0.3s",
          }}
        >
          {element.description}
        </p>
      </div>

      {/* Bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 2,
          background: COLORS.cyan,
          opacity: isHovered ? 0.6 : 0,
          transition: "opacity 0.4s",
          zIndex: 3,
        }}
      />
    </div>
  );
}
