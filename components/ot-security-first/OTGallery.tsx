"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const OT_CRIMSON = "#D34B9A";
const EASE = [0.16, 1, 0.3, 1] as const;

// Gallery photos
const galleryItems = [
  {
    id: 1,
    aspect: "wide" as const,
    label: "Event Overview",
    image:
      "https://otsecurityfirst.com/wp-content/uploads/2025/10/overview1@2x-1024x534.png",
  },
  {
    id: 2,
    aspect: "tall" as const,
    label: "Keynote Session",
    image:
      "https://otsecurityfirst.com/wp-content/uploads/2026/01/keynote1.jpg",
  },
  {
    id: 3,
    aspect: "square" as const,
    label: "Panel Discussion",
    image:
      "https://otsecurityfirst.com/wp-content/uploads/2026/01/panel1.jpg",
  },
  {
    id: 4,
    aspect: "square" as const,
    label: "Networking",
    image:
      "https://otsecurityfirst.com/wp-content/uploads/2026/01/networking1.jpg",
  },
  {
    id: 5,
    aspect: "wide" as const,
    label: "Exhibition Floor",
    image:
      "https://otsecurityfirst.com/wp-content/uploads/2026/01/exhibition1.jpg",
  },
  {
    id: 6,
    aspect: "tall" as const,
    label: "Technical Demo",
    image:
      "https://otsecurityfirst.com/wp-content/uploads/2026/01/demo1.jpg",
  },
  {
    id: 7,
    aspect: "square" as const,
    label: "CISO Roundtable",
    image:
      "https://otsecurityfirst.com/wp-content/uploads/2026/01/roundtable1.jpg",
  },
  {
    id: 8,
    aspect: "square" as const,
    label: "Vendor Showcase",
    image:
      "https://otsecurityfirst.com/wp-content/uploads/2026/01/vendor1.jpg",
  },
];


// Compact agenda
const agenda = [
  { time: "09:00", title: "Registration & Networking Coffee", type: "break" },
  { time: "09:30", title: "Opening Keynote Address", type: "keynote" },
  {
    time: "10:15",
    title: "Panel: The OT Threat Landscape in 2026",
    type: "panel",
  },
  { time: "11:00", title: "Coffee Break & Exhibition", type: "break" },
  {
    time: "11:30",
    title: "CISO Roundtable: IT/OT Convergence",
    type: "roundtable",
  },
  {
    time: "12:15",
    title: "Live Demo: OT Attack Simulation",
    type: "demo",
  },
  { time: "13:00", title: "Networking Lunch", type: "break" },
  {
    time: "14:00",
    title: "Panel: Zero Trust for Industrial Systems",
    type: "panel",
  },
  {
    time: "14:45",
    title: "Closing Keynote & Awards Ceremony",
    type: "keynote",
  },
];

export default function OTGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black-light)",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Diagonal grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(211,75,154,0.04) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(211,75,154,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      {/* Crimson glow — center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${OT_CRIMSON}0A 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative" as const,
          zIndex: 1,
        }}
      >
        {/* ─── GALLERY ─── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 40 }}
        >
          <div className="flex items-center gap-3">
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
              Event Gallery
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 40px)",
              letterSpacing: "-1px",
              color: "var(--white)",
              lineHeight: 1.15,
              margin: "16px 0 0",
            }}
          >
            Moments from
            <br />
            <span style={{ color: OT_CRIMSON }}>Previous Editions</span>
          </h2>
        </motion.div>

        {/* Gallery Masonry Grid */}
        <div
          className="gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "150px",
            gap: 12,
          }}
        >
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.96 }
              }
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.08,
                ease: EASE,
              }}
              style={{
                gridColumn: item.aspect === "wide" ? "span 2" : "span 1",
                gridRow: item.aspect === "tall" ? "span 2" : "span 1",
              }}
            >
              <GalleryCard item={item} />
            </motion.div>
          ))}
        </div>

        {/* ─── VIDEO HIGHLIGHTS — Coming Soon ─── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          style={{ marginTop: 56 }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
            <span style={{ width: 20, height: 1, background: OT_CRIMSON }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#686868",
              }}
            >
              Event Highlights
            </span>
          </div>

          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              aspectRatio: "16 / 9",
              borderRadius: 10,
              background: "#111111",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {/* Muted play icon */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                background: `${OT_CRIMSON}15`,
                border: `1px solid ${OT_CRIMSON}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="24"
                viewBox="0 0 24 28"
                fill="none"
                style={{ marginLeft: 2 }}
              >
                <path
                  d="M22 14L2 26V2L22 14Z"
                  fill={OT_CRIMSON}
                  opacity={0.4}
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 500,
                color: "#686868",
                margin: 0,
              }}
            >
              Event Highlights Video — Coming Soon
            </p>
          </div>
        </motion.div>

        {/* ─── COMPACT AGENDA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          style={{ marginTop: 40 }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
            <span style={{ width: 20, height: 1, background: OT_CRIMSON }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#686868",
              }}
            >
              Abu Dhabi 2026 · Day Schedule
            </span>
          </div>

          <div
            style={{
              background: "#111111",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: 10,
              padding: "clamp(16px, 2vw, 24px)",
            }}
          >
            {agenda.map((item, index) => (
              <AgendaRow key={index} item={item} isLast={index === agenda.length - 1} />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginTop: 40 }}
        >
          <a
            href="#register"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 500,
              color: OT_CRIMSON,
              textDecoration: "none",
              letterSpacing: "0.5px",
            }}
          >
            Be Part of the Next Edition →
          </a>
        </motion.div>

        {/* Gallery note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            color: "#606060",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          More photos from Abu Dhabi 2026 coming soon.
        </motion.p>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 120px !important;
          }
        }
        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 150px !important;
          }
          .gallery-grid > div {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * GalleryCard — Individual gallery image card
 */
function GalleryCard({
  item,
}: {
  item: (typeof galleryItems)[0];
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-full overflow-hidden transition-all group"
      style={{
        border: isHovered
          ? `1px solid ${OT_CRIMSON}40`
          : "1px solid rgba(255, 255, 255, 0.04)",
        borderRadius: 10,
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.label}
        className="w-full h-full transition-transform"
        style={{
          objectFit: "cover",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
          transitionDuration: "0.6s",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
          opacity: isHovered ? 1 : 0.6,
          transitionDuration: "0.4s",
        }}
      />

      {/* Left edge highlight */}
      <div
        className="absolute left-0 top-0 bottom-0 transition-all z-10"
        style={{
          width: 3,
          background: OT_CRIMSON,
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.3s",
        }}
      />

      {/* Label */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 transition-all z-10"
        style={{
          transform: isHovered ? "translateY(0)" : "translateY(4px)",
          opacity: isHovered ? 1 : 0.8,
          transitionDuration: "0.4s",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--white)",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {item.label}
        </p>
      </div>
    </div>
  );
}

/**
 * AgendaRow — Single compact agenda item with time + title
 */
function AgendaRow({
  item,
  isLast,
}: {
  item: (typeof agenda)[0];
  isLast: boolean;
}) {
  const typeColors: Record<string, string> = {
    keynote: OT_CRIMSON,
    panel: OT_CRIMSON,
    roundtable: "#9B7FD4",
    demo: "#4CAF50",
    break: "#353535",
  };

  const color = typeColors[item.type] || "#404040";

  return (
    <div
      className="flex items-center gap-4"
      style={{
        padding: "10px 8px",
        borderBottom: isLast ? "none" : "1px solid rgba(255, 255, 255, 0.03)",
      }}
    >
      {/* Left accent dot */}
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />

      {/* Time */}
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: 600,
          color: "#686868",
          minWidth: 44,
          letterSpacing: "0.5px",
        }}
      >
        {item.time}
      </span>

      {/* Title */}
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 13,
          fontWeight: item.type === "break" ? 400 : 500,
          color: item.type === "break" ? "#404040" : "#909090",
          flex: 1,
        }}
      >
        {item.title}
      </span>

      {/* Type badge */}
      {item.type !== "break" && (
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: color,
            background: `${color}12`,
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          {item.type}
        </span>
      )}
    </div>
  );
}
