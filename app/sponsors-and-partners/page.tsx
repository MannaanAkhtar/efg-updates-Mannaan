"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { SponsorWithEvents } from "@/lib/supabase/types";
import { Footer } from "@/components/sections";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const PAD = "0 clamp(20px, 4vw, 60px)";

function tierToLabel(tier: string): string {
  const lower = tier.toLowerCase();
  if (lower === "media" || lower === "media-partner") return "Media Partner";
  if (lower.includes("partner")) {
    return tier
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return `${tier.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} Sponsor`;
}

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
          background: "var(--orange)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "var(--orange)",
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
        width: 172,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Logo area skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          width: "100%",
          aspectRatio: "4/3",
          background: "rgba(255,255,255,0.04)",
        }}
      />
      {/* Info skeleton */}
      <div style={{ padding: "12px 14px 16px" }}>
        <div
          className="skeleton-pulse"
          style={{
            width: "75%",
            height: 13,
            borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 8,
          }}
        />
        <div
          className="skeleton-pulse"
          style={{
            width: "55%",
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
// SPONSOR CARD
// ─────────────────────────────────────────────────────────────────────────────

function SponsorCard({
  sponsor,
  index,
}: {
  sponsor: SponsorWithEvents;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  const initials = sponsor.name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const tierText = sponsor.tier ? tierToLabel(sponsor.tier) : "Partner";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.04, ease: EASE }}
    >
      <Link
        href={`/sponsors-and-partners/${sponsor.slug}`}
        style={{ textDecoration: "none", display: "block" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            width: 172,
            borderRadius: 14,
            border: hovered
              ? "1px solid rgba(232,101,26,0.18)"
              : "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            overflow: "hidden",
            flexShrink: 0,
            transition: "border-color 0.3s ease, transform 0.3s ease",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
          }}
        >
          {/* Logo area */}
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 14,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
              overflow: "hidden",
              background: sponsor.logo_url && hovered
                ? "rgba(255,255,255,0.9)"
                : hovered
                  ? "linear-gradient(160deg, rgba(232,101,26,0.10) 0%, rgba(10,10,10,0.85) 100%)"
                  : "linear-gradient(160deg, rgba(232,101,26,0.05) 0%, rgba(10,10,10,0.90) 100%)",
              transition: "background 0.3s ease",
            }}
          >
            {sponsor.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                style={{
                  maxWidth: "90%",
                  maxHeight: "85%",
                  objectFit: "contain",
                  filter: hovered ? "none" : "brightness(0) invert(1)",
                  opacity: hovered ? 1 : 0.5,
                  transition: "filter 0.3s ease, opacity 0.3s ease",
                }}
              />
            ) : (
              <>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 32,
                    color: "rgba(232,101,26,0.14)",
                    userSelect: "none",
                  }}
                >
                  {initials}
                </span>
                <span
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 10,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 8,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.1)",
                  }}
                >
                  Logo soon
                </span>
              </>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: "12px 14px 16px" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "-0.2px",
                color: "#FFFFFF",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {sponsor.name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 400,
                fontSize: 10,
                color: "#E8651A",
                letterSpacing: "1px",
                textTransform: "uppercase",
                margin: "4px 0 0",
              }}
            >
              {tierText}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPONSOR INQUIRY FORM
// ─────────────────────────────────────────────────────────────────────────────

const SPONSOR_FORM = {
  heading: "Partner with\nEFG Events",
  description:
    "Put your brand in the room with top decision-makers worldwide. Sponsorship packages are designed for maximum visibility and qualified lead generation.",
  perks: [
    { icon: "layers", text: "Boardroom hosting & keynote slots" },
    { icon: "target", text: "Qualified lead generation" },
    { icon: "eye", text: "Premium brand visibility worldwide" },
  ],
  trust: "Trusted by 80+ sponsors across 6+ global markets",
  fields: [
    { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
    { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "+971 xxxx xxxx" },
    { name: "company", label: "Company", type: "text", placeholder: "Company name" },
    { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
    { name: "interest", label: "Event Interest", type: "select", placeholder: "Select an event series", options: ["Cyber First", "OT Security First", "Data & AI First", "Opex First", "Other"] },
    { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your sponsorship goals..." },
  ],
  cta: "Request Sponsorship Info",
};

function SponsorPerkIcon({ type }: { type: string }) {
  const s: React.CSSProperties = { opacity: 0.7 };
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: s };
  if (type === "layers") return <svg {...props}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>;
  if (type === "target") return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
  return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}

function SponsorInquiryForm() {
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
      type: "sponsor",
      full_name: formData.name || "",
      email: formData.email || "",
      company: formData.company || "",
      job_title: formData.title || "",
      phone: combinedPhone,
      event_name: formData.interest || undefined,
      metadata: {
        event_interest: formData.interest || "",
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

  const tab = SPONSOR_FORM;

  return (
    <section
      id="become-a-sponsor"
      ref={ref}
      style={{
        background: "#0A0A0A",
        padding: "clamp(48px, 6vw, 72px) 0",
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          <SectionLabel text="Become a Sponsor" />
        </motion.div>

        <div
          className="sponsor-inquiry-split"
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
                    <SponsorPerkIcon type={perk.icon} />
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
                    Inquiry Submitted
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
                    Submit another inquiry &rarr;
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
                      className="sponsor-inquiry-form-grid"
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
                                {field.options?.map((opt) => (
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
          .sponsor-inquiry-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .sponsor-inquiry-form-grid {
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

export default function SponsorsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  const [sponsors, setSponsors] = useState<SponsorWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");

  // Fetch sponsors on mount
  useEffect(() => {
    async function fetchSponsors() {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from("sponsors")
          .select("*, sponsor_events(*)")
          .order("name", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          return;
        }
        if (data) setSponsors(data as SponsorWithEvents[]);
      } catch (err) {
        console.error("Failed to fetch sponsors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSponsors();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    return sponsors.filter((s) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = s.name.toLowerCase().includes(q);
        const descMatch = s.short_description?.toLowerCase().includes(q);
        if (!nameMatch && !descMatch) return false;
      }
      // Event filter
      if (eventFilter !== "All") {
        const hasEvent = s.sponsor_events?.some(
          (e) => e.event_name === eventFilter
        );
        if (!hasEvent) return false;
      }
      return true;
    });
  }, [sponsors, search, eventFilter]);

  return (
    <div>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          background: "#0A0A0A",
          position: "relative",
          overflow: "hidden",
          padding: "clamp(100px, 12vw, 150px) 0 clamp(48px, 6vw, 72px)",
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
          PARTNERS
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
            <SectionLabel text="Our Network" />
          </motion.div>

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
              margin: "0 0 20px",
              maxWidth: 700,
            }}
          >
            Sponsors &amp; Partners
          </motion.h1>

          <div
            className="sponsors-hero-subtitle-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
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
              The organizations powering EFG events across cybersecurity, OT
              security, and operational excellence — from global technology leaders
              to emerging innovators.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              onClick={() => {
                document
                  .getElementById("become-a-sponsor")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="sponsors-hero-cta"
              style={{
                padding: "11px 26px",
                borderRadius: 100,
                background: "transparent",
                border: "1px solid rgba(232, 101, 26, 0.5)",
                color: "#E8651A",
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.3s ease",
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
              Become a Partner
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div
        className="sponsors-filter-bar"
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
              placeholder="Search sponsors..."
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
              Showing {filtered.length} of {sponsors.length} partners
            </span>
          )}
        </div>
      </div>

      {/* ── SPONSOR GRID ── */}
      <section
        ref={gridRef}
        style={{
          background: "#0A0A0A",
          padding: "clamp(32px, 4vw, 48px) 0 clamp(48px, 6vw, 72px)",
          minHeight: 400,
        }}
      >
        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                justifyContent: "center",
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
                No sponsors found
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
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                justifyContent: "center",
              }}
            >
              {filtered.map((sponsor, i) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SPONSOR INQUIRY FORM ── */}
      <SponsorInquiryForm />

      <Footer />

      {/* ── STYLES ── */}
      <style jsx global>{`
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
        @media (max-width: 600px) {
          .sponsors-hero-subtitle-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 18px !important;
          }
          .sponsors-hero-cta {
            width: 100% !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}
