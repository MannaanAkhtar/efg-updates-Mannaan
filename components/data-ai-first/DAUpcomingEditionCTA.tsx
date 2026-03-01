"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { DotMatrixGrid, ScanLines } from "@/components/effects";
import { EMERALD, EMERALD_BRIGHT, EASE } from "./constants";

export default function DAUpcomingEditionCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
        className="da-cta-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ─── LEFT: Event Info ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Label */}
          <div className="flex items-center gap-3">
            <span style={{ width: 30, height: 2, background: EMERALD }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                color: EMERALD,
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              May 2026
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4.5vw, 56px)",
              letterSpacing: "-2px",
              lineHeight: 1.05,
              marginTop: 24,
            }}
          >
            <span style={{ color: "var(--white)" }}>Data & AI First</span>
            <br />
            <span style={{ color: EMERALD_BRIGHT }}>Kuwait</span>
          </h2>

          {/* Subtitle */}
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
            The Gulf&rsquo;s first leadership summit dedicated to building
            AI-driven organizations. Join us in Kuwait.
          </p>

          {/* Info Cards */}
          <div
            className="flex flex-wrap gap-3"
            style={{ marginTop: 32 }}
          >
            <InfoCard label="Date" value="May 18, 2026" />
            <InfoCard label="Location" value="Kuwait City" />
            <InfoCard label="Format" value="Full-Day Summit" />
          </div>

          {/* Countdown */}
          <div style={{ marginTop: 32 }}>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#404040",
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

          {/* Trust Points */}
          <div
            className="flex flex-col gap-3"
            style={{ marginTop: 32 }}
          >
            {[
              "200+ senior leaders expected",
              "30+ expert speakers confirmed",
              "Exclusive networking reception",
            ].map((point) => (
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
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={EMERALD_BRIGHT}
                    strokeWidth="3"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#707070",
                  }}
                >
                  {point}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── RIGHT: Registration Form Card ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        >
          <FormCard />
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .da-cta-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────── FORM CARD ─────────────────────────── */

function FormCard() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
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
          Register Your Interest
        </span>
      </div>

      {/* Form body */}
      <div style={{ padding: "28px 28px 32px" }}>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 0 }}
            >
              {/* Name row — 2 columns */}
              <div
                className="da-form-name-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <FormInput label="First Name" placeholder="John" required />
                <FormInput label="Last Name" placeholder="Smith" required />
              </div>

              <FormInput
                label="Work Email"
                placeholder="john@company.com"
                type="email"
                required
              />

              {/* Job + Company row */}
              <div
                className="da-form-name-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <FormInput label="Job Title" placeholder="CTO" required />
                <FormInput label="Company" placeholder="Acme Corp" required />
              </div>

              <FormSelect label="Industry" required />

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="transition-all"
                style={{
                  width: "100%",
                  background: isLoading
                    ? `${EMERALD}80`
                    : `linear-gradient(135deg, ${EMERALD}, ${EMERALD_BRIGHT})`,
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
                {isLoading ? "Submitting..." : "Register Interest →"}
              </button>

              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  color: "#383838",
                  textAlign: "center",
                  marginTop: 14,
                  lineHeight: 1.5,
                }}
              >
                By registering, you agree to receive updates about Data & AI
                First.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: `${EMERALD}20`,
                  border: `2px solid ${EMERALD}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={EMERALD_BRIGHT}
                  strokeWidth="2.5"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "var(--white)",
                  margin: "0 0 8px",
                }}
              >
                You&rsquo;re on the List
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  color: "#606060",
                  maxWidth: 300,
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                We&rsquo;ll notify you when full registration opens for
                Data & AI First Kuwait.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @media (max-width: 600px) {
          .da-form-name-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "12px 20px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#505050",
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 15,
          fontWeight: 700,
          color: "var(--white)",
          margin: "4px 0 0",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function CountdownUnit({
  value,
  label,
  isSeconds = false,
}: {
  value: number;
  label: string;
  isSeconds?: boolean;
}) {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (!isSeconds) return;
    setShowPulse(true);
    const t = setTimeout(() => setShowPulse(false), 400);
    return () => clearTimeout(t);
  }, [value, isSeconds]);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "10px 14px",
        borderRadius: 10,
        background: "rgba(15, 115, 94, 0.06)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1px solid ${EMERALD}15`,
        minWidth: 56,
        boxShadow: showPulse
          ? `0 0 16px rgba(15, 115, 94, 0.3)`
          : "none",
        transition: "box-shadow 0.3s ease-out",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 800,
          color: EMERALD_BRIGHT,
          margin: 0,
          lineHeight: 1,
        }}
      >
        {value.toString().padStart(2, "0")}
      </p>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 8,
          color: "#404040",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginTop: 4,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function FormInput({
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          color: "#505050",
          letterSpacing: "0.5px",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
        {required && (
          <span style={{ color: EMERALD, marginLeft: 3 }}>*</span>
        )}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          background: "#0a0a0a",
          border: `1px solid ${
            isFocused ? `${EMERALD}50` : "rgba(255,255,255,0.08)"
          }`,
          borderRadius: 8,
          padding: "11px 14px",
          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          fontWeight: 400,
          color: "var(--white)",
          outline: "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
          boxShadow: isFocused ? `0 0 0 3px ${EMERALD}10` : "none",
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

function FormSelect({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ marginBottom: 16, position: "relative" }}>
      <label
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 500,
          color: "#505050",
          letterSpacing: "0.5px",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
        {required && (
          <span style={{ color: EMERALD, marginLeft: 3 }}>*</span>
        )}
      </label>
      <div style={{ position: "relative" }}>
        <select
          required={required}
          style={{
            width: "100%",
            background: "#0a0a0a",
            border: `1px solid ${
              isFocused ? `${EMERALD}50` : "rgba(255,255,255,0.08)"
            }`,
            borderRadius: 8,
            padding: "11px 14px",
            fontFamily: "var(--font-outfit)",
            fontSize: 14,
            fontWeight: 400,
            color: "#505050",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            transition: "border-color 0.3s, box-shadow 0.3s",
            boxShadow: isFocused ? `0 0 0 3px ${EMERALD}10` : "none",
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <option value="">Select Industry</option>
          <option>Government</option>
          <option>Finance & Banking</option>
          <option>Technology</option>
          <option>Healthcare</option>
          <option>Energy & Utilities</option>
          <option>Education</option>
          <option>Telecom</option>
          <option>Other</option>
        </select>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={EMERALD}
          strokeWidth="2"
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
