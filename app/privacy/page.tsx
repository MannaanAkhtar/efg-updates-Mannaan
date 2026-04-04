"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/sections";

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 860;
const PAD = "0 clamp(20px, 4vw, 60px)";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      "We collect information you provide directly when you register for events, submit inquiry or contact forms, subscribe to newsletters, or interact with our website. This may include your name, email address, phone number, job title, company name, and any additional details you choose to share.",
      "We also automatically collect certain technical data when you visit our website, including your IP address, browser type, device information, pages visited, and referring URLs. We use cookies and similar tracking technologies to gather this information.",
    ],
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: [
      "We use the information we collect to: process event registrations and manage attendance; respond to inquiries and provide customer support; send event-related communications, updates, and promotional materials; facilitate introductions between attendees, speakers, and sponsors where relevant; improve our website, events, and services; comply with legal obligations.",
      "If you register for an event, your professional details (name, title, organization) may be shared with event sponsors and partners as part of the event experience. We will always inform you of this at the point of registration.",
    ],
  },
  {
    id: "cookies",
    title: "3. Cookies & Tracking Technologies",
    content: [
      "Our website uses cookies to enhance your browsing experience, analyse site traffic, and understand where our visitors come from. These include strictly necessary cookies (required for the site to function), analytics cookies (to help us understand usage patterns), and marketing cookies (to deliver relevant content and measure campaign effectiveness).",
      "You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of our website.",
    ],
  },
  {
    id: "sharing",
    title: "4. Information Sharing & Disclosure",
    content: [
      "We do not sell your personal information. We may share your data with: event sponsors and partners (with your knowledge at registration); trusted service providers who assist in operating our website, conducting events, or servicing you, provided they agree to keep your information confidential; legal authorities when required by law or to protect our rights.",
      "All third-party service providers are contractually obligated to handle your data in accordance with this policy and applicable data protection laws.",
    ],
  },
  {
    id: "retention",
    title: "5. Data Retention",
    content: [
      "We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Event registration data is typically retained for up to 3 years after the event to facilitate future invitations and maintain historical records.",
      "You may request deletion of your data at any time by contacting us at the details provided below.",
    ],
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    content: [
      "Depending on your location, you may have the right to: access the personal data we hold about you; request correction of inaccurate information; request deletion of your personal data; object to or restrict processing of your data; withdraw consent at any time (where processing is based on consent); request a copy of your data in a portable format.",
      "To exercise any of these rights, please contact us at privacy@eventsfirstgroup.com. We will respond to your request within 30 days.",
    ],
  },
  {
    id: "international",
    title: "7. International Data Transfers",
    content: [
      "Events First Group is headquartered in the United Arab Emirates and operates globally. Your information may be transferred to and processed in countries outside your country of residence. We ensure that appropriate safeguards are in place to protect your data in accordance with this policy and applicable data protection regulations, including the UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection.",
    ],
  },
  {
    id: "security",
    title: "8. Data Security",
    content: [
      "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These include encryption, access controls, and regular security assessments. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will post the updated policy on this page with a revised \"Last updated\" date. We encourage you to review this page periodically.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: [
      "If you have any questions about this Privacy Policy or our data practices, please contact us at: privacy@eventsfirstgroup.com or through our Contact page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <main style={{ background: "var(--black)", minHeight: "100vh" }}>
        {/* Hero */}
        <section
          style={{
            paddingTop: "clamp(140px, 18vw, 200px)",
            paddingBottom: "clamp(40px, 6vw, 60px)",
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: `clamp(140px, 18vw, 200px) clamp(20px, 4vw, 60px) clamp(40px, 6vw, 60px)`,
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#E8651A",
              marginBottom: 16,
            }}
          >
            Legal
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-plus-jakarta)",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 15,
              color: "#606060",
              marginTop: 16,
            }}
          >
            Last updated: February 2026
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginTop: 40,
              transformOrigin: "left",
            }}
          />
        </section>

        {/* Content */}
        <section
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: `0 clamp(20px, 4vw, 60px) clamp(80px, 10vw, 120px)`,
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 16,
              fontWeight: 400,
              color: "#999",
              lineHeight: 1.8,
              marginBottom: 48,
            }}
          >
            Events First Group (&ldquo;EFG&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and safeguard your personal information when you visit our website, register for our events, or interact with our services.
          </motion.p>

          {/* Table of Contents */}
          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: "24px 28px",
              marginBottom: 56,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#505050",
                margin: "0 0 16px",
              }}
            >
              Contents
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    color: "#707070",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#707070")}
                >
                  {s.title}
                </a>
              ))}
            </div>
          </motion.nav>

          {/* Sections */}
          {sections.map((s, i) => (
            <motion.div
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 + i * 0.04, ease: EASE }}
              style={{ marginBottom: 44 }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-plus-jakarta)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#fff",
                  margin: "0 0 16px",
                  scrollMarginTop: 120,
                }}
              >
                {s.title}
              </h2>
              {s.content.map((p, j) => (
                <p
                  key={j}
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 400,
                    color: "#888",
                    lineHeight: 1.85,
                    margin: j < s.content.length - 1 ? "0 0 14px" : 0,
                  }}
                >
                  {p}
                </p>
              ))}
            </motion.div>
          ))}

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1, ease: EASE }}
            style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                color: "#E8651A",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              &larr; Back to Home
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
