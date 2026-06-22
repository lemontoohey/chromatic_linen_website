'use client';
import { useEffect, useRef } from 'react';

const VERT = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAG = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_base;
  uniform vec3 u_highlight;
  uniform vec3 u_shadow;
  uniform vec3 u_deep;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1,0));
    float c = hash(i + vec2(0,1)), d = hash(i + vec2(1,1));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p); p = p * 2.0 + vec2(1.7, 9.2); a *= 0.5;
    }
    return v;
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.008;

    // terry cloth loop grid — dense pile pattern
    vec2 loopUV = uv * 55.0;
    vec2 cell = fract(loopUV);
    float loopDist = length(cell - 0.5);
    float loop = smoothstep(0.42, 0.18, loopDist);
    // variation per loop so they're not identical
    vec2 cellID = floor(loopUV);
    float loopVar = hash(cellID) * 0.3 + 0.7;
    loop *= loopVar;

    // large-scale drape/fold for breathing
    vec2 q = uv * 2.0 + vec2(fbm(uv * 2.5 + t), fbm(uv * 2.5 + vec2(5.2,1.3) + t * 0.7));
    float fold = fbm(q * 1.0 + t * 0.12);

    // combine: base colour modulated by loops and folds
    vec3 colour = mix(u_shadow, u_base, fold * 0.8 + 0.2);
    // loop tops are lighter (pile catches light)
    colour = mix(colour, u_highlight, loop * 0.45 * (0.7 + 0.3 * fold));
    // gaps between loops are darker
    float gap = 1.0 - smoothstep(0.15, 0.4, loopDist);
    colour = mix(colour, u_deep, (1.0 - loop) * 0.2 * gap * loopVar);

    // slow directional light shift across folds
    float lightPhase = t * 0.5;
    vec2 lightDir = vec2(cos(lightPhase), sin(lightPhase));
    float grad = fold * 2.0 - 1.0;
    float light = dot(vec2(grad, grad * 0.6), lightDir);
    colour += u_highlight * light * 0.06;

    // fine thread grain
    float grain = (hash(gl_FragCoord.xy + u_time * 0.05) - 0.5) * 0.015;
    colour += grain;

    // soft vignette
    vec2 vc = uv - 0.5;
    float vig = 1.0 - smoothstep(0.3, 0.85, length(vc * vec2(1.0, 0.8)));
    colour *= 0.9 + 0.1 * vig;

    gl_FragColor = vec4(clamp(colour, 0.0, 1.0), 1.0);
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

interface FabricSwatchProps {
  hex: string;
  className?: string;
}

export function FabricSwatch({ hex, className }: FabricSwatchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

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
    const baseLoc = gl.getUniformLocation(prog, 'u_base');
    const hlLoc = gl.getUniformLocation(prog, 'u_highlight');
    const shLoc = gl.getUniformLocation(prog, 'u_shadow');
    const dpLoc = gl.getUniformLocation(prog, 'u_deep');

    const base = hexToVec3(hex);
    const highlight: [number, number, number] = [
      Math.min(1, base[0] * 1.5 + 0.12),
      Math.min(1, base[1] * 1.5 + 0.12),
      Math.min(1, base[2] * 1.5 + 0.12),
    ];
    const shadow: [number, number, number] = [base[0] * 0.45, base[1] * 0.45, base[2] * 0.45];
    const deep: [number, number, number] = [base[0] * 0.2, base[1] * 0.2, base[2] * 0.2];

    gl.uniform3f(baseLoc, ...base);
    gl.uniform3f(hlLoc, ...highlight);
    gl.uniform3f(shLoc, ...shadow);
    gl.uniform3f(dpLoc, ...deep);

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
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
  }, [hex]);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
