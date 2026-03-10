"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

const OT_CRIMSON = "#D34B9A";
const EASE = [0.16, 1, 0.3, 1] as const;

const trustPoints = [
  "34 expert speakers confirmed",
  "150+ security leaders attended",
  "Expanding to multiple cities",
];

const industries = [
  "Oil & Gas",
  "Power & Utilities",
  "Manufacturing",
  "Petrochemicals",
  "Water & Wastewater",
  "Transportation",
  "Mining",
  "Other",
];

// ─────────────────────────────────────────────────────────────────────────────
// TAB DATA
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  {
    key: "attend",
    label: "Attend",
    heading: "Next Edition",
    description:
      "Register your interest for the next OT Security First summit. Be the first to know when dates and venue are confirmed.",
    perks: [
      { icon: "users", text: "Invite-only, OT security leaders" },
      { icon: "shield", text: "Critical infrastructure focus" },
      { icon: "calendar", text: "Full-day in-person summit" },
    ],
    trust: "150+ OT security leaders attended the first edition",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+971 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your interests..." },
    ],
    cta: "Register Interest",
  },
  {
    key: "sponsor",
    label: "Sponsor",
    heading: "Partner with\nOT Security First",
    description:
      "Put your brand in the room with top OT security leaders. Sponsorship packages are designed for maximum visibility in the industrial cybersecurity space.",
    perks: [
      { icon: "layers", text: "Boardroom hosting & keynote slots" },
      { icon: "target", text: "Qualified OT buyer lead generation" },
      { icon: "eye", text: "Premium brand visibility worldwide" },
    ],
    trust: "20+ OT security vendors have partnered with OT Security First",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+971 xxxx xxxx" },
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
      "We platform practitioners from critical infrastructure sectors. If you\u2019re a hands-on OT security leader with real-world experience, we want you on stage.",
    perks: [
      { icon: "mic", text: "Keynote & panel opportunities" },
      { icon: "globe", text: "Reach 150+ OT security leaders" },
      { icon: "award", text: "Join our speaker alumni network" },
    ],
    trust: "34+ practitioners have spoken at OT Security First",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+971 xxxx xxxx" },
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

export default function OTUpcomingEditionCTA() {
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
      event_name: "OT Security First — Next Edition",
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
      id="register"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "var(--black)", padding: "clamp(48px, 6vw, 80px) 0" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(45deg, ${OT_CRIMSON} 25%, transparent 25%), linear-gradient(-45deg, ${OT_CRIMSON} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${OT_CRIMSON} 75%), linear-gradient(-45deg, transparent 75%, ${OT_CRIMSON} 75%)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
        }}
      />

      <div className="relative z-10" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          {/* Tab pills row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div className="flex items-center gap-3">
              <span style={{ width: 30, height: 2, background: OT_CRIMSON }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: OT_CRIMSON }}>
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
                    onClick={() => { setActiveTab(t.key); if (isSubmitted) resetForm(); }}
                    style={{
                      padding: "8px 20px", borderRadius: 40, fontFamily: "var(--font-outfit)", fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "white" : "rgba(255,255,255,0.4)",
                      background: isActive ? OT_CRIMSON : "rgba(255,255,255,0.04)",
                      border: isActive ? `1px solid ${OT_CRIMSON}` : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer", transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)", letterSpacing: "0.2px",
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Centered header (attend only) */}
          {activeTab === "attend" && (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-2px", color: "var(--white)", lineHeight: 1.1, margin: "0" }}>
                Next <span style={{ color: OT_CRIMSON }}>Edition</span>
              </h2>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 300, color: "#808080", marginTop: 12, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                Register your interest for the next OT Security First summit. Date and venue to be announced.
              </p>
            </div>
          )}
        </motion.div>

        {/* Two-column layout */}
        <div className="ot-cta-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          {/* LEFT */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${activeTab}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* Headline for sponsor/speaker tabs */}
              {activeTab !== "attend" && (
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 3.5vw, 50px)", letterSpacing: "-2px", color: "var(--white)", lineHeight: 1.08, margin: "0 0 16px", whiteSpace: "pre-line" }}>
                  {tab.heading}
                </h2>
              )}

              {/* Description for sponsor/speaker */}
              {activeTab !== "attend" && (
                <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: "clamp(14px, 1.2vw, 16px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 440 }}>
                  {tab.description}
                </p>
              )}

              {/* Info cards (attend only) */}
              {activeTab === "attend" && (
                <div className="flex flex-wrap gap-3" style={{ marginBottom: 28 }}>
                  <InfoCard label="Location" value="To Be Announced" />
                  <InfoCard label="Date" value="Coming Soon" />
                  <InfoCard label="Format" value="In-Person" />
                </div>
              )}

              {/* Perks (sponsor/speaker) */}
              {activeTab !== "attend" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                  {tab.perks.map((perk) => (
                    <div key={perk.text} className="flex items-center gap-3">
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${OT_CRIMSON}10`, border: `1px solid ${OT_CRIMSON}20`, display: "flex", alignItems: "center", justifyContent: "center", color: OT_CRIMSON, flexShrink: 0 }}>
                        <PerkIcon type={perk.icon} />
                      </div>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.55)" }}>{perk.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Trust points (attend) */}
              {activeTab === "attend" && (
                <div className="flex flex-col gap-3" style={{ marginBottom: 28 }}>
                  {trustPoints.map((point, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: EASE }} className="flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={OT_CRIMSON} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "#808080" }}>{point}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Trust line (sponsor/speaker) */}
              {activeTab !== "attend" && (
                <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.25)", letterSpacing: "0.3px", margin: 0 }}>{tab.trust}</p>
                </div>
              )}

              {/* Sponsor button (attend only) */}
              {activeTab === "attend" && <SponsorButton />}
            </motion.div>
          </AnimatePresence>

          {/* RIGHT — Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ background: "var(--black-card)", border: `1px solid ${OT_CRIMSON}30`, borderRadius: 10, padding: "60px 32px", textAlign: "center" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                    style={{ width: 64, height: 64, borderRadius: 8, background: `${OT_CRIMSON}20`, border: `1px solid ${OT_CRIMSON}40`, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={OT_CRIMSON} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </motion.div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--white)", margin: 0 }}>
                    {activeTab === "attend" ? "You\u2019re on the List" : "Inquiry Submitted"}
                  </h3>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 300, color: "#808080", marginTop: 12, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
                    {activeTab === "attend"
                      ? "We\u2019ll notify you when registration opens. Expect early-bird access and agenda previews in your inbox."
                      : "Our team will review your submission and get back to you within 2 business days."}
                  </p>
                  <button onClick={resetForm} style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: OT_CRIMSON, background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 20 }}>
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
                  style={{ background: "var(--black-card)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: 10, padding: "32px 28px" }}
                >
                  <div className="ot-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {tab.fields.map((field) => {
                      const isFullWidth = field.type === "textarea" || field.type === "tel";
                      if (field.type === "tel") {
                        return (
                          <div key={field.name} style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#606060", marginBottom: 8 }}>
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
                                style={{ width: 120, flexShrink: 0, background: "#0a0a0a", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 6, padding: "12px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, color: "var(--white)", outline: "none", transition: "border-color 0.3s", appearance: "none" as const, cursor: "pointer" }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = `${OT_CRIMSON}60`; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; }}
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
                                className="w-full transition-all"
                                style={{ flex: 1, background: "#0a0a0a", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 6, padding: "12px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, color: "var(--white)", outline: "none", transitionDuration: "0.3s" }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = `${OT_CRIMSON}60`; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; }}
                              />
                            </div>
                            {phoneError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0", fontFamily: "var(--font-outfit)" }}>{phoneError}</p>}
                          </div>
                        );
                      }
                      if (field.name === "email") {
                        return (
                          <div key={field.name}>
                            <label style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#606060", marginBottom: 8 }}>
                              {field.label}<span style={{ color: OT_CRIMSON }}> *</span>
                            </label>
                            <input
                              name={field.name} type={field.type} required value={formData[field.name] || ""}
                              onChange={(e) => { handleChange(field.name, e.target.value); setEmailError(null); }}
                              className="w-full transition-all"
                              style={{ background: "#0a0a0a", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 6, padding: "12px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, color: "var(--white)", outline: "none", transitionDuration: "0.3s", width: "100%" }}
                              onFocus={(e) => { e.currentTarget.style.borderColor = `${OT_CRIMSON}60`; }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
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
                          {field.type === "select" ? (
                            <OTFormSelect
                              name={field.name}
                              label={field.label}
                              value={formData[field.name] || ""}
                              onChange={(v) => handleChange(field.name, v)}
                              options={industries}
                              required
                            />
                          ) : field.type === "textarea" ? (
                            <OTFormTextarea
                              name={field.name}
                              label={field.label}
                              value={formData[field.name] || ""}
                              onChange={(v) => handleChange(field.name, v)}
                            />
                          ) : (
                            <OTFormInput
                              name={field.name}
                              label={field.label}
                              type={field.type}
                              value={formData[field.name] || ""}
                              onChange={(v) => handleChange(field.name, v)}
                              required
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                  {formError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 13, margin: "8px 0 0" }}>{formError}</p>}

                  <button type="submit" disabled={isLoading} className="w-full transition-all"
                    style={{ marginTop: 24, padding: "16px 32px", borderRadius: 6, background: isLoading ? `${OT_CRIMSON}80` : OT_CRIMSON, border: "none", fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: "var(--white)", cursor: isLoading ? "wait" : "pointer", transitionDuration: "0.3s", width: "100%" }}
                  >
                    {isLoading ? "Submitting..." : `${tab.cta} \u2192`}
                  </button>

                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "#606060", textAlign: "center", marginTop: 14 }}>
                    By submitting, you agree to receive updates about OT Security First.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .ot-cta-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .ot-form-grid {
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
    <div style={{ background: "var(--black-card)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: 8, padding: "16px 24px", minWidth: 120 }}>
      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#606060", margin: 0 }}>{label}</p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)", margin: "6px 0 0" }}>{value}</p>
    </div>
  );
}

function SponsorButton() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a href="mailto:partnerships@eventsfirstgroup.com" className="inline-flex items-center gap-2 transition-all"
      style={{ padding: "14px 28px", borderRadius: 6, border: isHovered ? `1px solid ${OT_CRIMSON}` : `1px solid ${OT_CRIMSON}50`, background: isHovered ? `${OT_CRIMSON}15` : "transparent", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: isHovered ? OT_CRIMSON : "#808080", transitionDuration: "0.4s", transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
      Sponsor This Edition
      <span className="transition-transform" style={{ transform: isHovered ? "translateX(4px)" : "translateX(0)", transitionDuration: "0.3s" }}>&rarr;</span>
    </a>
  );
}

function OTFormInput({ name, label, type, value, onChange, required }: { name: string; label: string; type: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#606060", marginBottom: 8 }}>
        {label}{required && <span style={{ color: OT_CRIMSON }}> *</span>}
      </label>
      <input name={name} type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full transition-all"
        style={{ background: "#0a0a0a", border: isFocused ? `1px solid ${OT_CRIMSON}60` : "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 6, padding: "12px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, color: "var(--white)", outline: "none", transitionDuration: "0.3s", width: "100%" }}
        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

function OTFormTextarea({ name, label, value, onChange }: { name: string; label: string; value: string; onChange: (v: string) => void }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#606060", marginBottom: 8 }}>{label}</label>
      <textarea name={name} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full transition-all"
        style={{ background: "#0a0a0a", border: isFocused ? `1px solid ${OT_CRIMSON}60` : "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 6, padding: "12px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, color: "var(--white)", outline: "none", transitionDuration: "0.3s", width: "100%", resize: "vertical", minHeight: 72 }}
        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

function OTFormSelect({ name, label, value, onChange, options, required }: { name: string; label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#606060", marginBottom: 8 }}>
        {label}{required && <span style={{ color: OT_CRIMSON }}> *</span>}
      </label>
      <select name={name} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full transition-all"
        style={{ background: "#0a0a0a", border: isFocused ? `1px solid ${OT_CRIMSON}60` : "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 6, padding: "12px 14px", fontFamily: "var(--font-outfit)", fontSize: 14, color: value ? "var(--white)" : "#606060", outline: "none", transitionDuration: "0.3s", cursor: "pointer", width: "100%" }}
        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
      >
        <option value="">Select...</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
