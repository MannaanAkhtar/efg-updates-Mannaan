"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Footer } from "@/components/sections";
import SectionTransition from "@/components/effects/SectionTransition";
import { submitForm } from "@/lib/form-helpers";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const PAD = "0 clamp(20px, 4vw, 60px)";
const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const stats = [
  { value: 7,    suffix: "+", label: "Years Running", comma: false },
  { value: 5000, suffix: "+", label: "Attendees",     comma: true  },
  { value: 200,  suffix: "+", label: "Speakers",      comma: false },
  { value: 12,   suffix: "",  label: "Cities",        comma: false },
  { value: 50,   suffix: "+", label: "Partners",      comma: false },
];

const cities = [
  "Dubai", "Riyadh", "Kuwait City", "Doha",
  "Abu Dhabi", "Muscat", "Bahrain", "Jeddah",
];

const values = [
  {
    title: "Precision Over Volume",
    description:
      "We don't fill rooms. We build them. Every attendee is senior. Every speaker is vetted. Every agenda is engineered for genuine, lasting impact.",
    number: "01",
  },
  {
    title: "Trust as Infrastructure",
    description:
      "Technology leaders return to our events year after year because trust is not a feature of what we do — it is the foundation.",
    number: "02",
  },
  {
    title: "Global Reach, Local Depth",
    description:
      "We combine worldwide reach with deep local understanding — every market we enter, we immerse in its nuances and ambitions.",
    number: "03",
  },
  {
    title: "Always Forward",
    description:
      "Each series, each summit — we are looking at what is coming next and building the room for that conversation before anyone else does.",
    number: "04",
  },
];

type Member = { name: string; role: string; initials: string; photo?: string; isFounder?: boolean; photoPos?: string };

// All team members including founders
const teamMembers: Member[] = [
  // Leadership
  { name: "Yasir", role: "Chief Growth Partner", initials: "Y", photo: `${S3}/yasir.jpeg?v=2` },
  { name: "Shyam", role: "Chief Growth Partner", initials: "S", photo: `${S3}/shyam.jpg?v=3` },
  { name: "Ateeq", role: "Marketing Head", initials: "A", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/team/ateeq.png" },
  // Partnership
  { name: "Mohammed Hassan", role: "Partnership Manager", initials: "MH", photo: `${S3}/hassan.jpg`, photoPos: "top" },
  { name: "Mohammed Danish", role: "Partnership Manager", initials: "MD", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/team/danish.png" },
  { name: "Mayur Methi", role: "Partnership Manager", initials: "MM", photo: `${S3}/Mayur-Methi.png` },
  { name: "Kausar Noor", role: "Partnership Manager", initials: "KN", photo: "/team/noor-kauser.jpg" },
  // Delegate Acquisition
  { name: "Mary", role: "Delegate Acquisition", initials: "M", photo: `${S3}/Mary.jpg` },
  { name: "Rajan", role: "Delegate Acquisition", initials: "R", photo: "/team/rajan.jpg" },
  { name: "Afra Sait", role: "Delegate Acquisition", initials: "AS", photo: `${S3}/Afra-Sait.jpeg` },
  { name: "Mriggashi Mohini", role: "Delegate Acquisition", initials: "MM", photo: `${S3}/Mriggashi-Mohini.jpeg?v=2` },
  { name: "Stephen D'Souza", role: "Delegate Acquisition", initials: "SD", photo: `${S3}/stephen.jpg`, photoPos: "top" },
  { name: "Jacqueline Fernandez", role: "Delegate Acquisition", initials: "JF", photo: `${S3}/Jacqueline-Fernandez.jpg?v=2` },
  { name: "Nadim Pirani", role: "Delegate Acquisition", initials: "NP", photo: `${S3}/Nadim-Pirani.jpg?v=2` },
  { name: "Neha Gokarn", role: "Delegate Acquisition", initials: "NG", photo: `${S3}/Neha-Gokarn.jpg` },
  // Operations
  { name: "Mini", role: "Operations", initials: "M", photo: `${S3}/Mini.jpg` },
  // Producer
  { name: "Sanjana Venugopal", role: "Producer", initials: "SV", photo: `${S3}/Sanjana-Venugopal-new.jpg` },
  { name: "Harini", role: "Producer", initials: "H", photo: `${S3}/Harini.jpg` },
  // Marketing & Tech
  { name: "Syed Asad", role: "Marketing & Tech", initials: "SA", photo: `${S3}/Syed-Asad.jpg` },
  { name: "Mannan Akhtar", role: "Marketing & Tech", initials: "MA", photo: `${S3}/Mannan-Akhtar.jpg?v=2` },
];

// Fun team photos (candid shots)
const funPhotos = [
  `${S3}/team-fun-1.jpg`,
  `${S3}/team-fun-2.jpg`,
  `${S3}/team-fun-3.jpg`,
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

function SectionLabel({ text, centered }: { text: string; centered?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
      style={{ marginBottom: 16 }}
    >
      <span style={{ width: 30, height: 1, background: "var(--orange)", flexShrink: 0 }} />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "var(--orange)",
          fontFamily: "var(--font-outfit)",
        }}
      >
        {text}
      </span>
      {centered && (
        <span style={{ width: 30, height: 1, background: "var(--orange)", flexShrink: 0 }} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — HERO (Clean, no founders)
// ─────────────────────────────────────────────────────────────────────────────

function AboutHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "var(--black)", minHeight: "70vh", display: "flex", alignItems: "center" }}
    >
      {/* Ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,101,26,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 90% 10%, rgba(124,58,237,0.04) 0%, transparent 50%)
          `,
        }}
      />

      <div
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          paddingTop: "clamp(120px, 14vw, 170px)",
          paddingBottom: "clamp(56px, 7vw, 80px)",
          position: "relative",
          zIndex: 10,
          width: "100%",
        }}
      >
        {/* Top row: label + EST */}
        <div className="flex items-center justify-between" style={{ marginBottom: 32 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <SectionLabel text="About Events First Group" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--white-muted)",
            }}
          >
            Est. 2023 · Dubai
          </motion.span>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(42px, 7vw, 88px)",
            letterSpacing: "-3px",
            color: "var(--white)",
            lineHeight: 1.05,
            margin: "0 0 clamp(24px, 4vw, 40px)",
            maxWidth: 900,
          }}
        >
          The Story Behind
          <br />
          the{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #FFFFFF 0%, #E8651A 40%, #FF7A2E 70%, #FFFFFF 100%)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "heroShimmer 6s ease-in-out infinite alternate",
            }}
          >
            Summits.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(16px, 2vw, 20px)",
            fontWeight: 300,
            color: "var(--white-muted)",
            lineHeight: 1.7,
            maxWidth: 600,
          }}
        >
          We're a team of passionate individuals who believe that the right conversations,
          in the right rooms, can change industries. And we have a lot of fun doing it.
        </motion.p>
      </div>

      <style jsx global>{`
        @keyframes heroShimmer {
          0%   { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — IMPACT NUMBERS (Pre-triggered)
// ─────────────────────────────────────────────────────────────────────────────

function CountStat({
  value, suffix, label, comma, delay, isInView, startImmediately,
}: {
  value: number; suffix: string; label: string;
  comma: boolean; delay: number; isInView: boolean; startImmediately?: boolean;
}) {
  const [display, setDisplay] = useState(startImmediately ? value : 0);
  const [showSuffix, setShowSuffix] = useState(startImmediately);
  const [hasAnimated, setHasAnimated] = useState(startImmediately);

  useEffect(() => {
    if (hasAnimated || !isInView) return;
    setHasAnimated(true);
    
    const start = Date.now() + delay;
    const duration = 1800;
    const frame = () => {
      const elapsed = Date.now() - start;
      if (elapsed < 0) { requestAnimationFrame(frame); return; }
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.floor(easeOutExpo(progress) * value));
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setDisplay(value);
        if (suffix) setTimeout(() => setShowSuffix(true), 50);
      }
    };
    requestAnimationFrame(frame);
  }, [isInView, value, delay, suffix, hasAnimated]);

  return (
    <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(32px, 4vw, 48px)",
          letterSpacing: "-1.5px",
          color: "var(--white)",
          lineHeight: 1,
        }}
      >
        {comma ? display.toLocaleString() : display}
        {suffix && (
          <span
            style={{
              color: "var(--orange)",
              opacity: showSuffix ? 1 : 0,
              transform: showSuffix ? "scale(1)" : "scale(1.4)",
              display: "inline-block",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "var(--white-muted)",
          margin: "7px 0 0",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function AboutImpact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "100px" }); // Trigger earlier

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black-light)",
        padding: "40px 0",
        borderTop: "1px solid var(--gray-border)",
        borderBottom: "1px solid var(--gray-border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* City names watermark - more visible */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0, overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px 40px",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 40px",
            opacity: 0.08,
          }}
        >
          {[...cities, ...cities].map((city, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(20px, 3vw, 36px)",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              {city}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <div className="about-stats-row">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && (
                <div
                  className="about-stat-divider"
                  style={{
                    width: 1,
                    height: 40,
                    background: "var(--gray-border)",
                    margin: "0 clamp(20px, 3vw, 48px)",
                    flexShrink: 0,
                  }}
                />
              )}
              <CountStat {...stat} delay={i * 100} isInView={isInView} />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .about-stats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .about-stats-row {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr);
            gap: 32px !important;
            justify-items: center;
          }
          .about-stats-row > div:last-child { grid-column: span 2; }
          .about-stat-divider { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — OUR STORY
// ─────────────────────────────────────────────────────────────────────────────

function AboutStory() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(60px, 8vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", padding: PAD }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center" }}
        >
          <SectionLabel text="Our Story" centered />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.15,
              margin: "0 0 32px",
            }}
          >
            Built for the Leaders
            <br />
            Who Build the Future
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, textAlign: "left" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "clamp(15px, 1.4vw, 17px)", fontWeight: 300, lineHeight: 1.85, color: "var(--white-muted)" }}>
              Events First Group was founded in 2023 with a clear conviction: senior
              technology leaders deserved events built specifically for their world —
              their challenges, their ambitions, their vision.
            </p>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "clamp(15px, 1.4vw, 17px)", fontWeight: 300, lineHeight: 1.85, color: "var(--white-muted)" }}>
              We built EFG from the ground up — from relationships forged in boardrooms
              across Dubai, Riyadh, Kuwait City, and Riyadh, to the agenda-curation philosophy
              that puts practitioner insight above promotional noise.
            </p>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "clamp(15px, 1.4vw, 17px)", fontWeight: 300, lineHeight: 1.85, color: "var(--white-muted)" }}>
              Today, EFG runs four distinct event series across eight annual editions, serving
              a community of over 5,000 technology decision-makers.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — VALUES (Larger text, more visual)
// ─────────────────────────────────────────────────────────────────────────────

function AboutValues() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="values-section"
      style={{
        position: "relative",
        padding: "clamp(80px, 10vw, 120px) 0",
        overflow: "hidden",
      }}
    >
      {/* Animated Gradient Mesh Background */}
      <div className="gradient-mesh" />
      
      {/* Noise texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(48px, 6vw, 72px)" }}
        >
          <SectionLabel text="Our Values" centered />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "-2px",
              color: "var(--white)",
              margin: "0 0 16px",
            }}
          >
            How We Think. How We Build.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "clamp(15px, 1.5vw, 18px)",
              fontWeight: 300,
              color: "var(--white-muted)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            The principles that guide every decision, every event, every relationship.
          </p>
        </motion.div>

        {/* Glassmorphism Values Grid */}
        <div
          className="values-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              className="glass-card"
            >
              <div className="glass-card-inner">
                <span className="card-number">{v.number}</span>
                <h3 className="card-title">{v.title}</h3>
                <p className="card-desc">{v.description}</p>
              </div>
              <div className="glass-card-border" />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .values-section {
          background: linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 50%, #0a0a0a 100%);
        }
        
        .gradient-mesh {
          position: absolute;
          inset: -50%;
          background: 
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(232, 101, 26, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(124, 58, 237, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 50% 20%, rgba(232, 101, 26, 0.08) 0%, transparent 40%),
            radial-gradient(ellipse 40% 40% at 70% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 40%);
          animation: meshFloat 20s ease-in-out infinite;
          filter: blur(60px);
        }
        
        @keyframes meshFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(5%, -3%) rotate(1deg) scale(1.02); }
          50% { transform: translate(-3%, 5%) rotate(-1deg) scale(0.98); }
          75% { transform: translate(-5%, -2%) rotate(0.5deg) scale(1.01); }
        }
        
        .glass-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          cursor: default;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .glass-card:hover {
          transform: translateY(-4px);
        }
        
        .glass-card-inner {
          position: relative;
          padding: clamp(28px, 3.5vw, 40px);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          z-index: 1;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .glass-card:hover .glass-card-inner {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(232, 101, 26, 0.3);
        }
        
        .glass-card-border {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(232, 101, 26, 0) 0%, rgba(232, 101, 26, 0.2) 50%, rgba(124, 58, 237, 0) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        
        .glass-card:hover .glass-card-border {
          opacity: 1;
        }
        
        .card-number {
          display: inline-block;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(36px, 4vw, 48px);
          letter-spacing: -2px;
          background: linear-gradient(135deg, rgba(232, 101, 26, 0.6) 0%, rgba(232, 101, 26, 0.2) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 20px;
          line-height: 1;
        }
        
        .card-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(20px, 2.2vw, 26px);
          letter-spacing: -0.5px;
          color: var(--white);
          margin: 0 0 14px;
          line-height: 1.2;
        }
        
        .card-desc {
          font-family: var(--font-dm-sans);
          font-size: clamp(14px, 1.4vw, 16px);
          font-weight: 300;
          line-height: 1.75;
          color: var(--white-muted);
          margin: 0;
        }
        
        @media (max-width: 640px) {
          .values-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — TEAM (Founders integrated, consistent photos)
// ─────────────────────────────────────────────────────────────────────────────

function TeamMember({ member, index, isInView }: { member: Member; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
      className="team-member"
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: member.isFounder ? 20 : 16,
          overflow: "hidden",
          marginBottom: 12,
          background: member.photo 
            ? "var(--black-card)" 
            : "linear-gradient(135deg, rgba(232,101,26,0.1) 0%, rgba(10,10,10,0.8) 100%)",
          border: member.isFounder ? "2px solid var(--orange)" : "1px solid var(--gray-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: member.photoPos || "center",
              filter: "grayscale(100%)",
              transition: "filter 0.4s ease",
            }}
            className="team-photo"
          />
        ) : (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(24px, 4vw, 36px)",
              color: "rgba(232,101,26,0.3)",
            }}
          >
            {member.initials}
          </span>
        )}
        {member.isFounder && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              background: "var(--orange)",
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "white",
              fontFamily: "var(--font-outfit)",
            }}
          >
            Founder
          </div>
        )}
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "clamp(14px, 1.5vw, 16px)",
          color: "var(--white)",
          margin: "0 0 2px",
        }}
      >
        {member.name}
      </p>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          color: member.isFounder ? "var(--orange)" : "var(--white-muted)",
          letterSpacing: "0.5px",
          margin: 0,
        }}
      >
        {member.role}
      </p>
    </motion.div>
  );
}

function AboutTeam() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(60px, 8vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 56px)" }}
        >
          <SectionLabel text="The People" centered />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              margin: "0 0 12px",
            }}
          >
            Meet the Team
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "clamp(14px, 1.3vw, 16px)",
              fontWeight: 300,
              color: "var(--white-muted)",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            The people who make it happen — from strategy to stage, from the first call to the last handshake. 
            <span style={{ color: "var(--orange)" }}> We work hard and have fun doing it.</span>
          </p>
        </motion.div>

        {/* Team Grid */}
        <div
          className="team-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 20,
          }}
        >
          {teamMembers.map((member, i) => (
            <TeamMember key={member.name} member={member} index={i} isInView={isInView} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .team-member:hover .team-photo {
          filter: grayscale(0%) !important;
        }
        @media (max-width: 1024px) {
          .team-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .team-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .team-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — FUN CULTURE SECTION
// ─────────────────────────────────────────────────────────────────────────────

function FunCulture() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(180deg, var(--black) 0%, var(--black-light) 100%)",
        padding: "clamp(60px, 8vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <SectionLabel text="Life at EFG" centered />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              margin: "0 0 16px",
            }}
          >
            Work Hard. <span style={{ color: "var(--orange)" }}>Play Hard.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "clamp(14px, 1.3vw, 16px)",
              fontWeight: 300,
              color: "var(--white-muted)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            We're a young, energetic team that believes great work happens when people genuinely 
            enjoy being together. From team dinners to spontaneous celebrations, we make sure 
            to have as much fun as we deliver results.
          </p>
        </motion.div>

        {/* Fun emoji/vibe row */}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — CAREERS
// ─────────────────────────────────────────────────────────────────────────────

function CareersSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [about, setAbout] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    padding: "14px 16px",
    borderRadius: 10,
    border: "1px solid var(--gray-border)",
    background: "rgba(255,255,255,0.03)",
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await submitForm({
      type: "careers",
      full_name: fullName,
      email,
      metadata: {
        role_interest: role,
        about: about,
      },
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setFullName("");
      setEmail("");
      setRole("");
      setAbout("");
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  }

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(60px, 8vw, 100px) 0",
        borderTop: "1px solid var(--gray-border)",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <div
          className="careers-split"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "start",
          }}
        >
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <SectionLabel text="Join Our Team" />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 42px)",
                letterSpacing: "-1.5px",
                color: "var(--white)",
                lineHeight: 1.15,
                margin: "0 0 20px",
              }}
            >
              Careers at EFG
            </h2>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(14px, 1.3vw, 16px)",
                fontWeight: 300,
                lineHeight: 1.8,
                color: "var(--white-muted)",
                marginBottom: 24,
              }}
            >
              We&apos;re always looking for sharp, driven people who want to shape the
              future of technology events worldwide. If you thrive in fast-paced
              environments and care about creating experiences that matter — we&apos;d
              love to hear from you.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Work with top technology leaders worldwide",
                "Fast-growing team with real ownership",
                "Based in Dubai, events across the globe",
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-dm-sans)", fontSize: 14, color: "var(--white-muted)" }}>
                  <span style={{ color: "var(--orange)" }}>✓</span> {item}
                </li>
              ))}
            </ul>

          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--gray-border)",
              borderRadius: 20,
              padding: "clamp(24px, 3vw, 32px)",
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "white", marginBottom: 8 }}>
                  Application Received
                </h3>
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, color: "var(--white-muted)", lineHeight: 1.6, marginBottom: 24 }}>
                  Thanks for your interest in joining EFG. We&apos;ll review your application and get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 50,
                    background: "transparent",
                    color: "var(--orange)",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: 500,
                    border: "1px solid var(--orange)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(232,101,26,0.1)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--orange)"; }}
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="careers-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--orange)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--gray-border)"}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--orange)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--gray-border)"}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Role you're interested in"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ ...inputStyle, width: "100%", marginBottom: 16 }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--orange)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--gray-border)"}
                />
                <textarea
                  placeholder="Tell us about yourself"
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  style={{ ...inputStyle, width: "100%", resize: "none" as const, marginBottom: 16 }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--orange)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--gray-border)"}
                />
                {error && (
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "#ef4444", marginBottom: 12 }}>
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "14px 32px",
                    borderRadius: 12,
                    background: submitting ? "rgba(232,101,26,0.5)" : "var(--orange)",
                    color: "white",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 600,
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#FF7A2E"; }}
                  onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = "var(--orange)"; }}
                >
                  {submitting ? "Submitting..." : "Submit Application →"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 860px) {
          .careers-split { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .careers-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <AboutImpact />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
      <FunCulture />
      <CareersSection />
      <Footer />
    </div>
  );
}
// Deploy trigger Mon Mar  2 04:25:40 +04 2026
