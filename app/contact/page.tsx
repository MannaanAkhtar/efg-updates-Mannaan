"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Footer } from "@/components/sections";
import SectionTransition from "@/components/effects/SectionTransition";
import { submitForm, isWorkEmail } from "@/lib/form-helpers";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const PAD = "0 clamp(20px, 4vw, 60px)";

const CONTACT = {
  email: "partnerships@eventsfirstgroup.com",
  phone: "+971 54 571 4377",
  whatsapp: "+971 54 571 4377",
  address: "Office M07, The Light Commercial Tower, Arjan, Dubai",
  linkedin: "https://www.linkedin.com/company/events-first-group/",
  mapsUrl: "https://maps.google.com/?q=The+Light+Commercial+Tower+Arjan+Dubai",
};

const INQUIRY_TYPES = [
  "General Inquiry",
  "Sponsorship",
  "Speaking Opportunity",
  "Delegate Registration",
  "Partnership",
  "Media & Press",
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 justify-center" style={{ marginBottom: 16 }}>
      <span style={{ width: 30, height: 1, background: "var(--orange)", flexShrink: 0 }} />
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
      <span style={{ width: 30, height: 1, background: "var(--orange)", flexShrink: 0 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1, HERO
// ─────────────────────────────────────────────────────────────────────────────

function ContactHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "var(--black)", paddingBottom: "clamp(60px, 8vw, 100px)" }}
    >
      {/* Ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 45% at 50% 0%, rgba(232,101,26,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 35% 25% at 80% 15%, rgba(124,58,237,0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* Large wireframe envelope SVG behind content */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -48%)",
          zIndex: 0,
          opacity: 0.035,
        }}
      >
        <svg
          width="clamp(300px, 40vw, 520px)"
          height="clamp(220px, 30vw, 380px)"
          viewBox="0 0 520 380"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Envelope body */}
          <rect x="20" y="60" width="480" height="300" rx="16" />
          {/* Envelope flap */}
          <path d="M20 60 L260 220 L500 60" />
          {/* Inner fold lines */}
          <path d="M20 360 L200 220" strokeDasharray="6 8" opacity="0.5" />
          <path d="M500 360 L320 220" strokeDasharray="6 8" opacity="0.5" />
          {/* Small paper/doc inside hint */}
          <rect x="180" y="100" width="160" height="110" rx="6" strokeDasharray="4 6" opacity="0.3" />
          <line x1="200" y1="130" x2="320" y2="130" strokeDasharray="3 5" opacity="0.2" />
          <line x1="200" y1="150" x2="300" y2="150" strokeDasharray="3 5" opacity="0.2" />
          <line x1="200" y1="170" x2="280" y2="170" strokeDasharray="3 5" opacity="0.2" />
        </svg>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          paddingTop: "clamp(140px, 18vw, 220px)",
          position: "relative",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <SectionLabel text="Contact" />
        </motion.div>

        {/* Headline with animated underline */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          style={{ display: "inline-block", position: "relative" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(48px, 7vw, 88px)",
              letterSpacing: "-3px",
              color: "var(--white)",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Get in Touch
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 300,
            fontSize: "clamp(15px, 1.4vw, 18px)",
            lineHeight: 1.7,
            color: "var(--white-muted)",
            maxWidth: 520,
            margin: "28px auto 0",
          }}
        >
          Whether you&apos;re interested in sponsoring, speaking, attending,
          or partnering, we&apos;d love to hear from you.
        </motion.p>

        {/* Inline contact chips */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          className="contact-chips-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(12px, 2vw, 24px)",
            marginTop: 36,
            flexWrap: "wrap",
          }}
        >
          <ContactChip
            icon="email"
            label={CONTACT.email}
            href={`mailto:${CONTACT.email}`}
          />
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.15)", flexShrink: 0 }} className="contact-chip-dot" />
          <ContactChip
            icon="phone"
            label={CONTACT.phone}
            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
          />
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.15)", flexShrink: 0 }} className="contact-chip-dot" />
          <ContactChip
            icon="whatsapp"
            label="WhatsApp"
            href={`https://wa.me/${CONTACT.whatsapp.replace(/\s/g, "").replace("+", "")}`}
          />
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .contact-chip-dot { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function ContactChip({
  icon,
  label,
  href,
}: {
  icon: "email" | "phone" | "whatsapp";
  label: string;
  href: string;
}) {
  const [hovered, setHovered] = useState(false);

  const icons = {
    email: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13 2 4" />
      </svg>
    ),
    phone: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    whatsapp: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  };

  return (
    <a
      href={href}
      target={icon === "whatsapp" ? "_blank" : undefined}
      rel={icon === "whatsapp" ? "noopener noreferrer" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 50,
        border: hovered ? "1px solid rgba(232,101,26,0.25)" : "1px solid rgba(255,255,255,0.08)",
        background: hovered ? "rgba(232,101,26,0.06)" : "rgba(255,255,255,0.03)",
        color: hovered ? "var(--orange)" : "var(--white-muted)",
        fontFamily: "var(--font-outfit)",
        fontSize: 13,
        fontWeight: 400,
        textDecoration: "none",
        transition: "all 0.3s ease",
        cursor: "pointer",
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icons[icon]}
      {label}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2, FORM + INFO
// ─────────────────────────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "var(--white)",
  fontFamily: "var(--font-outfit)",
  fontSize: 14,
  fontWeight: 300,
  outline: "none",
  transition: "border-color 0.3s ease, background 0.3s ease",
};

function ContactForm() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const focusStyle = (field: string): React.CSSProperties => ({
    ...inputBase,
    borderColor: focused === field ? "rgba(232,101,26,0.4)" : "rgba(255,255,255,0.08)",
    background: focused === field ? "rgba(232,101,26,0.04)" : "rgba(255,255,255,0.03)",
  });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--black)",
        padding: "clamp(60px, 8vw, 100px) 0 clamp(80px, 10vw, 130px)",
      }}
    >
      <div
        className="contact-form-grid"
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "clamp(48px, 6vw, 80px)",
          alignItems: "start",
        }}
      >
        {/* Left, Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(26px, 3vw, 38px)",
              letterSpacing: "-1px",
              color: "var(--white)",
              lineHeight: 1.15,
              margin: "0 0 8px",
            }}
          >
            Drop Us a Line
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 14,
              color: "var(--white-muted)",
              lineHeight: 1.6,
              margin: "0 0 36px",
            }}
          >
            Fill out the form and we&apos;ll get back to you shortly.
          </p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "white", margin: "0 0 8px" }}>Message Sent</h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "#808080", margin: "0 0 20px", lineHeight: 1.6 }}>We&apos;ll get back to you within 2 working hours.</p>
              <button onClick={() => { setSubmitted(false); setFormError(null); }} style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "var(--orange)", background: "none", border: "none", cursor: "pointer" }}>Send another message &rarr;</button>
            </div>
          ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              setFormError(null);
              const fd = new FormData(e.currentTarget);
              const emailVal = String(fd.get("email") || "");
              if (emailVal && !isWorkEmail(emailVal)) {
                setEmailError("Please use your work email address");
                setSubmitting(false);
                return;
              }
              const result = await submitForm({
                type: "contact",
                full_name: String(fd.get("name") || ""),
                email: emailVal,
                metadata: {
                  inquiry_type: String(fd.get("inquiry") || ""),
                  message: String(fd.get("message") || ""),
                },
              });
              setSubmitting(false);
              if (result.success) {
                setSubmitted(true);
                setEmailError(null);
                (e.target as HTMLFormElement).reset();
              } else {
                setFormError(result.error || "Something went wrong.");
              }
            }}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {/* Name + Email row */}
            <div
              className="contact-name-email-row"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
            >
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                required
                style={focusStyle("name")}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
              />
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  style={focusStyle("email")}
                  onFocus={() => setFocused("email")}
                  onChange={() => setEmailError(null)}
                  onBlur={(e) => {
                    setFocused(null);
                    if (e.currentTarget.value && !isWorkEmail(e.currentTarget.value)) {
                      setEmailError("Please use your work email address");
                    }
                  }}
                />
                {emailError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{emailError}</p>}
              </div>
            </div>

            {/* Inquiry Type */}
            <div style={{ position: "relative" }}>
              <select
                name="inquiry"
                style={{
                  ...focusStyle("inquiry"),
                  appearance: "none",
                  cursor: "pointer",
                  paddingRight: 44,
                }}
                defaultValue=""
                onFocus={() => setFocused("inquiry")}
                onBlur={() => setFocused(null)}
              >
                <option value="" disabled style={{ color: "#666" }}>
                  Inquiry Type
                </option>
                {INQUIRY_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: "#1a1a1a", color: "#fff" }}>
                    {t}
                  </option>
                ))}
              </select>
              {/* Dropdown arrow */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Message */}
            <textarea
              name="message"
              placeholder="Your Message"
              required
              rows={5}
              style={{
                ...focusStyle("message"),
                resize: "vertical",
                minHeight: 120,
              }}
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused(null)}
            />

            {/* Error */}
            {formError && (
              <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 13, margin: 0 }}>{formError}</p>
            )}

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "15px 40px",
                  borderRadius: 60,
                  border: "none",
                  background: submitting ? "rgba(232,101,26,0.6)" : "var(--orange)",
                  color: "white",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: submitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.background = "var(--orange-bright)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px var(--orange-glow)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = submitting ? "rgba(232,101,26,0.6)" : "var(--orange)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {submitting ? "Sending..." : "Send Message"} {!submitting && <span>→</span>}
              </button>
            </div>
          </form>
          )}
        </motion.div>

        {/* Right, Info card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          style={{
            borderRadius: 24,
            border: "1px solid var(--gray-border)",
            background: "var(--black-card)",
            padding: "clamp(32px, 4vw, 44px)",
            position: "sticky",
            top: 120,
          }}
        >
          {/* Office */}
          <InfoBlock
            icon="location"
            label="Office"
            value={CONTACT.address}
            href={CONTACT.mapsUrl}
            linkText="View on Maps →"
          />

          <div style={{ height: 1, background: "var(--gray-border)", margin: "24px 0" }} />

          {/* Response time */}
          <InfoBlock
            icon="clock"
            label="Response Time"
            value="We typically respond within 24 hours during business days."
          />

          <div style={{ height: 1, background: "var(--gray-border)", margin: "24px 0" }} />

          {/* Connect */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--orange)",
                margin: "0 0 14px",
              }}
            >
              Connect With Us
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <SocialLink href={CONTACT.linkedin} icon="linkedin" />
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .contact-form-grid { grid-template-columns: 1fr !important; }
          .contact-name-email-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function InfoBlock({
  icon,
  label,
  value,
  href,
  linkText,
}: {
  icon: "location" | "clock";
  label: string;
  value: string;
  href?: string;
  linkText?: string;
}) {
  const icons = {
    location: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    clock: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {icons[icon]}
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "var(--orange)",
            margin: 0,
          }}
        >
          {label}
        </p>
      </div>
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontWeight: 300,
          fontSize: 14,
          lineHeight: 1.65,
          color: "var(--white-dim)",
          margin: 0,
        }}
      >
        {value}
      </p>
      {href && linkText && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--orange)",
            textDecoration: "none",
            display: "inline-block",
            marginTop: 8,
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {linkText}
        </a>
      )}
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: "linkedin" }) {
  const [hovered, setHovered] = useState(false);

  const icons = {
    linkedin: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        border: hovered ? "1px solid rgba(232,101,26,0.25)" : "1px solid var(--gray-border)",
        background: hovered ? "rgba(232,101,26,0.06)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? "var(--orange)" : "var(--white-muted)",
        textDecoration: "none",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icons[icon]}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div>
      <ContactHero />
      <SectionTransition variant="sweep" />
      <ContactForm />
      <SectionTransition variant="sweep" />
      <Footer />
    </div>
  );
}
