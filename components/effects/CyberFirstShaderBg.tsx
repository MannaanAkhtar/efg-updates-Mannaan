"use client";

import { useEffect, useRef } from "react";

/**
 * CyberFirstShaderBg
 *
 * WebGL procedural background — topographic lines + sand-ripple depth —
 * tuned to the Cyber First cyan palette against deep ink. Designed to sit
 * absolutely inside the Hero section (not fixed to the viewport) so it
 * doesn't bleed into sections below.
 *
 * Pauses the animation loop when the containing element is off-screen.
 */
export default function CyberFirstShaderBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        // Perspective toward a horizon low in the frame
        float depth = 1.0 / (uv.y + 1.15);
        vec2 gridUv = vec2(uv.x * depth, depth + u_time * 0.14);

        // Terrain noise + ripple
        float n = noise(gridUv * 3.5);
        float ripples = sin(gridUv.y * 18.0 + n * 8.0 + u_time * 0.45);

        // Neon contour lines
        float topoLine = smoothstep(0.03, 0.0, abs(ripples));

        // Cyber First palette
        vec3 baseColor = vec3(0.018, 0.022, 0.030);            // deep ink
        vec3 midColor  = vec3(0.000, 0.180, 0.320);            // cyan midtone
        vec3 cyan      = vec3(0.004, 0.733, 0.961);            // #01BBF5

        // Composite
        vec3 col = mix(baseColor, midColor, n * 0.55);
        col += topoLine * cyan * depth * 0.55;

        // Horizon fade to hide the singularity + center vignette
        float fade = smoothstep(0.1, -1.0, uv.y);
        col *= (1.0 - length(uv) * 0.42) * (1.0 - fade);

        // Slight film grain to soften gradient banding
        float g = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.02;
        col += g;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");

    // Pause when off-screen
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => { isVisible = entries[0]?.isIntersecting ?? true; },
      { threshold: 0 },
    );
    io.observe(canvas);

    // Respect reduced motion
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const DPR_CAP = 1.25;
    const render = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl!.viewport(0, 0, w, h);
      }

      if (isVisible) {
        gl!.uniform1f(timeLoc, reduceMotion ? 0 : time * 0.001);
        gl!.uniform2f(resLoc, w, h);
        gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      }
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        touchAction: "none",
        pointerEvents: "none",
        filter: "contrast(1.08) brightness(0.92)",
      }}
    />
  );
}
