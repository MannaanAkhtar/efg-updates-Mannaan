"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/sections";

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 860;

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the Events First Group website and services, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our website or services.",
      "We reserve the right to modify these terms at any time. Your continued use of the website following any changes constitutes acceptance of the revised terms.",
    ],
  },
  {
    id: "use-of-website",
    title: "2. Use of Website",
    content: [
      "You may use our website for lawful purposes only. You agree not to: use the site in any way that violates applicable laws or regulations; attempt to gain unauthorised access to any part of the website or its systems; transmit any viruses, malware, or harmful code; scrape, data-mine, or extract content from the website without written permission; impersonate any person or entity, or misrepresent your affiliation with any person or entity.",
    ],
  },
  {
    id: "event-registration",
    title: "3. Event Registration & Attendance",
    content: [
      "When you register for an EFG event, you agree to provide accurate and complete registration information. Event registrations are subject to availability and our approval. We reserve the right to decline any registration at our discretion.",
      "Cancellation and refund policies vary by event and will be communicated at the time of registration. Unless otherwise stated: cancellations made more than 30 days before the event may be eligible for a full refund; cancellations made 15–30 days before may be eligible for a 50% refund; cancellations made less than 15 days before are non-refundable. Substitutions (replacing one attendee with another from the same organisation) are permitted at any time.",
      "EFG reserves the right to alter event schedules, speakers, venues, or formats due to circumstances beyond our control. In the event of a full cancellation by EFG, registered attendees will receive a full refund.",
    ],
  },
  {
    id: "intellectual-property",
    title: "4. Intellectual Property",
    content: [
      "All content on this website — including text, graphics, logos, images, videos, event branding, and software — is the property of Events First Group or its licensors and is protected by applicable intellectual property laws.",
      "You may not reproduce, distribute, modify, or create derivative works from any content on this website without our prior written consent. The EFG name, logo, and all event series names (Cyber First, OT Security First, Data & AI First, Opex First) are trademarks of Events First Group.",
    ],
  },
  {
    id: "photography",
    title: "5. Photography, Recording & Media",
    content: [
      "By attending an EFG event, you acknowledge that photography, video recording, and audio recording may take place. These materials may be used by EFG for promotional purposes, including on our website, social media channels, and marketing materials.",
      "If you do not wish to be photographed or recorded, please inform our event staff upon arrival. We will make reasonable efforts to accommodate your request, though we cannot guarantee exclusion from all background footage.",
    ],
  },
  {
    id: "user-content",
    title: "6. User Content & Submissions",
    content: [
      "If you submit content to EFG — including speaker proposals, inquiry forms, feedback, or any other materials — you grant us a non-exclusive, royalty-free, worldwide licence to use, reproduce, and distribute that content in connection with our services.",
      "You represent that you own or have the necessary rights to any content you submit, and that such content does not infringe on any third party's intellectual property or other rights.",
    ],
  },
  {
    id: "third-party-links",
    title: "7. Third-Party Links",
    content: [
      "Our website may contain links to third-party websites or services. These links are provided for your convenience only. EFG does not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party sites. Accessing third-party links is at your own risk.",
    ],
  },
  {
    id: "limitation",
    title: "8. Limitation of Liability",
    content: [
      "To the fullest extent permitted by law, Events First Group and its directors, employees, partners, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or attendance at our events.",
      "Our total liability for any claim arising from your use of the website or our services shall not exceed the amount you paid to EFG for the specific event or service giving rise to the claim.",
    ],
  },
  {
    id: "indemnification",
    title: "9. Indemnification",
    content: [
      "You agree to indemnify and hold harmless Events First Group, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including legal fees) arising from your use of the website, violation of these terms, or infringement of any third party's rights.",
    ],
  },
  {
    id: "governing-law",
    title: "10. Governing Law & Jurisdiction",
    content: [
      "These Terms of Use are governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact Us",
    content: [
      "If you have any questions about these Terms of Use, please contact us at: legal@eventsfirstgroup.com or through our Contact page.",
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <>
      <main style={{ background: "var(--black)", minHeight: "100vh" }}>
        {/* Hero */}
        <section
          style={{
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
            Terms of Use
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
            Welcome to the Events First Group website. These Terms of Use govern your access to and use of our website, event registrations, and related services. Please read them carefully before using our platform.
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
