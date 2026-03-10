"use client";

/**
 * ScanLines
 *
 * Horizontal line overlay via repeating-linear-gradient.
 * Evokes CRT monitors / data terminals — use sparingly on
 * data-heavy sections (DataWall, CTA countdown).
 */
interface ScanLinesProps {
  opacity?: number;
  lineHeight?: number;
  color?: string;
}

export default function ScanLines({
  opacity = 0.02,
  lineHeight = 4,
  color = "rgba(255, 255, 255, 0.08)",
}: ScanLinesProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          ${color} 0px,
          ${color} 1px,
          transparent 1px,
          transparent ${lineHeight}px
        )`,
        zIndex: 1,
      }}
    />
  );
}
