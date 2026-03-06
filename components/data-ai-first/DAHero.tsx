"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SeriesTickerBar from "@/components/ui/SeriesTickerBar";
import { DotMatrixGrid, NeuralConstellation } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE } from "./constants";

export default function DAHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "#060D0B",
      }}
    >
      {/* ── Background image backdrop ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ filter: "brightness(0.12) saturate(0.5)", zIndex: 0 }}
      />

      {/* ── Atmospheric layers ── */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(6,13,11,0.75) 0%, rgba(15,115,94,0.04) 40%, rgba(6,13,11,0.95) 100%)`,
          zIndex: 1,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(6,13,11,0.55) 100%)`,
          zIndex: 1,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 80%, rgba(15,115,94,0.06) 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      {/* Neural Constellation */}
      <NeuralConstellation
        color={EMERALD}
        dotCount={30}
        connectionDistance={150}
        speed={0.3}
        opacity={0.15}
      />

      {/* Dot Matrix Grid */}
      <DotMatrixGrid color={EMERALD} opacity={0.03} spacing={28} />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.02,
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Gradient orb behind title */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: 800,
          maxHeight: 800,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          background: `radial-gradient(ellipse at center, rgba(15,115,94,0.08) 0%, transparent 70%)`,
          zIndex: 4,
        }}
      />

      {/* Content — centered single column */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{
          minHeight: "100vh",
          padding: "0 24px",
        }}
      >
        {/* Series label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: EMERALD,
          }}
        >
          Data & AI First Series
        </motion.span>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(64px, 10vw, 120px)",
            letterSpacing: "-3px",
            lineHeight: 0.95,
            color: "var(--white)",
            marginTop: 24,
          }}
        >
          Intelligence
          <br />
          <span style={{ color: EMERALD }}>Amplified</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 18,
            fontWeight: 300,
            color: "#707070",
            maxWidth: 480,
            marginTop: 32,
            lineHeight: 1.6,
          }}
        >
          A new summit series for the leaders building AI-driven organizations
          worldwide.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
          className="flex flex-wrap justify-center gap-4"
          style={{ marginTop: 40 }}
        >
          <HeroButton href="#content">Explore the Series</HeroButton>
          <HeroButton primary href="/events/data-ai-first/kuwait-2026#register">
            Register for Kuwait
          </HeroButton>
        </motion.div>
      </div>

      {/* Ticker Bar */}
      <SeriesTickerBar
        accentColor={EMERALD}
        eventName="Data & AI First Kuwait"
        location="Kuwait City, Kuwait"
        targetDate={new Date("2026-05-18T09:00:00")}
        ctaText="Register"
        ctaHref="/events/data-ai-first/kuwait-2026#register"
        angularRadius={false}
      />
    </section>
  );
}

function HeroButton({
  children,
  primary = false,
  href,
}: {
  children: React.ReactNode;
  primary?: boolean;
  href: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className="inline-flex items-center transition-all"
      style={{
        padding: "14px 32px",
        borderRadius: 50,
        background: primary
          ? isHovered
            ? EMERALD_BRIGHT
            : EMERALD
          : isHovered
            ? `${EMERALD}15`
            : "transparent",
        border: primary ? "none" : `1px solid ${EMERALD}50`,
        fontFamily: "var(--font-outfit)",
        fontSize: 15,
        fontWeight: 500,
        color: primary ? "var(--white)" : EMERALD,
        transitionDuration: "0.3s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}
