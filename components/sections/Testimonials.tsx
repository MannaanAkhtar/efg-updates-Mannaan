"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// SEO Schema
function TestimonialVideoSchema({ videos }: { videos: { id: string; label: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Events First Group Testimonials",
    description: "Video testimonials from sponsors, delegates and speakers at Events First Group summits",
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: `${video.label} - Events First Group Testimonial`,
        description: "Testimonial from Events First Group summit attendee",
        thumbnailUrl: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        uploadDate: "2025-01-01",
        publisher: { "@type": "Organization", name: "Events First Group", url: "https://eventsfirstgroup.com" },
      },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const videoShorts = [
  // Cyber First (6)
  { id: "jPQFjwuohfI", label: "Cyber First" },
  { id: "c8sPwIo4Pis", label: "Cyber First" },
  { id: "2LoeDNqsem0", label: "Cyber First" },
  { id: "8C61dof_f3s", label: "Cyber First" },
  { id: "2-KXhfSeBdQ", label: "Cyber First" },
  { id: "2IwKmGEfOIo", label: "Cyber First" },
  // OT Security First (5)
  { id: "Q0n_sVaMnxg", label: "OT Security First" },
  { id: "SF87voLk34A", label: "OT Security First" },
  { id: "R5dtc5kjiQU", label: "OT Security First" },
  { id: "Hm_yj3NttPo", label: "OT Security First" },
  { id: "aaG9We6AjY8", label: "OT Security First" },
  // OPEX First (8)
  { id: "WCsfo5Z6xVY", label: "OPEX First" },
  { id: "baCK3xnKh68", label: "OPEX First" },
  { id: "vMv0AfXMQL0", label: "OPEX First" },
  { id: "AefPAed0g-I", label: "OPEX First" },
  { id: "SH9Z1U2_rAM", label: "OPEX First" },
  { id: "wLgYOHHB6o4", label: "OPEX First" },
  { id: "2jpIlqo0HSY", label: "OPEX First" },
  { id: "SLkj5gO-LQ8", label: "OPEX First" },
];

// ─── VIDEO CARD ──────────────────────────────────────────────────────────────
function ShortCard({ videoId, label }: { videoId: string; label: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="vr-card" onClick={() => !isPlaying && setIsPlaying(true)}>
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            src={`https://img.youtube.com/vi/${videoId}/oar2.jpg`}
            alt={`${label} testimonial`}
            className="vr-thumb"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
          />
          <div className="vr-overlay" />
          <div className="vr-play-wrap">
            <div className="vr-play-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
          <div className="vr-label">
            <span style={{
              background: label === "Cyber First"
                ? "linear-gradient(135deg, rgba(1,187,245,0.3) 0%, rgba(1,187,245,0.15) 100%)"
                : label === "OT Security First"
                ? "linear-gradient(135deg, rgba(211,75,154,0.3) 0%, rgba(211,75,154,0.15) 100%)"
                : "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(124,58,237,0.15) 100%)",
              borderColor: label === "Cyber First"
                ? "rgba(1,187,245,0.3)"
                : label === "OT Security First"
                ? "rgba(211,75,154,0.3)"
                : "rgba(124,58,237,0.3)",
            }}>{label}</span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN SECTION ────────────────────────────────────────────────────────────
export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Mix of all series for showcase
  const showcaseVideos = [
    videoShorts[0],  // Cyber First
    videoShorts[6],  // OT Security First
    videoShorts[11], // OPEX First
    videoShorts[2],  // Cyber First
    videoShorts[8],  // OT Security First
  ];
  const showcaseIds = new Set(showcaseVideos.map(v => v.id));
  const marqueeVideos = videoShorts.filter(v => !showcaseIds.has(v.id));

  return (
    <section ref={sectionRef} className="vr-section">
      <TestimonialVideoSchema videos={videoShorts} />
      <div className="vr-glow" />

      <div className="vr-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ width: 24, height: 2, background: "var(--orange)", borderRadius: 1 }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--orange)" }}>Voices from the Room</span>
          </div>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1, ease: EASE }} className="vr-heading">
          What Attendees Say
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: EASE }} className="vr-subtitle">
          Hear directly from CISOs, CTOs, and industry leaders who have attended our summits.
        </motion.p>

        {/* Staggered Showcase — 5 cards, alternating heights */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="vr-showcase">
          {showcaseVideos.map((v, i) => (
            <div key={v.id} className={`vr-showcase-slot vr-slot-${i % 2 === 0 ? "tall" : "short"} ${i === 2 ? "vr-slot-hero" : ""}`}>
              <ShortCard videoId={v.id} label={v.label} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Marquee — full width, outside container */}
      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.7, delay: 0.4, ease: EASE }} className="vr-marquee-wrap">
        <div className="vr-marquee-track">
          {marqueeVideos.map(v => (
            <div key={v.id} className="vr-marquee-card"><ShortCard videoId={v.id} label={v.label} /></div>
          ))}
          {marqueeVideos.map(v => (
            <div key={`d-${v.id}`} className="vr-marquee-card"><ShortCard videoId={v.id} label={v.label} /></div>
          ))}
        </div>
      </motion.div>

      <style jsx global>{`
        .vr-section {
          background: #0A0A0A;
          padding: clamp(56px, 7vw, 90px) 0 clamp(40px, 5vw, 60px);
          position: relative;
          overflow: hidden;
        }
        .vr-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(232,101,26,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 20% 50%, rgba(1,187,245,0.02) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 80% 50%, rgba(124,58,237,0.02) 0%, transparent 50%);
        }
        .vr-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 40px);
          position: relative;
        }

        /* Header */
        .vr-heading {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px); letter-spacing: -1.5px;
          color: #fff; line-height: 1.15; margin: 0 0 8px;
        }
        .vr-subtitle {
          font-family: var(--font-outfit); font-weight: 300;
          font-size: clamp(14px, 1.2vw, 16px); color: rgba(255,255,255,0.45);
          line-height: 1.7; margin: 0 0 clamp(28px, 3.5vw, 40px); max-width: 500px;
        }

        /* ── Staggered Showcase ── */
        .vr-showcase {
          display: flex;
          gap: 14px;
          align-items: center;
          justify-content: center;
          margin-bottom: clamp(28px, 3vw, 40px);
        }
        .vr-showcase-slot {
          flex-shrink: 0;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .vr-showcase-slot:hover { transform: translateY(-6px); }
        .vr-slot-tall { width: 200px; height: 340px; }
        .vr-slot-short { width: 180px; height: 270px; }
        .vr-slot-hero.vr-slot-tall { width: 220px; height: 380px; }

        /* ── Card ── */
        .vr-card {
          position: relative; width: 100%; height: 100%;
          border-radius: 18px; overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: border-color 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
        }
        .vr-card:hover {
          border-color: rgba(232,101,26,0.3);
          box-shadow: 0 16px 48px rgba(232,101,26,0.12), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .vr-card:hover .vr-thumb { transform: scale(1.06); }
        .vr-card:hover .vr-play-btn {
          background: rgba(232,101,26,0.9);
          border-color: rgba(232,101,26,0.4);
          transform: scale(1.2);
          box-shadow: 0 0 0 8px rgba(232,101,26,0.12), 0 4px 16px rgba(232,101,26,0.25);
        }
        .vr-card:hover .vr-label span {
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.3);
        }

        /* Thumbnail */
        .vr-thumb {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center 20%;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }

        /* Overlay — bottom only */
        .vr-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%);
        }

        /* Play — small, white, Apple-like */
        .vr-play-wrap {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .vr-play-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          animation: vr-pulse 3s ease-in-out infinite;
        }
        @keyframes vr-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.08); }
          50% { box-shadow: 0 0 0 6px rgba(255,255,255,0.04); }
        }

        /* Label pill */
        .vr-label {
          position: absolute; bottom: 10px; left: 10px; z-index: 2;
        }
        .vr-label span {
          font-family: var(--font-outfit); font-size: 8px; font-weight: 600;
          letter-spacing: 1.2px; text-transform: uppercase; color: #fff;
          padding: 4px 10px; border-radius: 50px;
          border-style: solid; border-width: 1px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 10px rgba(0,0,0,0.25);
          transition: box-shadow 0.3s ease;
        }

        /* ── Marquee ── */
        .vr-marquee-wrap {
          overflow: hidden;
          margin-top: 0;
          position: relative;
          mask-image: linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%);
        }
        .vr-marquee-track {
          display: flex; gap: 12px; width: max-content;
          animation: vr-scroll 50s linear infinite;
        }
        .vr-marquee-track:hover { animation-play-state: paused; }
        .vr-marquee-card { width: 170px; height: 255px; flex-shrink: 0; }

        @keyframes vr-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .vr-showcase { flex-wrap: nowrap; overflow-x: auto; justify-content: flex-start; padding-bottom: 8px; }
          .vr-showcase::-webkit-scrollbar { display: none; }
          .vr-slot-tall { width: 130px; height: 220px; }
          .vr-slot-short { width: 120px; height: 180px; }
          .vr-slot-hero.vr-slot-tall { width: 145px; height: 250px; }
        }
        @media (max-width: 560px) {
          .vr-slot-tall { width: 110px; height: 185px; }
          .vr-slot-short { width: 100px; height: 155px; }
          .vr-slot-hero.vr-slot-tall { width: 120px; height: 210px; }
          .vr-marquee-card { width: 100px; height: 150px; }
        }
      `}</style>
    </section>
  );
}
