"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, SPACING } from "@/lib/cyber-design-tokens";

// Speaker data matched from Supabase (Cyber First UAE)
const speakers = [
  {
    id: 1,
    name: "H.E. Dr. Mohamed Al Kuwaiti",
    title: "Head of Cyber Security",
    organization: "UAE Government",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/dr-mohamed-hamad-al-kuwaiti.jpg",
  },
  {
    id: 2,
    name: "Sara Al Hosani",
    title: "Director Cyber Threat Intelligence",
    organization: "Department of Government Enablement",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Cyber-First-uae/Sara-Al-Hosani.jpg",
  },
  {
    id: 3,
    name: "Hussain Al Khalsan",
    title: "CISO",
    organization: "Zand Bank",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Cyber-First-uae/Hussain-Al-Khalsan.jpg",
  },
  {
    id: 4,
    name: "Bernard Assaf",
    title: "Regional CISO",
    organization: "Airbus",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Cyber-First-uae/Bernard-Assaf.png",
  },
  {
    id: 5,
    name: "James Wiles",
    title: "Head of Cyber Security MEA",
    organization: "Cigna Healthcare",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Cyber-First-uae/James-Wiles.jpg",
  },
  {
    id: 6,
    name: "Dr. Ebrahim Al Alkeem",
    title: "National Risk and Policy Director",
    organization: "Executive Office of AML & CTF, UAE Government",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/Dr-Ebrahim-Al-Alkeem-Al-Zaabi.jpg",
  },
  {
    id: 7,
    name: "Toufeeq Ahmed",
    title: "Group Head Cyber Security",
    organization: "Gargash Group",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Cyber-First-uae/Toufeeq-Ahmed.jpg",
  },
  {
    id: 8,
    name: "Abdulwahab Algamhi",
    title: "Senior Director Information Security",
    organization: "Miral",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Cyber-First-uae/Abdulwahab-Al-Gamhi.jpg",
  },
];

export default function FeaturedSpeakers() {
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
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
            <span
              style={{
                ...TYPOGRAPHY.sectionLabel,
                color: COLORS.cyan,
                fontFamily: TYPOGRAPHY.fontBody,
              }}
            >
              Speakers
            </span>
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              ...TYPOGRAPHY.sectionTitle,
              color: COLORS.textPrimary,
              margin: "16px 0 0",
            }}
          >
            Past Speakers. Future Peers.
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.bodyLarge,
              color: COLORS.textTertiary,
              maxWidth: 520,
              margin: "14px auto 0",
            }}
          >
            Government heads, enterprise CISOs, and global security architects
           , the people who don&rsquo;t just attend conferences, they define them.
          </p>
        </motion.div>

        {/* Speakers Grid */}
        <div
          className="speakers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: SPACING.gridGapDefault,
          }}
        >
          {speakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.06,
                ease: ANIMATION.ease,
              }}
            >
              <SpeakerCard speaker={speaker} />
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.8, ease: ANIMATION.ease }}
          className="text-center"
          style={{ marginTop: 32 }}
        >
          <ViewAllLink />
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .speakers-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * SpeakerCard, Premium speaker card with photo
 */
function SpeakerCard({
  speaker,
}: {
  speaker: (typeof speakers)[0];
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="transition-all"
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${isHovered ? COLORS.borderAccent : COLORS.borderSubtle}`,
        borderRadius: RADIUS.lg,
        overflow: "hidden",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? SHADOWS.cardHover : "none",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={speaker.image}
          alt={speaker.name}
          className="w-full h-full object-cover"
          style={{
            filter: isHovered
              ? "brightness(0.9) saturate(1)"
              : "brightness(0.7) saturate(0)",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${COLORS.bgCard} 0%, rgba(18,21,26,0.4) 40%, transparent 70%)`,
          }}
        />

        {/* Blue accent line at bottom on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-opacity"
          style={{
            height: 2,
            background: COLORS.cyan,
            opacity: isHovered ? 0.8 : 0,
            transitionDuration: "0.4s",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "16px 20px 20px" }}>
        <h3
          style={{
            fontFamily: TYPOGRAPHY.fontDisplay,
            fontSize: 16,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: "-0.2px",
            margin: 0,
          }}
        >
          {speaker.name}
        </h3>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontBody,
            fontSize: 13,
            fontWeight: 400,
            color: COLORS.textTertiary,
            lineHeight: 1.4,
            marginTop: 4,
          }}
        >
          {speaker.title}
        </p>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontBody,
            fontSize: 13,
            fontWeight: 500,
            color: `${COLORS.cyan}B3`,
            marginTop: 4,
          }}
        >
          {speaker.organization}
        </p>
      </div>
    </div>
  );
}

/**
 * ViewAllLink, Link to full speakers page
 */
function ViewAllLink() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/speakers"
      className="inline-flex items-center gap-1.5 transition-colors"
      style={{
        fontFamily: TYPOGRAPHY.fontBody,
        fontSize: 14,
        fontWeight: 500,
        color: COLORS.cyan,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>See the Full Kuwait 2026 Lineup</span>
      <span
        className="transition-transform duration-300"
        style={{
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
        }}
      >
        →
      </span>
    </Link>
  );
}
