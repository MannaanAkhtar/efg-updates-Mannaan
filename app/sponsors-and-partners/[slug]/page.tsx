"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { SponsorWithEvents } from "@/lib/supabase/types";
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

function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function tierToSponsorLabel(tier: string): string {
  const label = slugToLabel(tier);
  const lower = tier.toLowerCase();
  if (lower === "media" || lower === "media-partner") return "Media Partner";
  if (lower.includes("partner")) return label;
  return `${label} Sponsor`;
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  platinum: { bg: "rgba(180,180,200,0.1)", text: "#B4B4C8", border: "rgba(180,180,200,0.2)" },
  gold: { bg: "rgba(218,165,32,0.1)", text: "#DAA520", border: "rgba(218,165,32,0.2)" },
  silver: { bg: "rgba(170,170,180,0.1)", text: "#AAAAB4", border: "rgba(170,170,180,0.2)" },
  bronze: { bg: "rgba(176,141,87,0.1)", text: "#B08D57", border: "rgba(176,141,87,0.2)" },
};

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
      <span
        style={{
          width: 30,
          height: 1,
          background: "var(--orange)",
          flexShrink: 0,
        }}
      />
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
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

function SponsorDetailSkeleton() {
  return (
    <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
      {/* Back link skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          width: 180,
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
          width: 80,
          height: 80,
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
          marginBottom: 14,
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
            width: 160,
            height: 14,
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 24,
          }}
        />
        <div
          className="sponsor-detail-events-grid"
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
  tier,
  index,
}: {
  eventName: string;
  year: number;
  tier: string;
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
        {tierToSponsorLabel(tier)}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function SponsorDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const aboutRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: "-60px" });
  const eventsInView = useInView(eventsRef, { once: true, margin: "-60px" });

  const [sponsor, setSponsor] = useState<SponsorWithEvents | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchSponsor() {
      try {
        if (!supabase) { setNotFound(true); return; }
        const { data, error } = await supabase
          .from("sponsors")
          .select("*, sponsor_events(*)")
          .eq("slug", slug)
          .single();

        if (error) {
          console.error("Supabase error:", error);
          setNotFound(true);
          return;
        }
        if (data) {
          setSponsor(data as SponsorWithEvents);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to fetch sponsor:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchSponsor();
  }, [slug]);

  const initials = sponsor
    ? sponsor.name
        .split(/[\s-]+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "";

  const description = sponsor?.full_description || sponsor?.short_description || null;

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
              Sponsor Not Found
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
              This sponsor doesn&apos;t exist or may have been removed.
            </p>
            <Link
              href="/sponsors-and-partners"
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
              Back to Sponsors
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
        {sponsor && (
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
            {sponsor.name}
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
            <SponsorDetailSkeleton />
          ) : (
            sponsor && (
              <>
                {/* Back link */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ marginBottom: 40 }}
                >
                  <Link
                    href="/sponsors-and-partners"
                    className="sponsor-back-link"
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
                    Back to Sponsors &amp; Partners
                  </Link>
                </motion.div>

                {/* Logo / Avatar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                >
                  {sponsor.logo_url ? (
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.95)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                        marginBottom: 28,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 80,
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
                          fontSize: 26,
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
                    margin: "0 0 16px",
                  }}
                >
                  {sponsor.name}
                </motion.h1>

                {/* Tier badge */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      borderRadius: 40,
                      background:
                        TIER_COLORS[sponsor.tier.toLowerCase()]?.bg ||
                        "rgba(232,101,26,0.1)",
                      border: `1px solid ${TIER_COLORS[sponsor.tier.toLowerCase()]?.border || "rgba(232,101,26,0.2)"}`,
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color:
                        TIER_COLORS[sponsor.tier.toLowerCase()]?.text ||
                        "#E8651A",
                    }}
                  >
                    {slugToLabel(sponsor.tier)}
                  </span>
                </motion.div>
              </>
            )
          )}
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      {!loading && sponsor && (
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
              {description ? (
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
                  {description}
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

              {/* Website button */}
              {sponsor.website_url && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                >
                  <a
                    href={sponsor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sponsor-website-btn"
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
                    Visit Website
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── EVENTS PARTICIPATED ── */}
      {!loading && sponsor && (
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
              <SectionLabel text="Events Participated" />
            </motion.div>

            {sponsor.sponsor_events && sponsor.sponsor_events.length > 0 ? (
              <div
                className="sponsor-detail-events-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "clamp(12px, 2vw, 20px)",
                }}
              >
                {sponsor.sponsor_events.map((ev, i) => (
                  <EventCard
                    key={ev.id}
                    eventName={ev.event_name}
                    year={ev.event_year ?? 0}
                    tier={ev.tier_at_event || sponsor.tier}
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

      {/* ── PARTNERSHIP VALUE SECTION ── */}
      {!loading && sponsor && (
        <section
          style={{
            background: "#0A0A0A",
            padding: "clamp(48px, 6vw, 72px) 0",
          }}
        >
          <div
            style={{
              maxWidth: MAX_W,
              margin: "0 auto",
              padding: PAD,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(24px, 3vw, 36px)",
                letterSpacing: "-1px",
                color: "#FFFFFF",
                lineHeight: 1.1,
                margin: "0 0 14px",
              }}
            >
              Interested in Partnering?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 300,
                fontSize: "clamp(14px, 1.2vw, 16px)",
                color: "#A0A0A0",
                lineHeight: 1.65,
                margin: "0 auto 32px",
                maxWidth: 520,
              }}
            >
              Join {sponsor.name} and other industry leaders as an EFG event
              partner. Connect with senior decision-makers worldwide.
            </p>
            <a
              href="mailto:partnerships@eventsfirstgroup.com?subject=Sponsorship%20Inquiry"
              className="sponsor-partner-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 50,
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
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Become a Sponsor
            </a>
          </div>
        </section>
      )}

      <Footer />

      {/* ── STYLES ── */}
      <style jsx global>{`
        .sponsor-partner-btn:hover {
          background: #ff7a2e !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(232, 101, 26, 0.25);
        }
        .sponsor-back-link:hover {
          color: #e8651a !important;
        }
        .sponsor-website-btn:hover {
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
          .sponsor-detail-events-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .sponsor-detail-events-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
