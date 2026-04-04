"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const OT_CRIMSON = "#D34B9A";

// Partner tiers with logos from otsecurityfirst.com
const partnerTiers = [
  {
    tier: "Patronage",
    partners: [
      {
        name: "ENOC",
        logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/enoc-logo.png",
      },
    ],
  },
  {
    tier: "Knowledge Partner",
    partners: [
      {
        name: "IBM",
        logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/ibm-logo.png",
      },
    ],
  },
  {
    tier: "Supporting Partners",
    partners: [
      {
        name: "Claroty",
        logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/claroty-logo.png",
      },
      {
        name: "Dragos",
        logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/dragos-logo.png",
      },
      {
        name: "Nozomi Networks",
        logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/nozomi-logo.png",
      },
      {
        name: "Fortinet",
        logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/fortinet-logo.png",
      },
      {
        name: "Tenable",
        logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/tenable-logo.png",
      },
      {
        name: "OPSWAT",
        logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/opswat-logo.png",
      },
    ],
  },
  {
    tier: "Community Partner",
    partners: [
      {
        name: "ICS-CERT UAE",
        logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/ics-cert-logo.png",
      },
    ],
  },
];

// Media partners
const mediaPartners = [
  { name: "Industrial Cyber", logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/industrial-cyber-logo.png" },
  { name: "Control Engineering", logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/control-eng-logo.png" },
  { name: "SC Media", logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/sc-media-logo.png" },
  { name: "Dark Reading", logo: "https://otsecurityfirst.com/wp-content/uploads/2026/01/dark-reading-logo.png" },
];

export default function OTSponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
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
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 2, background: OT_CRIMSON }} />
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
              Our Partners
            </span>
            <span style={{ width: 30, height: 2, background: OT_CRIMSON }} />
          </div>

          {/* Title */}
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
            Trusted by
            <br />
            <span style={{ color: OT_CRIMSON }}>Industry Leaders</span>
          </h2>
        </motion.div>

        {/* Partner Tiers */}
        {partnerTiers.map((tierData, tierIndex) => (
          <motion.div
            key={tierData.tier}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + tierIndex * 0.15 }}
            style={{ marginBottom: tierIndex < partnerTiers.length - 1 ? 32 : 0 }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: tierIndex === 0 ? OT_CRIMSON : "#555",
                marginBottom: 16,
              }}
            >
              {tierData.tier}
            </p>
            <div
              className={tierData.partners.length <= 2 ? "flex justify-center gap-4" : "partners-grid"}
              style={
                tierData.partners.length > 2
                  ? {
                      display: "grid",
                      gridTemplateColumns: `repeat(${Math.min(tierData.partners.length, 4)}, 1fr)`,
                      gap: 12,
                    }
                  : undefined
              }
            >
              {tierData.partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.96 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + tierIndex * 0.15 + index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <PartnerCard
                    partner={partner}
                    isPrimary={tierIndex === 0}
                    isLarge={tierData.partners.length <= 2}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* As Featured In, Press & Media */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{
            marginTop: 48,
            padding: "32px 0",
            borderTop: `1px solid ${OT_CRIMSON}10`,
          }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 24 }}>
            <span style={{ width: 30, height: 1, background: `${OT_CRIMSON}40` }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#555",
              }}
            >
              As Featured In
            </span>
            <span style={{ width: 30, height: 1, background: `${OT_CRIMSON}40` }} />
          </div>
          <div
            className="media-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {mediaPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{
                  duration: 0.4,
                  delay: 0.8 + index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <MediaPartnerCard partner={partner} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: 40, textAlign: "center" }}
        >
          <SponsorCTA />
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .sponsors-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .sponsors-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 900px) {
          .media-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .media-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * PartnerCard, Individual partner with logo
 */
function PartnerCard({
  partner,
  isPrimary = false,
  isLarge = false,
}: {
  partner: { name: string; logo: string };
  isPrimary?: boolean;
  isLarge?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center transition-all"
      style={{
        background: isPrimary ? `${OT_CRIMSON}08` : "var(--black-card)",
        border: isHovered
          ? `1px solid ${OT_CRIMSON}30`
          : isPrimary
            ? `1px solid ${OT_CRIMSON}20`
            : "1px solid rgba(255, 255, 255, 0.04)",
        borderRadius: 10,
        padding: isLarge ? "32px 40px" : "24px 20px",
        minHeight: isLarge ? 100 : 80,
        minWidth: isLarge ? 200 : undefined,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "default",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left edge highlight */}
      <div
        className="absolute left-0 top-3 bottom-3 transition-all"
        style={{
          width: 3,
          background: OT_CRIMSON,
          opacity: isHovered ? 1 : 0,
          borderRadius: 2,
          transitionDuration: "0.3s",
        }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.logo}
        alt={partner.name}
        style={{
          maxHeight: isLarge ? 48 : 36,
          maxWidth: "100%",
          objectFit: "contain",
          filter: isHovered ? "brightness(1)" : "brightness(0.7)",
          opacity: isHovered ? 1 : 0.7,
          transition: "all 0.3s",
        }}
      />
    </div>
  );
}

/**
 * MediaPartnerCard, Smaller media partner card with logo
 */
function MediaPartnerCard({ partner }: { partner: { name: string; logo: string } }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-center transition-all"
      style={{
        background: "#141414",
        border: "1px solid rgba(255, 255, 255, 0.03)",
        borderRadius: 8,
        padding: "16px 20px",
        minHeight: 56,
        opacity: isHovered ? 0.9 : 0.6,
        cursor: "default",
        transitionDuration: "0.3s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.logo}
        alt={partner.name}
        style={{
          maxHeight: 24,
          maxWidth: "100%",
          objectFit: "contain",
          filter: isHovered ? "brightness(1)" : "brightness(0.6)",
          transition: "all 0.3s",
        }}
      />
    </div>
  );
}

/**
 * SponsorCTA, Become a sponsor button
 */
function SponsorCTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/sponsors-and-partners"
      className="inline-flex items-center gap-2 transition-all"
      style={{
        padding: "14px 28px",
        borderRadius: 6,
        border: isHovered
          ? `1px solid ${OT_CRIMSON}`
          : `1px solid ${OT_CRIMSON}40`,
        background: isHovered ? `${OT_CRIMSON}15` : "transparent",
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: 500,
        color: OT_CRIMSON,
        transitionDuration: "0.4s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>Become a Sponsor</span>
      <span
        className="transition-transform"
        style={{
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
          transitionDuration: "0.3s",
        }}
      >
        →
      </span>
    </Link>
  );
}
