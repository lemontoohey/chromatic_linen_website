'use client';
import { useEffect, useRef, useState } from 'react';
import { getDeviceProfile } from '@/lib/deviceTier';
import { sharedTicker } from '@/lib/sharedTicker';

const VERT = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAG = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_layerA;
  uniform vec3 u_layerB;
  uniform vec3 u_layerC;
  uniform float u_layerCount;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p, float maxOct) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      if (float(i) >= maxOct) break;
      v += a * noise(p); p = p * 2.0 + vec2(1.7, 9.2); a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.004;

    vec3 base = mix(mix(u_layerA, u_layerB, 0.5), u_layerC, 0.34 * step(2.5, u_layerCount));

    float lum = dot(base, vec3(0.299, 0.587, 0.114));
    vec3 deepened = mix(base, base * base, 0.18);
    vec3 colour = mix(vec3(lum), deepened, 1.12);

    float sweep = noise(uv * 1.1 + vec2(t * 0.6, t * 0.3));
    colour *= 0.94 + 0.10 * sweep;

    float grain = (hash(gl_FragCoord.xy + u_time * 0.04) - 0.5) * 0.012;
    colour += grain;

    vec2 vc = uv - 0.5;
    float vig = 1.0 - smoothstep(0.42, 0.95, length(vc * vec2(1.0, 0.84)));
    colour *= 0.95 + 0.05 * vig;

    gl_FragColor = vec4(clamp(colour, 0.0, 1.0), 1);
  }
`;

function hexToVec3(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  return [
    parseInt(c.substring(0, 2), 16) / 255,
    parseInt(c.substring(2, 4), 16) / 255,
    parseInt(c.substring(4, 6), 16) / 255,
  ];
}

function cssFallback(hex: string, layers?: string[]): string {
  const colours = layers && layers.length > 0 ? layers : [hex];
  if (colours.length === 1) return colours[0];
  const stops = colours
    .map((c, i) => `${c} ${Math.round((i / (colours.length - 1)) * 100)}%`)
    .join(', ');
  return `radial-gradient(ellipse 120% 100% at 35% 25%, ${stops})`;
}

interface FabricSwatchProps {
  hex: string;
  layers?: string[];
  className?: string;
}

export function FabricSwatch({ hex, layers, className }: FabricSwatchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [supported, setSupported] = useState(true);
  const layersKey = (layers ?? []).join(',');

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const profile = getDeviceProfile();
    if (profile.noGpu) {
      setSupported(false);
      return;
    }

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
      setSupported(false);
      return;
    }

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(prog, 'u_time');
    const resLoc = gl.getUniformLocation(prog, 'u_resolution');
    const layerALoc = gl.getUniformLocation(prog, 'u_layerA');
    const layerBLoc = gl.getUniformLocation(prog, 'u_layerB');
    const layerCLoc = gl.getUniformLocation(prog, 'u_layerC');
    const layerCountLoc = gl.getUniformLocation(prog, 'u_layerCount');

    const provided = (layers && layers.length > 0 ? layers : [hex]).slice(0, 3);
    const layerCount = provided.length;
    while (provided.length < 3) provided.push(provided[provided.length - 1]);

    gl.uniform3f(layerALoc, ...hexToVec3(provided[0]));
    gl.uniform3f(layerBLoc, ...hexToVec3(provided[1]));
    gl.uniform3f(layerCLoc, ...hexToVec3(provided[2]));
    gl.uniform1f(layerCountLoc, layerCount);

    function resize() {
      const rect = container!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, profile.dprCap);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }
    resize();
    window.addEventListener('resize', resize);

    const start = performance.now();
    const frameBudget = 1000 / profile.targetFps;
    let accum = 0;
    let tickerId: symbol | null = null;

    function draw(_time: number, dt: number) {
      accum += dt;
      if (accum < frameBudget) return;
      accum = 0;
      const t = (performance.now() - start) / 1000;
      gl!.uniform1f(timeLoc, t);
      gl!.uniform2f(resLoc, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }
    function subscribe() {
      if (tickerId === null) tickerId = sharedTicker.subscribe(draw);
    }
    function unsubscribe() {
      if (tickerId !== null) {
        sharedTicker.unsubscribe(tickerId);
        tickerId = null;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) subscribe();
        else unsubscribe();
      },
      { rootMargin: '20% 0px 20% 0px', threshold: 0 }
    );
    observer.observe(container);

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      unsubscribe();
      gl!.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [hex, layersKey]);

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }}>
      {supported ? (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: cssFallback(hex, layers) }} />
      )}
    </div>
  );
}
