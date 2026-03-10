"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { DotMatrixGrid } from "@/components/effects";
import { EASE, WIDE } from "./constants";

const EMERALD = "#0F735E";

const series = [
  {
    title: "Cyber First",
    tagline: "Defending the Digital Frontier",
    color: "#01BBF5",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
    href: "/events/cyber-first",
  },
  {
    title: "OT Security First",
    tagline: "Protecting What Runs the World",
    color: "#D34B9A",
    image: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=400&q=80",
    href: "/events/ot-security-first",
  },
  {
    title: "Opex First",
    tagline: "Operational Excellence for the Modern Enterprise",
    color: "#7C3AED",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    href: "/events/opex-first",
  },
];

export default function DAExploreOtherSeries() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "#111111",
        padding: "clamp(36px, 5vw, 56px) 24px",
      }}
    >
      {/* Atmospheric gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(232,101,26,0.02) 0%, transparent 70%)`,
        }}
      />

      {/* Texture: Dot Matrix */}
      <DotMatrixGrid color={EMERALD} opacity={0.015} spacing={30} />

      <div style={{ maxWidth: WIDE, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 600,
              color: "#E8651A",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            From Events First Group
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 800,
              color: "var(--white)",
              marginTop: 12,
              letterSpacing: "-1px",
            }}
          >
            Explore Our Other Series
          </h2>
        </motion.div>

        <div
          className="da-other-series-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {series.map((s, i) => (
            <PortalCard key={s.title} series={s} delay={i * 0.1} isInView={isInView} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .da-other-series-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function PortalCard({
  series: s,
  delay,
  isInView,
}: {
  series: { title: string; tagline: string; color: string; image: string; href: string };
  delay: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <Link
        href={s.href}
        style={{ display: "block" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="transition-all"
          style={{
            position: "relative",
            borderRadius: 18,
            overflow: "hidden",
            aspectRatio: "3 / 4",
            border: isHovered
              ? `1px solid ${s.color}33`
              : "1px solid rgba(255, 255, 255, 0.05)",
            transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
            boxShadow: isHovered
              ? `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${s.color}15`
              : "none",
            transitionDuration: "0.5s",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-all"
            style={{
              filter: isHovered
                ? "brightness(0.25) saturate(0.7)"
                : "brightness(0.15) saturate(0.5)",
              transform: isHovered ? "scale(1.12)" : "scale(1)",
              transitionDuration: "0.8s",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Color wash overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity"
            style={{
              background: `linear-gradient(160deg, ${s.color}${isHovered ? "1A" : "08"} 0%, transparent 50%)`,
              transitionDuration: "0.5s",
            }}
          />

          {/* Darkness gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 60%, rgba(10,10,10,0.97) 100%)`,
            }}
          />

          {/* Ambient glow blur on hover */}
          <div
            className="absolute pointer-events-none transition-opacity"
            style={{
              width: 250,
              height: 250,
              bottom: -40,
              left: "30%",
              transform: "translateX(-50%)",
              background: `radial-gradient(ellipse at center, ${s.color}15 0%, transparent 70%)`,
              filter: "blur(60px)",
              opacity: isHovered ? 1 : 0,
              transitionDuration: "0.5s",
            }}
          />

          {/* Content — bottom aligned */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ padding: "0 24px 28px" }}
          >
            {/* Series color marker line */}
            <div
              className="transition-all"
              style={{
                width: isHovered ? 40 : 24,
                height: 3,
                background: s.color,
                borderRadius: 2,
                marginBottom: 14,
                transitionDuration: "0.4s",
                boxShadow: isHovered ? `0 0 12px ${s.color}60` : "none",
              }}
            />

            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 800,
                color: "var(--white)",
                margin: "0 0 6px",
                letterSpacing: "-0.5px",
              }}
            >
              {s.title}
            </h4>
            <p
              className="transition-opacity"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 300,
                color: "#808080",
                margin: 0,
                lineHeight: 1.5,
                opacity: isHovered ? 1 : 0.7,
                transitionDuration: "0.3s",
              }}
            >
              {s.tagline}
            </p>

            {/* Arrow */}
            <div
              className="flex items-center gap-2 transition-all"
              style={{
                marginTop: 16,
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0)" : "translateY(8px)",
                transitionDuration: "0.3s",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: s.color,
                }}
              >
                Explore Series
              </span>
              <span style={{ color: s.color, fontSize: 14 }}>&rarr;</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
