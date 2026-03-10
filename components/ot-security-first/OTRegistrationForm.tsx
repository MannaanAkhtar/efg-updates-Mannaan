"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { isWorkEmail } from "@/lib/form-helpers";

const OT_CRIMSON = "#D34B9A";
const OT_FIREBRICK = "#E86BB8";

export default function OTRegistrationForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !isWorkEmail(email)) {
      setEmailError("Please use your work email address");
      return;
    }
    setIsLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section
      id="register"
      ref={sectionRef}
      style={{
        background: "var(--black-light)",
        padding: "clamp(80px, 10vw, 130px) 0",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 2, background: OT_CRIMSON }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: OT_FIREBRICK,
              }}
            >
              Register Your Interest
            </span>
            <span style={{ width: 30, height: 2, background: OT_CRIMSON }} />
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 40px)",
              letterSpacing: "-1px",
              color: "var(--white)",
              lineHeight: 1.15,
              margin: "20px 0 0",
            }}
          >
            Secure Your Place
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 300,
              color: "#707070",
              marginTop: 12,
            }}
          >
            Be the first to know when registration opens.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                style={{
                  background: "var(--black-card)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  borderRadius: 12,
                  padding: "36px 32px",
                }}
              >
                <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <FormInput label="First Name" type="text" required />
                  <FormInput label="Last Name" type="text" required />
                </div>

                <div style={{ marginTop: 16 }}>
                  <FormInput
                    label="Work Email"
                    type="email"
                    required
                    value={email}
                    onChange={(val) => { setEmail(val); setEmailError(null); }}
                    onBlur={() => { if (email && !isWorkEmail(email)) setEmailError("Please use your work email address"); }}
                    error={emailError}
                  />
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
                  <FormInput label="Company" type="text" required />
                  <FormInput label="Job Title" type="text" required />
                </div>

                <div style={{ marginTop: 16 }}>
                  <FormSelect
                    label="Industry"
                    options={[
                      "Oil & Gas",
                      "Power & Utilities",
                      "Manufacturing",
                      "Petrochemicals",
                      "Water & Wastewater",
                      "Transportation",
                      "Mining",
                      "Other",
                    ]}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full transition-all"
                  style={{
                    marginTop: 28,
                    padding: "16px 32px",
                    borderRadius: 6,
                    background: isLoading ? `${OT_CRIMSON}80` : OT_CRIMSON,
                    border: "none",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--white)",
                    cursor: isLoading ? "wait" : "pointer",
                    transitionDuration: "0.3s",
                  }}
                >
                  {isLoading ? "Submitting..." : "Register Interest"}
                </button>

                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    color: "#505050",
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  By registering, you agree to receive updates about OT Security
                  First.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: "var(--black-card)",
                  border: `1px solid ${OT_CRIMSON}30`,
                  borderRadius: 12,
                  padding: "60px 32px",
                  textAlign: "center",
                }}
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    background: `${OT_CRIMSON}20`,
                    border: `1px solid ${OT_CRIMSON}40`,
                    margin: "0 auto 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={OT_FIREBRICK}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "var(--white)",
                    margin: 0,
                  }}
                >
                  You're on the List
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: 300,
                    color: "#808080",
                    marginTop: 12,
                    maxWidth: 320,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  We'll notify you as soon as registration opens and share event
                  updates.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * FormInput — Styled form input
 */
function FormInput({
  label,
  type,
  required,
  value,
  onChange,
  onBlur: onBlurProp,
  error,
}: {
  label: string;
  type: string;
  required?: boolean;
  value?: string;
  onChange?: (val: string) => void;
  onBlur?: () => void;
  error?: string | null;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#505050",
          marginBottom: 8,
        }}
      >
        {label}
        {required && <span style={{ color: OT_FIREBRICK }}> *</span>}
      </label>
      <input
        type={type}
        required={required}
        className="w-full transition-all"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        style={{
          background: "#0a0a0a",
          border: isFocused
            ? `1px solid ${OT_CRIMSON}60`
            : "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 6,
          padding: "14px 16px",
          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          color: "var(--white)",
          outline: "none",
          transitionDuration: "0.3s",
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); onBlurProp?.(); }}
      />
      {error && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}

/**
 * FormSelect — Styled select input
 */
function FormSelect({
  label,
  options,
  required,
}: {
  label: string;
  options: string[];
  required?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#505050",
          marginBottom: 8,
        }}
      >
        {label}
        {required && <span style={{ color: OT_FIREBRICK }}> *</span>}
      </label>
      <select
        required={required}
        className="w-full transition-all"
        style={{
          background: "#0a0a0a",
          border: isFocused
            ? `1px solid ${OT_CRIMSON}60`
            : "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 6,
          padding: "14px 16px",
          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          color: "var(--white)",
          outline: "none",
          transitionDuration: "0.3s",
          cursor: "pointer",
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
