"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Footer navigation data
const footerLinks = {
  events: [
    { label: "Cyber First", href: "/events/cyber-first" },
    { label: "OT Security First", href: "/events/ot-security-first" },
    { label: "Data & AI First", href: "/events/data-ai-first" },
    { label: "Opex First", href: "/events/opex-first" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/about#careers" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Insights & Blog", href: "/insights" },
    { label: "Sponsorship Deck", href: "/sponsors-and-partners" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

export default function Footer() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Detect when user scrolls to absolute bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.body.offsetHeight;
      const threshold = 100;

      if (scrollPosition >= documentHeight - threshold) {
        setIsAtBottom(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      style={{
        background: "var(--black)",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "52px 0 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            TOP AREA — 4-Column Grid
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
          }}
        >
          {/* Column 1 — Brand */}
          <div>
            {/* Logo */}
            <Image
              src="/events-first-group_logo_alt.svg"
              alt="Events First Group"
              width={140}
              height={36}
              style={{ height: 36, width: "auto" }}
            />

            {/* Tagline */}
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 300,
                color: "#505050",
                lineHeight: 1.6,
                maxWidth: 280,
                marginTop: 18,
              }}
            >
              Architecting the world's most impactful technology events.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5" style={{ marginTop: 24 }}>
              <SocialIcon href="https://www.linkedin.com/company/events-first-group/" icon="linkedin" />
              <SocialIcon href="https://twitter.com" icon="twitter" />
              <SocialIcon href="https://youtube.com" icon="youtube" />
              <SocialIcon href="https://instagram.com" icon="instagram" />
            </div>
          </div>

          {/* Column 2 — Events */}
          <FooterColumn title="Events" links={footerLinks.events} />

          {/* Column 3 — Company */}
          <FooterColumn title="Company" links={footerLinks.company} />

          {/* Column 4 — Resources */}
          <FooterColumn title="Resources" links={footerLinks.resources} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            BOTTOM BAR
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="footer-bottom"
          style={{
            marginTop: 60,
            borderTop: "1px solid rgba(255, 255, 255, 0.04)",
            paddingTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              color: "#353535",
              margin: 0,
            }}
          >
            © 2026 Events First Group. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            <FooterBottomLink href="/privacy" label="Privacy Policy" />
            <span style={{ color: "#353535", fontSize: 13 }}>·</span>
            <FooterBottomLink href="/terms" label="Terms of Use" />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            HIDDEN SIGN-OFF — Easter egg for completionists
            ═══════════════════════════════════════════════════════════════ */}
        <motion.p
          initial={{ opacity: 0.05 }}
          animate={{ opacity: isAtBottom ? 0.2 : 0.05 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 13.5,
            fontStyle: "italic",
            color: "rgba(255, 255, 255, 1)",
            textAlign: "center",
            marginTop: 52,
          }}
        >
          The next conversation starts here.
        </motion.p>
      </div>

      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 32px 20px !important;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1;
          }
          .footer-bottom {
            flex-direction: column !important;
            gap: 12px !important;
            text-align: center !important;
          }
        }
        @media (max-width: 400px) {
          .footer-grid {
            gap: 28px 14px !important;
          }
        }
      `}</style>
    </footer>
  );
}

/**
 * FooterColumn — Link column with header
 */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#353535",
          margin: 0,
          marginBottom: 20,
        }}
      >
        {title}
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="transition-colors duration-300 hover:text-white"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 400,
                color: "#606060",
                lineHeight: 2.4,
                display: "block",
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * FooterBottomLink — Privacy/Terms links
 */
function FooterBottomLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="transition-colors duration-300 hover:text-[#606060]"
      style={{
        fontFamily: "var(--font-outfit)",
        fontSize: 13,
        color: "#353535",
      }}
    >
      {label}
    </Link>
  );
}

/**
 * SocialIcon — Social media icon with hover effect
 */
function SocialIcon({ href, icon }: { href: string; icon: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors duration-300"
      style={{
        color: isHovered ? "#E8651A" : "#404040",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SocialIconSVG icon={icon} />
    </a>
  );
}

/**
 * SocialIconSVG — SVG icons for social platforms
 */
function SocialIconSVG({ icon }: { icon: string }) {
  const size = 17;

  switch (icon) {
    case "linkedin":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "twitter":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "youtube":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "instagram":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      );
    default:
      return null;
  }
}
