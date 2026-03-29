"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import createGlobe from "cobe"

// ─── Upcoming Event Locations ────────────────────────────────────────────────
const EFG_MARKERS = [
  // Ordered by event date (June → October → Coming Soon)
  { id: "kuwait", location: [29.38, 47.99] as [number, number], name: "Kuwait City", series: "Cyber First", color: "#01BBF5", href: "/events/cyber-first/kuwait-2026" },
  { id: "delhi", location: [28.61, 77.21] as [number, number], name: "New Delhi", series: "Cyber First", color: "#01BBF5", href: "/events/cyber-first/india-2026" },
  { id: "nairobi", location: [-1.29, 36.82] as [number, number], name: "Nairobi", series: "Cyber First", color: "#01BBF5", href: "/events/cyber-first/kenya-2026" },
  { id: "riyadh", location: [24.71, 46.68] as [number, number], name: "Riyadh", series: "OPEX First", color: "#7C3AED", href: "/events/opex-first/saudi-2026" },
  { id: "doha", location: [25.29, 51.53] as [number, number], name: "Doha", series: "Digital First", color: "#0F735E", href: "/events/data-ai-first/qatar-2026" },
  { id: "muscat", location: [23.59, 58.54] as [number, number], name: "Muscat", series: "Cyber First", color: "#01BBF5", href: "/events/cyber-first/oman-2026" },
  { id: "jubail", location: [27.01, 49.66] as [number, number], name: "Jubail", series: "OT Security", color: "#D34B9A", href: "/events/ot-security-first/jubail-2026" },
  { id: "johannesburg", location: [-26.20, 28.04] as [number, number], name: "Johannesburg", series: "Cyber First", color: "#01BBF5", href: "/events" },
  { id: "singapore", location: [1.35, 103.82] as [number, number], name: "Singapore", series: "OT Security", color: "#D34B9A", href: "/events" },
]

interface EFGGlobeProps {
  className?: string
}

export default function EFGGlobe({ className = "" }: EFGGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!mounted || !canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0
    const initialPhi = 135 * (Math.PI / 180) * -1 // Face Australia

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: initialPhi,
        theta: 0.15,
        dark: 1,
        diffuse: 1.8,
        mapSamples: 20000,
        mapBrightness: 8,
        baseColor: [0.12, 0.12, 0.12],
        markerColor: [0.91, 0.4, 0.1],
        glowColor: [0.15, 0.06, 0.02],
        markerElevation: 0,
        markers: EFG_MARKERS.map((m) => ({
          location: m.location,
          size: 0.025,
          id: m.id,
        })),
        opacity: 0.85,
      })

      phi = initialPhi

      function animate() {
        if (!isPausedRef.current) phi += 0.005
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.15 + thetaOffsetRef.current + dragOffset.current.theta,
        })
        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"), 100)
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [mounted])

  if (!mounted) return <div className={`relative select-none ${className}`} />

  return (
    <div className={`relative select-none ${className}`} style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 2vw, 32px)" }}>
      {/* Globe + colored dot overlays */}
      <div style={{ flex: 1, aspectRatio: "1/1", position: "relative" }}>
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          style={{
            width: "100%", height: "100%",
            cursor: "grab", opacity: 0,
            transition: "opacity 1.5s ease",
            touchAction: "none",
          }}
        />
        {/* Colored dot overlays — CSS Anchor Positioned, no interaction */}
        {EFG_MARKERS.map((m) => (
          <div
            key={m.id}
            style={{
              position: "absolute",
              // @ts-ignore CSS Anchor Positioning
              positionAnchor: `--cobe-${m.id}`,
              bottom: "anchor(center)",
              left: "anchor(center)",
              translate: "-50% 50%",
              width: 8,
              height: 8,
              pointerEvents: "none" as const,
              opacity: `var(--cobe-visible-${m.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 6px))`,
              transition: "opacity 0.3s, filter 0.3s",
            }}
          >
            {/* Glow */}
            <span style={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${m.color}50, transparent 70%)`,
            }} />
            {/* Dot */}
            <span style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: m.color,
              boxShadow: `0 0 6px ${m.color}80`,
            }} />
          </div>
        ))}
      </div>

      {/* Legend — right side */}
      <div className="efg-globe-legend" style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, width: "clamp(100px, 12vw, 150px)" }}>
        <span style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          marginBottom: 4,
        }}>
          2026 Events
        </span>

        {EFG_MARKERS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => router.push(m.href)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px",
              borderRadius: 8,
              cursor: "pointer",
              background: hovered === m.id ? "rgba(255,255,255,0.04)" : "transparent",
              transition: "all 0.25s ease",
            }}
          >
            <span style={{
              width: 6, height: 6,
              borderRadius: "50%",
              background: m.color,
              boxShadow: hovered === m.id ? `0 0 10px ${m.color}80` : "none",
              transition: "box-shadow 0.3s ease",
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: hovered === m.id ? 600 : 400,
              color: hovered === m.id ? "white" : "rgba(255,255,255,0.45)",
              transition: "all 0.25s ease",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}>
              {m.name}
            </span>
            <motion.svg
              width="10" height="10"
              viewBox="0 0 24 24" fill="none"
              stroke={m.color} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ marginLeft: "auto", flexShrink: 0 }}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: hovered === m.id ? 1 : 0, x: hovered === m.id ? 0 : -4 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .efg-globe-legend { display: none !important; }
        }
      `}</style>
    </div>
  )
}
