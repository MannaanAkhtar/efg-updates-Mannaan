"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { PostWithAuthor } from "@/lib/supabase";
import { Footer } from "@/components/sections";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const PAD = "0 clamp(20px, 4vw, 60px)";
const PER_PAGE = 9;

const CATEGORY_MAP: Record<string, string> = {
  cybersecurity: "Cybersecurity",
  "ot-security": "OT Security",
  "data-ai": "Data & AI",
  "operational-excellence": "Operational Excellence",
  "threat-intelligence": "Threat Intelligence",
  "compliance-risk": "Compliance & Risk",
  "leadership-strategy": "Leadership",
  "regional-focus": "Regional Focus",
};

const CONTENT_TYPE_MAP: Record<string, string> = {
  analysis: "Analysis",
  "expert-opinion": "Expert Opinion",
  research: "Research",
  "event-recap": "Event Recap",
  "event-preview": "Event Preview",
  "speaker-interview": "Interview",
  news: "News",
  "how-to": "How-To",
  "case-study": "Case Study",
};

const CATEGORY_FILTERS = [
  { label: "All", value: "all" },
  { label: "Cybersecurity", value: "cybersecurity" },
  { label: "OT Security", value: "ot-security" },
  { label: "Data & AI", value: "data-ai" },
  { label: "Operational Excellence", value: "operational-excellence" },
  { label: "Threat Intelligence", value: "threat-intelligence" },
  { label: "Compliance & Risk", value: "compliance-risk" },
  { label: "Leadership", value: "leadership-strategy" },
  { label: "Regional Focus", value: "regional-focus" },
];

const TYPE_FILTERS = [
  { label: "All Types", value: "all" },
  { label: "Analysis", value: "analysis" },
  { label: "Expert Opinion", value: "expert-opinion" },
  { label: "Event Recap", value: "event-recap" },
  { label: "Event Preview", value: "event-preview" },
  { label: "Case Study", value: "case-study" },
  { label: "How-To", value: "how-to" },
  { label: "News", value: "news" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function authorInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
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
// CATEGORY PILL
// ─────────────────────────────────────────────────────────────────────────────

function CategoryPill({ category }: { category: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 40,
        background: "rgba(232,101,26,0.1)",
        fontFamily: "var(--font-outfit)",
        fontSize: 10,
        fontWeight: 600,
        color: "#E8651A",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
      }}
    >
      {CATEGORY_MAP[category] || category}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        overflow: "hidden",
      }}
    >
      {/* Image skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "rgba(255,255,255,0.04)",
        }}
      />
      <div style={{ padding: "20px 24px 24px" }}>
        {/* Category pill skeleton */}
        <div
          className="skeleton-pulse"
          style={{
            width: 80,
            height: 22,
            borderRadius: 40,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 12,
          }}
        />
        {/* Title skeleton */}
        <div
          className="skeleton-pulse"
          style={{
            width: "90%",
            height: 18,
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 8,
          }}
        />
        <div
          className="skeleton-pulse"
          style={{
            width: "60%",
            height: 18,
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 12,
          }}
        />
        {/* Excerpt skeleton */}
        <div
          className="skeleton-pulse"
          style={{
            width: "100%",
            height: 13,
            borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 6,
          }}
        />
        <div
          className="skeleton-pulse"
          style={{
            width: "80%",
            height: 13,
            borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 20,
          }}
        />
        {/* Meta skeleton */}
        <div
          className="skeleton-pulse"
          style={{
            width: "50%",
            height: 10,
            borderRadius: 5,
            background: "rgba(255,255,255,0.04)",
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED HERO POST
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedPost({ post }: { post: PostWithAuthor }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      style={{
        background: "#0A0A0A",
        padding: "0 0 clamp(48px, 6vw, 72px)",
      }}
    >
      <div
        ref={ref}
        style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Link
            href={`/insights/${post.slug}`}
            style={{ textDecoration: "none", display: "block" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              className="featured-card"
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr",
                borderRadius: 20,
                border: hovered
                  ? "1px solid rgba(232,101,26,0.2)"
                  : "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: hovered ? "translateY(-2px)" : "none",
                boxShadow: hovered
                  ? "0 12px 40px rgba(232,101,26,0.1)"
                  : "none",
              }}
            >
              {/* Image side */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 320,
                }}
              >
                {post.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      transform: hovered ? "scale(1.03)" : "scale(1)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(135deg, rgba(232,101,26,0.15) 0%, rgba(232,101,26,0.03) 100%)`,
                    }}
                  />
                )}
                {/* Right edge gradient for blending */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to right, transparent 60%, rgba(10,10,10,0.9) 100%)",
                  }}
                />
              </div>

              {/* Content side */}
              <div
                style={{
                  padding: "clamp(28px, 3vw, 44px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <CategoryPill category={post.category} />

                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(24px, 2.5vw, 32px)",
                    letterSpacing: "-1px",
                    color: "#FFFFFF",
                    lineHeight: 1.2,
                    margin: "16px 0 0",
                  }}
                >
                  {post.title}
                </h2>

                {post.subtitle && (
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 300,
                      fontSize: 15,
                      color: "#A0A0A0",
                      lineHeight: 1.6,
                      margin: "12px 0 0",
                    }}
                  >
                    {post.subtitle}
                  </p>
                )}

                {/* Author / date / reading time */}
                <div
                  className="flex items-center gap-3 flex-wrap"
                  style={{ marginTop: 24 }}
                >
                  {post.authors && (
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "rgba(232,101,26,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        {post.authors.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.authors.avatar_url}
                            alt={post.authors.name}
                            style={{
                              width: 28,
                              height: 28,
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: 10,
                              fontWeight: 800,
                              color: "#E8651A",
                            }}
                          >
                            {authorInitials(post.authors.name)}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#A0A0A0",
                        }}
                      >
                        {post.authors.name}
                      </span>
                    </div>
                  )}
                  <span style={{ color: "#707070", fontSize: 10 }}>·</span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      color: "#707070",
                    }}
                  >
                    {formatDate(post.published_at)}
                  </span>
                  <span style={{ color: "#707070", fontSize: 10 }}>·</span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      color: "#707070",
                    }}
                  >
                    {post.reading_time_minutes} min read
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE CARD
// ─────────────────────────────────────────────────────────────────────────────

function ArticleCard({
  post,
  index,
  onAuthorClick,
}: {
  post: PostWithAuthor;
  index: number;
  onAuthorClick?: (name: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.04, ease: EASE }}
    >
      <Link
        href={`/insights/${post.slug}`}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            borderRadius: 16,
            border: hovered
              ? "1px solid rgba(232,101,26,0.25)"
              : "1px solid rgba(255,255,255,0.06)",
            background: hovered
              ? "rgba(232,101,26,0.02)"
              : "rgba(255,255,255,0.02)",
            overflow: "hidden",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: hovered ? "translateY(-3px)" : "none",
            boxShadow: hovered
              ? "0 8px 32px rgba(232,101,26,0.1)"
              : "none",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Cover image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              overflow: "hidden",
            }}
          >
            {post.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_image_url}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: hovered ? "scale(1.03)" : "scale(1)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, rgba(232,101,26,0.12) 0%, rgba(232,101,26,0.02) 100%)`,
                }}
              />
            )}
            {/* Bottom gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Content */}
          <div
            style={{
              padding: "20px 24px 24px",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <CategoryPill category={post.category} />

            <h3
              className="article-title-clamp"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.3px",
                color: "#FFFFFF",
                lineHeight: 1.3,
                margin: "12px 0 0",
              }}
            >
              {post.title}
            </h3>

            {post.excerpt && (
              <p
                className="article-excerpt-clamp"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 300,
                  fontSize: 13.5,
                  color: "#A0A0A0",
                  lineHeight: 1.55,
                  margin: "8px 0 0",
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div
              className="flex items-center gap-2 flex-wrap"
              style={{ marginTop: "auto", paddingTop: 16 }}
            >
              {post.authors && (
                <>
                  <span
                    onClick={(e) => {
                      if (onAuthorClick) {
                        e.preventDefault();
                        e.stopPropagation();
                        onAuthorClick(post.authors!.name);
                      }
                    }}
                    className={onAuthorClick ? "article-author-link" : ""}
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#707070",
                      cursor: onAuthorClick ? "pointer" : "default",
                      transition: "color 0.2s",
                    }}
                  >
                    {post.authors.name}
                  </span>
                  <span style={{ color: "#404040", fontSize: 8 }}>·</span>
                </>
              )}
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 400,
                  color: "#707070",
                }}
              >
                {formatDate(post.published_at)}
              </span>
              <span style={{ color: "#404040", fontSize: 8 }}>·</span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 400,
                  color: "#707070",
                }}
              >
                {post.reading_time_minutes} min read
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [contentType, setContentType] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        if (!supabase) return;
        const { data } = await supabase
          .from("posts")
          .select("*, authors(*)")
          .order("published_at", { ascending: false });

        if (data) setPosts(data as PostWithAuthor[]);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Featured post
  const featuredPost = useMemo(() => {
    return posts.find((p) => p.is_featured) || null;
  }, [posts]);

  // Filter logic (excludes featured post from grid)
  const filtered = useMemo(() => {
    const result = posts
      .filter((p) => {
        // Exclude featured post from the grid
        if (featuredPost && p.id === featuredPost.id) return false;
        // Search
        if (search) {
          const q = search.toLowerCase();
          const titleMatch = p.title.toLowerCase().includes(q);
          const excerptMatch = p.excerpt?.toLowerCase().includes(q);
          const authorMatch = p.authors?.name.toLowerCase().includes(q);
          if (!titleMatch && !excerptMatch && !authorMatch) return false;
        }
        // Category
        if (category !== "all" && p.category !== category) return false;
        // Content type
        if (contentType !== "all" && p.content_type !== contentType)
          return false;
        return true;
      });

    // Sort
    if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.published_at).getTime() -
          new Date(b.published_at).getTime()
      );
    }
    // "latest" is default order from Supabase (descending)

    return result;
  }, [posts, search, category, contentType, sortBy, featuredPost]);

  const visiblePosts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [search, category, contentType, sortBy]);

  return (
    <div>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
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
              radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,101,26,0.08) 0%, transparent 55%),
              radial-gradient(ellipse 40% 30% at 85% 15%, rgba(232,101,26,0.04) 0%, transparent 50%)
            `,
          }}
        />

        {/* Ghost text */}
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -52%)",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(120px, 20vw, 280px)",
            letterSpacing: "-8px",
            color: "rgba(255,255,255,0.025)",
            whiteSpace: "nowrap",
            zIndex: 0,
          }}
        >
          INSIGHTS
        </div>

        <div
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: PAD,
            position: "relative",
            zIndex: 10,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <SectionLabel text="Editorial" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(40px, 6vw, 80px)",
              letterSpacing: "-3px",
              color: "#FFFFFF",
              lineHeight: 1.05,
              margin: "0 0 20px",
              maxWidth: 700,
            }}
          >
            Insights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(15px, 1.3vw, 18px)",
              color: "#A0A0A0",
              lineHeight: 1.65,
              maxWidth: 560,
              margin: 0,
            }}
          >
            Expert analysis, industry trends, and thought leadership from the
            minds shaping cybersecurity, data &amp; AI, and operational
            excellence worldwide.
          </motion.p>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      {!loading && featuredPost && <FeaturedPost post={featuredPost} />}

      {/* ── FILTER BAR ── */}
      <div
        className="insights-filter-bar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,10,10,0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: "14px clamp(20px, 4vw, 60px)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Top row: search + results count */}
          <div
            className="flex items-center gap-4 flex-wrap"
          >
            {/* Search */}
            <div
              style={{
                position: "relative",
                flex: "1 1 220px",
                minWidth: 180,
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#707070"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 40px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 400,
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              />
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "latest" | "oldest")
              }
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                color: "#A0A0A0",
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 400,
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23707070' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                paddingRight: 28,
              }}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* Results count */}
            {!loading && (
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#707070",
                  letterSpacing: "0.2px",
                  whiteSpace: "nowrap",
                  marginLeft: "auto",
                }}
              >
                Showing {Math.min(visibleCount, filtered.length)} of{" "}
                {filtered.length} articles
              </span>
            )}
          </div>

          {/* Category pills row */}
          <div
            className="insights-category-scroll"
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 2,
            }}
          >
            {CATEGORY_FILTERS.map((f) => {
              const isActive = category === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setCategory(f.value)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 40,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#FFFFFF" : "#707070",
                    background: isActive
                      ? "#E8651A"
                      : "rgba(255,255,255,0.02)",
                    border: isActive
                      ? "1px solid #E8651A"
                      : "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    letterSpacing: "0.2px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Content type pills row */}
          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 2,
            }}
          >
            {TYPE_FILTERS.map((f) => {
              const isActive = contentType === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setContentType(f.value)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 40,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#FFFFFF" : "#606060",
                    background: isActive
                      ? "rgba(232,101,26,0.8)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(232,101,26,0.8)"
                      : "1px solid rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    letterSpacing: "0.2px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ARTICLE GRID ── */}
      <section
        ref={gridRef}
        style={{
          background: "#0A0A0A",
          padding: "clamp(32px, 4vw, 48px) 0 clamp(48px, 6vw, 72px)",
          minHeight: 400,
        }}
      >
        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
          {loading ? (
            <div
              className="insights-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(16px, 2vw, 24px)",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={gridInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                textAlign: "center",
                padding: "clamp(48px, 6vw, 80px) 0",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#707070"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  letterSpacing: "-0.5px",
                  color: "#FFFFFF",
                  margin: "0 0 8px",
                }}
              >
                No articles found
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "#A0A0A0",
                  margin: 0,
                }}
              >
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
            </motion.div>
          ) : (
            <>
              <div
                className="insights-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "clamp(16px, 2vw, 24px)",
                }}
              >
                {visiblePosts.map((post, i) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    index={i}
                    onAuthorClick={(name) => setSearch(name)}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "clamp(32px, 4vw, 48px)",
                  }}
                >
                  <button
                    onClick={() =>
                      setVisibleCount((prev) => prev + PER_PAGE)
                    }
                    className="insights-load-more"
                    style={{
                      padding: "12px 32px",
                      borderRadius: 40,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#A0A0A0",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    Load More Articles
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section
        style={{
          background: "#111111",
          position: "relative",
          overflow: "hidden",
          padding: "clamp(48px, 6vw, 72px) 0",
        }}
      >
        {/* Subtle orange gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,101,26,0.04) 0%, transparent 60%)`,
          }}
        />

        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: PAD,
            position: "relative",
            zIndex: 10,
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
            Stay Ahead of the Curve
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(14px, 1.2vw, 16px)",
              color: "#A0A0A0",
              lineHeight: 1.65,
              margin: "0 0 32px",
            }}
          >
            Get weekly insights on cybersecurity, data &amp; AI, and operational
            excellence delivered to your inbox.
          </p>
          <form
            className="flex justify-center gap-3"
            style={{ maxWidth: 450, margin: "0 auto" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${emailFocused ? "rgba(232,101,26,0.3)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 50,
                padding: "14px 24px",
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                color: "#FFFFFF",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            <button
              type="submit"
              className="insights-subscribe-btn"
              style={{
                background: "#E8651A",
                border: "none",
                borderRadius: 50,
                padding: "14px 28px",
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />

      {/* ── STYLES ── */}
      <style jsx global>{`
        .article-title-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .article-excerpt-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .insights-category-scroll::-webkit-scrollbar {
          display: none;
        }
        .insights-category-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .article-author-link:hover {
          color: #e8651a !important;
        }

        select option {
          background: #0a0a0a;
          color: #a0a0a0;
        }

        .insights-load-more:hover {
          border-color: rgba(232, 101, 26, 0.3) !important;
          color: #ffffff !important;
        }

        .insights-subscribe-btn:hover {
          background: #ff7a2e !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(232, 101, 26, 0.25);
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
          .insights-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .insights-grid {
            grid-template-columns: 1fr !important;
          }
          .featured-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
