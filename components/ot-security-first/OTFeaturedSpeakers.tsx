"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const OT_CRIMSON = "#D34B9A";
const EASE = [0.16, 1, 0.3, 1] as const;

// 8 speakers with S3-hosted photos from Supabase
const speakers = [
  {
    id: 1,
    name: "Ali Al Kaf Alhashmi",
    title: "VP Cyber Security & Technology",
    company: "Mubadala",
    photo:
      "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/Ali-Al-Kaf-Alhashmi.png",
  },
  {
    id: 2,
    name: "Shaytel Patel",
    title: "Group SVP Technology Audit",
    company: "DP World",
    photo:
      "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/Shaytel-Patel.jpg",
  },
  {
    id: 3,
    name: "Ali AlQallaf",
    title: "Head of Cybersecurity Operations",
    company: "KNPC",
    photo:
      "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/ALI-ALQALLAF.jpg",
  },
  {
    id: 4,
    name: "Abdulhakeem Al Alawi",
    title: "Information Security Officer",
    company: "Oman LNG",
    photo:
      "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/Abdulhakeem-Al-Alawi.jpg",
  },
  {
    id: 5,
    name: "Khaled Al Teneiji",
    title: "Cyber Security Head",
    company: "ENOC",
    photo:
      "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/Khaled-Al-Teneiji.jpg",
  },
  {
    id: 6,
    name: "Wissam Al-Nasairi",
    title: "OT Security EMEA Lead",
    company: "IBM Consulting",
    photo:
      "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/Wissam-Al-Nasairi.jpg",
  },
  {
    id: 7,
    name: "Payal Sampat",
    title: "Cyber Security Officer",
    company: "Petrofac",
    photo:
      "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/Payal-Sampat.jpg",
  },
  {
    id: 8,
    name: "Mohammed Shoukat Ali",
    title: "GM & Head Global Cybersecurity CoE",
    company: "Yokogawa",
    photo:
      "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/OT-Security-First/Mohammed-Shoukat-Ali.jpg",
  },
];

export default function OTFeaturedSpeakers() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0A0A0A",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Vertical line pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(211,75,154,0.03) 59px, rgba(211,75,154,0.03) 60px)",
        }}
      />
      {/* Crimson glow — center-bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 90%, ${OT_CRIMSON}10 0%, transparent 70%)`,
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
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
              Speakers & Advisors
            </span>
            <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
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
            The People Protecting Infrastructure
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "#707070",
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "14px auto 0",
            }}
          >
            OT security leaders from the region&rsquo;s most critical energy and
            utilities organizations.
          </p>
        </motion.div>

        {/* Speakers Grid — 4 columns, portrait cards */}
        <div
          className="ot-speakers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {speakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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

        {/* View All + Apply to Speak */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          className="flex items-center justify-center gap-6"
          style={{ marginTop: 32 }}
        >
          <ViewAllLink />
          <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
          <a
            href="#register"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: OT_CRIMSON,
              textDecoration: "none",
              letterSpacing: "0.3px",
            }}
          >
            Apply to Speak →
          </a>
        </motion.div>

        {/* Attendee Logo Wall */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1, ease: EASE }}
          style={{ marginTop: 48 }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#555",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Leaders from these organizations attended
          </p>
          <div
            className="ot-logo-wall"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "8px 16px",
            }}
          >
            {[
              "Mubadala",
              "ADNOC",
              "DP World",
              "KNPC",
              "Oman LNG",
              "ENOC",
              "Petrofac",
              "Yokogawa",
              "IBM",
            ].map((org) => (
              <span
                key={org}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#3a3a3a",
                  letterSpacing: "-0.2px",
                  padding: "8px 16px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  borderRadius: 6,
                  whiteSpace: "nowrap",
                  transition: "all 0.3s",
                }}
                className="hover-logo-item"
              >
                {org}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .hover-logo-item:hover {
          color: #505050 !important;
          border-color: rgba(211, 75, 154, 0.15) !important;
        }
        @media (max-width: 1024px) {
          .ot-speakers-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .ot-speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * SpeakerCard — Full portrait card with grayscale-to-color hover
 */
function SpeakerCard({ speaker }: { speaker: (typeof speakers)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative transition-all overflow-hidden"
      style={{
        background: "#141414",
        border: `1px solid ${isHovered ? `${OT_CRIMSON}20` : "rgba(255, 255, 255, 0.05)"}`,
        borderRadius: 10,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 12px 40px rgba(0, 0, 0, 0.3)" : "none",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left edge bar on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 transition-all"
        style={{
          width: 3,
          background: OT_CRIMSON,
          opacity: isHovered ? 1 : 0,
          transitionDuration: "0.3s",
        }}
      />

      {/* Portrait Photo */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={speaker.photo}
          alt={speaker.name}
          className="w-full h-full object-cover"
          style={{
            filter: isHovered
              ? "brightness(0.9) saturate(1)"
              : "brightness(0.7) saturate(0)",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.4) 40%, transparent 70%)",
          }}
        />

        {/* Crimson accent line at bottom on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-opacity"
          style={{
            height: 2,
            background: OT_CRIMSON,
            opacity: isHovered ? 0.8 : 0,
            transitionDuration: "0.4s",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "16px 20px 20px" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--white)",
            letterSpacing: "-0.2px",
            margin: 0,
          }}
        >
          {speaker.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 400,
            color: "#606060",
            lineHeight: 1.4,
            marginTop: 4,
          }}
        >
          {speaker.title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 500,
            color: `${OT_CRIMSON}B3`,
            marginTop: 4,
          }}
        >
          {speaker.company}
        </p>
      </div>
    </div>
  );
}

/**
 * ViewAllLink — Link to full speakers page
 */
function ViewAllLink() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/speakers"
      className="inline-flex items-center gap-1.5 transition-colors"
      style={{
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: 500,
        color: OT_CRIMSON,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>View All Speakers</span>
      <span
        className="transition-transform duration-300"
        style={{
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
        }}
      >
        &rarr;
      </span>
    </Link>
  );
}
