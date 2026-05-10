"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { SpeakerWithEvents } from "@/lib/supabase/types";
import { Footer } from "@/components/sections";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const PAD = "0 clamp(20px, 4vw, 60px)";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function roleLabel(role: string): string {
  if (role === "conference-chair") return "Conference Chair";
  if (role === "advisor") return "Advisor";
  if (role === "keynote") return "Keynote Speaker";
  if (role === "moderator") return "Moderator";
  if (role === "panelist") return "Panelist";
  if (role === "workshop_lead") return "Workshop Lead";
  return "Speaker";
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
      <span
        style={{
          width: 30,
          height: 1,
          background: "#E8651A",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#E8651A",
          fontFamily: "var(--font-outfit)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARE BUTTONS
// ─────────────────────────────────────────────────────────────────────────────

function ShareButtons({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "width=600,height=500"
    );
  };

  const shareOnX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out ${name} speaking at EFG events`
    );
    window.open(
      `https://x.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
      "width=600,height=500"
    );
  };

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#707070",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: 400,
          color: "#505050",
          marginRight: 4,
        }}
      >
        Share
      </span>
      <button
        onClick={shareOnLinkedIn}
        className="share-btn"
        style={btnStyle}
        title="Share on LinkedIn"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>
      <button
        onClick={shareOnX}
        className="share-btn"
        style={btnStyle}
        title="Share on X"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        onClick={handleCopyLink}
        className="share-btn"
        style={btnStyle}
        title={copied ? "Copied!" : "Copy link"}
      >
        {copied ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E8651A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

function SpeakerDetailSkeleton() {
  return (
    <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
      {/* Back link skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          width: 160,
          height: 14,
          borderRadius: 7,
          background: "rgba(255,255,255,0.04)",
          marginBottom: 48,
        }}
      />

      {/* Avatar */}
      <div
        className="skeleton-pulse"
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          marginBottom: 24,
        }}
      />

      {/* Name */}
      <div
        className="skeleton-pulse"
        style={{
          width: "clamp(200px, 40%, 400px)",
          height: 36,
          borderRadius: 10,
          background: "rgba(255,255,255,0.04)",
          marginBottom: 12,
        }}
      />

      {/* Title */}
      <div
        className="skeleton-pulse"
        style={{
          width: "clamp(160px, 30%, 300px)",
          height: 18,
          borderRadius: 8,
          background: "rgba(255,255,255,0.04)",
          marginBottom: 8,
        }}
      />

      {/* Organization */}
      <div
        className="skeleton-pulse"
        style={{
          width: 140,
          height: 14,
          borderRadius: 7,
          background: "rgba(255,255,255,0.04)",
          marginBottom: 16,
        }}
      />

      {/* Badge */}
      <div
        className="skeleton-pulse"
        style={{
          width: 120,
          height: 28,
          borderRadius: 40,
          background: "rgba(255,255,255,0.04)",
          marginBottom: 48,
        }}
      />

      {/* Description lines */}
      {[100, 95, 80].map((w, i) => (
        <div
          key={i}
          className="skeleton-pulse"
          style={{
            width: `${w}%`,
            height: 14,
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 10,
          }}
        />
      ))}

      {/* Event cards */}
      <div style={{ marginTop: 56 }}>
        <div
          className="skeleton-pulse"
          style={{
            width: 200,
            height: 14,
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 24,
          }}
        />
        <div
          className="speaker-detail-events-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(12px, 2vw, 20px)",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="skeleton-pulse"
              style={{
                height: 120,
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT CARD
// ─────────────────────────────────────────────────────────────────────────────

function EventCard({
  eventName,
  year,
  role,
  index,
}: {
  eventName: string;
  year: number;
  role: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "clamp(20px, 2.5vw, 28px)",
        borderRadius: 16,
        border: hovered
          ? "1px solid rgba(232,101,26,0.3)"
          : "1px solid rgba(255,255,255,0.06)",
        background: hovered
          ? "rgba(232,101,26,0.03)"
          : "rgba(255,255,255,0.02)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 32px rgba(232,101,26,0.1)" : "none",
      }}
    >
      <h4
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 15,
          fontWeight: 600,
          color: "#FFFFFF",
          margin: "0 0 6px",
          letterSpacing: "-0.2px",
        }}
      >
        {eventName}
      </h4>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 13,
          fontWeight: 400,
          color: "#707070",
          margin: "0 0 10px",
        }}
      >
        {year}
      </p>
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          color: "#A0A0A0",
          letterSpacing: "0.3px",
        }}
      >
        {roleLabel(role)}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function SpeakerDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const aboutRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: "-60px" });
  const eventsInView = useInView(eventsRef, { once: true, margin: "-60px" });

  const [speaker, setSpeaker] = useState<SpeakerWithEvents | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchSpeaker() {
      try {
        if (!supabase) { setNotFound(true); return; }
        const { data, error } = await supabase
          .from("speakers")
          .select("*, speaker_events(*)")
          .eq("slug", slug)
          .single();

        if (error) {
          console.error("Supabase error:", error);
          setNotFound(true);
          return;
        }
        if (data) {
          setSpeaker(data as SpeakerWithEvents);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to fetch speaker:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchSpeaker();
  }, [slug]);

  const fullName = speaker?.name ?? "";

  const initials = speaker
    ? speaker.name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "";

  const primaryRole = speaker?.role_type;
  const showBadge = primaryRole === "chair" || primaryRole === "advisor";
  const badgeLabel = primaryRole === "chair" ? "Conference Chair" : "Advisor";

  // ── NOT FOUND ──
  if (!loading && notFound) {
    return (
      <div>
        <section
          style={{
            background: "#0A0A0A",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: "center", padding: 40 }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#707070"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(24px, 3vw, 36px)",
                letterSpacing: "-1px",
                color: "#FFFFFF",
                margin: "0 0 10px",
              }}
            >
              Speaker Not Found
            </h1>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 300,
                fontSize: 15,
                color: "#A0A0A0",
                margin: "0 0 28px",
                lineHeight: 1.6,
              }}
            >
              This speaker doesn&apos;t exist or may have been removed.
            </p>
            <Link
              href="/speakers"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                borderRadius: 12,
                background: "#E8651A",
                color: "#FFFFFF",
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Speakers
            </Link>
          </motion.div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      {/* ── HEADER SECTION ── */}
      <section
        style={{
          background: "#0A0A0A",
          position: "relative",
          overflow: "hidden",
          padding: "clamp(100px, 12vw, 150px) 0 clamp(48px, 6vw, 72px)",
        }}
      >
        {/* Ambient gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 60% 45% at 30% 10%, rgba(232,101,26,0.06) 0%, transparent 55%),
              radial-gradient(ellipse 40% 30% at 80% 20%, rgba(232,101,26,0.03) 0%, transparent 50%)
            `,
          }}
        />

        {/* Ghost text */}
        {speaker && (
          <div
            className="absolute pointer-events-none select-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -52%)",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(80px, 14vw, 220px)",
              letterSpacing: "-6px",
              color: "rgba(255,255,255,0.02)",
              whiteSpace: "nowrap",
              zIndex: 0,
              maxWidth: "100vw",
              overflow: "hidden",
            }}
          >
            {fullName}
          </div>
        )}

        <div
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: PAD,
            position: "relative",
            zIndex: 10,
          }}
        >
          {loading ? (
            <SpeakerDetailSkeleton />
          ) : (
            speaker && (
              <>
                {/* Back link */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ marginBottom: 40 }}
                >
                  <Link
                    href="/speakers"
                    className="speaker-back-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      fontWeight: 400,
                      color: "#A0A0A0",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Speakers
                  </Link>
                </motion.div>

                {/* Avatar / Portrait */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                >
                  {speaker.image_url ? (
                    <div
                      style={{
                        width: 180,
                        height: 240,
                        borderRadius: 16,
                        overflow: "hidden",
                        marginBottom: 28,
                        background: "rgba(232,101,26,0.06)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={speaker.image_url}
                        alt={fullName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: "50%",
                        background: "rgba(232,101,26,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 24,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 30,
                          fontWeight: 800,
                          color: "#E8651A",
                          letterSpacing: "-1px",
                        }}
                      >
                        {initials}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(28px, 4vw, 48px)",
                    letterSpacing: "-2px",
                    color: "#FFFFFF",
                    lineHeight: 1.1,
                    margin: "0 0 12px",
                  }}
                >
                  {fullName}
                </motion.h1>

                {/* Job title */}
                {speaker.title && (
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 300,
                      fontSize: "clamp(16px, 2vw, 20px)",
                      color: "#A0A0A0",
                      lineHeight: 1.4,
                      margin: "0 0 6px",
                    }}
                  >
                    {speaker.title}
                  </motion.p>
                )}

                {/* Organization */}
                {speaker.organization && (
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 400,
                      fontSize: 14,
                      color: "#707070",
                      margin: "0 0 16px",
                    }}
                  >
                    {speaker.organization}
                  </motion.p>
                )}

                {/* Role badge */}
                {showBadge && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 16px",
                        borderRadius: 40,
                        background: "rgba(232,101,26,0.1)",
                        border: "1px solid rgba(232,101,26,0.2)",
                        fontFamily: "var(--font-outfit)",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#E8651A",
                      }}
                    >
                      {badgeLabel}
                    </span>
                  </motion.div>
                )}
              </>
            )
          )}
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      {!loading && speaker && (
        <section
          style={{
            background: "#0A0A0A",
            padding: "clamp(48px, 6vw, 72px) 0",
          }}
        >
          <div
            ref={aboutRef}
            style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <SectionLabel text="About" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              style={{ maxWidth: 720 }}
            >
              {speaker.bio ? (
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 300,
                    fontSize: "clamp(14px, 1.2vw, 16px)",
                    color: "#A0A0A0",
                    lineHeight: 1.8,
                    margin: "0 0 28px",
                  }}
                >
                  {speaker.bio}
                </p>
              ) : (
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: 14,
                    color: "#707070",
                    lineHeight: 1.8,
                    margin: "0 0 28px",
                  }}
                >
                  More details coming soon.
                </p>
              )}

              {/* LinkedIn button + Share buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                className="flex items-center gap-3 flex-wrap"
              >
                {speaker.linkedin_url && (
                  <a
                    href={speaker.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="speaker-linkedin-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 28px",
                      borderRadius: 12,
                      background: "#E8651A",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    View LinkedIn Profile
                  </a>
                )}

                {/* Share buttons */}
                <ShareButtons name={fullName} />
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── SPEAKING ENGAGEMENTS ── */}
      {!loading && speaker && (
        <section
          style={{
            background: "#111111",
            padding: "clamp(48px, 6vw, 72px) 0",
          }}
        >
          <div
            ref={eventsRef}
            style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={eventsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <SectionLabel text="Speaking Engagements" />
            </motion.div>

            {speaker.speaker_events && speaker.speaker_events.length > 0 ? (
              <div
                className="speaker-detail-events-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "clamp(12px, 2vw, 20px)",
                }}
              >
                {speaker.speaker_events.map((ev, i) => (
                  <EventCard
                    key={ev.id}
                    eventName={ev.event_name}
                    year={ev.event_year ?? 0}
                    role={ev.role_at_event}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={eventsInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: 14,
                  color: "#707070",
                  margin: 0,
                }}
              >
                No events recorded yet.
              </motion.p>
            )}
          </div>
        </section>
      )}

      <Footer />

      {/* ── STYLES ── */}
      <style jsx global>{`
        .speaker-back-link:hover {
          color: #e8651a !important;
        }
        .share-btn:hover {
          border-color: rgba(232, 101, 26, 0.3) !important;
          color: #e8651a !important;
          background: rgba(232, 101, 26, 0.05) !important;
        }
        .speaker-linkedin-btn:hover {
          background: #ff7a2e !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(232, 101, 26, 0.25);
        }

        @keyframes skeletonPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        .skeleton-pulse {
          animation: skeletonPulse 1.5s ease-in-out infinite;
        }

        @media (max-width: 1024px) {
          .speaker-detail-events-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .speaker-detail-events-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
