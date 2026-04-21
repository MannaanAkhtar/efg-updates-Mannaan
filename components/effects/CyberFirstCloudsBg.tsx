"use client";

import { useEffect, useRef } from "react";

/**
 * CyberFirstCloudsBg
 *
 * WebGL2 cosmic cloud shader, retuned to Cyber First's cyan palette.
 * Based on Matthias Hurrle's (@atzedent) fractal-cloud scene — the
 * original amber/rainbow palette is replaced with deep-blue nebula and
 * cyan light points so it reads as premium cybersecurity, not sunset.
 *
 * Designed to sit absolutely inside the Hero section. Pauses off-screen.
 */

const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main() { gl_Position = position; }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 move;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p = fract(p*vec2(12.9898,78.233));
  p += dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) { t+=a*noise(p); p*=2.*m; a*=.5; }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}

void main(void) {
  vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2,1);
  // Subtle pointer parallax (smoothed on the JS side)
  uv += move * 0.0002;

  vec3 col = vec3(0);
  float bg = clouds(vec2(st.x + T*0.28, -st.y));

  uv *= 1. - 0.24*(sin(T*0.16)*0.5 + 0.5);

  for (float i=1.; i<12.; i++) {
    uv += 0.1*cos(i*vec2(0.1 + 0.01*i, 0.8) + i*i + T*0.4 + 0.1*uv.x);
    vec2 p = uv;
    float d = length(p);

    // Light points — cyan-dominant (replaces original rainbow math)
    col += 0.00125/d
         * (cos(sin(i)*vec3(0.25, 0.55, 1.)) + 1.)
         * vec3(0.18, 0.78, 1.08);

    float b = noise(i + p + bg*1.731);
    col += 0.0018 * b / length(max(p, vec2(b*p.x*0.02, p.y)));

    // Nebula tint — deep cyan-ink (was warm amber: vec3(.25,.137,.05))
    col = mix(col, vec3(bg*0.018, bg*0.085, bg*0.16), d);
  }

  // Overall dampening so content on top stays legible
  col *= 0.82;

  O = vec4(col, 1.0);
}`;

export default function CyberFirstCloudsBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    function compile(type: number, source: string): WebGLShader | null {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, source);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "resolution");
    const uTime = gl.getUniformLocation(program, "time");
    const uMove = gl.getUniformLocation(program, "move");

    // Smoothed pointer parallax
    const target: [number, number] = [0, 0];
    const move: [number, number] = [0, 0];
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      target[0] = nx * 70;
      target[1] = -ny * 70;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Resize with DPR cap
    const DPR_CAP = 1.25;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const rect = canvas!.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }
    resize();
    window.addEventListener("resize", resize);

    // Pause off-screen
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => { isVisible = entries[0]?.isIntersecting ?? true; },
      { threshold: 0 },
    );
    io.observe(canvas);

    // Reduced motion
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    function loop(now: number) {
      resize();
      // Smooth toward target mouse position
      move[0] += (target[0] - move[0]) * 0.05;
      move[1] += (target[1] - move[1]) * 0.05;

      if (isVisible) {
        gl!.uniform2f(uRes, canvas!.width, canvas!.height);
        gl!.uniform1f(uTime, reduceMotion ? 0 : now * 0.001);
        gl!.uniform2f(uMove, move[0], move[1]);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
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
        background: "#050608",
      }}
    />
  );
}
