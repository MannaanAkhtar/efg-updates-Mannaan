"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { COLORS, TYPOGRAPHY, ANIMATION, RADIUS, SHADOWS, SPACING } from "@/lib/cyber-design-tokens";

// Gallery images from actual event
const galleryImages = [
  {
    id: 1,
    src: "https://uae.cyberfirstseries.com/wp-content/uploads/2025/10/ARU00511.jpg",
    alt: "Cyber First UAE keynote",
    gridClass: "col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "https://uae.cyberfirstseries.com/wp-content/uploads/2025/10/ARU00500.jpg",
    alt: "Panel discussion",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://uae.cyberfirstseries.com/wp-content/uploads/2025/10/ARU01167.jpg",
    alt: "Networking session",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "https://uae.cyberfirstseries.com/wp-content/uploads/2025/10/ARU00574.jpg",
    alt: "Speaker presenting",
    gridClass: "col-span-1 row-span-2",
  },
  {
    id: 5,
    src: "https://uae.cyberfirstseries.com/wp-content/uploads/2025/10/ARU00722.jpg",
    alt: "Exhibition area",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: 6,
    src: "https://uae.cyberfirstseries.com/wp-content/uploads/2025/10/ARU00738.jpg",
    alt: "Audience",
    gridClass: "col-span-2 row-span-1",
  },
  {
    id: 7,
    src: "https://uae.cyberfirstseries.com/wp-content/uploads/2025/10/ARU00418.jpg",
    alt: "Awards ceremony",
    gridClass: "col-span-1 row-span-1",
    hideOnMobile: true,
  },
  {
    id: 8,
    src: "https://uae.cyberfirstseries.com/wp-content/uploads/2025/10/ARU01180.jpg",
    alt: "Closing remarks",
    gridClass: "col-span-1 row-span-1",
    hideOnMobile: true,
  },
];

export default function CyberFirstGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
          style={{ marginBottom: 48 }}
        >
          {/* Label */}
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: COLORS.cyan }} />
            <span
              style={{
                ...TYPOGRAPHY.sectionLabel,
                color: COLORS.cyan,
                fontFamily: TYPOGRAPHY.fontBody,
              }}
            >
              From Past Editions
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: TYPOGRAPHY.fontDisplay,
              fontWeight: 800,
              fontSize: "clamp(32px, 4vw, 52px)",
              letterSpacing: "-1.5px",
              color: COLORS.textPrimary,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            The Cyber First Experience
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              ...TYPOGRAPHY.bodyLarge,
              color: COLORS.textSecondary,
              maxWidth: 460,
              margin: "12px 0 0",
            }}
          >
            Moments captured from our conferences worldwide.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          className="cf-gallery-grid"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
        >
          {galleryImages.map((image) => (
            <GalleryImage
              key={image.id}
              image={image}
              isHovered={hoveredId === image.id}
              isAnyHovered={hoveredId !== null}
              onHover={() => setHoveredId(image.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginTop: 32,
          }}
        >
          <span
            style={{
              fontFamily: TYPOGRAPHY.fontBody,
              fontSize: 14,
              color: COLORS.textTertiary,
              fontWeight: 400,
            }}
          >
            Experience it yourself
          </span>
          <a
            href="#register"
            style={{
              padding: "12px 28px",
              borderRadius: RADIUS.round,
              background: "transparent",
              border: `1px solid ${COLORS.borderAccent}`,
              color: COLORS.cyan,
              fontFamily: TYPOGRAPHY.fontBody,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.cyanSubtle;
              e.currentTarget.style.borderColor = COLORS.cyan;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = COLORS.borderAccent;
            }}
          >
            Register for the Next Edition →
          </a>
        </div>
      </div>

      {/* Grid CSS */}
      <style jsx global>{`
        .cf-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .cf-gallery-grid .col-span-1 {
          grid-column: span 1;
        }
        .cf-gallery-grid .col-span-2 {
          grid-column: span 2;
        }
        .cf-gallery-grid .row-span-1 {
          grid-row: span 1;
        }
        .cf-gallery-grid .row-span-2 {
          grid-row: span 2;
        }

        @media (max-width: 1024px) {
          .cf-gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .cf-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .cf-gallery-grid .row-span-2 {
            grid-row: span 1;
          }
          .cf-gallery-grid .hidden-mobile {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * GalleryImage — Individual gallery cell with spotlight effect
 */
function GalleryImage({
  image,
  isHovered,
  isAnyHovered,
  onHover,
  onLeave,
}: {
  image: (typeof galleryImages)[0];
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const shouldDim = isAnyHovered && !isHovered;

  return (
    <motion.div
      className={`${image.gridClass} ${image.hideOnMobile ? "hidden-mobile" : ""}`}
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: ANIMATION.ease }}
      style={{
        position: "relative",
        borderRadius: RADIUS.lg,
        overflow: "hidden",
        cursor: "pointer",
        minHeight: image.gridClass.includes("row-span-2") ? 280 : 140,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover transition-all"
        style={{
          filter: isHovered
            ? "brightness(0.9) saturate(1.05)"
            : shouldDim
              ? "brightness(0.5) saturate(0.9)"
              : "brightness(0.75) saturate(0.9)",
          transform: isHovered ? "scale(1.04)" : "scale(1)",
          transitionDuration: "0.6s",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 50%)",
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.4s",
        }}
      />

      {/* Blue tint on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity"
        style={{
          background: COLORS.cyanSubtle,
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.4s",
        }}
      />
    </motion.div>
  );
}
