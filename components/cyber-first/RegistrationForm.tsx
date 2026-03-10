"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { submitForm, COUNTRY_CODES, validatePhone, type CountryCode } from "@/lib/form-helpers";

const CYBER_BLUE = "#01BBF5";

// Trust points
const trustPoints = [
  "Complimentary for qualified end-users",
  "Vendor passes available at $1,099",
  "Limited to 300 delegates",
];

export default function RegistrationForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    organization: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]); // UAE
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate phone
    const phoneErr = validatePhone(formData.phone || "", selectedCountry);
    if (phoneErr) {
      setPhoneError(phoneErr);
      setIsLoading(false);
      return;
    }

    const result = await submitForm({
      type: "attend",
      full_name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      company: formData.organization,
      job_title: formData.jobTitle,
      phone: `${selectedCountry.code} ${formData.phone}`,
      event_name: "Cyber First Kuwait 2026",
    });
    setIsLoading(false);
    if (result.success) setIsSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--black-light)",
        padding: "clamp(60px, 8vw, 100px) 0",
        borderTop: "1px solid rgba(1, 187, 245, 0.06)",
        borderBottom: "1px solid rgba(1, 187, 245, 0.06)",
      }}
    >
      <div
        className="registration-container"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
        }}
      >
        {/* Left Column — Pitch */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              letterSpacing: "-1px",
              color: "var(--white)",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Reserve Your Seat
          </h2>

          {/* Paragraph */}
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 15,
              color: "#808080",
              lineHeight: 1.7,
              margin: "14px 0 0",
            }}
          >
            Spaces for Cyber First Kuwait are limited. Register your interest
            now and we'll send you the full agenda, speaker lineup, and
            early-bird pricing when available.
          </p>

          {/* Trust Points */}
          <div style={{ marginTop: 24 }}>
            {trustPoints.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-2"
                style={{ marginTop: index > 0 ? 8 : 0 }}
              >
                <span style={{ color: CYBER_BLUE, fontSize: 14 }}>✓</span>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#606060",
                  }}
                >
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column — Form */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Row 1 */}
                <div className="flex gap-3.5" style={{ marginBottom: 14 }}>
                  <FormInput
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Row 2 */}
                <div className="flex gap-3.5" style={{ marginBottom: 14 }}>
                  <FormInput
                    name="jobTitle"
                    placeholder="Job Title"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    name="organization"
                    placeholder="Organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Row 3 */}
                <div style={{ marginBottom: 14 }}>
                  <FormInput
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Row 4 — Phone with country code */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={`${selectedCountry.code}|${selectedCountry.country}`}
                      onChange={(e) => {
                        const [code, country] = e.target.value.split("|");
                        const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country);
                        if (c) { setSelectedCountry(c); setPhoneError(null); }
                      }}
                      style={{
                        width: 110,
                        flexShrink: 0,
                        padding: "14px 10px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 10,
                        color: "white",
                        fontFamily: "var(--font-outfit)",
                        fontSize: 14,
                        fontWeight: 400,
                        outline: "none",
                        appearance: "none",
                        cursor: "pointer",
                      }}
                    >
                      {COUNTRY_CODES.map((cc) => (
                        <option
                          key={`${cc.code}-${cc.country}`}
                          value={`${cc.code}|${cc.country}`}
                          style={{ color: "#222", background: "#fff" }}
                        >
                          {cc.country} {cc.code}
                        </option>
                      ))}
                    </select>
                    <FormInput
                      name="phone"
                      type="tel"
                      placeholder={selectedCountry.placeholder}
                      value={formData.phone}
                      onChange={(e) => { handleChange(e); setPhoneError(null); }}
                      maxLength={selectedCountry.length}
                    />
                  </div>
                  {phoneError && (
                    <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{phoneError}</p>
                  )}
                </div>

                {/* Submit Button */}
                <SubmitButton loading={isLoading} />

                {/* Privacy Note */}
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    color: "#353535",
                    marginTop: 12,
                  }}
                >
                  By registering, you agree to receive event communications from
                  Events First Group.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center"
                style={{ minHeight: 300 }}
              >
                {/* Checkmark Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="flex items-center justify-center"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(1, 187, 245, 0.1)",
                    border: "2px solid rgba(1, 187, 245, 0.3)",
                  }}
                >
                  <motion.svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={CYBER_BLUE}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                </motion.div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 24,
                    color: "var(--white)",
                    marginTop: 20,
                  }}
                >
                  Thank you!
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 300,
                    color: "#808080",
                    marginTop: 8,
                    maxWidth: 280,
                  }}
                >
                  We'll be in touch with event details.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .registration-container {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * FormInput — Styled form input
 */
function FormInput({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  maxLength,
}: {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="transition-all duration-300"
      style={{
        width: "100%",
        padding: "14px 18px",
        background: isFocused
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(255, 255, 255, 0.03)",
        border: isFocused
          ? "1px solid rgba(1, 187, 245, 0.35)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 10,
        color: "white",
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: 400,
        outline: "none",
      }}
    />
  );
}

/**
 * SubmitButton — Form submit button
 */
function SubmitButton({ loading = false }: { loading?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full transition-all duration-300"
      style={{
        padding: 16,
        background: loading ? `${CYBER_BLUE}80` : isHovered ? "#33CCFF" : CYBER_BLUE,
        border: "none",
        borderRadius: 12,
        fontFamily: "var(--font-outfit)",
        fontSize: 15,
        fontWeight: 600,
        color: "#0A0A0A",
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.7 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading ? "Submitting..." : "Register Interest →"}
    </button>
  );
}
