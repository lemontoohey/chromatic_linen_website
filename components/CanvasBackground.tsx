'use client';
import { useEffect, useRef } from 'react';
import { useUiStore } from '@/store/useUiStore';

// Recoloured to a deep-midnight base with a faint, *live* undertone — the
// Beacon Laundry teal by default, but on /collection it eases toward
// whichever colourway card is currently in view (see useUiStore's
// activeColourway, set by ColourwayCard's IntersectionObserver). Atmospheric
// fbm noise, vignette and grain are kept from the original gallery shader,
// just much darker and cooler, with the tint now a uniform instead of a
// fixed constant so it can be driven from JS every frame.
const VERTEX_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;
const FRAGMENT_SRC = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_tint;
  // Three stacked pigment layers — darkest to lightest
  vec3 benzi_brown = vec3(0.36, 0.18, 0.12);  // PBr25 benzimidazolone brown — deep warm red-brown
  vec3 copper      = vec3(0.72, 0.45, 0.20);  // copper — warm metallic mid-tone
  vec3 azo_yellow  = vec3(0.91, 0.70, 0.09);  // PY74 azo yellow — hot golden top layer
  vec3 magenta     = vec3(0.84, 0.08, 0.44);  // magenta light that shines through
  vec3 deep_violet = vec3(0.044, 0.024, 0.07); // deep violet overlay
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.1 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }
  void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.025;
    // low-frequency noise fields so the pigment layers blur into each other
    vec2 q = uv + vec2(fbm(uv + t), fbm(uv + vec2(1.7, 9.2) + t));
    float f1 = fbm(q * 0.9 + t * 0.15);
    float f2 = fbm(q * 1.4 + t * 0.25 + vec2(3.1, 5.7));
    float f3 = fbm(q * 2.0 + t * 0.35 + vec2(7.3, 2.1));
    // stack: benzi brown base, copper bleeds through (most transparent), azo yellow on top
    // wide smoothstep bands = soft edges between layers
    vec3 colour = benzi_brown;
    colour = mix(colour, copper, smoothstep(0.18, 0.72, f2) * 0.3);
    colour = mix(colour, azo_yellow, smoothstep(0.22, 0.78, f3) * 0.5);
    // active colourway bleed
    colour += (f1 - 0.5) * 0.2 * u_tint;
    // magenta central light, breathing slowly
    float centre_glow = smoothstep(0.5, 0.0, length(uv));
    colour = mix(colour, magenta * 0.7, centre_glow * 0.5 * (0.5 + 0.5 * sin(u_time * 0.18)));
    // deep vignette to near-black at edges
    float dist_centre = length(uv * vec2(0.9, 1.1));
    float vignette = 1.0 - smoothstep(0.2, 1.3, dist_centre);
    colour *= (0.4 + 0.6 * vignette);
    // deep violet overlay at 63% to push it back
    colour = mix(colour, deep_violet, 0.63);
    // grain
    float grain = (hash(gl_FragCoord.xy + u_time * 0.1) - 0.5) * 0.025;
    colour += grain;
    gl_FragColor = vec4(clamp(colour, 0.0, 1.0), 1.0);
  }
`;

interface Particle {
  x: number;
  y: number;
  r: number;
  speedY: number;
  drift: number;
  base: [number, number, number, number];
}

const PARTICLE_COLOURS: [number, number, number, number][] = [
  [232, 192, 112, 0.22], // warm gold
  [204, 153, 80, 0.20],  // amber
  [184, 115, 51, 0.18],  // copper
  [214, 170, 90, 0.20],  // pale bronze
  [160, 100, 55, 0.16],  // dark copper
];

const DEFAULT_TINT: [number, number, number] = [0.72, 0.45, 0.20]; // copper default

function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return DEFAULT_TINT;
  return [r, g, b];
}

export function CanvasBackground() {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const rafRef2 = useRef<number>(0);
  // Smoothed tint that eases toward whatever colourway is active — read
  // imperatively from the zustand store each frame so the WebGL loop never
  // has to re-render React.
  const currentTintRef = useRef<[number, number, number]>([...DEFAULT_TINT]);

  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    function compile(type: number, src: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      return shader;
    }
    const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const tintLoc = gl.getUniformLocation(program, 'u_tint');
    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener('resize', resize);
    const start = performance.now();
    function render() {
      const t = (performance.now() - start) / 1000;

      // Ease the live tint toward the active colourway. A small lerp factor
      // gives a slow, deliberate colour bleed rather than a snap-cut.
      const targetHex = useUiStore.getState().activeColourway;
      const target = hexToRgb01(targetHex);
      const tint = currentTintRef.current;
      const ease = 0.025;
      tint[0] += (target[0] - tint[0]) * ease;
      tint[1] += (target[1] - tint[1]) * ease;
      tint[2] += (target[2] - tint[2]) * ease;

      gl!.uniform1f(timeLoc, t);
      gl!.uniform2f(resLoc, canvas!.width, canvas!.height);
      gl!.uniform3f(tintLoc, tint[0], tint[1], tint[2]);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    }
    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    const count = 50;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + 0.6,
      speedY: Math.random() * 0.16 + 0.03,
      drift: Math.random() * 0.4 - 0.2,
      base: PARTICLE_COLOURS[Math.floor(Math.random() * PARTICLE_COLOURS.length)],
    }));
    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const tint = currentTintRef.current;
      const tintR = tint[0] * 255;
      const tintG = tint[1] * 255;
      const tintB = tint[2] * 255;
      for (const part of particlesRef.current) {
        part.y -= part.speedY;
        part.x += part.drift * 0.1;
        if (part.y < -10) {
          part.y = canvas!.height + 10;
          part.x = Math.random() * canvas!.width;
        }
        const [br, bg, bb, a] = part.base;
        // nudge each mote ~12% toward the live tint so the dust drifting
        // through the scene warms/cools along with the shader behind it
        const r = br + (tintR - br) * 0.12;
        const g = bg + (tintG - bg) * 0.12;
        const b = bb + (tintB - bb) * 0.12;
        ctx!.beginPath();
        ctx!.arc(part.x, part.y, part.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx!.fill();
      }
      rafRef2.current = requestAnimationFrame(tick);
    }
    tick();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef2.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={glCanvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 1 }} />
      <canvas ref={particleCanvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 1 }} />
    </div>
  );
}
