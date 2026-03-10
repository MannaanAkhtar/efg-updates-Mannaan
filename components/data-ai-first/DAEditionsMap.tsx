"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { DotMatrixGrid } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE, WIDE } from "./constants";

const cities = [
  {
    name: "Kuwait City",
    country: "Kuwait",
    date: "May 18, 2026",
    status: "LAUNCHING",
    active: true,
    href: "/events/data-ai-first/kuwait-2026",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=600&q=80",
  },
  {
    name: "Abu Dhabi",
    country: "UAE",
    date: "2027",
    status: "UPCOMING",
    active: false,
    href: "",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
  },
  {
    name: "Riyadh",
    country: "Saudi Arabia",
    date: "2027",
    status: "UPCOMING",
    active: false,
    href: "",
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600&q=80",
  },
  {
    name: "Doha",
    country: "Qatar",
    date: "2027",
    status: "UPCOMING",
    active: false,
    href: "",
    image: "https://images.unsplash.com/photo-1548017395-5b5e6e645dc4?w=600&q=80",
  },
];

export default function DAEditionsMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const featured = cities[0];
  const upcoming = cities.slice(1);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#111111",
        padding: "clamp(36px, 5vw, 56px) 0",
      }}
    >
      {/* Multi-layer atmospheric gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 30% 50%, rgba(15,115,94,0.04) 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 40% at 80% 30%, rgba(20,168,130,0.025) 0%, transparent 70%)`,
        }}
      />

      {/* Texture: Dot Matrix */}
      <DotMatrixGrid color={EMERALD} opacity={0.02} spacing={26} />

      <div
        style={{
          maxWidth: WIDE,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: EMERALD }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: EMERALD,
              }}
            >
              Editions
            </span>
            <span style={{ width: 30, height: 1, background: EMERALD }} />
          </div>
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
            Where We&rsquo;re Going
          </h2>
        </motion.div>

        {/* Timeline Pipeline */}
        <TimelinePipeline isInView={isInView} />

        {/* Asymmetric Grid */}
        <div
          className="da-editions-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: 20,
            marginTop: 32,
          }}
        >
          {/* Featured card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            {featured.href ? (
              <Link href={featured.href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <FeaturedCard city={featured} />
              </Link>
            ) : (
              <FeaturedCard city={featured} />
            )}
          </motion.div>

          {/* Upcoming cities stacked */}
          <div className="flex flex-col gap-3">
            {upcoming.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: EASE }}
              >
                <UpcomingCard city={city} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 15,
            fontStyle: "italic",
            color: "#686868",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Kuwait is just the beginning.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
          style={{ textAlign: "center", marginTop: 16 }}
        >
          <a
            href="#register"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 500,
              color: EMERALD,
              textDecoration: "none",
              letterSpacing: "0.3px",
            }}
          >
            Get Notified for 2027 Editions →
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .da-editions-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function TimelinePipeline({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="da-timeline-pipeline"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        position: "relative",
        padding: "0 40px",
        margin: "0 auto",
        maxWidth: 600,
      }}
    >
      {/* Connecting line */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: "50%",
          height: 2,
          background: `linear-gradient(90deg, ${EMERALD}, ${EMERALD}40)`,
          transform: "translateY(-50%)",
          zIndex: 0,
        }}
      />

      {cities.map((city) => (
        <div
          key={city.name}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Node */}
          <div
            style={{
              position: "relative",
              width: city.active ? 20 : 14,
              height: city.active ? 20 : 14,
              borderRadius: "50%",
              background: city.active ? EMERALD : "transparent",
              border: city.active ? "none" : `2px solid ${EMERALD}50`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: city.active ? `0 0 16px ${EMERALD}60` : "none",
            }}
          >
            {/* Pulsing ring on active node */}
            {city.active && (
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: `2px solid ${EMERALD_BRIGHT}`,
                  opacity: 0.4,
                  animation: "daPulse 2s ease-out infinite",
                }}
              />
            )}
            {city.active && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          {/* Label */}
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 600,
              color: city.active ? EMERALD_BRIGHT : "#686868",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginTop: 8,
              whiteSpace: "nowrap",
            }}
          >
            {city.name}
          </span>
        </div>
      ))}

      <style jsx global>{`
        @media (max-width: 600px) {
          .da-timeline-pipeline {
            flex-wrap: wrap !important;
            gap: 16px !important;
          }
          .da-timeline-pipeline > div {
            flex: 0 0 auto !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

function FeaturedCard({ city }: { city: (typeof cities)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden transition-all"
      style={{
        borderRadius: 18,
        background: "rgba(15, 115, 94, 0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${isHovered ? `${EMERALD}40` : `${EMERALD}15`}`,
        transform: isHovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${EMERALD}15`
          : "none",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={city.image}
          alt={city.name}
          className="transition-all"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: isHovered ? "brightness(0.5)" : "brightness(0.4)",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            transitionDuration: "0.7s",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, rgba(15,115,94,0.3) 0%, transparent 60%)`,
          }}
        />
        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none transition-opacity"
          style={{
            width: 300,
            height: 200,
            bottom: -40,
            left: "30%",
            transform: "translateX(-50%)",
            background: `radial-gradient(ellipse at center, ${EMERALD}20 0%, transparent 70%)`,
            filter: "blur(40px)",
            opacity: isHovered ? 1 : 0,
            transitionDuration: "0.5s",
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "24px 28px 28px" }}>
        <div className="flex items-center gap-2">
          {/* Pulsing live dot */}
          <div style={{ position: "relative", width: 8, height: 8 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: EMERALD_BRIGHT,
                opacity: 0.75,
                animation: "daPulse 2s ease-out infinite",
              }}
            />
            <div
              style={{
                position: "relative",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: EMERALD_BRIGHT,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 9,
              fontWeight: 700,
              color: EMERALD_BRIGHT,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {city.status}
          </span>
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 800,
            color: "var(--white)",
            margin: "10px 0 4px",
            letterSpacing: "-0.5px",
          }}
        >
          {city.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 14,
            color: "#707070",
            margin: 0,
          }}
        >
          {city.date} · {city.country}
        </p>
      </div>
    </div>
  );
}

function UpcomingCard({ city }: { city: (typeof cities)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-4 transition-all"
      style={{
        padding: "16px 20px",
        borderRadius: 14,
        background: isHovered ? "rgba(15,115,94,0.04)" : "#141414",
        border: isHovered
          ? `1px solid ${EMERALD}25`
          : "1px solid rgba(255,255,255,0.04)",
        opacity: isHovered ? 0.95 : 0.65,
        cursor: "default",
        transform: isHovered ? "translateX(-4px)" : "translateX(0)",
        transitionDuration: "0.3s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Small image */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          overflow: "hidden",
          flexShrink: 0,
          border: isHovered ? `1px solid ${EMERALD}20` : "1px solid transparent",
          transition: "border-color 0.3s",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={city.image}
          alt={city.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: isHovered ? "brightness(0.5) saturate(0.3)" : "brightness(0.4) saturate(0)",
            transition: "filter 0.3s",
          }}
        />
      </div>
      <div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: isHovered ? "var(--white)" : "#c0c0c0",
            margin: 0,
            transition: "color 0.2s",
          }}
        >
          {city.name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 11,
            fontWeight: 500,
            color: "#505050",
            marginTop: 2,
            letterSpacing: "1px",
          }}
        >
          {city.date}
        </p>
      </div>
    </div>
  );
}
