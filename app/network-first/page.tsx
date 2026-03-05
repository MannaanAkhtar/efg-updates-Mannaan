"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import { Footer } from "@/components/sections";

const AMBER = "#C9935A";
const EASE = [0.16, 1, 0.3, 1] as const;
const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";

// Curated boardroom images
const BOARDROOM_IMAGES = [
  { id: "4a4dda49-0d68-4b17-b64b-c282119ee9c4", caption: "Executive Roundtable, Dubai" },
  { id: "64deba6d-acd5-4e3c-aefe-0e345caea674", caption: "U-Shape Boardroom, Kuwait" },
  { id: "31648058-1291-4296-99a9-1755eabbd671", caption: "Strategic Discussion, Riyadh" },
  { id: "e53d8ad6-3d16-4650-9322-b4a737778a7b", caption: "Networking Break, Abu Dhabi" },
  { id: "00671180-bf11-44dc-be86-3d2cf1762b17", caption: "Leadership Session, Dubai" },
  { id: "5934e230-4a03-44ed-a7e0-470d0940c01c", caption: "Executive Presentation, Kuwait" },
  { id: "8b5f3390-eaf4-4f6d-9038-2b8438ec9741", caption: "Intimate Roundtable, Dubai" },
  { id: "6cbebbd9-21cd-44ad-9bd6-4897f37beec1", caption: "C-Level Discussion, Riyadh" },
  { id: "f73a3ff7-562f-4a4d-ab41-3a7b16b47434", caption: "Speaker Session, Dubai" },
  { id: "11d8df51-b690-4172-888b-3e11d6cdac3a", caption: "Boardroom Engagement, Kuwait" },
  { id: "50ef4ffb-0468-4921-bffc-7d299d295bdd", caption: "Technology Leaders, Abu Dhabi" },
  { id: "27744fc1-b75c-4daf-839f-c2695e0fcb0e", caption: "Premium Venue, Dubai" },
];

const stats = [
  { value: "100+", label: "Boardrooms Delivered" },
  { value: "1,500+", label: "C-Level Executives Hosted" },
  { value: "80+", label: "Corporate Sponsors" },
  { value: "5", label: "GCC Markets" },
];

const formats = [
  {
    title: "Physical Boardrooms",
    description: "Intimate in-person gatherings at five-star venues across the GCC. Curated hospitality, private dining, and face-to-face connections that build lasting relationships.",
    features: ["Five-star hotel venues", "15–20 hand-selected executives", "Curated F&B and private dining", "Same-day relationship building"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    title: "Virtual Boardrooms",
    description: "Moderated online sessions that bring the same curation standards to a cross-border audience. No travel barriers — same quality conversations.",
    features: ["Moderated by industry experts", "Cross-border executive access", "Structured discussion format", "Same curation standards"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

const pastBoardrooms = [
  { sponsor: "Confluent | AWS", venue: "Ritz Carlton DIFC", date: "25 Nov", city: "Dubai" },
  { sponsor: "Strategy", venue: "Crowne Plaza", date: "19 Nov", city: "Riyadh" },
  { sponsor: "OutSystems", venue: "Dana Rayhaan by Rotana", date: "18 Nov", city: "Dammam" },
  { sponsor: "Commvault | GBM", venue: "Ritz Carlton DIFC", date: "18 Nov", city: "Dubai" },
  { sponsor: "Finastra", venue: "Voco Riyadh", date: "29 Oct", city: "Saudi Arabia" },
  { sponsor: "CleverTap", venue: "Jumeirah Messilah Beach", date: "29 Oct", city: "Kuwait" },
  { sponsor: "SecurityScorecard", venue: "Grand Hyatt", date: "29 Oct", city: "Abu Dhabi" },
  { sponsor: "GBM | Cisco", venue: "St. Regis Downtown", date: "23 Oct", city: "Dubai" },
  { sponsor: "GBM | Fortinet", venue: "One&Only One Za'abeel", date: "09 Oct", city: "Dubai" },
  { sponsor: "Freshworks", venue: "Ritz-Carlton", date: "Dec", city: "Abu Dhabi" },
  { sponsor: "Celonis", venue: "Executive Boardroom", date: "Oct", city: "Riyadh" },
  { sponsor: "Kissflow", venue: "Executive Boardroom", date: "Jul", city: "Dubai" },
];

const upcomingBoardrooms = [
  { title: "Cybersecurity Leadership Boardroom", location: "Kuwait City, Kuwait", topic: "National Cyber Resilience & GCC Threat Landscape", quarter: "Q2 2026", type: "Physical" },
  { title: "Data & AI Strategy Boardroom", location: "Dubai, UAE", topic: "Regulated AI Deployment & Data Governance", quarter: "Q2 2026", type: "Virtual" },
  { title: "OT Security Roundtable", location: "Riyadh, Saudi Arabia", topic: "Critical Infrastructure Protection", quarter: "Q3 2026", type: "Physical" },
  { title: "Digital Transformation Boardroom", location: "Doha, Qatar", topic: "Enterprise Digital Strategy for Government", quarter: "Q3 2026", type: "Physical" },
];

const titles = [
  "CISO", "CDO", "Chief Digital Officer", "VP Engineering",
  "Minister of Digital Economy", "Head of Cybersecurity",
  "Chief Information Officer", "Director of OT Security",
  "Chief Data Officer", "VP Technology", "CTO", "COO",
];

export default function NetworkFirstPage() {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const formatRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const upcomingRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });
  const formatInView = useInView(formatRef, { once: true, margin: "-50px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-50px" });
  const trackInView = useInView(trackRef, { once: true, margin: "-50px" });
  const upcomingInView = useInView(upcomingRef, { once: true, margin: "-50px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });

  return (
    <div style={{ background: "#07060A", minHeight: "100vh" }}>
      <Navigation />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${S3}/networkfirst-boardrooms/6cbebbd9-21cd-44ad-9bd6-4897f37beec1.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.3) saturate(0.8)",
          }}
        />
        
        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, rgba(7,6,10,0.95) 0%, rgba(7,6,10,0.7) 50%, rgba(201,147,90,0.15) 100%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            maxWidth: 1320,
            margin: "0 auto",
            padding: "160px clamp(20px, 4vw, 60px) 100px",
            width: "100%",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}
          >
            <span style={{ width: 40, height: 1, background: AMBER }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: AMBER,
              }}
            >
              NetworkFirst Boardrooms
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(42px, 6vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              color: "#fff",
              margin: "0 0 12px",
              maxWidth: 900,
            }}
          >
            Where the GCC&apos;s
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(42px, 6vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              color: AMBER,
              margin: "0 0 32px",
              maxWidth: 900,
            }}
          >
            Most Senior Leaders Meet Behind Closed Doors
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(16px, 1.4vw, 20px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 0 48px",
            }}
          >
            Exclusive executive roundtables for CISOs, CDOs, CTOs, and government strategists. 
            Invitation only. Since 2023.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16 }}
          >
            <Link
              href="#request"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 36px",
                borderRadius: 60,
                background: AMBER,
                color: "#07060A",
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
            >
              Request an Invitation
              <span>→</span>
            </Link>
            <Link
              href="#host"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 36px",
                borderRadius: 60,
                background: "transparent",
                border: `1px solid ${AMBER}50`,
                color: "#fff",
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
            >
              Host a Boardroom
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        style={{
          background: "#0A0A0A",
          borderTop: `1px solid ${AMBER}20`,
          borderBottom: `1px solid ${AMBER}20`,
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "60px clamp(20px, 4vw, 60px)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
          className="stats-grid"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
              style={{ textAlign: "center" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 4vw, 52px)",
                  fontWeight: 800,
                  color: AMBER,
                  margin: "0 0 8px",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          THE FORMAT - HOW WE CONVENE
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={formatRef}
        style={{
          background: "#07060A",
          padding: "clamp(80px, 10vw, 140px) clamp(20px, 4vw, 60px)",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={formatInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: AMBER,
              }}
            >
              How We Convene
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                color: "#fff",
                margin: "16px 0 0",
              }}
            >
              Two Formats. One Standard.
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 32,
            }}
            className="format-grid"
          >
            {formats.map((format, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={formatInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.15 }}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${AMBER}20`,
                  borderRadius: 20,
                  padding: 40,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: `${AMBER}15`,
                    border: `1px solid ${AMBER}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: AMBER,
                    marginBottom: 24,
                  }}
                >
                  {format.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 12px",
                  }}
                >
                  {format.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.7,
                    margin: "0 0 24px",
                  }}
                >
                  {format.description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {format.features.map((feature, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: AMBER,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 14,
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: `${AMBER}90`,
                    }}
                  >
                    Chatham House Rule
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PHOTO GALLERY - INSIDE THE ROOM
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={galleryRef}
        style={{
          background: "#0A0A0A",
          padding: "clamp(80px, 10vw, 140px) 0",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: AMBER,
              }}
            >
              Proof, Not Promises
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                color: "#fff",
                margin: "16px 0 0",
              }}
            >
              Inside the Room
            </h2>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 4,
          }}
          className="gallery-grid"
        >
          {BOARDROOM_IMAGES.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={galleryInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
              style={{
                position: "relative",
                aspectRatio: "4 / 3",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${S3}/networkfirst-boardrooms/${img.id}.jpg`}
                alt={img.caption}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 16,
                }}
                className="gallery-overlay"
              >
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    color: "#fff",
                  }}
                >
                  {img.caption}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRACK RECORD - PAST BOARDROOMS
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={trackRef}
        style={{
          background: "#07060A",
          padding: "clamp(80px, 10vw, 140px) clamp(20px, 4vw, 60px)",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={trackInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: AMBER,
              }}
            >
              Track Record
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                color: "#fff",
                margin: "16px 0 0",
              }}
            >
              Past Boardrooms
            </h2>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                marginTop: 12,
              }}
            >
              100+ executive roundtables delivered across the GCC since 2023
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
            className="track-grid"
          >
            {pastBoardrooms.map((boardroom, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={trackInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: 20,
                  transition: "all 0.3s ease",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 8px",
                  }}
                >
                  {boardroom.sponsor}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    margin: "0 0 12px",
                  }}
                >
                  {boardroom.venue}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      color: AMBER,
                    }}
                  >
                    {boardroom.date}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {boardroom.city}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          UPCOMING BOARDROOMS
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={upcomingRef}
        style={{
          background: "#0A0A0A",
          padding: "clamp(80px, 10vw, 140px) clamp(20px, 4vw, 60px)",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={upcomingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: AMBER,
              }}
            >
              What&apos;s Next
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                color: "#fff",
                margin: "16px 0 0",
              }}
            >
              Upcoming Boardrooms
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
            }}
            className="upcoming-grid"
          >
            {upcomingBoardrooms.map((boardroom, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={upcomingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
                style={{
                  background: "linear-gradient(135deg, rgba(201,147,90,0.08) 0%, rgba(201,147,90,0.02) 100%)",
                  border: `1px solid ${AMBER}25`,
                  borderRadius: 16,
                  padding: 32,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: AMBER,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {boardroom.quarter}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: boardroom.type === "Physical" ? "#4ADE80" : "#60A5FA",
                      background: boardroom.type === "Physical" ? "rgba(74,222,128,0.1)" : "rgba(96,165,250,0.1)",
                      padding: "4px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {boardroom.type}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 8px",
                  }}
                >
                  {boardroom.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    margin: "0 0 4px",
                  }}
                >
                  {boardroom.location}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    margin: "0 0 20px",
                  }}
                >
                  {boardroom.topic}
                </p>
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: AMBER,
                    textDecoration: "none",
                  }}
                >
                  Request Invitation
                  <span>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PARTICIPANT TITLES
          ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#07060A",
          padding: "60px clamp(20px, 4vw, 60px)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              margin: "0 0 20px",
            }}
          >
            Past Participants Include
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px 32px",
            }}
          >
            {titles.map((title, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: `${AMBER}70`,
                }}
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        id="request"
        style={{
          background: `linear-gradient(135deg, ${AMBER}15 0%, #07060A 50%)`,
          padding: "clamp(80px, 10vw, 120px) clamp(20px, 4vw, 60px)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 16px",
              }}
            >
              Ready to Join the Room?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 17,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                margin: "0 0 40px",
              }}
            >
              Whether you&apos;re a senior executive seeking an invitation to our closed-door sessions, 
              or a brand looking to host a boardroom — we&apos;d like to hear from you.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "18px 40px",
                  borderRadius: 60,
                  background: AMBER,
                  color: "#07060A",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
              >
                Request an Invitation
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                id="host"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "18px 40px",
                  borderRadius: 60,
                  background: "transparent",
                  border: `1px solid ${AMBER}50`,
                  color: "#fff",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
              >
                Become a Sponsor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Responsive Styles */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .format-grid {
            grid-template-columns: 1fr !important;
          }
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .track-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .upcoming-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .track-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .gallery-grid > div:hover .gallery-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
