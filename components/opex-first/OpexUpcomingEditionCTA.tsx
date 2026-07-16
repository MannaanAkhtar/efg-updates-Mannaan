"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const OFFWHITE = "#F4F2FA";
const EASE = [0.16, 1, 0.3, 1] as const;
const SERIF = `Georgia, "Cambria", "Times New Roman", serif`;

const nextEdition = {
  name: "OPEX First KSA",
  edition: "Riyadh Edition",
  date: new Date("2026-10-21T09:00:00"),
  dateString: "21 October 2026",
  city: "Riyadh, KSA",
  theme: "Vision to Value — Merging AI & Process Excellence",
};

const trustPoints = [
  "Complimentary for qualified end-users",
  "Vendor & sponsor passes available",
  "Curated to a senior operations audience",
];

// ─────────────────────────────────────────────────────────────────────────────
// TAB DATA
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  {
    key: "attend",
    label: "Attend",
    heading: "The flagship\nreturns to Riyadh",
    description:
      "OPEX First KSA returns on 21 October 2026 under the theme Vision to Value — merging AI and process excellence. Registration is open for qualified delegates.",
    perks: [
      { icon: "users", text: "Invite-only, C-suite audience" },
      { icon: "calendar", text: "Full-day immersive programme" },
      { icon: "shield", text: "Chatham House Rule sessions" },
    ],
    trust: "500+ senior operations leaders attended OPEX First since 2023",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+966 xx xxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your interests..." },
    ],
    cta: "Register Interest",
  },
  {
    key: "sponsor",
    label: "Sponsor",
    heading: "Partner with\nOPEX First",
    description:
      "Put your brand in the room with top COOs, CTOs, and operations leaders. Sponsorship packages are designed for maximum visibility and qualified lead generation.",
    perks: [
      { icon: "layers", text: "Boardroom hosting & keynote slots" },
      { icon: "target", text: "Qualified lead generation" },
      { icon: "eye", text: "Premium brand visibility worldwide" },
    ],
    trust: "40+ technology leaders have partnered with OPEX First",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+966 xx xxx xxxx" },
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
      "We platform practitioners, not salespeople. If you’re a hands-on operations leader with real-world experience, we want you on stage at OPEX First.",
    perks: [
      { icon: "mic", text: "Keynote & panel opportunities" },
      { icon: "globe", text: "Reach 500+ senior operations leaders" },
      { icon: "award", text: "Join our speaker alumni network" },
    ],
    trust: "60+ practitioners have spoken at OPEX First since 2023",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+966 xx xxx xxxx" },
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
  const s: React.CSSProperties = { opacity: 0.85 };
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

export default function OpexUpcomingEditionCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("attend");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const tab = TABS.find((t) => t.key === activeTab)!;

  // Allow other sections (e.g. the hero "Become a Sponsor" CTA) to open a specific tab.
  useEffect(() => {
    const onSelectTab = (e: Event) => {
      const key = (e as CustomEvent<string>).detail;
      if (key && TABS.some((t) => t.key === key)) {
        setActiveTab(key);
        setIsSubmitted(false);
      }
    };
    window.addEventListener("opex-register:tab", onSelectTab as EventListener);
    return () => window.removeEventListener("opex-register:tab", onSelectTab as EventListener);
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
      event_name: "OPEX First KSA",
      metadata: meta,
    });

    setIsLoading(false);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setFormError(result.error || "Something went wrong.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 14,
    fontWeight: 400,
    outline: "none",
    transition: "border-color 0.3s ease, background 0.3s ease",
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

  return (
    <section
      ref={sectionRef}
      id="register"
      style={{
        background: "transparent",
        padding: "clamp(56px, 6.5vw, 96px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 700px 500px at 20% 40%, rgba(124,58,237,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 80% 60%, rgba(124,58,237,0.035) 0%, transparent 70%)
          `,
        }}
      />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", position: "relative" }}>
        {/* ── Editorial masthead ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 20 }}>
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: VIOLET_BRIGHT }}>№</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.34)" }}>
              The Invitation
            </span>
          </div>
          <span style={{ display: "block", width: 24, height: 1, background: VIOLET_BRIGHT, marginBottom: 14 }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "3.4px", textTransform: "uppercase", color: VIOLET_BRIGHT }}>
            Reserve Your Seat
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(32px, 3.6vw, 54px)", letterSpacing: "-1.4px", lineHeight: 1.04, color: OFFWHITE, margin: "16px 0 0" }}>
            Get Involved with{" "}
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: VIOLET_BRIGHT }}>
              OPEX First.
            </span>
          </h2>
        </motion.div>

        {/* ── Tab toggle ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="opex-cta-tabs"
        >
          {TABS.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); if (isSubmitted) resetForm(); }}
                className={`opex-cta-tab${isActive ? " opex-cta-tab-on" : ""}`}
              >
                {t.label}
              </button>
            );
          })}
        </motion.div>

        <div className="opex-cta-rule" />

        {/* ── Split layout ───────────────────────────────────── */}
        <div className="opex-cta-container">
          {/* ── LEFT: edition dossier ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${activeTab}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(28px, 3vw, 44px)", letterSpacing: "-1.4px", color: OFFWHITE, lineHeight: 1.08, margin: 0, whiteSpace: "pre-line" }}>
                {tab.heading}
              </h3>

              {/* Edition dateline (attend only) */}
              {activeTab === "attend" && (
                <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(14px, 1.15vw, 16px)", color: VIOLET_BRIGHT, margin: "14px 0 0", lineHeight: 1.5 }}>
                  {nextEdition.edition} · {nextEdition.dateString} · {nextEdition.city}
                </p>
              )}

              {/* Description */}
              <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: "clamp(14px, 1.2vw, 16px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "18px 0 0", maxWidth: 440 }}>
                {tab.description}
              </p>

              {/* Perks */}
              <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 15 }}>
                {tab.perks.map((perk) => (
                  <div key={perk.text} className="flex items-center gap-3">
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: VIOLET_BRIGHT, flexShrink: 0 }}>
                      <PerkIcon type={perk.icon} />
                    </div>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>{perk.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust */}
              {activeTab === "attend" ? (
                <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  {trustPoints.map((point, index) => (
                    <motion.div key={point} initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.4, delay: 0.4 + index * 0.1, ease: EASE }} className="flex items-center gap-2" style={{ marginTop: index > 0 ? 9 : 0 }}>
                      <span style={{ color: VIOLET_BRIGHT, fontSize: 13 }}>&#10003;</span>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 400, color: "rgba(255,255,255,0.42)" }}>{point}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2px", margin: 0 }}>{tab.trust}</p>
                </div>
              )}

              {/* Secondary CTA (attend only) */}
              {activeTab === "attend" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.6, delay: 0.6, ease: EASE }} style={{ marginTop: 26 }}>
                  <Link href="/sponsors-and-partners" className="opex-cta-secondary">
                    Sponsor this edition
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── RIGHT: form plate ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="opex-cta-plate"
          >
            {/* Crop marks */}
            <span className="opex-cta-crop" style={{ top: 12, left: 12, borderTop: "1px solid rgba(159,103,255,0.3)", borderLeft: "1px solid rgba(159,103,255,0.3)" }} />
            <span className="opex-cta-crop" style={{ top: 12, right: 12, borderTop: "1px solid rgba(159,103,255,0.3)", borderRight: "1px solid rgba(159,103,255,0.3)" }} />
            <span className="opex-cta-crop" style={{ bottom: 12, left: 12, borderBottom: "1px solid rgba(159,103,255,0.3)", borderLeft: "1px solid rgba(159,103,255,0.3)" }} />
            <span className="opex-cta-crop" style={{ bottom: 12, right: 12, borderBottom: "1px solid rgba(159,103,255,0.3)", borderRight: "1px solid rgba(159,103,255,0.3)" }} />

            <div className="absolute pointer-events-none" style={{ top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px, 2.5vw, 26px)", letterSpacing: "-0.5px", color: "white", margin: "0 0 8px" }}>
                    {activeTab === "attend" ? "Thank you!" : "Inquiry Submitted"}
                  </h3>
                  <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 14, color: "#A0A0A0", margin: "0 0 20px", lineHeight: 1.6 }}>
                    {activeTab === "attend" ? "We’ll be in touch with event details." : "Our team will review your submission and get back to you within 2 working hours."}
                  </p>
                  <button onClick={resetForm} style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: VIOLET_BRIGHT, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Submit another inquiry &rarr;
                  </button>
                </motion.div>
              ) : (
                <motion.div key={`form-${activeTab}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }} style={{ position: "relative" }}>
                  <form onSubmit={handleSubmit}>
                    <div className="opex-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
                                    const found = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country);
                                    if (found) setSelectedCountry(found);
                                  }}
                                  style={{ ...inputStyle, width: 120, flexShrink: 0, appearance: "none" as const, cursor: "pointer" }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
                                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
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
                                  maxLength={selectedCountry.length}
                                  style={{ ...inputStyle, flex: 1 }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
                                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                                />
                              </div>
                              {phoneError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0", fontFamily: "var(--font-outfit)" }}>{phoneError}</p>}
                            </div>
                          );
                        }
                        if (field.name === "email") {
                          return (
                            <div key={field.name}>
                              <label style={labelStyle}>{field.label}</label>
                              <input
                                type={field.type}
                                value={formData[field.name] || ""}
                                onChange={(e) => { handleChange(field.name, e.target.value); setEmailError(null); }}
                                placeholder={field.placeholder}
                                required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
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
                          <div key={field.name} style={{ gridColumn: isFullWidth ? "1 / -1" : undefined }}>
                            <label style={labelStyle}>{field.label}</label>
                            {field.type === "textarea" ? (
                              <textarea value={formData[field.name] || ""} onChange={(e) => handleChange(field.name, e.target.value)} placeholder={field.placeholder} rows={3}
                                style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                              />
                            ) : (
                              <input type={field.type} value={formData[field.name] || ""} onChange={(e) => handleChange(field.name, e.target.value)} placeholder={field.placeholder} required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                    {formError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 13, margin: "8px 0 0" }}>{formError}</p>}

                    <button type="submit" disabled={isLoading} className="w-full transition-all duration-300"
                      style={{ width: "100%", marginTop: 20, padding: "14px 28px", borderRadius: 8, background: isLoading ? `${VIOLET}80` : VIOLET, color: "white", fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, border: "none", cursor: isLoading ? "wait" : "pointer", opacity: isLoading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                      onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = VIOLET_BRIGHT; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,58,237,0.2)"; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = isLoading ? `${VIOLET}80` : VIOLET; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      {isLoading ? "Submitting..." : tab.cta} {!isLoading && <span>&rarr;</span>}
                    </button>
                  </form>

                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.22)", textAlign: "center", margin: "14px 0 0" }}>
                    By submitting, you agree to receive event communications from Events First Group.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .opex-cta-tabs {
          display: flex;
          gap: 8px;
          margin-top: clamp(28px, 3.4vw, 44px);
        }
        .opex-cta-tab {
          padding: 9px 22px;
          border-radius: 999px;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.2px;
          color: rgba(255, 255, 255, 0.42);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-cta-tab:hover {
          color: rgba(255, 255, 255, 0.72);
          border-color: rgba(159, 103, 255, 0.3);
        }
        .opex-cta-tab-on {
          color: #fff;
          font-weight: 600;
          background: ${VIOLET};
          border-color: ${VIOLET};
        }
        .opex-cta-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: clamp(22px, 2.6vw, 32px) 0 clamp(34px, 4vw, 52px);
        }

        .opex-cta-container {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: clamp(32px, 4vw, 64px);
          align-items: start;
        }

        .opex-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 24px;
          border-radius: 999px;
          border: 1px solid rgba(159, 103, 255, 0.28);
          background: transparent;
          text-decoration: none;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
          color: ${VIOLET_BRIGHT};
          transition: color 0.4s, border-color 0.4s, background 0.4s;
        }
        .opex-cta-secondary:hover {
          color: #fff;
          border-color: rgba(159, 103, 255, 0.55);
          background: rgba(124, 58, 237, 0.12);
        }
        .opex-cta-secondary svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .opex-cta-secondary:hover svg {
          transform: translateX(3px);
        }

        .opex-cta-plate {
          position: relative;
          border-radius: 4px;
          border: 1px solid rgba(124, 58, 237, 0.12);
          background: rgba(255, 255, 255, 0.02);
          padding: clamp(26px, 3vw, 40px);
          overflow: hidden;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }
        .opex-cta-crop {
          position: absolute;
          width: 14px;
          height: 14px;
          z-index: 3;
          pointer-events: none;
        }

        @media (max-width: 860px) {
          .opex-cta-container {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 500px) {
          .opex-form-grid {
            grid-template-columns: 1fr !important;
          }
          .opex-cta-tabs {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </section>
  );
}
