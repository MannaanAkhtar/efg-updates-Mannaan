"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SPACING } from "@/lib/cyber-design-tokens";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";

// 2026 Sponsors, with S3 logo URLs
const sponsors2026: { name: string; logo: string | null }[] = [
  { name: "Google Cloud Security", logo: `${S3}/Google-Cloud-Security.png` },
  { name: "Anomali", logo: `${S3}/Anomali.png` },
  { name: "OPSWAT", logo: `${S3}/OPSWAT-logo.png` },
  { name: "Pentera", logo: `${S3}/PENTERA.png` },
  { name: "HWG", logo: `${S3}/hwg-here-we-go.png` },
  { name: "AmiViz", logo: `${S3}/AmiViz.png` },
  { name: "Tenable", logo: `${S3}/Tenable-logo.png` },
  { name: "Securonix", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/securonix.jpg" },
  { name: "Paramount", logo: `${S3}/Paramount.png` },
  { name: "Kron Technologies", logo: `${S3}/kron-technologies.png` },
  { name: "Appknox", logo: `${S3}/appknox.png` },
  { name: "Filigran", logo: `${S3}/filigran.png` },
  { name: "Corelight", logo: `${S3}/corelight.png` },
  { name: "ThreatLocker", logo: `${S3}/threatlocker.png` },
  { name: "Akamai", logo: `${S3}/Akamai.png` },
  { name: "SonicWall", logo: `${S3}/Sonicwall.png` },
  { name: "Gen-X Systems", logo: `${S3}/Gen-x-systems.png` },
  { name: "SecureB4", logo: `${S3}/secureb4.png` },
  { name: "Bureau Veritas", logo: `${S3}/bureau-veritas.png` },
  { name: "Cortelion", logo: `${S3}/cortelion.png` },
  { name: "Bitdefender", logo: `${S3}/bitdefender.png` },
  { name: "ManageEngine", logo: `${S3}/ManageEngine.png` },
  { name: "Beacon Red", logo: `${S3}/beacon-red.png` },
  { name: "DREAM", logo: `${S3}/DREAM.png` },
];

// Past Series Sponsors
const pastSponsors: { name: string; logo: string | null }[] = [
  { name: "Microsoft", logo: null },
  { name: "Palo Alto Networks", logo: `${S3}/paloalto.png` },
  { name: "Google Cloud", logo: `${S3}/Google-Cloud-Security.png` },
  { name: "Kaspersky", logo: `${S3}/kaspersky.png` },
  { name: "F5", logo: null },
  { name: "Fortinet", logo: `${S3}/fortinet.png` },
  { name: "CrowdStrike", logo: null },
  { name: "Corelight", logo: `${S3}/corelight.png` },
  { name: "Trustwave", logo: null },
  { name: "Gorilla", logo: `${S3}/Gorilla.png` },
  { name: "Immersive Labs", logo: null },
  { name: "Ingram", logo: null },
  { name: "SecurityScorecard", logo: null },
  { name: "CyberTalents", logo: `${S3}/cyber-talents.png` },
  { name: "ManageEngine", logo: `${S3}/ManageEngine.png` },
  { name: "AmiViz", logo: `${S3}/AmiViz.png` },
  { name: "ExtraHop", logo: null },
];

// Media Partners
const mediaPartners: { name: string; logo: string | null }[] = [
  { name: "Dark Reading", logo: `${S3}/Dark-Reading.png` },
  { name: "The Hacker News", logo: `${S3}/The-Hacker-News.jpg` },
  { name: "CSO Online", logo: `${S3}/CSO-Online.png` },
  { name: "Help Net Security", logo: `${S3}/Help-Net-Security.png` },
  { name: "Infosecurity Magazine", logo: `${S3}/Infosecurity-Magazine.png` },
  { name: "SC Media", logo: `${S3}/SC-Media.png` },
  { name: "Cyber Defense Magazine", logo: `${S3}/Cyber-Defense-Magazi.png` },
  { name: "Industrial Cyber", logo: `${S3}/Industrial-Cyber.png` },
  { name: "Security Middle East", logo: `${S3}/Security-Middle-East.png` },
  { name: "Industry Events", logo: `${S3}/Industry-Events.png` },
  { name: "Control Engineering", logo: `${S3}/Control-Engineering.png` },
  { name: "Cybersecurity Insiders", logo: `${S3}/Cybersecurity-Insiders.png` },
];

export default function SponsorsWall() {
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
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
            <span
              style={{
                ...TYPOGRAPHY.sectionLabel,
                color: COLORS.cyan,
                fontFamily: TYPOGRAPHY.fontBody,
              }}
            >
              Series Sponsors
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
            Trusted by the Brands That Matter
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
            50+ technology leaders and security vendors have partnered with
            Cyber First to reach the most senior security audience.
          </p>
        </motion.div>

        {/* 2026 Sponsors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.sectionLabel,
              color: COLORS.textMuted,
              marginBottom: 16,
            }}
          >
            2026 Sponsors
          </p>
          <div
            className="sponsors-grid-2026"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: SPACING.gridGapSmall,
            }}
          >
            {sponsors2026.map((sponsor, index) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.02,
                  ease: ANIMATION.ease,
                }}
              >
                <SponsorCard sponsor={sponsor} size="normal" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Past Sponsors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ marginTop: 48 }}
        >
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.sectionLabel,
              color: COLORS.textMuted,
              marginBottom: 16,
              opacity: 0.7,
            }}
          >
            Past Series Sponsors
          </p>
          <div
            className="sponsors-grid-past"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 10,
            }}
          >
            {pastSponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.9 + index * 0.02,
                }}
              >
                <SponsorCard sponsor={sponsor} size="small" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Media Partners */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          style={{ marginTop: 48 }}
        >
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: COLORS.textMuted,
              marginBottom: 16,
            }}
          >
            Media Partners
          </p>
          <div
            className="media-partners-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: SPACING.gridGapSmall,
            }}
          >
            {mediaPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 1.2 + index * 0.02,
                }}
              >
                <SponsorCard sponsor={partner} size="small" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 1.4, ease: ANIMATION.ease }}
          style={{ marginTop: 48, textAlign: "center" }}
        >
          <SponsorCTA />
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .sponsors-grid-2026 {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .sponsors-grid-past {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .media-partners-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .sponsors-grid-2026 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .sponsors-grid-past {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .media-partners-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .sponsors-grid-2026 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .sponsors-grid-past {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .media-partners-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * SponsorCard, Logo card with grayscale-to-color hover
 * Falls back to text name if no logo URL available
 */
function SponsorCard({
  sponsor,
  size,
}: {
  sponsor: { name: string; logo: string | null };
  size: "normal" | "small";
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-center transition-all"
      style={{
        background: isHovered && sponsor.logo
          ? "rgba(255, 255, 255, 0.9)"
          : COLORS.bgCard,
        border: isHovered
          ? `1px solid ${COLORS.borderAccent}`
          : `1px solid ${COLORS.borderSubtle}`,
        borderRadius: size === "normal" ? RADIUS.md : RADIUS.sm,
        padding: size === "normal" ? "20px 24px" : "12px 16px",
        minHeight: size === "normal" ? 80 : 56,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "default",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {sponsor.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          style={{
            maxWidth: size === "normal" ? 120 : 90,
            maxHeight: size === "normal" ? 36 : 28,
            objectFit: "contain",
            filter: isHovered ? "none" : "brightness(0) invert(1)",
            opacity: isHovered ? 1 : 0.5,
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: TYPOGRAPHY.fontDisplay,
            fontSize: size === "normal" ? 13 : 11,
            fontWeight: 700,
            letterSpacing: "1.5px",
            color: isHovered ? COLORS.bgDeep : `${COLORS.textPrimary}80`,
            textTransform: "uppercase",
            textAlign: "center",
            transition: "color 0.4s",
          }}
        >
          {sponsor.name}
        </span>
      )}
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
        padding: "14px 32px",
        borderRadius: RADIUS.round,
        border: isHovered
          ? `1px solid ${COLORS.cyan}`
          : `1px solid ${COLORS.borderAccent}`,
        background: isHovered ? COLORS.cyanSubtle : "transparent",
        fontFamily: TYPOGRAPHY.fontBody,
        fontSize: 14,
        fontWeight: 500,
        color: COLORS.cyan,
        transitionDuration: "0.4s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>Sponsor the Next Edition</span>
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
