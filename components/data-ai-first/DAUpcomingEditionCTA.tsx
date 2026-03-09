"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { DotMatrixGrid, ScanLines } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE } from "./constants";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

// ─────────────────────────────────────────────────────────────────────────────
// TAB DATA
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  {
    key: "attend",
    label: "Attend",
    heading: "Data & AI First\nKuwait",
    description:
      "The leadership summit dedicated to building AI-driven organizations. Join us in Kuwait.",
    perks: [
      { icon: "users", text: "Invite-only, C-suite audience" },
      { icon: "calendar", text: "Full-day immersive programme" },
      { icon: "shield", text: "Exclusive networking reception" },
    ],
    trust: "200+ senior leaders expected at Data & AI First Kuwait",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+965 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your interests..." },
    ],
    cta: "Register Interest",
  },
  {
    key: "sponsor",
    label: "Sponsor",
    heading: "Partner with\nData & AI First",
    description:
      "Put your brand in the room with top CDOs, CTOs, and AI leaders. Sponsorship packages are designed for maximum visibility and qualified lead generation.",
    perks: [
      { icon: "layers", text: "Boardroom hosting & keynote slots" },
      { icon: "target", text: "Qualified lead generation" },
      { icon: "eye", text: "Premium brand visibility worldwide" },
    ],
    trust: "30+ technology leaders have partnered with Data & AI First",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+965 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your sponsorship goals..." },
    ],
    cta: "Request Sponsorship Info",
  },
  {
    key: "speaker",
    label: "Speak",
    heading: "Share Your\nExpertise",
    description:
      "We platform practitioners, not salespeople. If you\u2019re a hands-on data or AI leader with real-world experience, we want you on stage.",
    perks: [
      { icon: "mic", text: "Keynote & panel opportunities" },
      { icon: "globe", text: "Reach 200+ senior data & AI leaders" },
      { icon: "award", text: "Join our speaker alumni network" },
    ],
    trust: "30+ practitioners have spoken at Data & AI First",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+965 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "topic", label: "Proposed Topic", type: "text", placeholder: "Brief topic or area of expertise" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your background..." },
    ],
    cta: "Submit Speaker Proposal",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PERK ICONS
// ─────────────────────────────────────────────────────────────────────────────

function PerkIcon({ type }: { type: string }) {
  const s: React.CSSProperties = { opacity: 0.7 };
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: s };
  if (type === "layers") return <svg {...props}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>;
  if (type === "target") return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
  if (type === "eye") return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
  if (type === "users") return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
  if (type === "calendar") return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
  if (type === "shield") return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
  if (type === "mic") return <svg {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>;
  if (type === "globe") return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
  return <svg {...props}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function DAUpcomingEditionCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("attend");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const tab = TABS.find((t) => t.key === activeTab)!;

  useEffect(() => {
    const target = new Date("2026-05-18T09:00:00");
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormError(null);
    setFormData({});
    setPhoneError(null);
    setEmailError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    const typeMap: Record<string, FormType> = { attend: "attend", sponsor: "sponsor", speaker: "speak" };
    const type = typeMap[activeTab] || "attend";

    const sharedMeta = { message: formData.message || "" };
    const metadataMap: Record<string, () => Record<string, string>> = {
      attend: () => ({ ...sharedMeta }),
      sponsor: () => ({ ...sharedMeta }),
      speaker: () => ({ ...sharedMeta, proposed_topic: formData.topic || "" }),
    };

    // Validate email
    const email = formData.email || "";
    if (!isWorkEmail(email)) {
      setEmailError("Please use your work email address");
      setIsLoading(false);
      return;
    }

    // Validate phone
    const phoneVal = validatePhone(formData.phone || "", selectedCountry);
    if (phoneVal) {
      setPhoneError(phoneVal);
      setIsLoading(false);
      return;
    }

    const combinedPhone = `${selectedCountry.code}${(formData.phone || "").replace(/[\s\-()]/g, "")}`;

    const meta = metadataMap[activeTab]?.() || {};
    const result = await submitForm({
      type,
      full_name: formData.name || "",
      email,
      company: formData.company || "",
      job_title: formData.title || "",
      phone: combinedPhone,
      event_name: "Data & AI First Kuwait 2026",
      metadata: meta,
    });

    setIsLoading(false);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setFormError(result.error || "Something went wrong.");
    }
  };

  return (
    <section
      ref={ref}
      id="register"
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0A0A0A 0%, rgba(15,115,94,0.04) 50%, #0A0A0A 100%)`,
        padding: "clamp(36px, 5vw, 56px) 24px",
      }}
    >
      {/* Textures */}
      <DotMatrixGrid color={EMERALD} opacity={0.02} spacing={28} />
      <ScanLines opacity={0.012} lineHeight={4} />

      {/* Gradient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          top: "30%",
          left: "20%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(15,115,94,0.05) 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Tab pills — top of section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}
        >
          <div className="flex items-center gap-3">
            <span style={{ width: 30, height: 2, background: EMERALD }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: EMERALD,
                fontFamily: "var(--font-outfit)",
              }}
            >
              Get Involved
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 6 }}>
            {TABS.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setActiveTab(t.key);
                    if (isSubmitted) resetForm();
                  }}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 40,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#0A0A0A" : "rgba(255,255,255,0.4)",
                    background: isActive ? EMERALD_BRIGHT : "rgba(255,255,255,0.04)",
                    border: isActive
                      ? `1px solid ${EMERALD_BRIGHT}`
                      : "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    letterSpacing: "0.2px",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Split layout */}
        <div
          className="da-cta-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* ── LEFT COLUMN: Editorial ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${activeTab}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* Headline */}
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(36px, 4.5vw, 56px)",
                  letterSpacing: "-2px",
                  lineHeight: 1.05,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                <span style={{ color: "var(--white)" }}>{tab.heading.split("\n")[0]}</span>
                {tab.heading.includes("\n") && (
                  <>
                    <br />
                    <span style={{ color: EMERALD_BRIGHT }}>{tab.heading.split("\n")[1]}</span>
                  </>
                )}
              </h2>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 16,
                  fontWeight: 300,
                  color: "#606060",
                  marginTop: 16,
                  lineHeight: 1.6,
                  maxWidth: 420,
                }}
              >
                {tab.description}
              </p>

              {/* Info Cards (attend tab) */}
              {activeTab === "attend" && (
                <div className="flex flex-wrap gap-3" style={{ marginTop: 32 }}>
                  <InfoCard label="Date" value="May 18, 2026" />
                  <InfoCard label="Location" value="Kuwait City" />
                  <InfoCard label="Format" value="Full-Day Summit" />
                </div>
              )}

              {/* Countdown (attend tab) */}
              {activeTab === "attend" && (
                <div style={{ marginTop: 32 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                      color: "#555555",
                      marginBottom: 12,
                    }}
                  >
                    Countdown
                  </p>
                  <div className="flex gap-3">
                    <CountdownUnit value={timeLeft.days} label="Days" />
                    <CountdownUnit value={timeLeft.hours} label="Hours" />
                    <CountdownUnit value={timeLeft.minutes} label="Min" />
                    <CountdownUnit value={timeLeft.seconds} label="Sec" isSeconds />
                  </div>
                </div>
              )}

              {/* Perks (sponsor/speaker tabs) */}
              {activeTab !== "attend" && (
                <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 16 }}>
                  {tab.perks.map((perk) => (
                    <div key={perk.text} className="flex items-center gap-3">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: `${EMERALD}15`,
                          border: `1px solid ${EMERALD}25`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: EMERALD_BRIGHT,
                          flexShrink: 0,
                        }}
                      >
                        <PerkIcon type={perk.icon} />
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
              )}

              {/* Trust Points (attend tab) */}
              {activeTab === "attend" && (
                <div className="flex flex-col gap-3" style={{ marginTop: 32 }}>
                  {["200+ senior leaders expected", "30+ expert speakers confirmed", "Exclusive networking reception"].map((point) => (
                    <div key={point} className="flex items-center gap-3">
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: `${EMERALD}15`,
                          border: `1px solid ${EMERALD}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={EMERALD_BRIGHT} strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "#707070" }}>
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Trust line (sponsor/speaker tabs) */}
              {activeTab !== "attend" && (
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.25)", letterSpacing: "0.3px", margin: 0 }}>
                    {tab.trust}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── RIGHT COLUMN: Form Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <div
              style={{
                borderRadius: 16,
                background: "rgba(15, 115, 94, 0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${EMERALD}18`,
                overflow: "hidden",
              }}
            >
              {/* Form header bar */}
              <div
                style={{
                  padding: "20px 28px",
                  borderBottom: `1px solid ${EMERALD}12`,
                  background: `rgba(15,115,94,0.03)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: EMERALD_BRIGHT,
                    boxShadow: `0 0 8px ${EMERALD}60`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--white)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {tab.cta}
                </span>
              </div>

              {/* Form body */}
              <div style={{ padding: "28px 28px 32px" }}>
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      style={{ textAlign: "center", padding: "40px 20px" }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        style={{
                          width: 56, height: 56, borderRadius: "50%",
                          background: `${EMERALD}20`, border: `2px solid ${EMERALD}40`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          margin: "0 auto 20px",
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={EMERALD_BRIGHT} strokeWidth="2.5">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--white)", margin: "0 0 8px" }}>
                        {activeTab === "attend" ? "You\u2019re on the List" : "Inquiry Submitted"}
                      </h3>
                      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "#606060", maxWidth: 300, margin: "0 auto 20px", lineHeight: 1.6 }}>
                        {activeTab === "attend"
                          ? "We\u2019ll notify you when full registration opens for Data & AI First Kuwait. Expect early-bird access and the full agenda in your inbox."
                          : "Our team will review your submission and get back to you within 2 business days."}
                      </p>
                      <button
                        onClick={resetForm}
                        style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: EMERALD_BRIGHT, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        Submit another inquiry &rarr;
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key={`form-${activeTab}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      onSubmit={handleSubmit}
                    >
                      <div
                        className="da-form-name-row"
                        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
                      >
                        {tab.fields.slice(0, 2).map((field) => {
                          if (field.name === "email") {
                            return (
                              <div key={field.name} style={{ marginBottom: 16 }}>
                                <label style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "#686868", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
                                  {field.label}<span style={{ color: EMERALD, marginLeft: 3 }}>*</span>
                                </label>
                                <input
                                  name={field.name} type={field.type} placeholder={field.placeholder} required value={formData[field.name] || ""}
                                  onChange={(e) => { handleChange(field.name, e.target.value); setEmailError(null); }}
                                  style={{ width: "100%", background: "#0a0a0a", border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 8, padding: "11px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "var(--white)", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s" }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = `${EMERALD}50`; e.currentTarget.style.boxShadow = `0 0 0 3px ${EMERALD}10`; }}
                                  onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                    e.currentTarget.style.boxShadow = "none";
                                    const val = formData[field.name] || e.target.value;
                                    if (val && !isWorkEmail(val)) {
                                      setEmailError("Please use your work email address");
                                    }
                                  }}
                                />
                                {emailError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0", fontFamily: "var(--font-outfit)" }}>{emailError}</p>}
                              </div>
                            );
                          }
                          return (
                            <FormInput
                              key={field.name}
                              name={field.name}
                              label={field.label}
                              placeholder={field.placeholder}
                              type={field.type}
                              value={formData[field.name] || ""}
                              onChange={(v) => handleChange(field.name, v)}
                              required
                            />
                          );
                        })}
                      </div>

                      {tab.fields.slice(2).map((field) => {
                        if (field.type === "tel") {
                          return (
                            <div key={field.name} style={{ marginBottom: 16 }}>
                              <label style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "#686868", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
                                {field.label}
                              </label>
                              <div style={{ display: "flex", gap: 8 }}>
                                <select
                                  value={`${selectedCountry.code}|${selectedCountry.country}`}
                                  onChange={(e) => {
                                    const [code, country] = e.target.value.split("|");
                                    const found = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country);
                                    if (found) setSelectedCountry(found);
                                  }}
                                  style={{ width: 120, flexShrink: 0, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "11px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "var(--white)", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s", appearance: "none" as const, cursor: "pointer" }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = `${EMERALD}50`; e.currentTarget.style.boxShadow = `0 0 0 3px ${EMERALD}10`; }}
                                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                                >
                                  {COUNTRY_CODES.map((cc) => (
                                    <option key={`${cc.code}|${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>
                                      {cc.country} {cc.code}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="tel"
                                  value={formData[field.name] || ""}
                                  onChange={(e) => { handleChange(field.name, e.target.value); setPhoneError(null); }}
                                  placeholder={selectedCountry.placeholder}
                                  style={{ flex: 1, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "11px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "var(--white)", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s" }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = `${EMERALD}50`; e.currentTarget.style.boxShadow = `0 0 0 3px ${EMERALD}10`; }}
                                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                                />
                              </div>
                              {phoneError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0", fontFamily: "var(--font-outfit)" }}>{phoneError}</p>}
                            </div>
                          );
                        }
                        if (field.type === "textarea") {
                          return (
                            <FormTextarea
                              key={field.name}
                              name={field.name}
                              label={field.label}
                              placeholder={field.placeholder}
                              value={formData[field.name] || ""}
                              onChange={(v) => handleChange(field.name, v)}
                            />
                          );
                        }
                        return (
                          <FormInput
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            placeholder={field.placeholder}
                            type={field.type}
                            value={formData[field.name] || ""}
                            onChange={(v) => handleChange(field.name, v)}
                            required={field.type !== "tel"}
                          />
                        );
                      })}

                      {/* Honeypot */}
                      <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                      {formError && (
                        <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 13, margin: "8px 0 0" }}>
                          {formError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="transition-all"
                        style={{
                          width: "100%",
                          background: isLoading ? `${EMERALD}80` : `linear-gradient(135deg, ${EMERALD}, ${EMERALD_BRIGHT})`,
                          border: "none",
                          borderRadius: 10,
                          padding: "14px",
                          fontFamily: "var(--font-outfit)",
                          fontSize: 14,
                          fontWeight: 600,
                          letterSpacing: "0.5px",
                          color: "var(--white)",
                          cursor: isLoading ? "wait" : "pointer",
                          marginTop: 8,
                          transitionDuration: "0.3s",
                        }}
                      >
                        {isLoading ? "Submitting..." : `${tab.cta} \u2192`}
                      </button>

                      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "#4a4a4a", textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
                        By submitting, you agree to receive updates about Data & AI First.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .da-cta-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 600px) {
          .da-form-name-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "12px 20px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#686868", margin: 0 }}>{label}</p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--white)", margin: "4px 0 0" }}>{value}</p>
    </div>
  );
}

function CountdownUnit({ value, label, isSeconds = false }: { value: number; label: string; isSeconds?: boolean }) {
  const [showPulse, setShowPulse] = useState(false);
  useEffect(() => {
    if (!isSeconds) return;
    setShowPulse(true);
    const t = setTimeout(() => setShowPulse(false), 400);
    return () => clearTimeout(t);
  }, [value, isSeconds]);

  return (
    <div style={{ textAlign: "center", padding: "10px 14px", borderRadius: 10, background: "rgba(15, 115, 94, 0.06)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${EMERALD}15`, minWidth: 56, boxShadow: showPulse ? `0 0 16px rgba(15, 115, 94, 0.3)` : "none", transition: "box-shadow 0.3s ease-out" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: EMERALD_BRIGHT, margin: 0, lineHeight: 1 }}>{value.toString().padStart(2, "0")}</p>
      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 8, color: "#555555", textTransform: "uppercase", letterSpacing: "1px", marginTop: 4 }}>{label}</p>
    </div>
  );
}

function FormInput({ name, label, placeholder, type = "text", value, onChange, required = false }: { name: string; label: string; placeholder: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "#686868", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
        {label}{required && <span style={{ color: EMERALD, marginLeft: 3 }}>*</span>}
      </label>
      <input
        name={name} type={type} placeholder={placeholder} required={required} value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${isFocused ? `${EMERALD}50` : "rgba(255,255,255,0.08)"}`, borderRadius: 8, padding: "11px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "var(--white)", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s", boxShadow: isFocused ? `0 0 0 3px ${EMERALD}10` : "none" }}
        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

function FormTextarea({ name, label, placeholder, value, onChange }: { name: string; label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "#686868", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>{label}</label>
      <textarea
        name={name} placeholder={placeholder} value={value} rows={3}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${isFocused ? `${EMERALD}50` : "rgba(255,255,255,0.08)"}`, borderRadius: 8, padding: "11px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "var(--white)", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s", boxShadow: isFocused ? `0 0 0 3px ${EMERALD}10` : "none", resize: "vertical", minHeight: 72 }}
        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

function FormSelect({ name, label, value, onChange, options, placeholder, required = false }: { name: string; label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; required?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16, position: "relative" }}>
      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "#686868", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
        {label}{required && <span style={{ color: EMERALD, marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        <select
          name={name} required={required} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${isFocused ? `${EMERALD}50` : "rgba(255,255,255,0.08)"}`, borderRadius: 8, padding: "11px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: value ? "var(--white)" : "#686868", outline: "none", cursor: "pointer", appearance: "none", transition: "border-color 0.3s, box-shadow 0.3s", boxShadow: isFocused ? `0 0 0 3px ${EMERALD}10` : "none" }}
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
        >
          <option value="" style={{ color: "#222", background: "#fff" }}>{placeholder || "Select..."}</option>
          {options.map((opt) => <option key={opt} value={opt} style={{ color: "#222", background: "#fff" }}>{opt}</option>)}
        </select>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={EMERALD} strokeWidth="2" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
