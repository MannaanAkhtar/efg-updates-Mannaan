"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";
import { POST_EVENT_REPORTS } from "./postEventReportsData";

const VIOLET = "#7C3AED";
const VIOLET_BRIGHT = "#9F67FF";
const VIOLET_DIM = "#5B25C7";

export default function OpexRequestResourcesModal() {
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

  type RequestKind = "Delegate List" | "Past Event Report";
  const [requestType, setRequestType] = useState<RequestKind>("Past Event Report");
  const [selectedReportUrl, setSelectedReportUrl] = useState<string>(
    POST_EVENT_REPORTS[0]?.url ?? "",
  );

  // Lock body scroll + ESC-to-close while modal is open
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  // Listen for the hero dropdown — or a report card — opening the modal
  useEffect(() => {
    const onOpenRequest = (e: Event) => {
      const detail = (e as CustomEvent<{ type?: RequestKind; reportUrl?: string }>).detail;
      if (detail?.type === "Past Event Report" || detail?.type === "Delegate List") {
        setRequestType(detail.type);
        if (detail.reportUrl && POST_EVENT_REPORTS.some((r) => r.url === detail.reportUrl)) {
          setSelectedReportUrl(detail.reportUrl);
        }
        setSubmitState("idle");
        setSubmitError("");
        setErrors({});
        setModalOpen(true);
      }
    };
    window.addEventListener("opex-series:open-request", onOpenRequest);
    return () => window.removeEventListener("opex-series:open-request", onOpenRequest);
  }, []);

  const modalCopy =
    requestType === "Past Event Report"
      ? {
          kicker: "Request the Past Event Report",
          title: "Get the post-event report.",
          subtitle:
            "Share your details and we’ll send the post-event report PDF to your work email.",
          success:
            "We’ll email the post-event report PDF to your work email within 1 business day.",
        }
      : {
          kicker: "Request the Delegate List",
          title: "Get the full attendee roster.",
          subtitle:
            "Share your details and we’ll send the curated delegate list to your work email.",
          success:
            "We’ll send the delegate list to your work email within 1 business day.",
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
      event_name: "OPEX First (series)",
      metadata: {
        "Event Page": "OPEX First — Series",
        "Request Type": requestType,
        "Page Section": "Hero — Request Resources",
        ...(selectedReport && {
          "Selected Edition": `${selectedReport.title} ${selectedReport.year}`,
          ...(requestType === "Past Event Report" && {
            "Selected Report URL": selectedReport.url,
          }),
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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="opex-req-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="opex-req-modal-title"
        >
          <motion.div
            className="opex-req-modal-card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="opex-req-modal-close"
              aria-label="Close request form"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <span aria-hidden className="opex-req-modal-hairline" />

            <div className="opex-req-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 24, height: 1, background: VIOLET_BRIGHT }} />
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.32em", textTransform: "uppercase",
                  color: VIOLET_BRIGHT,
                }}>{modalCopy.kicker}</span>
              </div>
              <h3 id="opex-req-modal-title" style={{
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

            {submitState !== "success" && (
              <div className="opex-req-tabs" role="tablist" aria-label="Request type">
                {(["Past Event Report", "Delegate List"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={requestType === t}
                    onClick={() => {
                      if (requestType === t) return;
                      setRequestType(t);
                      setErrors({});
                      setSubmitError("");
                      if (submitState === "error") setSubmitState("idle");
                    }}
                    className={`opex-req-tab${requestType === t ? " opex-req-tab-on" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {submitState === "success" ? (
              <div className="opex-req-modal-success">
                <div className="opex-req-modal-success-check">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4>Request received.</h4>
                <p>{modalCopy.success}</p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="opex-req-modal-done"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="opex-req-form-fields">
                <input type="text" name="website" tabIndex={-1} autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

                <div className="opex-req-form-row">
                  <label className="opex-req-form-field" style={{ flex: "1 1 100%" }}>
                    <span className="opex-req-form-label">Select Edition</span>
                    <select
                      value={selectedReportUrl}
                      onChange={(e) => {
                        setSelectedReportUrl(e.target.value);
                        if (errors.report) setErrors({ ...errors, report: "" });
                      }}
                      className="opex-req-form-input opex-req-form-report-select"
                      aria-invalid={!!errors.report}
                    >
                      {POST_EVENT_REPORTS.map((r) => (
                        <option key={r.url} value={r.url}>
                          {r.title} {r.year}
                        </option>
                      ))}
                    </select>
                    {errors.report && <span className="opex-req-form-err">{errors.report}</span>}
                  </label>
                </div>

                <div className="opex-req-form-row">
                  <label className="opex-req-form-field">
                    <span className="opex-req-form-label">Full Name</span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: "" }); }}
                      placeholder="Your full name"
                      autoComplete="name"
                      className="opex-req-form-input"
                      aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && <span className="opex-req-form-err">{errors.fullName}</span>}
                  </label>

                  <label className="opex-req-form-field">
                    <span className="opex-req-form-label">Work Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="opex-req-form-input"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <span className="opex-req-form-err">{errors.email}</span>}
                  </label>
                </div>

                <div className="opex-req-form-row">
                  <label className="opex-req-form-field">
                    <span className="opex-req-form-label">Job Title</span>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => { setJobTitle(e.target.value); if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" }); }}
                      placeholder="COO, Head of Excellence, Director…"
                      autoComplete="organization-title"
                      className="opex-req-form-input"
                      aria-invalid={!!errors.jobTitle}
                    />
                    {errors.jobTitle && <span className="opex-req-form-err">{errors.jobTitle}</span>}
                  </label>

                  <label className="opex-req-form-field">
                    <span className="opex-req-form-label">
                      Phone
                      <span className="opex-req-form-hint-inline">
                        {countryCode.length} digits expected
                      </span>
                    </span>
                    <div className="opex-req-form-phone-row">
                      <select
                        value={`${countryCode.country}-${countryCode.code}`}
                        onChange={(e) => {
                          const [country, code] = e.target.value.split("-");
                          const found = COUNTRY_CODES.find((c) => c.country === country && c.code === code);
                          if (found) {
                            setCountryCode(found);
                            setPhone((p) => p.replace(/\D/g, "").slice(0, found.length));
                          }
                        }}
                        className="opex-req-form-cc"
                        aria-label="Country code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={`${c.country}-${c.code}`} value={`${c.country}-${c.code}`}>
                            {c.country} {c.code}
                          </option>
                        ))}
                      </select>
                      <div className="opex-req-form-phone-wrap">
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
                          className="opex-req-form-input opex-req-form-phone-input"
                          aria-invalid={!!errors.phone}
                        />
                        {phoneTouched && phoneIsValid && (
                          <span aria-hidden className="opex-req-form-phone-check">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                    {phoneTouched && !phoneIsValid && phoneDigitsLen > 0 && !errors.phone && (
                      <span className="opex-req-form-phone-progress">
                        {phoneDigitsLen} / {countryCode.length} digits
                      </span>
                    )}
                    {errors.phone && <span className="opex-req-form-err">{errors.phone}</span>}
                  </label>
                </div>

                {submitError && (
                  <div className="opex-req-form-submit-err">{submitError}</div>
                )}

                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="opex-req-form-submit"
                >
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
                <p className="opex-req-form-hint">
                  We respect your inbox. Used only to send the requested resource and edition follow-ups.
                </p>
              </form>
            )}

            <style jsx global>{`
              .opex-req-modal-overlay {
                position: fixed; inset: 0; z-index: 9999;
                display: flex; align-items: center; justify-content: center;
                padding: clamp(16px, 3vw, 32px);
                background: rgba(4, 2, 10, 0.78);
                backdrop-filter: blur(14px) saturate(140%);
                -webkit-backdrop-filter: blur(14px) saturate(140%);
              }
              .opex-req-modal-card {
                position: relative;
                width: 100%; max-width: 580px;
                max-height: calc(100vh - clamp(32px, 6vw, 64px));
                overflow-y: auto;
                padding: clamp(24px, 3vw, 36px);
                background: linear-gradient(165deg, rgba(28, 22, 50, 0.94) 0%, rgba(12, 8, 24, 0.97) 100%);
                border: 1px solid rgba(255,255,255,0.10);
                border-radius: 20px;
                box-shadow:
                  inset 0 1px 0 rgba(255,255,255,0.16),
                  inset 0 -1px 0 rgba(0,0,0,0.45),
                  0 24px 56px rgba(0,0,0,0.55),
                  0 48px 96px rgba(0,0,0,0.45);
              }
              .opex-req-modal-hairline {
                position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
                background: linear-gradient(90deg, transparent 0%, ${VIOLET_BRIGHT} 50%, transparent 100%);
                opacity: 0.8;
              }
              .opex-req-modal-close {
                position: absolute; top: 14px; right: 14px;
                display: inline-flex; align-items: center; justify-content: center;
                width: 32px; height: 32px; border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.10);
                background: rgba(255,255,255,0.04);
                color: rgba(255,255,255,0.7); cursor: pointer;
                transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
              }
              .opex-req-modal-close:hover {
                color: white; border-color: ${VIOLET}66; background: ${VIOLET}1a; transform: rotate(90deg);
              }
              .opex-req-modal-header {
                margin-bottom: clamp(14px, 1.6vw, 18px);
                padding-right: 36px;
              }
              .opex-req-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: clamp(18px, 2vw, 22px);
              }
              .opex-req-tab {
                flex: 1 1 0;
                padding: 11px 14px;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.08);
                background: rgba(255,255,255,0.02);
                color: rgba(255,255,255,0.5);
                font-family: var(--font-outfit);
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.01em;
                cursor: pointer;
                transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
              }
              .opex-req-tab:hover {
                color: rgba(255,255,255,0.78);
                border-color: ${VIOLET_BRIGHT}44;
              }
              .opex-req-tab-on {
                color: #fff;
                background: linear-gradient(135deg, ${VIOLET_DIM}2e 0%, ${VIOLET}22 100%);
                border-color: ${VIOLET_BRIGHT}88;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 0 22px ${VIOLET}33;
              }
              .opex-req-modal-success {
                display: flex; flex-direction: column;
                align-items: center; text-align: center;
                padding: clamp(8px, 1vw, 12px) 0 4px;
              }
              .opex-req-modal-success-check {
                display: inline-flex; align-items: center; justify-content: center;
                width: 56px; height: 56px; border-radius: 50%;
                background: linear-gradient(135deg, ${VIOLET_DIM}, ${VIOLET_BRIGHT});
                margin-bottom: 16px; box-shadow: 0 8px 24px ${VIOLET}66;
              }
              .opex-req-modal-success h4 {
                margin: 0 0 8px;
                font-family: var(--font-display);
                font-size: clamp(18px, 1.8vw, 22px);
                font-weight: 700; color: white;
              }
              .opex-req-modal-success p {
                margin: 0 0 22px;
                font-family: var(--font-outfit);
                font-size: 14px; color: rgba(255,255,255,0.6);
                line-height: 1.55; max-width: 380px;
              }
              .opex-req-modal-done {
                padding: 10px 28px;
                background: linear-gradient(135deg, ${VIOLET_DIM} 0%, ${VIOLET_BRIGHT} 100%);
                border: 1px solid ${VIOLET_BRIGHT}55; border-radius: 10px;
                color: white; font-family: var(--font-outfit);
                font-size: 13px; font-weight: 700;
                letter-spacing: 0.04em; cursor: pointer;
                transition: transform 0.3s ease, filter 0.3s ease;
              }
              .opex-req-modal-done:hover { transform: translateY(-1px); filter: brightness(1.08); }
              @media (max-width: 540px) {
                .opex-req-modal-card { padding: 22px 18px; border-radius: 16px; }
                .opex-req-modal-header { padding-right: 30px; }
              }
              .opex-req-form-fields {
                position: relative; z-index: 1;
                display: flex; flex-direction: column;
                gap: clamp(14px, 1.8vw, 18px);
              }
              .opex-req-form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: clamp(12px, 1.6vw, 18px);
              }
              .opex-req-form-field { display: flex; flex-direction: column; gap: 6px; }
              .opex-req-form-label {
                font-family: var(--font-outfit);
                font-size: 11px; font-weight: 600;
                letter-spacing: 0.16em; text-transform: uppercase;
                color: rgba(255,255,255,0.55);
                display: flex; align-items: baseline; gap: 10px;
              }
              .opex-req-form-hint-inline {
                font-size: 10px; font-weight: 500;
                letter-spacing: 0.06em; text-transform: none;
                color: rgba(255,255,255,0.35);
              }
              .opex-req-form-phone-wrap { position: relative; flex: 1; }
              .opex-req-form-phone-check {
                position: absolute; right: 12px; top: 50%;
                transform: translateY(-50%);
                display: inline-flex; align-items: center; justify-content: center;
                width: 22px; height: 22px; border-radius: 50%;
                background: linear-gradient(135deg, ${VIOLET_DIM}, ${VIOLET_BRIGHT});
                color: white; box-shadow: 0 2px 8px ${VIOLET}66; pointer-events: none;
              }
              .opex-req-form-phone-progress {
                font-family: var(--font-outfit); font-size: 11px;
                color: rgba(255,255,255,0.45);
                font-variant-numeric: tabular-nums; margin-top: 2px;
              }
              .opex-req-form-input {
                width: 100%; padding: 12px 14px;
                background: rgba(0,0,0,0.30);
                border: 1px solid rgba(255,255,255,0.10);
                border-radius: 10px; color: white;
                font-family: var(--font-outfit);
                font-size: 14.5px; line-height: 1.4;
                outline: none;
                transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
              }
              .opex-req-form-input::placeholder { color: rgba(255,255,255,0.30); }
              .opex-req-form-input:focus {
                border-color: ${VIOLET_BRIGHT};
                background: rgba(0,0,0,0.40);
                box-shadow: 0 0 0 3px ${VIOLET}33;
              }
              .opex-req-form-input[aria-invalid="true"] { border-color: rgba(255,80,80,0.6); }
              .opex-req-form-report-select {
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                padding-right: 40px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='%239F67FF' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
                background-repeat: no-repeat;
                background-position: right 14px center;
                cursor: pointer;
              }
              .opex-req-form-report-select option { background: #14102a; color: white; }
              .opex-req-form-phone-row { display: flex; gap: 8px; }
              .opex-req-form-cc {
                padding: 12px 10px;
                background: rgba(0,0,0,0.30);
                border: 1px solid rgba(255,255,255,0.10);
                border-radius: 10px; color: white;
                font-family: var(--font-outfit);
                font-size: 14px; outline: none;
                cursor: pointer; max-width: 110px;
                transition: border-color 0.25s ease, background 0.25s ease;
              }
              .opex-req-form-cc:focus {
                border-color: ${VIOLET_BRIGHT};
                box-shadow: 0 0 0 3px ${VIOLET}33;
              }
              .opex-req-form-cc option { background: #14102a; color: white; }
              .opex-req-form-phone-input { flex: 1; width: 100%; padding-right: 40px; }
              .opex-req-form-err {
                font-family: var(--font-outfit);
                font-size: 12px; color: #ff7a7a; margin-top: 2px;
              }
              .opex-req-form-submit-err {
                padding: 12px 14px; border-radius: 10px;
                background: rgba(255, 80, 80, 0.10);
                border: 1px solid rgba(255, 80, 80, 0.30);
                color: #ff9a9a;
                font-family: var(--font-outfit); font-size: 13.5px;
              }
              .opex-req-form-submit {
                display: inline-flex;
                align-items: center; justify-content: center;
                padding: 14px 24px; border-radius: 12px;
                border: 1px solid transparent;
                background: linear-gradient(135deg, ${VIOLET_DIM}, ${VIOLET_BRIGHT});
                color: white; font-family: var(--font-outfit);
                font-size: 14px; font-weight: 700;
                letter-spacing: 0.04em; text-transform: uppercase;
                cursor: pointer; align-self: flex-start;
                transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, filter 0.25s ease;
                box-shadow: 0 8px 20px ${VIOLET}55, inset 0 1px 0 rgba(255,255,255,0.18);
              }
              .opex-req-form-submit:hover:not(:disabled) {
                transform: translateY(-1px);
                filter: brightness(1.08);
                box-shadow: 0 12px 28px ${VIOLET}77, inset 0 1px 0 rgba(255,255,255,0.22);
              }
              .opex-req-form-submit:disabled { opacity: 0.55; cursor: not-allowed; }
              .opex-req-form-hint {
                font-family: var(--font-outfit);
                font-size: 12px; color: rgba(255,255,255,0.35); margin: 4px 0 0;
              }
              @media (max-width: 640px) {
                .opex-req-form-row { grid-template-columns: 1fr !important; }
                .opex-req-form-submit { width: 100%; justify-content: center; }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
