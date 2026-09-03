"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Lenis (global smooth-scroll) hijacks the wheel, so native scrollIntoView /
// window.scrollTo get reset every frame. Drive Lenis directly when present.
type LenisLike = { scrollTo: (target: HTMLElement | number, opts?: { offset?: number }) => void };
function getLenis(): LenisLike | undefined {
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}
function smoothScrollToId(id: string, offset = -80) {
  if (!document.getElementById(id)) return;
  const lenis = getLenis();
  const doScroll = () => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  doScroll();
  // Sections that use `content-visibility: auto` don't report their real height
  // until they render, so the target's position is estimated on the first jump and
  // the scroll can land short (e.g. on the section above). Re-align a couple of
  // times once the layout settles — but bail the moment the user scrolls themselves.
  let cancelled = false;
  const cleanup = () => {
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchmove", cancel);
  };
  const cancel = () => { cancelled = true; cleanup(); };
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchmove", cancel, { passive: true });
  window.setTimeout(() => { if (!cancelled) doScroll(); }, 600);
  window.setTimeout(() => { if (!cancelled) doScroll(); cleanup(); }, 1250);
}
function smoothScrollToTop() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

// A nav entry is either a scroll link (has href) or a dropdown (has children).
// children may themselves nest one more level (Media Partners → publications).
type NavLink = { label: string; href?: string; children?: NavLink[] };

// Event configurations
const EVENT_CONFIGS: Record<string, {
  name: string;
  shortName: string;
  color: string;
  colorBright: string;
  date: string;
  location: string;
  logo?: string;
  logoFilter?: string;
  logoHeight?: number;
  navLinks: NavLink[];
}> = {
  "/events/cyber-first/kuwait-2026": {
    name: "Cyber First Kuwait 2026",
    shortName: "Cyber First",
    color: "#01BBF5",
    colorBright: "#4DD4FF",
    date: "14 October 2026",
    location: "Kuwait City",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/assets/Cyber_kuwait.png",
    logoHeight: 140,
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#speakers", label: "Speakers" },
      { href: "#sponsors", label: "Sponsors" },
      { href: "#agenda", label: "Agenda" },
      { href: "#venue", label: "Venue" },
    ],
  },
  "/events/cyber-first/kenya-2026": {
    name: "Cyber First East Africa 2026",
    shortName: "Cyber First East Africa",
    color: "#8B1A22",
    colorBright: "#B52230",
    date: "08 July 2026",
    location: "Nairobi, Kenya",
    logo: "/Cyber-First-East-Africa-Logo-01.png",
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#speakers", label: "Speakers" },
      { href: "#sponsors-2026", label: "Sponsors" },
      { href: "#agenda", label: "Agenda" },
      { href: "#venue", label: "Venue" },
    ],
  },
  "/events/cyber-first/qatar": {
    name: "Cyber First Qatar 2026",
    shortName: "Cyber First Qatar",
    color: "#01BBF5",
    colorBright: "#4DD4FF",
    date: "10 Nov 2026",
    location: "Doha, Qatar",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/assets/Cyber+Qatar-03.svg",
    logoHeight: 180,
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#about", label: "About" },
      { href: "#themes", label: "Themes" },
      { href: "#advisors", label: "Advisors" },
      { href: "#agenda", label: "Agenda" },
      { href: "#register", label: "Register" },
    ],
  },
  "/events/ot-security-first/johannesburg-2026": {
    name: "OT Security First Africa 2026",
    shortName: "OT Security First Africa",
    color: "#D34B9A",
    colorBright: "#E86BB8",
    date: "27 Aug 2026",
    location: "Johannesburg, SA",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Untitled-2-01.png",
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#speakers", label: "Speakers" },
      { href: "#agenda", label: "Agenda" },
      { href: "#event-sponsors", label: "Sponsors" },
      { href: "#awards", label: "Awards" },
      { href: "#venue", label: "Venue" },
    ],
  },
  "/events/ot-security-first/virtual-boardroom-mena": {
    name: "OT Security Virtual Forum MENA",
    shortName: "OT Security Forum",
    color: "#00C9FF",
    colorBright: "#4DD9FF",
    date: "19 May 2025",
    location: "Virtual · MENA",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Untitled-2-01.png",
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#themes", label: "Themes" },
      { href: "#speakers", label: "Speakers" },
      { href: "#panels", label: "Panels" },
      { href: "#attend", label: "Who Attends" },
      { href: "#register", label: "Register" },
    ],
  },
  "/events/ot-security-first/qatar": {
    name: "OT Security First Qatar 2026",
    shortName: "OT Security Qatar",
    color: "#D34B9A",
    colorBright: "#E86BB8",
    date: "TBA",
    location: "Doha, Qatar",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/assets/OT+Qatar-02.png",
    logoHeight: 80,
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#speakers", label: "Speakers" },
      { href: "#themes", label: "Themes" },
      { href: "#agenda", label: "Agenda" },
      { href: "#register", label: "Register" },
      { href: "#venue", label: "Venue" },
    ],
  },
  "/events/ot-security-first/jubail": {
    name: "OT Security Jubail 2026",
    shortName: "OT Security Jubail",
    color: "#D34B9A",
    colorBright: "#E872B5",
    date: "27 October 2026",
    location: "Jubail, KSA",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/OT+Security+First+Jubail+logo+Final-03.png",
    logoHeight: 80,
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#speakers", label: "Speakers" },
      { href: "#agenda", label: "Agenda" },
      {
        label: "Partners",
        children: [
          { href: "#supporting-partner", label: "Supporting Partner" },
          { href: "#sponsors", label: "Sponsors" },
          { href: "#media-partners", label: "Media Partners" },
        ],
      },
      { href: "#awards", label: "Awards" },
      { href: "#register", label: "Register" },
    ],
  },
  "/events/ot-security-first/oman-2026": {
    name: "OT Security Oman 2026",
    shortName: "OT Security Oman",
    color: "#D34B9A",
    colorBright: "#E872B5",
    date: "14 Oct 2026",
    location: "Muscat, Oman",
    navLinks: [{ href: "#register-interest", label: "Register Interest" }],
  },
  "/events/ot-security-first/uae": {
    name: "OT Security First UAE 2027",
    shortName: "OT Security UAE",
    color: "#D34B9A",
    colorBright: "#E872B5",
    date: "27 January 2027",
    location: "Abu Dhabi, UAE",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/efg_logo/OT+Security+UAE-01.png",
    logoHeight: 96,
    navLinks: [
      { href: "#event", label: "Overview" },
      { href: "#themes", label: "Themes" },
      { href: "#speakers", label: "Speakers" },
      { href: "#partner", label: "Partner" },
      { href: "#register", label: "Register" },
    ],
  },
  "/events/opex-first/saudi-2026": {
    name: "OPEX First Saudi 2026",
    shortName: "OPEX First Saudi",
    color: "#7C3AED",
    colorBright: "#9F6AFF",
    date: "21 Oct 2026",
    location: "Riyadh, KSA",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/assets/Opex+KSA+logo-02.png",
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#themes", label: "Themes" },
      // { href: "#speakers", label: "Speakers" }, // hidden until photos confirmed
      { href: "#agenda", label: "Agenda" },
      { href: "#event-sponsors", label: "Sponsors" },
      { href: "#awards", label: "Awards" },
      { href: "#register", label: "Register" },
    ],
  },
  "/events/opex-first/process-intelligence": {
    name: "Process Intelligence MENA",
    shortName: "PI MENA",
    color: "#7C3AED",
    colorBright: "#9F6AFF",
    date: "21 May 2026",
    location: "Virtual",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/OPEX+FIRST+logo-1.png",
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#themes", label: "Themes" },
      { href: "#speakers", label: "Speakers" },
      { href: "#agenda", label: "Agenda" },
      { href: "#attend", label: "Who Attends" },
      { href: "#register", label: "Register" },
    ],
  },
};

// ─── Desktop dropdown pieces ────────────────────────────────────────────────
const NAV_LINK_STYLE = {
  fontFamily: "var(--font-outfit)",
  fontSize: 14,
  fontWeight: 500,
  color: "rgba(255,255,255,0.7)",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  whiteSpace: "nowrap" as const,
} as const;

function Caret({ dir = "down" }: { dir?: "down" | "right" | "left" }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: dir === "right" ? "rotate(-90deg)" : dir === "left" ? "rotate(90deg)" : "none", opacity: 0.7, flex: "0 0 auto" }}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// A single row inside a dropdown panel. If it has children, it renders a
// side flyout on hover; otherwise it is a scroll link.
function DropdownRow({ item, color, colorBright }: { item: NavLink; color: string; colorBright: string }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  const rowBase: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    whiteSpace: "nowrap",
    fontFamily: "var(--font-outfit)",
    fontSize: 13.5,
    fontWeight: 500,
    color: "rgba(255,255,255,0.78)",
    padding: "9px 14px",
    borderRadius: 8,
    cursor: "pointer",
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left" as const,
    transition: "color 0.18s ease, background 0.18s ease",
  };

  if (!hasChildren) {
    return (
      <a
        href={item.href}
        onClick={(e) => { e.preventDefault(); smoothScrollToId((item.href || "").replace("#", "")); }}
        style={rowBase}
        onMouseEnter={(e) => { e.currentTarget.style.color = colorBright; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.78)"; e.currentTarget.style.background = "none"; }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div
        style={{ ...rowBase, color: open ? colorBright : "rgba(255,255,255,0.78)", background: open ? "rgba(255,255,255,0.05)" : "none" }}
      >
        {item.label}
        <Caret dir="right" />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.16 }}
            style={{ position: "absolute", top: -6, left: "100%", paddingLeft: 8 }}
          >
            <div
              style={{
                minWidth: 240,
                background: "rgba(12,12,14,0.97)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${color}2e`,
                borderRadius: 12,
                padding: 6,
                boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
              }}
            >
              {item.children!.map((c) => (
                <DropdownRow key={c.label} item={c} color={color} colorBright={colorBright} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// A top-level nav entry: leaf link or a dropdown trigger.
function DesktopNavItem({ item, color, colorBright }: { item: NavLink; color: string; colorBright: string }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  if (!hasChildren) {
    return (
      <a
        href={item.href}
        onClick={(e) => { e.preventDefault(); smoothScrollToId((item.href || "").replace("#", "")); }}
        className="transition-colors duration-200"
        style={NAV_LINK_STYLE}
        onMouseEnter={(e) => (e.currentTarget.style.color = colorBright)}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="transition-colors duration-200"
        style={{ ...NAV_LINK_STYLE, display: "inline-flex", alignItems: "center", gap: 6, color: open ? colorBright : "rgba(255,255,255,0.7)" }}
      >
        {item.label}
        <Caret />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            style={{ position: "absolute", top: "100%", left: 0, paddingTop: 12 }}
          >
            <div
              style={{
                minWidth: 200,
                background: "rgba(12,12,14,0.97)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${color}2e`,
                borderRadius: 12,
                padding: 6,
                boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
              }}
            >
              {item.children!.map((c) => (
                <DropdownRow key={c.label} item={c} color={color} colorBright={colorBright} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Flatten a nav tree into leaf scroll-links for the mobile menu, tagging depth
// so parents render as headings and children indent under them.
type MobileRow = { label: string; href?: string; depth: number; isHeading: boolean };
function flattenForMobile(items: NavLink[]): MobileRow[] {
  const out: MobileRow[] = [];
  const walk = (list: NavLink[], depth: number) => {
    for (const it of list) {
      const isHeading = !!it.children?.length;
      out.push({ label: it.label, href: it.href, depth, isHeading });
      if (it.children) walk(it.children, depth + 1);
    }
  };
  walk(items, 0);
  return out;
}

export default function EventNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const config = pathname ? EVENT_CONFIGS[pathname] : null;
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  if (!config) return null;

  const { name, shortName, color, colorBright, date, location, logo, logoFilter, logoHeight, navLinks } = config;
  const logoH = logoHeight ?? 70;
  const logoHTablet = Math.round(logoH * (60 / 70));
  const logoHMobile = Math.round(logoH * (50 / 70));

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[10000] transition-all duration-400"
        style={{
          background: isScrolled ? "rgba(10, 10, 10, 0.92)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled ? `1px solid ${color}20` : "1px solid transparent",
          padding: isScrolled ? "10px 0" : "14px 0",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="flex items-center justify-between mx-auto"
          style={{ maxWidth: 1320, padding: "0 clamp(20px, 4vw, 60px)" }}
        >
          {/* Event Logo / Name */}
          <a
            href={pathname || "/"}
            onClick={(e) => {
              e.preventDefault();
              smoothScrollToTop();
            }}
            className="flex items-center gap-3"
            style={{ cursor: "pointer" }}
          >
            {logo ? (
              <span
                className="event-nav-logo-wrap"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 70,
                  overflow: "visible",
                  ["--event-color-shimmer" as string]: `${colorBright}25`,
                  ["--event-nav-logo-h" as string]: `${logoH}px`,
                  ["--event-nav-logo-h-tablet" as string]: `${logoHTablet}px`,
                  ["--event-nav-logo-h-mobile" as string]: `${logoHMobile}px`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={name}
                  className="event-nav-logo"
                  style={{
                    height: "var(--event-nav-logo-h, 70px)",
                    width: "auto",
                    filter: logoFilter || "none",
                    display: "block",
                  }}
                />
                <span className="event-nav-logo-shimmer" />
              </span>
            ) : (
              <>
                {/* Event accent bar */}
                <span
                  style={{
                    width: 4,
                    height: 32,
                    borderRadius: 2,
                    background: `linear-gradient(180deg, ${colorBright} 0%, ${color} 100%)`,
                  }}
                />
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "white",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {shortName}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 500,
                      color: colorBright,
                      display: "block",
                      marginTop: -2,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {date} · {location}
                  </span>
                </div>
              </>
            )}
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <DesktopNavItem key={link.label} item={link} color={color} colorBright={colorBright} />
            ))}
          </div>

          {/* Right side: Back to EFG + Register */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/"
              className="transition-all duration-200 flex items-center gap-2"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 500,
                color: "#E8651A",
                opacity: 0.75,
                padding: "10px 20px",
                borderRadius: 50,
                border: "1px solid rgba(232,101,26,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#E8651A";
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(232,101,26,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)";
                e.currentTarget.style.opacity = "0.75";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span>←</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg" alt="EFG" style={{ width: 16, height: 16 }} />
              Events First Group
            </Link>
            <a
              href="#register"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId("register");
              }}
              className="transition-all duration-200"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                padding: "10px 24px",
                borderRadius: 50,
                background: color,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = colorBright)}
              onMouseLeave={(e) => (e.currentTarget.style.background = color)}
            >
              Register Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] mb-1.5"
              style={{ background: colorBright }}
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-[2px] mb-1.5"
              style={{ background: colorBright }}
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px]"
              style={{ background: colorBright }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] lg:hidden"
            style={{ background: "rgba(10, 10, 10, 0.98)", paddingTop: 120 }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-6 -mt-24">
              {flattenForMobile(navLinks).map((row, i) => (
                <motion.div
                  key={`${row.label}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {row.isHeading || !row.href ? (
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: row.depth === 0 ? 15 : 13,
                        fontWeight: 700,
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                        color: colorBright,
                      }}
                    >
                      {row.label}
                    </span>
                  ) : (
                    <a
                      href={row.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        const id = (row.href || "").replace("#", "");
                        setTimeout(() => smoothScrollToId(id), 300);
                      }}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: row.depth === 0 ? 28 : row.depth === 1 ? 20 : 16,
                        fontWeight: 600,
                        color: row.depth >= 2 ? "rgba(255,255,255,0.72)" : "white",
                        cursor: "pointer",
                      }}
                    >
                      {row.label}
                    </a>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                className="mt-6"
              >
                <a
                  href="#register"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    setTimeout(() => smoothScrollToId("register"), 300);
                  }}
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "white",
                    padding: "14px 36px",
                    borderRadius: 50,
                    background: color,
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                >
                  Register Now
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navLinks.length * 0.05 + 0.2 }}
                className="mt-4"
              >
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#E8651A",
                    opacity: 0.8,
                    padding: "10px 24px",
                    borderRadius: 50,
                    border: "1px solid rgba(232,101,26,0.25)",
                  }}
                >
                  <span>←</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg" alt="EFG" style={{ width: 16, height: 16 }} />
                  Events First Group
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        @keyframes nav-logo-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .event-nav-logo-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(110deg, transparent 30%, var(--event-color-shimmer) 50%, transparent 70%);
          animation: nav-logo-shimmer 4s ease-in-out infinite;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .event-nav-logo {
            height: var(--event-nav-logo-h-tablet, 60px) !important;
          }
        }
        @media (max-width: 480px) {
          .event-nav-logo {
            height: var(--event-nav-logo-h-mobile, 50px) !important;
          }
        }
      `}</style>
    </>
  );
}

// Helper to check if current path is an event page
export function isEventPage(pathname: string | null): boolean {
  if (!pathname) return false;
  return Object.keys(EVENT_CONFIGS).includes(pathname);
}
