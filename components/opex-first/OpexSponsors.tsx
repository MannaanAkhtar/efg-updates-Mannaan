"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const VIOLET = "#7C3AED";
const EASE = [0.16, 1, 0.3, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";

const leadPartners: { name: string; logo: string | null }[] = [
  { name: "Celonis", logo: `${S3}/Celonis.png` },
  { name: "Bridge", logo: null },
  { name: "EY", logo: `${S3}/EY.png` },
];

const goldSponsors: { name: string; logo: string | null }[] = [
  { name: "Profit.co", logo: `${S3}/profit.co.png` },
  { name: "Botteq", logo: `${S3}/BOT-teq.png` },
  { name: "Cyborg", logo: `${S3}/Cyborg-automation-hub.png` },
  { name: "Red Sand", logo: `${S3}/redsand.png` },
];

const associateSponsors: { name: string; logo: string | null }[] = [
  { name: "ARIS", logo: `${S3}/aris.png` },
  { name: "SAP Signavio", logo: `${S3}/sap-signavio.png` },
  { name: "Blue Prism", logo: null },
  { name: "Moxo", logo: `${S3}/moxo.png` },
];

const consultingSponsors: { name: string; logo: string | null }[] = [
  { name: "Kafaa", logo: `${S3}/KAfaa.png` },
  { name: "Minds Advisory", logo: `${S3}/minds-advisory.png` },
  { name: "Agile MENA", logo: null },
];

const knowledgePartners: { name: string; logo: string | null }[] = [
  { name: "Abu Dhabi University", logo: `${S3}/abu-dhabi-university.png` },
  { name: "King Saud University", logo: null },
  { name: "ISRAR", logo: `${S3}/ISRAR.png` },
];

const mediaPartners: { name: string; logo: string | null }[] = [
  { name: "Gulf Business", logo: null },
  { name: "Trade Arabia", logo: null },
  { name: "Tahawul Tech", logo: null },
  { name: "GEC News", logo: null },
  { name: "Industry Events", logo: `${S3}/Industry-Events.png` },
  { name: "Economy Middle East", logo: null },
];

export default function OpexSponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
        padding: "clamp(36px, 4vw, 56px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(124,58,237,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
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
              Series Sponsors & Partners
            </span>
            <span style={{ width: 30, height: 1, background: VIOLET }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            Trusted by Industry Leaders
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 15,
              color: "#606060",
              maxWidth: 480,
              margin: "12px auto 0",
              lineHeight: 1.6,
            }}
          >
            20+ partners across technology, consulting, and academia powering
            operational excellence worldwide.
          </p>
        </motion.div>

        {/* ── Lead Partners (hero-size) ── */}
        <TierSection
          label="Lead Partners"
          isInView={isInView}
          delay={0.2}
        >
          <div
            className="opex-lead-grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${leadPartners.length}, 1fr)`,
              gap: 14,
            }}
          >
            {leadPartners.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 12 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                }
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: EASE }}
              >
                <LogoCard sponsor={s} size="lead" />
              </motion.div>
            ))}
          </div>
        </TierSection>

        {/* ── Gold ── */}
        <TierSection label="Gold" isInView={isInView} delay={0.35}>
          <div
            className="opex-tier-grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${goldSponsors.length}, 1fr)`,
              gap: 12,
            }}
          >
            {goldSponsors.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.96 }
                }
                transition={{ duration: 0.4, delay: 0.45 + i * 0.04, ease: EASE }}
              >
                <LogoCard sponsor={s} size="normal" />
              </motion.div>
            ))}
          </div>
        </TierSection>

        {/* ── Associate ── */}
        <TierSection label="Associate" isInView={isInView} delay={0.5}>
          <div
            className="opex-tier-grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${associateSponsors.length}, 1fr)`,
              gap: 12,
            }}
          >
            {associateSponsors.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.96 }
                }
                transition={{ duration: 0.4, delay: 0.6 + i * 0.04, ease: EASE }}
              >
                <LogoCard sponsor={s} size="normal" />
              </motion.div>
            ))}
          </div>
        </TierSection>

        {/* ── Consulting + Knowledge side by side ── */}
        <div
          className="opex-dual-tier"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            marginTop: 32,
          }}
        >
          <TierSection
            label="Consulting"
            isInView={isInView}
            delay={0.65}
            noMargin
          >
            <div
              className="opex-tier-grid-sm"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${consultingSponsors.length}, 1fr)`,
                gap: 10,
              }}
            >
              {consultingSponsors.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.75 + i * 0.04 }}
                >
                  <LogoCard sponsor={s} size="small" />
                </motion.div>
              ))}
            </div>
          </TierSection>

          <TierSection
            label="Knowledge"
            isInView={isInView}
            delay={0.7}
            noMargin
          >
            <div
              className="opex-tier-grid-sm"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${knowledgePartners.length}, 1fr)`,
                gap: 10,
              }}
            >
              {knowledgePartners.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.04 }}
                >
                  <LogoCard sponsor={s} size="small" />
                </motion.div>
              ))}
            </div>
          </TierSection>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            margin: "40px 0",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(124,58,237,0.12), transparent)",
          }}
        />

        {/* ── Media Partners ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#353535",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Media Partners
          </p>
          <div
            className="opex-media-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 10,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {mediaPartners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 1.0 + i * 0.03 }}
              >
                <LogoCard sponsor={partner} size="small" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
          style={{ textAlign: "center", marginTop: 40 }}
        >
          <SponsorCTA />
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .opex-lead-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .opex-tier-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .opex-dual-tier {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 768px) {
          .opex-lead-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .opex-tier-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .opex-tier-grid-sm {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .opex-media-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .opex-media-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Tier Section Wrapper ────────────────────────────────── */

function TierSection({
  label,
  children,
  isInView,
  delay,
  noMargin,
}: {
  label: string;
  children: React.ReactNode;
  isInView: boolean;
  delay: number;
  noMargin?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{ marginTop: noMargin ? 0 : 32 }}
    >
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: VIOLET,
          marginBottom: 14,
          opacity: 0.7,
        }}
      >
        {label}
      </p>
      {children}
    </motion.div>
  );
}

/* ─── Logo Card ───────────────────────────────────────────── */

function LogoCard({
  sponsor,
  size,
}: {
  sponsor: { name: string; logo: string | null };
  size: "lead" | "normal" | "small";
}) {
  const [isHovered, setIsHovered] = useState(false);

  const heights = { lead: 100, normal: 72, small: 56 };
  const logoSizes = { lead: 48, normal: 36, small: 26 };
  const radii = { lead: 16, normal: 12, small: 10 };

  return (
    <div
      className="flex items-center justify-center transition-all"
      style={{
        minHeight: heights[size],
        padding: size === "lead" ? "20px 24px" : size === "normal" ? "16px 20px" : "12px 14px",
        background: isHovered ? "rgba(255,255,255,0.03)" : "var(--black-card)",
        border: isHovered
          ? "1px solid rgba(124,58,237,0.12)"
          : "1px solid rgba(255,255,255,0.04)",
        borderRadius: radii[size],
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(124,58,237,0.04)"
          : "none",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
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
            maxHeight: logoSizes[size],
            maxWidth: size === "lead" ? 140 : size === "normal" ? 110 : 80,
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
            opacity: isHovered ? 0.7 : 0.4,
            transition: "opacity 0.4s",
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: size === "lead" ? 14 : size === "normal" ? 12 : 11,
            fontWeight: 700,
            letterSpacing: "1.5px",
            color: isHovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)",
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

/* ─── CTA ─────────────────────────────────────────────────── */

function SponsorCTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/sponsors-and-partners"
      className="inline-flex items-center gap-2 transition-all duration-300"
      style={{
        padding: "12px 28px",
        borderRadius: 50,
        border: isHovered
          ? `1px solid ${VIOLET}`
          : "1px solid rgba(124,58,237,0.25)",
        background: isHovered ? "rgba(124,58,237,0.08)" : "transparent",
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: 500,
        color: VIOLET,
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
