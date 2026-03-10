"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * NeuralConstellation
 *
 * Canvas-based animated constellation of slowly drifting nodes
 * connected by fading lines. Evokes neural networks / data graphs.
 *
 * Performance-conscious:
 * - Pauses when off-screen via IntersectionObserver
 * - Static snapshot on touch devices (hover: none)
 * - Lightweight: just dots + lines, no complex geometry
 */
interface NeuralConstellationProps {
  color?: string;
  dotCount?: number;
  connectionDistance?: number;
  speed?: number;
  opacity?: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function NeuralConstellation({
  color = "#0F735E",
  dotCount = 30,
  connectionDistance = 150,
  speed = 0.3,
  opacity = 0.15,
}: NeuralConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(false);
  const isTouchDevice = useRef(false);

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 15, g: 115, b: 94 };
  }, []);

  const initNodes = useCallback(
    (width: number, height: number) => {
      const nodes: Node[] = [];
      for (let i = 0; i < dotCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: Math.random() * 1.5 + 0.8,
        });
      }
      return nodes;
    },
    [dotCount, speed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detect touch device
    isTouchDevice.current = window.matchMedia("(hover: none)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = hexToRgb(color);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-init nodes if dimensions changed significantly
      if (nodesRef.current.length === 0) {
        nodesRef.current = initNodes(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // IntersectionObserver to pause off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !isTouchDevice.current) {
          animate();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const draw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;

      // Update positions
      if (!isTouchDevice.current) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;

          // Bounce off edges
          if (node.x < 0 || node.x > w) node.vx *= -1;
          if (node.y < 0 || node.y > h) node.vy *= -1;

          // Clamp
          node.x = Math.max(0, Math.min(w, node.x));
          node.y = Math.max(0, Math.min(h, node.y));
        }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const lineOpacity = (1 - dist / connectionDistance) * 0.4;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
        ctx.fill();
      }
    };

    const animate = () => {
      if (!isVisibleRef.current) return;
      draw();
      rafRef.current = requestAnimationFrame(animate);
    };

    // For touch devices, draw once as static snapshot
    if (isTouchDevice.current) {
      draw();
    } else {
      isVisibleRef.current = true;
      animate();
    }

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [color, connectionDistance, hexToRgb, initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity, zIndex: 1 }}
    />
  );
}
