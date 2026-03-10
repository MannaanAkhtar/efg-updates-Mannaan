"use client";

/**
 * DotMatrixGrid
 *
 * A pure CSS dot-pattern overlay that evokes graph paper / data dashboards.
 * Uses radial-gradient for ultra-lightweight rendering — no canvas, no SVG.
 *
 * Layer it behind section content for a subtle "intelligence dashboard" feel.
 */
interface DotMatrixGridProps {
  dotSize?: number;
  spacing?: number;
  opacity?: number;
  color?: string;
}

export default function DotMatrixGrid({
  dotSize = 1.5,
  spacing = 24,
  opacity = 0.03,
  color = "currentColor",
}: DotMatrixGridProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        zIndex: 1,
      }}
    />
  );
}
