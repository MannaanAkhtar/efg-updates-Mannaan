"use client";

// ─────────────────────────────────────────────────────────────────────────────
// /oracle — Oracle AI showcase page, HOSTED BY Events First Group.
// Oracle "Redwood" visual language (warm neutrals + Oracle red). Body copy is
// lorem ipsum placeholder; section headings are indicative only.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, type CSSProperties } from "react";

// ─── Oracle Redwood tokens ────────────────────────────────────────────────────
const RED = "#C74634";       // Oracle red
const RED_DARK = "#A5372A";  // pressed / gradient stop
const INK = "#161513";       // redwood near-black text
const INK_SOFT = "#3A3733";
const DEEP = "#053242";      // deep-teal dark section background
const MUTE = "#5C5A57";       // secondary text
const LINE = "#E4E1DE";       // hairline border
const WARM2 = "#EFECE8";      // deeper warm section background
const SANS = `"Oracle Sans", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`;
const DISPLAY = `var(--font-oracle-display), "Arial Narrow", "Helvetica Neue", sans-serif`; // condensed heavy headings
const MONO = `"SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace`;

const REG_INPUT: CSSProperties = { width: "100%", padding: "13px 15px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.04)", color: "#fff", fontFamily: "inherit", fontSize: 14.5, outline: "none" };

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.";

// ── Oracle wordmark ───────────────────────────────────────────────────────────
const ORACLE_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/oracle-seeklogo.png";
function OracleMark({ size = 26 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={ORACLE_LOGO} alt="Oracle" style={{ height: size * 0.72, width: "auto", display: "block", userSelect: "none" }} />
  );
}

// ── Numbered section eyebrow: 01 / LABEL … right-meta + hairline ──────────────
function SectionEyebrow({ n, label, meta, dark }: { n: string; label: string; meta?: string; dark?: boolean }) {
  const numColor = dark ? "rgba(255,255,255,0.16)" : "rgba(22,21,19,0.14)";
  const metaColor = dark ? "rgba(255,255,255,0.4)" : "rgba(92,90,87,0.75)";
  const rule = dark ? "rgba(255,255,255,0.14)" : "rgba(22,21,19,0.12)";
  return (
    <div style={{ marginBottom: "clamp(22px,3vw,36px)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px,4vw,46px)", color: numColor, lineHeight: 0.9 }}>{n}</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: RED }}>{label}</span>
        </div>
        {meta && <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: metaColor }}>{meta}</span>}
      </div>
      <div style={{ height: 1, background: rule, marginTop: 16 }} />
    </div>
  );
}

// ── Two-tone condensed heading: ink line + muted line ─────────────────────────
function DisplayHeading({ dark, black, grey }: { dark?: boolean; black: string; grey?: string }) {
  return (
    <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(34px,5vw,60px)", lineHeight: 0.98, letterSpacing: "-0.01em", margin: 0 }}>
      <span style={{ color: dark ? "#fff" : INK }}>{black}</span>
      {grey && <><br /><span style={{ color: dark ? "rgba(255,255,255,0.42)" : "#B4AFA9" }}>{grey}</span></>}
    </h2>
  );
}

// ── Image slot: stock/real image with an optional caption overlay ─────────────
function ImageSlot({ caption, minH = 300, src, alt }: { caption?: string; minH?: number; src: string; alt: string }) {
  return (
    <div style={{ position: "relative", borderRadius: 14, border: `1px solid ${LINE}`, background: "#EDEAE5", minHeight: minH, overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {caption && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "44px 24px 20px", background: "linear-gradient(180deg, transparent, rgba(6,25,32,0.85))", color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(17px,2vw,22px)", letterSpacing: "-0.01em" }}>{caption}</div>
      )}
    </div>
  );
}

const VIDEO_ID = "w_0HevL_PCo";       // preview section
const HERO_VIDEO_ID = "H-C5dH3w1Dg";  // hero

// Click-to-play YouTube preview: shows the thumbnail + play button, loads the
// (privacy-enhanced) player only after the user clicks.
function VideoPreview({ id = VIDEO_ID }: { id?: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden", background: DEEP, boxShadow: "0 40px 80px -44px rgba(5,50,66,0.5)", border: `1px solid ${LINE}` }}>
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title="Oracle video"
          allow="accelerated-motion; autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          aria-label="Play video"
          className="video-btn"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", padding: 0, cursor: "pointer", background: "none" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
            alt="Watch the Oracle AI video"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(22,21,19,0.05), rgba(22,21,19,0.45))" }} />
          <span aria-hidden className="video-play" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 84, height: 84, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px -14px rgba(199,70,52,0.7)", transition: "transform 0.25s, background 0.25s" }}>
            <span style={{ display: "block", width: 0, height: 0, borderStyle: "solid", borderWidth: "13px 0 13px 22px", borderColor: "transparent transparent transparent #fff", marginLeft: 5 }} />
          </span>
        </button>
      )}
    </div>
  );
}

const NAV = [
  { label: "Overview", id: "top" },
  { label: "Generative AI", id: "genai" },
  { label: "AI Agents", id: "agents" },
  { label: "AI Services", id: "services" },
  { label: "Register", id: "register" },
];

// 01 · AI across the stack — three cards under the hero row
const STACK_CARDS = [
  { title: "AI Infrastructure", d: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod." },
  { title: "Generative AI Services", d: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
  { title: "AI in Applications", d: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum." },
];

// 02 · Generative AI — capability pills
const GENAI_TAGS = ["Text generation", "Summarisation", "Embeddings", "RAG", "Vector search", "Fine-tuning"];

// 03 · AI Agents — four cards, last one accented red
const AGENTS = [
  { n: "01", dept: "Sales", title: "Lorem ipsum agent", d: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt." },
  { n: "02", dept: "Finance", title: "Dolor sit agent", d: "Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
  { n: "03", dept: "HR", title: "Amet elit agent", d: "Duis aute irure dolor in reprehenderit in voluptate velit." },
  { n: "04", dept: "Supply Chain", title: "Tempor agent", d: "Excepteur sint occaecat cupidatat non proident sunt in culpa.", featured: true },
];

// Hero stat row
const HERO_STATS = [
  { n: "150", suf: "+", l: "Lorem services" },
  { n: "50", suf: "+", l: "Ipsum agents" },
  { n: "99.95", suf: "%", l: "Dolor uptime" },
  { n: "24", suf: "7", l: "Sit amet support" },
];

// 04 · AI Services — pretrained services grid
const SERVICES = [
  { title: "Language", ep: "ai.language", d: "Lorem ipsum dolor sit amet, consectetur elit." },
  { title: "Speech", ep: "ai.speech", d: "Consectetur adipiscing elit sed do eiusmod." },
  { title: "Vision", ep: "ai.vision", d: "Sed do eiusmod tempor incididunt labore.", featured: true },
  { title: "Document Understanding", ep: "ai.documents", d: "Ut labore et dolore magna aliqua enim." },
  { title: "Anomaly Detection", ep: "ai.anomaly", d: "Quis nostrud exercitation ullamco laboris." },
  { title: "Forecasting", ep: "ai.forecast", d: "Duis aute irure dolor in voluptate velit." },
];

export default function OraclePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reg, setReg] = useState({ name: "", email: "", company: "" });
  const [regDone, setRegDone] = useState(false);
  const regValid = reg.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email) && reg.company.trim();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main style={{ background: "#fff", color: INK, fontFamily: SANS, minHeight: "100vh", overflowX: "hidden" }}>
      {/* ── Oracle nav (fixed) ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.98)", backdropFilter: "saturate(180%) blur(12px)", WebkitBackdropFilter: "saturate(180%) blur(12px)", borderBottom: `1px solid ${scrolled ? LINE : "rgba(228,225,222,0.6)"}`, boxShadow: scrolled ? "0 8px 24px -18px rgba(22,21,19,0.5)" : "none", transition: "border-color 0.3s, box-shadow 0.3s" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)", height: 62, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 20 }}>
          <a href="#top" aria-label="Oracle" style={{ justifySelf: "start", display: "inline-flex", alignItems: "center", lineHeight: 0 }}>
            <OracleMark size={30} />
          </a>
          <div className="nav-links" style={{ justifySelf: "center", display: "flex", alignItems: "center", gap: 26 }}>
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} style={{ display: "inline-flex", alignItems: "center", fontSize: 14, lineHeight: 1, color: INK_SOFT, textDecoration: "none", fontWeight: 400 }} className="navlink">{n.label}</a>
            ))}
          </div>
          <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 14 }}>
            <a href="#register" className="nav-cta" style={{ display: "inline-flex", alignItems: "center", fontSize: 14, lineHeight: 1, fontWeight: 600, color: "#fff", background: RED, padding: "11px 18px", borderRadius: 4, textDecoration: "none" }}>Get started</a>
            <button aria-label="Menu" onClick={() => setMenuOpen((v) => !v)} className="nav-burger" style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
              <span style={{ display: "block", width: 22, height: 2, background: INK, boxShadow: `0 6px 0 ${INK}, 0 -6px 0 ${INK}` }} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-menu" style={{ borderTop: `1px solid ${LINE}`, background: "#fff", padding: "10px clamp(16px,4vw,40px) 18px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} style={{ fontSize: 15, color: INK_SOFT, textDecoration: "none", padding: "10px 0", borderBottom: `1px solid ${LINE}` }}>{n.label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <header id="top" style={{ position: "relative", background: "linear-gradient(155deg, #FCF6EC 0%, #F8EFDF 52%, #F4E8D3 100%)", overflow: "hidden", borderBottom: `1px solid ${LINE}` }}>
        {/* large soft tan blob — top-right, depth layer */}
        <div aria-hidden style={{ position: "absolute", top: -150, right: -110, width: 620, height: 460, borderRadius: "58% 42% 48% 52% / 60% 50% 50% 40%", background: "linear-gradient(150deg, #EEDCBE, #E1CBA4)", transform: "rotate(8deg)", filter: "blur(6px)", opacity: 0.9, pointerEvents: "none" }} />
        {/* coral blob — top-right, front */}
        <div aria-hidden style={{ position: "absolute", top: -70, right: 30, width: 430, height: 300, borderRadius: "60% 40% 52% 48% / 62% 48% 52% 38%", background: "linear-gradient(140deg, #EF7259 0%, #DB4C34 100%)", transform: "rotate(-13deg)", filter: "blur(1px)", pointerEvents: "none" }} />
        {/* faint tan blob — bottom-left */}
        <div aria-hidden style={{ position: "absolute", bottom: -190, left: -150, width: 560, height: 460, borderRadius: "52% 48% 55% 45% / 55% 52% 48% 45%", background: "linear-gradient(150deg, #F0E3CC, #E6D4B2)", filter: "blur(8px)", opacity: 0.55, pointerEvents: "none" }} />
        {/* teal whisper — bottom-left, ties to brand dark */}
        <div aria-hidden style={{ position: "absolute", bottom: -260, left: -120, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, ${DEEP}14, transparent 60%)`, pointerEvents: "none" }} />
        {/* dot stipple — clustered top-right, dissolving inward */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(150,108,66,0.42) 1.1px, transparent 1.3px)", backgroundSize: "10px 10px", WebkitMaskImage: "radial-gradient(ellipse 46% 58% at 99% -2%, #000 0%, rgba(0,0,0,0.5) 34%, transparent 62%)", maskImage: "radial-gradient(ellipse 46% 58% at 99% -2%, #000 0%, rgba(0,0,0,0.5) 34%, transparent 62%)" }} />
        {/* dot stipple — clustered bottom-left */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(150,108,66,0.3) 1.1px, transparent 1.3px)", backgroundSize: "11px 11px", WebkitMaskImage: "radial-gradient(ellipse 40% 46% at -2% 102%, #000 0%, transparent 60%)", maskImage: "radial-gradient(ellipse 40% 46% at -2% 102%, #000 0%, transparent 60%)" }} />

        <div className="hero-wrap" style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "calc(62px + clamp(32px,5vw,64px)) clamp(16px,4vw,40px) clamp(36px,4vw,48px)", display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
          <div>
            {/* pill badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 15px 8px 12px", borderRadius: 999, border: `1px solid ${RED}33`, background: `${RED}0d`, marginBottom: 26 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: RED, boxShadow: `0 0 10px ${RED}` }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: RED }}>AI for business, built in</span>
            </div>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(42px,6vw,78px)", lineHeight: 0.96, letterSpacing: "-0.01em", margin: 0, color: INK }}>
              AI where your<br />data already <span style={{ color: RED }}>lives.</span>
            </h1>
            <p style={{ fontSize: "clamp(16px,1.6vw,19px)", lineHeight: 1.62, color: MUTE, margin: "24px 0 34px", maxWidth: 520 }}>
              {LOREM} {LOREM_SHORT}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <a href="#register" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15, fontWeight: 600, color: "#fff", background: RED, padding: "15px 28px", borderRadius: 8, textDecoration: "none", boxShadow: `0 16px 34px -16px ${RED}` }}>Try OCI AI free <span aria-hidden>→</span></a>
              <a href="#genai" className="btn-deep" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15, fontWeight: 600, color: "#fff", background: DEEP, padding: "15px 28px", borderRadius: 8, textDecoration: "none" }}>Explore generative AI</a>
            </div>
          </div>

          {/* hero video, with glow */}
          <div className="hero-visual" style={{ position: "relative" }}>
            <div aria-hidden style={{ position: "absolute", inset: -28, background: `radial-gradient(62% 62% at 30% 80%, ${DEEP}22, transparent 70%)`, filter: "blur(26px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", padding: 6, borderRadius: 18, background: "linear-gradient(160deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))", border: `1px solid ${LINE}`, boxShadow: "0 40px 90px -46px rgba(5,50,66,0.5)" }}>
              <VideoPreview id={HERO_VIDEO_ID} />
            </div>
          </div>
        </div>

        {/* stat row */}
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "0 clamp(16px,4vw,40px) clamp(44px,5vw,72px)" }}>
          <div className="hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(20px,3vw,40px)", paddingTop: "clamp(28px,3vw,36px)", borderTop: `1px solid ${LINE}` }}>
            {HERO_STATS.map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px,4vw,50px)", lineHeight: 0.9, color: INK }}>
                  {s.n}<span style={{ color: RED, fontSize: "0.5em", verticalAlign: "super", fontWeight: 700 }}>{s.suf}</span>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTE, marginTop: 12 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── 01 · AI across the stack ── */}
      <section id="stack" style={{ background: "#FAF8F5" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(38px,4.5vw,64px) clamp(16px,4vw,40px)" }}>
          <SectionEyebrow n="01" label="AI across the stack" />
          <DisplayHeading black="From infrastructure to applications." grey="Lorem ipsum dolor sit amet elit." />

          <div className="stack-hero" style={{ display: "grid", gridTemplateColumns: "1.9fr 1fr", gap: 20, marginTop: "clamp(26px,3vw,40px)", alignItems: "stretch" }}>
            <ImageSlot src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80" alt="Data centre / cloud infrastructure" caption="Lorem ipsum infrastructure, consectetur adipiscing." minH={440} />
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 18, background: `linear-gradient(160deg, ${RED} 0%, ${RED_DARK} 100%)`, color: "#fff", padding: "clamp(26px,2.4vw,32px)", display: "flex", flexDirection: "column", minHeight: 440 }}>
              {/* decorative stipple + glow */}
              <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.2px)", backgroundSize: "12px 12px", WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 100% 0%, #000, transparent 62%)", maskImage: "radial-gradient(ellipse 60% 55% at 100% 0%, #000, transparent 62%)", opacity: 0.18 }} />
              <div aria-hidden style={{ position: "absolute", bottom: -120, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.14), transparent 62%)", pointerEvents: "none" }} />

              <span style={{ position: "relative", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>Embedded AI</span>
              <p style={{ position: "relative", fontSize: 15, lineHeight: 1.55, color: "rgba(255,255,255,0.92)", margin: "14px 0 0", maxWidth: 260 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</p>

              <ul style={{ position: "relative", listStyle: "none", margin: "22px 0 0", padding: 0, display: "flex", flexDirection: "column" }}>
                {["Lorem ipsum dolor", "Consectetur adipiscing", "Sed do eiusmod tempor"].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 0", borderTop: "1px solid rgba(255,255,255,0.16)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.94)" }}>
                    <span aria-hidden style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.16)", fontSize: 11, fontWeight: 800 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div style={{ position: "relative", marginTop: "auto", paddingTop: 24 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(46px,5vw,66px)", lineHeight: 0.9 }}>100<span style={{ fontSize: "0.5em", verticalAlign: "super" }}>+</span></div>
                <p style={{ fontSize: 13.5, letterSpacing: "0.02em", color: "rgba(255,255,255,0.82)", margin: "8px 0 0" }}>Lorem ipsum integrations across the stack</p>
              </div>
            </div>
          </div>

          <div className="stack-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 20 }}>
            {STACK_CARDS.map((c) => (
              <div key={c.title} className="lift-card" style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, padding: "26px 26px 30px", transition: "box-shadow 0.25s, transform 0.25s" }}>
                <div style={{ width: 30, height: 4, background: RED, borderRadius: 2, marginBottom: 20 }} />
                <h3 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.55, color: MUTE, margin: 0 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · Generative AI ── */}
      <section id="genai" style={{ background: WARM2 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(38px,4.5vw,64px) clamp(16px,4vw,40px)" }}>
          <SectionEyebrow n="02" label="Generative AI" meta="Models · RAG · Vector search" />
          <div className="genai-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center", marginTop: "clamp(24px,3vw,40px)" }}>
            <div>
              <DisplayHeading black="Build with the models you choose." />
              <p style={{ fontSize: 16.5, lineHeight: 1.62, color: MUTE, margin: "20px 0 26px", maxWidth: 480 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {GENAI_TAGS.map((t) => (
                  <span key={t} style={{ fontSize: 14, fontWeight: 600, color: INK, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 8, padding: "11px 16px" }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div aria-hidden style={{ position: "absolute", inset: -26, background: `radial-gradient(62% 62% at 70% 30%, ${RED}22, transparent 70%)`, filter: "blur(24px)", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}><VideoPreview id={VIDEO_ID} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · AI Agents ── */}
      <section id="agents" style={{ background: "#FAF8F5" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(38px,4.5vw,64px) clamp(16px,4vw,40px)" }}>
          <SectionEyebrow n="03" label="AI Agents" />
          <DisplayHeading black="Agents that act, not just answer." grey="Lorem ipsum dolor sit amet." />
          <div className="agents-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: "clamp(26px,3vw,40px)" }}>
            {AGENTS.map((a) => {
              const feat = a.featured;
              return (
                <div key={a.n} className="agent-card" style={{ position: "relative", overflow: "hidden", borderRadius: 16, padding: "24px 22px 22px", minHeight: 236, display: "flex", flexDirection: "column", background: feat ? `linear-gradient(162deg, #E1634D 0%, ${RED_DARK} 100%)` : "linear-gradient(165deg, #0A4759 0%, #04252F 100%)", border: feat ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(255,255,255,0.08)", boxShadow: feat ? `0 26px 50px -30px ${RED}` : "0 26px 50px -34px rgba(5,50,66,0.6)", transition: "transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s" }}>
                  {/* big number watermark */}
                  <span aria-hidden style={{ position: "absolute", top: -18, right: 6, fontFamily: DISPLAY, fontWeight: 700, fontSize: 130, lineHeight: 1, color: feat ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.055)", pointerEvents: "none" }}>{a.n}</span>
                  <div style={{ position: "relative", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: feat ? "rgba(255,255,255,0.9)" : "#EE8672", marginBottom: 12 }}>{a.n} · {a.dept}</div>
                  <h3 style={{ position: "relative", fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 10px", color: "#fff" }}>{a.title}</h3>
                  <p style={{ position: "relative", fontSize: 14, lineHeight: 1.55, color: feat ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.62)", margin: 0 }}>{a.d}</p>
                  <div style={{ position: "relative", marginTop: "auto", paddingTop: 16, borderTop: feat ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.12)" }}>
                    <span className="agent-cta" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: feat ? "#fff" : "#EE8672" }}>Deploy agent <span className="agent-arrow" aria-hidden style={{ transition: "transform 0.25s" }}>→</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 04 · AI Services ── */}
      <section id="services" style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #063340 0%, #04262F 100%)", color: "#fff" }}>
        {/* ambient glows */}
        <div aria-hidden style={{ position: "absolute", top: -160, left: "16%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, rgba(120,200,205,0.10), transparent 62%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -220, right: -120, width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, ${RED}1c, transparent 64%)`, pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "clamp(40px,5vw,72px) clamp(16px,4vw,40px)" }}>
          <SectionEyebrow n="04" label="AI Services" meta="Pretrained · Ready to call" dark />

          {/* intro: heading + code card */}
          <div className="svc-intro" style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr", gap: "clamp(32px,5vw,64px)", alignItems: "center", marginTop: "clamp(22px,3vw,32px)" }}>
            <div>
              <DisplayHeading dark black="One API call away." />
              <p style={{ fontSize: 16.5, lineHeight: 1.62, color: "rgba(255,255,255,0.62)", margin: "20px 0 26px", maxWidth: 440 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["REST & gRPC", "SDKs included", "Autoscaling"].map((t) => (
                  <span key={t} style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.82)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "8px 14px" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* code card */}
            <div style={{ borderRadius: 16, overflow: "hidden", background: "#041D25", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px -44px rgba(0,0,0,0.7)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#E86A52" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#E8C15A" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#5FBE8E" }} />
                <span style={{ marginLeft: 8, fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>request.sh</span>
              </div>
              <pre style={{ margin: 0, padding: "20px 20px 22px", fontFamily: MONO, fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", overflowX: "auto", whiteSpace: "pre" }}>
<span style={{ color: "#8FD0C4" }}>curl</span> https://api.oracle.ai/v1/<span style={{ color: "#E88C5A" }}>vision</span> {"\\"}
{"  "}<span style={{ color: "rgba(255,255,255,0.5)" }}>-H</span> <span style={{ color: "#E8B98A" }}>{'"Authorization: Bearer •••"'}</span> {"\\"}
{"  "}<span style={{ color: "rgba(255,255,255,0.5)" }}>-d</span> <span style={{ color: "#E8B98A" }}>{"'{ \"image\": \"https://…\" }'"}</span>
{"\n"}
<span style={{ color: "#5FBE8E" }}>→ 200 OK</span> <span style={{ color: "rgba(255,255,255,0.4)" }}>· 142ms · oci.ai.vision</span>
              </pre>
            </div>
          </div>

          {/* services grid */}
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: "clamp(28px,3.5vw,44px)" }}>
            {SERVICES.map((s) => (
              <div key={s.title} className="svc-card" style={{ position: "relative", borderRadius: 14, padding: "22px 22px 24px", background: "rgba(255,255,255,0.035)", border: s.featured ? `1px solid ${RED}7a` : "1px solid rgba(255,255,255,0.1)", transition: "border-color 0.25s, background 0.25s, transform 0.25s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: s.featured ? "#EE8C74" : "#8FD0C4", letterSpacing: "0.01em" }}>{s.ep}</span>
                  {s.featured && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: RED, borderRadius: 999, padding: "3px 9px" }}>Popular</span>}
                </div>
                <h3 style={{ fontSize: 17.5, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 8px", color: "#fff" }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.6)", margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Register ── */}
      <section id="register" style={{ background: "#FAF8F5" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(40px,5vw,72px) clamp(16px,4vw,40px)" }}>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, background: DEEP, color: "#fff", padding: "clamp(32px,5vw,64px)" }}>
            <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${RED}44, transparent 62%)`, pointerEvents: "none" }} />
            <div className="cta-grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,5vw,64px)", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#EE8672" }}>Register</span>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px,4.4vw,54px)", lineHeight: 0.98, letterSpacing: "-0.01em", margin: "14px 0 0" }}>
                  <span style={{ color: "#fff" }}>Start building with Oracle AI.</span><br />
                  <span style={{ color: "rgba(255,255,255,0.42)" }}>Lorem ipsum dolor sit.</span>
                </h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "rgba(255,255,255,0.68)", margin: "18px 0 0", maxWidth: 440 }}>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
              </div>

              {/* register form */}
              <div style={{ borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", padding: "clamp(22px,2.4vw,30px)" }}>
                {regDone ? (
                  <div style={{ textAlign: "center", padding: "24px 8px" }}>
                    <div style={{ width: 52, height: 52, margin: "0 auto 16px", borderRadius: "50%", background: "rgba(95,190,142,0.16)", border: "1px solid rgba(95,190,142,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7FD3A3", fontSize: 24 }}>✓</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#fff" }}>You&rsquo;re registered</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", margin: 0 }}>Thanks, {reg.name.split(" ")[0] || "there"} — we&rsquo;ll be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); if (regValid) setRegDone(true); }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: "#fff" }}>Register now</h3>
                    <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", margin: "0 0 18px" }}>Takes less than a minute.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <input value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} placeholder="Full name" className="reg-input" style={REG_INPUT} />
                      <input value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} placeholder="Work email" type="email" className="reg-input" style={REG_INPUT} />
                      <input value={reg.company} onChange={(e) => setReg({ ...reg, company: e.target.value })} placeholder="Company" className="reg-input" style={REG_INPUT} />
                    </div>
                    <button type="submit" disabled={!regValid} className="reg-btn" style={{ width: "100%", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "15px 24px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 700, color: "#fff", background: RED, cursor: regValid ? "pointer" : "not-allowed", opacity: regValid ? 1 : 0.5, transition: "background 0.2s, opacity 0.2s" }}>Register now <span aria-hidden>→</span></button>
                    <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", margin: "12px 0 0", textAlign: "center" }}>By registering you agree to the terms.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer (boardroom pattern: brand logo + "Produced by EFG") ── */}
      <footer style={{ background: DEEP, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="foot-row" style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(40px,5vw,64px) clamp(16px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <OracleMark size={30} />
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.42)", margin: 0, display: "inline-flex", alignItems: "center", gap: 10 }}>
            Produced by
            <a href="https://www.eventsfirstgroup.com" target="_blank" rel="noopener noreferrer" aria-label="Events First Group" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/events-first-group_logo_alt.svg" alt="Events First Group" style={{ height: 34, width: "auto", opacity: 0.85 }} />
            </a>
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .navlink:hover { color: ${RED}; }
        .nav-cta:hover, .btn-primary:hover { background: ${RED_DARK}; }
        .btn-deep:hover { background: #0A4256; }
        .video-btn:hover .video-play { transform: translate(-50%,-50%) scale(1.08); background: ${RED_DARK}; }
        .lift-card:hover { box-shadow: 0 24px 48px -30px rgba(22,21,19,0.28); transform: translateY(-3px); }
        .agent-card:hover { transform: translateY(-5px); box-shadow: 0 34px 60px -30px rgba(5,50,66,0.72); }
        .agent-card:hover .agent-arrow { transform: translateX(4px); }
        .svc-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.24) !important; background: rgba(255,255,255,0.06) !important; }
        .reg-input::placeholder { color: rgba(255,255,255,0.42); }
        .reg-input:focus { border-color: ${RED}; background: rgba(255,255,255,0.06); }
        .reg-btn:not(:disabled):hover { background: ${RED_DARK}; }
        @media (max-width: 1000px) {
          .stack-hero { grid-template-columns: 1fr !important; }
          .stack-cards, .services-grid { grid-template-columns: repeat(2,1fr) !important; }
          .agents-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 860px) {
          .hero-wrap, .genai-grid, .cta-grid, .svc-intro { grid-template-columns: 1fr !important; }
          .hero-visual { order: -1; }
          .nav-links { display: none !important; }
          .nav-burger { display: inline-flex !important; }
        }
        @media (max-width: 640px) {
          .hero-stats { grid-template-columns: repeat(2,1fr) !important; row-gap: 26px !important; }
        }
        @media (max-width: 560px) {
          .stack-cards, .services-grid, .agents-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
