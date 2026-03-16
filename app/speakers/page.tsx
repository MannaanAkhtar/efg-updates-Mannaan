"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { SpeakerWithEvents } from "@/lib/supabase/types";
import { Footer } from "@/components/sections";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const PAD = "0 clamp(20px, 4vw, 60px)";

const EVENT_FILTERS = [
  "All",
  "Cyber First UAE",
  "OT Security First",
  "OPEX First UAE",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL
// ─────────────────────────────────────────────────────────────────────────────

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
// SKELETON CARD
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        overflow: "hidden",
      }}
    >
      {/* Portrait photo skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          aspectRatio: "3 / 4",
          width: "100%",
          background: "rgba(255,255,255,0.04)",
        }}
      />
      {/* Content skeleton */}
      <div style={{ padding: "clamp(14px, 2vw, 20px)" }}>
        {/* Name skeleton */}
        <div
          className="skeleton-pulse"
          style={{
            width: "70%",
            height: 16,
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 8,
          }}
        />
        {/* Title skeleton */}
        <div
          className="skeleton-pulse"
          style={{
            width: "100%",
            height: 12,
            borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 6,
          }}
        />
        {/* Organization skeleton */}
        <div
          className="skeleton-pulse"
          style={{
            width: "60%",
            height: 10,
            borderRadius: 5,
            background: "rgba(255,255,255,0.04)",
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPEAKER CARD
// ─────────────────────────────────────────────────────────────────────────────

function SpeakerCard({
  speaker,
  index,
}: {
  speaker: SpeakerWithEvents;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  const fullName = speaker.name;
  const initials = speaker.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const primaryRole = speaker.role_type;
  const showBadge = primaryRole === "chair" || primaryRole === "advisor";
  const badgeLabel = primaryRole === "chair" ? "Conference Chair" : "Advisor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.03, ease: EASE }}
    >
      <Link
        href={`/speakers/${speaker.slug}`}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            borderRadius: 16,
            border: hovered
              ? "1px solid rgba(232,101,26,0.3)"
              : "1px solid rgba(255,255,255,0.06)",
            background: hovered
              ? "rgba(232,101,26,0.03)"
              : "rgba(255,255,255,0.02)",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: hovered ? "translateY(-4px)" : "none",
            boxShadow: hovered
              ? "0 12px 40px rgba(232,101,26,0.15)"
              : "none",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Portrait photo */}
          <div
            style={{
              aspectRatio: "3 / 4",
              width: "100%",
              background: "rgba(232,101,26,0.06)",
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {speaker.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={speaker.image_url}
                alt={fullName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  filter: hovered ? "grayscale(0%)" : "grayscale(100%)",
                  transition: "filter 0.4s ease",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: hovered
                    ? "rgba(232,101,26,0.1)"
                    : "rgba(232,101,26,0.06)",
                  transition: "background 0.4s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 4vw, 56px)",
                    fontWeight: 800,
                    color: hovered
                      ? "rgba(232,101,26,0.5)"
                      : "rgba(232,101,26,0.25)",
                    letterSpacing: "-2px",
                    transition: "color 0.4s ease",
                  }}
                >
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Content area */}
          <div
            style={{
              padding: "clamp(14px, 2vw, 20px)",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {/* Badge */}
            {showBadge && (
              <div
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  padding: "3px 10px",
                  borderRadius: 40,
                  background: "rgba(232,101,26,0.12)",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#E8651A",
                    letterSpacing: "0.3px",
                    textTransform: "uppercase",
                  }}
                >
                  {badgeLabel}
                </span>
              </div>
            )}

            {/* Name */}
            <h3
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: "-0.2px",
                margin: "0 0 4px",
                lineHeight: 1.3,
              }}
            >
              {fullName}
            </h3>

            {/* Job title */}
            {speaker.title && (
              <p
                className="speaker-title-clamp"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: 300,
                  color: "#A0A0A0",
                  lineHeight: 1.4,
                  margin: "0 0 3px",
                }}
              >
                {speaker.title}
              </p>
            )}

            {/* Organization */}
            {speaker.organization && (
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 400,
                  color: "#707070",
                  lineHeight: 1.4,
                  margin: "0 0 auto",
                }}
              >
                {speaker.organization}
              </p>
            )}

            {/* Event context */}
            {speaker.speaker_events && speaker.speaker_events.length > 0 && (
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                  paddingTop: 10,
                  marginTop: 12,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                {speaker.speaker_events.slice(0, 2).map((ev) => (
                  <span
                    key={ev.id}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 40,
                      background: "rgba(255,255,255,0.04)",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10,
                      fontWeight: 400,
                      color: "#606060",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ev.event_name} {ev.event_year ?? ""}
                  </span>
                ))}
                {speaker.speaker_events.length > 2 && (
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: 40,
                      background: "rgba(232,101,26,0.08)",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10,
                      fontWeight: 500,
                      color: "#E8651A",
                    }}
                  >
                    +{speaker.speaker_events.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPEAKER INQUIRY FORM
// ─────────────────────────────────────────────────────────────────────────────

const SPEAKER_FORM = {
  heading: "Share Your\nExpertise",
  description:
    "We platform practitioners, not salespeople. If you\u2019re a hands-on leader with real-world experience, we want you on stage.",
  perks: [
    { icon: "mic", text: "Keynote & panel opportunities" },
    { icon: "globe", text: "Reach 5,000+ senior leaders" },
    { icon: "award", text: "Join our speaker alumni network" },
  ],
  trust: "200+ practitioners have spoken at EFG events since 2023",
  fields: [
    { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
    { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "+971 xxxx xxxx" },
    { name: "company", label: "Company", type: "text", placeholder: "Company name" },
    { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
    { name: "interest", label: "Event Interest", type: "select", placeholder: "Select an event series", options: ["Cyber First", "OT Security First", "Data & AI First", "Opex First", "Other"] },
    { name: "topic", label: "Proposed Topic", type: "text", placeholder: "Brief topic or area of expertise" },
    { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your background..." },
  ],
  cta: "Submit Speaker Proposal",
};

function InquiryPerkIcon({ type }: { type: string }) {
  const s: React.CSSProperties = { opacity: 0.7 };
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: s };
  if (type === "mic") return <svg {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>;
  if (type === "globe") return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
  return <svg {...props}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>;
}

function SpeakerInquiryForm() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    if (formData.email && !isWorkEmail(formData.email)) {
      setEmailError("Please use your work email address");
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
      type: "speak",
      full_name: formData.name || "",
      email: formData.email || "",
      company: formData.company || "",
      job_title: formData.title || "",
      phone: combinedPhone,
      event_name: formData.interest || undefined,
      metadata: {
        event_interest: formData.interest || "",
        proposed_topic: formData.topic || "",
        message: formData.message || "",
      },
    });

    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setFormError(result.error || "Something went wrong.");
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormError(null);
    setFormData({});
    setPhoneError(null);
    setEmailError(null);
    setSelectedCountry(COUNTRY_CODES[0]);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 13.5,
    fontWeight: 400,
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-outfit)",
    fontSize: 11,
    fontWeight: 500,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 5,
    display: "block",
    letterSpacing: "0.3px",
  };

  const tab = SPEAKER_FORM;

  return (
    <section
      id="speak-at-efg"
      ref={ref}
      style={{
        background: "#0A0A0A",
        padding: "clamp(36px, 4.5vw, 52px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 700px 500px at 20% 40%, rgba(232,101,26,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 80% 60%, rgba(232,101,26,0.03) 0%, transparent 70%)
          `,
        }}
      />

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative" }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 30, height: 1, background: "#E8651A", flexShrink: 0 }} />
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
              Speak at EFG
            </span>
          </div>
        </motion.div>

        {/* Split layout */}
        <div
          className="speaker-inquiry-split"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.25fr",
            gap: "clamp(32px, 4vw, 64px)",
            alignItems: "start",
          }}
        >
          {/* LEFT: Editorial */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            style={{ paddingTop: 8 }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(32px, 3.5vw, 50px)",
                letterSpacing: "-2px",
                color: "#FFFFFF",
                lineHeight: 1.08,
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {tab.heading}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 300,
                fontSize: "clamp(14px, 1.2vw, 16px)",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.7,
                margin: "20px 0 0",
                maxWidth: 440,
              }}
            >
              {tab.description}
            </p>

            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
              {tab.perks.map((perk) => (
                <div key={perk.text} className="flex items-center gap-3">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(232,101,26,0.06)",
                      border: "1px solid rgba(232,101,26,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#E8651A",
                      flexShrink: 0,
                    }}
                  >
                    <InquiryPerkIcon type={perk.icon} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {perk.text}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 40,
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.3px",
                  margin: 0,
                }}
              >
                {tab.trust}
              </p>
            </div>
          </motion.div>

          {/* RIGHT: Form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            style={{
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              padding: "clamp(24px, 3vw, 36px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                top: -40,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(232,101,26,0.05) 0%, transparent 70%)",
              }}
            />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "clamp(20px, 2.5vw, 26px)",
                      letterSpacing: "-0.5px",
                      color: "white",
                      margin: "0 0 8px",
                    }}
                  >
                    Proposal Submitted
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 300,
                      fontSize: 14,
                      color: "#A0A0A0",
                      margin: "0 0 20px",
                      lineHeight: 1.6,
                    }}
                  >
                    Our team will review your submission and get back
                    to you within 2 working hours.
                  </p>
                  <button
                    onClick={resetForm}
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#E8651A",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Submit another proposal &rarr;
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <form onSubmit={handleSubmit}>
                    <div
                      className="speaker-inquiry-form-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      {tab.fields.map((field) => {
                        const isFullWidth = field.type === "textarea" || field.type === "tel";
                        if (field.type === "tel") {
                          return (
                            <div key={field.name} style={{ gridColumn: "1 / -1" }}>
                              <label style={labelStyle}>{field.label}</label>
                              <div style={{ display: "flex", gap: 8 }}>
                                <select
                                  value={`${selectedCountry.code}|${selectedCountry.country}`}
                                  onChange={(e) => {
                                    const [code, country] = e.target.value.split("|");
                                    const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country);
                                    if (c) { setSelectedCountry(c); setPhoneError(null); }
                                  }}
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
                                  value={formData[field.name] || ""}
                                  onChange={(e) => { handleChange(field.name, e.target.value); setPhoneError(null); }}
                                  placeholder={selectedCountry.placeholder}
                                  maxLength={selectedCountry.length}
                                  style={{ ...inputStyle, flex: 1 }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)"; }}
                                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                                />
                              </div>
                              {phoneError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{phoneError}</p>}
                            </div>
                          );
                        }
                        if (field.type === "email") {
                          return (
                            <div key={field.name}>
                              <label style={labelStyle}>{field.label}</label>
                              <input
                                type="email"
                                value={formData[field.name] || ""}
                                onChange={(e) => { handleChange(field.name, e.target.value); setEmailError(null); }}
                                placeholder={field.placeholder}
                                required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)"; }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                  const val = formData[field.name] || e.currentTarget.value;
                                  if (val && !isWorkEmail(val)) { setEmailError("Please use your work email address"); }
                                }}
                              />
                              {emailError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{emailError}</p>}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={field.name}
                            style={{
                              gridColumn: isFullWidth ? "1 / -1" : undefined,
                            }}
                          >
                            <label style={labelStyle}>{field.label}</label>
                            {field.type === "textarea" ? (
                              <textarea
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                rows={3}
                                style={{
                                  ...inputStyle,
                                  resize: "vertical",
                                  minHeight: 72,
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                              />
                            ) : field.type === "select" ? (
                              <select
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                required
                                style={{
                                  ...inputStyle,
                                  appearance: "none",
                                  WebkitAppearance: "none",
                                  cursor: "pointer",
                                  color: formData[field.name] ? "white" : "rgba(255,255,255,0.3)",
                                }}
                              >
                                <option value="" style={{ color: "#222", background: "#fff" }}>
                                  {field.placeholder}
                                </option>
                                {(field as { options?: string[] }).options?.map((opt: string) => (
                                  <option key={opt} value={opt} style={{ color: "#222", background: "#fff" }}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.type}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {formError && (
                      <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 13, margin: "8px 0 0" }}>
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: "100%",
                        marginTop: 20,
                        padding: "13px 28px",
                        borderRadius: 10,
                        background: submitting ? "rgba(232,101,26,0.6)" : "#E8651A",
                        color: "white",
                        fontFamily: "var(--font-outfit)",
                        fontSize: 14,
                        fontWeight: 600,
                        border: "none",
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        opacity: submitting ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!submitting) {
                          e.currentTarget.style.background = "#FF7A2E";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(232,101,26,0.25)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = submitting ? "rgba(232,101,26,0.6)" : "#E8651A";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {submitting ? "Submitting..." : tab.cta} {!submitting && <span>→</span>}
                    </button>
                  </form>

                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#3A3A3A",
                      textAlign: "center",
                      margin: "14px 0 0",
                    }}
                  >
                    Your information is kept confidential. We&apos;ll only use
                    it to respond to your inquiry.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 860px) {
          .speaker-inquiry-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .speaker-inquiry-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT HIGHLIGHTS — Long-form video section
// ─────────────────────────────────────────────────────────────────────────────

const HIGHLIGHT_VIDEOS = [
  { id: "JA1X4cN2-t0", title: "Event Highlights" },
  { id: "-a481Lbz55o", title: "Event Highlights" },
  { id: "dbL42utoYW4", title: "Event Highlights" },
  { id: "gR-IUI7yJLg", title: "Event Highlights" },
  { id: "0d_2Itsg6ec", title: "Event Highlights" },
  { id: "wcEeU0UEl0o", title: "Event Highlights" },
  { id: "Bc3L3iTsaIg", title: "Event Highlights" },
  { id: "3uvw31I1tq8", title: "Event Highlights" },
  { id: "6H11mOM-aJc", title: "Event Highlights" },
  { id: "kjro4AVXUhM", title: "Event Highlights" },
  { id: "8xluYDV_07g", title: "Event Highlights" },
  { id: "ktsauwzmb-Q", title: "Event Highlights" },
  { id: "iFVU9upOXyM", title: "Event Highlights" },
  { id: "_ogyuzwQWYo", title: "Event Highlights" },
  { id: "j7g0eRb7hsQ", title: "Event Highlights" },
  { id: "Klt-iNu1g4g", title: "Event Highlights" },
];

const INITIAL_SHOW = 6;

function HighlightVideoCard({
  videoId,
  index,
}: {
  videoId: string;
  index: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        aspectRatio: "16 / 9",
        background: "#111",
        cursor: isPlaying ? "default" : "pointer",
      }}
      onClick={() => !isPlaying && setIsPlaying(true)}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      ) : (
        <>
          {/* Thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Events First Group video highlight thumbnail"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.3) 100%)",
            }}
          />

          {/* Play button */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(232, 101, 26, 0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s, background 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.background = "rgba(255, 122, 46, 0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(232, 101, 26, 0.9)";
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="white"
                style={{ marginLeft: 2 }}
              >
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

function EventHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [showAll, setShowAll] = useState(false);

  const visibleVideos = showAll
    ? HIGHLIGHT_VIDEOS
    : HIGHLIGHT_VIDEOS.slice(0, INITIAL_SHOW);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black)",
        padding: "clamp(36px, 4.5vw, 52px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle atmospheric gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,101,26,0.03) 0%, transparent 60%)",
        }}
      />

      <div
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          position: "relative",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <SectionLabel text="From the Stage" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 3.5vw, 44px)",
            letterSpacing: "-1.5px",
            color: "var(--white)",
            lineHeight: 1.15,
            margin: "0 0 8px",
          }}
        >
          Event Highlights
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 300,
            fontSize: "clamp(14px, 1.2vw, 16px)",
            color: "#707070",
            lineHeight: 1.7,
            margin: "0 0 clamp(28px, 3.5vw, 44px)",
            maxWidth: 540,
          }}
        >
          Keynotes, panels, and conversations captured live from our events
          worldwide.
        </motion.p>

        {/* Video Grid */}
        <div
          className="highlights-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(12px, 2vw, 20px)",
          }}
        >
          <AnimatePresence mode="popLayout">
            {visibleVideos.map((video, i) => (
              <HighlightVideoCard
                key={video.id}
                videoId={video.id}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less */}
        {HIGHLIGHT_VIDEOS.length > INITIAL_SHOW && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "clamp(28px, 3vw, 40px)",
            }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 500,
                color: "#E8651A",
                background: "rgba(232, 101, 26, 0.08)",
                border: "1px solid rgba(232, 101, 26, 0.2)",
                borderRadius: 100,
                padding: "12px 32px",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(232, 101, 26, 0.14)";
                e.currentTarget.style.borderColor =
                  "rgba(232, 101, 26, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(232, 101, 26, 0.08)";
                e.currentTarget.style.borderColor =
                  "rgba(232, 101, 26, 0.2)";
              }}
            >
              {showAll
                ? "Show Less"
                : `Show All ${HIGHLIGHT_VIDEOS.length} Videos`}
            </button>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .highlights-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .highlights-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function SpeakersPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  const [speakers, setSpeakers] = useState<SpeakerWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  // Fetch speakers on mount
  useEffect(() => {
    async function fetchSpeakers() {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from("speakers")
          .select("*, speaker_events(*)")
          .order("name", { ascending: true });

        if (error) {
          console.error("Supabase error:", error.message);
          return;
        }
        if (data) setSpeakers(data as SpeakerWithEvents[]);
      } catch (err) {
        console.error("Failed to fetch speakers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpeakers();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, eventFilter]);

  // Filter logic
  const filtered = useMemo(() => {
    return speakers.filter((s) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = s.name.toLowerCase().includes(q);
        const titleMatch = s.title?.toLowerCase().includes(q);
        const orgMatch = s.organization?.toLowerCase().includes(q);
        if (!nameMatch && !titleMatch && !orgMatch) return false;
      }
      // Event filter
      if (eventFilter !== "All") {
        const hasEvent = s.speaker_events?.some(
          (e) => e.event_name === eventFilter
        );
        if (!hasEvent) return false;
      }
      return true;
    });
  }, [speakers, search, eventFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginatedSpeakers = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          background: "#0A0A0A",
          position: "relative",
          overflow: "hidden",
          padding: "clamp(90px, 10vw, 130px) 0 clamp(32px, 4vw, 48px)",
        }}
      >
        {/* Ambient gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,101,26,0.08) 0%, transparent 55%),
              radial-gradient(ellipse 40% 30% at 85% 15%, rgba(232,101,26,0.04) 0%, transparent 50%)
            `,
          }}
        />

        {/* Ghost text */}
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -52%)",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(120px, 20vw, 280px)",
            letterSpacing: "-8px",
            color: "rgba(255,255,255,0.025)",
            whiteSpace: "nowrap",
            zIndex: 0,
          }}
        >
          SPEAKERS
        </div>

        <div
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: PAD,
            position: "relative",
            zIndex: 10,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <SectionLabel text="Our Experts" />
          </motion.div>

          <div
            className="speakers-hero-title-row"
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "flex-start",
              gap: 28,
              margin: "0 0 20px",
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(40px, 6vw, 80px)",
                letterSpacing: "-3px",
                color: "#FFFFFF",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Speakers
            </motion.h1>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
              onClick={() => {
                document
                  .getElementById("speak-at-efg")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="speakers-hero-cta"
              style={{
                padding: "11px 26px",
                borderRadius: 100,
                background: "transparent",
                border: "1px solid rgba(232, 101, 26, 0.5)",
                color: "#E8651A",
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                letterSpacing: "0.2px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(232, 101, 26, 0.1)";
                e.currentTarget.style.borderColor = "#E8651A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(232, 101, 26, 0.5)";
              }}
            >
              Apply to Speak
            </motion.button>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(15px, 1.3vw, 18px)",
              color: "#A0A0A0",
              lineHeight: 1.65,
              maxWidth: 560,
              margin: 0,
            }}
          >
            The industry leaders and experts shaping conversations across
            cybersecurity, OT security, and operational excellence — from
            government advisors to technology pioneers.
          </motion.p>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div
        className="speakers-filter-bar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,10,10,0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: "14px clamp(20px, 4vw, 60px)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(12px, 2vw, 20px)",
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#707070"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search speakers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                color: "#FFFFFF",
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 400,
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              }}
            />
          </div>

          {/* Event filter pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {EVENT_FILTERS.map((ev) => {
              const isActive = eventFilter === ev;
              return (
                <button
                  key={ev}
                  onClick={() => setEventFilter(ev)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 40,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#FFFFFF" : "#707070",
                    background: isActive
                      ? "#E8651A"
                      : "rgba(255,255,255,0.02)",
                    border: isActive
                      ? "1px solid #E8651A"
                      : "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    letterSpacing: "0.2px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ev}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          {!loading && (
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 400,
                color: "#707070",
                letterSpacing: "0.2px",
                whiteSpace: "nowrap",
                marginLeft: "auto",
              }}
            >
              Page {page} of {totalPages || 1} · {filtered.length} speakers
            </span>
          )}
        </div>
      </div>

      {/* ── SPEAKER GRID ── */}
      <section
        ref={gridRef}
        style={{
          background: "#0A0A0A",
          padding: "clamp(24px, 3vw, 36px) 0 clamp(32px, 4vw, 48px)",
          minHeight: 400,
        }}
      >
        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
          {loading ? (
            <div
              className="speakers-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "clamp(12px, 2vw, 20px)",
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={gridInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                textAlign: "center",
                padding: "clamp(48px, 6vw, 80px) 0",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#707070"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  letterSpacing: "-0.5px",
                  color: "#FFFFFF",
                  margin: "0 0 8px",
                }}
              >
                No speakers found
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "#A0A0A0",
                  margin: 0,
                }}
              >
                Try adjusting your search or filter to find what you&apos;re
                looking for.
              </p>
            </motion.div>
          ) : (
            <>
              <div
                className="speakers-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "clamp(12px, 2vw, 20px)",
                }}
              >
                {paginatedSpeakers.map((speaker, i) => (
                  <SpeakerCard key={speaker.id} speaker={speaker} index={i} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: 32,
                  }}
                >
                  {/* Prev */}
                  <button
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      gridRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={page === 1}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                      color: page === 1 ? "#353535" : "#A0A0A0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: page === 1 ? "default" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - page) <= 1) return true;
                      return false;
                    })
                    .reduce<(number | "dots")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("dots");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "dots" ? (
                        <span
                          key={`dots-${idx}`}
                          style={{
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#505050",
                            fontFamily: "var(--font-outfit)",
                            fontSize: 13,
                          }}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => {
                            setPage(item);
                            gridRef.current?.scrollIntoView({ behavior: "smooth" });
                          }}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: page === item
                              ? "1px solid #E8651A"
                              : "1px solid rgba(255,255,255,0.06)",
                            background: page === item
                              ? "rgba(232, 101, 26, 0.12)"
                              : "rgba(255,255,255,0.02)",
                            color: page === item ? "#E8651A" : "#707070",
                            fontFamily: "var(--font-outfit)",
                            fontSize: 13,
                            fontWeight: page === item ? 600 : 400,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {item}
                        </button>
                      )
                    )}

                  {/* Next */}
                  <button
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      gridRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={page === totalPages}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                      color: page === totalPages ? "#353535" : "#A0A0A0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: page === totalPages ? "default" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── EVENT HIGHLIGHTS — Video Section ── */}
      <EventHighlights />

      {/* ── SPEAKER INQUIRY FORM ── */}
      <SpeakerInquiryForm />

      <Footer />

      {/* ── STYLES ── */}
      <style jsx global>{`
        .speaker-title-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

        @media (max-width: 1320px) {
          .speakers-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 1024px) {
          .speakers-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .speakers-grid {
            grid-template-columns: 1fr !important;
          }
          .speakers-hero-title-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
          .speakers-hero-cta {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}
