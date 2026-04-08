"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DotMatrixGrid } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE, WIDE } from "./constants";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";

const ROW_1 = [
  { src: `${S3}/abu-dhabi-university.png`, name: "Abu Dhabi University" },
  { src: `${S3}/Acronis.png`, name: "Acronis" },
  { src: `${S3}/adgm-academy.png`, name: "ADGM Academy" },
  { src: `${S3}/Akamai.png`, name: "Akamai" },
  { src: `${S3}/AmiViz.png`, name: "AmiViz" },
  { src: `${S3}/bitdefender.png`, name: "Bitdefender" },
  { src: `${S3}/Celonis.png`, name: "Celonis" },
  { src: `${S3}/Claroty.png`, name: "Claroty" },
  { src: `${S3}/CPX.png`, name: "CPX" },
  { src: `${S3}/Dragos.png`, name: "Dragos" },
  { src: `${S3}/EY.png`, name: "EY" },
  { src: `${S3}/fortinet.png`, name: "Fortinet" },
  { src: `${S3}/GBM.png`, name: "GBM" },
  { src: `${S3}/Google-Cloud-Security.png`, name: "Google Cloud Security" },
  { src: `${S3}/Group-IB.png`, name: "Group-IB" },
  { src: `${S3}/kaspersky.png`, name: "Kaspersky" },
  { src: `${S3}/ManageEngine.png`, name: "ManageEngine" },
  { src: `${S3}/paloalto.png`, name: "Palo Alto Networks" },
  { src: `${S3}/sentinelone.png`, name: "SentinelOne" },
  { src: `${S3}/Sonicwall.png`, name: "SonicWall" },
];

const ROW_2 = [
  { src: `${S3}/Anomali.png`, name: "Anomali" },
  { src: `${S3}/beacon-red.png`, name: "Beacon Red" },
  { src: `${S3}/CEREBRA.png`, name: "Cerebra" },
  { src: `${S3}/corelight.png`, name: "Corelight" },
  { src: `${S3}/cyberknight.png`, name: "CyberKnight" },
  { src: `${S3}/Deepinfo.png`, name: "Deepinfo" },
  { src: `${S3}/DTS-solutions.png`, name: "DTS Solutions" },
  { src: `${S3}/EC-Council.png`, name: "EC-Council" },
  { src: `${S3}/GAFAI.png`, name: "GAFAI" },
  { src: `${S3}/Gorilla.png`, name: "Gorilla" },
  { src: `${S3}/keysight-technologies.png`, name: "Keysight Technologies" },
  { src: `${S3}/nozomi-networks.png`, name: "Nozomi Networks" },
  { src: `${S3}/OPSWAT-logo.png`, name: "OPSWAT" },
  { src: `${S3}/PENTERA.png`, name: "Pentera" },
  { src: `${S3}/secureworks.png`, name: "Secureworks" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/securonix.jpg", name: "Securonix" },
  { src: `${S3}/Tenable-logo.png`, name: "Tenable" },
  { src: `${S3}/Wallix.png`, name: "Wallix" },
  { src: `${S3}/Xage.png`, name: "Xage" },
  { src: `${S3}/YOKOGAWA.png`, name: "Yokogawa" },
];

export default function DASponsorsMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#111111",
        padding: "clamp(36px, 5vw, 56px) 0",
      }}
    >
      {/* Atmospheric gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 40%, rgba(15,115,94,0.03) 0%, transparent 70%)`,
        }}
      />

      <DotMatrixGrid color={EMERALD} opacity={0.012} spacing={30} />

      <div
        style={{
          maxWidth: WIDE + 200,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
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
              Trusted By Industry Leaders
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
            Our Partners
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "#707070",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: "14px auto 0",
            }}
          >
            Backed by global technology leaders and enterprises
            worldwide.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: "relative" }}
        >
          {/* Left edge fade */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              background:
                "linear-gradient(to right, #111111 0%, transparent 100%)",
            }}
          />
          {/* Right edge fade */}
          <div
            className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              background:
                "linear-gradient(to left, #111111 0%, transparent 100%)",
            }}
          />

          {/* Row 1, scrolls left */}
          <div className="da-marquee-track" style={{ marginBottom: 20 }}>
            <div
              className="da-marquee-inner da-scroll-left"
              style={{ animationDuration: "70s" }}
            >
              {[...ROW_1, ...ROW_1].map((logo, i) => (
                <div
                  key={`r1-${i}`}
                  style={{
                    width: 140,
                    height: 44,
                    margin: "0 clamp(14px, 2vw, 28px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.45,
                    flexShrink: 0,
                    borderRadius: 8,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2, scrolls right */}
          <div className="da-marquee-track">
            <div
              className="da-marquee-inner da-scroll-right"
              style={{ animationDuration: "80s" }}
            >
              {[...ROW_2, ...ROW_2].map((logo, i) => (
                <div
                  key={`r2-${i}`}
                  style={{
                    width: 140,
                    height: 44,
                    margin: "0 clamp(14px, 2vw, 28px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.45,
                    flexShrink: 0,
                    borderRadius: 8,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginTop: 36 }}
        >
          <a
            href="#register"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: EMERALD,
              textDecoration: "none",
              letterSpacing: "0.3px",
            }}
          >
            Partner With Us →
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        .da-marquee-track {
          overflow: hidden;
          width: 100%;
        }
        .da-marquee-inner {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .da-scroll-left {
          animation: daScrollLeft linear infinite;
        }
        .da-scroll-right {
          animation: daScrollRight linear infinite;
        }
        @keyframes daScrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes daScrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
