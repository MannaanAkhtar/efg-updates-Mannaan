"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { submitForm } from "@/lib/form-helpers";
import type { FormType } from "@/lib/form-helpers";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const EASE = [0.16, 1, 0.3, 1] as const;

const nextEdition = {
  name: "Opex First Kuwait",
  edition: "3rd Edition",
  date: new Date("2027-03-15T09:00:00"),
  dateString: "Date TBA",
  city: "Kuwait City",
  venue: "Venue TBA",
};

const trustPoints = [
  "Complimentary for qualified end-users",
  "Vendor/sponsor passes available",
  "Limited to 300 delegates per edition",
];

// ─────────────────────────────────────────────────────────────────────────────
// TAB DATA
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  {
    key: "attend",
    label: "Attend",
    heading: "Opex First is\nExpanding",
    description:
      "After successful editions in Riyadh and Abu Dhabi, Opex First is expanding to Kuwait and Doha. Be part of the next chapter.",
    perks: [
      { icon: "users", text: "Invite-only, C-suite audience" },
      { icon: "calendar", text: "Full-day immersive programme" },
      { icon: "shield", text: "Chatham House Rule sessions" },
    ],
    trust: "500+ senior operations leaders attended Opex First since 2023",
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
    heading: "Partner with\nOpex First",
    description:
      "Put your brand in the room with top COOs, CTOs, and operations leaders. Sponsorship packages are designed for maximum visibility and qualified lead generation.",
    perks: [
      { icon: "layers", text: "Boardroom hosting & keynote slots" },
      { icon: "target", text: "Qualified lead generation" },
      { icon: "eye", text: "Premium brand visibility worldwide" },
    ],
    trust: "40+ technology leaders have partnered with Opex First",
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
      "We platform practitioners, not salespeople. If you\u2019re a hands-on operations leader with real-world experience, we want you on stage at Opex First.",
    perks: [
      { icon: "mic", text: "Keynote & panel opportunities" },
      { icon: "globe", text: "Reach 500+ senior operations leaders" },
      { icon: "award", text: "Join our speaker alumni network" },
    ],
    trust: "60+ practitioners have spoken at Opex First since 2023",
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

export default function OpexUpcomingEditionCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [daysUntil, setDaysUntil] = useState(0);
  const [activeTab, setActiveTab] = useState("attend");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const tab = TABS.find((t) => t.key === activeTab)!;

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const diff = nextEdition.date.getTime() - now.getTime();
      setDaysUntil(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    };
    calculateDays();
    const timer = setInterval(calculateDays, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormError(null);
    setFormData({});
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

    const meta = metadataMap[activeTab]?.() || {};
    const result = await submitForm({
      type,
      full_name: formData.name || "",
      email: formData.email || "",
      company: formData.company || "",
      job_title: formData.title || "",
      phone: formData.phone || "",
      event_name: "Opex First Kuwait",
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
    borderRadius: 10,
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
        background: `linear-gradient(135deg, #0A0A0A 0%, rgba(124, 58, 237, 0.03) 50%, #0A0A0A 100%)`,
        padding: "clamp(36px, 4vw, 56px) 0",
        borderTop: "1px solid rgba(124, 58, 237, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 700px 500px at 20% 40%, rgba(124,58,237,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 80% 60%, rgba(124,58,237,0.03) 0%, transparent 70%)
          `,
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        {/* Tab pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}
        >
          <div className="flex items-center gap-3">
            <span style={{ width: 30, height: 1, background: VIOLET, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: VIOLET, fontFamily: "var(--font-outfit)" }}>
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
                    background: isActive ? VIOLET : "rgba(255,255,255,0.04)",
                    border: isActive ? `1px solid ${VIOLET}` : "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer", transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)", letterSpacing: "0.2px",
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
          className="opex-cta-container"
          style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: "clamp(32px, 4vw, 64px)", alignItems: "start" }}
        >
          {/* ── LEFT COLUMN ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${activeTab}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ paddingTop: 8 }}
            >
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 3.5vw, 50px)", letterSpacing: "-2px", color: "var(--white)", lineHeight: 1.08, margin: 0, whiteSpace: "pre-line" }}>
                {tab.heading}
              </h2>

              {/* Event details */}
              <div className="flex flex-wrap items-center gap-2" style={{ marginTop: 12 }}>
                {[nextEdition.edition, nextEdition.dateString, nextEdition.city].map((item, index, arr) => (
                  <span key={item} className="flex items-center gap-2">
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "#707070" }}>{item}</span>
                    {index < arr.length - 1 && <span style={{ color: "#404040" }}>&middot;</span>}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: "clamp(14px, 1.2vw, 16px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "20px 0 0", maxWidth: 440 }}>
                {tab.description}
              </p>

              {/* Perks */}
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 16 }}>
                {tab.perks.map((perk) => (
                  <div key={perk.text} className="flex items-center gap-3">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: VIOLET, flexShrink: 0 }}>
                      <PerkIcon type={perk.icon} />
                    </div>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.55)" }}>{perk.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust points (attend) or trust line (other) */}
              {activeTab === "attend" ? (
                <div style={{ marginTop: 24 }}>
                  {trustPoints.map((point, index) => (
                    <motion.div key={point} initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.4, delay: 0.4 + index * 0.1, ease: EASE }} className="flex items-center gap-2" style={{ marginTop: index > 0 ? 8 : 0 }}>
                      <span style={{ color: VIOLET, fontSize: 14 }}>&#10003;</span>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "#606060" }}>{point}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.25)", letterSpacing: "0.3px", margin: 0 }}>{tab.trust}</p>
                </div>
              )}

              {/* Secondary CTA (attend only) */}
              {activeTab === "attend" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.6, delay: 0.6, ease: EASE }} className="flex flex-wrap items-center gap-3" style={{ marginTop: 28 }}>
                  <Link href="/sponsors-and-partners" className="inline-flex items-center gap-2 transition-all duration-300" style={{ padding: "12px 24px", borderRadius: 50, border: "1px solid rgba(124, 58, 237, 0.25)", background: "transparent", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: VIOLET }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124, 58, 237, 0.08)"; e.currentTarget.style.borderColor = VIOLET; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.25)"; }}
                  >
                    Sponsor This Edition
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── RIGHT COLUMN: Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            style={{ borderRadius: 20, border: "1px solid rgba(124, 58, 237, 0.08)", background: "rgba(255, 255, 255, 0.02)", padding: "clamp(24px, 3vw, 36px)", position: "relative", overflow: "hidden" }}
          >
            <div className="absolute pointer-events-none" style={{ top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 70%)" }} />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px, 2.5vw, 26px)", letterSpacing: "-0.5px", color: "white", margin: "0 0 8px" }}>
                    {activeTab === "attend" ? "Thank you!" : "Inquiry Submitted"}
                  </h3>
                  <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 14, color: "#A0A0A0", margin: "0 0 20px", lineHeight: 1.6 }}>
                    {activeTab === "attend" ? "We\u2019ll be in touch with event details." : "Our team will review your submission and get back to you within 2 business days."}
                  </p>
                  <button onClick={resetForm} style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: VIOLET, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Submit another inquiry &rarr;
                  </button>
                </motion.div>
              ) : (
                <motion.div key={`form-${activeTab}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                  <form onSubmit={handleSubmit}>
                    <div className="opex-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {tab.fields.map((field) => {
                        const isFullWidth = field.type === "textarea";
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
                              <input type={field.type} value={formData[field.name] || ""} onChange={(e) => handleChange(field.name, e.target.value)} placeholder={field.placeholder} required={field.type !== "tel"}
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
                      style={{ width: "100%", marginTop: 20, padding: "13px 28px", borderRadius: 10, background: isLoading ? `${VIOLET}80` : VIOLET, color: "white", fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, border: "none", cursor: isLoading ? "wait" : "pointer", opacity: isLoading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                      onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = VIOLET_BRIGHT; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,58,237,0.15)"; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = isLoading ? `${VIOLET}80` : VIOLET; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      {isLoading ? "Submitting..." : tab.cta} {!isLoading && <span>&rarr;</span>}
                    </button>
                  </form>

                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: "#3A3A3A", textAlign: "center", margin: "14px 0 0" }}>
                    By submitting, you agree to receive event communications from Events First Group.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 860px) {
          .opex-cta-container {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .opex-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
