"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { allEvents } from "@/components/sections/AnnualTimeline";

type NavLinkItem = {
  href: string;
  label: string;
  dropdown?: "events" | "networkfirst" | "region";
};

const navLinks: NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events", dropdown: "events" },
  { href: "/network-first", label: "NetworkFirst", dropdown: "networkfirst" },
  { href: "/events", label: "Region", dropdown: "region" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

const eventSeries = [
  {
    href: "/events/cyber-first",
    label: "Cyber First",
    color: "#01BBF5",
    editions: [
      { href: "/events/cyber-first/kenya-2026", label: "Nairobi" },
      { href: "/events/cyber-first/kuwait-2026", label: "Kuwait" },
      { href: "/events/cyber-first/qatar", label: "Qatar" },
      { href: "/events/cyber-first", label: "UAE" },
    ]
  },
  {
    href: "/events/ot-security-first",
    label: "OT Security First",
    color: "#D34B9A",
    editions: [
      { href: "/events/ot-security-first/johannesburg-2026", label: "Johannesburg" },
      { href: "/events/ot-security-first/jubail", label: "Jubail, KSA" },
      { href: "/events/ot-security-first/qatar", label: "Qatar" },
      { href: "/events/ot-security-first", label: "UAE" },
      { href: "/events/ot-security-first/oman-2026", label: "Oman" },
    ]
  },
  {
    href: "/events/data-ai-first",
    label: "Digital First",
    color: "#0F735E",
    editions: [],
  },
  {
    href: "/events/opex-first",
    label: "Opex First",
    color: "#7C3AED",
    editions: [
      { href: "/events/opex-first/saudi-2026", label: "Saudi Arabia" },
    ]
  },
];

const NETWORKFIRST_COLOR = "#C9935A";

// NetworkFirst boardrooms — grouped by format (Virtual first, then In-Person),
// each group keeps the upcoming-events date order from /network-first
type NFFormat = "virtual" | "physical";
const networkFirstEvents: { href: string; label: string; date: string; format: NFFormat }[] = [
  { href: "/filigran", label: "Filigran", date: "14 Jul", format: "virtual" },
  { href: "/enterprisedb-ksa", label: "EnterpriseDB, KSA", date: "29 Sep", format: "physical" },
  { href: "/proofpoint", label: "Proofpoint", date: "Sep · TBC", format: "physical" },
  { href: "https://events.outsystems.com/event/17e2fb07-2b9a-46e2-9acf-44590276e2d8/homepage?RefId=oed-ksa", label: "OutSystems", date: "19 Oct", format: "physical" },
  { href: "/blueyonder", label: "Blue Yonder", date: "TBA", format: "physical" },
  { href: "https://www.jedox.com/en/events/unlock-the-power-of-modern-fpa-2026/", label: "Jedox | PlanPulse", date: "TBA", format: "physical" },
];

// Render order for the grouped dropdown — Virtual section first
const NF_GROUPS: { format: NFFormat; label: string }[] = [
  { format: "virtual", label: "Virtual" },
  { format: "physical", label: "In-Person" },
];

// ── Region browsing — derived from the canonical allEvents calendar ──
// Country-based regions only (Virtual + region-wide "MENA" events excluded),
// upcoming events only. Stays in sync automatically as the calendar changes.
function regionOf(location: string): string | null {
  const l = location.toLowerCase();
  if (l.includes("riyadh") || l.includes("jubail") || l.includes("jeddah") || l.includes("dammam") || l.includes("saudi")) return "Saudi Arabia";
  if (l.includes("dubai") || l.includes("abu dhabi") || l.includes("uae")) return "UAE";
  if (l.includes("kuwait")) return "Kuwait";
  if (l.includes("doha") || l.includes("qatar")) return "Qatar";
  if (l.includes("muscat") || l.includes("oman")) return "Oman";
  if (l.includes("nairobi") || l.includes("kenya")) return "Kenya";
  if (l.includes("johannesburg") || l.includes("south africa")) return "South Africa";
  return null; // Virtual, "MENA Region", or anything uncategorized
}

const REGION_ORDER = ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Kenya", "South Africa"];

const _regionStartOfToday = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); })();

const regionShortDate = (e: { date: Date; dateTBA?: boolean }): string =>
  e.dateTBA
    ? `TBC · ${e.date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}`
    : e.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });

const regionGroups = REGION_ORDER.map((region) => ({
  region,
  events: allEvents
    .filter((e) => regionOf(e.location) === region && e.date.getTime() >= _regionStartOfToday)
    .sort((a, b) => a.date.getTime() - b.date.getTime()),
})).filter((g) => g.events.length > 0);

const REGION_COLOR = "#01BBF5";

/**
 * Navigation
 *
 * The concierge of this experience. Always present, always composed.
 * Adapts between transparent (ghost) and scrolled (jacketed) states.
 */
export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"events" | "networkfirst" | "region" | null>(null);
  const [activeSeriesIndex, setActiveSeriesIndex] = useState<number | null>(null);
  const [activeRegionIndex, setActiveRegionIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[10000] transition-all duration-400"
        style={{
          background: isScrolled ? "rgba(10, 10, 10, 0.88)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled
            ? "1px solid rgba(255, 255, 255, 0.06)"
            : "1px solid transparent",
          padding: isScrolled ? "13px 0" : "22px 0",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="flex items-center justify-between mx-auto"
          style={{
            maxWidth: 1320,
            padding: "0 clamp(20px, 4vw, 60px)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/events-first-group_logo_alt.svg"
              alt="Events First Group"
              width={136}
              height={34}
              priority
              className="h-[34px] w-auto"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-[34px]">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.dropdown)}
                onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
              >
                <NavLink
                  href={link.href}
                  hasDropdown={!!link.dropdown}
                  isDropdownOpen={!!link.dropdown && openDropdown === link.dropdown}
                  isActive={link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)}
                >
                  {link.label}
                </NavLink>

                {/* Events Dropdown */}
                {link.dropdown === "events" && (
                  <AnimatePresence>
                    {openDropdown === "events" && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{
                          duration: 0.25,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{
                          top: "calc(100% + 14px)",
                          minWidth: 240,
                          background: "var(--black-card)",
                          border: "1px solid var(--gray-border-hover)",
                          borderRadius: 14,
                          padding: 10,
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {eventSeries.map((event, idx) => (
                          <div
                            key={event.href}
                            className="relative"
                            onMouseEnter={() => setActiveSeriesIndex(idx)}
                            onMouseLeave={() => setActiveSeriesIndex(null)}
                          >
                            <Link
                              href={event.href}
                              className="flex items-center justify-between gap-3 px-4 py-[11px] rounded-[9px] text-[14px] transition-colors duration-200"
                              style={{ color: activeSeriesIndex === idx ? "var(--white)" : "var(--white-dim)", background: activeSeriesIndex === idx ? "rgba(255, 255, 255, 0.04)" : "transparent" }}
                            >
                              <span className="flex items-center gap-3">
                                <span
                                  className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                                  style={{ background: event.color }}
                                />
                                {event.label}
                              </span>
                              {event.editions && event.editions.length > 0 && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              )}
                            </Link>
                            
                            {/* Editions Sub-dropdown */}
                            {event.editions && event.editions.length > 0 && (
                              <AnimatePresence>
                                {activeSeriesIndex === idx && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute left-full top-0 ml-2"
                                    style={{
                                      minWidth: 180,
                                      background: "var(--black-card)",
                                      border: "1px solid var(--gray-border-hover)",
                                      borderRadius: 12,
                                      padding: 8,
                                      backdropFilter: "blur(20px)",
                                      WebkitBackdropFilter: "blur(20px)",
                                      boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5)",
                                    }}
                                  >
                                    {event.editions.map((edition) => (
                                      <Link
                                        key={edition.href}
                                        href={edition.href}
                                        className="flex items-center gap-2 px-3 py-[9px] rounded-[7px] text-[13px] transition-colors duration-200"
                                        style={{ color: "var(--white-dim)" }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background = `${event.color}15`;
                                          e.currentTarget.style.color = "var(--white)";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background = "transparent";
                                          e.currentTarget.style.color = "var(--white-dim)";
                                        }}
                                      >
                                        <span className="w-[4px] h-[4px] rounded-full" style={{ background: event.color, opacity: 0.6 }} />
                                        {edition.label}
                                      </Link>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* NetworkFirst Dropdown */}
                {link.dropdown === "networkfirst" && (
                  <AnimatePresence>
                    {openDropdown === "networkfirst" && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 -translate-x-1/2"
                        data-lenis-prevent
                        style={{
                          top: "calc(100% + 14px)",
                          width: 278,
                          maxHeight: "min(70vh, 470px)",
                          overflowY: "auto",
                          background: "var(--black-card)",
                          border: "1px solid var(--gray-border-hover)",
                          borderRadius: 14,
                          padding: 10,
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {NF_GROUPS.map((group, gi) => {
                          const groupEvents = networkFirstEvents.filter((ev) => ev.format === group.format);
                          if (groupEvents.length === 0) return null;
                          return (
                            <div key={group.format} style={{ marginTop: gi === 0 ? 0 : 8 }}>
                              {/* Section header */}
                              <div
                                className="flex items-center gap-2 px-4 pt-[6px] pb-[7px]"
                                style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: NETWORKFIRST_COLOR }}
                              >
                                {group.label}
                                <span style={{ flex: 1, height: 1, background: "var(--gray-border-hover)", opacity: 0.5 }} />
                              </div>
                              {groupEvents.map((ev) => (
                                <Link
                                  key={ev.href + ev.date}
                                  href={ev.href}
                                  className="flex items-center justify-between gap-3 px-4 py-[10px] rounded-[9px] text-[13.5px] transition-colors duration-200"
                                  style={{ color: "var(--white-dim)" }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = `${NETWORKFIRST_COLOR}15`;
                                    e.currentTarget.style.color = "var(--white)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "var(--white-dim)";
                                  }}
                                >
                                  <span className="flex items-center gap-3">
                                    <span
                                      className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                                      style={{ background: NETWORKFIRST_COLOR }}
                                    />
                                    {ev.label}
                                  </span>
                                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
                                    {ev.date}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Region Dropdown */}
                {link.dropdown === "region" && (
                  <AnimatePresence>
                    {openDropdown === "region" && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{
                          top: "calc(100% + 14px)",
                          minWidth: 230,
                          background: "var(--black-card)",
                          border: "1px solid var(--gray-border-hover)",
                          borderRadius: 14,
                          padding: 10,
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {regionGroups.map((group, idx) => (
                          <div
                            key={group.region}
                            className="relative"
                            onMouseEnter={() => setActiveRegionIndex(idx)}
                            onMouseLeave={() => setActiveRegionIndex(null)}
                          >
                            <Link
                              href="/events"
                              className="flex items-center justify-between gap-3 px-4 py-[11px] rounded-[9px] text-[14px] transition-colors duration-200"
                              style={{ color: activeRegionIndex === idx ? "var(--white)" : "var(--white-dim)", background: activeRegionIndex === idx ? "rgba(255, 255, 255, 0.04)" : "transparent" }}
                            >
                              <span className="flex items-center gap-3">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={REGION_COLOR} strokeWidth="2" className="flex-shrink-0">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {group.region}
                              </span>
                              <span className="flex items-center gap-2">
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{group.events.length}</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </span>
                            </Link>

                            {/* Region events sub-dropdown */}
                            <AnimatePresence>
                              {activeRegionIndex === idx && (
                                <motion.div
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -8 }}
                                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                  className="absolute left-full top-0 ml-2"
                                  data-lenis-prevent
                                  style={{
                                    minWidth: 264,
                                    maxHeight: "min(60vh, 380px)",
                                    overflowY: "auto",
                                    background: "var(--black-card)",
                                    border: "1px solid var(--gray-border-hover)",
                                    borderRadius: 12,
                                    padding: 8,
                                    backdropFilter: "blur(20px)",
                                    WebkitBackdropFilter: "blur(20px)",
                                    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5)",
                                  }}
                                >
                                  {group.events.map((ev) => (
                                    <Link
                                      key={ev.id}
                                      href={ev.href}
                                      className="flex items-center justify-between gap-3 px-3 py-[9px] rounded-[7px] text-[13px] transition-colors duration-200"
                                      style={{ color: "var(--white-dim)" }}
                                      onMouseEnter={(e) => { e.currentTarget.style.background = `${ev.seriesColor}15`; e.currentTarget.style.color = "var(--white)"; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--white-dim)"; }}
                                    >
                                      <span className="flex items-center gap-2.5 min-w-0">
                                        <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: ev.seriesColor }} />
                                        <span className="truncate">{ev.title}</span>
                                      </span>
                                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>{regionShortDate(ev)}</span>
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <Link
            href="/events"
            className="hidden lg:block px-6 py-[10px] rounded-full text-[13.5px] font-semibold transition-all duration-300"
            style={{
              background: "var(--orange)",
              color: "white",
              fontFamily: "var(--font-outfit)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--orange-bright)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 8px 28px var(--orange-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--orange)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Browse 2026 Events
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            suppressHydrationWarning
            className="lg:hidden relative w-[22px] h-[22px] flex flex-col justify-center items-center gap-[5px]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              className="absolute w-[22px] h-[1.5px] bg-white"
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 0 : -6,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute w-[22px] h-[1.5px] bg-white"
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute w-[22px] h-[1.5px] bg-white"
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? 0 : 6,
              }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10001] flex flex-col items-center justify-center gap-3"
            style={{
              background: "rgba(10, 10, 10, 0.97)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              suppressHydrationWarning
              className="absolute top-[22px] right-[clamp(20px,4vw,60px)]"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              >
                <line x1="7" y1="7" x2="21" y2="21" />
                <line x1="21" y1="7" x2="7" y2="21" />
              </svg>
            </button>

            {/* Mobile Links */}
            {navLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={link.href}
                  className="block text-[28px] font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Mobile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: navLinks.length * 0.08,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-6"
            >
              <Link
                href="/events"
                className="px-8 py-3 rounded-full text-[15px] font-semibold"
                style={{
                  background: "var(--orange)",
                  color: "white",
                  fontFamily: "var(--font-outfit)",
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse 2026 Events
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * NavLink Component
 * Desktop navigation link with animated underline
 */
function NavLink({
  href,
  children,
  hasDropdown,
  isDropdownOpen,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  hasDropdown?: boolean;
  isDropdownOpen?: boolean;
  isActive?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const lit = isHovered || isActive;

  return (
    <Link
      href={href}
      className="relative text-[14px] transition-colors duration-300"
      style={{
        color: lit ? "var(--white)" : "var(--white-dim)",
        fontFamily: "var(--font-outfit)",
        fontWeight: isActive ? 600 : 400,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="flex items-center gap-1.5">
        {children}
        {hasDropdown && (
          <motion.span
            className="inline-block"
            animate={{ rotate: isDropdownOpen ? -135 : 45 }}
            transition={{ duration: 0.2 }}
            style={{
              width: 6,
              height: 6,
              borderRight: "1.5px solid currentColor",
              borderBottom: "1.5px solid currentColor",
              marginBottom: isDropdownOpen ? -2 : 2,
            }}
          />
        )}
      </span>

      {/* Underline, persistent on active, animated on hover */}
      <motion.span
        className="absolute left-0 bottom-[-4px] h-[1.5px]"
        style={{ background: "var(--orange)" }}
        initial={{ width: isActive ? "100%" : 0 }}
        animate={{ width: lit ? "100%" : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </Link>
  );
}
