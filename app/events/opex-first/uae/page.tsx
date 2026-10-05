"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Footer, InquiryForm } from "@/components/sections";
import CpdCertified from "@/components/events/CpdCertified";
import OpexReportFab from "@/components/opex-first/OpexReportFab";
import { OpexRequestResourcesModal } from "@/components/opex-first";
import "./page.css";
import {
  submitForm,
  isWorkEmail,
  isValidEmail,
  normalizePhoneDigits,
  validatePhone,
  COUNTRY_CODES,
  type CountryCode,
} from "@/lib/form-helpers";

// ═══════════════════════════════════════════════════════════════════════════
// OPEX First UAE 2027 — 20 January 2027
// Built from the approved Claude Design comp "OPEX First UAE 2027 v2".
// Palette and type come straight from the EFG design tokens; the violet is
// the OPEX First series colour (--opex-first).
// ═══════════════════════════════════════════════════════════════════════════

const BG = "#0E0B1A"; // violet-leaning near-black, not neutral: the gaps between the atmosphere stops fall back to this
const BG_ALT = "rgba(255,255,255,0.022)"; // was a flat #111 slab; translucent so the atmosphere reads through
const BG_CARD = "#171326";
const V = "#7C3AED"; // OPEX First violet
const V_LIGHT = "#B79CFF";
const DIM = "#A0A0A0";
const SOFT = "#C8C8C8";
const RULE = "rgba(255,255,255,0.06)";
const RULE_MID = "rgba(255,255,255,0.12)";
const RULE_BRIGHT = "rgba(255,255,255,0.20)";
const EASE = [0.16, 1, 0.3, 1] as const;

const DISPLAY = "var(--font-display)";
const BODY = "var(--font-outfit)";

const EVENT_DATE = new Date("2027-01-20T09:00:00+04:00");
const EVENT_NAME = "OPEX First UAE 2027";

const HERO_VIDEO =
  "https://efg-final.s3.eu-north-1.amazonaws.com/hero+videos/OPEX+UAE+Website+Video.mp4";

const UNSPLASH = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const HERO_POSTER = UNSPLASH("1578575437130-527eed3abbec", 1280);
// Delegates at the OPEX First KSA edition. Picked over the other six frames
// from the same set because the rest are stage shots carrying legible
// third-party sponsor branding, which has no business behind this copy.
const OPEX_UAE_PHOTOS = "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE";
const OPEX_KSA_PHOTOS = "https://efg-final.s3.eu-north-1.amazonaws.com/events/opex+KSA+few";
// The room at OPEX First UAE — delegates at tables facing the stage.
const ATTEND_BG = `${OPEX_UAE_PHOTOS}/4N8A1848.JPG`;
// A partner stand at OPEX First UAE, mid-conversation with delegates: the
// access a sponsor is actually buying, rather than a stage shot.
const SPONSOR_BG = `${OPEX_UAE_PHOTOS}/4N8A1566.JPG`;

// ─── Supporting partners ───────────────────────────────────────────────────
// Empty until logos are confirmed. The hero strip below reserves its space
// either way, so dropping logos in here never re-flows the hero.
const HERO_PARTNERS: { name: string; logo: string; href?: string }[] = [];

// ═══════════════════════════════════════════════════════════════════════════
// Content — verbatim from the comp
// ═══════════════════════════════════════════════════════════════════════════

const TICKER_ITEMS = [
  "OPEX First UAE 2027 · 20 January 2027",
  "50% of government on Agentic AI",
  "80,000 federal employees trained",
  "15,000+ procedures eliminated",
  "AED 6bn · Dubai Services 360",
  "96% reduction in waiting times",
  "AED 13bn · Abu Dhabi Digital Strategy",
];

const SNAPSHOT = [
  { value: "170", suffix: "+", label: "Delegates" },
  { value: "25", suffix: "+", label: "Industry speakers" },
  { value: "10", suffix: "", label: "Conference sessions" },
  { value: "8", suffix: "", label: "Technology partners" },
  { value: "5", suffix: "", label: "Awards" },
];

type Fact = {
  label: string;
  meta: string;
  img: string;
  pre: string;
  num: string;
  suf: string;
  text: string;
  small: { pre: string; num: string; suf: string; text: string }[];
};

const FACTS: Fact[] = [
  {
    label: "The mandate",
    meta: "Announced April 2026",
    img: "1512453979798-5ea266f8880c",
    pre: "",
    num: "50",
    suf: "%",
    text: "of UAE government sectors, services and operations to run on Agentic AI within two years, under the directives of the UAE President",
    small: [
      { pre: "", num: "80,000", suf: "", text: "federal employees to be trained under the Agentic AI programme" },
      { pre: "", num: "32", suf: "", text: "specialized AI advisors launched in the Cabinet AI Advisor system (approved 2 September 2026)" },
    ],
  },
  {
    label: "Zero Bureaucracy",
    meta: "Since 2023",
    img: "1566576721346-d4a3b4eaeb55",
    pre: "",
    num: "15,000",
    suf: "+",
    text: "unnecessary procedures, requirements, documents and process steps eliminated since the Zero Government Bureaucracy Programme launched in 2023",
    small: [
      { pre: "", num: "4,000", suf: "+", text: "procedures removed and 1,600 requirements simplified in the programme’s first cycle alone" },
      { pre: "", num: "12M", suf: "", text: "customer hours saved, equivalent to AED 1.12 billion in economic value" },
      { pre: "", num: "95", suf: "%", text: "reduction in work-permit processing time at MoHRE under the AI driven Zero Bureaucracy phase" },
    ],
  },
  {
    label: "Dubai Services 360",
    meta: "AED 2.7bn to customers · AED 3.3bn to entities",
    img: "1494412574643-ff11b0a5c1c3",
    pre: "AED",
    num: "6bn",
    suf: "",
    text: "total savings from Dubai’s Services 360 Policy",
    small: [
      { pre: "", num: "1,474", suf: "", text: "Dubai government services redesigned across 28 entities" },
      { pre: "", num: "96", suf: "%", text: "reduction in waiting times" },
      { pre: "", num: "85 · 61 · 53", suf: "%", text: "fewer required visits · fewer service requirements · shorter processing time" },
    ],
  },
  {
    label: "Abu Dhabi & beyond",
    meta: "Digital Strategy 2025 – 2027",
    img: "1605745341112-85968b19335b",
    pre: "AED",
    num: "13bn",
    suf: "",
    text: "committed to Abu Dhabi’s Digital Strategy 2025 - 2027",
    small: [
      { pre: "", num: "100", suf: "+", text: "AI use cases deployed across 40+ Abu Dhabi government entities" },
      { pre: "", num: "230", suf: "+", text: "applications to the Sheikh Khalifa Excellence Award’s 22nd cycle, over 80% growth year on year" },
      { pre: "", num: "5", suf: "%", text: "the Middle East & Africa share of the global process mining market, signalling significant headroom for adoption" },
    ],
  },
];

const DRIVERS: { title: string; body: string }[] = [
  {
    title: "A hard national deadline with no precedent",
    body: "50% of UAE government sectors, services and operations must run on Agentic AI within two years. Announced April 2026 under the directives of the UAE President. This converts operational excellence from a voluntary improvement agenda into a delivery obligation with a date attached, and the UAE has positioned itself as the first government globally to attempt it at this scale.",
  },
  {
    title: "Entities are now assessed on redesign speed, not intent",
    body: "Federal entities are being evaluated on how quickly they adopt AI tools, redesign processes and integrate smart systems into daily operations. Pilots and strategy documents no longer count. This shifts demand sharply toward method, evidence and measurable delivery.",
  },
  {
    title: "The process-before-automation mandate is official policy",
    body: "The Zero Bureaucracy principle: bureaucracy should not be digitized, it should first be questioned, simplified and where possible eliminated. Organizations cannot hand an agent a process they cannot see, measure or explain, which places process mining, process intelligence and governance diagnostics upstream of every AI investment.",
  },
  {
    title: "Proof that the model works, at scale",
    body: "Over 15,000 unnecessary procedures, requirements and process steps removed since 2023. The first cycle alone eliminated 4,000+ procedures, simplified 1,600 requirements and saved 12 million customer hours, worth AED 1.12 billion. Dubai’s Services 360 closed with AED 6 billion in savings across 1,474 redesigned services and 28 entities, with waiting times down 96%. Success on this scale raises the baseline for everyone still to report.",
  },
  {
    title: "Large committed budgets without a clear operational translation",
    body: "AED 13 billion behind Abu Dhabi’s Digital Strategy 2025–2027, plus sovereign wealth and investment-office channels in the Northern Emirates. No clear picture of how that money converts into operational change, and an integrated strategy across process, people and culture still missing.",
  },
  {
    title: "Adoption, not deployment, is the binding constraint",
    body: "Named directly by entities as the single biggest challenge tools are in use, but scaling genuine adoption is hard. Creates sustained demand for capability building, change practice and adoption measurement rather than further platform procurement.",
  },
  {
    title: "National-scale capability building",
    body: "80,000 federal employees to be trained under the Agentic AI programme, with entities tracking AI literacy through man-hours and competency levels. AI training requirements range from informal expectations to concrete targets depending on the entity.",
  },
  {
    title: "An unresolved accountability and governance gap",
    body: "Combined with the sovereignty tension, sovereign models as stated direction while identity related workloads still run on public cloud, with control systems still being formalized and live, evolving compliance and privacy questions, this is generating real demand for governance, audit and control expertise.",
  },
  {
    title: "Private sector pulled into the same discipline",
    body: "The Sheikh Khalifa Excellence Award’s 22nd cycle was built explicitly around data-driven techniques and advanced technologies that improve operational efficiency and productivity, judged on demonstrable impact aligned with the Falcon Economy across seven focus areas.",
  },
];

const PAST_SPONSOR_BASE = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";
const PAST_SPONSORS = [
  "2026-01.png", "2026-03.png", "2026-02.png", "2026-05.png", "2026-04.png",
  "2026-07.png", "2026-06.png", "opex+2025+(2).png", "opex+2025+(1).png",
  "opex+2025+(4).png", "opex+2025+(3).png", "opex+2025+(7).png", "opex+2025+(6).png",
  "opex+2025+(5).png", "opex+2025+(9).png", "opex+2025+(8).png", "opex+2025+(10).png",
].map((f) => `${PAST_SPONSOR_BASE}/${f}`);

// Split across two rows that travel in opposite directions, which reads as one
// field of logos rather than two unrelated belts.
const PAST_SPONSOR_ROWS = [
  PAST_SPONSORS.slice(0, 9),
  PAST_SPONSORS.slice(9),
];

const THEME_IMGS = [
  "1553413077-190dd305871c",
  "1494412574643-ff11b0a5c1c3",
  "1586528116311-ad8dd3c8310d",
  "1540575467063-178a50c2df87",
  "1566576721346-d4a3b4eaeb55",
  "1512453979798-5ea266f8880c",
  "1605745341112-85968b19335b",
  "1601584115197-04ecc0da31d7",
  "1519003722824-194d4455a60c",
  "1578575437130-527eed3abbec",
];

const THEMES: { title: string; body: string }[] = [
  {
    title: "Reframing AI progress: outcomes over adoption counts",
    body: "Agents deployed and percentage-of-processes-touched are activity metrics, not results. Building scorecards on decision quality, cycle time and cost to serve that leadership and assessors will accept in place of deployment tallies. This is the intellectual spine of the whole event.",
  },
  {
    title: "AI as enabler, not the fix",
    body: "Permits cut by 95%, a visa journey from three weeks to five days. In both, the gain came from fixing the process and governance first, with AI on top. Separating the two contributions is the single most useful thing an attendee can take home.",
  },
  {
    title: "Is it a technology problem or a governance problem?",
    body: "The diagnostic question both entities kept returning to. How to tell the difference before procurement, and why misdiagnosis is the most expensive mistake in the cycle.",
  },
  {
    title: "Adoption is the real bottleneck",
    body: "Named by practitioners as the biggest challenge: the tools are live, the behaviour hasn’t changed. What drives usage past the pilot cohort, how to spot adoption theatre, and what to do when licences are paid for and unused.",
  },
  {
    title: "Zero Bureaucracy: resilience before removal, and never finished",
    body: "Are processes, controls and culture strong enough to survive the governance steps you’re about to delete? Plus the expectation-setting that matters most, this is a permanent operating discipline, not a project with an end date.",
  },
  {
    title: "Interrogating the 50% target",
    body: "Realistic or aspirational? What a credible entity roadmap to 2028 contains, where the honest constraints sit, and what happens to the metric if adoption plateaus after deployment. The session that earns the event its credibility.",
  },
  {
    title: "The accountability gap in machine decisions",
    body: "Who verifies an AI decision was better than human judgement would have been? Counterfactual baselines, who owns the review, and how it’s evidenced to auditors and award assessors. Includes the human-versus-machine decision line.",
  },
  {
    title: "Budget doesn’t equal execution",
    body: "AED 13 billion and sovereign-fund channels committed, no clear picture of how it lands operationally. What an integrated strategy across process, people and culture looks like, and why delivery partners aren’t yet being asked how they’ll hit the dates.",
  },
  {
    title: "Bridging Lean and Six Sigma with AI-era transformation",
    body: "Not a clean break. Where classical improvement disciplines still outperform, where they need reinvention, and how process mining and agent design fit alongside DMAIC rigour rather than replacing it. This is what makes it an operational excellence event, not an AI event.",
  },
  {
    title: "Sovereignty in principle, public cloud in practice",
    body: "Sovereign models as the stated mitigation, while identity-related workloads still run on public cloud and control systems are still being formalised. A live, unresolved tension and the compliance and privacy questions that come with it as models move to production.",
  },
];

type AgendaType = "Keynote" | "Panel" | "Presentation";
type AgendaRow = { start: string; end: string; type: AgendaType; title: string; points: string[] };

const AGENDA: AgendaRow[] = [
  { start: "09:00", end: "09:20", type: "Keynote", title: "Opening Keynote", points: [] },
  {
    start: "09:20",
    end: "10:10",
    type: "Panel",
    title: "Half the Government in Two Years: Ambition, Arithmetic and What Happens If We Miss",
    points: [
      "What does a defensible entity roadmap to 2028 look like and what are the honest constraints?",
      "Adoption counts versus outcomes.",
      "What would you put on a scorecard instead: decision quality, cycle time, cost to serve?",
      "AED 13 billion committed across Abu Dhabi’s digital strategy, plus sovereign-fund channels elsewhere. How does that money translate into operational change, and who is accountable for the translation?",
    ],
  },
  {
    start: "10:10",
    end: "10:30",
    type: "Presentation",
    title: "Making the Invisible Process Visible: Process Mining as the Foundation for Agentic AI",
    points: [],
  },
  {
    start: "10:50",
    end: "11:35",
    type: "Panel",
    title: "Technology Problem or Governance Problem? Diagnosing Before You Procure",
    points: [
      "How do you actually tell the difference before a business case is written? What does the diagnostic look like in practice?",
      "Permits cut 95%: how much of each gain came from process and governance redesign, and how much from AI? Can we separate them?",
      "Before you delete a governance step, how do you test whether the process, controls and culture survive without it?",
      "Where has simplification created risk and how did you rebuild the control without rebuilding the bureaucracy?",
    ],
  },
  {
    start: "11:35",
    end: "12:00",
    type: "Presentation",
    title: "Designing Processes for Agents, Not Just for People",
    points: [],
  },
  {
    start: "12:45",
    end: "13:30",
    type: "Panel",
    title: "The Licences Are Live and Nothing Changed: Adoption as the Real Bottleneck",
    points: [
      "AI literacy from informal pseudo-mandate to tracked man-hours and levels. What does trained actually mean, and how do you avoid certificates without competence?",
      "Where do Lean and Six Sigma still outperform an AI-first approach? Where do they genuinely need reinvention?",
      "How do process mining and agent design sit alongside rather than replacing it?",
      "What do you do when the licence is paid for and the behaviour hasn’t shifted?",
    ],
  },
  {
    start: "13:30",
    end: "13:55",
    type: "Presentation",
    title: "Integration Without Rebuilding: Data Foundations for Cross-Entity Services",
    points: [],
  },
  {
    start: "13:55",
    end: "14:40",
    type: "Panel",
    title: "Who Checks the Machine? Accountability, Sovereignty and Trust at Production Scale",
    points: [
      "Drawing the line: which decisions may a machine execute, which stay human-led, and who decides the classification?",
      "Sovereign models are the stated mitigation, yet identity-related workloads still run on public cloud and control systems are still being formalised. How are you managing that in the meantime?",
      "Compliance and data privacy as models scale: what’s settled, what genuinely isn’t, and how do you build for a framework still in motion?",
      "What is the first real test case going to look like and would your current controls survive it?",
    ],
  },
  {
    start: "14:40",
    end: "15:00",
    type: "Keynote",
    title: "Closing Keynote: Low-Code, Workflow and the Long Tail of Small Processes",
    points: [],
  },
];

const JOB_GROUPS: { label: string; roles: string[] }[] = [
  {
    label: "Leadership",
    roles: [
      "Directors General, Assistant Undersecretaries, Executive Directors",
      "Chief Operating Officers, Chief Transformation Officers",
    ],
  },
  {
    label: "Excellence & performance",
    roles: [
      "Heads of Government Excellence, Institutional Excellence, Corporate Excellence",
      "Heads of Strategy, Performance Management and Institutional Development",
      "VPs / Directors of Operational Excellence, Continuous Improvement, Business Excellence",
      "Heads of Quality, Lean / Six Sigma, Productivity and Performance",
    ],
  },
  {
    label: "Process & automation",
    roles: [
      "Heads of Process Excellence, Process Mining, Process Intelligence and BPM",
      "Heads of Automation, RPA, Intelligent Automation and AI",
    ],
  },
  {
    label: "Data & technology",
    roles: [
      "Chief AI Officers, Chief Digital Officers, Chief Data Officers",
      "ERP, Enterprise Architecture and Digital Transformation leaders",
    ],
  },
];

const INDUSTRIES: { text: string; hot?: boolean }[] = [
  { text: "Government & public sector" },
  { text: "Ports, logistics, shipping & supply chain", hot: true },
  { text: "Transport & mobility", hot: true },
  { text: "Aviation & airports", hot: true },
  { text: "Oil, gas & energy" },
  { text: "Utilities, water & power" },
  { text: "Banking, financial services & insurance" },
  { text: "Real estate, construction & infrastructure" },
  { text: "Manufacturing & industrial", hot: true },
  { text: "Retail, e-commerce & consumer", hot: true },
  { text: "Healthcare & life sciences" },
  { text: "Telecommunications & technology" },
  { text: "Education & academia" },
  { text: "Defense & security" },
];

const SPONSOR_CATEGORIES = [
  "Process mining and process intelligence platforms",
  "Business process management (BPM) and workflow platforms",
  "Intelligent automation, RPA and agentic AI platforms",
  "AI, machine learning and decision intelligence vendors",
  "ERP and enterprise application vendors",
  "Data platforms, integration, iPaaS and data governance",
  "Task mining, process discovery and digital twin providers",
  "Low-code / no-code application platforms",
  "Customer experience, service design and journey analytics",
  "Performance management, EPM, GRC and audit technology",
  "Cloud and sovereign cloud infrastructure providers",
];

const AWARD_CATEGORIES = [
  "Operational Excellence Organisation of the Year (Government)",
  "Operational Excellence Organisation of the Year (Private Sector)",
  "Excellence in Process Mining & Process Intelligence",
  "Best Intelligent Automation or Agentic AI Deployment",
  "Operational Excellence Leader of the Year",
];

// ─── Partner tier placeholders ─────────────────────────────────────────────
// Slot counts come from the comp. Logos drop into `logos` as they are signed.
// ─── From past editions — films, voices and photographs ───────────────
// Everything here is the OPEX First series' own material. Video ids, titles
// and the city/year pairs are the ones already in use on the other OPEX
// pages — nothing is restated more precisely than the source does.
const PAST_FILMS = [
  { id: "5obYKv-vJZE", title: "OPEX First UAE 2026", meta: "Abu Dhabi, UAE · 2026" },
  { id: "dbL42utoYW4", title: "OPEX First KSA 2025", meta: "Riyadh, Saudi Arabia · 2025" },
];

// Delegate testimonials, filmed on the floor. Vertical, so they take the
// 9:16 treatment and YouTube's `oar2` thumbnail.
const PAST_VOICES = [
  "WCsfo5Z6xVY",
  "baCK3xnKh68",
  "vMv0AfXMQL0",
  "AefPAed0g-I",
  "SH9Z1U2_rAM",
  "wLgYOHHB6o4",
  "2jpIlqo0HSY",
  "SLkj5gO-LQ8",
];

// Both editions, labelled, because a section called "from past editions" that
// quietly shows one city is a fib. Chosen off a contact sheet of all eleven
// candidates for variety rather than availability: stage, audience, floor,
// awards, room. Left out on purpose — the two Abu Dhabi frames already
// carrying sections 06 and 07, and 4N8A1666, which is the same panel and the
// same backdrop as 4N8A1702. Cities come from the S3 folders; no year is
// claimed for a photograph, only for a film.
const GALLERY_PHOTOS = [
  { src: `${OPEX_UAE_PHOTOS}/4N8A1702.JPG`, city: "Abu Dhabi", caption: "Leadership panel", area: "hero" },
  { src: `${OPEX_KSA_PHOTOS}/DSC08208.jpg`, city: "Riyadh", caption: "In session", area: "a" },
  { src: `${OPEX_KSA_PHOTOS}/DSC08456.jpg`, city: "Riyadh", caption: "Networking", area: "b" },
  { src: `${OPEX_UAE_PHOTOS}/4N8A1751.JPG`, city: "Abu Dhabi", caption: "On the floor", area: "c" },
  { src: `${OPEX_UAE_PHOTOS}/4N8A1950.JPG`, city: "Abu Dhabi", caption: "Awards presentation", area: "d" },
  { src: `${OPEX_KSA_PHOTOS}/DSC08269.jpg`, city: "Riyadh", caption: "The room", area: "e" },
  { src: `${OPEX_KSA_PHOTOS}/DSC08580.jpg`, city: "Riyadh", caption: "On stage", area: "f" },
];


// ─── Contacts ──────────────────────────────────────────────────────────────
const CONTACTS = [
  {
    name: "Sanjana Venugopal",
    title: "Producer",
    role: "Speaking Enquiries",
    email: "sanjana@eventsfirstgroup.com",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/Sanjana-Venugopal-new.jpg",
    photoPos: "50% 28%",
  },
  {
    name: "Mohammed Hassan",
    title: "Partnership Manager",
    role: "Sponsorship Enquiries",
    email: "hassan@eventsfirstgroup.com",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/hassan.jpg",
    photoPos: "50% 0%",
  },
  {
    name: "Mayur Methi",
    title: "Partnership Manager",
    role: "Sponsorship Enquiries",
    email: "mayur@eventsfirstgroup.com",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/Mayur-Methi.png",
    photoPos: "50% 18%",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Small shared pieces
// ═══════════════════════════════════════════════════════════════════════════

const pad2 = (n: number) => String(n).padStart(2, "0");

function useCountdown(target: Date) {
  // Rendered only after mount so the server and client never disagree.
  const [left, setLeft] = useState<{ d: number; h: string; m: string; s: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setLeft({
        d: Math.floor(diff / 864e5),
        h: pad2(Math.floor(diff / 36e5) % 24),
        m: pad2(Math.floor(diff / 6e4) % 60),
        s: pad2(Math.floor(diff / 1e3) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return left;
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <span style={{ width: 30, height: 1, background: V_LIGHT, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: BODY,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: V_LIGHT,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SectionTitle({
  children,
  size = "clamp(28px, 3.6vw, 48px)",
  max,
}: {
  children: React.ReactNode;
  size?: string;
  max?: number;
}) {
  return (
    <h2
      style={{
        margin: 0,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: "-0.04em",
        maxWidth: max,
        textWrap: "balance",
      }}
    >
      {children}
    </h2>
  );
}

const sectionStyle = (bg?: string): React.CSSProperties => ({
  padding: "clamp(40px, 4.4vw, 76px) clamp(18px, 3.2vw, 48px) clamp(32px, 3.4vw, 54px)",
  background: bg,
  position: "relative",
  // Above the atmosphere layers, which sit at z-index 0.
  zIndex: 1,
});

const SHELL: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", width: "100%" };

// ═══════════════════════════════════════════════════════════════════════════
// Hero
// ═══════════════════════════════════════════════════════════════════════════

function Hero() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section id="top" className="opx-hero opx-sec">
      <video
        className="opx-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_POSTER}
        aria-hidden="true"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="opx-hero-scrim" />

      {/* Date medallion */}
      <div className="opx-medallion" aria-hidden="true">
        <div style={{ textAlign: "center", lineHeight: 1 }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "1em",
              letterSpacing: "-0.05em",
              margin: "6px 0 4px",
            }}
          >
            20.01
          </div>
          <div style={{ fontFamily: BODY, fontSize: "0.25em", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
            2027 · UAE
          </div>
        </div>
      </div>

      <div style={{ ...SHELL, position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <span style={{ width: 30, height: 1, background: V_LIGHT }} />
          <span
            style={{
              fontFamily: BODY,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: V_LIGHT,
            }}
          >
            Hosted by EFG
          </span>
        </div>

        <h1 className="opx-h1">
          OPEX
          <br />
          <span style={{ display: "inline-flex", alignItems: "baseline", gap: "0.08em" }}>
            First{" "}
            <span style={{ fontSize: "0.3em", letterSpacing: "-0.03em", color: V_LIGHT }}>
              UAE&rsquo;27
            </span>
          </span>
        </h1>

        <div className="opx-hero-lede-row">
          <p className="opx-hero-lede">
            Agentic AI.{" "}
            <span style={{ color: "rgba(255,255,255,0.4)" }}>
              Where the National Mandate meets Operational Reality.
            </span>
          </p>
          <div className="opx-hero-ctas">
            <a href="#register" className="opx-btn opx-btn-primary">
              Register <span aria-hidden="true">→</span>
            </a>
            <a href="#agenda" className="opx-btn opx-btn-ghost">
              View the agenda
            </a>
          </div>
        </div>

        {/* Boarding strip */}
        <div className="opx-boarding">
          <div className="opx-boarding-cell">
            <div className="opx-boarding-label">Date</div>
            <div className="opx-boarding-value">20 Jan 2027</div>
          </div>
          <div className="opx-boarding-cell">
            <div className="opx-boarding-label">Venue</div>
            <div className="opx-boarding-value">To be announced</div>
          </div>
          <div className="opx-boarding-cell opx-boarding-cd">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: BODY,
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: V_LIGHT,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <span className="opx-dot" />
              Starts in
            </div>
            <div style={{ display: "flex", gap: 16, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
              {[
                { v: cd ? String(cd.d) : "—", l: "Days" },
                { v: cd ? cd.h : "—", l: "Hrs" },
                { v: cd ? cd.m : "—", l: "Min" },
                { v: cd ? cd.s : "—", l: "Sec", accent: true },
              ].map((u) => (
                <div key={u.l}>
                  <div
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 800,
                      fontSize: 28,
                      letterSpacing: "-1px",
                      lineHeight: 1,
                      color: u.accent ? V_LIGHT : "#fff",
                    }}
                  >
                    {u.v}
                  </div>
                  <div
                    style={{
                      fontFamily: BODY,
                      fontSize: 10,
                      letterSpacing: "1.2px",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                      marginTop: 4,
                    }}
                  >
                    {u.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supporting-partner strip. Holds its own height whether or not any
            logos are set, so adding them later never re-flows the hero. */}
        <div className="opx-hero-partners">
          <span className="opx-hero-partners-label">Supporting partners</span>
          <div className="opx-hero-partners-rail">
            {HERO_PARTNERS.length === 0 ? (
              <span className="opx-hero-partners-empty">To be announced</span>
            ) : (
              HERO_PARTNERS.map((p) =>
                p.href ? (
                  <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="opx-hero-partner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={p.name} loading="lazy" decoding="async" />
                  </a>
                ) : (
                  <span key={p.name} className="opx-hero-partner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={p.name} loading="lazy" decoding="async" />
                  </span>
                )
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Ticker
// ═══════════════════════════════════════════════════════════════════════════

function Ticker() {
  return (
    <div className="opx-ticker" aria-hidden="true">
      <div className="opx-ticker-track">
        {[0, 1].map((k) => (
          <div key={k} className="opx-ticker-run">
            {TICKER_ITEMS.map((t, j) => (
              <span key={j} className="opx-ticker-item">
                {t}
                <span className="opx-ticker-bullet" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Overview
// ═══════════════════════════════════════════════════════════════════════════

// The three proof points the overview used to carry inside one 53-word
// paragraph. Wording is unchanged - only the setting is.
const OVERVIEW_EVIDENCE: { num: string; cap: string }[] = [
  { num: "Thousands", cap: "of unnecessary procedures already removed under Zero Bureaucracy" },
  { num: "AED 6 billion", cap: "in savings under Dubai Services 360" },
  { num: "96%", cap: "reduction in waiting times" },
];

function Overview() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="overview"
      className="opx-sec"
      style={{
        ...sectionStyle(),
        background:
          "radial-gradient(ellipse 60% 40% at 90% 0%, rgba(124,58,237,0.10) 0%, transparent 55%)",
      }}
    >
      <div style={SHELL}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ paddingBottom: 28, borderBottom: `1px solid ${RULE_MID}` }}
        >
          <Eyebrow label="01 · Event overview" />
          <SectionTitle size="clamp(26px, 4.2vw, 62px)" max={1000}>
            The most ambitious public sector performance target{" "}
            <span style={{ color: V_LIGHT }}>in the world.</span>
          </SectionTitle>
        </motion.div>

        <div className="opx-overview-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="opx-overview-copy"
          >
            <p className="opx-lede">
              <span className="opx-dropcap">T</span>he UAE has set the most ambitious public sector
              performance target in the world.{" "}
              <strong style={{ fontWeight: 600 }}>
                Within two years, 50% of government sectors, services and operations will run on
                Agentic AI
              </strong>{" "}
              and federal entities are assessing how quickly they redesign processes to get there.
            </p>
            <p className="opx-body">
              This is not a technology upgrade. It is a national instruction to rethink how work is
              done.
            </p>

            <div className="opx-ev">
              {OVERVIEW_EVIDENCE.map((e) => (
                <div key={e.cap} className="opx-ev-cell">
                  <div className="opx-ev-num">{e.num}</div>
                  <div className="opx-ev-bar" />
                  <div className="opx-ev-cap">{e.cap}</div>
                </div>
              ))}
            </div>
            <p className="opx-body">
              <strong className="opx-strong">OPEX First UAE 2027</strong> is scheduled on{" "}
              <strong className="opx-strong">20 January 2027</strong> and is built for the people
              who now have to deliver against these mandates, who make it real through process
              mining, process intelligence and intelligent automation. The methods that made it
              work. The sequence that gets you from ambition to measurable impact, before the clock
              runs out.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            className="opx-overview-aside"
          >
            <div className="opx-overview-img">
              <Image
                src={UNSPLASH("1586528116311-ad8dd3c8310d", 1200)}
                alt="Operations floor"
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
              />
            </div>
            <blockquote className="opx-quote">
              <div className="opx-quote-mark" aria-hidden="true">
                &ldquo;
              </div>
              <p className="opx-quote-text">
                Automate a broken process and you get a faster broken process.
              </p>
              <p className="opx-quote-sub">
                The lesson the UAE has already learned is the one most organizations skip:
                bureaucracy should not be digitized, it should first be questioned, simplified and,
                where possible, eliminated.
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Facts & figures
// ═══════════════════════════════════════════════════════════════════════════

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

// Long enough to read a panel, short enough that the first hand-off happens
// while the section is still on screen.
const FACT_ROTATE_MS = 7000;

function Facts() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Once somebody drives the tabs themselves the rotation has done its job, so
  // it stands down for the rest of the visit rather than yanking the panel out
  // from under them.
  const [stopped, setStopped] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLElement>(null);
  const inView = useInView(secRef, { margin: "-15% 0px -15% 0px" });
  const reduced = usePrefersReducedMotion();

  // Nothing rotates off screen, under the cursor, under keyboard focus, after
  // a deliberate choice, or for anyone who asked for less motion.
  const rotating = inView && !paused && !stopped && !reduced;

  useEffect(() => {
    if (!rotating) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % FACTS.length),
      FACT_ROTATE_MS,
    );
    return () => window.clearTimeout(id);
  }, [rotating, active]);

  // Hovering or tabbing into either the tabs or the panel holds the current
  // one, so the content never moves while it is being read.
  const hold = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    const last = FACTS.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setStopped(true);
    setActive(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <section ref={secRef} id="figures" className="opx-sec" style={sectionStyle()}>
      <div style={SHELL}>
        <div className="opx-sec-head">
          <div>
            <Eyebrow label="02 · Facts & figures" />
            <SectionTitle>Facts &amp; figures</SectionTitle>
          </div>
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Facts and figures"
            onKeyDown={onTabKey}
            className="opx-fact-tabs"
            {...hold}
          >
            {FACTS.map((f, i) => {
              const on = i === active;
              return (
                <button
                  key={f.label}
                  role="tab"
                  id={`opx-fact-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`opx-fact-panel-${i}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => {
                    setStopped(true);
                    setActive(i);
                  }}
                  className="opx-fact-tab"
                  style={{
                    background: on ? V : "rgba(255,255,255,0.06)",
                    color: on ? "#fff" : "rgba(255,255,255,0.75)",
                    borderColor: on ? V : RULE_BRIGHT,
                  }}
                >
                  <span style={{ fontFamily: DISPLAY, fontWeight: 800, opacity: 0.6 }}>
                    {pad2(i + 1)}
                  </span>
                  {f.label}
                  {/* The bar draining across the live tab is the whole tell:
                      it says this moves on, and that there is somewhere to move
                      on to. Keyed on `active` so it restarts each hand-off. */}
                  {on && !stopped && !reduced && (
                    <span
                      key={active}
                      className="opx-fact-tab-fill"
                      aria-hidden="true"
                      style={{
                        animationDuration: `${FACT_ROTATE_MS}ms`,
                        animationPlayState: rotating ? "running" : "paused",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* All four panels share one grid cell so the section is always as
            tall as the tallest of them — switching tabs never shifts the
            content below, at any width. */}
        <div className="opx-fact-stack" {...hold}>
          {FACTS.map((f, i) => (
            <div
              key={f.label}
              role="tabpanel"
              id={`opx-fact-panel-${i}`}
              aria-labelledby={`opx-fact-tab-${i}`}
              className={`opx-fact-panel${i === active ? " opx-fact-panel-on" : ""}`}
            >
              <div className="opx-fact-grid">
                <div className="opx-fact-hero">
                  <Image
                    src={UNSPLASH(f.img, 1600)}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                  />
                  <div className="opx-fact-hero-tint" />
                  <div className="opx-fact-hero-meta">
                    <span>
                      {pad2(i + 1)} / {pad2(FACTS.length)} · {f.label}
                    </span>
                    <span>{f.meta}</span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <div className="opx-fact-num">
                      {f.pre && <span className="opx-fact-pre">{f.pre}</span>}
                      {f.num}
                      {f.suf && <span style={{ color: V_LIGHT, fontSize: "0.6em" }}>{f.suf}</span>}
                    </div>
                    <p className="opx-fact-text">{f.text}</p>
                  </div>
                </div>

                <div className="opx-fact-smalls">
                  {f.small.map((s, k) => (
                    <div
                      key={k}
                      className="opx-fact-small"
                      style={{ background: k === 0 ? V : "rgba(255,255,255,0.025)" }}
                    >
                      <div className="opx-fact-small-num">
                        {s.pre && (
                          <span style={{ fontSize: "0.45em", verticalAlign: "top", color: k === 0 ? "#fff" : V_LIGHT }}>
                            {s.pre}
                          </span>
                        )}
                        {s.num}
                        {s.suf && (
                          <span style={{ fontSize: "0.6em", color: k === 0 ? "#fff" : V_LIGHT }}>{s.suf}</span>
                        )}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: BODY,
                          fontSize: 14,
                          lineHeight: 1.5,
                          color: k === 0 ? "#fff" : DIM,
                        }}
                      >
                        {s.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Snapshot
// ═══════════════════════════════════════════════════════════════════════════

function Snapshot() {
  return (
    <section className="opx-sec opx-sec-flush" style={{ padding: "0 clamp(18px, 3.2vw, 48px)" }}>
      <div className="opx-snapshot" style={SHELL}>
        <div className="opx-snapshot-label">
          <Eyebrow label="Event snapshot" />
        </div>
        {SNAPSHOT.map((s) => (
          <div key={s.label} className="opx-snapshot-cell">
            <div className="opx-snapshot-num">
              {s.value}
              {s.suffix && <span style={{ color: V_LIGHT, fontSize: "0.65em" }}>{s.suffix}</span>}
            </div>
            <div className="opx-snapshot-bar" />
            <div className="opx-snapshot-cap">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Market drivers
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// Past series sponsors
// ═══════════════════════════════════════════════════════════════════════════

function PastSponsors() {
  return (
    <section id="past-sponsors" className="opx-sec opx-ps" style={sectionStyle()}>
      <div style={SHELL}>
        <Eyebrow label="Past series sponsors" />
        <p className="opx-ps-line">
          The organisations that have backed OPEX First across the series.
        </p>
      </div>

      <div className="opx-ps-marquee">
        <div className="opx-ps-fade opx-ps-fade-l" />
        <div className="opx-ps-fade opx-ps-fade-r" />
        {PAST_SPONSOR_ROWS.map((row, r) => (
          <div key={r} className="opx-ps-rail">
            <div className={`opx-ps-track opx-ps-track-${r === 0 ? "l" : "r"}`}>
              {/* Two passes of the same row: the track travels exactly half its
                  width, so the second pass is already in place when the first
                  leaves and the loop has no seam. */}
              {[0, 1].map((pass) =>
                row.map((logo, i) => (
                  <div
                    key={`${pass}-${i}`}
                    className="opx-ps-cell"
                    aria-hidden={pass === 1 ? true : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      alt={pass === 0 ? "Past OPEX First series sponsor" : ""}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Market drivers
// ═══════════════════════════════════════════════════════════════════════════

function Drivers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const onKey = (e: React.KeyboardEvent) => {
    const last = DRIVERS.length - 1;
    let next = active;
    if (e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    listRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <section ref={ref} id="drivers" className="opx-sec" style={sectionStyle()}>
      <div style={SHELL}>
        <Eyebrow label="03 · Market drivers" />
        <SectionTitle max={960}>Market drivers</SectionTitle>

        <div className="opx-drivers" style={{ marginTop: 40 }}>
          <div
            ref={listRef}
            role="tablist"
            aria-label="Market drivers"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="opx-drivers-list"
          >
            {DRIVERS.map((d, i) => {
              const on = i === active;
              return (
                <button
                  key={d.title}
                  role="tab"
                  id={`opx-driver-tab-${i}`}
                  aria-selected={on}
                  aria-controls="opx-driver-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="opx-driver-btn"
                  style={{
                    background: on ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.02)",
                    borderColor: on ? "rgba(124,58,237,0.6)" : RULE,
                  }}
                >
                  <span
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 800,
                      fontSize: 15,
                      color: on ? V_LIGHT : "rgba(255,255,255,0.35)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {pad2(i + 1)}
                  </span>
                  <span className="opx-driver-title">{d.title}</span>
                  <span style={{ fontSize: 16, color: on ? V_LIGHT : "rgba(255,255,255,0.35)" }} aria-hidden="true">
                    →
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="opx-driver-panel"
            role="tabpanel"
            aria-labelledby={`opx-driver-tab-${active}`}
            className="opx-driver-panel"
          >
            <Image
              src={UNSPLASH("1601584115197-04ecc0da31d7", 1400)}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="opx-driver-photo"
            />
            <div className="opx-driver-scrim" />
            <div className="opx-driver-ghost" aria-hidden="true">
              {pad2(active + 1)}
            </div>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ position: "relative" }}
            >
              <div
                style={{
                  fontFamily: BODY,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: V_LIGHT,
                  marginBottom: 14,
                }}
              >
                Driver {pad2(active + 1)} / {pad2(DRIVERS.length)}
              </div>
              <h3 className="opx-driver-h3">{DRIVERS[active].title}</h3>
              <p className="opx-driver-body">{DRIVERS[active].body}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Strategic themes
// ═══════════════════════════════════════════════════════════════════════════

function Themes() {
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const go = (dir: 1 | -1) =>
    setActive((a) => (a + dir + THEMES.length) % THEMES.length);

  // Keep the expanded panel in view when stepping with the arrow buttons.
  // The first run is skipped: `active` starts at 0, so on mount this scrolled
  // the card into view and took every page load down to section 04 instead of
  // leaving the visitor at the hero.
  const steppedOnce = useRef(false);
  useEffect(() => {
    if (!steppedOnce.current) {
      steppedOnce.current = true;
      return;
    }
    const el = railRef.current?.querySelectorAll<HTMLElement>(".opx-theme-card")[active];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [active]);

  return (
    <section id="themes" className="opx-sec" style={sectionStyle(BG_ALT)}>
      <div style={SHELL}>
        <div className="opx-sec-head">
          <div>
            <Eyebrow label="04 · Strategic themes / Key discussion areas" />
            <SectionTitle>
              2027 Strategic <span style={{ color: V_LIGHT }}>Focus Areas</span>
            </SectionTitle>
          </div>
          <div className="opx-theme-nav">
            <button onClick={() => go(-1)} className="opx-theme-arrow" aria-label="Previous theme">
              ←
            </button>
            <button
              onClick={() => go(1)}
              className="opx-theme-arrow opx-theme-arrow-on"
              aria-label="Next theme"
            >
              →
            </button>
          </div>
        </div>

        <div ref={railRef} className="opx-theme-rail">
          {THEMES.map((t, i) => {
            const on = i === active;
            return (
              <div
                key={t.title}
                className={`opx-theme-card${on ? " opx-theme-card-on" : ""}`}
                onClick={() => setActive(i)}
                role="button"
                tabIndex={0}
                aria-expanded={on}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
              >
                <Image
                  src={UNSPLASH(THEME_IMGS[i], 1200)}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 60vw"
                  style={{ filter: `saturate(0.7) brightness(${on ? 0.42 : 0.22})` }}
                />
                <div className="opx-theme-scrim" />
                <div
                  className="opx-theme-num"
                  style={{
                    fontSize: on ? 64 : 20,
                    color: on ? "rgba(255,255,255,0.18)" : V_LIGHT,
                  }}
                  aria-hidden="true"
                >
                  {pad2(i + 1)}
                </div>

                <div className="opx-theme-open">
                  <div style={{ width: 40, height: 2, background: V_LIGHT }} />
                  <h3 className="opx-theme-h3">{t.title}</h3>
                  <p className="opx-theme-body">{t.body}</p>
                </div>

                <div className="opx-theme-closed" aria-hidden="true">
                  <span>{t.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Agenda
// ═══════════════════════════════════════════════════════════════════════════

// Each format gets a colour on the rail. The two anchor formats carry the
// brand violet; presentations sit a step quieter so the eye finds the panels.
const AGENDA_TYPE: Record<AgendaType, { color: string; tag: string }> = {
  Keynote: { color: V_LIGHT, tag: "Keynote" },
  Panel: { color: "#9B6BFF", tag: "Panel" },
  Presentation: { color: "#7E8AA6", tag: "Presentation" },
};

// The day breaks at lunch, which is where the split column break goes too.
const AGENDA_MORNING = AGENDA.filter((a) => a.start < "12:00");
const AGENDA_AFTERNOON = AGENDA.filter((a) => a.start >= "12:00");

function AgendaColumn({
  label,
  span,
  rows,
  inView,
  delay,
}: {
  label: string;
  span: string;
  rows: AgendaRow[];
  inView: boolean;
  delay: number;
}) {
  return (
    <div className="opx-ag-col">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay, ease: EASE }}
        className="opx-ag-colhead"
      >
        <span className="opx-ag-collabel">{label}</span>
        <span className="opx-ag-colrule" aria-hidden="true" />
        <span className="opx-ag-colspan">{span}</span>
      </motion.div>

      {/* The rail the node dots sit on. */}
      <span className="opx-ag-rail" aria-hidden="true" />

      <ul className="opx-ag-list">
        {rows.map((a, i) => {
          const t = AGENDA_TYPE[a.type];
          const featured = a.type === "Panel" || a.type === "Keynote";
          return (
            <motion.li
              key={`${a.start}-${a.title}`}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45, delay: delay + 0.08 + i * 0.05, ease: EASE }}
              className={`opx-ag-row${featured ? " opx-ag-row-on" : ""}`}
              style={{ borderColor: featured ? `${t.color}33` : RULE }}
            >
              <span
                className="opx-ag-dot"
                aria-hidden="true"
                style={{
                  background: t.color,
                  boxShadow: `0 0 ${featured ? 10 : 6}px ${t.color}, 0 0 0 ${featured ? 3 : 2}px ${BG}`,
                  width: featured ? 9 : 7,
                  height: featured ? 9 : 7,
                }}
              />

              <div className="opx-ag-meta">
                <span className="opx-ag-time">
                  {a.start}
                  <span style={{ color: "rgba(255,255,255,0.35)" }}> – </span>
                  {a.end}
                </span>
                <span className="opx-ag-tag" style={{ color: t.color }}>
                  {t.tag}
                </span>
              </div>

              <h3 className="opx-ag-title">{a.title}</h3>

              {a.points.length > 0 && (
                <ul className="opx-ag-points" style={{ borderTopColor: `${t.color}26` }}>
                  {a.points.map((p, k) => (
                    <li key={k} className="opx-ag-point">
                      <span className="opx-ag-bullet" aria-hidden="true" style={{ background: t.color }} />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function Agenda() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="agenda" className="opx-sec" style={sectionStyle()}>
      <div style={SHELL}>
        <Eyebrow label="05 · Programme · 20 January 2027" />
        <SectionTitle max={820}>Program overview</SectionTitle>

        <div className="opx-ag-split">
          <AgendaColumn
            label="Morning"
            span="09:00 – 12:00"
            rows={AGENDA_MORNING}
            inView={inView}
            delay={0}
          />
          <AgendaColumn
            label="Afternoon"
            span="12:45 – 15:00"
            rows={AGENDA_AFTERNOON}
            inView={inView}
            delay={0.15}
          />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Who should attend
// ═══════════════════════════════════════════════════════════════════════════

function WhoAttends() {
  return (
    <section id="attend" className="opx-sec opx-wa" style={sectionStyle()}>
      {/* Full-bleed behind this section only. The scrim does the real work:
          the roles sit at 13.5px over it, so the plate has to stay dark enough
          for them regardless of what the photograph is doing underneath. It
          fades to the page colour top and bottom so the band melts into the
          sections either side instead of reading as a pasted-in box. */}
      <div className="opx-wa-bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ATTEND_BG} alt="" loading="lazy" decoding="async" />
        <span className="opx-wa-scrim" />
      </div>

      <div style={{ ...SHELL, position: "relative", zIndex: 1 }}>
        <Eyebrow label="06 · Who should attend" />
        <SectionTitle max={960}>Who should attend</SectionTitle>

        {/* Two full-width bands rather than a card beside a card. The old
            split let the photo and the fourteen chips dictate the height of
            the roles panel, so a two-role group sat above a hole. Nothing
            stretches to match anything else now. */}
        <div className="opx-wa-band">
          <div className="opx-panel-label">Target job titles</div>
          <div className="opx-wa-grid">
            {JOB_GROUPS.map((g) => (
              <div key={g.label} className="opx-wa-group">
                <h3 className="opx-wa-glabel">{g.label}</h3>
                <ul className="opx-wa-glist">
                  {g.roles.map((r) => (
                    <li key={r} className="opx-wa-role">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="opx-wa-band opx-wa-band-rule">
          <div className="opx-panel-label">Target industries</div>
          <div className="opx-wa-chips">
            {INDUSTRIES.map((ind) => (
              <span
                key={ind.text}
                className="opx-chip"
                style={{
                  background: ind.hot ? "rgba(124,58,237,0.22)" : "rgba(255,255,255,0.03)",
                  borderColor: ind.hot ? "rgba(183,156,255,0.6)" : "rgba(255,255,255,0.1)",
                  color: ind.hot ? "#fff" : "rgba(255,255,255,0.75)",
                }}
              >
                {ind.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Sponsor
// ═══════════════════════════════════════════════════════════════════════════

function Sponsor() {
  return (
    <section id="sponsor" className="opx-sec" style={sectionStyle()}>
      <div style={SHELL}>
        <Eyebrow label="07 · Who should sponsor" />

        <div className="opx-sponsor">
          <div className="opx-sponsor-cta">
            {/* The card was a 380px box holding a heading and a button with a
                void between them. The photograph fills it and says what the
                sponsorship actually buys. */}
            <div className="opx-sponsor-bg" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SPONSOR_BG} alt="" loading="lazy" decoding="async" />
              <span className="opx-sponsor-scrim" />
            </div>
            <SectionTitle size="clamp(24px, 3vw, 42px)">
              Who should sponsor. <span style={{ color: V_LIGHT }}>Targeted categories.</span>
            </SectionTitle>
            <a
              href="#register"
              className="opx-btn opx-btn-primary"
              style={{ alignSelf: "flex-start", position: "relative", zIndex: 1 }}
            >
              Become a sponsor <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="opx-sponsor-cats">
            {SPONSOR_CATEGORIES.map((s, i) => (
              <div key={s} className="opx-sponsor-cat">
                <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, color: V_LIGHT, minWidth: 22 }}>
                  {pad2(i + 1)}
                </span>
                <span style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 500, lineHeight: 1.4 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Awards — categories + nomination form
// ═══════════════════════════════════════════════════════════════════════════

function Awards() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    jobTitle: "",
    email: "",
    phone: "",
    category: "",
    reason: "",
  });
  const [country, setCountry] = useState<CountryCode>(COUNTRY_CODES[0]); // UAE
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setEmailError(null);
    setPhoneError(null);

    if (form.email && !isValidEmail(form.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (form.email && !isWorkEmail(form.email)) {
      setEmailError("Please use your work email address");
      return;
    }
    const phoneErr = validatePhone(form.phone, country);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    setSubmitting(true);
    const result = await submitForm({
      type: "awards",
      full_name: form.contactName,
      email: form.email,
      company: form.orgName,
      job_title: form.jobTitle,
      phone: `${country.code} ${form.phone}`,
      event_name: EVENT_NAME,
      metadata: {
        award_category: form.category,
        nomination_reason: form.reason,
        nominee_company: form.orgName,
        "Event Page": "OPEX First UAE 2027",
      },
      website: "",
    });
    setSubmitting(false);
    if (result.success) setSubmitted(true);
    else setFormError(result.error || "Something went wrong. Please try again.");
  };

  const field = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    background: focused === name ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused === name ? `${V_LIGHT}66` : "rgba(255,255,255,0.10)"}`,
    color: "#fff",
    fontFamily: BODY,
    fontSize: 14.5,
    fontWeight: 400,
    outline: "none",
    transition: "all .3s cubic-bezier(0.16,1,0.3,1)",
  });

  return (
    <section ref={ref} id="awards" className="opx-sec opx-awards" style={sectionStyle()}>
      <Image
        src={UNSPLASH("1492684223066-81342ee5ff30", 1400)}
        alt=""
        fill
        sizes="100vw"
        className="opx-awards-bg"
      />
      <div className="opx-awards-scrim" />

      <div style={{ ...SHELL, position: "relative" }}>
        <div className="opx-aw-split">
          <div className="opx-aw-content">
            <Eyebrow label="08 · Additional attractions" />
            <SectionTitle size="clamp(28px, 3.2vw, 50px)">
              2027 Award <span style={{ color: V_LIGHT }}>Categories</span>
            </SectionTitle>
            <p className="opx-aw-lede">
              Join us as we celebrate the OPEX First 2027 Awards, honoring those who demonstrate
              outstanding excellence and innovation in operational practices. We&rsquo;ll shine a
              spotlight on the visionaries and organizations leading the way in technological
              advancements.
            </p>
            <ol className="opx-aw-list">
              {AWARD_CATEGORIES.map((a, i) => (
                <motion.li
                  key={a}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
                  className="opx-award-row"
                >
                  <span className="opx-award-num" aria-hidden="true">
                    {pad2(i + 1)}
                  </span>
                  <span className="opx-award-title">{a}</span>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="opx-nom-card">
            {!submitted && (
              <div className="opx-nom-head">
                <Eyebrow label="Submit a nomination" />
                <SectionTitle size="clamp(21px, 2.2vw, 30px)" max={420}>
                  Put a team forward.
                </SectionTitle>
                <p className="opx-nom-note">
                  Nominations are reviewed by the OPEX First programme committee. You can nominate
                  your own organization or another.
                </p>
              </div>
            )}
            {submitted ? (
              <div style={{ textAlign: "center", padding: "32px 8px" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: V,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: 26,
                  }}
                  aria-hidden="true"
                >
                  ✓
                </div>
                <h3 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px" }}>
                  Nomination received.
                </h3>
                <p style={{ margin: "12px auto 0", fontFamily: BODY, fontSize: 15, lineHeight: 1.6, color: DIM, maxWidth: 380 }}>
                  Thank you — the programme committee will review it and come back to you before the
                  awards shortlist is published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="opx-nom-grid">
                  <label className="opx-lbl">
                    <span>Organization being nominated *</span>
                    <input
                      required
                      value={form.orgName}
                      onChange={(e) => set("orgName")(e.target.value)}
                      onFocus={() => setFocused("org")}
                      onBlur={() => setFocused(null)}
                      style={field("org")}
                      placeholder="Organization name"
                    />
                  </label>

                  <label className="opx-lbl">
                    <span>Award category *</span>
                    <select
                      required
                      value={form.category}
                      onChange={(e) => set("category")(e.target.value)}
                      onFocus={() => setFocused("cat")}
                      onBlur={() => setFocused(null)}
                      style={field("cat")}
                    >
                      <option value="">Select a category</option>
                      {AWARD_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="opx-lbl">
                    <span>Your name *</span>
                    <input
                      required
                      value={form.contactName}
                      onChange={(e) => set("contactName")(e.target.value)}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      style={field("name")}
                      placeholder="Full name"
                    />
                  </label>

                  <label className="opx-lbl">
                    <span>Job title</span>
                    <input
                      value={form.jobTitle}
                      onChange={(e) => set("jobTitle")(e.target.value)}
                      onFocus={() => setFocused("job")}
                      onBlur={() => setFocused(null)}
                      style={field("job")}
                      placeholder="Your role"
                    />
                  </label>

                  <label className="opx-lbl">
                    <span>Work email *</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        set("email")(e.target.value);
                        setEmailError(null);
                      }}
                      onFocus={() => setFocused("email")}
                      onBlur={() => {
                        setFocused(null);
                        if (!form.email) return;
                        if (!isValidEmail(form.email)) setEmailError("Please enter a valid email address");
                        else if (!isWorkEmail(form.email)) setEmailError("Please use your work email address");
                      }}
                      style={field("email")}
                      placeholder="you@organization.com"
                      aria-invalid={!!emailError}
                    />
                    {emailError && <span className="opx-err">{emailError}</span>}
                  </label>

                  <label className="opx-lbl">
                    <span>Phone *</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <select
                        value={`${country.code}|${country.country}`}
                        onChange={(e) => {
                          const [code, c] = e.target.value.split("|");
                          const found = COUNTRY_CODES.find(
                            (x) => x.code === code && x.country === c
                          );
                          if (!found) return;
                          setCountry(found);
                          const recapped = normalizePhoneDigits(form.phone, found);
                          if (recapped !== form.phone) set("phone")(recapped);
                          setPhoneError(recapped ? validatePhone(recapped, found) : null);
                        }}
                        onFocus={() => setFocused("cc")}
                        onBlur={() => setFocused(null)}
                        aria-label="Country dialling code"
                        style={{ ...field("cc"), width: 116, flexShrink: 0 }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={`${c.code}-${c.country}`} value={`${c.code}|${c.country}`}>
                            {c.country} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        required
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={form.phone}
                        onChange={(e) => {
                          // Digits are capped here rather than with maxLength,
                          // which counts the placeholder's spaces too.
                          set("phone")(normalizePhoneDigits(e.target.value, country));
                          setPhoneError(null);
                        }}
                        onFocus={() => setFocused("phone")}
                        onBlur={() => {
                          setFocused(null);
                          if (form.phone) setPhoneError(validatePhone(form.phone, country));
                        }}
                        style={field("phone")}
                        placeholder={country.placeholder}
                        aria-invalid={!!phoneError}
                      />
                    </div>
                    {phoneError && <span className="opx-err">{phoneError}</span>}
                  </label>

                  <label className="opx-lbl opx-lbl-full">
                    <span>Why are they being nominated? *</span>
                    <textarea
                      required
                      rows={4}
                      value={form.reason}
                      onChange={(e) => set("reason")(e.target.value)}
                      onFocus={() => setFocused("reason")}
                      onBlur={() => setFocused(null)}
                      style={{ ...field("reason"), resize: "vertical", minHeight: 110 }}
                      placeholder="The result achieved, the method used, and how it was measured."
                    />
                  </label>
                </div>

                {formError && (
                  <p className="opx-err" style={{ marginTop: 14 }} role="alert">
                    {formError}
                  </p>
                )}

                <button type="submit" disabled={submitting} className="opx-btn opx-btn-primary opx-nom-submit">
                  {submitting ? "Submitting…" : "Submit nomination"}
                  {!submitting && <span aria-hidden="true"> →</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// From past editions — films, voices, photographs
// ═════════════════════════════════════════════════════════════════════════

// A thumbnail that stays a button until it is activated: nothing loads from
// YouTube until someone asks for it, and the control is reachable by keyboard.
// `maxresdefault` is missing for some of the back catalogue (the Enterprise
// OPS film has none), so every thumbnail carries a fallback.
const FALLBACK_THUMB = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

function PastVideo({
  id,
  title,
  meta,
  vertical,
}: {
  id: string;
  title: string;
  meta?: string;
  vertical?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(
    vertical
      ? `https://img.youtube.com/vi/${id}/oar2.jpg`
      : `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
  );
  // YouTube answers a missing high-res thumbnail with a grey 120px placeholder
  // and a 200, which no error handler can see. Going through the optimizer
  // settles it: it rejects that placeholder as an invalid upstream and answers
  // 404, so a plain onError is enough and the width sniffing can go.

  return (
    <figure className={`opx-vid ${vertical ? "opx-vid-v" : ""}`}>
      <div className="opx-vid-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className="opx-vid-btn" onClick={() => setPlaying(true)}>
            <span className="opx-sr">{`Play ${title}`}</span>
            <Image
              src={thumb}
              alt=""
              fill
              sizes={vertical ? "190px" : "(max-width: 560px) 100vw, 50vw"}
              onError={() => setThumb(FALLBACK_THUMB(id))}
            />
            <span className="opx-vid-scrim" aria-hidden="true" />
            <span className="opx-vid-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {!vertical && (
        <figcaption className="opx-vid-cap">
          <span className="opx-vid-title">{title}</span>
          {meta && <span className="opx-vid-meta">{meta}</span>}
        </figcaption>
      )}
    </figure>
  );
}

function MovementLabel({ label, count }: { label: string; count: string }) {
  return (
    <div className="opx-mv">
      <h3 className="opx-mv-label">{label}</h3>
      <span className="opx-mv-count">{count}</span>
      <span className="opx-mv-rule" aria-hidden="true" />
    </div>
  );
}

function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  // The rail holds more cards than fit, so the arrows have to say honestly
  // whether there is anything left in either direction.
  const syncRail = () => {
    const el = rail.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 2,
    });
  };
  useEffect(() => {
    syncRail();
    const el = rail.current;
    if (!el) return;
    el.addEventListener("scroll", syncRail, { passive: true });
    window.addEventListener("resize", syncRail);
    return () => {
      el.removeEventListener("scroll", syncRail);
      window.removeEventListener("resize", syncRail);
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector(".opx-vid");
    const step = card ? card.getBoundingClientRect().width + 14 : 220;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="gallery" className="opx-sec" style={sectionStyle(BG_ALT)}>
      <div style={SHELL}>
        <Eyebrow label="09 · From past editions" />
        <SectionTitle max={900}>
          The room, <span style={{ color: V_LIGHT }}>in practice.</span>
        </SectionTitle>
        <p className="opx-past-lede">
          Two editions of OPEX First are already on the record — Abu Dhabi and Riyadh. The films,
          the delegates&rsquo; own verdicts, and the rooms they were filmed in.
        </p>

        {/* Films */}
        <MovementLabel label="Highlight films" count={`${PAST_FILMS.length}`} />
        <div className="opx-film-grid">
          {PAST_FILMS.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
            >
              <PastVideo id={f.id} title={f.title} meta={f.meta} />
            </motion.div>
          ))}
        </div>

        {/* Voices */}
        <div className="opx-mv-row">
          <MovementLabel label="In their words" count={`${PAST_VOICES.length}`} />
          <div className="opx-rail-nav">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={edges.start}
              aria-label="Show earlier testimonials"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={edges.end}
              aria-label="Show more testimonials"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div className={`opx-rail-wrap ${edges.end ? "opx-rail-done" : ""}`}>
          <div className="opx-rail" ref={rail}>
            {PAST_VOICES.map((id) => (
              <PastVideo key={id} id={id} title="OPEX First delegate testimonial" vertical />
            ))}
          </div>
        </div>

        {/* Photographs */}
        <MovementLabel label="Photographs" count={`${GALLERY_PHOTOS.length}`} />
        <div className="opx-gal">
          {GALLERY_PHOTOS.map((p, i) => (
            <motion.figure
              key={p.src}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
              className="opx-gal-card"
              style={{ gridArea: p.area }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={`${p.caption} — OPEX First ${p.city}`}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span className="opx-gal-city">{p.city}</span>
                {p.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════

function Register() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Landing on /events/opex-first/uae#register has to survive Lenis smooth
  // scroll, which otherwise swallows the initial hash jump.
  useEffect(() => {
    if (window.location.hash !== "#register") return;
    const t = setTimeout(() => {
      document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={ref} id="register" className="opx-sec" style={sectionStyle()}>
      <div style={SHELL}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="opx-pass"
        >
          <div className="opx-pass-main">
            <div className="opx-pass-ring" aria-hidden="true" />
            <div className="opx-pass-top">
              <span>OPEX First UAE 2027</span>
              <span>20 January 2027</span>
            </div>
            <div className="opx-pass-route">
              <div>
                <div className="opx-pass-cap">From</div>
                <div className="opx-pass-big">Ambition</div>
              </div>
              <div className="opx-pass-dash" aria-hidden="true">
                <span>→</span>
              </div>
              <div>
                <div className="opx-pass-cap">To</div>
                <div className="opx-pass-big">Measurable impact</div>
              </div>
            </div>
            <div className="opx-pass-facts">
              <div>
                <div className="opx-pass-cap">Date</div>
                <div className="opx-pass-val">20 Jan 2027</div>
              </div>
              <div>
                <div className="opx-pass-cap">Venue</div>
                <div className="opx-pass-val">To be announced</div>
              </div>
              <div>
                <div className="opx-pass-cap">Hosted by</div>
                <div className="opx-pass-val">EFG</div>
              </div>
            </div>
          </div>
          <div className="opx-pass-stub">
            <p className="opx-pass-stub-text">
              Agentic AI.{" "}
              <span style={{ color: V_LIGHT }}>
                Where the National Mandate meets Operational Reality.
              </span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="#opx-form" className="opx-btn opx-btn-primary" style={{ justifyContent: "center" }}>
                Register <span aria-hidden="true">→</span>
              </a>
              <a href="#sponsor" className="opx-btn opx-btn-ghost" style={{ justifyContent: "center" }}>
                Become a partner
              </a>
            </div>
          </div>
        </motion.div>

        <div className="opx-cpd-chip">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/CPD.png"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span>
            <strong>CPD Certified Event</strong> · earn up to 7 CPD points.
          </span>
        </div>

        <div
          id="opx-form"
          className="opx-form-wrap"
          style={
            {
              marginTop: "clamp(32px, 4vw, 56px)",
              ["--orange" as string]: V,
              ["--orange-bright" as string]: V_LIGHT,
              ["--orange-glow" as string]: "rgba(124,58,237,0.4)",
              ["--black" as string]: "transparent",
            } as React.CSSProperties
          }
        >
          <InquiryForm eventName={EVENT_NAME} defaultCountry="AE" />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Contacts
// ═══════════════════════════════════════════════════════════════════════════

function Contacts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="contact" className="opx-sec" style={sectionStyle(BG_ALT)}>
      <div style={SHELL}>
        <Eyebrow label="10 · Talk to the team" />
        <SectionTitle max={900}>
          Speaking and <span style={{ color: V_LIGHT }}>sponsorship.</span>
        </SectionTitle>

        <div className="opx-contacts" style={{ marginTop: 40 }}>
          {CONTACTS.map((c, i) => (
            <motion.div
              key={c.email}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="opx-contact"
            >
              <div className="opx-contact-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.photo}
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: c.photoPos }}
                />
              </div>
              <div className="opx-contact-body">
                <div className="opx-contact-role">{c.role}</div>
                <h3 className="opx-contact-name">{c.name}</h3>
                <div className="opx-contact-title">{c.title}</div>
                <a href={`mailto:${c.email}`} className="opx-contact-mail">
                  {c.email}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════════

export default function OpexFirstUae2027Page() {
  return (
    <main className="opx-page" style={{ background: BG, color: "#fff", overflowX: "hidden" }}>
      {/* Atmosphere. Two layers, both behind every section and neither of them
          interactive: a drifting colour field that runs the length of the page,
          and a fixed grain plate. The grain is not decoration — gradients this
          wide and this dark band into visible rings on 8-bit displays, and a
          couple of percent of noise is what breaks the steps up. */}
      <div className="opx-atmos" aria-hidden="true" />
      <div className="opx-grain" aria-hidden="true" />

      <Hero />
      <Ticker />
      <Overview />
      <Facts />
      <Snapshot />
      <CpdCertified eventName="OPEX First UAE 2027" theme={V} registerHref="#register" />
      <PastSponsors />
      <Drivers />
      <Themes />
      <Agenda />
      <WhoAttends />
      <Sponsor />
      <Awards />
      <Gallery />
      <Register />
      <Contacts />
      <Footer />

      {/* Sticky post-event-report prompt + the request modal it opens. */}
      <OpexReportFab />
      <OpexRequestResourcesModal />
    </main>
  );
}
