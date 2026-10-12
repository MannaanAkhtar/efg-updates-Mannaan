"use client";

// Post-event report request: the bottom-centre sticky note (a floating icon on phones) and
// the request modal it opens. Carried over from the Cyber First Qatar page so the behaviour
// and layout match the other Cyber First event pages.

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

const C = "#01BBF5";              // Cyber First cyan
const C_BRIGHT = "#4DD4FF";       // Bright cyan
const ACCENT = "#FF5A45";         // this page's coral, where Qatar uses its maroon
const ACCENT_BRIGHT = "#FF8A78";
const BG_DEEP = "#040818";
const BG_ELEV = "#0A1024";
const EASE = [0.16, 1, 0.3, 1] as const;

type ReportEntry = {
  edition: string;
  year: string;
  title: string;
  url: string;
  filename: string;
};

// The UAE report leads here, so it is the edition pre-selected in the request form.
const POST_EVENT_REPORTS: ReportEntry[] = [
  {
    edition: "UAE",
    year: "2026",
    title: "Cyber First UAE",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Post+Event+Report+Cyber+First+UAE_compressed+(1).pdf",
    filename: "Cyber-First-UAE-2026-Report.pdf",
  },
  {
    edition: "Kuwait",
    year: "2025",
    title: "Cyber First Kuwait",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/PER+-+Cyber+First+Kuwait+2025+Edition.pdf",
    filename: "Cyber-First-Kuwait-2025-Report.pdf",
  },
  {
    edition: "Qatar",
    year: "2025",
    title: "Cyber First Qatar",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/PER+-+Cyber+First+Qatar+2025+Edition.pdf",
    filename: "Cyber-First-Qatar-2025-Report.pdf",
  },
];

// ───────────────────────────────────────────────────────────────────────────
// POST-EVENT REPORTS — request modal (portalled to <body>)
// ───────────────────────────────────────────────────────────────────────────
function CfuPostEventReports() {
  type RequestKind = "Past Event Report" | "Delegate List";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "AE") || COUNTRY_CODES[0]
  );
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [requestType, setRequestType] = useState<RequestKind>("Past Event Report");
  const [selectedReportUrl, setSelectedReportUrl] = useState<string>(POST_EVENT_REPORTS[0]?.url ?? "");

  // Lock body scroll + ESC-to-close while modal is open
  useEffect(() => {
    if (!modalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  // Listen for global "open this modal" events from other components on this page
  useEffect(() => {
    const onOpenRequest = (e: Event) => {
      const detail = (e as CustomEvent<{ type?: RequestKind }>).detail;
      if (detail?.type === "Past Event Report" || detail?.type === "Delegate List") {
        setRequestType(detail.type);
        setSubmitState("idle");
        setSubmitError("");
        setErrors({});
        setModalOpen(true);
      }
    };
    window.addEventListener("cfu-2027:open-request", onOpenRequest);
    return () => window.removeEventListener("cfu-2027:open-request", onOpenRequest);
  }, []);

  const modalCopy = requestType === "Past Event Report"
    ? {
        kicker: "Request the Past Event Report",
        title: "Get the post-event report.",
        subtitle: "Share your details and we'll send the chosen edition's report to your work email.",
        success: "We'll email the post-event report PDF to your work email within 1 business day.",
      }
    : {
        kicker: "Request the Delegate List",
        title: "Get the full attendee roster.",
        subtitle: "Share your details and we'll send the curated delegate list to your work email.",
        success: "We'll send the delegate list to your work email within 1 business day.",
      };

  const phoneDigits = phone.replace(/[\s\-()]/g, "");
  const phoneDigitsLen = phoneDigits.length;
  const phoneIsValid = phoneDigitsLen > 0 && validatePhone(phone, countryCode) === null;

  useEffect(() => {
    if (!phoneTouched) return;
    const err = validatePhone(phone, countryCode);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next.phone = err; else delete next.phone;
      return next;
    });
  }, [phone, countryCode, phoneTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Work email is required";
    else if (!isWorkEmail(email.trim())) newErrors.email = "Please use your work email — free providers are not accepted";
    if (!jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    const phoneErr = validatePhone(phone, countryCode);
    if (phoneErr) newErrors.phone = phoneErr;
    if (!selectedReportUrl) newErrors.report = "Please select an edition";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setPhoneTouched(true);
      return;
    }

    const selectedReport = POST_EVENT_REPORTS.find((r) => r.url === selectedReportUrl);

    setSubmitState("submitting");
    setSubmitError("");
    const res = await submitForm({
      type: "contact",
      full_name: fullName.trim(),
      email: email.trim(),
      job_title: jobTitle.trim(),
      phone: `${countryCode.code} ${phone.trim()}`,
      event_name: "Cyber First UAE 2027",
      metadata: {
        "Event Page": "Cyber First UAE 2027",
        "Request Type": requestType,
        "Page Section": "Post-Event Reports",
        ...(selectedReport && {
          "Selected Edition": `${selectedReport.title} ${selectedReport.year}`,
          ...(requestType === "Past Event Report" && { "Selected Report URL": selectedReport.url }),
        }),
      },
    });
    if (res.success) {
      setSubmitState("success");
      setFullName(""); setEmail(""); setJobTitle(""); setPhone("");
    } else {
      setSubmitState("error");
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {mounted && createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="cfuper-req-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setModalOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cfuper-req-modal-title"
            >
              <motion.div
                className="cfuper-req-modal-card"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cfuper-req-modal-close"
                  aria-label="Close request form"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <span aria-hidden className="cfuper-req-modal-hairline" />

                <div className="cfuper-req-modal-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 24, height: 1, background: C_BRIGHT }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: C_BRIGHT,
                    }}>{modalCopy.kicker}</span>
                  </div>
                  <h3 id="cfuper-req-modal-title" style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px, 2.4vw, 26px)",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    color: "white",
                    lineHeight: 1.2,
                  }}>
                    {modalCopy.title}
                  </h3>
                  <p style={{
                    margin: "10px 0 0",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.55,
                  }}>
                    {modalCopy.subtitle}
                  </p>
                </div>

                {submitState === "success" ? (
                  <div className="cfuper-req-modal-success">
                    <div className="cfuper-req-modal-success-check">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4>Request received.</h4>
                    <p>{modalCopy.success}</p>
                    <button type="button" onClick={() => setModalOpen(false)} className="cfuper-req-modal-done">
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="cfuper-req-form-fields">
                    <input type="text" name="website" tabIndex={-1} autoComplete="off"
                      style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

                    {/* Request type toggle — Past Event Report vs Delegate List */}
                    <div className="cfuper-req-form-row">
                      <div
                        role="tablist"
                        aria-label="Request type"
                        style={{ display: "flex", gap: 8, width: "100%" }}
                      >
                        {(["Past Event Report", "Delegate List"] as const).map((kind) => {
                          const active = requestType === kind;
                          return (
                            <button
                              key={kind}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => setRequestType(kind)}
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 9,
                                border: active ? `1px solid ${C}66` : "1px solid rgba(255,255,255,0.10)",
                                background: active ? `linear-gradient(135deg, ${C}26, ${C}0a)` : "rgba(255,255,255,0.03)",
                                color: active ? C_BRIGHT : "rgba(255,255,255,0.55)",
                                fontFamily: "var(--font-outfit)",
                                fontSize: 12.5,
                                fontWeight: 600,
                                letterSpacing: "0.2px",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                              }}
                            >
                              {kind}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="cfuper-req-form-row">
                      <label className="cfuper-req-form-field" style={{ flex: "1 1 100%" }}>
                        <span className="cfuper-req-form-label">Select Edition</span>
                        <select
                          value={selectedReportUrl}
                          onChange={(e) => {
                            setSelectedReportUrl(e.target.value);
                            if (errors.report) setErrors({ ...errors, report: "" });
                          }}
                          className="cfuper-req-form-input cfuper-req-form-report-select"
                          aria-invalid={!!errors.report}
                        >
                          {POST_EVENT_REPORTS.map((r) => (
                            <option key={r.url} value={r.url} style={{ background: BG_ELEV, color: "#fff" }}>
                              {r.title} {r.year}
                            </option>
                          ))}
                        </select>
                        {errors.report && <span className="cfuper-req-form-err">{errors.report}</span>}
                      </label>
                    </div>

                    <div className="cfuper-req-form-row">
                      <label className="cfuper-req-form-field">
                        <span className="cfuper-req-form-label">Full Name</span>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: "" }); }}
                          placeholder="Your full name"
                          autoComplete="name"
                          className="cfuper-req-form-input"
                          aria-invalid={!!errors.fullName}
                        />
                        {errors.fullName && <span className="cfuper-req-form-err">{errors.fullName}</span>}
                      </label>

                      <label className="cfuper-req-form-field">
                        <span className="cfuper-req-form-label">Work Email</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                          placeholder="name@company.com"
                          autoComplete="email"
                          className="cfuper-req-form-input"
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && <span className="cfuper-req-form-err">{errors.email}</span>}
                      </label>
                    </div>

                    <div className="cfuper-req-form-row">
                      <label className="cfuper-req-form-field">
                        <span className="cfuper-req-form-label">Job Title</span>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => { setJobTitle(e.target.value); if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" }); }}
                          placeholder="CISO, Head of IT, CIO…"
                          autoComplete="organization-title"
                          className="cfuper-req-form-input"
                          aria-invalid={!!errors.jobTitle}
                        />
                        {errors.jobTitle && <span className="cfuper-req-form-err">{errors.jobTitle}</span>}
                      </label>

                      <label className="cfuper-req-form-field">
                        <span className="cfuper-req-form-label">
                          Phone
                          <span className="cfuper-req-form-hint-inline">
                            {countryCode.length} digits expected
                          </span>
                        </span>
                        <div className="cfuper-req-form-phone-row">
                          <select
                            value={`${countryCode.country}-${countryCode.code}`}
                            onChange={(e) => {
                              const [country, code] = e.target.value.split("-");
                              const found = COUNTRY_CODES.find((c) => c.country === country && c.code === code);
                              if (found) {
                                setCountryCode(found);
                                setPhone((prev) => prev.replace(/\D/g, "").slice(0, found.length));
                              }
                            }}
                            className="cfuper-req-form-cc"
                            aria-label="Country code"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={`${c.country}-${c.code}`} value={`${c.country}-${c.code}`} style={{ background: BG_ELEV, color: "#fff" }}>
                                {c.country} {c.code}
                              </option>
                            ))}
                          </select>
                          <div className="cfuper-req-form-phone-wrap">
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={phone}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, countryCode.length);
                                setPhone(digits);
                              }}
                              onBlur={() => setPhoneTouched(true)}
                              placeholder={countryCode.placeholder}
                              autoComplete="tel-national"
                              maxLength={countryCode.length}
                              className="cfuper-req-form-input cfuper-req-form-phone-input"
                              aria-invalid={!!errors.phone}
                            />
                            {phoneTouched && phoneIsValid && (
                              <span aria-hidden className="cfuper-req-form-phone-check">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>
                        {phoneTouched && !phoneIsValid && phoneDigitsLen > 0 && !errors.phone && (
                          <span className="cfuper-req-form-phone-progress">
                            {phoneDigitsLen} / {countryCode.length} digits
                          </span>
                        )}
                        {errors.phone && <span className="cfuper-req-form-err">{errors.phone}</span>}
                      </label>
                    </div>

                    {submitError && (
                      <div className="cfuper-req-form-submit-err">{submitError}</div>
                    )}

                    <button type="submit" disabled={submitState === "submitting"} className="cfuper-req-form-submit">
                      {submitState === "submitting"
                        ? "Sending…"
                        : requestType === "Past Event Report"
                          ? "Send me the report"
                          : "Send me the delegate list"}
                      {submitState !== "submitting" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      )}
                    </button>
                    <p className="cfuper-req-form-hint">
                      We respect your inbox. Used only to send the requested resource and edition follow-ups.
                    </p>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <style jsx global>{`
        .cfuper-req-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(16px, 3vw, 32px);
          background: rgba(2, 4, 14, 0.78);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
        }
        .cfuper-req-modal-card {
          position: relative;
          width: 100%; max-width: 580px;
          max-height: calc(100vh - clamp(32px, 6vw, 64px));
          overflow-y: auto;
          padding: clamp(24px, 3vw, 36px);
          background: linear-gradient(165deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 20px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.45),
            0 24px 56px rgba(0,0,0,0.55),
            0 48px 96px rgba(0,0,0,0.45);
        }
        .cfuper-req-modal-hairline {
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${C_BRIGHT} 30%, ${ACCENT_BRIGHT} 70%, transparent 100%);
          opacity: 0.85;
        }
        .cfuper-req-modal-close {
          position: absolute; top: 14px; right: 14px;
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .cfuper-req-modal-close:hover {
          color: white; border-color: ${C_BRIGHT}66; background: ${C}1a; transform: rotate(90deg);
        }
        .cfuper-req-modal-header { margin-bottom: clamp(18px, 2vw, 22px); padding-right: 36px; }
        .cfuper-req-modal-success { display: flex; flex-direction: column; align-items: center; text-align: center; padding: clamp(8px, 1vw, 12px) 0 4px; }
        .cfuper-req-modal-success-check {
          display: inline-flex; align-items: center; justify-content: center;
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, ${C}, ${C_BRIGHT});
          margin-bottom: 16px;
          box-shadow: 0 8px 24px ${C}66;
        }
        .cfuper-req-modal-success h4 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 700; color: white;
        }
        .cfuper-req-modal-success p {
          margin: 0 0 22px;
          font-family: var(--font-outfit);
          font-size: 14px; color: rgba(255,255,255,0.6);
          line-height: 1.55; max-width: 380px;
        }
        .cfuper-req-modal-done {
          padding: 10px 28px;
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          color: white; border: none; border-radius: 10px;
          font-family: var(--font-outfit); font-size: 13px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 20px ${C}55;
          transition: all 0.3s ease;
        }
        .cfuper-req-modal-done:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 14px 30px ${C}88; }

        .cfuper-req-form-fields { display: flex; flex-direction: column; gap: 14px; }
        .cfuper-req-form-row { display: flex; flex-wrap: wrap; gap: 14px; }
        .cfuper-req-form-field { flex: 1 1 200px; display: flex; flex-direction: column; gap: 6px; position: relative; }
        .cfuper-req-form-label {
          font-family: var(--font-outfit); font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.6); letter-spacing: 0.5px;
          text-transform: uppercase;
          display: flex; align-items: center; gap: 8px;
        }
        .cfuper-req-form-hint-inline {
          font-size: 10px; letter-spacing: 0.3px; text-transform: none; opacity: 0.5;
        }
        .cfuper-req-form-input {
          width: 100%;
          padding: 11px 13px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: white;
          font-family: var(--font-outfit); font-size: 14px;
          transition: all 0.25s ease;
          outline: none;
        }
        .cfuper-req-form-input:focus { border-color: ${C}88; background: rgba(255,255,255,0.06); box-shadow: 0 0 0 3px ${C}22; }
        .cfuper-req-form-input[aria-invalid="true"] { border-color: rgba(255,80,80,0.6); }
        .cfuper-req-form-report-select { cursor: pointer; appearance: none; -webkit-appearance: none; background-image: linear-gradient(45deg, transparent 50%, ${C_BRIGHT} 50%), linear-gradient(135deg, ${C_BRIGHT} 50%, transparent 50%); background-position: calc(100% - 16px) 50%, calc(100% - 11px) 50%; background-size: 5px 5px; background-repeat: no-repeat; padding-right: 32px; }
        .cfuper-req-form-cc { flex: 0 0 110px; padding: 11px 9px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: white; font-family: var(--font-outfit); font-size: 12px; cursor: pointer; }
        .cfuper-req-form-phone-row { display: flex; gap: 8px; }
        .cfuper-req-form-phone-wrap { position: relative; flex: 1; }
        .cfuper-req-form-phone-input { padding-right: 38px; }
        .cfuper-req-form-phone-check { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: ${C_BRIGHT}; }
        .cfuper-req-form-phone-progress { font-family: var(--font-outfit); font-size: 11px; color: rgba(255,255,255,0.45); }
        .cfuper-req-form-err { font-family: var(--font-outfit); font-size: 11px; color: #ff6b6b; }
        .cfuper-req-form-submit-err {
          padding: 10px 14px; border-radius: 10px;
          background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3);
          color: #ffb6b6; font-family: var(--font-outfit); font-size: 13px;
        }
        .cfuper-req-form-submit {
          margin-top: 4px;
          padding: 13px 26px;
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          color: white; border: none; border-radius: 12px;
          font-family: var(--font-outfit); font-size: 13px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 10px 26px ${C}55;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .cfuper-req-form-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 16px 36px ${C}88; }
        .cfuper-req-form-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .cfuper-req-form-hint {
          font-family: var(--font-outfit); font-size: 11px; color: rgba(255,255,255,0.4);
          margin: 4px 0 0; text-align: center;
        }
      `}</style>
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// POST-EVENT REPORTS — floating sticky note (Hero/Overview) → icon thereafter
// ───────────────────────────────────────────────────────────────────────────
function CfuPostReportFloat() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [pastOverview, setPastOverview] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const DISMISS_KEY = "cfu-2027-report-dismissed";
  const NUDGE_KEY = "cfu-2027-report-nudged";

  // Read persisted state on mount
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 700px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Watch the Event Overview section — once its bottom leaves the viewport, switch to State B (icon mode)
  useEffect(() => {
    if (!mounted) return;
    const overview = document.getElementById("overview");
    if (!overview) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        // pastOverview = true when the overview section's bottom is above the viewport top
        const rect = entry.boundingClientRect;
        setPastOverview(rect.bottom < 60);
      },
      { threshold: [0, 0.1, 1], rootMargin: "0px 0px -60% 0px" }
    );
    obs.observe(overview);
    // Also handle the case where the user is already scrolled past on page load
    const initial = overview.getBoundingClientRect();
    setPastOverview(initial.bottom < 60);
    return () => obs.disconnect();
  }, [mounted]);

  // Fire the one-time nudge popup the first time the icon mode kicks in
  useEffect(() => {
    if (!mounted || dismissed || nudged) return;
    // On desktop the nudge fires when we transition into State B (icon)
    // On mobile the icon is always shown, so fire after a short delay
    const shouldFire = isMobile ? true : pastOverview;
    if (!shouldFire) return;
    const showTimer = setTimeout(() => setShowNudge(true), 800);
    const hideTimer = setTimeout(() => {
      setShowNudge(false);
      try { localStorage.setItem(NUDGE_KEY, "1"); } catch {}
      setNudged(true);
    }, 8000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [mounted, pastOverview, dismissed, nudged, isMobile]);

  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent("cfu-2027:open-request", { detail: { type: "Past Event Report" } }));
    setShowNudge(false);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    setShowNudge(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
  };

  const handleDismissNudge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNudge(false);
    try { localStorage.setItem(NUDGE_KEY, "1"); } catch {}
    setNudged(true);
  };

  if (!mounted || dismissed) return null;

  // Desktop, State A — sticky note bottom-center over Hero + Overview only
  // Desktop: keep the sticky note visible the whole way down (no conversion to a FAB icon).
  // Mobile: the note is too wide, so use the compact FAB with a dismissible popup nudge.
  const showStickyNote = !isMobile;
  const showIcon = isMobile;

  return (
    <>
      <AnimatePresence>
        {showStickyNote && (
          <motion.div
            key="sticky-note"
            initial={{ opacity: 0, y: 28, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 28, x: "-50%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="cfuper-report-note"
            role="button"
            tabIndex={0}
            onClick={handleOpen}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); } }}
            aria-label="Download Post Event Reports"
          >
            <button
              type="button"
              className="cfuper-report-note-close"
              onClick={handleDismiss}
              aria-label="Dismiss"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <span aria-hidden className="cfuper-report-note-hairline" />

            <div className="cfuper-report-note-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
            </div>

            <div className="cfuper-report-note-body">
              <span className="cfuper-report-note-eyebrow">
                <span className="cfuper-report-note-pulse" aria-hidden />
                Free Download
              </span>
              <span className="cfuper-report-note-title">
                Download our Post Event Reports
              </span>
              <span className="cfuper-report-note-cta">
                View past editions
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6 }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIcon && (
          <motion.div
            key="floating-icon-wrap"
            className="cfuper-report-fab-wrap"
            initial={{ opacity: 0, scale: 0.6, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence>
              {showNudge && (
                <motion.div
                  key="nudge"
                  className="cfuper-report-fab-nudge"
                  initial={{ opacity: 0, x: 12, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 12, scale: 0.94 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="cfuper-report-fab-nudge-eyebrow">
                    <span className="cfuper-report-note-pulse" aria-hidden /> Free Download
                  </span>
                  <span className="cfuper-report-fab-nudge-text">
                    Download our Post Event Reports
                  </span>
                  <button
                    type="button"
                    className="cfuper-report-fab-nudge-close"
                    onClick={handleDismissNudge}
                    aria-label="Dismiss"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <span aria-hidden className="cfuper-report-fab-nudge-tail" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="cfuper-report-fab-btnwrap">
              <button
                type="button"
                className="cfuper-report-fab"
                onClick={handleOpen}
                aria-label="Download Post Event Reports"
                title="Download Post Event Reports"
              >
                <span aria-hidden className="cfuper-report-fab-pulse" />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
              </button>
              <button
                type="button"
                className="cfuper-report-fab-close"
                onClick={handleDismiss}
                aria-label="Dismiss"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* ── Sticky note (State A) ─────────────────────────────────────── */
        .cfuper-report-note {
          position: fixed;
          bottom: 24px;
          left: 50%;
          z-index: 60;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 14px 22px 14px 18px;
          border-radius: 999px;
          cursor: pointer;
          background: linear-gradient(145deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%);
          border: 1px solid ${C}55;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 18px 50px rgba(0,0,0,0.55),
            0 0 36px ${C}30;
          transition: border-color 0.45s ease, box-shadow 0.45s ease;
          max-width: calc(100vw - 32px);
        }
        .cfuper-report-note:hover {
          border-color: ${C_BRIGHT};
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 22px 60px rgba(0,0,0,0.6),
            0 0 50px ${C}55;
        }
        .cfuper-report-note-hairline {
          position: absolute;
          top: 0; left: 12%; right: 12%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${C_BRIGHT}, ${ACCENT_BRIGHT}, transparent 100%);
          opacity: 0.7;
        }
        .cfuper-report-note-close {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(20,28,52,0.95);
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .cfuper-report-note-close:hover {
          color: white;
          background: ${ACCENT};
          border-color: ${ACCENT_BRIGHT};
          transform: rotate(90deg) scale(1.08);
        }
        .cfuper-report-note-icon {
          flex-shrink: 0;
          width: 38px; height: 38px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.32), 0 6px 18px ${C}66;
        }
        .cfuper-report-note-body {
          display: flex; flex-direction: column; gap: 1px; line-height: 1.15;
        }
        .cfuper-report-note-eyebrow {
          font-family: var(--font-outfit);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          display: inline-flex; align-items: center; gap: 6px;
        }
        .cfuper-report-note-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: ${C_BRIGHT};
          box-shadow: 0 0 8px ${C};
          animation: cfqReportPulse 1.6s ease-in-out infinite;
        }
        .cfuper-report-note-title {
          font-family: var(--font-display);
          font-size: 13.5px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.2px;
        }
        .cfuper-report-note-cta {
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          display: inline-flex; align-items: center;
          margin-top: 2px;
        }
        .cfuper-report-note:hover .cfuper-report-note-cta { color: ${C_BRIGHT}; }
        @keyframes cfqReportPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(1.5); }
        }

        /* ── FAB icon (State B) ────────────────────────────────────────── */
        .cfuper-report-fab-wrap {
          position: fixed;
          bottom: 96px;
          right: 24px;
          z-index: 50;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          gap: 12px;
        }
        .cfuper-report-fab-btnwrap {
          position: relative;
          display: inline-flex;
        }
        .cfuper-report-fab {
          position: relative;
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 1px solid ${C_BRIGHT};
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.34),
            inset 0 -1.5px 0 rgba(0,0,0,0.25),
            0 14px 36px rgba(0,0,0,0.45),
            0 0 30px ${C}55;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
        }
        .cfuper-report-fab:hover {
          transform: translateY(-3px) scale(1.06);
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.4),
            inset 0 -1.5px 0 rgba(0,0,0,0.25),
            0 18px 44px rgba(0,0,0,0.5),
            0 0 44px ${C}88;
        }
        .cfuper-report-fab-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${C};
          opacity: 0.4;
          animation: cfqFabRing 2.4s ease-out infinite;
          z-index: -1;
        }
        @keyframes cfqFabRing {
          0%   { transform: scale(1);   opacity: 0.55; }
          80%  { transform: scale(1.7); opacity: 0;    }
          100% { transform: scale(1.7); opacity: 0;    }
        }
        .cfuper-report-fab-close {
          position: absolute;
          top: -6px; right: -6px;
          width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(20,28,52,0.96);
          color: rgba(255,255,255,0.78);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .cfuper-report-fab-close:hover {
          color: white;
          background: ${ACCENT};
          border-color: ${ACCENT_BRIGHT};
          transform: rotate(90deg) scale(1.08);
        }

        .cfuper-report-fab-nudge {
          position: relative;
          max-width: 230px;
          padding: 12px 32px 12px 14px;
          border-radius: 14px;
          background: linear-gradient(145deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%);
          border: 1px solid ${C}55;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 14px 36px rgba(0,0,0,0.55),
            0 0 28px ${C}30;
          display: flex; flex-direction: column; gap: 4px;
        }
        .cfuper-report-fab-nudge-eyebrow {
          font-family: var(--font-outfit);
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          display: inline-flex; align-items: center; gap: 6px;
        }
        .cfuper-report-fab-nudge-text {
          font-family: var(--font-display);
          font-size: 12.5px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.1px;
          line-height: 1.25;
        }
        .cfuper-report-fab-nudge-close {
          position: absolute;
          top: 6px; right: 6px;
          width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .cfuper-report-fab-nudge-close:hover {
          color: white;
          background: ${ACCENT}33;
          border-color: ${ACCENT}88;
        }
        .cfuper-report-fab-nudge-tail {
          position: absolute;
          right: -6px; top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 12px; height: 12px;
          background: ${BG_ELEV};
          border-top: 1px solid ${C}55;
          border-right: 1px solid ${C}55;
        }

        @media (max-width: 700px) {
          .cfuper-report-fab-wrap { bottom: 88px; right: 16px; }
          .cfuper-report-fab { width: 50px; height: 50px; }
          .cfuper-report-fab-nudge { max-width: 200px; padding: 10px 28px 10px 12px; }
        }
      `}</style>
    </>
  );
}

export default function PostEventReports() {
  return (
    <>
      <CfuPostEventReports />
      <CfuPostReportFloat />
    </>
  );
}
