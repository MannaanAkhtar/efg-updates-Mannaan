"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const LOGOS_PATH = `${S3}/logos-govt-white`;

// Government and institutional partners - white versions for dark background
const institutions = [
  {
    name: "UAE Cyber Security Council",
    logo: `${LOGOS_PATH}/cyber-security-council-white.png`,
  },
  {
    name: "Kuwait NCSC",
    logo: `${LOGOS_PATH}/ncsc-kuwait-white.png`,
  },
  {
    name: "Central Agency Kuwait",
    logo: `${LOGOS_PATH}/central-agency-kuwait-white.png`,
  },
  {
    name: "Ministry of National Guard",
    logo: `${LOGOS_PATH}/ministry-national-guard-white.png`,
  },
  {
    name: "Cyber 71",
    logo: `${LOGOS_PATH}/cyber-71-white.png`,
  },
  {
    name: "CAFA",
    logo: `${LOGOS_PATH}/cafa-white.png`,
  },
  {
    name: "Women in Cybersecurity",
    logo: `${LOGOS_PATH}/women-cybersecurity-white.png`,
  },
  {
    name: "ICP",
    logo: `${LOGOS_PATH}/icp-white.png`,
  },
];

export default function InstitutionalBacking() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "linear-gradient(to bottom, var(--black) 0%, #0a0a0a 100%)",
        padding: "clamp(40px, 5vw, 60px) 0",
        borderTop: "1px solid rgba(255, 255, 255, 0.03)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: "center",
            marginBottom: "clamp(24px, 3vw, 36px)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.35)",
            }}
          >
            Trusted by Government & Industry Leaders
          </span>
        </motion.div>

        {/* Logo Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "clamp(16px, 2.5vw, 32px)",
          }}
        >
          {institutions.map((institution, index) => (
            <motion.div
              key={institution.name}
              className="ib-logo-item"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 120,
                height: 48,
                transition: "all 0.4s ease",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={institution.logo}
                alt={institution.name}
                title={institution.name}
                loading="lazy"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  opacity: 0.6,
                  transition: "all 0.4s ease",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Hover styles */}
      <style jsx global>{`
        .ib-logo-item:hover img {
          opacity: 1 !important;
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
