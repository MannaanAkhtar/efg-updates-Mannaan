"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";

// ─────────────────────────────────────────────────────────────────────────────
// ALL SPONSOR LOGOS, 99 logos from S3
// ─────────────────────────────────────────────────────────────────────────────

const ALL_LOGOS = [
  // Priority brands first, larger display
  { src: `${S3}/Microsoft_logo.png`, name: "Microsoft", priority: true },
  { src: `${S3}/Oracle.png`, name: "Oracle", priority: true },
  { src: `${S3}/Google-Cloud-Security.png`, name: "Google Cloud Security", priority: true },
  { src: `${S3}/sap-signavio.png`, name: "SAP Signavio", priority: true },
  { src: `${S3}/paloalto.png`, name: "Palo Alto Networks", priority: true },
  { src: `${S3}/kaspersky.png`, name: "Kaspersky", priority: true },
  { src: `${S3}/fortinet.png`, name: "Fortinet", priority: true },
  { src: `${S3}/sentinelone.png`, name: "SentinelOne", priority: true },
  { src: `${S3}/EY.png`, name: "EY", priority: true },
  // Rest alphabetical
  { src: `${S3}/abu-dhabi-university.png`, name: "Abu Dhabi University" },
  { src: `${S3}/Acronis.png`, name: "Acronis" },
  { src: `${S3}/adgm-academy.png`, name: "ADGM Academy" },
  { src: `${S3}/advenica.png`, name: "Advenica" },
  { src: `${S3}/agile.png`, name: "Agile" },
  { src: `${S3}/AIQS.png`, name: "AIQS" },
  { src: `${S3}/Akamai.png`, name: "Akamai" },
  { src: `${S3}/AmiViz.png`, name: "AmiViz" },
  { src: `${S3}/Anomali.png`, name: "Anomali" },
  { src: `${S3}/appknox.png`, name: "Appknox" },
  { src: `${S3}/aris.png`, name: "ARIS" },
  { src: `${S3}/beacon-red.png`, name: "Beacon Red" },
  { src: `${S3}/bitdefender.png`, name: "Bitdefender" },
  { src: `${S3}/BOT-teq.png`, name: "BOT-teq" },
  { src: `${S3}/bureau-veritas.png`, name: "Bureau Veritas" },
  { src: `${S3}/Celonis.png`, name: "Celonis" },
  { src: `${S3}/CEREBRA.png`, name: "Cerebra" },
  { src: `${S3}/Claroty.png`, name: "Claroty" },
  { src: `${S3}/corelight.png`, name: "Corelight" },
  { src: `${S3}/cortelion.png`, name: "Cortelion" },
  { src: `${S3}/CPX.png`, name: "CPX" },
  { src: `${S3}/cyber-shield.png`, name: "Cyber Shield" },
  { src: `${S3}/cyber-talents.png`, name: "CyberTalents" },
  { src: `${S3}/Cybere71.png`, name: "Cyber E71" },
  { src: `${S3}/cyberknight.png`, name: "CyberKnight" },
  { src: `${S3}/cyberwise.png`, name: "Cyberwise" },
  { src: `${S3}/Cyborg-automation-hub.png`, name: "Cyborg Automation Hub" },
  { src: `${S3}/Deepinfo.png`, name: "Deepinfo" },
  { src: `${S3}/Dragos.png`, name: "Dragos" },
  { src: `${S3}/DREAM.png`, name: "DREAM" },
  { src: `${S3}/DTS-solutions.png`, name: "DTS Solutions" },
  { src: `${S3}/edge-group.png`, name: "Edge Group" },
  { src: `${S3}/filigran.png`, name: "Filigran" },
  { src: `${S3}/GBM.png`, name: "GBM" },
  { src: `${S3}/Gen-x-systems.png`, name: "Gen-X Systems" },
  { src: `${S3}/Gorilla.png`, name: "Gorilla" },
  { src: `${S3}/Group-IB.png`, name: "Group-IB" },
  { src: `${S3}/gtb-technologies.png`, name: "GTB Technologies" },
  { src: `${S3}/hackmanac.png`, name: "Hackmanac" },
  { src: `${S3}/hwg-here-we-go.png`, name: "HWG" },
  { src: `${S3}/isaca-uae-chapter.png`, name: "ISACA UAE Chapter" },
  { src: `${S3}/ISRAR.png`, name: "ISRAR" },
  { src: `${S3}/KAfaa.png`, name: "KAfaa" },
  { src: `${S3}/keysight-technologies.png`, name: "Keysight Technologies" },
  { src: `${S3}/kron-technologies.png`, name: "Kron Technologies" },
  { src: `${S3}/ManageEngine.png`, name: "ManageEngine" },
  { src: `${S3}/MCS.png`, name: "MCS" },
  { src: `${S3}/microsec.png`, name: "Microsec" },
  { src: `${S3}/minds-advisory.png`, name: "Minds Advisory" },
  { src: `${S3}/moxo.png`, name: "Moxo" },
  { src: `${S3}/nozomi-networks.png`, name: "Nozomi Networks" },
  { src: `${S3}/OPSWAT-logo.png`, name: "OPSWAT" },
  { src: `${S3}/ot-security-professionals.png`, name: "OT Security Professionals" },
  { src: `${S3}/Paramount.png`, name: "Paramount" },
  { src: `${S3}/PENTERA.png`, name: "Pentera" },
  { src: `${S3}/profit.co.png`, name: "Profit.co" },
  { src: `${S3}/redsand.png`, name: "Red Sand" },
  { src: `${S3}/RICS.png`, name: "RICS" },
  { src: `${S3}/sahara-net.png`, name: "Sahara Net" },
  { src: `${S3}/sechard.png`, name: "Sechard" },
  { src: `${S3}/seclab.png`, name: "SecLab" },
  { src: `${S3}/secureb4.png`, name: "SecureB4" },
  { src: `${S3}/secureworks.png`, name: "Secureworks" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/securonix.jpg", name: "Securonix" },
  { src: `${S3}/sis.png`, name: "SIS" },
  { src: `${S3}/Sonicwall.png`, name: "SonicWall" },
  { src: `${S3}/SS%26C.png`, name: "SS&C" },
  { src: `${S3}/Tenable-logo.png`, name: "Tenable" },
  { src: `${S3}/threatlocker.png`, name: "ThreatLocker" },
  { src: `${S3}/VDITS.png`, name: "VDITS" },
  { src: `${S3}/Wallix.png`, name: "Wallix" },
  { src: `${S3}/Xage.png`, name: "Xage" },
  { src: `${S3}/XONA.png`, name: "XONA" },
  { src: `${S3}/YOKOGAWA.png`, name: "Yokogawa" },
  { src: `${S3}/EC-Council.png`, name: "EC-Council" },
  { src: `${S3}/GAFAI.png`, name: "GAFAI" },
  { src: `${S3}/IPC.png`, name: "IPC" },
  { src: `${S3}/UAE-Cyber-Security-Council.png`, name: "UAE Cyber Security Council" },
  { src: `${S3}/Control-Engineering.png`, name: "Control Engineering" },
  { src: `${S3}/Women-in-Cybersecurity.png`, name: "Women in Cybersecurity" },
  { src: `${S3}/Zanda.png`, name: "Zanda" },
  { src: `${S3}/CSO-Online.png`, name: "CSO Online" },
  { src: `${S3}/Cyber-Defense-Magazi.png`, name: "Cyber Defense Magazine" },
  { src: `${S3}/Cybersecurity-Insiders.png`, name: "Cybersecurity Insiders" },
  { src: `${S3}/Dark-Reading.png`, name: "Dark Reading" },
  { src: `${S3}/Help-Net-Security.png`, name: "Help Net Security" },
  { src: `${S3}/Industrial-Cyber.png`, name: "Industrial Cyber" },
  { src: `${S3}/Industry-Events.png`, name: "Industry Events" },
  { src: `${S3}/Infosecurity-Magazine.png`, name: "Infosecurity Magazine" },
  { src: `${S3}/SC-Media.png`, name: "SC Media" },
  { src: `${S3}/Security-Middle-East.png`, name: "Security Middle East" },
  { src: `${S3}/The-Hacker-News.jpg`, name: "The Hacker News" },
];

// Row 1: priority brands only (first 9), rest split evenly into rows 2 & 3
const ROW_1 = ALL_LOGOS.slice(0, 9);
const remaining = ALL_LOGOS.slice(9);
const half = Math.ceil(remaining.length / 2);
const ROW_2 = remaining.slice(0, half);
const ROW_3 = remaining.slice(half);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SponsorsPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
        padding: "clamp(96px, 8vw, 120px) 0 clamp(40px, 4vw, 60px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            className="flex items-center justify-center gap-3"
            style={{ marginBottom: 16 }}
          >
            <span
              style={{ width: 30, height: 1, background: "var(--orange)" }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--orange)",
                fontFamily: "var(--font-outfit)",
              }}
            >
              Trusted By Industry Leaders
            </span>
            <span
              style={{ width: 30, height: 1, background: "var(--orange)" }}
            />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 48px)",
              color: "var(--white)",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              margin: "16px 0 8px",
            }}
          >
            Our Partners &amp; Sponsors
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "rgba(255,255,255,0.3)",
              lineHeight: 1.6,
              margin: "8px auto 0",
              letterSpacing: "0.2px",
            }}
          >
            Trusted by 80+ strategic sponsors and global technology leaders powering our cybersecurity, AI, and enterprise summits
          </p>
        </div>

        {/* ── MARQUEE, with edge fades ── */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Left fade */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              background:
                "linear-gradient(to right, var(--black) 0%, transparent 100%)",
            }}
          />
          {/* Right fade */}
          <div
            className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              background:
                "linear-gradient(to left, var(--black) 0%, transparent 100%)",
            }}
          />

          {/* Row 1, scrolls left */}
          <div className="sp-marquee-track" style={{ marginBottom: 16 }}>
            <div className="sp-marquee-inner sp-scroll-left" style={{ animationDuration: "80s" }}>
              {[...ROW_1, ...ROW_1].map((logo, i) => (
                <div
                  key={`r1-${i}`}
                  className="sp-logo-item"
                  style={{
                    width: (logo as typeof ROW_1[number] & { priority?: boolean }).priority ? 220 : 180,
                    height: (logo as typeof ROW_1[number] & { priority?: boolean }).priority ? 70 : 56,
                    margin: "0 clamp(14px, 2vw, 28px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: (logo as typeof ROW_1[number] & { priority?: boolean }).priority ? 0.75 : 0.5,
                    cursor: "default",
                    flexShrink: 0,
                    borderRadius: 8,
                    transition: "opacity 0.4s ease, background 0.4s ease",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={`${logo.name}, Events First Group summit sponsor`}
                    loading="lazy"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                      transition: "filter 0.4s ease",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2, scrolls right */}
          <div className="sp-marquee-track" style={{ marginBottom: 16 }}>
            <div className="sp-marquee-inner sp-scroll-right" style={{ animationDuration: "90s" }}>
              {[...ROW_2, ...ROW_2].map((logo, i) => (
                <div
                  key={`r2-${i}`}
                  className="sp-logo-item"
                  style={{
                    width: 180,
                    height: 56,
                    margin: "0 clamp(14px, 2vw, 28px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.5,
                    cursor: "default",
                    flexShrink: 0,
                    borderRadius: 8,
                    transition: "opacity 0.4s ease, background 0.4s ease",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={`${logo.name}, Events First Group summit sponsor`}
                    loading="lazy"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                      transition: "filter 0.4s ease",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 3, scrolls left */}
          <div className="sp-marquee-track">
            <div className="sp-marquee-inner sp-scroll-left" style={{ animationDuration: "85s" }}>
              {[...ROW_3, ...ROW_3].map((logo, i) => (
                <div
                  key={`r3-${i}`}
                  className="sp-logo-item"
                  style={{
                    width: 180,
                    height: 56,
                    margin: "0 clamp(14px, 2vw, 28px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.5,
                    cursor: "default",
                    flexShrink: 0,
                    borderRadius: 8,
                    transition: "opacity 0.4s ease, background 0.4s ease",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={`${logo.name}, Events First Group summit sponsor`}
                    loading="lazy"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                      transition: "filter 0.4s ease",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          style={{ marginTop: 48, textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 16,
              fontWeight: 400,
              color: "#606060",
              marginBottom: 20,
            }}
          >
            Your brand belongs here.
          </p>
          <Link
            href="/sponsors-and-partners"
            className="sp-cta-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 50,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "transparent",
              fontFamily: "var(--font-outfit)",
              fontSize: 14.5,
              fontWeight: 500,
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >
            Become a Partner
            <span style={{ transition: "transform 0.3s ease" }}>→</span>
          </Link>
        </motion.div>
      </div>

      {/* ── STYLES ── */}
      <style jsx global>{`
        .sp-marquee-track {
          overflow: hidden;
        }
        .sp-marquee-inner {
          display: flex;
          width: max-content;
        }
        .sp-scroll-left {
          animation: spScrollLeft linear infinite;
        }
        .sp-scroll-right {
          animation: spScrollRight linear infinite;
        }
        @keyframes spScrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes spScrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        /* Hover, reveal original color + white pill behind dark logos */
        .sp-logo-item:hover {
          opacity: 1 !important;
          background: rgba(255, 255, 255, 0.9) !important;
          padding: 6px 10px;
        }
        .sp-logo-item:hover img {
          filter: none !important;
        }

        /* CTA hover */
        .sp-cta-link:hover {
          border-color: #e8651a !important;
          background: rgba(232, 101, 26, 0.08) !important;
        }
        .sp-cta-link:hover span {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}
