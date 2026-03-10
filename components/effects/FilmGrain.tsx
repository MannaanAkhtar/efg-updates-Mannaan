"use client";

/**
 * FilmGrain
 *
 * Full-page SVG noise overlay that adds cinematic texture.
 * Extracted from HeroSection — now reusable across any page.
 *
 * Fixed position, covers entire viewport. Apply once per page.
 */
interface FilmGrainProps {
  opacity?: number;
  baseFrequency?: number;
  zIndex?: number;
}

export default function FilmGrain({
  opacity = 0.025,
  baseFrequency = 0.9,
  zIndex = 50,
}: FilmGrainProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        opacity,
        zIndex,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
