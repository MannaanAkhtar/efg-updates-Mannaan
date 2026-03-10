"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Fragment,
} from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { PostWithAuthor } from "@/lib/supabase";
import { Footer } from "@/components/sections";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const READING_W = 720;
const PAD = "0 clamp(20px, 4vw, 60px)";

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

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string): string {
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
// SHARE BUTTONS
// ─────────────────────────────────────────────────────────────────────────────

function ShareButtons({ title }: { title: string }) {
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
    const text = encodeURIComponent(title);
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
    width: 36,
    height: 36,
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>
      <button
        onClick={shareOnX}
        className="share-btn"
        style={btnStyle}
        title="Share on X"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
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
            width="13"
            height="13"
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
            width="13"
            height="13"
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
// MARKDOWN PARSER — manual, no external deps
// ─────────────────────────────────────────────────────────────────────────────

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      const text = m[2].replace(/\*\*/g, "").replace(/\*/g, "").trim();
      items.push({
        id: slugify(text),
        text,
        level: m[1].length,
      });
    }
  }
  return items;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Link [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Find earliest match
    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const linkIndex = linkMatch ? remaining.indexOf(linkMatch[0]) : Infinity;

    if (boldIndex === Infinity && linkIndex === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIndex <= linkIndex && boldMatch) {
      if (boldIndex > 0) parts.push(remaining.substring(0, boldIndex));
      parts.push(
        <strong key={key++} style={{ color: "#FFFFFF", fontWeight: 500 }}>
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.substring(boldIndex + boldMatch[0].length);
    } else if (linkMatch) {
      if (linkIndex > 0) parts.push(remaining.substring(0, linkIndex));
      parts.push(
        <a
          key={key++}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="article-link"
          style={{
            color: "#E8651A",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.substring(linkIndex + linkMatch[0].length);
    }
  }

  return parts.length === 1 && typeof parts[0] === "string"
    ? parts[0]
    : <>{parts}</>;
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(
        <hr
          key={key++}
          style={{
            border: "none",
            height: 1,
            background: "rgba(255,255,255,0.06)",
            margin: "48px 0",
          }}
        />
      );
      i++;
      continue;
    }

    // H2
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      const text = h2Match[1].replace(/\*\*/g, "").replace(/\*/g, "").trim();
      const id = slugify(text);
      elements.push(
        <div key={key++} id={id} style={{ marginTop: 48, marginBottom: 20 }}>
          <div
            style={{
              width: 24,
              height: 2,
              background: "#E8651A",
              marginBottom: 12,
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {renderInlineMarkdown(text)}
          </h2>
        </div>
      );
      i++;
      continue;
    }

    // H3
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      const text = h3Match[1].replace(/\*\*/g, "").replace(/\*/g, "").trim();
      elements.push(
        <h3
          key={key++}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.3,
            marginTop: 36,
            marginBottom: 16,
          }}
        >
          {renderInlineMarkdown(text)}
        </h3>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={key++}
          style={{
            borderLeft: "3px solid #E8651A",
            paddingLeft: 24,
            margin: "40px 0",
            fontFamily: "var(--font-outfit)",
            fontStyle: "italic",
            fontSize: 20,
            fontWeight: 300,
            color: "#808080",
            lineHeight: 1.6,
          }}
        >
          {quoteLines.join(" ")}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^[-*]\s/, ""));
        i++;
      }
      elements.push(
        <ul
          key={key++}
          className="article-list"
          style={{
            margin: "20px 0 28px",
            paddingLeft: 20,
            listStyleType: "disc",
          }}
        >
          {listItems.map((item, li) => (
            <li
              key={li}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 17,
                fontWeight: 300,
                color: "#C8C8C8",
                lineHeight: 1.85,
                marginBottom: 8,
              }}
            >
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol
          key={key++}
          className="article-list"
          style={{
            margin: "20px 0 28px",
            paddingLeft: 20,
            listStyleType: "decimal",
          }}
        >
          {listItems.map((item, li) => (
            <li
              key={li}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 17,
                fontWeight: 300,
                color: "#C8C8C8",
                lineHeight: 1.85,
                marginBottom: 8,
              }}
            >
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph — collect consecutive non-empty, non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ") &&
      !lines[i].startsWith("> ") &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(
        <p
          key={key++}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 17,
            fontWeight: 300,
            color: "#C8C8C8",
            lineHeight: 1.85,
            margin: "0 0 28px",
          }}
        >
          {renderInlineMarkdown(paraLines.join(" "))}
        </p>
      );
    }
  }

  return <>{elements}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// READING PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 2,
        zIndex: 9999,
        background: "transparent",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "#E8651A",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING TABLE OF CONTENTS
// ─────────────────────────────────────────────────────────────────────────────

function FloatingToc({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    for (const item of toc) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (toc.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
      className="article-toc"
      style={{
        position: "sticky",
        top: 120,
        width: 180,
        alignSelf: "flex-start",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "#505050",
          margin: "0 0 16px",
          paddingLeft: 14,
        }}
      >
        On this page
      </p>
      {toc.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderLeft: `2px solid ${isActive ? "#E8651A" : "rgba(255,255,255,0.06)"}`,
              padding: "6px 0 6px 14px",
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 400,
              color: isActive ? "#A0A0A0" : "#707070",
              lineHeight: 1.5,
              transition: "all 0.25s ease",
              marginLeft: item.level === 3 ? 12 : 0,
            }}
          >
            {item.text}
          </button>
        );
      })}
    </motion.nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RELATED ARTICLE CARD (reuses listing page card style)
// ─────────────────────────────────────────────────────────────────────────────

function RelatedCard({
  post,
  index,
}: {
  post: PostWithAuthor;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: EASE }}
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
                  transition:
                    "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: hovered ? "scale(1.03)" : "scale(1)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg, rgba(232,101,26,0.12) 0%, rgba(232,101,26,0.02) 100%)",
                }}
              />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)",
              }}
            />
          </div>

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
              className="related-title-clamp"
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
            <div
              className="flex items-center gap-2 flex-wrap"
              style={{ marginTop: "auto", paddingTop: 16 }}
            >
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  color: "#707070",
                }}
              >
                {formatDateShort(post.published_at)}
              </span>
              <span style={{ color: "#404040", fontSize: 8 }}>·</span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
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
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div>
      <section
        style={{
          background: "#0A0A0A",
          padding: "clamp(80px, 9vw, 110px) 0 clamp(48px, 6vw, 72px)",
        }}
      >
        <div
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: PAD,
          }}
        >
          {/* Back link */}
          <div
            className="skeleton-pulse"
            style={{
              width: 140,
              height: 14,
              borderRadius: 7,
              background: "rgba(255,255,255,0.04)",
              marginBottom: 40,
            }}
          />
        </div>
        <div
          style={{
            maxWidth: READING_W,
            margin: "0 auto",
            padding: PAD,
          }}
        >
          {/* Category pill */}
          <div
            className="skeleton-pulse"
            style={{
              width: 100,
              height: 24,
              borderRadius: 40,
              background: "rgba(255,255,255,0.04)",
              marginBottom: 20,
            }}
          />
          {/* Title */}
          <div
            className="skeleton-pulse"
            style={{
              width: "90%",
              height: 40,
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              marginBottom: 12,
            }}
          />
          <div
            className="skeleton-pulse"
            style={{
              width: "65%",
              height: 40,
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              marginBottom: 20,
            }}
          />
          {/* Subtitle */}
          <div
            className="skeleton-pulse"
            style={{
              width: "80%",
              height: 18,
              borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              marginBottom: 28,
            }}
          />
          {/* Meta row */}
          <div className="flex items-center gap-3">
            <div
              className="skeleton-pulse"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
              }}
            />
            <div
              className="skeleton-pulse"
              style={{
                width: 120,
                height: 14,
                borderRadius: 7,
                background: "rgba(255,255,255,0.04)",
              }}
            />
            <div
              className="skeleton-pulse"
              style={{
                width: 100,
                height: 14,
                borderRadius: 7,
                background: "rgba(255,255,255,0.04)",
              }}
            />
          </div>
        </div>

        {/* Cover image */}
        <div
          style={{
            maxWidth: MAX_W,
            margin: "40px auto 0",
            padding: PAD,
          }}
        >
          <div
            className="skeleton-pulse"
            style={{
              width: "100%",
              aspectRatio: "21/9",
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
            }}
          />
        </div>

        {/* Body lines */}
        <div
          style={{
            maxWidth: READING_W,
            margin: "48px auto 0",
            padding: PAD,
          }}
        >
          {[100, 95, 100, 80, 100, 90, 60].map((w, i) => (
            <div
              key={i}
              className="skeleton-pulse"
              style={{
                width: `${w}%`,
                height: 16,
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                marginBottom: 16,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const relatedRef = useRef<HTMLDivElement>(null);
  const relatedInView = useInView(relatedRef, { once: true, margin: "-60px" });

  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [related, setRelated] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchPost() {
      try {
        if (!supabase) { setNotFound(true); return; }
        const { data } = await supabase
          .from("posts")
          .select("*, authors(*)")
          .eq("slug", slug)
          .single();

        if (data) {
          const postData = data as PostWithAuthor;
          setPost(postData);

          // Fetch related posts — smarter: try tag overlap first, fall back to category
          let relatedResults: PostWithAuthor[] = [];

          // First, get more posts from the same category
          const { data: categoryPosts } = await supabase
            .from("posts")
            .select("*, authors(*)")
            .eq("category", postData.category)
            .neq("slug", slug)
            .order("published_at", { ascending: false })
            .limit(10);

          if (categoryPosts && categoryPosts.length > 0) {
            const candidates = categoryPosts as PostWithAuthor[];
            // Score by tag overlap
            if (postData.tags && postData.tags.length > 0) {
              const scored = candidates.map((c) => {
                const overlap = c.tags
                  ? c.tags.filter((t) => postData.tags!.includes(t)).length
                  : 0;
                return { post: c, score: overlap };
              });
              scored.sort((a, b) => b.score - a.score);
              relatedResults = scored.slice(0, 3).map((s) => s.post);
            } else {
              relatedResults = candidates.slice(0, 3);
            }
          }

          // If we still need more, fetch from any category
          if (relatedResults.length < 3) {
            const existingIds = relatedResults.map((r) => r.id);
            const { data: morePosts } = await supabase
              .from("posts")
              .select("*, authors(*)")
              .neq("slug", slug)
              .order("published_at", { ascending: false })
              .limit(10);

            if (morePosts) {
              const extras = (morePosts as PostWithAuthor[]).filter(
                (p) => !existingIds.includes(p.id)
              );
              relatedResults = [
                ...relatedResults,
                ...extras.slice(0, 3 - relatedResults.length),
              ];
            }
          }

          setRelated(relatedResults);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  const toc = useMemo(() => {
    if (!post) return [];
    return extractToc(post.content);
  }, [post]);

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
              Article Not Found
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
              This article doesn&apos;t exist or may have been removed.
            </p>
            <Link
              href="/insights"
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
              Back to Insights
            </Link>
          </motion.div>
        </section>
        <Footer />
      </div>
    );
  }

  // ── LOADING ──
  if (loading) {
    return (
      <div>
        <ArticleSkeleton />
        <Footer />
        <style jsx global>{`
          @keyframes skeletonPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .skeleton-pulse {
            animation: skeletonPulse 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div>
      <ReadingProgressBar />

      {/* ── BACK NAV + HEADER ── */}
      <section
        style={{
          background: "#0A0A0A",
          padding: "clamp(80px, 9vw, 110px) 0 0",
        }}
      >
        {/* Back link */}
        <div
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: PAD,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ marginBottom: 40 }}
          >
            <Link
              href="/insights"
              className="article-back-link"
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
              Back to Insights
            </Link>
          </motion.div>
        </div>

        {/* Article header */}
        <div
          style={{
            maxWidth: READING_W,
            margin: "0 auto",
            padding: PAD,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <CategoryPill category={post.category} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 48px)",
              letterSpacing: "-2px",
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: "20px 0 0",
            }}
          >
            {post.title}
          </motion.h1>

          {post.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 300,
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "#A0A0A0",
                lineHeight: 1.6,
                margin: "16px 0 0",
              }}
            >
              {post.subtitle}
            </motion.p>
          )}

          {/* Metadata row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="flex items-center gap-4 flex-wrap"
            style={{ marginTop: 28 }}
          >
            {post.authors && (
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 36,
                    height: 36,
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
                        width: 36,
                        height: 36,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 12,
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
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#FFFFFF",
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
                fontSize: 14,
                color: "#707070",
              }}
            >
              {formatDate(post.published_at)}
            </span>
            <span style={{ color: "#707070", fontSize: 10 }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                color: "#707070",
              }}
            >
              {post.reading_time_minutes} min read
            </span>
          </motion.div>

          {/* Tags + Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            className="flex items-center justify-between flex-wrap gap-4"
            style={{ marginTop: 16 }}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags &&
                post.tags.length > 0 &&
                post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 40,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#707070",
                    }}
                  >
                    {tag}
                  </span>
                ))}
            </div>

            {/* Share buttons */}
            <ShareButtons title={post.title} />
          </motion.div>
        </div>

        {/* Cover image */}
        {post.cover_image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            style={{
              maxWidth: MAX_W,
              margin: "40px auto 0",
              padding: PAD,
            }}
          >
            <div
              className="article-cover"
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "21/9",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_image_url}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, #0A0A0A 0%, transparent 30%)",
                }}
              />
            </div>
          </motion.div>
        )}
      </section>

      {/* ── ARTICLE BODY WITH TOC ── */}
      <section
        style={{
          background: "#0A0A0A",
          padding: "48px 0 clamp(48px, 6vw, 72px)",
        }}
      >
        <div
          className="article-body-wrapper"
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: PAD,
            display: "flex",
            justifyContent: "center",
            gap: 60,
            position: "relative",
          }}
        >
          {/* Floating TOC — left side, desktop only */}
          <FloatingToc toc={toc} />

          {/* Article content */}
          <div style={{ maxWidth: READING_W, width: "100%", minWidth: 0 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              <MarkdownRenderer content={post.content} />
            </motion.div>

            {/* ── AUTHOR BIO CARD ── */}
            {post.authors && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                style={{
                  marginTop: 56,
                  padding: 28,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  gap: 20,
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 48,
                    height: 48,
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
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#E8651A",
                      }}
                    >
                      {authorInitials(post.authors.name)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#FFFFFF",
                      }}
                    >
                      {post.authors.name}
                    </span>
                    {post.authors.linkedin_url && (
                      <a
                        href={post.authors.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="author-linkedin-icon"
                        style={{
                          color: "#707070",
                          transition: "color 0.2s",
                          display: "inline-flex",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  {(post.authors.title || post.authors.organization) && (
                    <p
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 13,
                        fontWeight: 300,
                        color: "#A0A0A0",
                        margin: "2px 0 0",
                      }}
                    >
                      {[post.authors.title, post.authors.organization]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  {post.authors.bio && (
                    <p
                      className="author-bio-clamp"
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 13,
                        fontWeight: 300,
                        color: "#707070",
                        lineHeight: 1.6,
                        margin: "8px 0 0",
                      }}
                    >
                      {post.authors.bio}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── EVENT CTA CARD ── */}
            {post.event_tag && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                style={{
                  marginTop: 28,
                  padding: 32,
                  borderRadius: 16,
                  background: "#111111",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    color: "#707070",
                  }}
                >
                  From This Event
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#FFFFFF",
                    margin: "12px 0 16px",
                  }}
                >
                  {post.event_tag}
                </p>
                <Link
                  href="/events"
                  className="event-cta-link"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#E8651A",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  Explore upcoming events →
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section
          style={{
            background: "#0A0A0A",
            padding: "clamp(48px, 6vw, 72px) 0",
          }}
        >
          <div
            ref={relatedRef}
            style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={relatedInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <SectionLabel text="Keep Reading" />
            </motion.div>

            <div
              className="related-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(16px, 2vw, 24px)",
                marginTop: 24,
              }}
            >
              {related.map((r, i) => (
                <RelatedCard key={r.id} post={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER CTA ── */}
      <section
        style={{
          background: "#111111",
          position: "relative",
          overflow: "hidden",
          padding: "clamp(48px, 6vw, 72px) 0",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,101,26,0.04) 0%, transparent 60%)",
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
              className="article-subscribe-btn"
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
        .share-btn:hover {
          border-color: rgba(232, 101, 26, 0.3) !important;
          color: #e8651a !important;
          background: rgba(232, 101, 26, 0.05) !important;
        }
        .article-back-link:hover {
          color: #e8651a !important;
        }
        .article-link:hover {
          color: #ff7a2e !important;
          text-decoration: underline !important;
        }
        .event-cta-link:hover {
          color: #ff7a2e !important;
        }
        .author-linkedin-icon:hover {
          color: #e8651a !important;
        }
        .article-subscribe-btn:hover {
          background: #ff7a2e !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(232, 101, 26, 0.25);
        }

        .author-bio-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .related-title-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .article-list li::marker {
          color: #e8651a;
        }

        /* TOC: hide below 1280px */
        @media (max-width: 1280px) {
          .article-toc {
            display: none !important;
          }
          .article-body-wrapper {
            justify-content: center !important;
          }
        }

        /* Cover image: 16/9 on mobile */
        @media (max-width: 768px) {
          .article-cover {
            aspect-ratio: 16/9 !important;
          }
          .related-grid {
            grid-template-columns: 1fr !important;
          }
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
      `}</style>
    </div>
  );
}
