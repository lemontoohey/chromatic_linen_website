'use client';
import { useEffect, useRef } from 'react';

// Recoloured to a deep-midnight base with a faint teal undertone (the
// Beacon Laundry brand colour), atmospheric fbm noise, vignette and grain
// all kept from the original gallery shader — just much darker and cooler.
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
  vec3 base_colour = vec3(0.039, 0.055, 0.110); // #0A0E1C — deep midnight
  vec3 teal_tint = vec3(0.078, 0.490, 0.478);   // #147D7A — beacon teal
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
    vec2 q = uv + vec2(fbm(uv + t), fbm(uv + vec2(1.7, 9.2) + t));
    float f = fbm(q * 2.0 + t * 0.3);
    vec3 colour = base_colour;
    // slow drifting teal undertone through the noise field
    colour += (f - 0.5) * 0.14 * teal_tint;
    // faint central lift, breathing slowly
    float centre_glow = smoothstep(0.45, 0.0, length(uv));
    colour = mix(colour, base_colour + teal_tint * 0.12, centre_glow * 0.35 * (0.5 + 0.5 * sin(u_time * 0.2)));
    // deep vignette toward the edges
    float dist_centre = length(uv * vec2(0.9, 1.1));
    float vignette = 1.0 - smoothstep(0.25, 1.3, dist_centre);
    colour *= (0.55 + 0.45 * vignette);
    // fine grain
    float grain = (hash(gl_FragCoord.xy + u_time * 0.1) - 0.5) * 0.02;
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
  colour: [number, number, number, number];
}

// Floating motes in varying shades of light violet, drifting up through
// the midnight field like dye pigment suspended in a vat.
const PARTICLE_COLOURS: [number, number, number, number][] = [
  [229, 225, 247, 0.22], // pale mist
  [201, 191, 240, 0.20], // light lavender
  [156, 143, 217, 0.22], // violet
  [176, 160, 230, 0.18], // soft amethyst
  [111, 97, 176, 0.16],  // deeper violet
];

export function CanvasBackground() {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

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
      gl!.uniform1f(timeLoc, t);
      gl!.uniform2f(resLoc, canvas!.width, canvas!.height);
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
      colour: PARTICLE_COLOURS[Math.floor(Math.random() * PARTICLE_COLOURS.length)],
    }));
    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particlesRef.current) {
        p.y -= p.speedY;
        p.x += p.drift * 0.1;
        if (p.y < -10) {
          p.y = canvas!.height + 10;
          p.x = Math.random() * canvas!.width;
        }
        const [r, g, b, a] = p.colour;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx!.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    tick();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={glCanvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 1 }} />
      <canvas ref={particleCanvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 1 }} />
    </div>
  );
}
