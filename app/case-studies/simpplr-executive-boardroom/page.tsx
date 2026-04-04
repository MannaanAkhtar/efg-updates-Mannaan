"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Hide site chrome for deck mode
function useDeckMode() {
  useEffect(() => {
    // Hide navigation
    document.querySelectorAll('body > nav').forEach(el => (el as HTMLElement).style.display = 'none');
    // Hide WhatsApp button
    document.querySelectorAll('body > a').forEach(el => (el as HTMLElement).style.display = 'none');
    // Hide cursor glow (350x350 fixed div)
    document.querySelectorAll('body > div').forEach(el => {
      const style = (el as HTMLElement).getAttribute('style') || '';
      if (style.includes('350px') || style.includes('border-radius: 50%')) {
        (el as HTMLElement).style.display = 'none';
      }
    });
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────────
// SIMPPLR BRAND, Minimal & Clean
// ─────────────────────────────────────────────────────────────────────────────

const BRAND = {
  orange: "#FF6B4A",
  orangeLight: "#FFF5F3",
  black: "#1A1A1A",
  gray900: "#111827",
  gray700: "#374151",
  gray500: "#6B7280",
  gray400: "#9CA3AF",
  gray200: "#E5E7EB",
  gray100: "#F3F4F6",
  gray50: "#F9FAFB",
  white: "#FFFFFF",
};

const EASE = [0.25, 0.1, 0.25, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "48", label: "Registrations", subtext: "240% of target" },
  { value: "26", label: "Attendees", subtext: "130% of target" },
  { value: "92%", label: "Engagement Rate", subtext: "Active participation" },
  { value: "12", label: "Opportunities", subtext: "Qualified pipeline" },
];

const AUDIENCE_DATA = [
  { role: "CHROs", percent: 31 },
  { role: "VP HR / People", percent: 27 },
  { role: "CIOs / CTOs", percent: 23 },
  { role: "Directors", percent: 19 },
];

const DELIVERABLES = [
  { title: "Strategic Audience Curation", desc: "Targeted outreach to C-suite and VP-level executives across the GCC with rigorous qualification criteria." },
  { title: "Premium Venue & Experience", desc: "Half-day executive roundtable at Rosewood Abu Dhabi with networking lunch and branded materials." },
  { title: "Content & Agenda Design", desc: "Collaborative development of discussion topics and moderation to drive valuable conversations." },
  { title: "End-to-End Registration", desc: "Personalized invitations, registration portal, and confirmation sequences to maximize attendance." },
  { title: "Live Event Management", desc: "Professional hosting, real-time facilitation, and seamless event coordination." },
  { title: "Post-Event Intelligence", desc: "Attendee insights, engagement analytics, and qualified lead handoff within 48 hours." },
];

const TIMELINE = [
  { week: "1–2", phase: "Strategy", tasks: "Audience profiling, content development, branding" },
  { week: "3–4", phase: "Outreach", tasks: "Invitations, qualification calls, registration" },
  { week: "5", phase: "Prep", tasks: "Briefings, venue walk-through, confirmations" },
  { week: "D-Day", phase: "Execute", tasks: "Half-day roundtable at Rosewood Abu Dhabi" },
  { week: "Post", phase: "Deliver", tasks: "Insights report, sales handoff in 48 hours" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function SimpplrCaseStudy() {
  useDeckMode();
  
  return (
    <main style={{ background: BRAND.white, color: BRAND.gray900, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      
      {/* ══════════════ HERO ══════════════ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p style={{ 
            fontSize: 12, 
            fontWeight: 600, 
            letterSpacing: 1.5, 
            textTransform: "uppercase", 
            color: BRAND.orange, 
            marginBottom: 20 
          }}>
            Executive Boardroom Series
          </p>
          <h1 style={{ 
            fontSize: "clamp(36px, 5vw, 48px)", 
            fontWeight: 600, 
            lineHeight: 1.15, 
            letterSpacing: -1, 
            color: BRAND.gray900,
            marginBottom: 20,
            maxWidth: 700,
            margin: "0 auto 20px",
          }}>
            Driving Enterprise Engagement Through Intimate Executive Dialogue
          </h1>
          <p style={{ 
            fontSize: 18, 
            color: BRAND.gray500, 
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto",
          }}>
            How Simpplr partnered with Events First Group to connect with MENA decision-makers and exceed attendance targets by 130%
          </p>
        </motion.div>
      </section>

      {/* ══════════════ HERO IMAGE ══════════════ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 64px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          style={{
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Image
            src="/case-studies/simpplr-hero.jpg"
            alt="Simpplr AI-powered employee experience platform"
            width={900}
            height={600}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </motion.div>
      </section>

      {/* ══════════════ KEY METRICS ══════════════ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <FadeIn>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(4, 1fr)", 
            gap: 1,
            background: BRAND.gray200,
            borderRadius: 12,
            overflow: "hidden",
          }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ 
                background: BRAND.white,
                padding: "32px 20px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: BRAND.orange, lineHeight: 1, marginBottom: 8 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: BRAND.gray900, marginBottom: 4 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 12, color: BRAND.gray400 }}>
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ══════════════ THE CHALLENGE ══════════════ */}
      <section style={{ background: BRAND.gray50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 640 }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: BRAND.orange, marginBottom: 16 }}>
                The Challenge
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3, color: BRAND.gray900, marginBottom: 24 }}>
                Breaking through the noise to reach enterprise decision-makers
              </h2>
              <div style={{ fontSize: 16, color: BRAND.gray700, lineHeight: 1.8 }}>
                <p style={{ marginBottom: 16 }}>
                  Simpplr, the AI-powered employee experience platform, sought to establish thought leadership and generate high-quality pipeline among enterprise decision-makers in the MENA region.
                </p>
                <p>
                  Traditional webinars and large-scale events weren't delivering the intimate, high-value conversations needed to influence C-suite buyers. They needed a format that prioritized quality over quantity.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════ THE SOLUTION ══════════════ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
        <FadeIn>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: BRAND.orange, marginBottom: 16 }}>
            The Solution
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3, color: BRAND.gray900, marginBottom: 32, maxWidth: 500 }}>
            An exclusive Executive Boardroom experience
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(4, 1fr)", 
            gap: 16, 
            marginBottom: 48,
          }}>
            {[
              { label: "Format", value: "Executive Roundtable" },
              { label: "Duration", value: "Half-Day Experience" },
              { label: "Venue", value: "Rosewood Abu Dhabi" },
              { label: "Attendees", value: "20 Senior Executives" },
            ].map((item, i) => (
              <div key={i} style={{ 
                padding: "20px",
                background: BRAND.gray50,
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", color: BRAND.gray400, marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: BRAND.gray900 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{ fontSize: 16, color: BRAND.gray700, lineHeight: 1.8, maxWidth: 640 }}>
            Events First Group designed and executed a curated, invitation-only roundtable bringing together senior technology and HR leaders for candid discussions on the future of employee experience.
          </p>
        </FadeIn>
      </section>

      {/* ══════════════ AUDIENCE BREAKDOWN ══════════════ */}
      <section style={{ background: BRAND.gray900 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
          <FadeIn>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: BRAND.orange, marginBottom: 16 }}>
              Audience
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3, color: BRAND.white, marginBottom: 40 }}>
              Decision-makers who matter
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {AUDIENCE_DATA.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 120, fontSize: 14, color: BRAND.gray400 }}>{item.role}</div>
                  <div style={{ flex: 1, height: 8, background: BRAND.gray700, borderRadius: 4, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
                      style={{ height: "100%", background: BRAND.orange, borderRadius: 4 }}
                    />
                  </div>
                  <div style={{ width: 50, fontSize: 16, fontWeight: 600, color: BRAND.white, textAlign: "right" }}>
                    {item.percent}%
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════ WHAT WE DELIVERED ══════════════ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
        <FadeIn>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: BRAND.orange, marginBottom: 16 }}>
            Approach
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3, color: BRAND.gray900, marginBottom: 40 }}>
            What we delivered
          </h2>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {DELIVERABLES.map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div style={{ 
                padding: "24px",
                border: `1px solid ${BRAND.gray200}`,
                borderRadius: 8,
                height: "100%",
              }}>
                <div style={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: "50%", 
                  background: BRAND.orangeLight, 
                  color: BRAND.orange,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 16,
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: BRAND.gray900, marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: BRAND.gray500, lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════ TIMELINE ══════════════ */}
      <section style={{ background: BRAND.gray50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
          <FadeIn>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: BRAND.orange, marginBottom: 16 }}>
              Execution
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3, color: BRAND.gray900, marginBottom: 40 }}>
              5-week timeline
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{ display: "flex", gap: 2 }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ 
                  flex: 1,
                  background: BRAND.white,
                  padding: "24px 16px",
                  borderRadius: i === 0 ? "8px 0 0 8px" : i === TIMELINE.length - 1 ? "0 8px 8px 0" : 0,
                  textAlign: "center",
                }}>
                  <div style={{ 
                    fontSize: 11, 
                    fontWeight: 600, 
                    color: BRAND.orange, 
                    marginBottom: 8,
                    letterSpacing: 0.5,
                  }}>
                    {item.week}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.gray900, marginBottom: 6 }}>
                    {item.phase}
                  </div>
                  <div style={{ fontSize: 12, color: BRAND.gray500, lineHeight: 1.5 }}>
                    {item.tasks}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════ RESULTS ══════════════ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <FadeIn>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: BRAND.orange, marginBottom: 16 }}>
            Results
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3, color: BRAND.gray900, marginBottom: 16 }}>
            Exceeded every target
          </h2>
          <p style={{ fontSize: 16, color: BRAND.gray500, marginBottom: 48, maxWidth: 480, margin: "0 auto 48px" }}>
            The Executive Boardroom delivered more qualified pipeline in 90 minutes than three days on a typical expo floor.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{ 
            background: BRAND.gray900, 
            borderRadius: 16, 
            padding: "64px 40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 80,
          }}>
            <div>
              <div style={{ fontSize: 64, fontWeight: 700, color: BRAND.orange, lineHeight: 1 }}>130%</div>
              <div style={{ fontSize: 14, color: BRAND.gray400, marginTop: 8 }}>of attendance target</div>
            </div>
            <div>
              <div style={{ fontSize: 64, fontWeight: 700, color: BRAND.white, lineHeight: 1 }}>12</div>
              <div style={{ fontSize: 14, color: BRAND.gray400, marginTop: 8 }}>qualified opportunities</div>
            </div>
            <div>
              <div style={{ fontSize: 64, fontWeight: 700, color: BRAND.white, lineHeight: 1 }}>72</div>
              <div style={{ fontSize: 14, color: BRAND.gray400, marginTop: 8 }}>NPS score</div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════ TESTIMONIAL ══════════════ */}
      <section style={{ background: BRAND.gray50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, color: BRAND.orange, marginBottom: 24, lineHeight: 1 }}>"</div>
              <p style={{ fontSize: 20, color: BRAND.gray900, lineHeight: 1.7, fontWeight: 400, marginBottom: 32 }}>
                The Executive Boardroom format delivered exactly what we needed: quality over quantity. The conversations were substantive, the attendees were decision-makers, and the follow-up opportunities were genuine.
              </p>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.gray900 }}>Senior Marketing Leader</div>
                <div style={{ fontSize: 14, color: BRAND.gray500 }}>Simpplr</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
        <FadeIn>
          <div style={{ 
            background: BRAND.orange, 
            borderRadius: 16, 
            padding: "48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}>
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: BRAND.white, marginBottom: 8 }}>
                Ready to create your Executive Boardroom?
              </h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
                Connect with decision-makers through curated experiences.
              </p>
            </div>
            <Link
              href="mailto:ateeq@eventsfirstgroup.com,yasir@eventsfirstgroup.com"
              style={{
                background: BRAND.white,
                color: BRAND.orange,
                padding: "14px 28px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Get in Touch
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ 
        maxWidth: 900, 
        margin: "0 auto", 
        padding: "32px 24px 48px",
        borderTop: `1px solid ${BRAND.gray200}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <p style={{ fontSize: 13, color: BRAND.gray400 }}>© 2026 Events First Group</p>
          <p style={{ fontSize: 11, color: BRAND.gray400, marginTop: 4 }}>Confidential, For prospective client review</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <Link 
            href="mailto:ateeq@eventsfirstgroup.com" 
            style={{ fontSize: 14, color: BRAND.orange, textDecoration: "none", fontWeight: 500, display: "block" }}
          >
            ateeq@eventsfirstgroup.com
          </Link>
          <Link 
            href="mailto:yasir@eventsfirstgroup.com" 
            style={{ fontSize: 14, color: BRAND.orange, textDecoration: "none", fontWeight: 500, display: "block", marginTop: 4 }}
          >
            yasir@eventsfirstgroup.com
          </Link>
        </div>
      </footer>

    </main>
  );
}
