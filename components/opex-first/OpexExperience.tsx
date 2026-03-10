"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Experience Data ─────────────────────────────────────── */

const formats = [
  {
    num: "01",
    title: "Keynotes & Leadership Panels",
    desc: "Strategic sessions with government excellence leaders, COOs, and transformation heads from NEOM, ADNOC, DP World, and Saudi ministries.",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    wide: true,
  },
  {
    num: "02",
    title: "Hands-On Workshops",
    desc: "Applied sessions: Business Process Improvement with BPMN 2.0, Lean Six Sigma simulations, AI-powered process mining labs.",
    icon: "M14.7 6.3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0l-10 10V17h3.7l10-10zM3 21h18",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    wide: false,
  },
  {
    num: "03",
    title: "Opex Awards Ceremony",
    desc: "Celebrating excellence across 8 categories including Operational Excellence Leader, Business Transformation, and more.",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    image:
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&q=80",
    wide: false,
  },
  {
    num: "04",
    title: "Curated 1-on-1 Meetings",
    desc: "Pre-matched meetings between enterprise excellence leaders and technology solution providers. Every meeting is curated for relevance.",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    wide: true,
  },
  {
    num: "05",
    title: "Live Case Studies",
    desc: "Real implementations from Saudi and UAE organizations — what worked, what failed, and what they learned.",
    icon: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    wide: true,
  },
  {
    num: "06",
    title: "Networking & Gala Dinner",
    desc: "Structured networking sessions and an evening gala connecting the operational excellence community worldwide.",
    icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    wide: false,
  },
];

/* ─── Main Component ──────────────────────────────────────── */

export default function OpexExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#07051A",
        padding: "clamp(36px, 4vw, 56px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Atmospheric layers ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 30% 20%, rgba(124,58,237,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 45% at 75% 75%, rgba(124,58,237,0.04) 0%, transparent 70%)",
        }}
      />
      {/* Dot matrix */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(124,58,237,0.035) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 50,
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: VIOLET_BRIGHT,
              marginBottom: 20,
            }}
          >
            The Experience
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 4vw, 52px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "0 0 12px",
            }}
          >
            More Than a Conference
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "#707070",
              maxWidth: 540,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Every element is designed for one outcome — that the right people
            leave with the right connections, insights, and momentum.
          </p>
        </motion.div>

        {/* ── Bento Grid ── */}
        <div
          className="opex-exp-bento"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {formats.map((format, index) => (
            <motion.div
              key={format.num}
              className={format.wide ? "opex-exp-wide" : ""}
              initial={{ opacity: 0, y: 24 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
              }
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.08,
                ease: EASE,
              }}
              style={{
                gridColumn: format.wide ? "span 2" : "span 1",
              }}
            >
              {format.wide ? (
                <WideCard format={format} />
              ) : (
                <CompactCard format={format} />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .opex-exp-bento {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .opex-exp-wide {
            grid-column: span 2 !important;
          }
        }
        @media (max-width: 600px) {
          .opex-exp-bento {
            grid-template-columns: 1fr !important;
          }
          .opex-exp-wide {
            grid-column: span 1 !important;
          }
          .opex-exp-wide-inner {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Wide Card (2-col span) ──────────────────────────────── */

function WideCard({
  format,
}: {
  format: (typeof formats)[0];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    []
  );

  return (
    <div
      ref={cardRef}
      className="transition-all"
      style={{
        position: "relative",
        padding: "32px 28px",
        background: isHovered
          ? "rgba(124,58,237,0.06)"
          : "rgba(255,255,255,0.015)",
        border: isHovered
          ? "1px solid rgba(124,58,237,0.2)"
          : "1px solid rgba(255,255,255,0.04)",
        borderRadius: 20,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
        transform: isHovered
          ? "translateY(-4px) scale(1.005)"
          : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? "0 16px 48px rgba(124,58,237,0.1), 0 0 40px rgba(124,58,237,0.03)"
          : "none",
        transitionDuration: "0.45s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Cursor spotlight */}
      <div
        className="absolute pointer-events-none transition-opacity duration-500"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          left: `calc(${mousePos.x * 100}% - 150px)`,
          top: `calc(${mousePos.y * 100}% - 150px)`,
          opacity: isHovered ? 1 : 0,
          zIndex: 1,
        }}
      />

      {/* Backdrop image */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={format.image}
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: isHovered
              ? "brightness(0.3) saturate(0.6)"
              : "brightness(0.15) saturate(0.4)",
            transform: isHovered ? "scale(1.06)" : "scale(1)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
      {/* Gradient overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(7,5,26,0.82) 30%, rgba(7,5,26,0.45) 100%)",
          zIndex: 0,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 transition-all"
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${VIOLET_BRIGHT}, transparent)`,
          opacity: isHovered ? 0.5 : 0,
          transitionDuration: "0.4s",
          zIndex: 1,
        }}
      />

      {/* Horizontal layout */}
      <div
        className="opex-exp-wide-inner"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Icon */}
        <div
          style={{
            flexShrink: 0,
            width: 64,
            height: 64,
            borderRadius: 18,
            background: isHovered
              ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(124,58,237,0.06))"
              : "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(124,58,237,0.03))",
            border: `1px solid rgba(124,58,237,${isHovered ? 0.3 : 0.12})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.4s",
            boxShadow: isHovered
              ? "0 0 24px rgba(124,58,237,0.15)"
              : "none",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isHovered ? VIOLET_BRIGHT : `${VIOLET}99`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: isHovered
                ? "drop-shadow(0 0 8px rgba(124,58,237,0.5))"
                : "none",
              transition: "stroke 0.3s, filter 0.3s",
            }}
          >
            <path d={format.icon} />
          </svg>
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 700,
              color: VIOLET,
              opacity: 0.5,
              letterSpacing: "1.5px",
            }}
          >
            {format.num}
          </span>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(17px, 1.8vw, 20px)",
              fontWeight: 700,
              color: "var(--white)",
              margin: "6px 0 0",
              lineHeight: 1.25,
            }}
          >
            {format.title}
          </h4>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 300,
              color: "#606060",
              marginTop: 8,
              lineHeight: 1.6,
              maxWidth: 460,
            }}
          >
            {format.desc}
          </p>
        </div>
      </div>

      {/* Ambient glow blur */}
      <div
        className="absolute pointer-events-none transition-opacity"
        style={{
          width: 200,
          height: 200,
          bottom: -50,
          left: "50%",
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)`,
          filter: "blur(50px)",
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.5s",
          zIndex: 1,
        }}
      />
    </div>
  );
}

/* ─── Compact Card (1-col) ────────────────────────────────── */

function CompactCard({
  format,
}: {
  format: (typeof formats)[0];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    []
  );

  return (
    <div
      ref={cardRef}
      className="transition-all"
      style={{
        position: "relative",
        padding: "28px 24px",
        background: isHovered
          ? "rgba(124,58,237,0.05)"
          : "rgba(255,255,255,0.015)",
        border: isHovered
          ? "1px solid rgba(124,58,237,0.22)"
          : "1px solid rgba(255,255,255,0.04)",
        borderRadius: 18,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        minHeight: 220,
        overflow: "hidden",
        transform: isHovered
          ? "translateY(-5px) scale(1.01)"
          : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? "0 14px 44px rgba(124,58,237,0.1), 0 0 30px rgba(124,58,237,0.03)"
          : "none",
        transitionDuration: "0.45s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Cursor spotlight */}
      <div
        className="absolute pointer-events-none transition-opacity duration-500"
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          left: `calc(${mousePos.x * 100}% - 100px)`,
          top: `calc(${mousePos.y * 100}% - 100px)`,
          opacity: isHovered ? 1 : 0,
          zIndex: 1,
        }}
      />

      {/* Backdrop image */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={format.image}
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: isHovered
              ? "brightness(0.3) saturate(0.6)"
              : "brightness(0.15) saturate(0.4)",
            transform: isHovered ? "scale(1.06)" : "scale(1)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
      {/* Gradient overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(7,5,26,0.85) 20%, rgba(7,5,26,0.5) 100%)",
          zIndex: 0,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 transition-all"
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${VIOLET_BRIGHT}, transparent)`,
          opacity: isHovered ? 0.5 : 0,
          transitionDuration: "0.4s",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Icon */}
        <div
          className="transition-all"
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: isHovered
              ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(124,58,237,0.06))"
              : "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(124,58,237,0.03))",
            border: `1px solid rgba(124,58,237,${isHovered ? 0.3 : 0.12})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            transitionDuration: "0.35s",
            boxShadow: isHovered
              ? "0 0 20px rgba(124,58,237,0.12)"
              : "none",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isHovered ? VIOLET_BRIGHT : `${VIOLET}99`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: isHovered
                ? "drop-shadow(0 0 6px rgba(124,58,237,0.5))"
                : "none",
              transition: "stroke 0.3s, filter 0.3s",
            }}
          >
            <path d={format.icon} />
          </svg>
        </div>

        {/* Number label */}
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 10,
            fontWeight: 700,
            color: VIOLET,
            opacity: 0.5,
            letterSpacing: "1.5px",
          }}
        >
          {format.num}
        </span>

        {/* Title */}
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--white)",
            margin: "8px 0 0",
            lineHeight: 1.3,
          }}
        >
          {format.title}
        </h4>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 300,
            color: "#606060",
            marginTop: 10,
            lineHeight: 1.6,
          }}
        >
          {format.desc}
        </p>
      </div>

      {/* Ambient glow blur */}
      <div
        className="absolute pointer-events-none transition-opacity"
        style={{
          width: 160,
          height: 160,
          bottom: -40,
          left: "50%",
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)`,
          filter: "blur(40px)",
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.5s",
          zIndex: 1,
        }}
      />
    </div>
  );
}
