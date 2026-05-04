"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  navLinks: { href: string; label: string }[];
}> = {
  "/events/data-ai-first/kuwait-2026": {
    name: "Digital First Kuwait 2026",
    shortName: "Digital First",
    color: "#0F735E",
    colorBright: "#14A882",
    date: "10 June 2026",
    location: "Kuwait City",
    logo: "/logos/data-ai-first-kuwait-logo.png",
    logoFilter: "invert(1) brightness(1)",
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#speakers", label: "Speakers" },
      { href: "#sponsors", label: "Sponsors" },
      { href: "#agenda", label: "Agenda" },
      { href: "#venue", label: "Venue" },
    ],
  },
  "/events/cyber-first/kuwait-2026": {
    name: "Cyber First Kuwait 2026",
    shortName: "Cyber First",
    color: "#01BBF5",
    colorBright: "#4DD4FF",
    date: "9 June 2026",
    location: "Kuwait City",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/cyber-first-kuwait-white.svg",
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#speakers", label: "Speakers" },
      { href: "#sponsors", label: "Sponsors" },
      { href: "#agenda", label: "Agenda" },
      { href: "#venue", label: "Venue" },
    ],
  },
  "/events/cyber-first/india-2026": {
    name: "Cyber First India 2026",
    shortName: "Cyber First India",
    color: "#09B7AA",
    colorBright: "#3DD4C8",
    date: "10 October 2026",
    location: "New Delhi",
    logo: "/Asset-5.svg",
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
      { href: "#sponsors", label: "Sponsors" },
      { href: "#agenda", label: "Agenda" },
      { href: "#venue", label: "Venue" },
    ],
  },
  "/events/cyber-first/qatar-2026": {
    name: "Cyber First Qatar 2026",
    shortName: "Cyber First Qatar",
    color: "#01BBF5",
    colorBright: "#4DD4FF",
    date: "22 Sep 2026",
    location: "Doha, Qatar",
    navLinks: [{ href: "#register-interest", label: "Register Interest" }],
  },
  "/events/cyber-first/oman-2026": {
    name: "Cyber First Oman 2026",
    shortName: "Cyber First Oman",
    color: "#01BBF5",
    colorBright: "#4DD4FF",
    date: "13 Oct 2026",
    location: "Muscat, Oman",
    navLinks: [{ href: "#register-interest", label: "Register Interest" }],
  },
  "/events/cyber-first/ksa-2026": {
    name: "Digital Resilience KSA 2026",
    shortName: "Digital Resilience KSA",
    color: "#01BBF5",
    colorBright: "#4DD4FF",
    date: "10 Oct 2026",
    location: "Riyadh, KSA",
    navLinks: [{ href: "#register-interest", label: "Register Interest" }],
  },
  "/events/ot-security-first/johannesburg-2026": {
    name: "OT Security First Africa 2026",
    shortName: "OT Security First Africa",
    color: "#D34B9A",
    colorBright: "#E86BB8",
    date: "26 Aug 2026",
    location: "Johannesburg, SA",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Untitled-2-01.png",
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#speakers", label: "Speakers" },
      { href: "#themes", label: "Themes" },
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
  "/events/ot-security-first/jubail-2026": {
    name: "OT Security Jubail 2026",
    shortName: "OT Security Jubail",
    color: "#D34B9A",
    colorBright: "#E872B5",
    date: "07 Oct 2026",
    location: "Jubail, KSA",
    navLinks: [{ href: "#register-interest", label: "Register Interest" }],
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
  "/events/data-ai-first/qatar-2026": {
    name: "Digital First Qatar 2026",
    shortName: "Digital First Qatar",
    color: "#0F735E",
    colorBright: "#14A882",
    date: "23 Sep 2026",
    location: "Doha, Qatar",
    navLinks: [{ href: "#register-interest", label: "Register Interest" }],
  },
  "/events/opex-first/saudi-2026": {
    name: "OPEX First Saudi 2026",
    shortName: "OPEX First Saudi",
    color: "#7C3AED",
    colorBright: "#9F6AFF",
    date: "15 Sep 2026",
    location: "Riyadh, KSA",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/OPEX+FIRST+logo-1.png",
    navLinks: [
      { href: "#overview", label: "Overview" },
      { href: "#themes", label: "Themes" },
      // { href: "#speakers", label: "Speakers" }, // hidden until photos confirmed
      { href: "#agenda", label: "Agenda" },
      { href: "#sponsors", label: "Sponsors" },
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

  const { name, shortName, color, colorBright, date, location, logo, logoFilter, navLinks } = config;

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
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3"
            style={{ cursor: "pointer" }}
          >
            {logo ? (
              <span className="event-nav-logo-wrap" style={{ position: "relative", display: "inline-block", overflow: "hidden", ["--event-color-shimmer" as string]: `${colorBright}25` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={name}
                  className="event-nav-logo"
                  style={{
                    height: 70,
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
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  const id = link.href.replace("#", "");
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colorBright)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                {link.label}
              </a>
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
                document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
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
            <div className="flex flex-col items-center justify-center h-full gap-8 -mt-24">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      const id = link.href.replace("#", "");
                      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
                    }}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 600,
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    {link.label}
                  </a>
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
                    setTimeout(() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }), 300);
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
            height: 60px !important;
          }
        }
        @media (max-width: 480px) {
          .event-nav-logo {
            height: 50px !important;
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
