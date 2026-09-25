"use client";

// ─────────────────────────────────────────────────────────────────────────────
// /oracle — "Oracle AI: Powering the Intelligent Enterprise", 14 Oct 2026,
// JW Marriott Hotel Riyadh.
//
// A faithful rebuild of Oracle's own event listing
// (eventreg.oracle.com/profile/web/index.cfm?PKwebID=0x984828abcd): Oracle
// Redwood palette, serif event title, sticky "Jump to" rail, countdown bar and
// timed agenda. Copy is Oracle's, verbatim.
//
// What Oracle's page does NOT have, and we add: a working registration form in
// the "Reserve Your Place" section, posting through the shared submitForm
// helper so entries land in Supabase with the rest of EFG's form traffic.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { submitForm, isWorkEmail, validatePhone, COUNTRY_CODES, type CountryCode } from "@/lib/form-helpers";

// ─── Redwood tokens ──────────────────────────────────────────────────────────
const RED = "#C74634";        // Oracle red
const BAR = "#312D2A";        // top bar / primary button
const INK = "#161513";        // headings
const BODY = "#3A3632";       // body copy
const MUTE = "#5C5A57";
const LINK = "#0572CE";       // Oracle link blue
const GREEN = "#3A7D33";      // active rail marker
const HERO_BG = "#F1F0EE";
const PAGE_BG = "#FBFAF9";
const LINE = "#E0DDD9";

const SANS = `"Oracle Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
const SERIF = `var(--font-oracle-serif), Georgia, "Times New Roman", serif`;

const EVENT_NAME = "Oracle AI: Powering the Intelligent Enterprise";
const EVENT_START = new Date("2026-10-14T10:00:00+03:00");
const VENUE_MAPS = "https://maps.google.com/?q=JW+Marriott+Hotel+Riyadh+King+Fahd+Rd+Sahafah+District+Riyadh";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "agenda", label: "Agenda" },
  { id: "reserve", label: "Reserve Your Place" },
];

// ─── Oracle wordmark ─────────────────────────────────────────────────────────
// The red wordmark on transparent, so it sits on the dark bar as-is.
const ORACLE_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/oracle-seeklogo.png";
function OracleMark({ height = 24 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={ORACLE_LOGO} alt="Oracle" style={{ height, width: "auto", display: "block" }} />
  );
}

// ─── Hero artwork ────────────────────────────────────────────────────────────
// Oracle's Redwood key art: overlapping sage and red fields, a thin gold arc and
// a drift of hatch marks. Drawn inline so the hero carries no image weight.
function RedwoodArt() {
  const hatch: React.ReactNode[] = [];
  for (let row = 0; row < 7; row++) {
    for (let i = 0; i < 16; i++) {
      const x = 40 + i * 26 + row * 9;
      const y = 40 + row * 22 + Math.sin(i * 0.7) * 7;
      hatch.push(
        <line
          key={`${row}-${i}`}
          x1={x}
          y1={y}
          x2={x + 17}
          y2={y - 4}
          stroke="#7E9A92"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.5}
        />,
      );
    }
  }
  return (
    <svg viewBox="0 0 620 520" preserveAspectRatio="xMidYMid slice" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width="620" height="520" fill={HERO_BG} />
      <g clipPath="url(#ora-clip)">
        <clipPath id="ora-clip"><rect width="620" height="520" /></clipPath>
        {hatch}
        <circle cx="520" cy="250" r="270" fill="#4E6B62" />
        <circle cx="330" cy="500" r="230" fill="#B24A3C" />
        <path d="M330 270 A230 230 0 0 1 560 500 L560 500 A270 270 0 0 1 330 270 Z" fill="#6B3A33" opacity="0.9" />
        <path d="M600 180 C500 300 470 420 500 520" fill="none" stroke="#E8A33D" strokeWidth="3" />
      </g>
    </svg>
  );
}

// ─── Countdown ───────────────────────────────────────────────────────────────
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Countdown() {
  // null until mounted: the server has no clock the client agrees with, and a
  // mismatched first paint would hydrate-warn.
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, EVENT_START.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const s = Math.floor((left ?? 0) / 1000);
  const parts = [
    { v: Math.floor(s / 86400), label: "days" },
    { v: Math.floor((s % 86400) / 3600), label: "hrs" },
    { v: Math.floor((s % 3600) / 60), label: "mins" },
    { v: s % 60, label: "Seconds" },
  ];

  return (
    <div className="ora-countdown">
      <a href="#reserve" className="ora-btn">Register for event</a>
      <div className="ora-cd-right">
        <span className="ora-cd-label">This event begins in</span>
        <div className="ora-cd-digits" aria-live="off">
          {parts.map((p, i) => (
            <div key={p.label} style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ textAlign: "center", minWidth: 52 }}>
                <div className="ora-cd-num">{left === null ? "--" : pad(p.v)}</div>
                <div className="ora-cd-unit">{p.label}</div>
              </div>
              {i < parts.length - 1 && <span className="ora-cd-sep">:</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Agenda ──────────────────────────────────────────────────────────────────
const AGENDA: { time: string; title: string; desc?: string }[] = [
  { time: "10:00 AM–10:30 AM", title: "Arrival, Registration and Executive Networking" },
  { time: "10:30 AM–10:40 AM", title: "Opening Remarks and Welcome by Oracle" },
  {
    time: "10:40 AM–11:10 AM",
    title: "AI Inspiration Talk: Leading in an AI-First World",
    desc: "A thought-provoking session with a leading AI speaker exploring the trends, opportunities, and leadership priorities shaping the future of business.",
  },
  {
    time: "11:10 AM–11:45 AM",
    title: "Oracle Executive Keynote: Turning AI Vision into Enterprise Value",
    desc: "Discover how Oracle's integrated AI capabilities can help organizations move from experimentation to adoption and measurable business outcomes.",
  },
  { time: "11:45 AM–12:00 PM", title: "Coffee Break and Networking" },
  {
    time: "12:00 PM–12:30 PM",
    title: "Customer Conversation: Real-World AI, Real Business Impact",
    desc: "Hear customers share their experiences, practical lessons, and perspectives on creating value through enterprise AI.",
  },
  {
    time: "12:30 PM–1:10 PM",
    title: "Oracle AI in Action: Innovation Showcase and Live Demonstrations",
    desc: "Experience practical AI use cases across Oracle applications, data platforms, and cloud infrastructure.",
  },
  { time: "1:10 PM–1:15 PM", title: "Closing Remarks and Key Takeaways" },
  { time: "1:15 PM–2:00 PM", title: "Lunch and Executive Networking" },
];

const WHY_ATTEND = [
  "Accelerate innovation and sustainable growth",
  "Increase productivity through AI-powered automation",
  "Make faster, better-informed decisions with intelligent insights",
  "Transform enterprise data into actionable business value",
  "Build and deploy trusted AI with robust security and governance",
];

// ─── Registration form ───────────────────────────────────────────────────────
const inputStyle: CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: 4,
  border: `1px solid #C9C5C0`,
  background: "#fff",
  color: INK,
  fontFamily: "inherit",
  fontSize: 15,
  outline: "none",
};

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string | null }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: BODY, marginBottom: 6 }}>{label}</span>
      {children}
      {error && <span style={{ display: "block", fontSize: 12.5, color: RED, marginTop: 5 }}>{error}</span>}
    </label>
  );
}

function RegisterForm() {
  const [form, setForm] = useState({ full_name: "", email: "", company: "", job_title: "", phone: "" });
  const [country, setCountry] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "SA") ?? COUNTRY_CODES[0],
  );
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isWorkEmail(form.email)) {
      setEmailError("Please use your work email address");
      return;
    }
    setEmailError(null);

    // Required, and must be exactly the dialling code's digit count.
    const phoneMsg = validatePhone(form.phone, country);
    if (phoneMsg) {
      setPhoneError(phoneMsg);
      return;
    }
    setPhoneError(null);

    setBusy(true);
    const result = await submitForm({
      type: "attend",
      full_name: form.full_name,
      email: form.email,
      company: form.company,
      job_title: form.job_title,
      // Separators stripped, code prefixed — the shape the rest of EFG's forms send.
      phone: `${country.code}${form.phone.replace(/[\s\-()]/g, "")}`,
      event_name: EVENT_NAME,
    });
    setBusy(false);

    if (result.success) setDone(true);
    else setError(result.error ?? "Something went wrong. Please try again.");
  };

  if (done) {
    return (
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 6, background: "#fff", padding: "34px 30px" }}>
        <h3 style={{ fontFamily: SANS, fontSize: 21, fontWeight: 700, color: INK, margin: "0 0 10px" }}>
          Thank you — your registration request is in.
        </h3>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: BODY }}>
          The team will confirm your place by email. We look forward to welcoming you at the JW Marriott Hotel Riyadh
          on 14 October.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ border: `1px solid ${LINE}`, borderRadius: 6, background: "#fff", padding: "28px 26px" }}>
      <div className="ora-form-grid">
        <Field label="Full name">
          <input required value={form.full_name} onChange={set("full_name")} style={inputStyle} autoComplete="name" />
        </Field>
        <Field label="Work email" error={emailError}>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => { set("email")(e); if (emailError) setEmailError(null); }}
            // Flag a personal address as soon as they leave the field rather
            // than making them submit to find out.
            onBlur={(e) => {
              const v = e.currentTarget.value.trim();
              setEmailError(v && !isWorkEmail(v) ? "Please use your work email address" : null);
            }}
            placeholder="you@company.com"
            style={inputStyle}
            autoComplete="email"
          />
        </Field>
        <Field label="Company">
          <input required value={form.company} onChange={set("company")} style={inputStyle} autoComplete="organization" />
        </Field>
        <Field label="Job title">
          <input required value={form.job_title} onChange={set("job_title")} style={inputStyle} autoComplete="organization-title" />
        </Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Phone number" error={phoneError}>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={country.country}
                onChange={(e) => {
                  const next = COUNTRY_CODES.find((c) => c.country === e.target.value);
                  // Changing the country changes the required length, so drop
                  // whatever was typed for the old one rather than leaving a
                  // number that is now silently the wrong length.
                  if (next) { setCountry(next); setForm((f) => ({ ...f, phone: "" })); }
                  setPhoneError(null);
                }}
                aria-label="Country dialling code"
                style={{ ...inputStyle, width: 132, flexShrink: 0, cursor: "pointer" }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.country} value={c.country}>{c.country} {c.code}</option>
                ))}
              </select>
              <input
                required
                type="tel"
                value={form.phone}
                // Digits only, capped at this country's length: the field
                // cannot hold an invalid number in the first place.
                onChange={(e) => {
                  setForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d]/g, "").slice(0, country.length) }));
                  if (phoneError) setPhoneError(null);
                }}
                onBlur={() => setPhoneError(validatePhone(form.phone, country))}
                placeholder={country.placeholder}
                maxLength={country.length}
                inputMode="numeric"
                autoComplete="tel-national"
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          </Field>
        </div>
      </div>

      {/* Honeypot: bots fill it, people never see it. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden style={{ display: "none" }} />

      {error && (
        <p role="alert" style={{ margin: "16px 0 0", fontSize: 14, color: RED }}>{error}</p>
      )}

      <button type="submit" disabled={busy} className="ora-btn" style={{ marginTop: 22, border: "none", cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
        {busy ? "Submitting…" : "Register for event"}
      </button>
      <p style={{ margin: "14px 0 0", fontSize: 12.5, color: MUTE, lineHeight: 1.5 }}>
        Places are confirmed by the event team. We only use your details to respond to this registration.
      </p>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function OraclePage() {
  const [active, setActive] = useState("overview");
  const [shared, setShared] = useState(false);
  const spyRef = useRef<HTMLDivElement>(null);

  // Highlight the rail item for whichever section owns the top of the viewport.
  useEffect(() => {
    const onScroll = () => {
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: EVENT_NAME, url });
      else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      /* dismissed share sheet — nothing to report */
    }
  };

  return (
    <main style={{ background: PAGE_BG, color: BODY, fontFamily: SANS, minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ background: BAR, padding: "17px clamp(20px, 5vw, 56px)" }}>
        <OracleMark />
      </div>

      {/* Hero */}
      <header className="ora-hero">
        <div className="ora-hero-copy">
          <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.12, letterSpacing: "-0.005em", color: INK, margin: "0 0 26px", textWrap: "balance" }}>
            {EVENT_NAME}
          </h1>
          <p style={{ margin: "0 0 20px", fontSize: "clamp(16px, 1.6vw, 18px)", color: BODY }}>
            14 October 2026 | 10:00 AM - 2:00 PM
          </p>
          <p style={{ margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="18" viewBox="0 0 14 18" aria-hidden style={{ flexShrink: 0 }}>
              <path d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 7 4.5a2.5 2.5 0 0 1 0 5z" fill={LINK} />
            </svg>
            <a href={VENUE_MAPS} target="_blank" rel="noopener noreferrer" style={{ color: LINK, fontWeight: 700, fontSize: 17, textDecoration: "none" }}>
              JW Marriott Hotel Riyadh
            </a>
          </p>
          <p style={{ margin: "0 0 34px", fontSize: 16, color: BODY }}>
            King Fahd Rd, Sahafah District Riyadh, 11564 Saudi Arabia
          </p>
          <a href="#reserve" className="ora-btn">Register for event</a>
        </div>
        <div className="ora-hero-art" aria-hidden>
          <RedwoodArt />
        </div>
      </header>

      {/* Body + rail */}
      <div className="ora-shell" ref={spyRef}>
        <div className="ora-main">
          {/* Overview */}
          <section id="overview" style={{ scrollMarginTop: 90 }}>
            <h2 className="ora-h2">Overview</h2>
            <p className="ora-p">
              Join Oracle for an exclusive executive experience exploring how AI is reshaping business and creating new
              opportunities for innovation, productivity, and growth.
            </p>
            <p className="ora-p">
              Discover Oracle&rsquo;s comprehensive AI capabilities&mdash;from generative AI embedded in cloud applications to an
              integrated data platform and enterprise-grade AI infrastructure. Experience the latest innovations through
              live demonstrations, engage with Oracle experts, and hear how organizations are using Oracle AI to improve
              efficiency, accelerate decision-making, and deliver measurable business outcomes.
            </p>

            <h3 className="ora-h3">Why Attend?</h3>
            <p className="ora-p">
              AI is no longer simply an emerging technology&mdash;it has become a strategic business priority. Oracle brings AI
              into the applications, data, and business processes that organizations rely on every day, supported by
              enterprise-grade security, governance, and cloud infrastructure.
            </p>
            <p className="ora-p">Join us to discover how Oracle AI can help your organization:</p>
            <ul className="ora-list">
              {WHY_ATTEND.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="ora-p">
              Connect with business leaders, technology experts, and industry peers while exploring practical approaches
              to turning AI ambition into measurable results.
            </p>
            <p className="ora-p">Please RSVP to confirm your attendance. We look forward to welcoming you.</p>

            <Countdown />
          </section>

          {/* Agenda */}
          <section id="agenda" style={{ scrollMarginTop: 90, marginTop: "clamp(48px, 6vw, 76px)" }}>
            <div className="ora-agenda-head">
              <h2 className="ora-h2" style={{ margin: 0 }}>Agenda</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 15, color: BODY }}>Times shown in</span>
                {/* One-option select: the schedule is published in Riyadh time and
                    there is no second timezone to convert to. */}
                <select aria-label="Times shown in" defaultValue="riyadh" style={{ ...inputStyle, width: "auto", padding: "9px 12px" }}>
                  <option value="riyadh">Asia/Riyadh (+03)</option>
                </select>
              </div>
            </div>
            <div style={{ height: 1, background: LINE, margin: "18px 0 30px" }} />
            <h3 style={{ fontFamily: SANS, fontSize: "clamp(20px, 2.4vw, 25px)", fontWeight: 700, color: INK, margin: "0 0 22px" }}>
              October 14, 2026
            </h3>
            <div>
              {AGENDA.map((row, i) => (
                <div key={row.time} className="ora-agenda-row" style={{ borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}>
                  <div className="ora-agenda-time">{row.time}</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: INK, lineHeight: 1.35 }}>{row.title}</div>
                    {row.desc && <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.6, color: BODY }}>{row.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reserve */}
          <section id="reserve" style={{ scrollMarginTop: 90, marginTop: "clamp(48px, 6vw, 76px)" }}>
            <h2 className="ora-h2">Reserve Your Place</h2>
            <p className="ora-p" style={{ maxWidth: 760 }}>
              Experience how Oracle is helping organizations turn AI possibilities into real business value. Reserve your
              place today and take the next step in your organization&rsquo;s AI transformation journey.
            </p>
            <div style={{ marginTop: 26, maxWidth: 760 }}>
              <RegisterForm />
            </div>
          </section>
        </div>

        {/* Jump-to rail */}
        <aside className="ora-rail">
          <div style={{ position: "sticky", top: 32 }}>
            <h2 style={{ fontFamily: SANS, fontSize: 19, fontWeight: 700, color: INK, margin: "0 0 14px" }}>Jump to</h2>
            <nav>
              {SECTIONS.map((s) => {
                const on = active === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    style={{
                      display: "block",
                      padding: "11px 16px",
                      fontSize: 16,
                      color: LINK,
                      textDecoration: "none",
                      background: on ? "#EFEEEC" : "transparent",
                      borderLeft: `3px solid ${on ? GREEN : LINE}`,
                    }}
                  >
                    {s.label}
                  </a>
                );
              })}
            </nav>
            <button type="button" onClick={share} className="ora-share">
              {shared ? "Link copied" : "Share"}
            </button>
          </div>
        </aside>
      </div>

      {/* Footer — dark, bookending the top bar. Oracle's own footer is light,
          but both EFG wordmarks ship white-on-transparent, so a light ground
          would render the "hosted by" lockup invisible. */}
      <footer style={{ marginTop: "clamp(56px, 7vw, 92px)", padding: "clamp(34px, 4vw, 48px) clamp(20px, 5vw, 56px)", background: BAR, color: "rgba(255,255,255,0.72)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="ora-footer-top">
            <a href="https://www.oracle.com" target="_blank" rel="noopener noreferrer" aria-label="Oracle" style={{ lineHeight: 0 }}>
              <OracleMark height={26} />
            </a>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
                Hosted by
              </span>
              <a href="https://www.eventsfirstgroup.com" target="_blank" rel="noopener noreferrer" aria-label="Events First Group" style={{ lineHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/events-first-group_logo_alt.svg" alt="Events First Group" style={{ height: 28, width: "auto", display: "block" }} />
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* global, not scoped: Countdown and RegisterForm are separate components,
          and styled-jsx only tags the markup of the component that declares the
          block — scoped rules would never reach them. Every class is ora-
          prefixed to keep the global surface unambiguous. */}
      <style jsx global>{`
        .ora-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
          align-items: stretch;
          background: ${HERO_BG};
          min-height: 440px;
        }
        .ora-hero-copy { padding: clamp(40px, 5vw, 70px) clamp(20px, 5vw, 56px); align-self: center; }
        .ora-hero-art { position: relative; min-height: 260px; }

        .ora-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: clamp(28px, 4vw, 64px);
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(36px, 4.5vw, 58px) clamp(20px, 5vw, 56px) 0;
        }
        .ora-main { min-width: 0; max-width: 900px; }

        .ora-h2 {
          font-family: ${SANS};
          font-size: clamp(25px, 3vw, 31px);
          font-weight: 700;
          color: ${INK};
          margin: 0 0 20px;
          letter-spacing: -0.01em;
        }
        .ora-h3 {
          font-family: ${SANS};
          font-size: 18px;
          font-weight: 700;
          color: ${INK};
          margin: 30px 0 14px;
        }
        .ora-p { margin: 0 0 18px; font-size: 16.5px; line-height: 1.65; color: ${BODY}; }
        /* list-style is set explicitly: the global reset strips markers. */
        .ora-list { margin: 0 0 18px; padding-left: 22px; list-style: disc outside; }
        .ora-list li { font-size: 16.5px; line-height: 1.75; color: ${BODY}; list-style: disc outside; }

        .ora-btn {
          display: inline-block;
          background: ${BAR};
          color: #fff;
          font-family: ${SANS};
          font-size: 15.5px;
          font-weight: 600;
          padding: 13px 24px;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .ora-btn:hover { background: #4A4540; }

        .ora-countdown {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          border: 1px solid ${LINE};
          border-radius: 6px;
          background: #fff;
          padding: 22px 26px;
          margin-top: 34px;
        }
        .ora-cd-right { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
        .ora-cd-label { font-size: 17px; font-weight: 700; color: ${INK}; }
        .ora-cd-digits { display: flex; align-items: flex-start; }
        .ora-cd-num { font-size: 27px; font-weight: 700; color: ${INK}; line-height: 1.1; font-variant-numeric: tabular-nums; }
        .ora-cd-unit { font-size: 12px; color: ${MUTE}; margin-top: 2px; }
        .ora-cd-sep { font-size: 22px; font-weight: 700; color: ${INK}; padding: 0 4px; line-height: 1.3; }

        .ora-agenda-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }
        .ora-agenda-row {
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          gap: 22px;
          padding: 22px 0;
        }
        .ora-agenda-time { font-size: 16px; font-weight: 700; color: ${INK}; font-variant-numeric: tabular-nums; }

        .ora-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }

        .ora-footer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .ora-rail { min-width: 0; }
        .ora-share {
          margin-top: 26px;
          background: #fff;
          border: 1px solid #9E9A95;
          border-radius: 4px;
          padding: 11px 26px;
          font-family: ${SANS};
          font-size: 15px;
          font-weight: 600;
          color: ${INK};
          cursor: pointer;
        }
        .ora-share:hover { background: #F0EEEC; }

        @media (max-width: 1000px) {
          .ora-shell { grid-template-columns: minmax(0, 1fr); }
          .ora-rail { order: -1; }
          .ora-rail > div { position: static; }
        }
        @media (max-width: 820px) {
          .ora-hero { grid-template-columns: minmax(0, 1fr); }
          .ora-hero-art { min-height: 200px; order: -1; }
          .ora-agenda-row { grid-template-columns: minmax(0, 1fr); gap: 8px; }
          .ora-form-grid { grid-template-columns: minmax(0, 1fr); }
          .ora-countdown { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}
