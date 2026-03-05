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

// How We Deliver - The Process
const processSteps = [
  {
    number: "01",
    title: "We Curate",
    description: "Hand-select 15-20 decision-makers who match your ideal customer profile. No fillers, no juniors — only the executives who sign the checks.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "We Execute",
    description: "Five-star venues, premium catering, seamless production. You show up with your talking points — we handle everything else.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "You Connect",
    description: "Focus on what matters — building relationships, sharing expertise, closing deals. Walk out with warm leads and real partnerships.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

// What Sponsors Get
const sponsorBenefits = [
  {
    title: "Turnkey Execution",
    description: "From venue sourcing to attendee management — we run the entire operation so you can focus on your message.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Guaranteed Audience",
    description: "Every seat filled with qualified decision-makers. We verify titles, confirm attendance, and deliver the room you paid for.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: "Your Brand, Center Stage",
    description: "You own the room. Shape the agenda, lead the discussion, position your solution — without competing voices.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Post-Event Intelligence",
    description: "Full attendee list with contact details, engagement notes, and follow-up recommendations delivered within 48 hours.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
];

// Sponsor Testimonials
const testimonials = [
  {
    quote: "The executive boardroom was transformative for us — our brand got exposure with exactly the right connections. These weren't just leads, they were relationships.",
    author: "Srikanth Rayaprolu",
    title: "CEO & Co-Founder",
    company: "Ad Scholars",
  },
  {
    quote: "Unforgettable experience with tangible results. Everything was professionally managed — we just showed up and connected with decision-makers.",
    author: "Deep Vyas",
    title: "Partner",
    company: "Worker Ants Media",
  },
  {
    quote: "Our event with NetworkFirst exceeded expectations in every way. The caliber of attendees and the seamless execution made it our highest-ROI marketing investment.",
    author: "Sheryan Gandhi",
    title: "Chief Operating Officer",
    company: "Tap1ce",
  },
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

// Exact data from networkfirstme.com/past-events
const pastBoardrooms2025 = [
  { sponsor: "ONE Executive Day UAE", venue: "Dubai", date: "10th December 2025" },
  { sponsor: "CONFLUENT | AWS", venue: "Ritz Carlton DIFC, Dubai", date: "25th November 2025" },
  { sponsor: "STRATEGY", venue: "Crowne Plaza, Riyadh, KSA", date: "19th November 2025" },
  { sponsor: "Outsystems", venue: "Dana Rayhaan by Rotana, Dammam, KSA", date: "18th November 2025" },
  { sponsor: "Commvault | GBM", venue: "Ritz Carlton DIFC, Dubai", date: "18th November 2025" },
  { sponsor: "Finastra", venue: "Voco Riyadh, Saudi Arabia", date: "29th October 2025" },
  { sponsor: "CleverTap", venue: "Jumeirah Messilah Beach Hotel, Kuwait", date: "29th October 2025" },
  { sponsor: "Crayon Event", venue: "Crowne Plaza Riyadh Rdc Hotel & Convention by IHG", date: "29th October 2025" },
  { sponsor: "SecurityScorecard", venue: "Grand Hyatt Hotel, Abu Dhabi", date: "29th October 2025" },
  { sponsor: "Akamai | Cyberia", venue: "Riyadh", date: "29th October 2025" },
  { sponsor: "Jedox Elevate Roadshow Dubai", venue: "Ritz Carlton, JBR", date: "29th October 2025" },
  { sponsor: "Confluent", venue: "Voco Hotel, Riyadh", date: "28th October 2025" },
  { sponsor: "SplashBI", venue: "Hilton Riyadh Olaya, Riyadh", date: "28th October 2025" },
  { sponsor: "GBM | Cisco", venue: "The St. Regis Downtown Dubai", date: "23rd October 2025" },
  { sponsor: "Boomi Executive Roundtable", venue: "Riyadh", date: "22nd October 2025" },
  { sponsor: "GBM FORTINET", venue: "One&Only One Za'abeel, Dubai", date: "09th October 2025" },
  { sponsor: "Airtable", venue: "Virtual", date: "01st October 2025" },
  { sponsor: "Akamai", venue: "TODA - Theatre of Digital Art", date: "01st October 2025" },
  { sponsor: "SplashBI", venue: "Ritz Carlton JBR, Dubai", date: "25th September 2025" },
  { sponsor: "FRESHWORKS", venue: "Ritz Carlton JBR, Dubai", date: "18th September 2025" },
  { sponsor: "Greyt HR", venue: "Virtual", date: "18th September 2025" },
  { sponsor: "Strategy World Dubai Edition", venue: "Delano | Bluewaters", date: "17th September 2025" },
  { sponsor: "Data Streaming World Tour", venue: "Crowne Plaza Riyadh RDC Hotel & Convention", date: "16th September 2025" },
  { sponsor: "GBM", venue: "JW Marriott Marquis Hotel Dubai", date: "16th September 2025" },
  { sponsor: "Freshworks", venue: "Voco Hotel, Riyadh", date: "16th September 2025" },
  { sponsor: "Summerge", venue: "Ritz Carlton, DIFC, Dubai", date: "10th September 2025" },
  { sponsor: "CleverTap", venue: "The Ritz-Carlton Jeddah", date: "09th September 2025" },
  { sponsor: "Celonis", venue: "Hilton Riyadh Hotel & Residences, KSA", date: "07th July 2025" },
  { sponsor: "Freshworks", venue: "Voco hotel Riyadh", date: "02nd July 2025" },
  { sponsor: "Outsystems", venue: "Hilton Riyadh Hotel & Residences, KSA", date: "25th June 2025" },
  { sponsor: "Outsystems", venue: "Hilton Riyadh Hotel & Residences, KSA", date: "24th June 2025" },
  { sponsor: "CELONIS", venue: "Riyadh, Saudi Arabia", date: "23rd June 2025" },
  { sponsor: "JEDOX", venue: "Ritz Carlton JBR", date: "17th June 2025" },
  { sponsor: "OUTSYSTEMS", venue: "The Ritz Carlton, Grand Canal, Abu Dhabi", date: "29th May 2025" },
  { sponsor: "IT MAX GLOBAL", venue: "Virtual", date: "28th May 2025" },
  { sponsor: "Trimble", venue: "Virtual", date: "27th May 2025" },
  { sponsor: "Trimble", venue: "Virtual", date: "21st May 2025" },
  { sponsor: "Intertec", venue: "Address Sky View, Downtown Dubai", date: "20th May 2025" },
  { sponsor: "Trimble", venue: "Virtual", date: "19th May 2025" },
  { sponsor: "Confluent", venue: "Ritz Carlton, DIFC", date: "14th May 2025" },
  { sponsor: "Jedox", venue: "Taj Hotel, Business Bay, Dubai", date: "07th May 2025" },
  { sponsor: "Confluent", venue: "Riyadh, KSA", date: "30th April 2025" },
  { sponsor: "Celonis", venue: "Abu Dhabi, UAE", date: "29th April 2025" },
  { sponsor: "Isolution", venue: "Pullman Hotel West Bay", date: "28th April 2025" },
  { sponsor: "Akamai", venue: "Vida Dubai Mall", date: "9th April 2025" },
  { sponsor: "Freshworks | Networking IFTAR", venue: "St. Regis, UAE", date: "18th March 2025" },
  { sponsor: "Freshworks", venue: "Dubai", date: "12th March 2025" },
  { sponsor: "FutureBridge", venue: "Dubai", date: "25th February 2025" },
  { sponsor: "Confluent", venue: "Riyadh, KSA", date: "20th February 2025" },
  { sponsor: "Whatfix", venue: "St. Regis, Downtown Dubai", date: "18th February 2025" },
  { sponsor: "Appknox", venue: "Ritz Carlton DIFC, Dubai", date: "05th February 2025" },
];

const pastBoardrooms2024 = [
  { sponsor: "Freshworks", venue: "Ritz-Carlton, Abu Dhabi", date: "10th December 2024" },
  { sponsor: "Freshworks", venue: "Ritz-Carlton, Abu Dhabi", date: "11th December 2024" },
  { sponsor: "Trimble", venue: "Ritz Carlton DIFC, Dubai", date: "26th November 2024" },
  { sponsor: "Confluent", venue: "Hilton Riyadh Hotel and Residences", date: "20th November 2024" },
  { sponsor: "Celonis", venue: "Dubai, UAE", date: "14th November 2024" },
  { sponsor: "Connect MEA", venue: "Atlantis, The Palm, Dubai", date: "13th November 2024" },
  { sponsor: "Coursera Finance Leaders Roundtable", venue: "VOCO Hotel, Riyadh, Saudi Arabia", date: "22nd October 2024" },
  { sponsor: "Coursera Government Leaders Roundtable", venue: "VOCO Hotel, Riyadh, Saudi Arabia", date: "21st October 2024" },
  { sponsor: "Orbit", venue: "Ritz Carlton JBR, Dubai", date: "10th October 2024" },
  { sponsor: "CIONET", venue: "Sushi Samba, St. Regis Hotel, Dubai", date: "25th September 2024" },
  { sponsor: "Keka", venue: "Ritz Carlton DIFC", date: "26th September 2024" },
  { sponsor: "Kissflow", venue: "JW Marriott, Marina, Dubai, UAE", date: "24th September 2024" },
  { sponsor: "Appknox", venue: "Conrad Etihad Towers, Abu Dhabi", date: "19th September 2024" },
  { sponsor: "Uniphore", venue: "Dubai", date: "18th September 2024" },
  { sponsor: "Freshworks", venue: "Conrad Etihad Towers, Abu Dhabi", date: "17th September 2024" },
  { sponsor: "Freshworks", venue: "Ritz Carlton DIFC, Dubai", date: "12th September 2024" },
  { sponsor: "Orbit", venue: "Dubai", date: "3rd July 2024" },
  { sponsor: "Freshservice", venue: "Palazzo Versace Dubai", date: "30th May 2024" },
  { sponsor: "Oracle ERP Finance Forum", venue: "Voco, Riyadh, KSA", date: "3rd June 2024" },
  { sponsor: "Customer Priority Strategies – KSA's Public Sector", venue: "Fairmont, KSA", date: "4th June 2024" },
  { sponsor: "Oracle ERP Finance Forum", venue: "Ritz Carlton DIFC, Dubai, UAE", date: "5th June 2024" },
  { sponsor: "JAGGAER", venue: "Dai Pai Dong Restaurant, Rosewood Abu Dhabi", date: "5th June 2024" },
  { sponsor: "Huco Roadshow", venue: "The Westin Dubai Mina Seyahi Beach Resort & Marina", date: "22nd May 2024" },
  { sponsor: "Digitizing Retail Operations", venue: "Radisson Blu Riyadh, Saudi Arabia", date: "20th May 2024" },
  { sponsor: "API Evolution Roadshow", venue: "Narcissus The Royal Hotel, Riyadh", date: "15th May 2024" },
  { sponsor: "Voxvantage", venue: "Grand Hyatt, Dubai", date: "9th May 2024" },
  { sponsor: "Coursera Women Leadership Summit", venue: "Ritz Carlton Jeddah, Saudi", date: "30th April 2024" },
  { sponsor: "HUCO - Suhoor Dinner", venue: "THE RITZ - CARLTON, Al Hada, Riyadh", date: "27th March 2024" },
  { sponsor: "DATA GLOBAL INSIGHTS CONFERENCE – HIGHER EDUCATION", venue: "Kingdom of Saudi Arabia", date: "26th February 2024" },
  { sponsor: "DATA GLOBAL INSIGHTS CONFERENCE - FINANCE", venue: "Dubai", date: "28th February 2024" },
];

const pastBoardrooms2023 = [
  { sponsor: "Zero Trust in an Infrastructure-less World", venue: "GITEX, Dubai, UAE", date: "17th October 2023" },
  { sponsor: "Ransomware Recovery and Resilience", venue: "GITEX, Dubai, UAE", date: "18th October 2023" },
  { sponsor: "Atlassian Cloud Collaboration Tools", venue: "Grand Movenpick Hotel, Media City, Dubai", date: "21st September 2023" },
  { sponsor: "MOBILE SECURITY APPLICATION | APPKNOX", venue: "Sheraton Grand, Dubai, UAE", date: "22nd August 2023" },
  { sponsor: "Smart NFC Card Solutions", venue: "Radisson Blu Hotel, Dubai", date: "6th June 2023" },
  { sponsor: "Digital Marketing Excellence", venue: "Grand Hyatt, Abu Dhabi", date: "1st June 2023" },
  { sponsor: "Adtech Media in Kid-Focused Gaming", venue: "Address Marina, Dubai", date: "18th May 2023" },
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
  const processRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const formatRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const upcomingRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const processInView = useInView(processRef, { once: true, margin: "-50px" });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-50px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });
  const formatInView = useInView(formatRef, { once: true, margin: "-50px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-50px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-50px" });
  const trackInView = useInView(trackRef, { once: true, margin: "-50px" });
  const upcomingInView = useInView(upcomingRef, { once: true, margin: "-50px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });

  return (
    <div style={{ background: "#07060A", minHeight: "100vh" }}>
      <Navigation />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION - Your Event. Our Expertise.
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
        {/* Animated Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${S3}/networkfirst-boardrooms/6cbebbd9-21cd-44ad-9bd6-4897f37beec1.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.25) saturate(0.9)",
          }}
        />
        
        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, rgba(7,6,10,0.97) 0%, rgba(7,6,10,0.8) 40%, rgba(201,147,90,0.2) 100%)`,
          }}
        />

        {/* Floating Accent */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${AMBER}20 0%, transparent 70%)`,
            filter: "blur(60px)",
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
              fontSize: "clamp(44px, 6vw, 82px)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-2.5px",
              color: "#fff",
              margin: "0 0 8px",
              maxWidth: 900,
            }}
          >
            Your Event.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(44px, 6vw, 82px)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-2.5px",
              color: AMBER,
              margin: "0 0 32px",
              maxWidth: 900,
            }}
          >
            Our Expertise.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(17px, 1.5vw, 21px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7,
              maxWidth: 620,
              margin: "0 0 20px",
            }}
          >
            We build the room. We fill the seats. We run the show.
            <br />
            <strong style={{ color: "#fff" }}>You focus on what you do best — connecting with decision-makers.</strong>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 40px",
            }}
          >
            100+ boardrooms delivered across 5 GCC markets since 2023
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16 }}
          >
            <Link
              href="#build"
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
              Let&apos;s Build Your Boardroom
              <span>→</span>
            </Link>
            <Link
              href="#how"
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
              See How It Works
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            style={{
              marginTop: 60,
              paddingTop: 40,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexWrap: "wrap",
              gap: 40,
            }}
          >
            {[
              { label: "Fully Managed", sublabel: "End-to-end execution" },
              { label: "Guaranteed Attendance", sublabel: "Verified executives only" },
              { label: "Premium Venues", sublabel: "5-star hotels across GCC" },
            ].map((badge, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: AMBER,
                  }}
                />
                <div>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>
                    {badge.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                    {badge.sublabel}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW WE DELIVER - The Process
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={processRef}
        id="how"
        style={{
          background: "linear-gradient(180deg, #0A0A0A 0%, #07060A 100%)",
          padding: "clamp(80px, 10vw, 140px) clamp(20px, 4vw, 60px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            height: 80,
            background: `linear-gradient(to bottom, transparent, ${AMBER}50)`,
          }}
        />

        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 70 }}
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
              How We Deliver
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 50px)",
                fontWeight: 800,
                color: "#fff",
                margin: "16px 0 0",
              }}
            >
              We Handle Everything.
              <br />
              <span style={{ color: AMBER }}>You Show Up and Shine.</span>
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
            className="process-grid"
          >
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.15 }}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${AMBER}15`,
                  borderRadius: 24,
                  padding: 40,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Step Number */}
                <span
                  style={{
                    position: "absolute",
                    top: 24,
                    right: 28,
                    fontFamily: "var(--font-display)",
                    fontSize: 64,
                    fontWeight: 800,
                    color: `${AMBER}10`,
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </span>

                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: `${AMBER}15`,
                    border: `1px solid ${AMBER}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: AMBER,
                    marginBottom: 28,
                  }}
                >
                  {step.icon}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 14px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT SPONSORS GET
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={benefitsRef}
        style={{
          background: "#07060A",
          padding: "clamp(80px, 10vw, 140px) clamp(20px, 4vw, 60px)",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
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
              What You Get
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
              Not Just an Event — <span style={{ color: AMBER }}>A Growth Engine</span>
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
            }}
            className="benefits-grid"
          >
            {sponsorBenefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                style={{
                  background: "linear-gradient(135deg, rgba(201,147,90,0.08) 0%, rgba(201,147,90,0.02) 100%)",
                  border: `1px solid ${AMBER}20`,
                  borderRadius: 20,
                  padding: 32,
                  textAlign: "center",
                }}
              >
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 16,
                  background: `${AMBER}15`,
                  border: `1px solid ${AMBER}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: AMBER,
                  marginBottom: 20,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}>
                  {benefit.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 10px",
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
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
          PHOTO GALLERY - INSIDE THE ROOM
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={galleryRef}
        style={{
          background: "#07060A",
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
          TESTIMONIALS FROM SPONSORS
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={testimonialsRef}
        style={{
          background: "#0A0A0A",
          padding: "clamp(80px, 10vw, 140px) clamp(20px, 4vw, 60px)",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
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
              In Their Words
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
              What Our Sponsors Say
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
            className="testimonials-grid"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  padding: 36,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 24,
                    left: 32,
                    fontFamily: "var(--font-display)",
                    fontSize: 80,
                    fontWeight: 800,
                    color: `${AMBER}15`,
                    lineHeight: 1,
                  }}
                >
                  &ldquo;
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.75,
                    margin: "0 0 28px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {t.quote}
                </p>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                      margin: "0 0 2px",
                    }}
                  >
                    {t.author}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.4)",
                      margin: 0,
                    }}
                  >
                    {t.title}, {t.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
              Flexible Formats
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
              In-Person or Virtual. Same Standard.
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
          TRACK RECORD - PAST BOARDROOMS (Organized by Year)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={trackRef}
        style={{
          background: "#0A0A0A",
          padding: "clamp(80px, 10vw, 140px) clamp(20px, 4vw, 60px)",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={trackInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 70 }}
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
              100+ Boardrooms Delivered
            </h2>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                marginTop: 12,
              }}
            >
              Executive roundtables across UAE, Saudi Arabia, Kuwait, Qatar & beyond
            </p>
          </motion.div>

          {/* 2025 Boardrooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={trackInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            style={{ marginBottom: 50 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 800,
                  color: AMBER,
                }}
              >
                2025
              </span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.05)",
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                {pastBoardrooms2025.length} Boardrooms
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
              className="track-grid"
            >
              {pastBoardrooms2025.slice(0, 16).map((boardroom, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={trackInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.15 + i * 0.02 }}
                  style={{
                    background: "linear-gradient(135deg, rgba(201,147,90,0.06) 0%, rgba(201,147,90,0.01) 100%)",
                    border: `1px solid ${AMBER}15`,
                    borderRadius: 12,
                    padding: 18,
                    transition: "all 0.3s ease",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      margin: "0 0 6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {boardroom.sponsor}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      margin: "0 0 8px",
                      lineHeight: 1.4,
                    }}
                  >
                    {boardroom.venue}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: AMBER,
                    }}
                  >
                    {boardroom.date}
                  </span>
                </motion.div>
              ))}
            </div>
            {pastBoardrooms2025.length > 16 && (
              <p style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
                marginTop: 16,
              }}>
                + {pastBoardrooms2025.length - 16} more boardrooms in 2025
              </p>
            )}
          </motion.div>

          {/* 2024 Boardrooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={trackInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            style={{ marginBottom: 50 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 800,
                  color: AMBER,
                }}
              >
                2024
              </span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.05)",
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                {pastBoardrooms2024.length} Boardrooms
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
              className="track-grid"
            >
              {pastBoardrooms2024.slice(0, 12).map((boardroom, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={trackInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.35 + i * 0.02 }}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    padding: 18,
                    transition: "all 0.3s ease",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      margin: "0 0 6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {boardroom.sponsor}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      margin: "0 0 8px",
                      lineHeight: 1.4,
                    }}
                  >
                    {boardroom.venue}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: `${AMBER}90`,
                    }}
                  >
                    {boardroom.date}
                  </span>
                </motion.div>
              ))}
            </div>
            {pastBoardrooms2024.length > 12 && (
              <p style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
                marginTop: 16,
              }}>
                + {pastBoardrooms2024.length - 12} more boardrooms in 2024
              </p>
            )}
          </motion.div>

          {/* 2023 Boardrooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={trackInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 800,
                  color: AMBER,
                }}
              >
                2023
              </span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.05)",
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                {pastBoardrooms2023.length} Boardrooms
              </span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  fontStyle: "italic",
                }}
              >
                Where it all began
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
              className="track-grid"
            >
              {pastBoardrooms2023.map((boardroom, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={trackInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.55 + i * 0.02 }}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    padding: 18,
                    transition: "all 0.3s ease",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      margin: "0 0 6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {boardroom.sponsor}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      margin: "0 0 8px",
                      lineHeight: 1.4,
                    }}
                  >
                    {boardroom.venue}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: `${AMBER}70`,
                    }}
                  >
                    {boardroom.date}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          UPCOMING BOARDROOMS
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={upcomingRef}
        style={{
          background: "#07060A",
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
              Coming Up
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
          background: "#0A0A0A",
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
            Who Attends Our Boardrooms
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
          FINAL CTA - Let's Build Your Boardroom
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        id="build"
        style={{
          background: `linear-gradient(135deg, ${AMBER}20 0%, #07060A 40%)`,
          padding: "clamp(100px, 12vw, 160px) clamp(20px, 4vw, 60px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Accent */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${AMBER}15 0%, transparent 70%)`,
            filter: "blur(80px)",
            transform: "translateY(-50%)",
          }}
        />

        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: AMBER,
                display: "block",
                marginBottom: 20,
              }}
            >
              Ready to Start?
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 20px",
                lineHeight: 1.1,
              }}
            >
              Let&apos;s Build Your Next
              <br />
              <span style={{ color: AMBER }}>High-Impact Boardroom</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 18,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                margin: "0 0 44px",
                maxWidth: 650,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Tell us about your goals. We&apos;ll design a boardroom experience that puts your brand 
              in front of the right decision-makers, in the right room, with the right outcomes.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "20px 48px",
                  borderRadius: 60,
                  background: AMBER,
                  color: "#07060A",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 17,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
              >
                Start the Conversation
                <span style={{ fontSize: 20 }}>→</span>
              </Link>
            </div>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
                marginTop: 24,
              }}
            >
              Typical response time: under 24 hours
            </p>
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
          .format-grid, .upcoming-grid, .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .track-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .process-grid {
            grid-template-columns: 1fr !important;
          }
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr) !important;
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
          .benefits-grid {
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
