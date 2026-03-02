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
    name: "Data & AI First Kuwait 2026",
    shortName: "Data & AI First",
    color: "#0F735E",
    colorBright: "#14A882",
    date: "18 May 2026",
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
    date: "21 April 2026",
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
          <Link href={pathname || "/"} className="flex items-center gap-3">
            {logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={logo} 
                alt={name} 
                className="event-nav-logo"
                style={{ 
                  height: 80, 
                  width: "auto",
                  filter: logoFilter || "none",
                }} 
              />
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
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colorBright)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Back to EFG + Register */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/"
              className="transition-all duration-200"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
                padding: "8px 16px",
                borderRadius: 50,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.color = "rgba(255,255,255,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              }}
            >
              ← Events First Group
            </Link>
            <Link
              href="#register"
              className="transition-all duration-200"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                padding: "10px 24px",
                borderRadius: 50,
                background: color,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = colorBright)}
              onMouseLeave={(e) => (e.currentTarget.style.background = color)}
            >
              Register Now
            </Link>
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
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                className="mt-6"
              >
                <Link
                  href="#register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "white",
                    padding: "14px 36px",
                    borderRadius: 50,
                    background: color,
                    display: "inline-block",
                  }}
                >
                  Register Now
                </Link>
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
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  ← Back to Events First Group
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
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
