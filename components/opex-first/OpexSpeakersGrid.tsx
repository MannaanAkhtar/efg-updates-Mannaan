"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { SpeakerWithSeries } from "@/lib/supabase/types";

const VIOLET = "#7C3AED";
const EASE = [0.16, 1, 0.3, 1] as const;

interface FallbackSpeaker {
  name: string;
  role: string;
  org: string;
  image: string | null;
}

// Normalized shape used internally
interface DisplaySpeaker {
  id: string;
  name: string;
  role: string;
  org: string;
  image: string | null;
  initial: string;
}

function normalizeSpeakers(
  speakers?: SpeakerWithSeries[],
  fallback?: FallbackSpeaker[]
): DisplaySpeaker[] {
  if (speakers && speakers.length > 0) {
    return speakers.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.title ?? "",
      org: s.organization ?? "",
      image: s.image_url,
      initial: s.name.charAt(0),
    }));
  }
  if (fallback && fallback.length > 0) {
    return fallback.map((s, i) => ({
      id: `fallback-${i}`,
      name: s.name,
      role: s.role,
      org: s.org,
      image: s.image,
      initial: s.name.charAt(0),
    }));
  }
  return [];
}

export default function OpexSpeakersGrid({
  speakers,
  fallbackSpeakers,
}: {
  speakers?: SpeakerWithSeries[];
  fallbackSpeakers?: FallbackSpeaker[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const displaySpeakers = normalizeSpeakers(speakers, fallbackSpeakers);

  if (displaySpeakers.length === 0) return null;

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
              Speakers & Advisors
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
            The Leaders Driving Excellence
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 16,
              fontWeight: 300,
              color: "#808080",
              marginTop: 16,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Government excellence advisors, corporate transformation leaders,
            and global technology pioneers.
          </p>
        </motion.div>

        {/* Speaker Cards Grid */}
        <div
          className="opex-speakers-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              displaySpeakers.length >= 4
                ? "repeat(4, 1fr)"
                : "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {displaySpeakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 25 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }
              }
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.06,
                ease: EASE,
              }}
            >
              <SpeakerCard speaker={speaker} />
            </motion.div>
          ))}
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .opex-speakers-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .opex-speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .opex-speakers-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function SpeakerCard({ speaker }: { speaker: DisplaySpeaker }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden transition-all"
      style={{
        background: "#141414",
        border: isHovered
          ? "1px solid rgba(124,58,237,0.12)"
          : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 12px 40px rgba(0,0,0,0.3)" : "none",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo */}
      <div
        style={{
          aspectRatio: "1",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {speaker.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover transition-all"
              style={{
                filter: isHovered
                  ? "brightness(0.9) saturate(1)"
                  : "brightness(0.7) saturate(0)",
                transform: isHovered ? "scale(1.04)" : "scale(1)",
                transitionDuration: "0.6s",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.4) 50%, transparent 100%)",
              }}
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(124,58,237,0.05) 100%)`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 48,
                fontWeight: 800,
                color: VIOLET,
                opacity: 0.4,
              }}
            >
              {speaker.initial}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 20px" }}>
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 700,
            color: "var(--white)",
            margin: 0,
          }}
        >
          {speaker.name}
        </h4>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 300,
            color: "#707070",
            margin: "4px 0 0",
            lineHeight: 1.4,
          }}
        >
          {speaker.role}
        </p>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 500,
            color: VIOLET,
            margin: "4px 0 0",
            opacity: 0.7,
          }}
        >
          {speaker.org}
        </p>
      </div>

      {/* Bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all"
        style={{
          height: 2,
          background: VIOLET,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transitionDuration: "0.4s",
        }}
      />
    </div>
  );
}
