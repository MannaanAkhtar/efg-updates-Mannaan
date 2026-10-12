"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, MotionConfig } from "framer-motion";
import { Footer, InquiryForm } from "@/components/sections";
import EventNavigation from "@/components/ui/EventNavigation";
import CpdCertified from "@/components/events/CpdCertified";
import PostEventReports from "./PostEventReports";

/* ─────────────────────────────────────────────────────────────────────────────
   CYBER FIRST UAE 2027 — /events/cyber-first/uae

   Design language: an editorial bento. Material 3 supplies the system (tonal
   containers, a small set of colour roles, large "expressive" shapes, pill
   controls); the layout is maximal — dense asymmetric grids, oversized numerals,
   photography in most rows — and the type is editorial: a heavy grotesk for
   statements with an italic serif for the one word that carries the line.

   Colour roles (dark scheme, seeded from Cyber First cyan):
     primary            #01BBF5   Cyber First cyan
     primary container  #062F42   deep cyan, for quiet tinted tiles
     tertiary           #FF5A45   signal coral, used sparingly as the loud tile
     paper              #EAF1F5   the light container, with ink text
     surface            #0C121A / #121B26 on an #05080D ground

   Every sentence of event copy comes from the "Cyber First UAE 2027 — Website
   Content" brief. Nothing here is invented: there is no venue, city, start time
   or agenda because the brief does not give one.
   ──────────────────────────────────────────────────────────────────────────── */

// ─── Tokens ──────────────────────────────────────────────────────────────────
const CY = "#01BBF5";
const CY_HI = "#7FDFFF";
const CY_CONT = "#062F42";
const CORAL = "#FF5A45";
const PAPER = "#EAF1F5";
// Gold is reserved for the awards row.
const GOLD = "#C9A24B";
const GOLD_HI = "#F1D58A";
const INK = "#05080D";
const ON_LIGHT = "#06131C";
const SURF = "#0C121A";
const SURF_2 = "#121B26";
const LINE = "rgba(255,255,255,0.1)";

const FD = "var(--font-display)";
const FO = "var(--font-outfit)";
const FDM = "var(--font-dm-sans)";
const FS = "var(--font-cfu-serif), Georgia, serif";

const EASE = [0.16, 1, 0.3, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const HERO_VIDEO = `${S3}/hero+videos/Cyber+First+UAE+Website+Video.mp4`;
// The original still is a 2.1 MB PNG, so the poster goes through the image optimiser.
// layout.tsx preloads this exact URL; keep the two in step.
const HERO_POSTER = `/_next/image?url=${encodeURIComponent(`${S3}/heros/cyber+uae+hero+pic.png`)}&w=1200&q=75`;

// Start of the event day in UAE time. The brief gives no start time, so the
// countdown runs to the date and the page never prints an hour.
const EVENT_DATE_ISO = "2027-01-27T00:00:00+04:00";

// Photography from the previous Cyber First UAE edition (Abu Dhabi).
const UAE = `${S3}/Good`;
const PHOTO = {
  audience: `${UAE}/4N8A0065.JPG`,
  keynote: `${UAE}/4N8A0122.JPG`,
  panelWide: `${UAE}/4N8A0160.JPG`,
};

// Stock imagery (Unsplash). Each one was looked at before it went in.
const US = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
const STOCK = {
  // Widths are roughly twice the largest size each tile is shown at; the default (800)
  // covers the small topic tiles.
  storm: US("1651467606797-e1c660cf3fda"),        // Downtown Dubai under storm cloud
  abuDhabiNight: US("1624317937315-0ced8736c9e9", 1920), // Abu Dhabi Corniche skyline after dark (venue band)
  burj: US("1582120031356-35f21bf61055", 900),    // Dubai skyline at night, Burj Khalifa centred
  dataHall: US("1580106815433-a5b1d1d53d85", 1200), // data-centre aisle (the wide topic tile)
  cables: US("1683322499436-f4383dd59f5a", 1200), // patch cables
  refinery: US("1588011930968-eadac80e6a5a"),     // refinery at night
  monitors: US("1708807472445-d33589e6b090"),     // operator at a monitor wall
  containers: US("1494412519320-aa613dfb7738"),   // container yard from above
  circuit: US("1592659762303-90081d34b277"),      // circuit board, dark blue
  chip: US("1667670778881-537035257bd8"),         // abstract cyan hardware
};

// ─── Content (verbatim from the brief) ───────────────────────────────────────
const TAGLINE = ["Securing Innovation", "Protecting Infrastructure", "Enabling Digital Trust"];

const ABOUT = [
  "Securing the UAE’s increasingly connected digital economy.",
  "Strengthening cyber and operational resilience across critical sectors.",
  "Addressing the security implications of Generative AI and Agentic AI.",
  "Protecting critical infrastructure and converged IT/OT environments.",
  "Building greater resilience across cloud, data and digital supply chains.",
  "Advancing digital sovereignty and long-term data protection.",
  "Preparing organisations for post-quantum cybersecurity.",
  "Strengthening detection, response, recovery and business continuity.",
];

const GLANCE = [
  { v: "250+", l: "Senior cybersecurity & technology leaders" },
  { v: "1 Day", l: "Event format" },
  { v: "30+", l: "Industry experts & visionary speakers" },
  { v: "4", l: "High-level leadership panels" },
  { v: "20+", l: "Industry sectors represented" },
  { v: "12+ Hours", l: "Curated conversation & networking" },
];

const FACTS = [
  { v: "USD 820M", l: "UAE cybersecurity market in 2025" },
  { v: "USD 1.51B", l: "Projected cybersecurity market by 2031" },
  { v: "10.66%", l: "Expected CAGR, 2025–2031" },
  { v: "223,800+", l: "Potentially exposed UAE-hosted assets" },
  { v: "200,000+", u: "per day", l: "Reported cyberattacks against strategic sectors" },
  { v: "50%", l: "Critical vulnerabilities reportedly unaddressed for 5+ years" },
  { v: "#5", u: "Globally", l: "UAE ranking in the ITU Global Cybersecurity Index 2024" },
  { v: "265", l: "Entities across vital sectors cited as under continuous monitoring" },
  { v: "140,000+", u: "daily", l: "Threat indicators reportedly identified" },
  { v: "800,000+", l: "Cyber threats cited as analysed by the national cyber operations ecosystem" },
];

const TOPICS: { t: string; img: string; s3?: boolean }[] = [
  { t: "Executive Cyber Leadership & Geopolitical Risk", img: PHOTO.panelWide, s3: true },
  { t: "AI, Agentic AI & Emerging Cyber Threats", img: STOCK.chip },
  { t: "Critical Infrastructure, OT & Industrial Cybersecurity", img: STOCK.refinery },
  { t: "Cloud Security, Data Protection & Digital Sovereignty", img: STOCK.dataHall },
  { t: "Cybersecurity of Digital Supply Chains & Third-Party Risk", img: STOCK.containers },
  { t: "Post-Quantum Cybersecurity & Cryptographic Readiness", img: STOCK.circuit },
  { t: "Incident Response, Cyber Recovery & Business Continuity", img: STOCK.monitors },
  { t: "Operational Resilience & Crisis Management", img: STOCK.storm },
];

const WHY = [
  "Rapid digital transformation is increasing the interdependency between technology, data, infrastructure and essential services.",
  "AI and Agentic AI are creating new opportunities while introducing new attack surfaces and governance challenges.",
  "Critical sectors such as energy, oil & gas, utilities, aviation, telecom and financial services depend on resilient digital and operational environments.",
  "Cloud, data and digital supply-chain dependencies require stronger visibility, governance and resilience.",
  "Cybersecurity is increasingly connected to national security, economic continuity and business operations.",
  "Organisations need to prepare not only to prevent attacks, but also to respond, recover and continue operating when disruption occurs.",
  "The UAE provides a strong environment for government, enterprise, critical infrastructure and technology leaders to collaborate on practical cyber-resilience priorities.",
];

const ROLES = [
  "CIOs, CTOs & Chief Digital Officers",
  "CISOs & Information Security Leaders",
  "Chief Data, AI & Privacy Officers",
  "Cybersecurity & Information Security Directors",
  "Cyber Risk & Technology Risk Leaders",
  "SOC, Threat Intelligence & Incident Response Leaders",
  "AI, Cloud & Data Security Leaders",
  "Digital Transformation & Technology Leaders",
  "GRC, Governance & Compliance Leaders",
  "Business Continuity & Operational Resilience Leaders",
  "OT, ICS & Industrial Cybersecurity Leaders",
  "Critical Infrastructure Security Leaders",
  "Government Cybersecurity & Digital Leaders",
  "Regulators & Cyber Policy Leaders",
  "Enterprise & Security Architects",
];

const INDUSTRIES = [
  "Government & Public Sector",
  "Banking & Financial Services",
  "Insurance",
  "Fintech & Digital Payments",
  "Energy",
  "Oil & Gas",
  "Utilities & Water",
  "Renewables & Clean Energy",
  "Telecommunications",
  "Technology & Software",
  "Aviation & Airports",
  "Transportation & Logistics",
  "Manufacturing & Industrial",
  "Real Estate & Property",
  "Construction & Infrastructure",
  "Retail & E-commerce",
  "Education",
];

// Previous Cyber First sponsors and strategic partners.
const LOGOS = `${S3}/sponsors-logo`;
const SPONSOR_ROWS: { name: string; logo: string }[][] = [
  [
    { name: "Palo Alto Networks", logo: `${LOGOS}/paloalto.png` },
    { name: "SentinelOne", logo: `${LOGOS}/sentinelone.png` },
    { name: "Google Cloud Security", logo: `${LOGOS}/Google-Cloud-Security.png` },
    { name: "Kaspersky", logo: `${LOGOS}/kaspersky.png` },
    { name: "Akamai", logo: `${LOGOS}/Akamai.png` },
    { name: "Secureworks", logo: `${LOGOS}/secureworks.png` },
    { name: "Fortinet", logo: `${LOGOS}/fortinet.png` },
    { name: "OPSWAT", logo: `${LOGOS}/OPSWAT-logo.png` },
    { name: "Anomali", logo: `${LOGOS}/Anomali.png` },
    { name: "Pentera", logo: `${LOGOS}/PENTERA.png` },
  ],
  [
    { name: "HWG", logo: `${LOGOS}/hwg-here-we-go.png` },
    { name: "AmiViz", logo: `${LOGOS}/AmiViz.png` },
    { name: "Paramount", logo: `${LOGOS}/Paramount.png` },
    { name: "Kron Technologies", logo: `${LOGOS}/kron-technologies.png` },
    { name: "Appknox", logo: `${LOGOS}/appknox.png` },
    { name: "Filigran", logo: `${LOGOS}/filigran.png` },
    { name: "Corelight", logo: `${LOGOS}/corelight.png` },
    { name: "ManageEngine", logo: `${LOGOS}/ManageEngine.png` },
    { name: "StarLink", logo: `${LOGOS}/StarLink+-+White+Logo.png` },
    { name: "Bureau Veritas", logo: `${LOGOS}/bureau-veritas.png` },
  ],
];

// Cyber First highlight films. The UAE one plays in the overview section, so the
// highlights player carries the other three.
const UAE_FILM = "AsrScRfgLpA";
const FILMS = [
  { id: "0d_2Itsg6ec", place: "Qatar", note: "Cyber First" },
  { id: "gR-IUI7yJLg", place: "Kuwait", note: "3rd Edition" },
  { id: "wcEeU0UEl0o", place: "Kuwait", note: "Cyber First" },
];

// Delegate testimonials from the Cyber First series (vertical shorts).
const SHORTS = ["jPQFjwuohfI", "c8sPwIo4Pis", "2LoeDNqsem0", "8C61dof_f3s", "2-KXhfSeBdQ", "2IwKmGEfOIo"];

// Previous-edition photography, all from the Cyber First UAE set.
const ALT = {
  panel: "Panel discussion on stage at Cyber First UAE",
  speaker: "A speaker on stage at Cyber First UAE",
  audience: "Delegates in the audience at Cyber First UAE",
  networking: "Delegates networking in the exhibition area at Cyber First UAE",
  award: "Award presentation on stage at Cyber First UAE",
  group: "Group photo on stage at Cyber First UAE",
};
const shot = (n: string, alt: string) => ({ src: `${UAE}/4N8A${n}.JPG`, alt });
// Bento grid, four rows: one large tile with four small beside it (rows 1–2), three medium
// (row 3), four small (row 4). Order matters — index 0 is the large tile, 5–7 the medium ones.
const BENTO: { src: string; alt: string }[] = [
  shot("0290", ALT.panel), shot("9877", ALT.networking), shot("0045", ALT.speaker), shot("9906", ALT.networking), shot("0268", ALT.speaker),
  shot("0037", ALT.panel), shot("0072", ALT.audience), shot("9921", ALT.networking),
  shot("0063", ALT.audience), shot("0203", ALT.award), shot("0143", ALT.speaker), shot("9939", ALT.networking),
];
// Everything else runs in the scrolling strip under the grid; add as many as you like.
const STRIP: { src: string; alt: string }[] = [
  shot("0314", ALT.group), shot("0004", ALT.speaker), shot("9893", ALT.networking), shot("0093", ALT.speaker),
  shot("0281", ALT.panel), shot("9868", ALT.networking), shot("0298", ALT.panel), shot("0235", ALT.award),
  shot("9899", ALT.networking), shot("0115", ALT.speaker), shot("0156", ALT.panel), shot("0342", ALT.award),
  shot("9912", ALT.networking), shot("0162", ALT.panel), shot("0069", ALT.audience), shot("0185", ALT.group),
];
const GALLERY = [...BENTO, ...STRIP];

// Enquiry contacts shown as cards. Only speaking for now; a sponsorship contact can be
// added as another entry and gets its own card beside this one.
const CONTACTS = [
  {
    label: "For speaking enquiries",
    subject: "Speaking enquiry — Cyber First UAE 2027",
    name: "Harini Sudhakar",
    role: "Senior Conference Producer",
    email: "harini@eventsfirstgroup.com",
    photo: `${S3}/about-us-photos/Harini.jpg`,
    linkedin: "https://www.linkedin.com/in/harini-sudhakar-8aa75b214/",
  },
];

// ─── Small pieces ────────────────────────────────────────────────────────────

/** A Material-style "cookie" shape: a circle with soft scalloped lobes. */
const COOKIE = (() => {
  const lobes = 12, r = 46, depth = 4, n = 240;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rad = r + depth * Math.cos(lobes * a);
    d += `${i ? "L" : "M"}${(50 + rad * Math.cos(a)).toFixed(2)} ${(50 + rad * Math.sin(a)).toFixed(2)}`;
  }
  return d + "Z";
})();

function useCountdown(iso: string) {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const target = new Date(iso).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setT({ d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60), s: Math.floor((diff / 1e3) % 60) });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [iso]);
  return t;
}

function Reveal({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, onLight }: { children: React.ReactNode; onLight?: boolean }) {
  return (
    <span className="cfu-eyebrow" style={onLight ? { color: "#0A5E7E" } : undefined}>
      <i style={onLight ? { background: "#0A5E7E" } : undefined} />
      {children}
    </span>
  );
}

/** Jump to the register form and open it on the given tab. */
function goRegister(tab: "pass" | "speaker" | "sponsor") {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("efg:set-form-tab", { detail: tab }));
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };
}

// Supporting partners shown in the hero. Add entries here as they are confirmed:
//   { name: "Partner name", logo: `${S3}/path/to/logo.png` }
// While the list is empty the hero renders nothing for partners.
const SUPPORTING_PARTNERS: { name: string; logo: string }[] = [];

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlayIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
  </svg>
);

// Ticks once a second. Kept as its own component so the tick re-renders these four
// numbers and nothing else.
function Countdown() {
  const cd = useCountdown(EVENT_DATE_ISO);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="cfu-count" suppressHydrationWarning>
      {([["d", "Days"], ["h", "Hrs"], ["m", "Min"], ["s", "Sec"]] as const).map(([k, l]) => (
        <div key={k}><b>{cd ? pad(cd[k]) : "--"}</b><span>{l}</span></div>
      ))}
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="cfu-hero" id="top">
      <div className="cfu-hero-glow" aria-hidden />
      <div className="cfu-wrap cfu-hero-grid">
        {/* Copy */}
        <div className="cfu-hero-copy">
          <div className="cfu-in">
            <span className="cfu-chip cfu-chip--live"><i />9th Edition · Cyber First UAE 2027</span>
          </div>

          <h1 className="cfu-h1 cfu-in" style={{ animationDelay: "0.08s" }}>
            Building the UAE’s <em className="cfu-serif" style={{ color: CY_HI }}>Cyber-Resilient</em> Digital Future
          </h1>

          <div className="cfu-hero-tags cfu-in" style={{ animationDelay: "0.2s" }}>
            {TAGLINE.map((t) => <span key={t} className="cfu-chip">{t}</span>)}
          </div>

          <p className="cfu-hero-lede cfu-in" style={{ animationDelay: "0.28s" }}>
            A senior-level cybersecurity and cyber-resilience platform bringing together government, regulators, CISOs, CIOs, critical infrastructure leaders, financial institutions and technology innovators to shape the UAE’s secure digital future.
          </p>

          <div className="cfu-hero-cta cfu-in" style={{ animationDelay: "0.36s" }}>
            <a href="#register" onClick={goRegister("pass")} className="cfu-btn cfu-btn--primary">Register to attend <Arrow /></a>
            <a href="#overview" className="cfu-btn cfu-btn--tonal">Explore the event</a>
          </div>
        </div>

        {/* Footage tile with the date stamp pinned to its corner. Supporting partners
            take the band underneath once there are any; until then the footage fills it. */}
        <div className="cfu-hero-media cfu-in" style={{ animationDelay: "0.2s" }}>
          <div className="cfu-hero-filmwrap" data-anim>
            <div className="cfu-hero-film">
              <video autoPlay muted loop playsInline preload="metadata" poster={HERO_POSTER} aria-hidden>
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
            </div>
            <div className="cfu-stamp cfu-in-stamp" style={{ animationDelay: "0.6s" }} aria-hidden>
              <svg viewBox="0 0 100 100" className="cfu-stamp-shape"><path d={COOKIE} fill={CORAL} /></svg>
              <div className="cfu-stamp-text"><b>27</b><span>Jan 2027</span></div>
            </div>
          </div>

          {SUPPORTING_PARTNERS.length > 0 && (
            <div className="cfu-partners">
              <span className="cfu-partners-label">Supporting Partners</span>
              <div className="cfu-partners-row">
                {SUPPORTING_PARTNERS.map((p) => (
                  <div key={p.name} className="cfu-partner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={`${p.name} — Supporting Partner of Cyber First UAE 2027`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fact tiles */}
        <div className="cfu-strip cfu-in" style={{ animationDelay: "0.45s" }}>
          <div className="cfu-strip-tile cfu-strip-when cfu-t-cyan">
            <span className="cfu-label">Date &amp; location</span>
            <strong>27 January 2027 <i>UAE</i></strong>
          </div>
          <div className="cfu-strip-tile">
            <span className="cfu-label">Countdown</span>
            <Countdown />
          </div>
          <div className="cfu-strip-tile cfu-t-paper">
            <span className="cfu-label">In one line</span>
            <strong className="cfu-serif" style={{ fontStyle: "italic", fontWeight: 400 }}>Beyond compliance. Ahead of risk.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Ticker ──────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["Beyond compliance", "Ahead of risk", ...TAGLINE];
  const run = [...items, ...items, ...items];
  return (
    <div className="cfu-ticker" aria-hidden data-anim>
      <div className="cfu-ticker-run">
        {run.map((t, i) => (
          <span key={i} className={i % 2 ? "cfu-serif" : undefined}>{t}<i /></span>
        ))}
      </div>
    </div>
  );
}

// ─── Event overview ──────────────────────────────────────────────────────────
// The previous UAE edition's highlight film. It shows as a still with a glass play
// button; the YouTube player (with sound and controls) only loads on click.
function OverviewFilm() {
  const [on, setOn] = useState(false);
  const label = "Cyber First UAE · Event highlights";
  return (
    <div className="cfu-over-film">
      {on ? (
        <iframe
          src={`https://www.youtube.com/embed/${UAE_FILM}?autoplay=1&rel=0`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} aria-label={`Play: ${label}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${UAE_FILM}/maxresdefault.jpg`} alt="" loading="lazy" decoding="async" />
          <span className="cfu-over-film-shade" />
          <span className="cfu-glass-play" data-anim><PlayIcon size={20} /></span>
          <span className="cfu-over-film-label">{label}</span>
        </button>
      )}
    </div>
  );
}

function Overview() {
  return (
    <section className="cfu-sec" id="overview">
      <div className="cfu-wrap">
        <div className="cfu-over">
          <Reveal className="cfu-over-text">
            <Eyebrow>Event overview</Eyebrow>
            <p className="cfu-lead">
              The UAE is rapidly advancing its AI-driven digital economy, powered by AI, cloud, 5G, smart infrastructure and connected systems. As digital dependency grows, cybersecurity is becoming essential to <em className="cfu-serif" style={{ color: CY_HI }}>business continuity, national resilience and digital trust.</em>
            </p>
            <div className="cfu-cols">
              <p>The UAE cybersecurity market is projected to grow from USD 820M in 2025 to USD 1.51B by 2031, while the UAE ranked among the highest-performing countries in the ITU Global Cybersecurity Index 2024.</p>
              <p>With an expanding digital attack surface, the priority is no longer just preventing attacks — it is ensuring the UAE’s digital economy, critical infrastructure and essential services remain secure, trusted and operational.</p>
            </div>
          </Reveal>
          <Reveal className="cfu-over-img cfu-shape-a" delay={0.12}>
            <OverviewFilm />
          </Reveal>
        </div>

        <Reveal>
          <h2 className="cfu-h2" style={{ marginTop: "clamp(56px,7vw,96px)" }}>What the event is <em className="cfu-serif" style={{ color: CY_HI }}>about</em></h2>
        </Reveal>
        <div className="cfu-about">
          {ABOUT.map((t, i) => (
            <Reveal key={t} delay={(i % 4) * 0.06} className={`cfu-about-tile cfu-about-${i + 1}`}>
              <span className="cfu-num">{String(i + 1).padStart(2, "0")}</span>
              <p>{t}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── At a glance ─────────────────────────────────────────────────────────────
function Glance() {
  const cls = ["cfu-t-cyan", "cfu-t-paper", "", "", "cfu-t-cont", "cfu-t-coral"];
  return (
    <section className="cfu-sec cfu-sec--tight">
      <div className="cfu-wrap">
        <Reveal><Eyebrow>At a glance</Eyebrow></Reveal>
        <div className="cfu-glance">
          {GLANCE.map((g, i) => (
            <Reveal key={g.v} delay={i * 0.05} className={`cfu-glance-tile cfu-gl-${i + 1} ${cls[i]}`}>
              <b>{g.v}</b>
              <span>{g.l}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// CPD: the accreditation band is the shared CpdCertified component, exactly as on the
// other event pages. The register section repeats it as the same small chip they use.
const CPD_LOGO = `${S3}/sponsors-logo/CPD.png`;

// ─── Previous sponsors & strategic partners ──────────────────────────────────
function Sponsors() {
  return (
    <section className="cfu-sec cfu-sec--tight">
      <div className="cfu-wrap cfu-wrap--wide">
        <Reveal>
          <div className="cfu-sponsors">
            <span className="cfu-label">Previous sponsors & strategic partners</span>
            {SPONSOR_ROWS.map((row, r) => (
              <div key={r} className="cfu-marquee" data-anim>
                <div className={`cfu-marquee-run ${r ? "cfu-marquee-run--rev" : ""}`}>
                  {[...row, ...row].map((s, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={`${s.name}-${i}`} src={s.logo} alt={i < row.length ? s.name : ""} loading="lazy" decoding="async" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── UAE cybersecurity landscape ─────────────────────────────────────────────
function Landscape() {
  const cls = ["", "cfu-t-cyan", "", "cfu-t-paper", "cfu-t-coral", "", "cfu-t-cont", "", "", "cfu-t-cyan"];
  return (
    <section className="cfu-sec" id="landscape">
      <div className="cfu-wrap">
        <div className="cfu-land">
          <Reveal className="cfu-land-intro">
            <Eyebrow>The UAE cybersecurity landscape</Eyebrow>
            <h2 className="cfu-h2">Why cyber resilience matters <em className="cfu-serif" style={{ color: CY_HI }}>now</em></h2>
            <p>The UAE’s rapid digital transformation is creating significant economic opportunity while also expanding the country’s digital attack surface. Organisations increasingly depend on interconnected environments spanning cloud, AI, data, APIs, IoT, 5G, OT, connected infrastructure and digital supply chains.</p>
            <span className="cfu-label" style={{ marginTop: "auto" }}>Key facts & figures</span>
          </Reveal>
          <Reveal className="cfu-land-img cfu-land-img1" delay={0.08}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={STOCK.burj} alt="Dubai skyline at night with the Burj Khalifa" loading="lazy" decoding="async" />
          </Reveal>
          {FACTS.map((f, i) => (
            <Reveal key={f.v} delay={(i % 3) * 0.06} className={`cfu-fact cfu-fact-${i + 1} ${cls[i]}`}>
              <b>{f.v}{f.u && <small>{f.u}</small>}</b>
              <span>{f.l}</span>
            </Reveal>
          ))}
          <Reveal className="cfu-land-img cfu-land-img2" delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={STOCK.cables} alt="" loading="lazy" decoding="async" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Key topics ──────────────────────────────────────────────────────────────
function Topics() {
  return (
    <section className="cfu-sec" id="topics">
      <div className="cfu-wrap">
        <Reveal className="cfu-head">
          <div>
            <Eyebrow>Key topics</Eyebrow>
            <h2 className="cfu-h2">Eight conversations, <em className="cfu-serif" style={{ color: CY_HI }}>one room</em></h2>
          </div>
          <span className="cfu-head-num">08</span>
        </Reveal>
        <div className="cfu-topics">
          {TOPICS.map((t, i) => (
            <Reveal key={t.t} delay={(i % 4) * 0.06} className={`cfu-topic cfu-topic-${i + 1}`}>
              {t.s3 ? (
                <Image src={t.img} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.img} alt="" loading="lazy" decoding="async" />
              )}
              <div className="cfu-topic-shade" />
              <span className="cfu-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t.t}</h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Cyber First UAE 2027? (the paper block) ─────────────────────────────
function Why() {
  return (
    <section className="cfu-sec" id="why">
      <div className="cfu-wrap">
        <div className="cfu-paper">
          <div className="cfu-why">
            <Reveal className="cfu-why-side">
              <Eyebrow onLight>The case for the room</Eyebrow>
              <h2 className="cfu-h2" style={{ color: ON_LIGHT }}>Why Cyber First UAE <em className="cfu-serif" style={{ color: "#0A7FAB" }}>2027?</em></h2>
              <div className="cfu-why-img cfu-shape-b">
                <Image src={PHOTO.keynote} alt="A speaker on stage at the previous Cyber First UAE" fill sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: "cover", objectPosition: "62% center" }} />
              </div>
            </Reveal>
            <div className="cfu-why-list" role="list">
              {WHY.map((w, i) => (
                <Reveal key={i} delay={0.04 * i} className="cfu-why-row">
                  <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                  <p role="listitem">{w}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Who should attend + industries ──────────────────────────────────────────
function Attend() {
  return (
    <section className="cfu-sec" id="attend">
      <div className="cfu-wrap">
        <div className="cfu-attend">
          <Reveal className="cfu-attend-roles cfu-t-cont">
            <Eyebrow>Who should attend?</Eyebrow>
            <h2 className="cfu-h2">The people who <em className="cfu-serif" style={{ color: CY_HI }}>carry the risk</em></h2>
            <div className="cfu-chips">
              {ROLES.map((r) => <span key={r} className="cfu-chip cfu-chip--role">{r}</span>)}
            </div>
          </Reveal>
          <Reveal className="cfu-attend-img cfu-shape-a" delay={0.1}>
            <Image src={PHOTO.audience} alt="Delegates at the previous Cyber First UAE" fill sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: "cover" }} />
            <div className="cfu-attend-count"><b>15</b><span>leadership<br />roles</span></div>
          </Reveal>
          <Reveal className="cfu-attend-ind">
            <div className="cfu-ind-head">
              <div>
                <Eyebrow>Industries represented</Eyebrow>
                <h2 className="cfu-h2">Seventeen <em className="cfu-serif" style={{ color: CORAL }}>sectors</em></h2>
              </div>
            </div>
            <ul className="cfu-ind">
              {INDUSTRIES.map((n, i) => (
                <li key={n}><span>{String(i + 1).padStart(2, "0")}</span>{n}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Speaking enquiries ──────────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3v-11zm6.5 0h3.8v1.5h.06c.53-1 1.82-1.8 3.64-1.8 3.9 0 4.5 2.4 4.5 5.6v5.7h-4v-5c0-1.2 0-2.75-1.7-2.75s-1.95 1.3-1.95 2.65v5.1h-4v-11z" />
  </svg>
);

// ─── Awards & venue (both still to be announced) ─────────────────────────────
// Two teaser rows in the same shape: a statement tile and a small emblem tile. When
// the categories or the venue are confirmed, each row gets replaced by the real section.
function Awards() {
  return (
    <section className="cfu-sec" id="awards">
      <div className="cfu-wrap">
        <div className="cfu-soon">
          <Reveal className="cfu-soon-lead cfu-soon-lead--awards cfu-t-goldink">
            <div>
              <span className="cfu-label">Awards</span>
              <h2 className="cfu-h2 cfu-h2--xl">Cyber First UAE 2027 Awards <em className="cfu-serif" style={{ color: GOLD_HI }}>coming soon</em></h2>
            </div>
            <p>Award categories and nominations will be announced soon.</p>
          </Reveal>
          <Reveal delay={0.08} className="cfu-soon-mark cfu-t-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <span className="cfu-label">Coming soon</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Venue() {
  return (
    <section className="cfu-venue" id="venue">
      <Image src={STOCK.abuDhabiNight} alt="Abu Dhabi skyline at night" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 78%" }} />
      <div className="cfu-venue-shade" aria-hidden />
      <div className="cfu-wrap">
        <Reveal className="cfu-venue-copy">
          <Eyebrow>Location</Eyebrow>
          <h2 className="cfu-h2 cfu-h2--xl">Abu Dhabi. Venue to be announced <em className="cfu-serif" style={{ color: CY_HI }}>very soon</em></h2>
          <div className="cfu-soon-chips">
            <span className="cfu-chip">27 January 2027</span>
            <span className="cfu-chip">Abu Dhabi, UAE</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function People() {
  return (
    <section className="cfu-sec" id="speakers">
      <div className="cfu-wrap">
        <div className="cfu-reach">
          <Reveal className="cfu-reach-lead cfu-t-cont">
            <div>
              <Eyebrow>Speaking enquiries</Eyebrow>
              <h2 className="cfu-h2 cfu-h2--xl">Speak at Cyber First UAE <em className="cfu-serif" style={{ color: CY_HI }}>2027</em></h2>
            </div>
            <div className="cfu-reach-foot">
              <p>For speaking enquiries, reach our conference producer directly or apply through the form.</p>
              <a href="#register" onClick={goRegister("speaker")} className="cfu-btn cfu-btn--primary">Apply to speak <Arrow /></a>
            </div>
          </Reveal>

          <div className="cfu-reach-cards">
            {CONTACTS.map((c, i) => (
              <Reveal key={c.email} delay={0.08 * (i + 1)} className="cfu-person cfu-t-paper">
                <div className="cfu-person-photo">
                  <Image src={c.photo} alt={c.name} fill sizes="(max-width: 640px) 92vw, 320px" style={{ objectFit: "cover", objectPosition: "center 20%" }} />
                  <span className="cfu-person-tag">{c.label}</span>
                </div>
                <div className="cfu-person-body">
                  <b>{c.name}</b>
                  <span>{c.role}</span>
                </div>
                <div className="cfu-person-actions">
                  <a href={`mailto:${c.email}?subject=${encodeURIComponent(c.subject)}`} className="cfu-btn cfu-btn--ink"><MailIcon />{c.email}</a>
                  <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="cfu-btn cfu-btn--outline-ink"><LinkedInIcon />LinkedIn</a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Highlights from previous events ─────────────────────────────────────────
// One large player with a playlist beside it: picking a film swaps it into the player.
function FilmStage() {
  const [sel, setSel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const film = FILMS[sel];
  const title = `${film.place} · ${film.note}`;
  return (
    <div className="cfu-stage">
      <Reveal className="cfu-stage-screen">
        {playing ? (
          <iframe
            key={film.id}
            src={`https://www.youtube.com/embed/${film.id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play: ${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={film.id} src={`https://i.ytimg.com/vi/${film.id}/maxresdefault.jpg`} alt="" loading="lazy" decoding="async" />
            <span className="cfu-over-film-shade" />
            <span className="cfu-glass-play" data-anim><PlayIcon size={20} /></span>
            <span className="cfu-stage-caption">
              <span className="cfu-label">Event highlights</span>
              <b>{film.place} <em className="cfu-serif">{film.note}</em></b>
            </span>
          </button>
        )}
      </Reveal>

      <div className="cfu-stage-list" role="list">
        {FILMS.map((x, i) => (
          <Reveal key={x.id} delay={0.06 * (i + 1)} className="cfu-stage-row">
            <button
              type="button"
              role="listitem"
              className={`cfu-stage-item ${i === sel ? "is-on" : ""}`}
              aria-current={i === sel ? "true" : undefined}
              aria-label={`Play: ${x.place} · ${x.note}`}
              onClick={() => { setSel(i); setPlaying(true); }}
            >
              <span className="cfu-stage-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${x.id}/mqdefault.jpg`} alt="" loading="lazy" decoding="async" />
                <i><PlayIcon size={12} /></i>
              </span>
              <span className="cfu-stage-text">
                <span className="cfu-num">{String(i + 1).padStart(2, "0")}</span>
                <b>{x.place}</b>
                <span>{x.note}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Short({ id, n }: { id: string; n: number }) {
  const [on, setOn] = useState(false);
  return (
    <div className="cfu-short">
      {on ? (
        <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`} title={`Delegate testimonial ${n}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setOn(true)} aria-label={`Play delegate testimonial ${n}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/oar2.jpg`} alt="" loading="lazy" decoding="async" />
          <span className="cfu-film-shade" />
          <span className="cfu-play"><PlayIcon size={16} /></span>
        </button>
      )}
    </div>
  );
}

function Highlights() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + GALLERY.length) % GALLERY.length)), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  return (
    <section className="cfu-sec" id="highlights">
      <div className="cfu-wrap">
        <Reveal className="cfu-head">
          <div>
            <Eyebrow>Highlights from previous events</Eyebrow>
            <h2 className="cfu-h2">The room, <em className="cfu-serif" style={{ color: CY_HI }}>on film</em></h2>
          </div>
        </Reveal>

        <FilmStage />

        <Reveal>
          <div className="cfu-sub">
            <span className="cfu-label">Delegate testimonials</span>
            <span className="cfu-sub-rule" />
          </div>
        </Reveal>
        <div className="cfu-shorts">
          {SHORTS.map((id, i) => (
            <Reveal key={id} delay={0.05 * i}><Short id={id} n={i + 1} /></Reveal>
          ))}
        </div>

        <Reveal>
          <div className="cfu-sub">
            <span className="cfu-label">Previous event photography</span>
            <span className="cfu-sub-rule" />
          </div>
        </Reveal>
        <div className="cfu-bento">
          {BENTO.map((g, i) => (
            <Reveal key={g.src} delay={(i % 4) * 0.05} className={`cfu-bento-tile ${i === 0 ? "cfu-bento-tile--big" : i >= 5 && i <= 7 ? "cfu-bento-tile--mid" : ""}`}>
              <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo: ${g.alt}`}>
                <Image src={g.src} alt={g.alt} fill sizes={i === 0 ? "(max-width: 1100px) 100vw, 46vw" : "(max-width: 1100px) 50vw, 30vw"} style={{ objectFit: "cover" }} />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Fifth row: the rest of the photos drift past, edge to edge. Hover pauses it. */}
      <div className="cfu-strip-photos" data-anim>
        <div className="cfu-strip-photos-run">
          {[...STRIP, ...STRIP].map((g, i) => {
            const copy = i >= STRIP.length;
            return (
              <button key={`${g.src}-${i}`} type="button" className="cfu-strip-photo" onClick={() => setOpen(BENTO.length + (i % STRIP.length))} aria-label={`Open photo: ${g.alt}`} aria-hidden={copy || undefined} tabIndex={copy ? -1 : undefined}>
                <Image src={g.src} alt={copy ? "" : g.alt} fill sizes="(max-width: 640px) 60vw, 330px" style={{ objectFit: "cover" }} />
              </button>
            );
          })}
        </div>
      </div>

      {open !== null && (
        <div className="cfu-lightbox" role="dialog" aria-modal="true" aria-label={GALLERY[open].alt} onClick={close}>
          <button type="button" className="cfu-lb-btn cfu-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">‹</button>
          <div className="cfu-lb-img" onClick={(e) => e.stopPropagation()}>
            <Image src={GALLERY[open].src} alt={GALLERY[open].alt} fill sizes="92vw" style={{ objectFit: "contain" }} />
          </div>
          <button type="button" className="cfu-lb-btn cfu-lb-next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">›</button>
          <button type="button" className="cfu-lb-btn cfu-lb-close" onClick={close} aria-label="Close">×</button>
        </div>
      )}
    </section>
  );
}

// ─── Register ────────────────────────────────────────────────────────────────
function Register() {
  return (
    <section id="register" className="cfu-register">
      <div className="cfu-wrap" style={{ paddingBottom: 0 }}>
        <Reveal className="cfu-reg-head">
          <h2 className="cfu-h2 cfu-h2--xl">Beyond compliance. <em className="cfu-serif" style={{ color: CY_HI }}>Ahead of risk.</em></h2>
          <div className="cfu-reg-meta">
            <span className="cfu-chip">27 January 2027</span>
            <span className="cfu-chip">UAE</span>
          </div>
        </Reveal>
        <div className="cfu-reg-cpd">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 12, background: `${CY}0f`, border: `1px solid ${CY}30` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CPD_LOGO} alt="CPD certified" loading="lazy" decoding="async" style={{ width: 34, height: 34, display: "block" }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
              <strong style={{ color: CY, fontWeight: 700 }}>CPD Certified Event</strong> · earn up to 7 CPD points.
            </span>
          </div>
        </div>
      </div>
      <div className="cfu-register-wrap">
        <InquiryForm defaultCountry="AE" eventName="Cyber First UAE 2027" labelText="Join us" />
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CyberFirstUAE2027() {
  // Deep links (/s/<code> → …?tab=attend#register): scroll to the hash once the
  // target exists and pre-select the InquiryForm tab. Native hash scrolling is
  // unreliable under the site's smooth scroll.
  useEffect(() => {
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    // The shared form opens on Sponsor; this page leads with delegates, so it
    // opens on Attend unless a link asks for another tab.
    if (!tabParam) window.setTimeout(() => window.dispatchEvent(new CustomEvent("efg:set-form-tab", { detail: "pass" })), 600);
    if (tabParam) {
      const key = tabParam === "attend" ? "pass" : tabParam === "speak" ? "speaker" : tabParam;
      let sent = 0;
      const fire = () => {
        window.dispatchEvent(new CustomEvent("efg:set-form-tab", { detail: key }));
        if (sent++ < 7) window.setTimeout(fire, 400);
      };
      window.setTimeout(fire, 500);
    }
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    let tries = 0;
    const go = () => {
      const el = document.getElementById(id);
      if (!el) { if (tries++ < 20) window.setTimeout(go, 150); return; }
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number; duration?: number }) => void } }).__lenis;
      if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1 });
      else el.scrollIntoView({ behavior: "smooth" });
    };
    window.setTimeout(go, 450);
  }, []);

  // Looping animations and the hero video only run while they are on screen: anything
  // marked data-anim gets data-off when it scrolls out of view (CSS pauses its
  // animations), and the video is paused and resumed the same way.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".cfu [data-anim]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) el.removeAttribute("data-off");
        else el.setAttribute("data-off", "");
        const video = el.querySelector("video");
        if (video) {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      }
    }, { rootMargin: "120px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="cfu">
        <EventNavigation />
        <Hero />
        <Ticker />
        <Overview />
        <Glance />
        <CpdCertified eventName="Cyber First UAE 2027" theme={CY} registerHref="#register" />
        <Sponsors />
        <Landscape />
        <Topics />
        <Why />
        <Attend />
        <Awards />
        <People />
        <Highlights />
        <Venue />
        <Register />
        <Footer />

        {/* Post-event report: bottom-centre sticky note + request modal, as on the other Cyber First pages */}
        <PostEventReports />

        <style jsx global>{`
          .cfu { background: ${INK}; color: #fff; min-height: 100vh; overflow: hidden; overflow: clip; font-family: ${FO}; }
          .cfu-wrap { max-width: clamp(1240px, 62vw, 1560px); margin: 0 auto; padding: 0 clamp(18px, 4vw, 56px); position: relative; }
          /* Top padding is what clears the fixed nav when a nav link lands on the
             section, so the space between sections sits there, not at the bottom. */
          .cfu-sec { padding: clamp(84px, 6.6vw, 100px) 0 clamp(8px, 1.4vw, 20px); position: relative; }
          .cfu-sec--tight { padding-top: 0; }
          /* same outer width as the hero */
          .cfu-wrap--wide { max-width: min(1560px, 94vw); }
          .cfu-serif { font-family: ${FS}; font-style: italic; font-weight: 400; letter-spacing: -0.01em; }

          /* ── Type ── */
          .cfu-h1 { font-family: ${FD}; font-weight: 800; font-size: clamp(36px, min(6.2vw, 8.4vh), 84px); line-height: 0.96; letter-spacing: -0.045em; margin: clamp(12px, 2.4vh, 22px) 0 0; max-width: 13ch; text-wrap: balance; }
          .cfu-h1 .cfu-serif { letter-spacing: -0.02em; }
          .cfu-h2 { font-family: ${FD}; font-weight: 800; font-size: clamp(26px, 3.3vw, 50px); line-height: 1; letter-spacing: -0.04em; margin: 14px 0 0; text-wrap: balance; }
          .cfu-h2--xl { font-size: clamp(30px, 4.6vw, 72px); }
          .cfu-label { font-family: ${FDM}; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
          .cfu-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-family: ${FDM}; font-size: 11.5px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: ${CY_HI}; }
          .cfu-eyebrow i { width: 28px; height: 2px; background: ${CY}; border-radius: 2px; }
          .cfu-num { font-family: ${FDM}; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; opacity: 0.6; }

          /* ── Colour containers ── */
          .cfu-t-cyan { background: ${CY} !important; color: ${ON_LIGHT} !important; border-color: transparent !important; }
          .cfu-t-coral { background: ${CORAL} !important; color: ${ON_LIGHT} !important; border-color: transparent !important; }
          .cfu-t-paper { background: ${PAPER} !important; color: ${ON_LIGHT} !important; border-color: transparent !important; }
          .cfu-t-gold { background: linear-gradient(140deg, #8E6A22 0%, ${GOLD} 28%, #F7E3A6 50%, ${GOLD} 72%, #7E5C1B 100%) !important; color: #1B1305 !important; border-color: rgba(255,236,180,0.55) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.45), 0 22px 60px rgba(201,162,75,0.2); }
          .cfu-t-gold .cfu-label { color: rgba(27,19,5,0.72); }
          .cfu-t-goldink { background: radial-gradient(120% 140% at 0% 0%, rgba(201,162,75,0.2), transparent 55%), #0F0D08 !important; border-color: rgba(241,213,138,0.34) !important; }
          .cfu-t-goldink .cfu-label { color: ${GOLD_HI}; }
          .cfu-t-cont { background: ${CY_CONT} !important; border-color: rgba(127,223,255,0.16) !important; }
          .cfu-t-cyan .cfu-label, .cfu-t-coral .cfu-label, .cfu-t-paper .cfu-label { color: rgba(6,19,28,0.62); }

          /* ── Shapes ── */
          .cfu-shape-a { border-radius: 28px 28px 140px 28px; }
          .cfu-shape-b { border-radius: 120px 28px 28px 28px; }

          /* ── Chips & buttons (pill, Material-style state on hover) ── */
          .cfu-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); font-family: ${FO}; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.92); white-space: nowrap; }
          .cfu-chip--live { border-color: ${CY}; background: rgba(1,187,245,0.14); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; font-size: 11.5px; }
          .cfu-chip--live i { width: 7px; height: 7px; border-radius: 50%; background: ${CY}; box-shadow: 0 0 0 4px rgba(1,187,245,0.25); }
          .cfu-chip--role { white-space: normal; background: rgba(255,255,255,0.07); border-color: rgba(127,223,255,0.22); font-size: 13px; padding: 8px 14px; transition: background 0.25s, transform 0.25s; }
          .cfu-chip--role:hover { background: ${CY}; color: ${ON_LIGHT}; transform: translateY(-2px); }
          .cfu-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 46px; padding: 0 22px; border-radius: 999px; font-family: ${FO}; font-size: 14px; font-weight: 700; letter-spacing: 0.01em; text-decoration: none; border: 1px solid transparent; cursor: pointer; transition: transform 0.25s, box-shadow 0.25s, background 0.25s; }
          .cfu-btn:hover { transform: translateY(-2px); }
          .cfu-btn:focus-visible, .cfu button:focus-visible, .cfu a:focus-visible { outline: 2px solid ${CY_HI}; outline-offset: 3px; }
          .cfu-btn--primary { background: ${CY}; color: ${ON_LIGHT}; box-shadow: 0 14px 34px rgba(1,187,245,0.32); }
          .cfu-btn--primary:hover { background: ${CY_HI}; }
          .cfu-btn--tonal { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.22); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
          .cfu-btn--tonal:hover { background: rgba(255,255,255,0.18); }
          .cfu-btn--ink { background: ${ON_LIGHT}; color: #fff; font-size: 13px; min-height: 42px; padding: 0 18px; }
          .cfu-btn--outline-ink { border-color: rgba(6,19,28,0.3); color: ${ON_LIGHT}; font-size: 13px; min-height: 42px; padding: 0 18px; }

          /* ── Hero ── */
          /* The footage tile keeps the video's own 16:9 shape so nothing is cropped; the band it
             leaves free underneath is where supporting partners go.
             A split bento: copy on ink at the left, the footage in its own tile at the right,
             fact tiles across the bottom. The whole composition is one screen tall on desktop. */
          .cfu-hero { position: relative; min-height: clamp(560px, 100svh, 940px); display: flex; padding: clamp(96px, 13vh, 128px) 0 clamp(14px, 2.4vh, 28px); isolation: isolate; }
          .cfu-hero-glow { position: absolute; inset: 0; z-index: -1; background: radial-gradient(58% 52% at 10% 28%, rgba(1,187,245,0.17) 0%, transparent 70%), radial-gradient(38% 44% at 92% 96%, rgba(255,90,69,0.11) 0%, transparent 70%); }
          .cfu-hero-grid { width: 100%; max-width: min(1560px, 94vw); display: grid; grid-template-columns: minmax(0, 0.86fr) minmax(0, 1fr); grid-template-rows: minmax(0, 1fr) auto; gap: clamp(12px, 2vh, 20px) clamp(28px, 2.8vw, 44px); }
          .cfu-hero-copy { container-type: inline-size; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
          /* sized off the column so the longest line always fits, and off the height so it fits the screen */
          .cfu-hero-copy .cfu-h1 { font-size: clamp(36px, min(11.3cqi, 8.7vh), 88px); max-width: none; margin-top: clamp(12px, 2.6vh, 24px); }
          .cfu-hero-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: clamp(12px, 2.8vh, 26px); }
          .cfu-hero-lede { max-width: 60ch; margin: clamp(10px, 2.2vh, 20px) 0 0; font-size: clamp(14.5px, 1.08vw, 16.5px); line-height: 1.6; color: rgba(255,255,255,0.76); }
          .cfu-hero-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(14px, 3.2vh, 30px); }

          .cfu-hero-media { display: flex; flex-direction: column; justify-content: center; gap: clamp(12px, 2.2vh, 22px); min-width: 0; min-height: 0; }
          .cfu-hero-filmwrap { position: relative; flex: 0 1 auto; aspect-ratio: 16 / 9; max-height: 100%; min-height: 0; }
          .cfu-hero-film { position: absolute; inset: 0; overflow: hidden; border-radius: clamp(56px, 6vw, 96px) 28px 28px 28px; background: ${SURF}; box-shadow: 0 34px 80px rgba(0,0,0,0.55), 0 0 0 1px ${LINE}; }
          .cfu-hero-film video { width: 100%; height: 100%; object-fit: cover; display: block; }
          .cfu-hero-film::after { content: ""; position: absolute; inset: 0; background: linear-gradient(200deg, transparent 55%, rgba(5,8,13,0.45) 100%); pointer-events: none; }
          .cfu-stamp { position: absolute; left: clamp(-22px, -1.4vw, -12px); bottom: clamp(-46px, -5vh, -26px); width: clamp(100px, min(10.5vw, 19vh), 156px); aspect-ratio: 1; display: grid; place-items: center; z-index: 1; }
          .cfu-stamp::before { content: ""; position: absolute; inset: -18%; top: -6%; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,90,69,0.34), transparent); pointer-events: none; }
          .cfu-stamp-shape { position: absolute; inset: 0; width: 100%; height: 100%; animation: cfu-spin 28s linear infinite; will-change: transform; }
          .cfu-stamp-text { position: relative; display: flex; flex-direction: column; align-items: center; color: ${ON_LIGHT}; transform: rotate(-8deg); }
          .cfu-stamp-text b { font-family: ${FD}; font-weight: 800; font-size: clamp(34px, min(3.7vw, 6.6vh), 56px); line-height: 0.9; letter-spacing: -0.05em; }
          .cfu-stamp-text span { font-family: ${FDM}; font-size: clamp(10px, 0.85vw, 12px); font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; margin-top: 4px; }
          @keyframes cfu-spin { to { transform: rotate(360deg); } }
          /* hero entrance — plain CSS so it runs on first paint, before any script loads */
          .cfu-in { animation: cfu-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
          .cfu-in-stamp { animation: cfu-in-stamp 1.1s cubic-bezier(0.16, 1, 0.3, 1) both; }
          @keyframes cfu-in { from { opacity: 0; transform: translateY(18px); } }
          @keyframes cfu-in-stamp { from { opacity: 0; transform: scale(0.7) rotate(-20deg); } }

          /* Supporting partners: only rendered once the list has entries. Transparent, label above the logos. */
          .cfu-partners { display: flex; flex-direction: column; align-items: flex-end; gap: clamp(8px, 1.6vh, 14px); }
          .cfu-partners-label { font-family: ${FDM}; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${CY_HI}; text-decoration: underline; text-underline-offset: 6px; text-decoration-thickness: 1.5px; }
          .cfu-partners-row { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: clamp(14px, 2vw, 30px); }
          .cfu-partner { display: grid; place-items: center; height: clamp(38px, 6.6vh, 56px); }
          .cfu-partner img { height: 100%; width: auto; max-width: clamp(96px, 10vw, 150px); object-fit: contain; }

          .cfu-strip { grid-column: 1 / -1; display: grid; grid-template-columns: 1.35fr 1fr 1.35fr; gap: 10px; }
          .cfu-strip-tile { display: flex; flex-direction: column; justify-content: space-between; gap: 10px; min-height: clamp(78px, 12vh, 104px); padding: 14px 20px; border-radius: 24px; background: ${SURF}; border: 1px solid ${LINE}; }
          .cfu-strip-tile strong { font-family: ${FD}; font-weight: 800; font-size: clamp(18px, 1.7vw, 26px); letter-spacing: -0.035em; line-height: 1.05; }
          .cfu-strip-tile strong.cfu-serif { font-family: ${FS}; font-size: clamp(20px, 1.95vw, 29px); letter-spacing: -0.01em; }
          .cfu-strip-when strong { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; }
          .cfu-strip-when strong i { font-style: normal; font-family: ${FDM}; font-size: 11.5px; font-weight: 700; letter-spacing: 0.16em; padding: 5px 11px; border-radius: 999px; background: ${ON_LIGHT}; color: #fff; }
          .cfu-strip-tile:has(.cfu-count) { align-items: center; text-align: center; }
          .cfu-count { display: flex; justify-content: center; gap: clamp(10px, 1.6vw, 22px); }
          .cfu-count div { display: flex; flex-direction: column; align-items: center; }
          .cfu-count b { font-family: ${FD}; font-weight: 800; font-size: clamp(18px, 1.7vw, 26px); letter-spacing: -0.03em; line-height: 1.05; font-variant-numeric: tabular-nums; }
          .cfu-count span { font-family: ${FDM}; font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-top: 3px; }

          /* ── Ticker ── */
          .cfu-ticker { background: ${CY}; color: ${ON_LIGHT}; overflow: hidden; padding: clamp(10px, 1.1vw, 15px) 0; transform: rotate(-1.2deg) scale(1.03); margin: clamp(26px, 3vw, 44px) 0 0; }
          .cfu-ticker-run { display: flex; width: max-content; animation: cfu-slide 46s linear infinite; will-change: transform; }
          .cfu-ticker-run span { display: inline-flex; align-items: center; font-family: ${FD}; font-weight: 800; font-size: clamp(20px, 2.4vw, 36px); letter-spacing: -0.04em; text-transform: uppercase; white-space: nowrap; }
          .cfu-ticker-run span.cfu-serif { font-family: ${FS}; text-transform: none; font-weight: 400; letter-spacing: -0.01em; }
          .cfu-ticker-run i { display: inline-block; width: 0.42em; height: 0.42em; border-radius: 50%; background: ${ON_LIGHT}; margin: 0 clamp(18px, 2.4vw, 38px); }
          @keyframes cfu-slide { to { transform: translateX(-33.333%); } }

          /* ── Overview ── */
          .cfu-over { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr); gap: clamp(24px, 3.4vw, 52px); align-items: center; }
          .cfu-lead { font-family: ${FD}; font-weight: 700; font-size: clamp(20px, 2.05vw, 31px); line-height: 1.18; letter-spacing: -0.035em; margin: 22px 0 0; }
          .cfu-lead .cfu-serif { letter-spacing: -0.015em; }
          .cfu-cols { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(18px, 2.4vw, 36px); margin-top: clamp(26px, 3vw, 44px); padding-top: clamp(20px, 2.4vw, 32px); border-top: 1px solid ${LINE}; }
          .cfu-cols p { margin: 0; font-size: clamp(14px, 1vw, 15.5px); line-height: 1.65; color: rgba(255,255,255,0.72); }
          .cfu-over-img { position: relative; overflow: hidden; aspect-ratio: 16 / 9; border-radius: 28px; background: ${SURF}; }
          .cfu-over-film { position: absolute; inset: 0; }
          .cfu-over-film button { position: absolute; inset: 0; width: 100%; height: 100%; padding: 0; border: 0; background: none; cursor: pointer; color: #fff; text-align: left; }
          .cfu-over-film img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(0.16,1,0.3,1); }
          .cfu-over-film button:hover img { transform: scale(1.04); }
          .cfu-over-film iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
          .cfu-over-film-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,8,13,0.12) 0%, rgba(5,8,13,0.08) 45%, rgba(5,8,13,0.72) 100%); }
          .cfu-over-film-label { position: absolute; left: clamp(16px, 1.8vw, 24px); bottom: clamp(14px, 1.6vw, 20px); right: 96px; font-family: ${FD}; font-weight: 700; font-size: clamp(14px, 1.2vw, 17px); letter-spacing: -0.02em; }
          /* liquid-glass play button: frosted disc, bright rim, inner shine, soft halo */
          .cfu-glass-play { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: grid; place-items: center; width: clamp(52px, 4.4vw, 64px); aspect-ratio: 1; border-radius: 50%; padding-left: 3px; color: #fff; background: linear-gradient(145deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.12) 48%, rgba(255,255,255,0.22) 100%); border: 1px solid rgba(255,255,255,0.55); backdrop-filter: blur(16px) saturate(1.7); -webkit-backdrop-filter: blur(16px) saturate(1.7); box-shadow: inset 0 1.5px 1px rgba(255,255,255,0.75), inset 0 -10px 18px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.08), 0 14px 40px rgba(0,0,0,0.45); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), background 0.35s, box-shadow 0.35s; }
          .cfu-glass-play::before { content: ""; position: absolute; left: 14%; right: 14%; top: 7%; height: 38%; border-radius: 50%; background: linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0)); filter: blur(1px); pointer-events: none; }
          .cfu-glass-play::after { content: ""; position: absolute; inset: -7px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.28); animation: cfu-pulse 2.6s ease-out infinite; pointer-events: none; }
          .cfu-glass-play svg { position: relative; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.45)); }
          .cfu-over-film button:hover .cfu-glass-play { transform: translate(-50%, -50%) scale(1.08); background: linear-gradient(145deg, rgba(127,223,255,0.62) 0%, rgba(1,187,245,0.34) 50%, rgba(127,223,255,0.46) 100%); box-shadow: inset 0 1.5px 1px rgba(255,255,255,0.8), inset 0 -10px 18px rgba(255,255,255,0.1), 0 16px 46px rgba(1,187,245,0.45); }
          @keyframes cfu-pulse { 0% { transform: scale(0.92); opacity: 0.9; } 100% { transform: scale(1.28); opacity: 0; } }

          .cfu-about { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: clamp(26px, 3vw, 44px); }
          .cfu-about-tile { display: flex; flex-direction: column; justify-content: space-between; gap: 20px; min-height: 140px; padding: 18px 20px; border-radius: 28px; background: ${SURF}; border: 1px solid ${LINE}; transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), background 0.35s; }
          .cfu-about-tile:hover { transform: translateY(-4px); background: ${SURF_2}; }
          .cfu-about-tile p { margin: 0; font-family: ${FD}; font-weight: 600; font-size: clamp(15px, 1.12vw, 17px); line-height: 1.25; letter-spacing: -0.02em; }
          .cfu-about-1 { background: ${CY}; color: ${ON_LIGHT}; border-color: transparent; border-radius: 28px 96px 28px 28px; }
          .cfu-about-1:hover { background: ${CY_HI}; }
          .cfu-about-4 { background: ${CY_CONT}; border-color: rgba(127,223,255,0.16); }
          .cfu-about-6 { background: ${PAPER}; color: ${ON_LIGHT}; border-color: transparent; }
          .cfu-about-6:hover { background: #fff; }
          .cfu-about-7 { background: ${CORAL}; color: ${ON_LIGHT}; border-color: transparent; }
          .cfu-about-7:hover { background: #ff705d; }
          .cfu-about-8 { border-radius: 28px 28px 96px 28px; }

          /* ── At a glance ── */
          .cfu-glance { display: grid; grid-template-columns: repeat(12, 1fr); grid-auto-rows: minmax(112px, auto); gap: 10px; margin-top: 20px; }
          .cfu-glance-tile { display: flex; flex-direction: column; justify-content: space-between; gap: 12px; padding: 18px 20px; border-radius: 28px; background: ${SURF}; border: 1px solid ${LINE}; }
          .cfu-glance-tile b { font-family: ${FD}; font-weight: 800; font-size: clamp(34px, 3.7vw, 56px); line-height: 0.9; letter-spacing: -0.055em; font-variant-numeric: tabular-nums; }
          .cfu-glance-tile span { font-size: clamp(13.5px, 1.05vw, 15.5px); line-height: 1.35; font-weight: 500; opacity: 0.86; max-width: 22ch; }
          .cfu-gl-1 { grid-column: span 5; grid-row: span 2; border-radius: 28px 28px 28px 140px; }
          .cfu-gl-1 b { font-size: clamp(72px, 10vw, 150px); }
          .cfu-gl-1 span { align-self: flex-end; text-align: right; font-size: clamp(14.5px, 1.2vw, 17.5px); font-weight: 600; }
          .cfu-gl-2 { grid-column: span 4; }
          .cfu-gl-3 { grid-column: span 3; }
          .cfu-gl-4 { grid-column: span 2; }
          .cfu-gl-5 { grid-column: span 2; }
          .cfu-gl-6 { grid-column: span 3; border-radius: 28px 28px 96px 28px; }

          /* ── Landscape ── */
          .cfu-land { display: grid; grid-template-columns: repeat(12, 1fr); grid-auto-rows: minmax(124px, auto); gap: 10px; }
          .cfu-land-intro { grid-column: span 5; grid-row: span 2; display: flex; flex-direction: column; gap: 4px; padding: clamp(22px, 2.6vw, 36px); border-radius: 28px; background: ${SURF}; border: 1px solid ${LINE}; }
          .cfu-land-intro p { margin: 14px 0 18px; font-size: clamp(14px, 1vw, 15.5px); line-height: 1.65; color: rgba(255,255,255,0.74); }
          .cfu-land-img { position: relative; overflow: hidden; border-radius: 28px; background: ${SURF}; }
          .cfu-land-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
          .cfu-land-img1 { grid-column: span 3; grid-row: span 2; border-radius: 140px 140px 28px 28px; }
          .cfu-land-img2 { grid-column: span 5; }
          .cfu-fact { display: flex; flex-direction: column; justify-content: space-between; gap: 12px; padding: 18px 20px; border-radius: 28px; background: ${SURF}; border: 1px solid ${LINE}; transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
          .cfu-fact:hover { transform: translateY(-4px); }
          .cfu-fact b { font-family: ${FD}; font-weight: 800; font-size: clamp(28px, 2.7vw, 41px); line-height: 0.95; letter-spacing: -0.05em; display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 10px; font-variant-numeric: tabular-nums; }
          .cfu-fact b small { font-family: ${FS}; font-style: italic; font-weight: 400; font-size: 0.5em; letter-spacing: -0.01em; }
          .cfu-fact span { font-size: clamp(13.5px, 1.05vw, 15.5px); line-height: 1.4; font-weight: 500; opacity: 0.84; max-width: 34ch; }
          .cfu-fact-1 { grid-column: span 4; }
          .cfu-fact-2 { grid-column: span 4; border-radius: 28px 28px 96px 28px; }
          .cfu-fact-3 { grid-column: span 3; }
          .cfu-fact-4 { grid-column: span 5; }
          .cfu-fact-5 { grid-column: span 4; }
          .cfu-fact-6 { grid-column: span 3; }
          .cfu-fact-7 { grid-column: span 3; }
          .cfu-fact-8 { grid-column: span 2; }
          .cfu-fact-9 { grid-column: span 4; }
          .cfu-fact-10 { grid-column: span 7; border-radius: 28px 96px 28px 28px; }
          .cfu-fact-10 b { font-size: clamp(38px, 4.6vw, 72px); }

          /* ── Section head ── */
          .cfu-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: clamp(20px, 2.2vw, 32px); }
          .cfu-head-num { font-family: ${FD}; font-weight: 800; font-size: clamp(56px, 7vw, 108px); line-height: 0.78; letter-spacing: -0.06em; color: transparent; -webkit-text-stroke: 1.5px rgba(127,223,255,0.4); }

          /* ── Topics ── */
          .cfu-topics { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: clamp(150px, min(13.5vw, 23vh), 200px); gap: 10px; grid-template-areas: "a a b c" "a a d d" "e f g h"; }
          .cfu-topic { position: relative; overflow: hidden; border-radius: 28px; background: ${SURF}; display: flex; flex-direction: column; justify-content: space-between; padding: 16px 18px; isolation: isolate; }
          .cfu-topic img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; transition: transform 1.1s cubic-bezier(0.16,1,0.3,1); }
          .cfu-topic:hover img { transform: scale(1.07); }
          .cfu-topic-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(5,8,13,0.5) 0%, rgba(5,8,13,0.12) 38%, rgba(5,8,13,0.9) 100%); transition: background 0.4s; }
          .cfu-topic:hover .cfu-topic-shade { background: linear-gradient(180deg, rgba(1,60,82,0.6) 0%, rgba(1,60,82,0.28) 38%, rgba(5,8,13,0.92) 100%); }
          .cfu-topic .cfu-num { opacity: 1; align-self: flex-start; padding: 6px 11px; border-radius: 999px; background: rgba(5,8,13,0.72); border: 1px solid rgba(255,255,255,0.2); }
          .cfu-topic h3 { margin: 0; font-family: ${FD}; font-weight: 700; font-size: clamp(15px, 1.18vw, 18px); line-height: 1.16; letter-spacing: -0.025em; text-wrap: balance; }
          .cfu-topic-1 { grid-area: a; border-radius: 28px 28px 28px 140px; padding: clamp(22px, 2.6vw, 36px); }
          .cfu-topic-1 h3 { font-size: clamp(22px, 2.3vw, 35px); line-height: 1.02; letter-spacing: -0.04em; max-width: 13ch; padding-left: clamp(0px, 3vw, 44px); }
          .cfu-topic-2 { grid-area: b; } .cfu-topic-3 { grid-area: c; }
          .cfu-topic-4 { grid-area: d; } .cfu-topic-4 h3 { font-size: clamp(17px, 1.5vw, 23px); max-width: 22ch; }
          .cfu-topic-5 { grid-area: e; } .cfu-topic-6 { grid-area: f; } .cfu-topic-7 { grid-area: g; }
          .cfu-topic-8 { grid-area: h; border-radius: 28px 28px 96px 28px; }
          .cfu-topic-8 h3 { padding-right: 30px; }

          /* ── Why (paper block) ── */
          .cfu-paper { background: ${PAPER}; color: ${ON_LIGHT}; border-radius: clamp(28px, 3.4vw, 48px); padding: clamp(24px, 3.2vw, 48px); }
          .cfu-why { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(28px, 5vw, 80px); align-items: stretch; }
          .cfu-why-side { display: flex; flex-direction: column; }
          .cfu-why-img { position: relative; overflow: hidden; margin-top: clamp(22px, 3vw, 40px); flex: 1; min-height: 220px; background: #cfdae1; }
          .cfu-why-row { display: grid; grid-template-columns: clamp(46px, 4.4vw, 68px) 1fr; gap: clamp(12px, 1.6vw, 22px); align-items: start; padding: clamp(11px, 1.3vw, 18px) 0; border-top: 1.5px solid rgba(6,19,28,0.14); }
          .cfu-why-row:first-child { border-top: 0; padding-top: 0; }
          .cfu-why-row span { font-family: ${FS}; font-style: italic; font-size: clamp(30px, 3vw, 46px); line-height: 0.85; color: #0A7FAB; }
          .cfu-why-row p { margin: 0; font-family: ${FD}; font-weight: 600; font-size: clamp(15px, 1.22vw, 18px); line-height: 1.3; letter-spacing: -0.022em; }

          /* ── Attend ── */
          .cfu-attend { display: grid; grid-template-columns: repeat(12, 1fr); gap: 10px; }
          .cfu-attend-roles { grid-column: span 7; padding: clamp(22px, 2.4vw, 34px); border-radius: 28px 28px 28px 140px; border: 1px solid transparent; }
          .cfu-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: clamp(18px, 2vw, 28px); padding-left: clamp(0px, 3vw, 40px); }
          .cfu-attend-img { grid-column: span 5; position: relative; overflow: hidden; min-height: 260px; background: ${SURF}; }
          .cfu-attend-count { position: absolute; left: 16px; top: 16px; display: flex; align-items: center; gap: 12px; padding: 12px 18px 12px 14px; border-radius: 999px; background: ${CORAL}; color: ${ON_LIGHT}; }
          .cfu-attend-count b { font-family: ${FD}; font-weight: 800; font-size: 32px; line-height: 1; letter-spacing: -0.05em; }
          .cfu-attend-count span { font-family: ${FDM}; font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; line-height: 1.25; }
          .cfu-attend-ind { grid-column: span 12; padding: clamp(22px, 2.4vw, 34px); border-radius: 28px; background: ${SURF}; border: 1px solid ${LINE}; }
          .cfu-ind { list-style: none; margin: clamp(18px, 2vw, 26px) 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); column-gap: clamp(18px, 2.4vw, 36px); }
          .cfu-ind li { display: flex; align-items: baseline; gap: 14px; padding: 10px 0; border-top: 1px solid ${LINE}; font-family: ${FD}; font-weight: 600; font-size: clamp(14.5px, 1.08vw, 16.5px); letter-spacing: -0.02em; transition: color 0.25s, padding-left 0.25s; }
          .cfu-ind li:hover { color: ${CY_HI}; padding-left: 6px; }
          .cfu-ind li span { font-family: ${FDM}; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: ${CORAL}; }

          /* ── People ── */
          /* lead tile + one card per contact; a second contact simply adds a second card */
          .cfu-soon { display: grid; grid-template-columns: minmax(0, 1fr) clamp(200px, 22vw, 320px); gap: 10px; align-items: stretch; }
          .cfu-soon-lead { display: flex; flex-direction: column; justify-content: space-between; gap: clamp(28px, 4vw, 56px); min-height: clamp(230px, 22vw, 320px); padding: clamp(24px, 3vw, 44px); border-radius: 28px 28px 140px 28px; border: 1px solid transparent; }
          .cfu-soon-lead--awards { border-radius: 28px 28px 28px 140px; }
          .cfu-soon-lead--awards > p { padding-left: clamp(0px, 4vw, 56px); }
          .cfu-soon-lead .cfu-h2 { max-width: 17ch; }
          .cfu-soon-lead > p { margin: 0; max-width: 44ch; font-size: clamp(14.5px, 1.1vw, 16.5px); line-height: 1.6; opacity: 0.78; }
          /* Venue: a full-bleed night skyline with the line set over it */
          .cfu-venue { position: relative; overflow: hidden; display: flex; align-items: flex-end; min-height: clamp(400px, 44vw, 620px); margin-top: clamp(84px, 6.6vw, 100px); padding: clamp(40px, 6vw, 84px) 0 !important; }
          .cfu-venue > img { z-index: 0; }
          .cfu-venue-shade { position: absolute; inset: 0; background: linear-gradient(180deg, ${INK} 0%, rgba(5,8,13,0.2) 22%, rgba(5,8,13,0.2) 55%, rgba(5,8,13,0.8) 86%, ${INK} 100%), linear-gradient(90deg, rgba(5,8,13,0.72) 0%, rgba(5,8,13,0.1) 62%); }
          .cfu-venue > .cfu-wrap { width: 100%; }
          .cfu-venue-copy { display: flex; flex-direction: column; align-items: flex-start; gap: clamp(16px, 2vw, 26px); }
          .cfu-venue-copy .cfu-h2 { margin: 0; max-width: 16ch; text-shadow: 0 2px 30px rgba(5,8,13,0.6); }
          .cfu-venue .cfu-chip { background: rgba(5,8,13,0.6); }
          .cfu-soon-chips { display: flex; flex-wrap: wrap; gap: 8px; }
          .cfu-soon-mark { position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 24px; border-radius: 28px; border: 1px solid transparent; }
          .cfu-soon-mark svg { position: relative; width: clamp(64px, 7vw, 108px); height: auto; }
          .cfu-soon-mark .cfu-label { position: relative; }
          .cfu-reach { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: stretch; }
          .cfu-reach-lead { display: flex; flex-direction: column; justify-content: space-between; gap: clamp(28px, 4vw, 56px); padding: clamp(24px, 3vw, 44px); border-radius: 28px 28px 28px 140px; border: 1px solid transparent; }
          .cfu-reach-lead .cfu-h2 { max-width: 12ch; }
          .cfu-reach-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px 28px; padding-left: clamp(0px, 4vw, 56px); }
          .cfu-reach-foot p { margin: 0; max-width: 38ch; font-size: clamp(14.5px, 1.1vw, 16.5px); line-height: 1.6; color: rgba(255,255,255,0.78); }
          .cfu-reach-cards { display: flex; gap: 10px; }
          .cfu-person { display: flex; flex-direction: column; gap: 16px; width: clamp(280px, 24vw, 330px); padding: 12px 12px 16px; border-radius: 28px; }
          .cfu-person-photo { position: relative; aspect-ratio: 1 / 1; border-radius: 20px 20px 20px 72px; overflow: hidden; background: #cfdae1; }
          .cfu-person-tag { position: absolute; left: 12px; top: 12px; padding: 7px 12px; border-radius: 999px; background: ${ON_LIGHT}; color: #fff; font-family: ${FDM}; font-size: 10.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
          .cfu-person-body { padding: 0 8px; }
          .cfu-person-body b { display: block; font-family: ${FD}; font-weight: 800; font-size: clamp(22px, 1.9vw, 27px); letter-spacing: -0.04em; line-height: 1.05; }
          .cfu-person-body span { display: block; margin-top: 6px; font-size: 14.5px; font-weight: 500; color: rgba(6,19,28,0.66); }
          .cfu-person-actions { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
          .cfu-person-actions .cfu-btn { width: 100%; justify-content: flex-start; padding: 0 16px; }

          .cfu-sponsors { margin-top: clamp(30px, 3.4vw, 48px); padding-top: clamp(22px, 2.6vw, 34px); border-top: 1px solid ${LINE}; }
          .cfu-marquee { position: relative; overflow: hidden; margin-top: clamp(22px, 2.8vw, 40px); }
          .cfu-marquee::before, .cfu-marquee::after, .cfu-strip-photos::before, .cfu-strip-photos::after { content: ""; position: absolute; top: 0; bottom: 0; width: 7%; z-index: 1; pointer-events: none; }
          .cfu-marquee::before, .cfu-strip-photos::before { left: 0; background: linear-gradient(90deg, ${INK}, transparent); }
          .cfu-marquee::after, .cfu-strip-photos::after { right: 0; background: linear-gradient(270deg, ${INK}, transparent); }
          .cfu-marquee-run { display: flex; align-items: center; gap: clamp(44px, 5.4vw, 92px); width: max-content; animation: cfu-half 58s linear infinite; will-change: transform; padding-right: clamp(44px, 5.4vw, 92px); }
          .cfu-marquee-run--rev { animation-direction: reverse; }
          .cfu-marquee-run img { height: clamp(34px, 3vw, 48px); width: auto; max-width: clamp(150px, 15vw, 220px); object-fit: contain; filter: brightness(0) invert(1); opacity: 0.68; transition: opacity 0.25s; }
          .cfu-marquee-run img:hover { opacity: 1; }
          .cfu-marquee:hover .cfu-marquee-run { animation-play-state: paused; }
          @keyframes cfu-half { to { transform: translateX(-50%); } }

          /* ── Films, shorts, gallery ── */
          /* stage: one 16:9 player, with the playlist as a column of equal tiles beside it */
          .cfu-stage { display: grid; grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr); gap: 10px; align-items: stretch; }
          .cfu-stage-screen { position: relative; overflow: hidden; aspect-ratio: 16 / 9; border-radius: 28px; background: ${SURF}; box-shadow: 0 0 0 1px ${LINE}; }
          .cfu-stage-screen button { position: absolute; inset: 0; width: 100%; height: 100%; padding: 0; border: 0; background: none; cursor: pointer; color: #fff; text-align: left; }
          .cfu-stage-screen img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(0.16,1,0.3,1); }
          .cfu-stage-screen button:hover img { transform: scale(1.04); }
          .cfu-stage-screen iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
          .cfu-stage-screen button:hover .cfu-glass-play { transform: translate(-50%, -50%) scale(1.08); background: linear-gradient(145deg, rgba(127,223,255,0.62) 0%, rgba(1,187,245,0.34) 50%, rgba(127,223,255,0.46) 100%); box-shadow: inset 0 1.5px 1px rgba(255,255,255,0.8), inset 0 -10px 18px rgba(255,255,255,0.1), 0 16px 46px rgba(1,187,245,0.45); }
          .cfu-stage-caption { position: absolute; left: clamp(18px, 2.2vw, 30px); right: clamp(18px, 2.2vw, 30px); bottom: clamp(16px, 2vw, 26px); display: flex; flex-direction: column; gap: 6px; }
          .cfu-stage-caption .cfu-label { color: ${CY_HI}; }
          .cfu-stage-caption b { font-family: ${FD}; font-weight: 800; font-size: clamp(22px, 2.5vw, 38px); line-height: 1; letter-spacing: -0.04em; }
          .cfu-stage-caption b em { color: ${CY_HI}; font-size: 0.92em; margin-left: 0.18em; }
          .cfu-stage-list { display: grid; grid-template-rows: repeat(3, minmax(0, 1fr)); gap: 10px; min-height: 0; }
          .cfu-stage-row { display: flex; min-height: 0; }
          .cfu-stage-item { display: flex; align-items: center; gap: clamp(12px, 1.3vw, 18px); width: 100%; padding: 10px; border-radius: 24px; border: 1px solid ${LINE}; background: ${SURF}; color: #fff; text-align: left; cursor: pointer; transition: background 0.3s, border-color 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1); }
          .cfu-stage-item:hover { background: ${SURF_2}; transform: translateX(-4px); }
          .cfu-stage-item.is-on { background: ${CY_CONT}; border-color: rgba(127,223,255,0.45); }
          .cfu-stage-thumb { position: relative; flex: none; height: 100%; min-height: 64px; aspect-ratio: 16 / 9; max-width: 46%; border-radius: 16px; overflow: hidden; background: ${INK}; }
          .cfu-stage-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
          .cfu-stage-thumb i { position: absolute; left: 8px; bottom: 8px; display: grid; place-items: center; width: 26px; height: 26px; padding-left: 2px; border-radius: 50%; background: rgba(5,8,13,0.72); border: 1px solid rgba(255,255,255,0.35); color: #fff; transition: background 0.3s, color 0.3s; }
          .cfu-stage-item.is-on .cfu-stage-thumb i, .cfu-stage-item:hover .cfu-stage-thumb i { background: ${CY}; color: ${ON_LIGHT}; border-color: transparent; }
          .cfu-stage-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
          .cfu-stage-text .cfu-num { color: ${CY_HI}; opacity: 1; margin-bottom: 3px; }
          .cfu-stage-text b { font-family: ${FD}; font-weight: 800; font-size: clamp(18px, 1.7vw, 25px); line-height: 1.05; letter-spacing: -0.035em; }
          .cfu-stage-text > span:last-child { font-size: clamp(13px, 1vw, 14.5px); color: rgba(255,255,255,0.66); }

          .cfu-short button { position: absolute; inset: 0; width: 100%; height: 100%; padding: 0; border: 0; background: none; cursor: pointer; color: #fff; text-align: left; }
          .cfu-short img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1s cubic-bezier(0.16,1,0.3,1); }
          .cfu-short button:hover img { transform: scale(1.05); }
          .cfu-short iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
          .cfu-film-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,8,13,0.1) 30%, rgba(5,8,13,0.86) 100%); }
          .cfu-play { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; background: ${CY}; color: ${ON_LIGHT}; box-shadow: 0 10px 30px rgba(1,187,245,0.4); transition: transform 0.3s, background 0.3s; padding-left: 3px; }
          .cfu-short button:hover .cfu-play { transform: translate(-50%, -50%) scale(1.08); background: ${CY_HI}; }

          .cfu-sub { display: flex; align-items: center; gap: 18px; margin: clamp(30px, 3.6vw, 52px) 0 clamp(16px, 1.8vw, 22px); }
          .cfu-sub-rule { flex: 1; height: 1px; background: ${LINE}; }
          .cfu-shorts { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
          .cfu-short { position: relative; overflow: hidden; aspect-ratio: 9 / 16; border-radius: 28px; background: ${SURF}; }
          .cfu-shorts > div:nth-child(even) { margin-top: clamp(14px, 2.4vw, 36px); }

          /* Bento gallery, four rows: a large tile with four small ones beside it, a row of three
             medium tiles, a row of four small. The rest of the photos run in the strip below. */
          .cfu-bento { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-auto-rows: clamp(72px, 6.6vw, 104px); grid-auto-flow: dense; gap: 10px; }
          .cfu-bento-tile { position: relative; overflow: hidden; border-radius: 24px; background: ${SURF}; grid-column: span 3; grid-row: span 2; }
          .cfu-bento-tile--big { grid-column: 1 / span 6; grid-row: span 4; border-radius: 28px 28px 28px 120px; }
          .cfu-bento-tile--mid { grid-column: span 4; }
          .cfu-bento-tile button { position: absolute; inset: 0; width: 100%; height: 100%; padding: 0; border: 0; background: none; cursor: zoom-in; }
          .cfu-bento-tile img, .cfu-strip-photo img { transition: transform 1.1s cubic-bezier(0.16,1,0.3,1); }
          .cfu-bento-tile:hover img, .cfu-strip-photo:hover img { transform: scale(1.06); }
          .cfu-strip-photos { position: relative; overflow: hidden; margin-top: 10px; }
          .cfu-strip-photos-run { display: flex; gap: 10px; width: max-content; padding-right: 10px; animation: cfu-half 90s linear infinite; will-change: transform; }
          /* anything scrolled out of view stops animating (see the observer in the page component) */
          .cfu [data-anim][data-off], .cfu [data-anim][data-off] *, .cfu [data-anim][data-off]::after { animation-play-state: paused !important; }
          .cfu-strip-photos:hover .cfu-strip-photos-run, .cfu-strip-photos:focus-within .cfu-strip-photos-run { animation-play-state: paused; }
          .cfu-strip-photo { position: relative; flex: none; height: clamp(150px, 14.4vw, 218px); aspect-ratio: 3 / 2; padding: 0; border: 0; border-radius: 24px; overflow: hidden; background: ${SURF}; cursor: zoom-in; }

          .cfu-lightbox { position: fixed; inset: 0; z-index: 1000; background: rgba(3,5,9,0.94); display: grid; place-items: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
          .cfu-lb-img { position: relative; width: min(92vw, 1500px); height: min(84vh, 1000px); }
          .cfu-lb-btn { position: absolute; z-index: 2; width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); color: #fff; font-size: 28px; line-height: 1; cursor: pointer; display: grid; place-items: center; }
          .cfu-lb-btn:hover { background: ${CY}; color: ${ON_LIGHT}; border-color: transparent; }
          .cfu-lb-prev { left: clamp(10px, 2vw, 28px); top: 50%; transform: translateY(-50%); }
          .cfu-lb-next { right: clamp(10px, 2vw, 28px); top: 50%; transform: translateY(-50%); }
          .cfu-lb-close { right: clamp(10px, 2vw, 28px); top: clamp(10px, 2vw, 28px); }

          /* ── Register ── */
          .cfu-register { position: relative; padding-top: clamp(84px, 6.6vw, 100px); background: linear-gradient(180deg, ${INK} 0%, ${CY_CONT} 46%, ${INK} 100%); }
          .cfu-reg-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px; }
          .cfu-reg-head .cfu-h2 { max-width: 12ch; margin: 0; }
          .cfu-reg-meta { display: flex; gap: 8px; flex-wrap: wrap; }
          .cfu-reg-cpd { display: flex; justify-content: center; margin-top: clamp(22px, 2.6vw, 34px); }
          .cfu-register-wrap { --orange: ${CY}; }
          .cfu-register-wrap #get-involved { background: transparent !important; }
          .cfu-register-wrap #get-involved > .absolute { display: none; }
          .cfu-register-wrap .inquiry-split > div:last-child { background: rgba(8,14,22,0.82) !important; backdrop-filter: blur(26px) saturate(1.2) !important; -webkit-backdrop-filter: blur(26px) saturate(1.2) !important; border: 1px solid rgba(127,223,255,0.2) !important; border-radius: 28px !important; box-shadow: 0 30px 70px rgba(0,0,0,0.5) !important; }
          .cfu-register-wrap button[style*="background: var(--orange)"] { color: ${ON_LIGHT} !important; }
          .cfu-register-wrap .inquiry-split > div:last-child > .absolute { background: radial-gradient(ellipse, rgba(1,187,245,0.12) 0%, transparent 70%) !important; }
          .cfu-register-wrap .inquiry-split svg { color: ${CY_HI}; }

          /* ── Responsive ── */
          @media (max-width: 1100px) {
            .cfu-about { grid-template-columns: repeat(2, 1fr); }
            .cfu-glance { grid-template-columns: repeat(6, 1fr); }
            .cfu-gl-1 { grid-column: span 6; grid-row: span 1; }
            .cfu-gl-2, .cfu-gl-3 { grid-column: span 3; }
            .cfu-gl-6 { grid-column: span 6; }
            .cfu-gl-4, .cfu-gl-5 { grid-column: span 3; }
            .cfu-land { grid-template-columns: repeat(6, 1fr); }
            .cfu-land-intro { grid-column: span 6; grid-row: auto; }
            .cfu-land-img1 { grid-column: span 6; grid-row: auto; min-height: 220px; border-radius: 28px; }
            .cfu-land-img2 { grid-column: span 6; min-height: 200px; }
            .cfu-fact-1, .cfu-fact-2, .cfu-fact-3, .cfu-fact-4, .cfu-fact-5, .cfu-fact-6, .cfu-fact-7, .cfu-fact-8 { grid-column: span 3; }
            .cfu-fact-9, .cfu-fact-10 { grid-column: span 6; }
            .cfu-topics { grid-template-columns: repeat(2, 1fr); grid-template-areas: "a a" "b c" "d d" "e f" "g h"; }
            .cfu-ind { grid-template-columns: repeat(3, 1fr); }
            .cfu-shorts { grid-template-columns: repeat(3, 1fr); }
            .cfu-shorts > div:nth-child(even) { margin-top: 0; }
            .cfu-bento { grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-rows: clamp(84px, 13vw, 130px); }
            .cfu-bento-tile, .cfu-bento-tile--mid { grid-column: span 3; }
            .cfu-bento-tile--big, .cfu-bento-tile:nth-child(8) { grid-column: 1 / span 6; grid-row: span 4; }
            .cfu-bento-tile:nth-child(8) { grid-row: span 3; }
          }
          @media (max-width: 900px) {
            /* hero stacks: copy, then the footage tile, then the fact tiles */
            .cfu-hero { min-height: 0; }
            .cfu-hero-grid { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; row-gap: 26px; }
            .cfu-hero-filmwrap { flex: none; max-height: none; }
            .cfu-hero-film { border-radius: clamp(56px, 12vw, 110px) 28px 28px 28px; }
            .cfu-stamp { left: auto; right: clamp(12px, 3vw, 28px); bottom: auto; top: -30px; width: clamp(92px, 15vw, 128px); }
            .cfu-stamp-text b { font-size: clamp(30px, 5vw, 44px); }
            .cfu-partners { align-items: flex-start; }
            .cfu-partners-row { justify-content: flex-start; }
            .cfu-over, .cfu-why { grid-template-columns: 1fr; }
            .cfu-reach { grid-template-columns: minmax(0, 1fr); }
            .cfu-soon { grid-template-columns: minmax(0, 1fr); }
            .cfu-soon-mark { flex-direction: row; justify-content: flex-start; padding: 18px 22px; }
            .cfu-soon-mark svg { width: 44px; }
            .cfu-soon-lead { min-height: 0; }
            .cfu-attend-roles, .cfu-attend-img { grid-column: span 12; }
            .cfu-attend-img { min-height: 300px; }
            .cfu-stage { grid-template-columns: minmax(0, 1fr); }
            .cfu-stage-list { grid-template-rows: none; grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .cfu-stage-item { flex-direction: column; align-items: stretch; }
            .cfu-stage-thumb { height: auto; max-width: none; width: 100%; }
            .cfu-stage-text { padding: 2px 6px 6px; }
            .cfu-stage-item:hover { transform: translateY(-3px); }
            .cfu-head-num { display: none; }
          }
          @media (max-width: 640px) {
            /* globals.css forces section padding below 640px with !important; these
               two need their own values (the hero must clear the fixed nav). */
            .cfu section.cfu-hero { min-height: 0; padding-top: 108px !important; padding-bottom: 20px !important; }
            .cfu section.cfu-sec--tight { padding-top: 0 !important; }
            .cfu section.cfu-register { padding-bottom: 0 !important; }
            .cfu-hero-grid { row-gap: 22px; }
            .cfu-hero-cta .cfu-btn { flex: 1 1 150px; padding: 0 8px; gap: 6px; font-size: 13px; white-space: nowrap; }
            .cfu-strip { grid-template-columns: 1fr 1fr; }
            .cfu-strip-when { grid-column: span 2; }
            .cfu-strip-tile { min-height: 0; padding: 12px 14px; border-radius: 20px; }
            .cfu-strip-tile strong { font-size: 18px; }
            .cfu-strip-tile strong.cfu-serif { font-size: 18px; }
            .cfu-count { gap: 9px; }
            .cfu-count b { font-size: 17px; }
            .cfu-about, .cfu-cols { grid-template-columns: 1fr; }
            .cfu-about-tile { min-height: 0; gap: 18px; }
            .cfu-glance { grid-template-columns: repeat(2, 1fr); }
            .cfu-gl-1 { grid-column: span 2; }
            .cfu-gl-2, .cfu-gl-3, .cfu-gl-4, .cfu-gl-5 { grid-column: span 1; }
            .cfu-gl-6 { grid-column: span 2; }
            .cfu-land { grid-template-columns: 1fr 1fr; grid-auto-rows: minmax(108px, auto); }
            .cfu-land > * { grid-column: span 1 !important; }
            .cfu-land > .cfu-land-intro, .cfu-land > .cfu-land-img, .cfu-land > .cfu-fact-9, .cfu-land > .cfu-fact-10 { grid-column: span 2 !important; }
            .cfu-fact { padding: 14px 15px; }
            .cfu-fact b { font-size: 24px; }
            .cfu-fact-10 b { font-size: 38px; }
            .cfu-fact span { font-size: 13px; }
            .cfu-topics { grid-auto-rows: 162px; }
            .cfu-topic { padding: 12px 13px; }
            .cfu-topic h3 { font-size: 14px; }
            .cfu-topic-1 h3 { padding-left: 0; font-size: 22px; }
            .cfu-topic-4 h3 { font-size: 16px; }
            .cfu-topic-8 h3 { padding-right: 16px; }
            /* shared form header: let the tab pills drop under the label instead of running off-screen */
            .cfu-register-wrap #get-involved > div:not(.absolute) > div:first-child { flex-wrap: wrap; row-gap: 12px; margin-bottom: 32px !important; }
            .cfu-register-wrap #get-involved > div:not(.absolute) > div:first-child > :first-child { flex: none; white-space: nowrap; }
            .cfu-register-wrap #get-involved > div:not(.absolute) > div:first-child button { padding: 8px 15px !important; }
            .cfu-ind { grid-template-columns: 1fr 1fr; }
            .cfu-chips { padding-left: 0; }
            .cfu-reach-lead { border-radius: 28px; }
            .cfu-soon-lead, .cfu-soon-lead--awards { border-radius: 28px; }
            .cfu-soon-lead--awards > p { padding-left: 0; }
            .cfu-reach-foot { padding-left: 0; }
            .cfu-reach-cards { flex-direction: column; }
            .cfu-person { width: auto; }
            .cfu-person-photo { border-radius: 20px; aspect-ratio: 1 / 1; }
            .cfu-stage-list { grid-template-columns: minmax(0, 1fr); }
            .cfu-stage-item { flex-direction: row; align-items: center; }
            .cfu-stage-thumb { width: 42%; flex: none; }
            .cfu-stage-text { padding: 0; }
            .cfu-shorts { grid-template-columns: repeat(2, 1fr); }
            .cfu-bento { gap: 8px; grid-auto-rows: clamp(56px, 16vw, 84px); }
            .cfu-bento-tile, .cfu-bento-tile--big { border-radius: 20px; }
            .cfu-bento-tile--big, .cfu-bento-tile:nth-child(8) { grid-row: span 3; }
            .cfu-strip-photos { margin-top: 8px; }
            .cfu-strip-photos-run { gap: 8px; padding-right: 8px; animation-duration: 70s; }
            .cfu-strip-photo { height: 128px; border-radius: 20px; }
            .cfu-fact-2, .cfu-fact-10, .cfu-shape-a, .cfu-shape-b, .cfu-gl-1, .cfu-attend-roles, .cfu-topic-1 { border-radius: 28px; }
          }
          @media (max-width: 420px) {
            .cfu-ind { grid-template-columns: 1fr; }
          }
          @media (max-width: 350px) {
            .cfu-topics { grid-auto-rows: 184px; }
            .cfu-topic:not(.cfu-topic-1):not(.cfu-topic-4) h3 { font-size: 13px; }
            .cfu-topic-8 { border-radius: 28px; }
            .cfu-topic-8 h3 { padding-right: 0; }
          }
          /* The shared event nav shows its desktop links from 1024px, where six links plus
             two buttons do not fit: drop the back-to-EFG pill until there is room for it. */
          @media (min-width: 1024px) and (max-width: 1339px) {
            nav .gap-4 > a:first-child:not(:only-child) { display: none !important; }
            nav .gap-4 > a { white-space: nowrap; }
            nav .gap-6 { gap: 16px; }
          }
          @media (prefers-reduced-motion: reduce) {
            .cfu-stamp-shape, .cfu-ticker-run, .cfu-marquee-run, .cfu-strip-photos-run, .cfu-glass-play::after, .cfu-in, .cfu-in-stamp { animation: none; }
            .cfu-strip-photos { overflow-x: auto; }
          }
        `}</style>
      </div>
    </MotionConfig>
  );
}
