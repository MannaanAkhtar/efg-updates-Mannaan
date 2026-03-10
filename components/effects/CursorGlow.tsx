"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CursorGlow
 *
 * A fixed-position div that follows the mouse cursor everywhere on the page.
 * 350px × 350px, perfectly round, with a radial gradient of warm orange light.
 * Follows with intentional lag — a soft pursuit using lerp interpolation.
 *
 * The effect: wherever the user's attention goes, a faint warm light follows.
 * It's atmospheric, like a spotlight in a dark theater tracking the audience's gaze.
 * Most users won't consciously notice it. But they'll feel it.
 *
 * On touch devices, this component renders nothing.
 */
export default function CursorGlow() {
  const [isDesktop, setIsDesktop] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const glowPosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Detect if this is a device with a hover-capable pointer (desktop)
    const mediaQuery = window.matchMedia("(hover: hover)");
    setIsDesktop(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    // Initialize position to center of viewport
    glowPosition.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    mousePosition.current = { ...glowPosition.current };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    // Lerp interpolation factor — 0.08 means 8% closer each frame
    const lerpFactor = 0.08;

    const animate = () => {
      // Move glow position 8% closer to actual mouse position
      glowPosition.current.x +=
        (mousePosition.current.x - glowPosition.current.x) * lerpFactor;
      glowPosition.current.y +=
        (mousePosition.current.y - glowPosition.current.y) * lerpFactor;

      if (glowRef.current) {
        // Center the glow on the interpolated position
        glowRef.current.style.transform = `translate(${glowPosition.current.x - 175}px, ${glowPosition.current.y - 175}px)`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isDesktop]);

  // On touch devices, render nothing
  if (!isDesktop) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 350,
        height: 350,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(232, 101, 26, 0.04) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 9998,
        willChange: "transform",
      }}
    />
  );
}
