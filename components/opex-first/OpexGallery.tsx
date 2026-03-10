"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const EASE = [0.16, 1, 0.3, 1] as const;

const photos = [
  {
    id: "1",
    src: "https://opexfirst.com/wp-content/uploads/2025/10/DSC08180.jpg",
    gridClass: "col-span-2 row-span-2",
  },
  {
    id: "2",
    src: "https://opexfirst.com/wp-content/uploads/2025/10/DSC08142.jpg",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: "3",
    src: "https://opexfirst.com/wp-content/uploads/2025/10/DSC08203.jpg",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: "4",
    src: "https://opexfirst.com/wp-content/uploads/2025/10/DSC08170.jpg",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: "5",
    src: "https://opexfirst.com/wp-content/uploads/2025/10/DSC08553.jpg",
    gridClass: "col-span-1 row-span-1",
  },
  {
    id: "6",
    src: "https://opexfirst.com/wp-content/uploads/2025/10/DSC08609.jpg",
    gridClass: "col-span-2 row-span-1",
    hideOnMobile: true,
  },
];

export default function OpexGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isAnyHovered = hoveredId !== null;

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black-light)",
        padding: "clamp(36px, 4vw, 56px) 0",
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
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
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
              From Previous Editions
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
            The Opex First Experience
          </h2>
        </motion.div>

        {/* Masonry Grid */}
        <div
          className="opex-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: 180,
            gap: 14,
          }}
        >
          {photos.map((photo, index) => {
            const isThisHovered = hoveredId === photo.id;
            const shouldDim = isAnyHovered && !isThisHovered;

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.95, y: 20 }
                }
                transition={{
                  duration: 0.5,
                  delay: 0.15 + index * 0.06,
                  ease: EASE,
                }}
                className={`relative overflow-hidden ${photo.gridClass} ${photo.hideOnMobile ? "opex-gallery-hide-mobile" : ""}`}
                style={{
                  borderRadius: 16,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredId(photo.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt="Opex First Gallery"
                  loading="lazy"
                  className="w-full h-full object-cover transition-all"
                  style={{
                    filter: shouldDim
                      ? "brightness(0.5) saturate(0.9)"
                      : isThisHovered
                        ? "brightness(0.9) saturate(1.05)"
                        : "brightness(0.75) saturate(0.9)",
                    transform: isThisHovered ? "scale(1.04)" : "scale(1)",
                    transitionDuration: "0.5s",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />

                {/* Gradient overlay on hover */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,10,10,0.5), transparent)",
                    opacity: isThisHovered ? 1 : 0,
                    transitionDuration: "0.4s",
                  }}
                />

                {/* Violet tint on hover */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity"
                  style={{
                    background: `rgba(124,58,237,0.05)`,
                    opacity: isThisHovered ? 1 : 0,
                    transitionDuration: "0.4s",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .opex-gallery-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .opex-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 140px !important;
          }
          .opex-gallery-hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
