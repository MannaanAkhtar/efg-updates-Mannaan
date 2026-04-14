"use client";

import React, { useRef, useState, useEffect, memo } from "react";
import { useInView } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

// ─── The Big Leap Brand Tokens ──────────────────────────────────────────────
const TBL_OXFORD_BLACK = "#000D26"; // primary, 95%
const TBL_OXFORD_GRAY = "#1B263D"; // secondary dark
const TBL_RED = "#EF4444"; // accent, 5%
const TBL_CADET = "#50596A"; // body text
const TBL_SLATE = "#858B97"; // tertiary
const TBL_FRENCH = "#BABEC5"; // dividers
const TBL_SEASHELL = "#EFF0F2";
const TBL_SALT = "#F7F7F8";
const TBL_WHITE = "#FFFFFF";
const FONT = "var(--font-manrope)";
const CT_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/CleverTap_Logotype.png";
const RIYADH_IMG = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/finalll.png";
const TBL_OVERVIEW_BG = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Filters+for+BG_page-0001.jpg";
const TBL_SPONSOR_BG = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Filters+for+BG_page-0003.jpg";
const TBL_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/bigleapconnect.png";

// ─── Data ────────────────────────────────────────────────────────────────────
const PILLARS = [
  {
    num: "01",
    title: "Curated Panel",
    desc: "A thoughtfully assembled panel of industry leaders sharing strategic perspectives on the defining shifts in customer engagement, AI adoption, and sustainable growth.",
  },
  {
    num: "02",
    title: "Interactive Breakouts",
    desc: "Focused group discussions that encourage candid dialogue, shared problem-solving, and actionable thinking around scaling modern customer engagement.",
  },
  {
    num: "03",
    title: "Actionable Takeaways",
    desc: "Proven frameworks and execution models to drive deeper personalization, stronger retention, and measurable customer lifetime value.",
  },
  {
    num: "04",
    title: "High-Trust Exchange",
    desc: "An invite-only setting designed for candid discussion, shared challenges, and meaningful professional connection.",
  },
];

const AGENDA = [
  { time: "4:30 PM", duration: "1 Hour", title: "Registrations", presenter: "On-site welcome" },
  { time: "5:30 PM", duration: "5 mins", title: "Welcome Note", presenter: "Event Host" },
  {
    time: "5:35 PM",
    duration: "10 mins",
    title: "Keynote — Elevating Customer Experience Through Personalized and Intelligent Engagement",
    presenter: "CleverTap",
    highlight: true,
  },
  {
    time: "5:45 PM",
    duration: "20–30 mins",
    title: "Panel Discussion / Fireside Chat — Beyond the Hype: Redefining Growth with AI",
    presenter: "Industry Leaders",
    highlight: true,
  },
  { time: "6:10 PM", duration: "15 mins", title: "Audience Q&A", presenter: "Moderator + Panelists" },
  { time: "6:25 PM", duration: "15 mins", title: "Closing Remarks", presenter: "Event Host" },
];

// ─── COUNTDOWN ──────────────────────────────────────────────────────────────
const CountdownDisplay = memo(function CountdownDisplay({ target }: { target: string }) {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, t - Date.now());
      setCd({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff % 864e5) / 36e5),
        m: Math.floor((diff % 36e5) / 6e4),
        s: Math.floor((diff % 6e4) / 1e3),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div style={{ display: "flex", gap: "clamp(10px, 1.4vmin, 18px)", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline" }}>
      {[
        { v: cd.d, l: "Days" },
        { v: cd.h, l: "Hrs" },
        { v: cd.m, l: "Min" },
        { v: cd.s, l: "Sec" },
      ].map((item, i, arr) => (
        <React.Fragment key={item.l}>
          <div
            className="tbl-cd-tile"
            style={{
              textAlign: "center",
              minWidth: "clamp(54px, 6vmin, 76px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: "clamp(28px, min(3vw, 4.2vh), 44px)",
                fontWeight: 800,
                color: TBL_WHITE,
                display: "block",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.55)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
              }}
            >
              {String(item.v).padStart(2, "0")}
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontSize: "clamp(9px, 0.95vmin, 11px)",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
              }}
            >
              {item.l}
            </span>
          </div>
          {i < arr.length - 1 && (
            <span
              style={{
                fontFamily: FONT,
                fontSize: "clamp(22px, min(2.4vw, 3.4vh), 36px)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.20)",
                lineHeight: 1,
                marginTop: "-0.45em",
              }}
            >
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

// ─── HERO ────────────────────────────────────────────────────────────────────
function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const kicker = heroRef.current.querySelector(".tbl-kicker");
    const lines = heroRef.current.querySelectorAll(".tbl-title-line");
    const stagger = heroRef.current.querySelectorAll(".tbl-stagger");

    if (kicker) tl.fromTo(kicker, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.2);
    tl.fromTo(lines, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1.1, stagger: 0.14 }, 0.4);
    tl.fromTo(stagger, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 1.0);
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100dvh",
        background: TBL_OXFORD_BLACK,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero image — fit to screen */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${RIYADH_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* Soft top fade — keeps the navbar area legible */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: "linear-gradient(180deg, rgba(0,13,38,0.78) 0%, rgba(0,13,38,0.30) 60%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Soft bottom fade — Apple-style cinematic anchor for the content */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "62%",
          background: "linear-gradient(180deg, transparent 0%, rgba(0,13,38,0.35) 35%, rgba(0,13,38,0.78) 70%, rgba(0,13,38,0.95) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Center radial spotlight — subtle glow behind the title */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 65% 50% at 50% 60%, rgba(0,13,38,0.65) 0%, rgba(0,13,38,0.25) 40%, transparent 70%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Subtle red haze under the AI word area for cinematic warmth */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(280px, 40vmin, 560px)",
          height: "clamp(280px, 40vmin, 560px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.04) 35%, transparent 65%)",
          zIndex: 2,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      {/* ═══ CONTENT — Apple-keynote centered, larger & cleaner ═══ */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "clamp(80px, 9vh, 120px) clamp(20px, 4vw, 80px) clamp(30px, 4vh, 60px)",
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          gap: "clamp(10px, 1.5vh, 20px)",
        }}
      >
        {/* Kicker — editorial eyebrow with hairline rules + red dot */}
        <div
          className="tbl-kicker"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "clamp(12px, 1.6vmin, 20px)",
            opacity: 0,
          }}
        >
          <div
            style={{
              width: "clamp(28px, 3.5vmin, 48px)",
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45))",
            }}
          />
          <div
            className="tbl-pulse-dot"
            style={{
              position: "relative",
              width: "clamp(7px, 0.8vmin, 9px)",
              height: "clamp(7px, 0.8vmin, 9px)",
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, #ff8a8a 0%, ${TBL_RED} 50%, #b91c1c 100%)`,
              boxShadow: `0 0 16px ${TBL_RED}, 0 0 5px ${TBL_RED}`,
            }}
          />
          <span
            style={{
              fontFamily: FONT,
              fontSize: "clamp(11px, min(1.15vw, 1.6vh), 13.5px)",
              fontWeight: 700,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            Big Leap Connect &middot; Riyadh
          </span>
          <div
            className="tbl-pulse-dot"
            style={{
              position: "relative",
              width: "clamp(7px, 0.8vmin, 9px)",
              height: "clamp(7px, 0.8vmin, 9px)",
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, #ff8a8a 0%, ${TBL_RED} 50%, #b91c1c 100%)`,
              boxShadow: `0 0 16px ${TBL_RED}, 0 0 5px ${TBL_RED}`,
            }}
          />
          <div
            style={{
              width: "clamp(28px, 3.5vmin, 48px)",
              height: 1,
              background: "linear-gradient(90deg, rgba(255,255,255,0.45), transparent)",
            }}
          />
        </div>

        {/* Big Leap Logo — large, centered hero element */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="tbl-title-line"
          src={TBL_LOGO}
          alt="The Big Leap"
          style={{
            height: "clamp(240px, min(42vw, 45vh), 600px)",
            width: "auto",
            opacity: 0,
            filter: "drop-shadow(0 8px 48px rgba(0,0,0,0.5))",
          }}
        />

        {/* Tagline */}
        <p
          className="tbl-stagger"
          style={{
            fontFamily: FONT,
            fontSize: "clamp(15px, min(1.5vw, 2.1vh), 21px)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.82)",
            marginTop: "clamp(-30px, -4vh, -50px)",
            lineHeight: 1.6,
            margin: "0 auto",
            maxWidth: "min(720px, 92vw)",
            opacity: 0,
            textShadow: "0 2px 18px rgba(0,0,0,0.55)",
          }}
        >
          An invite-only evening for Riyadh&apos;s senior growth, marketing, and digital leaders.
        </p>

        {/* Meta strip — soft glass pill with hairline dividers */}
        <div
          className="tbl-stagger"
          style={{
            display: "inline-flex",
            padding: "1px",
            borderRadius: 999,
            background: "linear-gradient(135deg, rgba(255,255,255,0.30) 0%, rgba(239,68,68,0.20) 50%, rgba(255,255,255,0.18) 100%)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.50), 0 4px 14px rgba(239,68,68,0.10)",
            opacity: 0,
            maxWidth: "100%",
          }}
        >
          <div
            className="tbl-meta-strip"
            style={{
              display: "inline-flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "clamp(16px, 2vmin, 28px)",
              padding: "clamp(11px, 1.3vmin, 16px) clamp(22px, 2.6vmin, 36px)",
              borderRadius: 999,
              background: "rgba(0,13,38,0.55)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.30)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top reflection arc */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                pointerEvents: "none",
              }}
            />
            {[
              { label: "May 5, 2026" },
              { label: "4:30 PM" },
              { label: "Riyadh, KSA" },
            ].map((item, i, arr) => (
              <React.Fragment key={item.label}>
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(12px, min(1.2vw, 1.7vh), 15px)",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.92)",
                    letterSpacing: "-0.005em",
                    whiteSpace: "nowrap",
                    textShadow: "0 1px 3px rgba(0,0,0,0.45)",
                    position: "relative",
                  }}
                >
                  {item.label}
                </span>
                {i < arr.length - 1 && (
                  <span
                    className="tbl-meta-divider"
                    style={{
                      display: "inline-block",
                      width: 1,
                      height: "clamp(14px, 1.6vmin, 20px)",
                      background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.30), transparent)",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Countdown — clean inline tiles, no "Starts In" pill, no gradient borders */}
        <div
          className="tbl-stagger"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(8px, 1.1vmin, 14px)",
            opacity: 0,
            flexWrap: "wrap",
          }}
        >
          <CountdownDisplay target="2026-05-05T16:30:00+03:00" />
        </div>

        {/* CTAs — centered pair */}
        <div
          className="tbl-stagger"
          style={{
            display: "flex",
            gap: "clamp(10px, 1.2vmin, 14px)",
            flexWrap: "wrap",
            justifyContent: "center",
            opacity: 0,
          }}
        >
          <a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="tbl-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(8px, 0.9vmin, 12px)",
              padding: "clamp(14px, 1.7vmin, 18px) clamp(28px, 3.4vmin, 42px)",
              borderRadius: 50,
              background: `linear-gradient(135deg, ${TBL_RED} 0%, #dc2626 100%)`,
              color: TBL_WHITE,
              fontFamily: FONT,
              fontSize: "clamp(13.5px, min(1.3vw, 1.85vh), 16px)",
              fontWeight: 700,
              letterSpacing: "0.3px",
              textDecoration: "none",
              boxShadow: "0 16px 44px rgba(239,68,68,0.50), 0 2px 8px rgba(239,68,68,0.30), inset 0 1px 0 rgba(255,255,255,0.28)",
              transition: "all 0.4s cubic-bezier(0.165,0.84,0.44,1)",
            }}
          >
            Request Your Invitation <span>&rarr;</span>
          </a>
          <a
            href="#agenda"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="tbl-btn-ghost"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(8px, 0.9vmin, 12px)",
              padding: "clamp(14px, 1.7vmin, 18px) clamp(28px, 3.4vmin, 42px)",
              borderRadius: 50,
              background: "rgba(255,255,255,0.05)",
              color: TBL_WHITE,
              fontFamily: FONT,
              fontSize: "clamp(13.5px, min(1.3vw, 1.85vh), 16px)",
              fontWeight: 600,
              letterSpacing: "0.3px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              transition: "all 0.4s cubic-bezier(0.165,0.84,0.44,1)",
            }}
          >
            View Agenda
          </a>
        </div>

        {/* Presented-by lockup — bottom anchored */}
        <div
          className="tbl-stagger"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(10px, 1.4vmin, 16px)",
            opacity: 0,
          }}
        >
          <div style={{ width: "clamp(22px, 3vmin, 36px)", height: 1, background: "rgba(255,255,255,0.18)" }} />
          <span
            style={{
              fontFamily: FONT,
              fontSize: "clamp(11px, 1.2vmin, 14px)",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Presented by
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CT_LOGO}
            alt="CleverTap"
            loading="eager"
            style={{
              height: "clamp(24px, 3vmin, 36px)",
              width: "auto",
              filter: "brightness(0) invert(1)",
              opacity: 0.92,
            }}
          />
          <div style={{ width: "clamp(22px, 3vmin, 36px)", height: 1, background: "rgba(255,255,255,0.18)" }} />
        </div>
      </div>


      <style>{`
        .tbl-btn-primary { position: relative; overflow: hidden; }
        .tbl-btn-primary::before {
          content: ''; position: absolute; top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
          transform: skewX(-18deg);
          transition: left 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .tbl-btn-primary:hover::before { left: 130%; }
        .tbl-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 50px rgba(239,68,68,0.60), 0 2px 8px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.32) !important; }
        .tbl-btn-ghost:hover { border-color: rgba(255,255,255,0.42) !important; background: rgba(255,255,255,0.10) !important; transform: translateY(-2px); }

        .tbl-pulse-dot::before {
          content: ''; position: absolute; inset: -4px;
          border-radius: 50%; background: ${TBL_RED};
          opacity: 0.5;
          animation: tblPulse 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes tblPulse {
          0% { transform: scale(0.6); opacity: 0.55; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        .tbl-meta-cell { transition: transform 0.3s ease, color 0.3s ease; }
        .tbl-meta-cell:hover { transform: translateY(-1px); }
        .tbl-meta-cell:hover svg { opacity: 1 !important; }

        .tbl-scroll-line {
          position: absolute; top: -100%; left: 0; right: 0; height: 50%;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.95));
          animation: tblScrollDrop 2.2s cubic-bezier(0.6, 0, 0.4, 1) infinite;
        }
        @keyframes tblScrollDrop {
          0% { top: -100%; }
          70% { top: 100%; }
          100% { top: 100%; }
        }

        .tbl-ai-word {
          position: relative;
          display: inline-block;
        }

        @media (max-width: 900px) {
          .tbl-meta-bar { flex-wrap: wrap; border-radius: 22px !important; padding: 10px 6px !important; }
          .tbl-meta-cell { padding: 6px 14px !important; }
          .tbl-meta-divider { display: none !important; }
        }
        @media (max-height: 700px) {
          .tbl-scroll-cue { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── OVERVIEW — Big Ideas, Bold Conversations ────────────────────────────────
function OverviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Apple-style GSAP entrance timeline + 3D flip
  useGSAP(() => {
    if (!inView || !cardRef.current) return;
    const root = cardRef.current;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const kicker = root.querySelector(".tbl-ov-kicker");
    const headingWords = root.querySelectorAll(".tbl-ov-word");
    const underline = root.querySelector(".tbl-ov-underline");
    const flipper = root.querySelector(".tbl-ov-flipper");
    const cardWrap = root.querySelector(".tbl-ov-card");
    const logo = root.querySelector(".tbl-ov-logo");
    const quote = root.querySelector(".tbl-ov-quote");
    const paras = root.querySelectorAll(".tbl-ov-para");
    const sep = root.querySelector(".tbl-ov-sep");
    const brackets = root.querySelectorAll(".tbl-ov-bracket");

    // 0.0s — Header animations
    if (kicker) tl.fromTo(kicker, { y: 22, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9 }, 0);
    if (headingWords.length) tl.fromTo(headingWords, { y: 28, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.85, stagger: 0.06 }, 0.15);
    if (underline) tl.fromTo(underline, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: "power4.out" }, 0.55);

    // 0.4s — Card slides up showing the FRONT (logo)
    if (cardWrap) tl.fromTo(cardWrap, { y: 50, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: "power3.out" }, 0.4);
    if (logo) tl.fromTo(logo, { opacity: 0, scale: 0.85, filter: "blur(8px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, 0.7);

    // 1.8s — Hold the logo briefly, then 3D flip to content
    if (flipper) tl.to(flipper, { rotateY: 0, duration: 1.2, ease: "power3.inOut" }, 1.8);

    // 2.4s — Back content fades in DURING the second half of the flip
    if (brackets.length) tl.fromTo(brackets, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(1.6)" }, 2.4);
    if (quote) tl.fromTo(quote, { opacity: 0, scale: 0.7, x: -10 }, { opacity: 0.18, scale: 1, x: 0, duration: 0.9, ease: "power2.out" }, 2.4);
    if (paras.length) tl.fromTo(paras, { y: 18, opacity: 0, clipPath: "inset(0 0 100% 0)" }, { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.9, stagger: 0.16, ease: "power3.out" }, 2.5);
    if (sep) tl.fromTo(sep, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out", transformOrigin: "left" }, 2.7);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      id="overview"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(48px, 6vw, 80px) 0",
        background: "transparent",
      }}
    >
      {/* Background lives on the shared TBL dark wrapper in the page composition */}

      <div
        ref={cardRef}
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Centered header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(36px, 5vh, 56px)" }}>
          {/* Premium gradient-border kicker pill */}
          <div
            className="tbl-ov-kicker"
            style={{
              display: "inline-flex",
              padding: "1.2px",
              borderRadius: 999,
              background: "linear-gradient(140deg, rgba(255,255,255,0.45) 0%, rgba(239,68,68,0.35) 28%, rgba(255,255,255,0.10) 55%, rgba(255,255,255,0.32) 100%)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.55), 0 6px 20px rgba(239,68,68,0.18)",
              marginBottom: "clamp(20px, 2.6vh, 28px)",
              opacity: 0,
            }}
          >
            <div
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 22px 8px 14px",
                borderRadius: 999,
                background: "linear-gradient(180deg, rgba(0,13,38,0.78) 0%, rgba(0,13,38,0.62) 100%)",
                backdropFilter: "blur(24px) saturate(1.5)",
                WebkitBackdropFilter: "blur(24px) saturate(1.5)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.4), inset 0 0 22px rgba(239,68,68,0.08)",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.4), transparent)", pointerEvents: "none" }} />
              <div
                className="tbl-pulse-dot"
                style={{
                  position: "relative",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, #ff8a8a 0%, ${TBL_RED} 50%, #b91c1c 100%)`,
                  boxShadow: `0 0 14px ${TBL_RED}, 0 0 4px ${TBL_RED}, inset 0 0 2px rgba(255,255,255,0.5)`,
                }}
              />
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.96)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                  position: "relative",
                }}
              >
                About the Evening
              </span>
            </div>
          </div>

          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: "clamp(30px, 4.6vw, 56px)",
              lineHeight: 1.08,
              letterSpacing: "-0.038em",
              margin: "0 auto clamp(22px, 2.8vh, 30px)",
              maxWidth: 820,
            }}
          >
            {["Beyond", "the", "Hype.", "Redefining", "Growth", "with"].map((w, i) => (
              <span
                key={`w-${i}`}
                className="tbl-ov-word"
                style={{
                  display: "inline-block",
                  marginRight: "0.26em",
                  opacity: 0,
                  background: "linear-gradient(180deg, #ffffff 0%, #ffffff 60%, rgba(255,255,255,0.86) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 6px 40px rgba(0,0,0,0.55)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                }}
              >
                {w}
              </span>
            ))}
            {["AI."].map((w, i) => (
              <span
                key={`r-${i}`}
                className="tbl-ov-word"
                style={{
                  display: "inline-block",
                  marginRight: "0.26em",
                  opacity: 0,
                  background: `linear-gradient(160deg, #ffb4b4 0%, ${TBL_RED} 50%, #b91c1c 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {w}
              </span>
            ))}
          </h2>

          {/* Gradient underline */}
          <div
            className="tbl-ov-underline"
            style={{
              display: "inline-block",
              width: 80,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${TBL_RED}, transparent)`,
              boxShadow: `0 0 12px ${TBL_RED}80`,
              transformOrigin: "center",
              transform: "scaleX(0)",
            }}
          />
        </div>

        {/* ═══ Body card — Skeuomorphism × Glassmorphism with 3D FLIP ═══ */}
        {/* 3D Scene wrapper — perspective parent */}
        <div
          className="tbl-ov-card"
          style={{
            position: "relative",
            borderRadius: 32,
            opacity: 0,
            perspective: "1800px",
            perspectiveOrigin: "center",
          }}
        >
          {/* Flipper — starts at 180deg showing the front face (logo) */}
          <div
            className="tbl-ov-flipper"
            style={{
              position: "relative",
              transformStyle: "preserve-3d",
              transform: "rotateY(180deg)",
              borderRadius: 32,
              boxShadow: `
                0 60px 120px -20px rgba(0,0,0,0.75),
                0 40px 80px -20px rgba(239,68,68,0.18),
                0 20px 40px -10px rgba(0,0,0,0.55),
                0 8px 16px -4px rgba(0,0,0,0.45)
              `,
            }}
          >
          {/* ── BACK FACE — main content (defines height, in normal flow) ── */}
          <div
            style={{
              position: "relative",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
          {/* Outer metallic gradient ring (skeuo border) */}
          <div
            style={{
              padding: "2.5px",
              borderRadius: 32,
              background: `
                linear-gradient(140deg,
                  rgba(255,255,255,0.55) 0%,
                  rgba(239,68,68,0.45) 22%,
                  rgba(255,255,255,0.08) 42%,
                  rgba(0,0,0,0.5) 58%,
                  rgba(255,255,255,0.30) 78%,
                  rgba(239,68,68,0.35) 100%)
              `,
            }}
          >
            {/* Inner ring (creates the double-bevel) */}
            <div
              style={{
                padding: "1px",
                borderRadius: 30,
                background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.2))",
              }}
            >
          <div
            style={{
              position: "relative",
              borderRadius: 29,
              padding: "clamp(40px, 5.5vw, 72px)",
              background: `
                linear-gradient(180deg,
                  rgba(13,28,58,0.92) 0%,
                  rgba(7,18,46,0.82) 35%,
                  rgba(0,13,38,0.78) 65%,
                  rgba(7,18,46,0.88) 100%)
              `,
              backdropFilter: "blur(40px) saturate(1.7)",
              WebkitBackdropFilter: "blur(40px) saturate(1.7)",
              boxShadow: `
                inset 0 2px 0 rgba(255,255,255,0.22),
                inset 0 1px 0 rgba(255,255,255,0.45),
                inset 0 -2px 0 rgba(0,0,0,0.55),
                inset 0 -1px 0 rgba(0,0,0,0.4),
                inset 2px 0 4px rgba(255,255,255,0.05),
                inset -2px 0 4px rgba(0,0,0,0.35),
                inset 0 0 100px rgba(239,68,68,0.06),
                inset 0 80px 120px -40px rgba(255,255,255,0.06)
              `,
              overflow: "hidden",
            }}
          >
            {/* Specular top highlight — wide glass reflection */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "45%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
            {/* Sharp top reflection arc */}
            <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)", pointerEvents: "none" }} />
            {/* Secondary reflection arc */}
            <div style={{ position: "absolute", top: 3, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)", pointerEvents: "none" }} />
            {/* Corner red bloom — top right */}
            <div style={{ position: "absolute", top: -120, right: -120, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.22), rgba(239,68,68,0.06) 40%, transparent 65%)", pointerEvents: "none" }} />
            {/* Corner blue bloom — bottom left for balance */}
            <div style={{ position: "absolute", bottom: -100, left: -100, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,90,160,0.16), transparent 60%)", pointerEvents: "none" }} />
            {/* Subtle noise texture for tactile skeuo feel */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.4,
                mixBlendMode: "overlay",
                backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)`,
                backgroundSize: "3px 3px, 5px 5px",
                backgroundPosition: "0 0, 1px 1px",
                pointerEvents: "none",
              }}
            />
            {/* Opening quote glyph */}
            <div
              className="tbl-ov-quote"
              style={{
                position: "absolute",
                top: "clamp(20px, 3vw, 32px)",
                left: "clamp(20px, 3vw, 32px)",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(56px, 8vw, 96px)",
                lineHeight: 0.6,
                color: TBL_RED,
                opacity: 0,
                pointerEvents: "none",
                fontWeight: 800,
              }}
            >
              &ldquo;
            </div>

            {/* Cinematic corner brackets — skeuo frame markers */}
            {[
              { top: 14, left: 14, bt: true, bl: true },
              { top: 14, right: 14, bt: true, br: true },
              { bottom: 14, left: 14, bb: true, bl: true },
              { bottom: 14, right: 14, bb: true, br: true },
            ].map((c, i) => (
              <div
                key={i}
                className="tbl-ov-bracket"
                style={{
                  position: "absolute",
                  top: c.top, bottom: c.bottom, left: c.left, right: c.right,
                  width: 18, height: 18,
                  borderTop: c.bt ? "1.5px solid rgba(239,68,68,0.55)" : "none",
                  borderBottom: c.bb ? "1.5px solid rgba(239,68,68,0.55)" : "none",
                  borderLeft: c.bl ? "1.5px solid rgba(239,68,68,0.55)" : "none",
                  borderRight: c.br ? "1.5px solid rgba(239,68,68,0.55)" : "none",
                  borderTopLeftRadius: c.bt && c.bl ? 4 : 0,
                  borderTopRightRadius: c.bt && c.br ? 4 : 0,
                  borderBottomLeftRadius: c.bb && c.bl ? 4 : 0,
                  borderBottomRightRadius: c.bb && c.br ? 4 : 0,
                  pointerEvents: "none",
                  filter: `drop-shadow(0 0 6px ${TBL_RED}40)`,
                  opacity: 0,
                }}
              />
            ))}

            <p
              className="tbl-ov-para"
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "clamp(15px, 1.25vw, 17.5px)",
                color: "rgba(255,255,255,0.80)",
                lineHeight: 1.85,
                margin: "0 0 28px",
                position: "relative",
                textShadow: "0 1px 2px rgba(0,0,0,0.35)",
              }}
            >
              As the leadership community around customer engagement continues to evolve,{" "}
              <span style={{ color: "rgba(255,255,255,0.97)", fontWeight: 600 }}>The Big Leap Connect</span>{" "}brings together Riyadh&apos;s foremost growth, marketing, and digital leaders for focused, high-impact dialogue. Curated as an invite-only forum, this is specially designed to enable deeper peer exchange, meaningful conversations, and actionable takeaways among senior decision-makers. It is a space where leaders move beyond trends and headlines to examine what transformation truly demands.
            </p>

            {/* Separator with red dot */}
            <div className="tbl-ov-sep" style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 24px", transform: "scaleX(0)", transformOrigin: "left" }}>
              <div className="tbl-pulse-dot" style={{ position: "relative", width: 6, height: 6, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #ff8a8a, ${TBL_RED} 55%, #b91c1c)`, boxShadow: `0 0 12px ${TBL_RED}, 0 0 4px ${TBL_RED}` }} />
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${TBL_RED}66, ${TBL_RED}22 40%, transparent)` }} />
            </div>

            <p
              className="tbl-ov-para"
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "clamp(15px, 1.25vw, 17.5px)",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.75,
                margin: 0,
                position: "relative",
                textShadow: "0 1px 2px rgba(0,0,0,0.35)",
              }}
            >
              Presented by{" "}
              <span
                style={{
                  background: `linear-gradient(110deg, #ffb4b4, ${TBL_RED}, #ff5555)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 800,
                }}
              >
                CleverTap
              </span>
              , The Big Leap Connect is where Riyadh&apos;s growth leaders converge to exchange ideas, challenge thinking, and collectively take the next leap.
            </p>

            {/* Bottom inner shadow line */}
            <div style={{ position: "absolute", bottom: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.55), transparent)", pointerEvents: "none" }} />
            {/* Secondary bottom shadow */}
            <div style={{ position: "absolute", bottom: 3, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.25), transparent)", pointerEvents: "none" }} />
          </div>
            </div>
          </div>
          {/* ── /BACK FACE ── */}
          </div>

          {/* ── FRONT FACE — TBL logo, absolutely overlaid (visible while flipper is at 180deg) ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: 32,
              padding: "2.5px",
              background: `
                linear-gradient(140deg,
                  rgba(255,255,255,0.55) 0%,
                  rgba(239,68,68,0.45) 22%,
                  rgba(255,255,255,0.08) 42%,
                  rgba(0,0,0,0.5) 58%,
                  rgba(255,255,255,0.30) 78%,
                  rgba(239,68,68,0.35) 100%)
              `,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 30,
                background: `linear-gradient(180deg, rgba(13,28,58,0.94) 0%, rgba(7,18,46,0.86) 50%, rgba(0,13,38,0.92) 100%)`,
                backdropFilter: "blur(40px) saturate(1.7)",
                WebkitBackdropFilter: "blur(40px) saturate(1.7)",
                boxShadow: `
                  inset 0 2px 0 rgba(255,255,255,0.22),
                  inset 0 1px 0 rgba(255,255,255,0.45),
                  inset 0 -2px 0 rgba(0,0,0,0.55),
                  inset 0 -1px 0 rgba(0,0,0,0.4),
                  inset 0 0 100px rgba(239,68,68,0.08),
                  inset 0 80px 120px -40px rgba(255,255,255,0.06)
                `,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(18px, 2.4vw, 28px)",
                overflow: "hidden",
              }}
            >
              {/* Specular top highlight */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, transparent 100%)", pointerEvents: "none" }} />
              {/* Sharp top reflection arc */}
              <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)", pointerEvents: "none" }} />
              {/* Corner red bloom */}
              <div style={{ position: "absolute", top: -120, right: -120, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.22), rgba(239,68,68,0.06) 40%, transparent 65%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -100, left: -100, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,90,160,0.16), transparent 60%)", pointerEvents: "none" }} />
              {/* Pixel grid backdrop */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                  `,
                  backgroundSize: "44px 44px",
                  pointerEvents: "none",
                  maskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0.6), transparent 90%)",
                  WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0.6), transparent 90%)",
                }}
              />
              {/* TBL Logo — clean, no decorative elements within clear space (per brand §08) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="tbl-ov-logo"
                src={TBL_LOGO}
                alt="The Big Leap"
                style={{
                  height: "clamp(140px, 18vw, 240px)",
                  width: "auto",
                  position: "relative",
                  margin: "clamp(40px, 5vw, 70px) 0",
                  opacity: 0,
                }}
              />
            </div>
          </div>
          {/* ── /FRONT FACE ── */}
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── WHAT'S IN STORE — 4 Pillars ─────────────────────────────────────────────
function WhatToExpectSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px, 5.5vw, 72px) 0",
        background: "transparent",
      }}
    >
      {/* Background lives on the shared TBL dark wrapper in the page composition */}

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(36px, 5vh, 56px)" }}>
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: "clamp(22px, 3.5vw, 48px)",
              lineHeight: 1.08,
              letterSpacing: "-0.038em",
              margin: "0 auto clamp(22px, 2.8vh, 30px)",
              color: TBL_WHITE,
              whiteSpace: "nowrap",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
            }}
          >
            Here&apos;s What the Evening Has in Store.
          </h2>

          {/* Glowing red underline */}
          <div
            style={{
              display: "inline-block",
              width: 80,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${TBL_RED}, transparent)`,
              boxShadow: `0 0 14px ${TBL_RED}55`,
              transformOrigin: "center",
              transform: inView ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 1s cubic-bezier(0.16,1,0.3,1) 0.4s",
            }}
          />
        </div>

        {/* ═══ Single luxury DARK panel containing all 4 pillars as editorial rows ═══ */}
        <div
          style={{
            position: "relative",
            borderRadius: 32,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s",
            boxShadow: `
              0 60px 120px -20px rgba(0,0,0,0.75),
              0 40px 80px -20px rgba(239,68,68,0.18),
              0 20px 40px -10px rgba(0,0,0,0.55),
              0 8px 16px -4px rgba(0,0,0,0.45)
            `,
          }}
        >
          {/* Outer metallic gradient ring */}
          <div
            style={{
              padding: "2.5px",
              borderRadius: 32,
              background: `
                linear-gradient(140deg,
                  rgba(255,255,255,0.55) 0%,
                  rgba(239,68,68,0.45) 22%,
                  rgba(255,255,255,0.08) 42%,
                  rgba(0,0,0,0.5) 58%,
                  rgba(255,255,255,0.30) 78%,
                  rgba(239,68,68,0.35) 100%)
              `,
            }}
          >
            {/* Inner ring — creates the double-bevel */}
            <div
              style={{
                padding: "1px",
                borderRadius: 30,
                background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.2))",
              }}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: 29,
                  padding: "clamp(10px, 1.4vw, 24px) clamp(20px, 2.6vw, 44px)",
                  background: `
                    linear-gradient(180deg,
                      rgba(13,28,58,0.92) 0%,
                      rgba(7,18,46,0.82) 35%,
                      rgba(0,13,38,0.78) 65%,
                      rgba(7,18,46,0.88) 100%)
                  `,
                  backdropFilter: "blur(40px) saturate(1.7)",
                  WebkitBackdropFilter: "blur(40px) saturate(1.7)",
                  boxShadow: `
                    inset 0 2px 0 rgba(255,255,255,0.22),
                    inset 0 1px 0 rgba(255,255,255,0.45),
                    inset 0 -2px 0 rgba(0,0,0,0.55),
                    inset 0 -1px 0 rgba(0,0,0,0.4),
                    inset 2px 0 4px rgba(255,255,255,0.05),
                    inset -2px 0 4px rgba(0,0,0,0.35),
                    inset 0 0 100px rgba(239,68,68,0.06),
                    inset 0 80px 120px -40px rgba(255,255,255,0.06)
                  `,
                  overflow: "hidden",
                }}
              >
                {/* Specular top highlight */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "45%",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
                {/* Sharp top reflection arc */}
                <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: 3, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)", pointerEvents: "none" }} />
                {/* Corner red bloom + cool balance */}
                <div style={{ position: "absolute", top: -120, right: -120, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.22), rgba(239,68,68,0.06) 40%, transparent 65%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -100, left: -100, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,90,160,0.16), transparent 60%)", pointerEvents: "none" }} />
                {/* Noise grain */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.4,
                    mixBlendMode: "overlay",
                    backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)`,
                    backgroundSize: "3px 3px, 5px 5px",
                    backgroundPosition: "0 0, 1px 1px",
                    pointerEvents: "none",
                  }}
                />

                {/* Cinematic corner brackets */}
                {[
                  { top: 14, left: 14, bt: true, bl: true },
                  { top: 14, right: 14, bt: true, br: true },
                  { bottom: 14, left: 14, bb: true, bl: true },
                  { bottom: 14, right: 14, bb: true, br: true },
                ].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: c.top, bottom: c.bottom, left: c.left, right: c.right,
                      width: 18, height: 18,
                      borderTop: c.bt ? `1.5px solid ${TBL_RED}` : "none",
                      borderBottom: c.bb ? `1.5px solid ${TBL_RED}` : "none",
                      borderLeft: c.bl ? `1.5px solid ${TBL_RED}` : "none",
                      borderRight: c.br ? `1.5px solid ${TBL_RED}` : "none",
                      opacity: 0.55,
                      borderTopLeftRadius: c.bt && c.bl ? 4 : 0,
                      borderTopRightRadius: c.bt && c.br ? 4 : 0,
                      borderBottomLeftRadius: c.bb && c.bl ? 4 : 0,
                      borderBottomRightRadius: c.bb && c.br ? 4 : 0,
                      pointerEvents: "none",
                    }}
                  />
                ))}

                {/* ═══ 2x2 pillar grid ═══ */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(14px, 1.8vw, 24px)" }} className="tbl-pillars-grid">
                {PILLARS.map((p) => (
                  <div
                    key={p.num}
                    className="tbl-pillar-row"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      padding: "clamp(28px, 3.2vw, 40px) clamp(20px, 2.4vw, 32px)",
                      position: "relative",
                      borderRadius: 20,
                      background: "linear-gradient(165deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 50%, rgba(255,255,255,0.03) 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.3)",
                      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {/* Background number watermark */}
                    <span style={{
                      position: "absolute",
                      bottom: -15,
                      right: 8,
                      fontFamily: FONT,
                      fontSize: "clamp(130px, 15vw, 220px)",
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "transparent",
                      background: `linear-gradient(160deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.03) 100%)`,
                      WebkitBackgroundClip: "text",
                      pointerEvents: "none",
                      userSelect: "none",
                      letterSpacing: "-0.04em",
                    }}>
                      {p.num}
                    </span>

                    {/* Top accent glow line */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 10%, ${TBL_RED}80 50%, transparent 90%)`, boxShadow: `0 0 16px ${TBL_RED}25`, pointerEvents: "none" }} />
                    {/* Top glass reflection */}
                    <div style={{ position: "absolute", top: 2, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", pointerEvents: "none" }} />
                    {/* Corner glow */}
                    <div style={{ position: "absolute", top: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${TBL_RED}15, transparent 60%)`, pointerEvents: "none" }} />

                    {/* Title + Description */}
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <h3
                        style={{
                          fontFamily: FONT,
                          fontWeight: 700,
                          fontSize: "clamp(22px, 2.2vw, 30px)",
                          lineHeight: 1.2,
                          letterSpacing: "-0.022em",
                          margin: "0 0 12px",
                          color: TBL_WHITE,
                          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))",
                        }}
                      >
                        {p.title}
                      </h3>
                      {/* Subtle accent line under title */}
                      <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${TBL_RED}, ${TBL_RED}40)`, borderRadius: 2, margin: "0 auto 14px", boxShadow: `0 0 8px ${TBL_RED}30` }} />
                      <p
                        style={{
                          fontFamily: FONT,
                          fontWeight: 500,
                          fontSize: "clamp(14px, 1.15vw, 17px)",
                          lineHeight: 1.75,
                          color: "rgba(255,255,255,0.6)",
                          margin: 0,
                        }}
                      >
                        {p.desc}
                      </p>
                    </div>

                  </div>
                ))}
                </div>

                {/* Bottom inner shadow line */}
                <div style={{ position: "absolute", bottom: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tbl-pillar-row:hover {
          border-color: rgba(239,68,68,0.25) !important;
          transform: translateY(-4px) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3), 0 16px 48px rgba(0,0,0,0.4), 0 0 24px rgba(239,68,68,0.08) !important;
        }
        @media (max-width: 760px) {
          .tbl-pillars-grid { grid-template-columns: 1fr 1fr !important; }
          .tbl-row-accent { display: none !important; }
        }
        @media (max-width: 520px) {
          .tbl-pillars-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── AGENDA — Vertical Timeline ──────────────────────────────────────────────
function AgendaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Form state (merged from former RegistrationSection)
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "SA") || COUNTRY_CODES[0]
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    if (formData.email && !isWorkEmail(formData.email)) {
      setEmailError("Please use your work email");
      setSubmitting(false);
      return;
    }
    const phoneErr = validatePhone(formData.phone || "", selectedCountry);
    if (phoneErr) {
      setPhoneError(phoneErr);
      setSubmitting(false);
      return;
    }
    const combinedPhone = `${selectedCountry.code}${(formData.phone || "").replace(/[\s\-()]/g, "")}`;
    const result = await submitForm({
      type: "attend",
      full_name: formData.name || "",
      email: formData.email || "",
      company: formData.company || "",
      job_title: formData.title || "",
      phone: combinedPhone,
      event_name: "The Big Leap Connect Riyadh 2026",
      metadata: { country: formData.country || "" },
    });
    setSubmitting(false);
    if (result.success) setSubmitted(true);
    else setFormError(result.error || "Something went wrong.");
  };

  const handleChange = (n: string, v: string) => setFormData((p) => ({ ...p, [n]: v }));
  const resetForm = () => {
    setSubmitted(false);
    setFormError(null);
    setFormData({});
    setPhoneError(null);
    setEmailError(null);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: TBL_WHITE,
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 500,
    outline: "none",
    transition: "all 0.3s ease",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 10.5,
    fontWeight: 600,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 5,
    display: "block",
    letterSpacing: "0.4px",
  };

  return (
    <section
      ref={sectionRef}
      id="agenda"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(28px, 3.5vw, 48px) 0",
        background: "transparent",
      }}
    >
      {/* Background lives on the shared TBL dark wrapper in the page composition */}

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(24px, 3vh, 36px)" }}>
          {/* Premium kicker pill */}
          <div
            style={{
              display: "inline-flex",
              padding: "1.2px",
              borderRadius: 999,
              background: "linear-gradient(140deg, rgba(255,255,255,0.45) 0%, rgba(239,68,68,0.35) 28%, rgba(255,255,255,0.10) 55%, rgba(255,255,255,0.32) 100%)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.55), 0 6px 20px rgba(239,68,68,0.18)",
              marginBottom: "clamp(20px, 2.6vh, 28px)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 22px 8px 14px",
                borderRadius: 999,
                background: "linear-gradient(180deg, rgba(0,13,38,0.78) 0%, rgba(0,13,38,0.62) 100%)",
                backdropFilter: "blur(24px) saturate(1.5)",
                WebkitBackdropFilter: "blur(24px) saturate(1.5)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.4), inset 0 0 22px rgba(239,68,68,0.08)",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }} />
              <div className="tbl-pulse-dot" style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #ff8a8a, ${TBL_RED} 50%, #b91c1c)`, boxShadow: `0 0 14px ${TBL_RED}, 0 0 4px ${TBL_RED}` }} />
              <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.96)", textShadow: "0 1px 2px rgba(0,0,0,0.4)", position: "relative" }}>
                Run of Show
              </span>
            </div>
          </div>

          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: "clamp(28px, 4.4vw, 52px)",
              lineHeight: 1.08,
              letterSpacing: "-0.038em",
              margin: "0 auto clamp(22px, 2.8vh, 30px)",
              maxWidth: 820,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
            }}
          >
            <span
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #ffffff 60%, rgba(255,255,255,0.86) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 6px 40px rgba(0,0,0,0.55)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
              }}
            >
              The Evening{" "}
            </span>
            <span
              style={{
                background: `linear-gradient(160deg, #ffb4b4 0%, ${TBL_RED} 50%, #b91c1c 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Agenda.
            </span>
          </h2>

          <div
            style={{
              display: "inline-block",
              width: 80,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${TBL_RED}, transparent)`,
              boxShadow: `0 0 12px ${TBL_RED}80`,
              transformOrigin: "center",
              transform: inView ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 1s cubic-bezier(0.16,1,0.3,1) 0.4s",
            }}
          />
        </div>

        {/* ═══ STACKED LAYOUT: Agenda on top, Form below ═══ */}
        <div
          className="tbl-split"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(32px, 4vw, 48px)",
          }}
        >
          {/* ═══════════════════ AGENDA ═══════════════════ */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 14, maxWidth: 800, margin: "0 auto", width: "100%",
            padding: "clamp(16px, 2vw, 28px)", borderRadius: 24, position: "relative", overflow: "hidden",
            background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.3)",
          }}>
            {/* Subtle grid texture inside agenda container */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000, transparent 80%)" }} />
            {/* Corner glow */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${TBL_RED}10, transparent 60%)`, pointerEvents: "none" }} />
            {AGENDA.map((item, i) => (
              <div
                key={i}
                className="tbl-agenda-card"
                style={{
                  display: "flex", alignItems: "center", gap: "clamp(18px, 2.2vw, 30px)",
                  borderRadius: 20, position: "relative", overflow: "hidden",
                  padding: "2px",
                  background: item.highlight
                    ? `linear-gradient(140deg, ${TBL_RED}60 0%, rgba(255,255,255,0.12) 40%, ${TBL_RED}30 100%)`
                    : "linear-gradient(140deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.10) 100%)",
                  boxShadow: item.highlight
                    ? `0 12px 36px rgba(239,68,68,0.12), 0 4px 14px rgba(0,0,0,0.3)`
                    : "0 8px 28px rgba(0,0,0,0.25)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(16px)",
                  transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.07}s`,
                }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: "clamp(18px, 2.2vw, 30px)", width: "100%",
                  padding: "clamp(18px, 2.2vw, 24px) clamp(20px, 2.6vw, 30px)",
                  borderRadius: 18,
                  background: item.highlight
                    ? `linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(0,13,38,0.92) 40%, rgba(0,13,38,0.88) 100%)`
                    : "linear-gradient(135deg, rgba(0,13,38,0.90) 0%, rgba(0,13,38,0.85) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.3)",
                  position: "relative", overflow: "hidden",
                }}>
                  {/* Top reflection */}
                  <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, ${item.highlight ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.20)"}, transparent)`, pointerEvents: "none" }} />
                  {/* Left accent bar for highlighted */}
                  {item.highlight && (
                    <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, borderRadius: "0 3px 3px 0", background: `linear-gradient(180deg, ${TBL_RED}, ${TBL_RED}80)`, boxShadow: `0 0 12px ${TBL_RED}40` }} />
                  )}
                  {/* Step number watermark */}
                  <span style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontFamily: FONT, fontSize: 64, fontWeight: 900, color: "transparent", background: item.highlight ? `linear-gradient(160deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))` : "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", WebkitBackgroundClip: "text", pointerEvents: "none", userSelect: "none" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* Time */}
                  <div style={{ flexShrink: 0, textAlign: "center", minWidth: 80, position: "relative", zIndex: 2 }}>
                    <span style={{ fontFamily: FONT, fontSize: "clamp(16px, 1.4vw, 20px)", fontWeight: 800, color: item.highlight ? TBL_RED : TBL_WHITE, display: "block", lineHeight: 1.2, filter: item.highlight ? `drop-shadow(0 0 6px ${TBL_RED}40)` : "none" }}>{item.time}</span>
                    <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px" }}>{item.duration}</span>
                  </div>
                  {/* Divider */}
                  <div style={{ width: 1, alignSelf: "stretch", background: `linear-gradient(180deg, transparent, ${item.highlight ? TBL_RED + "50" : "rgba(255,255,255,0.12)"}, transparent)`, position: "relative", zIndex: 2 }} />
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 2 }}>
                    <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: "clamp(15px, 1.3vw, 18px)", color: TBL_WHITE, margin: 0, lineHeight: 1.4, letterSpacing: "-0.01em" }}>{item.title}</h3>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>{item.presenter}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ═══════════════════ REGISTRATION FORM ═══════════════════ */}
          <div style={{ textAlign: "center", marginBottom: "clamp(20px, 2.5vh, 28px)" }}>
            <h2 style={{
              fontFamily: FONT, fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 44px)",
              color: TBL_WHITE, letterSpacing: "-0.03em", margin: "0 0 8px",
            }}>
              Request Your{" "}
              <span style={{ background: `linear-gradient(160deg, #ffb4b4 0%, ${TBL_RED} 50%, #b91c1c 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Invitation
              </span>
            </h2>
          </div>
          <div
            id="register"
            style={{
              maxWidth: 720,
              margin: "0 auto",
              width: "100%",
              borderRadius: 28,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(28px)",
              transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s",
              boxShadow: `
                0 50px 100px -20px rgba(0,0,0,0.65),
                0 30px 60px -16px rgba(239,68,68,0.18),
                0 14px 28px -8px rgba(0,0,0,0.5)
              `,
            }}
          >
            <div
              style={{
                padding: "2px",
                borderRadius: 28,
                background: `linear-gradient(140deg, rgba(255,255,255,0.50) 0%, rgba(239,68,68,0.50) 22%, rgba(255,255,255,0.06) 42%, rgba(0,0,0,0.5) 58%, rgba(255,255,255,0.28) 78%, rgba(239,68,68,0.40) 100%)`,
              }}
            >
              <div style={{ padding: "1px", borderRadius: 26, background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.20))" }}>
                <div
                  style={{
                    position: "relative",
                    borderRadius: 25,
                    padding: "clamp(24px, 2.8vw, 34px) clamp(22px, 2.6vw, 32px)",
                    background: `linear-gradient(180deg, rgba(13,28,58,0.92) 0%, rgba(7,18,46,0.82) 50%, rgba(0,13,38,0.88) 100%)`,
                    backdropFilter: "blur(36px) saturate(1.6)",
                    WebkitBackdropFilter: "blur(36px) saturate(1.6)",
                    boxShadow: `
                      inset 0 2px 0 rgba(255,255,255,0.20),
                      inset 0 1px 0 rgba(255,255,255,0.42),
                      inset 0 -2px 0 rgba(0,0,0,0.50),
                      inset 0 -1px 0 rgba(0,0,0,0.35),
                      inset 0 0 100px rgba(239,68,68,0.06),
                      inset 0 80px 120px -50px rgba(255,255,255,0.06)
                    `,
                    overflow: "hidden",
                  }}
                >
                  {/* Specular top highlight */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.70), transparent)" }} />
                  <div style={{ position: "absolute", top: -100, left: -100, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.20), transparent 65%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: -80, right: -80, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,90,160,0.14), transparent 60%)", pointerEvents: "none" }} />

                  {/* Cinematic corner brackets */}
                  {[
                    { top: 12, left: 12, bt: true, bl: true },
                    { top: 12, right: 12, bt: true, br: true },
                    { bottom: 12, left: 12, bb: true, bl: true },
                    { bottom: 12, right: 12, bb: true, br: true },
                  ].map((c, i) => (
                    <div key={`fb-${i}`} style={{ position: "absolute", top: c.top, bottom: c.bottom, left: c.left, right: c.right, width: 14, height: 14, borderTop: c.bt ? "1.5px solid rgba(239,68,68,0.55)" : "none", borderBottom: c.bb ? "1.5px solid rgba(239,68,68,0.55)" : "none", borderLeft: c.bl ? "1.5px solid rgba(239,68,68,0.55)" : "none", borderRight: c.br ? "1.5px solid rgba(239,68,68,0.55)" : "none", borderTopLeftRadius: c.bt && c.bl ? 3 : 0, borderTopRightRadius: c.bt && c.br ? 3 : 0, borderBottomLeftRadius: c.bb && c.bl ? 3 : 0, borderBottomRightRadius: c.bb && c.br ? 3 : 0, pointerEvents: "none", filter: `drop-shadow(0 0 4px ${TBL_RED}40)` }} />
                  ))}

                  {/* Form header */}
                  <div style={{ position: "relative", marginBottom: "clamp(18px, 2.2vh, 24px)" }}>
                    <h3
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: "clamp(22px, 2.4vw, 30px)",
                        lineHeight: 1.15,
                        letterSpacing: "-0.025em",
                        margin: "0 0 8px",
                      }}
                    >
                      <span
                        style={{
                          background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.86) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Apply to{" "}
                      </span>
                      <span
                        style={{
                          background: `linear-gradient(160deg, #ffb4b4 0%, ${TBL_RED} 50%, #b91c1c 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Attend
                      </span>
                    </h3>
                    <p style={{ fontFamily: FONT, fontSize: 12.5, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>
                      Reserved for senior decision-makers in growth, marketing &amp; product.
                    </p>
                  </div>

                  {submitted ? (
                    <div style={{ textAlign: "center", padding: "28px 0", position: "relative" }}>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "50%",
                          background: "rgba(34,197,94,0.15)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: TBL_WHITE, margin: "0 0 6px" }}>
                        You&apos;re on the List
                      </h3>
                      <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 16px" }}>
                        We&apos;ll confirm your seat within 24 hours.
                      </p>
                      <button
                        onClick={resetForm}
                        style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: TBL_RED, background: "none", border: "none", cursor: "pointer" }}
                      >
                        Submit another &rarr;
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ position: "relative" }}>
                      <div className="tbl-form-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <label style={labelStyle}>Full Name</label>
                          <input
                            type="text"
                            value={formData.name || ""}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Your full name"
                            required
                            className="tbl-form-input"
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Work Email</label>
                          <input
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => {
                              handleChange("email", e.target.value);
                              setEmailError(null);
                            }}
                            placeholder="you@company.com"
                            required
                            className="tbl-form-input"
                            style={inputStyle}
                            onBlur={(e) => {
                              const val = formData.email || e.currentTarget.value;
                              if (val && !isWorkEmail(val)) setEmailError("Please use your work email");
                            }}
                          />
                          {emailError && <p style={{ color: TBL_RED, fontSize: 10.5, margin: "4px 0 0", fontFamily: FONT }}>{emailError}</p>}
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={labelStyle}>Phone Number</label>
                          <div style={{ display: "flex", gap: 8 }}>
                            <select
                              value={`${selectedCountry.code}|${selectedCountry.country}`}
                              onChange={(e) => {
                                const [code, country] = e.target.value.split("|");
                                const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country);
                                if (c) {
                                  setSelectedCountry(c);
                                  setPhoneError(null);
                                }
                              }}
                              className="tbl-form-input"
                              style={{ ...inputStyle, width: 120, flexShrink: 0, appearance: "none", cursor: "pointer" }}
                            >
                              {COUNTRY_CODES.map((cc) => (
                                <option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>
                                  {cc.country} {cc.code}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              value={formData.phone || ""}
                              onChange={(e) => {
                                handleChange("phone", e.target.value);
                                setPhoneError(null);
                              }}
                              placeholder={selectedCountry.placeholder}
                              maxLength={selectedCountry.length}
                              className="tbl-form-input"
                              style={{ ...inputStyle, flex: 1 }}
                            />
                          </div>
                          {phoneError && <p style={{ color: TBL_RED, fontSize: 10.5, margin: "4px 0 0", fontFamily: FONT }}>{phoneError}</p>}
                        </div>
                        <div>
                          <label style={labelStyle}>Company</label>
                          <input
                            type="text"
                            value={formData.company || ""}
                            onChange={(e) => handleChange("company", e.target.value)}
                            placeholder="Company name"
                            required
                            className="tbl-form-input"
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Job Title</label>
                          <input
                            type="text"
                            value={formData.title || ""}
                            onChange={(e) => handleChange("title", e.target.value)}
                            placeholder="Your role"
                            required
                            className="tbl-form-input"
                            style={inputStyle}
                          />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={labelStyle}>Country</label>
                          <select
                            value={formData.country || ""}
                            onChange={(e) => handleChange("country", e.target.value)}
                            required
                            className="tbl-form-input"
                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                          >
                            <option value="" style={{ color: "#222", background: "#fff" }}>
                              Select your country
                            </option>
                            {COUNTRY_CODES.map((cc) => (
                              <option key={cc.country} value={cc.name} style={{ color: "#222", background: "#fff" }}>
                                {cc.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                      {formError && <p style={{ color: TBL_RED, fontFamily: FONT, fontSize: 12, margin: "8px 0 0" }}>{formError}</p>}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="tbl-submit"
                        style={{
                          width: "100%",
                          marginTop: 18,
                          padding: "14px 26px",
                          borderRadius: 12,
                          background: `linear-gradient(135deg, ${TBL_RED} 0%, #dc2626 100%)`,
                          color: TBL_WHITE,
                          fontFamily: FONT,
                          fontSize: 13.5,
                          fontWeight: 700,
                          border: "none",
                          cursor: submitting ? "not-allowed" : "pointer",
                          opacity: submitting ? 0.7 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          boxShadow: `0 12px 32px rgba(239,68,68,0.40), 0 2px 8px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.25)`,
                          letterSpacing: "0.3px",
                          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      >
                        {submitting ? "Submitting..." : "Request Your Invitation"} {!submitting && <span>&rarr;</span>}
                      </button>
                      <p style={{ fontFamily: FONT, fontSize: 10.5, color: "rgba(255,255,255,0.4)", textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}>
                        By submitting this form, you agree to CleverTap&apos;s{" "}
                        <a
                          href="https://clevertap.com/privacy-policy/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: TBL_RED, textDecoration: "underline", fontWeight: 600 }}
                        >
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </form>
                  )}

                  <div style={{ position: "absolute", bottom: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tbl-agenda-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease; }
        .tbl-agenda-card:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 16px 48px rgba(239,68,68,0.10), 0 8px 24px rgba(0,0,0,0.4) !important;
        }
        .tbl-form-input:focus {
          border-color: ${TBL_RED}80 !important;
          background: rgba(239,68,68,0.04) !important;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.10), 0 4px 14px rgba(239,68,68,0.06);
        }
        .tbl-form-input::placeholder { color: rgba(255,255,255,0.30); }
        .tbl-submit { position: relative; overflow: hidden; }
        .tbl-submit::before {
          content: ''; position: absolute; top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
          transform: skewX(-18deg);
          transition: left 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .tbl-submit:hover:not(:disabled)::before { left: 130%; }
        .tbl-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 18px 46px rgba(239,68,68,0.55), 0 2px 8px rgba(239,68,68,0.32), inset 0 1px 0 rgba(255,255,255,0.32) !important;
        }
        @media (max-width: 980px) {
        }
        @media (max-width: 600px) {
          .tbl-form-fields { grid-template-columns: 1fr !important; }
          .tbl-agenda-time { width: 92px !important; padding: 12px 8px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── ABOUT SPONSOR ───────────────────────────────────────────────────────────
function AboutSponsorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Apple-style GSAP entrance timeline
  useGSAP(() => {
    if (!inView || !cardRef.current) return;
    const root = cardRef.current;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const card = root.querySelector(".tbl-sp-card");
    const brackets = root.querySelectorAll(".tbl-sp-bracket");
    const kicker = root.querySelector(".tbl-sp-kicker");
    const logoRings = root.querySelectorAll(".tbl-sp-ring");
    const logo = root.querySelector(".tbl-sp-logo");
    const headingWords = root.querySelectorAll(".tbl-sp-word");
    const underline = root.querySelector(".tbl-sp-underline");
    const body = root.querySelector(".tbl-sp-body");
    const cta = root.querySelector(".tbl-sp-cta");

    const tagline = root.querySelector(".tbl-sp-tagline");

    if (card) tl.fromTo(card, { y: 60, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, 0);
    if (brackets.length) tl.fromTo(brackets, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.55, stagger: 0.07, ease: "back.out(1.6)" }, 0.5);
    if (kicker) tl.fromTo(kicker, { y: 22, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.85 }, 0.55);
    if (logoRings.length) tl.fromTo(logoRings, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, stagger: 0.08, ease: "power4.out" }, 0.65);
    if (logo) tl.fromTo(logo, { scale: 0.88, opacity: 0, filter: "blur(8px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, 0.75);
    if (tagline) tl.fromTo(tagline, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.95);
    if (headingWords.length) tl.fromTo(headingWords, { y: 26, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.055 }, 1.0);
    if (underline) tl.fromTo(underline, { scaleX: 0 }, { scaleX: 1, duration: 0.95, ease: "power4.out" }, 1.0);
    if (body) tl.fromTo(body, { y: 18, opacity: 0, clipPath: "inset(0 0 100% 0)" }, { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.95, ease: "power3.out" }, 1.15);
    if (cta) tl.fromTo(cta, { y: 18, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "back.out(1.4)" }, 1.5);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px, 5.5vw, 72px) 0",
        background: TBL_WHITE,
      }}
    >
      {/* Brand BG image — light theme, used as-is */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${TBL_SPONSOR_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      <div
        ref={cardRef}
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* ═══ Wide skeuo×glass card ═══ */}
        <div
          className="tbl-sp-card"
          style={{
            position: "relative",
            borderRadius: 32,
            opacity: 0,
            boxShadow: `
              0 60px 120px -20px rgba(0,0,0,0.75),
              0 40px 80px -20px rgba(239,68,68,0.18),
              0 20px 40px -10px rgba(0,0,0,0.55),
              0 8px 16px -4px rgba(0,0,0,0.45)
            `,
          }}
        >
          {/* Outer metallic gradient ring (LIGHT skeuo×glass) */}
          <div
            style={{
              padding: "2px",
              borderRadius: 32,
              background: `
                linear-gradient(140deg,
                  rgba(0,13,38,0.22) 0%,
                  rgba(239,68,68,0.55) 22%,
                  rgba(255,255,255,0.95) 42%,
                  rgba(0,13,38,0.20) 58%,
                  rgba(255,255,255,0.85) 78%,
                  rgba(239,68,68,0.40) 100%)
              `,
            }}
          >
            {/* Inner ring */}
            <div
              style={{
                padding: "1px",
                borderRadius: 30,
                background: "linear-gradient(180deg, rgba(0,13,38,0.12), rgba(0,13,38,0.04))",
              }}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: 29,
                  padding: "clamp(40px, 5.2vw, 72px) clamp(32px, 4.5vw, 80px)",
                  background: `linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(252,252,253,0.80) 50%, rgba(247,247,250,0.86) 100%)`,
                  backdropFilter: "blur(32px) saturate(1.3)",
                  WebkitBackdropFilter: "blur(32px) saturate(1.3)",
                  boxShadow: `
                    inset 0 2px 0 rgba(255,255,255,1),
                    inset 0 1px 0 rgba(255,255,255,1),
                    inset 0 -2px 0 rgba(0,13,38,0.10),
                    inset 0 -1px 0 rgba(0,13,38,0.06),
                    inset 3px 0 6px rgba(255,255,255,0.7),
                    inset -3px 0 6px rgba(0,13,38,0.04),
                    inset 0 0 120px rgba(239,68,68,0.04),
                    inset 0 80px 120px -60px rgba(255,255,255,0.85)
                  `,
                  overflow: "hidden",
                  textAlign: "center",
                }}
              >
                {/* Specular top highlight */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 50%, transparent 100%)", pointerEvents: "none" }} />
                {/* Sharp top reflection arc */}
                <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)", pointerEvents: "none" }} />
                {/* Corner blooms */}
                <div style={{ position: "absolute", top: -120, right: -120, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.10), rgba(239,68,68,0.03) 40%, transparent 65%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -100, left: -100, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,13,38,0.06), transparent 60%)", pointerEvents: "none" }} />

                {/* Cinematic corner brackets */}
                {[
                  { top: 14, left: 14, bt: true, bl: true },
                  { top: 14, right: 14, bt: true, br: true },
                  { bottom: 14, left: 14, bb: true, bl: true },
                  { bottom: 14, right: 14, bb: true, br: true },
                ].map((c, i) => (
                  <div key={`sb-${i}`} className="tbl-sp-bracket" style={{ position: "absolute", top: c.top, bottom: c.bottom, left: c.left, right: c.right, width: 18, height: 18, borderTop: c.bt ? `1.5px solid ${TBL_RED}` : "none", borderBottom: c.bb ? `1.5px solid ${TBL_RED}` : "none", borderLeft: c.bl ? `1.5px solid ${TBL_RED}` : "none", borderRight: c.br ? `1.5px solid ${TBL_RED}` : "none", opacity: 0.55, borderTopLeftRadius: c.bt && c.bl ? 4 : 0, borderTopRightRadius: c.bt && c.br ? 4 : 0, borderBottomLeftRadius: c.bb && c.bl ? 4 : 0, borderBottomRightRadius: c.bb && c.br ? 4 : 0, pointerEvents: "none" }} />
                ))}

                {/* ═══ Two-column layout: brand mark left, narrative right ═══ */}
                <div
                  className="tbl-sp-grid"
                  style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: "0.85fr 1.15fr",
                    gap: "clamp(32px, 4.5vw, 72px)",
                    alignItems: "center",
                  }}
                >
                  {/* ───── LEFT — Brand mark column ───── */}
                  <div
                    className="tbl-sp-left"
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "clamp(20px, 2.6vh, 28px)",
                      paddingRight: "clamp(20px, 2.4vw, 32px)",
                    }}
                  >
                    {/* Decorative concentric circles backdrop */}
                    <svg
                      aria-hidden
                      width="380"
                      height="380"
                      viewBox="0 0 380 380"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "8%",
                        transform: "translateY(-50%)",
                        zIndex: 0,
                        pointerEvents: "none",
                        opacity: 0.55,
                      }}
                    >
                      <circle cx="190" cy="190" r="180" stroke="rgba(0,13,38,0.06)" strokeWidth="1" fill="none" />
                      <circle cx="190" cy="190" r="148" stroke="rgba(239,68,68,0.16)" strokeWidth="1" fill="none" />
                      <circle cx="190" cy="190" r="116" stroke="rgba(0,13,38,0.08)" strokeWidth="1" fill="none" />
                      <circle cx="190" cy="190" r="84" stroke="rgba(239,68,68,0.22)" strokeWidth="1" fill="none" />
                      <circle cx="190" cy="190" r="54" stroke="rgba(0,13,38,0.10)" strokeWidth="1" fill="none" />
                    </svg>

                    {/* Premium light kicker pill */}
                    <div
                      className="tbl-sp-kicker"
                      style={{
                        position: "relative",
                        display: "inline-flex",
                        padding: "1.2px",
                        borderRadius: 999,
                        background: "linear-gradient(140deg, rgba(0,13,38,0.18) 0%, rgba(239,68,68,0.45) 35%, rgba(0,13,38,0.10) 65%, rgba(0,13,38,0.18) 100%)",
                        boxShadow: "0 14px 36px rgba(0,13,38,0.10), 0 4px 14px rgba(239,68,68,0.12)",
                        opacity: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 22px 8px 14px",
                          borderRadius: 999,
                          background: "linear-gradient(180deg, #ffffff 0%, #f7f7f8 100%)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,13,38,0.08), inset 0 0 22px rgba(239,68,68,0.04)",
                          overflow: "hidden",
                        }}
                      >
                        <div className="tbl-pulse-dot" style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #ff8a8a, ${TBL_RED} 50%, #b91c1c)`, boxShadow: `0 0 12px ${TBL_RED}, 0 0 4px ${TBL_RED}` }} />
                        <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: TBL_OXFORD_BLACK, position: "relative" }}>
                          Presented by
                        </span>
                      </div>
                    </div>

                    {/* CleverTap logo */}
                    <div style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="tbl-sp-logo"
                        src={CT_LOGO}
                        alt="CleverTap"
                        loading="lazy"
                        style={{
                          height: "clamp(48px, 5.4vw, 76px)",
                          width: "auto",
                          opacity: 0,
                          filter: "drop-shadow(0 8px 22px rgba(0,13,38,0.10))",
                        }}
                      />
                    </div>

                    {/* Tagline strip — "All-In-One Customer Engagement Platform" pulled from body */}
                    <div
                      className="tbl-sp-tagline"
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        opacity: 0,
                      }}
                    >
                      <div style={{ width: 24, height: 1.5, background: TBL_RED }} />
                      <span
                        style={{
                          fontFamily: FONT,
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: TBL_RED,
                        }}
                      >
                        All-In-One &middot; Real-Time &middot; Cross-Channel
                      </span>
                    </div>
                  </div>

                  {/* ───── Vertical hairline divider ───── */}
                  <div
                    className="tbl-sp-divider"
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "calc(0.85 / 2 * 100%)",
                      top: "8%",
                      bottom: "8%",
                      width: 1,
                      background: `linear-gradient(180deg, transparent, ${TBL_RED}55 20%, rgba(0,13,38,0.12) 50%, ${TBL_RED}55 80%, transparent)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* ───── RIGHT — Narrative column ───── */}
                  <div
                    className="tbl-sp-right"
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "clamp(20px, 2.6vh, 30px)",
                    }}
                  >
                    {/* Gradient underline */}
                    <div
                      className="tbl-sp-underline"
                      style={{
                        display: "inline-block",
                        width: 56,
                        height: 2,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${TBL_RED}, transparent)`,
                        boxShadow: `0 0 10px ${TBL_RED}66`,
                        transformOrigin: "left",
                        transform: "scaleX(0)",
                      }}
                    />

                    <p
                      className="tbl-sp-body"
                      style={{
                        fontFamily: FONT,
                        fontWeight: 500,
                        fontSize: "clamp(14.5px, 1.18vw, 16.5px)",
                        lineHeight: 1.82,
                        color: TBL_CADET,
                        margin: 0,
                        textAlign: "left",
                        opacity: 0,
                      }}
                    >
                      <span style={{ fontWeight: 700, color: TBL_OXFORD_BLACK }}>CleverTap</span> is an{" "}
                      <span style={{ color: TBL_OXFORD_BLACK, fontWeight: 600 }}>All-In-One customer engagement platform</span> that unifies interactions between people, processes and technology. Built to convert customers into{" "}
                      <span style={{ color: TBL_OXFORD_BLACK, fontWeight: 600 }}>customers for life</span> with in-moment experiences designed and optimized for scale,{" "}
                      <span style={{ color: TBL_RED, fontWeight: 600, fontStyle: "italic" }}>in real-time</span>. We enable brands to create truly{" "}
                      <span style={{ color: TBL_RED, fontWeight: 600, fontStyle: "italic" }}>cross-channel experiences</span>, transcending boundaries between channels, journeys and outcomes &mdash; providing businesses with the insights they need to truly understand their customers and deliver.
                    </p>

                    <a
                      href="https://www.clevertap.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tbl-ct-link tbl-sp-cta"
                      style={{
                        fontFamily: FONT,
                        fontSize: 14,
                        fontWeight: 700,
                        color: TBL_WHITE,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 9,
                        padding: "13px 28px",
                        borderRadius: 50,
                        background: `linear-gradient(135deg, ${TBL_RED} 0%, #dc2626 100%)`,
                        boxShadow: "0 12px 32px rgba(239,68,68,0.40), 0 2px 8px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.28)",
                        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                        opacity: 0,
                        position: "relative",
                        overflow: "hidden",
                        letterSpacing: "0.3px",
                      }}
                    >
                      Visit clevertap.com <span>&rarr;</span>
                    </a>
                  </div>
                </div>

                {/* Bottom inner shadow */}
                <div style={{ position: "absolute", bottom: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,13,38,0.10), transparent)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tbl-ct-link::before {
          content: ''; position: absolute; top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
          transform: skewX(-18deg);
          transition: left 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .tbl-ct-link:hover::before { left: 130%; }
        .tbl-ct-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 46px rgba(239,68,68,0.55), 0 2px 8px rgba(239,68,68,0.32), inset 0 1px 0 rgba(255,255,255,0.32) !important;
        }
        @media (max-width: 880px) {
          .tbl-sp-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .tbl-sp-divider { display: none !important; }
          .tbl-sp-left { padding-right: 0 !important; align-items: center !important; text-align: center; }
          .tbl-sp-left svg { left: 50% !important; transform: translate(-50%, -50%) !important; }
          .tbl-sp-right { align-items: center !important; text-align: center !important; }
          .tbl-sp-body { text-align: center !important; }
          .tbl-sp-underline { transform-origin: center !important; }
        }
      `}</style>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function BigLeapFooter() {
  return (
    <footer
      style={{
        background: TBL_OXFORD_BLACK,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "18px 0 14px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 12,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={TBL_LOGO}
            alt="The Big Leap"
            loading="lazy"
            style={{ height: 80, width: "auto" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CT_LOGO}
            alt="CleverTap"
            loading="lazy"
            style={{ height: 28, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.85 }}
          />
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 18 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: TBL_SLATE, margin: 0 }}>
            &copy; {new Date().getFullYear()} CleverTap. All rights reserved.
          </p>
          <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: TBL_SLATE, margin: 0 }}>
            Produced by{" "}
            <a
              href="https://eventsfirstgroup.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: TBL_RED, textDecoration: "none", fontWeight: 700 }}
            >
              Events First Group
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function BigLeapNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#overview", label: "About" },
    { href: "#agenda", label: "Agenda" },
    { href: "#register", label: "Register" },
  ];

  const onLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "20px clamp(28px, 5vw, 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(0,13,38,0.92)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        boxShadow: scrolled ? "0 6px 24px rgba(0,0,0,0.25)" : "none",
        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Left: CleverTap logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CT_LOGO}
        alt="CleverTap"
        width={140}
        height={42}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ height: 52, width: "auto", cursor: "pointer", filter: "brightness(0) invert(1)" }}
      />

      {/* Right: links + CleverTap mark + CTA */}
      <div className="tbl-nav-right" style={{ display: "flex", alignItems: "center", gap: 26 }}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => onLink(e, link.href)}
            className="tbl-nav-link"
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.2px",
              color: "rgba(255,255,255,0.78)",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
          >
            {link.label}
          </a>
        ))}

        <a
          href="#register"
          onClick={(e) => onLink(e, "#register")}
          className="tbl-nav-cta"
          style={{
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 700,
            color: TBL_WHITE,
            background: TBL_RED,
            padding: "10px 22px",
            borderRadius: 50,
            textDecoration: "none",
            boxShadow: "0 6px 18px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
            transition: "all 0.3s",
          }}
        >
          Request Your Invitation
        </a>
      </div>

      <style>{`
        .tbl-nav-link:hover { color: #fff !important; }
        .tbl-nav-cta:hover { background: #dc2626 !important; transform: translateY(-1px); }
        @media (max-width: 860px) {
          .tbl-nav-right .tbl-nav-link { display: none; }
        }
        @media (max-width: 600px) {
          .tbl-nav-right > div { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function BigLeapPage() {
  return (
    <div
      style={{
        background: TBL_SALT,
        fontFamily: FONT,
        overflowX: "hidden",
      }}
    >
      <BigLeapNav />
      <HeroSection />
      {/* ═══ Shared dark background wrapper for About / What's in Store / Agenda — one continuous canvas ═══ */}
      <div
        style={{
          position: "relative",
          background: TBL_OXFORD_BLACK,
          overflow: "hidden",
        }}
      >
        {/* Single continuous abstract background — Brand §20: freeform gradients + circles + fluid shapes */}
        <svg
          aria-hidden
          viewBox="0 0 1440 2700"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
        >
          <defs>
            <radialGradient id="tbl-shared-red" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.42" />
              <stop offset="40%" stopColor="#EF4444" stopOpacity="0.13" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="tbl-shared-deep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1B263D" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#1B263D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* === FREEFORM GRADIENT — alternating oxford → red wash spanning all 3 sections === */}
          {/* Section 1 — About */}
          <ellipse cx="220" cy="200" rx="640" ry="500" fill="url(#tbl-shared-red)" />
          <ellipse cx="1240" cy="780" rx="560" ry="440" fill="url(#tbl-shared-red)" />
          <ellipse cx="720" cy="450" rx="800" ry="520" fill="url(#tbl-shared-deep)" />
          {/* Section 2 — What's in Store */}
          <ellipse cx="1200" cy="1100" rx="640" ry="500" fill="url(#tbl-shared-red)" />
          <ellipse cx="220" cy="1700" rx="520" ry="420" fill="url(#tbl-shared-red)" />
          <ellipse cx="720" cy="1400" rx="800" ry="500" fill="url(#tbl-shared-deep)" />
          {/* Section 3 — Agenda */}
          <ellipse cx="1280" cy="2050" rx="640" ry="500" fill="url(#tbl-shared-red)" />
          <ellipse cx="180" cy="2520" rx="540" ry="430" fill="url(#tbl-shared-red)" />
          <ellipse cx="720" cy="2300" rx="800" ry="500" fill="url(#tbl-shared-deep)" />

          {/* === FLUID SHAPES — flowing wave forms running across the entire canvas === */}
          <path d="M -50 320 C 240 260, 460 380, 760 320 S 1180 280, 1500 340" stroke="rgba(239,68,68,0.28)" strokeWidth="1.2" fill="none" />
          <path d="M -50 360 C 260 300, 480 420, 780 360 S 1200 320, 1500 380" stroke="rgba(255,255,255,0.10)" strokeWidth="1" fill="none" />
          <path d="M -50 920 C 200 860, 400 980, 700 920 S 1100 880, 1500 940" stroke="rgba(239,68,68,0.22)" strokeWidth="1.2" fill="none" />
          <path d="M -50 960 C 220 900, 420 1020, 720 960 S 1140 920, 1500 980" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
          <path d="M -50 1520 C 240 1460, 460 1580, 760 1520 S 1180 1480, 1500 1540" stroke="rgba(239,68,68,0.24)" strokeWidth="1.2" fill="none" />
          <path d="M -50 1560 C 260 1500, 480 1620, 780 1560 S 1200 1520, 1500 1580" stroke="rgba(255,255,255,0.09)" strokeWidth="1" fill="none" />
          <path d="M -50 2120 C 200 2060, 400 2180, 700 2120 S 1100 2080, 1500 2140" stroke="rgba(239,68,68,0.20)" strokeWidth="1.2" fill="none" />
          <path d="M -50 2160 C 220 2100, 420 2220, 720 2160 S 1140 2120, 1500 2180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />

          {/* === CIRCLES — concentric constellations distributed across all 3 sections === */}
          <g>
            <circle cx="1280" cy="200" r="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
            <circle cx="1280" cy="200" r="124" stroke="rgba(239,68,68,0.22)" strokeWidth="1" fill="none" />
            <circle cx="1280" cy="200" r="92" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
            <circle cx="1280" cy="200" r="62" stroke="rgba(239,68,68,0.30)" strokeWidth="1" fill="none" />
            <circle cx="1280" cy="200" r="34" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
          </g>
          <g>
            <circle cx="160" cy="1080" r="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
            <circle cx="160" cy="1080" r="108" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
            <circle cx="160" cy="1080" r="78" stroke="rgba(239,68,68,0.22)" strokeWidth="1" fill="none" />
            <circle cx="160" cy="1080" r="50" stroke="rgba(255,255,255,0.10)" strokeWidth="1" fill="none" />
            <circle cx="160" cy="1080" r="26" stroke="rgba(239,68,68,0.30)" strokeWidth="1" fill="none" />
          </g>
          <g>
            <circle cx="1290" cy="1620" r="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
            <circle cx="1290" cy="1620" r="124" stroke="rgba(239,68,68,0.18)" strokeWidth="1" fill="none" />
            <circle cx="1290" cy="1620" r="92" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
            <circle cx="1290" cy="1620" r="62" stroke="rgba(239,68,68,0.26)" strokeWidth="1" fill="none" />
            <circle cx="1290" cy="1620" r="34" stroke="rgba(255,255,255,0.10)" strokeWidth="1" fill="none" />
          </g>
          <g>
            <circle cx="160" cy="2360" r="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
            <circle cx="160" cy="2360" r="108" stroke="rgba(239,68,68,0.18)" strokeWidth="1" fill="none" />
            <circle cx="160" cy="2360" r="78" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
            <circle cx="160" cy="2360" r="50" stroke="rgba(239,68,68,0.28)" strokeWidth="1" fill="none" />
            <circle cx="160" cy="2360" r="26" stroke="rgba(255,255,255,0.10)" strokeWidth="1" fill="none" />
          </g>
        </svg>

        {/* === PIXELS — single pixel grid spanning all 3 sections === */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            pointerEvents: "none",
            zIndex: 2,
            maskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,0,0,0.5), transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,0,0,0.5), transparent 85%)",
          }}
        />

        {/* Top + bottom edge highlights — wrap-level only */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)", zIndex: 5 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", zIndex: 5 }} />

        <div style={{ position: "relative", zIndex: 10 }}>
          <OverviewSection />
          <WhatToExpectSection />
          <AgendaSection />
        </div>
      </div>
      <AboutSponsorSection />
      <BigLeapFooter />
    </div>
  );
}
