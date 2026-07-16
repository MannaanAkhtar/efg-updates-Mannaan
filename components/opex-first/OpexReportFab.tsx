"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const V = "#7C3AED";
const V_BRIGHT = "#9F6AFF";
const V_PALE = "#C4B5FD";
const BG_DARK = "#06060e";
const BG_CARD = "#0e0e1c";

// Floating "Download our Post Event Reports" prompt.
// Desktop → sticky pill note. Mobile → FAB icon with a one-time nudge.
// Opens the shared OpexRequestResourcesModal via the "opex-series:open-request" event.
export default function OpexReportFab() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 700px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mounted || dismissed || nudged || !isMobile) return;
    const showTimer = setTimeout(() => setShowNudge(true), 1200);
    const hideTimer = setTimeout(() => {
      setShowNudge(false);
      setNudged(true);
    }, 9000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [mounted, dismissed, nudged, isMobile]);

  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent("opex-series:open-request", { detail: { type: "Past Event Report" } }));
    setShowNudge(false);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    setShowNudge(false);
  };

  const handleDismissNudge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNudge(false);
    setNudged(true);
  };

  if (!mounted || dismissed) return null;

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
            className="opex-rf-note"
            role="button"
            tabIndex={0}
            onClick={handleOpen}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); } }}
            aria-label="Download Post Event Reports"
          >
            <button type="button" className="opex-rf-note-close" onClick={handleDismiss} aria-label="Dismiss">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <span aria-hidden className="opex-rf-note-hairline" />

            <div className="opex-rf-note-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
            </div>

            <div className="opex-rf-note-body">
              <span className="opex-rf-note-eyebrow">
                <span className="opex-rf-note-pulse" aria-hidden />
                Free Download
              </span>
              <span className="opex-rf-note-title">Download our Post Event Reports</span>
              <span className="opex-rf-note-cta">
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
            className="opex-rf-fab-wrap"
            initial={{ opacity: 0, scale: 0.6, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence>
              {showNudge && (
                <motion.div
                  key="nudge"
                  className="opex-rf-fab-nudge"
                  initial={{ opacity: 0, x: 12, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 12, scale: 0.94 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="opex-rf-fab-nudge-eyebrow">
                    <span className="opex-rf-note-pulse" aria-hidden /> Free Download
                  </span>
                  <span className="opex-rf-fab-nudge-text">Download our Post Event Reports</span>
                  <button type="button" className="opex-rf-fab-nudge-close" onClick={handleDismissNudge} aria-label="Dismiss">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <span aria-hidden className="opex-rf-fab-nudge-tail" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="opex-rf-fab-btnwrap">
              <button type="button" className="opex-rf-fab" onClick={handleOpen} aria-label="Download Post Event Reports" title="Download Post Event Reports">
                <span aria-hidden className="opex-rf-fab-pulse" />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
              </button>
              <button type="button" className="opex-rf-fab-close" onClick={handleDismiss} aria-label="Dismiss">
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
        /* ── Sticky note (desktop) ─────────────────────────────────── */
        .opex-rf-note {
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
          background: linear-gradient(145deg, ${BG_CARD} 0%, ${BG_DARK} 100%);
          border: 1px solid ${V}66;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 18px 50px rgba(0,0,0,0.55),
            0 0 36px ${V}30;
          transition: border-color 0.45s ease, box-shadow 0.45s ease;
          max-width: calc(100vw - 32px);
        }
        .opex-rf-note:hover {
          border-color: ${V_BRIGHT};
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 22px 60px rgba(0,0,0,0.6),
            0 0 50px ${V}59;
        }
        .opex-rf-note-hairline {
          position: absolute;
          top: 0; left: 12%; right: 12%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${V_BRIGHT}, ${V_PALE}, transparent 100%);
          opacity: 0.7;
        }
        .opex-rf-note-close {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: ${BG_DARK};
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .opex-rf-note-close:hover {
          color: white;
          background: ${V};
          border-color: ${V_BRIGHT};
          transform: rotate(90deg) scale(1.08);
        }
        .opex-rf-note-icon {
          flex-shrink: 0;
          width: 38px; height: 38px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, ${V} 0%, ${V_BRIGHT} 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.32), 0 6px 18px ${V}66;
        }
        .opex-rf-note-body {
          display: flex; flex-direction: column; gap: 1px; line-height: 1.15;
        }
        .opex-rf-note-eyebrow {
          font-family: var(--font-outfit);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: ${V_BRIGHT};
          display: inline-flex; align-items: center; gap: 6px;
        }
        .opex-rf-note-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: ${V_BRIGHT};
          box-shadow: 0 0 8px ${V};
          animation: opexRfPulse 1.6s ease-in-out infinite;
        }
        .opex-rf-note-title {
          font-family: var(--font-display);
          font-size: 13.5px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.2px;
        }
        .opex-rf-note-cta {
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          display: inline-flex; align-items: center;
          margin-top: 2px;
        }
        .opex-rf-note:hover .opex-rf-note-cta { color: ${V_BRIGHT}; }
        @keyframes opexRfPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(1.5); }
        }

        /* ── FAB icon (mobile) ─────────────────────────────────────── */
        .opex-rf-fab-wrap {
          position: fixed;
          bottom: 96px;
          right: 24px;
          z-index: 50;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          gap: 12px;
        }
        .opex-rf-fab-btnwrap {
          position: relative;
          display: inline-flex;
        }
        .opex-rf-fab {
          position: relative;
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 1px solid ${V_BRIGHT};
          background: linear-gradient(135deg, ${V} 0%, ${V_BRIGHT} 100%);
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.34),
            inset 0 -1.5px 0 rgba(0,0,0,0.25),
            0 14px 36px rgba(0,0,0,0.45),
            0 0 30px ${V}55;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
        }
        .opex-rf-fab:hover {
          transform: translateY(-3px) scale(1.06);
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.4),
            inset 0 -1.5px 0 rgba(0,0,0,0.25),
            0 18px 44px rgba(0,0,0,0.5),
            0 0 44px ${V}88;
        }
        .opex-rf-fab-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${V};
          opacity: 0.4;
          animation: opexRfFabRing 2.4s ease-out infinite;
          z-index: -1;
        }
        @keyframes opexRfFabRing {
          0%   { transform: scale(1);   opacity: 0.55; }
          80%  { transform: scale(1.7); opacity: 0;    }
          100% { transform: scale(1.7); opacity: 0;    }
        }
        .opex-rf-fab-close {
          position: absolute;
          top: -6px; right: -6px;
          width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.22);
          background: ${BG_DARK};
          color: rgba(255,255,255,0.78);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .opex-rf-fab-close:hover {
          color: white;
          background: ${V};
          border-color: ${V_BRIGHT};
          transform: rotate(90deg) scale(1.08);
        }

        .opex-rf-fab-nudge {
          position: relative;
          max-width: 230px;
          padding: 12px 32px 12px 14px;
          border-radius: 14px;
          background: linear-gradient(145deg, ${BG_CARD} 0%, ${BG_DARK} 100%);
          border: 1px solid ${V}66;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 14px 36px rgba(0,0,0,0.55),
            0 0 28px ${V}30;
          display: flex; flex-direction: column; gap: 4px;
        }
        .opex-rf-fab-nudge-eyebrow {
          font-family: var(--font-outfit);
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: ${V_BRIGHT};
          display: inline-flex; align-items: center; gap: 6px;
        }
        .opex-rf-fab-nudge-text {
          font-family: var(--font-display);
          font-size: 12.5px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.1px;
          line-height: 1.25;
        }
        .opex-rf-fab-nudge-close {
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
        .opex-rf-fab-nudge-close:hover {
          color: white;
          background: ${V}33;
          border-color: ${V}88;
        }
        .opex-rf-fab-nudge-tail {
          position: absolute;
          right: -6px; top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 12px; height: 12px;
          background: ${BG_CARD};
          border-top: 1px solid ${V}66;
          border-right: 1px solid ${V}66;
        }

        @media (max-width: 700px) {
          .opex-rf-fab-wrap { bottom: 88px; right: 16px; }
          .opex-rf-fab { width: 50px; height: 50px; }
          .opex-rf-fab-nudge { max-width: 200px; padding: 10px 28px 10px 12px; }
        }
      `}</style>
    </>
  );
}
