"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitForm, isWorkEmail } from "@/lib/form-helpers";

// ─── Seagate Design Tokens — black + lime green + teal (real Seagate brand) ──
const SG_GREEN = "#71B53F";        // Seagate lime green — primary accent
const SG_GREEN_BRIGHT = "#8FE060"; // Brighter green for highlights
const SG_GREEN_DEEP = "#1F4F22";   // Deep green for blooms
const SG_TEAL = "#3FB99B";         // Teal accent
const SG_WHITE = "#ffffff";
const SG_BONE = "#F6F4F0";         // Off-white card bg
const SG_INK = "#0A0E12";          // Dark text on light card
const SG_GRAY = "#86909E";
const SG_GRAY_DEEP = "#4A5563";

const LOGO_NEG = "https://efg-final.s3.eu-north-1.amazonaws.com/logos/seagate_2c_horizontal_neg1.png";

// ─── Form shape + questions (quick anonymous survey) ─────────────────────────
const EMPTY_FORM = {
  fullName: "",
  email: "",
  feedback: "",
  aistep: "",
  improve: "",
  contact: "",
};

const QUESTIONS: { key: keyof typeof EMPTY_FORM; n: number; q: string; placeholder: string }[] = [
  { key: "feedback", n: 1, q: "Your honest feedback about the event", placeholder: "What worked, what stood out, what could have been better…" },
  { key: "aistep", n: 2, q: "One practical step every leader in the room could take to make their infrastructure more AI-ready", placeholder: "A concrete next move you'd recommend…" },
  { key: "improve", n: 3, q: "What should we improve to make you want to attend our events again?", placeholder: "Format, topics, speakers, logistics, networking…" },
  { key: "contact", n: 4, q: "How would you like us to stay in touch?", placeholder: "Email, a call, LinkedIn, our newsletter — whatever works best for you." },
];

export default function SeagateFeedbackPage() {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const setField = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setField(e.target.name, e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!form.fullName.trim()) { setErrorMsg("Please enter your name."); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) { setErrorMsg("Please enter a valid email address."); return; }
    if (!isWorkEmail(form.email.trim())) { setErrorMsg("Please use your work email address."); return; }
    const anyAnswer = [form.feedback, form.aistep, form.improve, form.contact].some((v) => v.trim());
    if (!anyAnswer) { setErrorMsg("Please share at least one response before submitting."); return; }

    setLoading(true);
    const result = await submitForm({
      type: "contact",
      full_name: form.fullName,
      email: form.email,
      event_name: "Seagate Executive Roundtable — Post-Event Survey",
      metadata: {
        "Event feedback": form.feedback,
        "One AI-ready step for leaders": form.aistep,
        "What to improve / earn a return visit": form.improve,
        "Preferred way to stay in touch": form.contact,
      },
    });
    setLoading(false);
    if (result.success) setSubmitted(true);
    else setErrorMsg(result.error || "Something went wrong. Please try again.");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        // Exact "unified dark zone" background from the main Seagate page.
        background: `
          radial-gradient(ellipse 45% 12% at 80% 4%, rgba(55, 115, 85, 0.22) 0%, transparent 65%),
          radial-gradient(ellipse 50% 14% at 18% 14%, rgba(30, 80, 55, 0.18) 0%, transparent 62%),
          radial-gradient(ellipse 60% 14% at 50% 22%, ${SG_TEAL}10 0%, transparent 68%),
          radial-gradient(ellipse 42% 14% at 82% 32%, rgba(55, 120, 90, 0.20) 0%, transparent 65%),
          radial-gradient(ellipse 48% 14% at 22% 42%, rgba(35, 90, 65, 0.18) 0%, transparent 65%),
          radial-gradient(ellipse 38% 12% at 70% 52%, ${SG_GREEN}10 0%, transparent 65%),
          radial-gradient(ellipse 55% 14% at 30% 60%, rgba(40, 100, 75, 0.18) 0%, transparent 65%),
          radial-gradient(ellipse 45% 14% at 78% 70%, rgba(55, 120, 90, 0.20) 0%, transparent 65%),
          radial-gradient(ellipse 60% 14% at 50% 80%, ${SG_TEAL}10 0%, transparent 68%),
          radial-gradient(ellipse 50% 14% at 20% 88%, rgba(35, 90, 65, 0.18) 0%, transparent 65%),
          radial-gradient(ellipse 40% 12% at 70% 96%, ${SG_GREEN}14 0%, transparent 65%),
          linear-gradient(180deg, #060d0a 0%, #04080a 50%, #02060a 100%)
        `,
        color: SG_WHITE,
        fontFamily: "var(--font-sohne-breit), system-ui, sans-serif",
        position: "relative",
        overflowX: "hidden",
        padding: "clamp(24px, 4vh, 48px) clamp(18px, 5vw, 48px) clamp(36px, 6vh, 64px)",
      }}
    >
      {/* Grain noise — luxury film texture, matching the main page's dark zone */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        backgroundSize: "200px 200px",
        opacity: 0.035,
        pointerEvents: "none",
      }} />
      {/* Edge vignette — frames the dark field */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 95% 95% at 50% 50%, transparent 0%, transparent 65%, rgba(2,5,8,0.4) 92%, rgba(1,3,6,0.7) 100%)",
        pointerEvents: "none",
      }} />

      <div className="sgf-wrap" style={{ position: "relative", zIndex: 1, margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(20px, 3vh, 32px)" }}>
          <Link href="/seagate" aria-label="Seagate Executive Roundtable" style={{ display: "inline-block" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_NEG} alt="Seagate" style={{ height: "clamp(52px, 6.5vw, 66px)", width: "auto", opacity: 0.95 }} />
          </Link>

          <div style={{ marginTop: "clamp(20px, 3vh, 32px)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: SG_GREEN }}>
              <span aria-hidden style={{ width: 22, height: 1, background: SG_GREEN }} />
              Feedback Form
              <span aria-hidden style={{ width: 22, height: 1, background: SG_GREEN }} />
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(27px, 8vw, 34px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.08, color: SG_WHITE, margin: "16px 0 0" }}>
            Help shape the next roundtable.
          </h1>
          <p style={{ margin: "14px auto 0", maxWidth: 400, fontSize: 14.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
            A quick survey to help us improve — it takes under two minutes, and every response counts.
          </p>
        </div>

        {/* Card */}
        <div className="sgf-card">
          {submitted ? (
            <div style={{ padding: "clamp(28px, 5vw, 48px) 0", textAlign: "center" }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", background: SG_GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 8px 24px ${SG_GREEN}45` }}>
                <span style={{ color: SG_WHITE, fontSize: 26, lineHeight: 1 }}>✓</span>
              </div>
              <h2 style={{ fontSize: "clamp(20px, 2.4vw, 26px)", fontWeight: 600, color: SG_INK, margin: 0, letterSpacing: "-0.02em" }}>
                Thank you for your feedback.
              </h2>
              <p style={{ margin: "12px auto 0", maxWidth: 420, fontFamily: `Georgia, "Cambria", "Times New Roman", serif`, fontStyle: "italic", fontSize: 14.5, color: SG_GRAY, lineHeight: 1.6 }}>
                We genuinely read every response — it helps us make the next roundtable even better.
              </p>
              <Link href="/seagate" className="sgf-back-link">← Back to the event</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sgf-form" noValidate>
              {/* Identity */}
              <div className="sgf-row">
                <div className="sgf-field">
                  <label htmlFor="sgf-name">Full Name</label>
                  <input id="sgf-name" name="fullName" type="text" required placeholder="Your full name" value={form.fullName ?? ""} onChange={handleChange} suppressHydrationWarning />
                </div>
                <div className="sgf-field">
                  <label htmlFor="sgf-email">Work Email</label>
                  <input id="sgf-email" name="email" type="email" required placeholder="you@company.com" value={form.email ?? ""} onChange={handleChange} suppressHydrationWarning />
                </div>
              </div>

              <div aria-hidden className="sgf-divider" />

              {/* Survey questions */}
              <div className="sgf-questions">
                {QUESTIONS.map((q) => (
                  <div key={q.key} className="sgf-q">
                    <label htmlFor={`sgf-${q.key}`} className="sgf-q-label">
                      <span className="sgf-q-num">{q.n}</span>
                      {q.q}
                    </label>
                    <textarea
                      id={`sgf-${q.key}`}
                      name={q.key}
                      rows={q.key === "contact" ? 2 : 3}
                      placeholder={q.placeholder}
                      value={form[q.key] ?? ""}
                      onChange={handleChange}
                      suppressHydrationWarning
                    />
                  </div>
                ))}
              </div>

              {errorMsg && <p className="sgf-error">{errorMsg}</p>}

              <button type="submit" disabled={loading} className="sgf-submit" suppressHydrationWarning>
                {loading ? "Sending…" : (
                  <>
                    Submit Survey
                    <span aria-hidden style={{ display: "inline-block", marginLeft: 8 }}>→</span>
                  </>
                )}
              </button>

              <p className="sgf-note">Your responses are kept confidential and shared only with the event team.</p>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        .sgf-wrap { max-width: 460px; }
        .sgf-card {
          background: ${SG_BONE};
          border-radius: 22px;
          padding: clamp(20px, 3.2vw, 34px);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }
        .sgf-form .sgf-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        .sgf-questions {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(20px, 2.6vw, 28px);
        }

        /* Desktop: fill the width — wider card, two-column fields */
        @media (min-width: 760px) {
          .sgf-wrap { max-width: 880px; }
          .sgf-card { padding: clamp(34px, 4vw, 52px); }
          .sgf-form .sgf-row { grid-template-columns: 1fr 1fr; gap: 22px; }
          .sgf-questions {
            grid-template-columns: 1fr 1fr;
            column-gap: 28px;
            row-gap: 36px;
            align-items: start;
          }
          /* Make each question a column whose textarea sits at a uniform baseline */
          .sgf-q { display: flex; flex-direction: column; }
          .sgf-q-label { min-height: 60px; align-content: start; }
          .sgf-questions textarea { min-height: 132px; flex: 1; }
          .sgf-submit { display: block; max-width: 320px; margin-left: auto; margin-right: auto; }
        }
        .sgf-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sgf-form label,
        .sgf-q-label {
          font-family: var(--font-sohne-breit), system-ui, sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${SG_GRAY_DEEP};
        }
        .sgf-opt { color: ${SG_GRAY}; font-weight: 400; }
        .sgf-form input,
        .sgf-form textarea {
          width: 100%;
          padding: 13px 15px;
          background: rgba(10, 14, 18, 0.025);
          border: 1px solid rgba(10, 14, 18, 0.08);
          border-radius: 11px;
          font-family: var(--font-sohne-breit), system-ui, sans-serif;
          font-size: 16px; /* 16px prevents iOS Safari zoom-on-focus */
          font-weight: 400;
          color: ${SG_INK};
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .sgf-form input::placeholder,
        .sgf-form textarea::placeholder { color: rgba(10, 14, 18, 0.32); }
        .sgf-form input:hover:not(:focus),
        .sgf-form textarea:hover:not(:focus) { border-color: rgba(10, 14, 18, 0.16); }
        .sgf-form input:focus,
        .sgf-form textarea:focus {
          border-color: ${SG_GREEN};
          background: ${SG_WHITE};
          box-shadow: 0 0 0 3px ${SG_GREEN}1f;
        }
        .sgf-form textarea { resize: vertical; min-height: 80px; line-height: 1.55; }

        .sgf-divider {
          height: 1px;
          margin: clamp(22px, 3vw, 30px) 0;
          background: linear-gradient(90deg, transparent, rgba(10, 14, 18, 0.14) 30%, rgba(10, 14, 18, 0.14) 70%, transparent);
        }

        .sgf-q { margin-top: 0; }
        .sgf-q-label {
          display: block;
          font-size: 12.5px;
          letter-spacing: -0.005em;
          text-transform: none;
          font-weight: 500;
          color: ${SG_INK};
          line-height: 1.5;
          margin: 0 0 12px;
        }
        .sgf-q-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          margin-right: 10px;
          border-radius: 6px;
          background: ${SG_GREEN}18;
          color: ${SG_GREEN_DEEP};
          font-size: 11px;
          font-weight: 700;
          vertical-align: 1px;
        }

        .sgf-error {
          margin: 18px 0 0;
          color: #b42318;
          font-size: 13px;
          font-weight: 500;
        }
        .sgf-submit {
          margin-top: clamp(24px, 3vw, 32px);
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 12px;
          background: ${SG_GREEN};
          color: ${SG_WHITE};
          font-family: var(--font-sohne-breit), system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 10px 24px ${SG_GREEN}33;
        }
        .sgf-submit:hover:not(:disabled) {
          background: ${SG_GREEN_BRIGHT};
          transform: translateY(-1px);
          box-shadow: 0 14px 30px ${SG_GREEN}44;
        }
        .sgf-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .sgf-note {
          margin: 14px 0 0;
          text-align: center;
          font-size: 11.5px;
          color: ${SG_GRAY};
        }
        .sgf-back-link {
          display: inline-block;
          margin-top: 22px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: ${SG_GREEN_DEEP};
          text-decoration: none;
        }
        .sgf-back-link:hover { text-decoration: underline; }

      `}</style>
    </main>
  );
}
