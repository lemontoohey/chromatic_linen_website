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
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p); p = p * 2.0 + vec2(1.7, 9.2); a *= 0.5;
    }
    return v;
  }

  vec3 deriveHighlight(vec3 c) { return clamp(c * 1.45 + 0.10, 0.0, 1.0); }
  vec3 deriveShadow(vec3 c)    { return c * 0.48; }
  vec3 deriveDeep(vec3 c)      { return c * 0.22; }

  float foldAt(vec2 uv, float t) {
    vec2 q = uv * 2.0 + vec2(fbm(uv * 2.5 + t), fbm(uv * 2.5 + vec2(5.2, 1.3) + t * 0.7));
    return fbm(q + t * 0.1);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.006;

    // dye-layer blending — two independent noise fields drive uneven colour
    // migration, the way real dye uptake works across fibre
    float dyeMaskA = fbm(uv * 2.2 + vec2(1.7, 4.1) + t * 0.04);
    float dyeMaskB = fbm(uv * 2.6 + vec2(8.3, 2.5) - t * 0.03);
    vec3 dyeColour = mix(u_layerA, u_layerB, smoothstep(0.32, 0.68, dyeMaskA));
    dyeColour = mix(dyeColour, u_layerC, smoothstep(0.38, 0.62, dyeMaskB) * step(2.5, u_layerCount));

    // terry cloth loop pile
    vec2 loopUV = uv * 55.0;
    vec2 cell = fract(loopUV);
    float loopDist = length(cell - 0.5);
    float loop = smoothstep(0.42, 0.18, loopDist);
    vec2 cellID = floor(loopUV);
    float loopVar = hash(cellID) * 0.3 + 0.7;
    loop *= loopVar;

    // fold/drape height field + true surface normal via finite differences
    float fold = foldAt(uv, t);
    float eps = 1.6 / u_resolution.x;
    float foldX = foldAt(uv + vec2(eps, 0.0), t);
    float foldY = foldAt(uv + vec2(0.0, eps), t);
    vec3 normal = normalize(vec3(-(foldX - fold) * 6.0, -(foldY - fold) * 6.0, 1.0));

    // slow-drifting light, proper Lambertian diffuse off the fold normal
    float lightPhase = t * 0.4;
    vec3 lightDir = normalize(vec3(cos(lightPhase), sin(lightPhase) * 0.6, 0.75));
    float diffuse = max(dot(normal, lightDir), 0.0);

    // Fresnel rim — grazing-angle fold edges and loop rims catch light
    float fresnel = pow(1.0 - clamp(normal.z, 0.0, 1.0), 2.4);

    // compose colour from dye layers + terry structure
    vec3 colour = mix(deriveShadow(dyeColour), dyeColour, fold * 0.75 + 0.25);
    colour = mix(colour, deriveHighlight(dyeColour), loop * 0.4 * (0.7 + 0.3 * fold));
    float gap = 1.0 - smoothstep(0.15, 0.4, loopDist);
    colour = mix(colour, deriveDeep(dyeColour), (1.0 - loop) * 0.18 * gap * loopVar);

    // apply lighting
    colour *= 0.82 + 0.34 * diffuse;
    colour += deriveHighlight(dyeColour) * fresnel * 0.16;

    // chromatic dispersion at the rim — light faintly splitting on the weave
    colour.r += fresnel * 0.012;
    colour.b -= fresnel * 0.012;

    // fine thread grain
    float grain = (hash(gl_FragCoord.xy + u_time * 0.04) - 0.5) * 0.012;
    colour += grain;

    // soft vignette
    vec2 vc = uv - 0.5;
    float vig = 1.0 - smoothstep(0.32, 0.88, length(vc * vec2(1.0, 0.82)));
    colour *= 0.92 + 0.08 * vig;

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
  layers?: string[];
  className?: string;
}

export function FabricSwatch({ hex, layers, className }: FabricSwatchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const layersKey = (layers ?? []).join(',');

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
  }, [hex, layersKey]);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
