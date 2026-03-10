"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";

type TransitionVariant = "sweep" | "expand" | "pulse" | "dataflow";

interface SectionTransitionProps {
  variant?: TransitionVariant;
  color?: string; // Custom accent color (default: orange)
}

/**
 * SectionTransition
 *
 * The website's recurring visual motif. Between every major section,
 * a thin animated line of orange light appears — inspired by the horizontal
 * bar on the letter "F" in the EFG logo.
 *
 * It's a punctuation mark between scenes. A breath between acts.
 *
 * Three variants:
 * - "sweep": races from left to right edge
 * - "expand": shoots outward from center in both directions
 * - "pulse": a single heartbeat of energy
 */
export default function SectionTransition({
  variant = "sweep",
  color,
}: SectionTransitionProps) {
  const [ref, isVisible] = useReveal<HTMLDivElement>({ threshold: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  // Default to orange, or use custom color
  const accentColor = color || "var(--orange)";
  const glowColor = color
    ? `${color}4D` // 30% opacity hex
    : "rgba(232, 101, 26, 0.3)";

  return (
    <div
      ref={ref}
      className="relative w-screen left-1/2 -translate-x-1/2"
      style={{ height: "2px", margin: 0, padding: 0 }}
    >
      {variant === "sweep" && (
        <SweepLine isVisible={hasAnimated} color={accentColor} glowColor={glowColor} />
      )}
      {variant === "expand" && (
        <ExpandLine isVisible={hasAnimated} color={accentColor} glowColor={glowColor} />
      )}
      {variant === "pulse" && (
        <PulseLine isVisible={hasAnimated} color={accentColor} glowColor={glowColor} />
      )}
      {variant === "dataflow" && (
        <DataflowLine isVisible={hasAnimated} color={accentColor} glowColor={glowColor} />
      )}
    </div>
  );
}

/**
 * Sweep variant: line races from left edge to right edge
 */
function SweepLine({
  isVisible,
  color,
  glowColor,
}: {
  isVisible: boolean;
  color: string;
  glowColor: string;
}) {
  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={
        isVisible
          ? {
              width: "100%",
              opacity: [0, 1, 1, 0.15],
            }
          : { width: 0, opacity: 0 }
      }
      transition={{
        width: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 1, times: [0, 0.1, 0.6, 1] },
      }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: "1.5px",
        background: color,
        boxShadow: isVisible ? `0 0 20px ${glowColor}` : "none",
      }}
    />
  );
}

/**
 * Expand variant: materializes at center, shoots outward in both directions
 */
function ExpandLine({
  isVisible,
  color,
  glowColor,
}: {
  isVisible: boolean;
  color: string;
  glowColor: string;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={
        isVisible
          ? {
              scaleX: 1,
              opacity: [0, 1, 1, 0.15],
            }
          : { scaleX: 0, opacity: 0 }
      }
      transition={{
        scaleX: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 1, times: [0, 0.1, 0.6, 1] },
      }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "1.5px",
        background: color,
        transformOrigin: "center center",
        boxShadow: isVisible ? `0 0 20px ${glowColor}` : "none",
      }}
    />
  );
}

/**
 * Pulse variant: full-width line pulses once like a heartbeat
 */
function PulseLine({
  isVisible,
  color,
  glowColor,
}: {
  isVisible: boolean;
  color: string;
  glowColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={
        isVisible
          ? {
              opacity: [0, 0.6, 0.15],
            }
          : { opacity: 0 }
      }
      transition={{
        duration: 0.8,
        ease: "easeOut",
        times: [0, 0.4, 1],
      }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "1.5px",
        background: color,
        boxShadow: isVisible ? `0 0 20px ${glowColor}` : "none",
      }}
    />
  );
}

/**
 * Dataflow variant: a bright packet sweeps across a dim baseline —
 * like data flowing through a wire. Trail lingers at low opacity.
 */
function DataflowLine({
  isVisible,
  color,
  glowColor,
}: {
  isVisible: boolean;
  color: string;
  glowColor: string;
}) {
  return (
    <>
      {/* Dim baseline that appears first */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 0.12 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "1px",
          background: color,
        }}
      />
      {/* Bright packet that sweeps across */}
      <motion.div
        initial={{ left: "-10%", opacity: 0 }}
        animate={
          isVisible
            ? { left: "110%", opacity: [0, 1, 1, 0] }
            : { left: "-10%", opacity: 0 }
        }
        transition={{
          left: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.8, times: [0, 0.1, 0.7, 1] },
        }}
        style={{
          position: "absolute",
          top: "-1px",
          width: "60px",
          height: "3px",
          borderRadius: "2px",
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 16px ${glowColor}, 0 0 4px ${color}`,
        }}
      />
    </>
  );
}
