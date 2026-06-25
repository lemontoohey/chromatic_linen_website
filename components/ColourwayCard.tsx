'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Colourway } from '@/data/colourways';
import { FabricSwatch } from '@/components/FabricSwatch';
import { useUiStore } from '@/store/useUiStore';

function avgHex(layers?: string[]): string {
  if (!layers || layers.length === 0) return '#888888';
  let r = 0, g = 0, b = 0;
  for (const h of layers) {
    const c = h.replace('#', '');
    r += parseInt(c.substring(0, 2), 16);
    g += parseInt(c.substring(2, 4), 16);
    b += parseInt(c.substring(4, 6), 16);
  }
  const n = layers.length;
  const toHex = (v: number) => Math.round(v / n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function darken(hex: string, amt: number) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) * (1 - amt);
  const g = parseInt(c.substring(2, 4), 16) * (1 - amt);
  const b = parseInt(c.substring(4, 6), 16) * (1 - amt);
  const toHex = (v: number) => Math.round(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface ColourwayCardProps {
  colourway: Colourway;
  onSelect: (c: Colourway) => void;
}

export function ColourwayCard({ colourway, onSelect }: ColourwayCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const setActiveColourway = useUiStore((s) => s.setActiveColourway);
  const activeColourway = useUiStore((s) => s.activeColourway);
  const isActive = activeColourway === colourway.hex;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !revealed) setRevealed(true); },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const tintObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActiveColourway(colourway.hex); },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    );
    tintObserver.observe(node);
    return () => tintObserver.disconnect();
  }, [colourway.hex, setActiveColourway]);

  return (
    <div ref={ref} className="cursor-pointer w-[82vw] md:w-[42vw]" onClick={() => onSelect(colourway)}>
      <div className="relative">
        <motion.div
          layoutId={`colourway-container-${colourway.id}`}
          className="relative w-full h-[60vh] md:h-[72vh] overflow-hidden"
          style={{ boxShadow: '0 40px 80px -20px rgba(10,5,25,1), 0 0 30px 2px rgba(90,30,120,0.18)' }}
        >
          <motion.div
            layoutId={`colourway-image-${colourway.id}`}
            className="absolute inset-0"
            initial={{ filter: 'blur(14px)', scale: 1.02 }}
            animate={revealed ? { filter: 'blur(0px)', scale: 1 } : { filter: 'blur(14px)', scale: 1.02 }}
            transition={{ duration: 2.6, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <FabricSwatch hex={colourway.hex} layers={colourway.dyeLayers} className="w-full h-full" />
          </motion.div>

          {/* Solid colour topcoat */}
          <div className="absolute inset-0 z-[2] pointer-events-none"
            style={{ backgroundColor: avgHex(colourway.dyeLayers), opacity: 0.73 }} />

          {/* Radial vignette */}
          <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
            style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(6,0,12,0.55) 78%, rgba(6,0,12,0.92) 100%)' }} />
          {/* Inset shadow */}
          <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
            style={{ boxShadow: 'inset 0 0 50px 10px rgba(6,0,12,0.7)' }} />
          {/* Noise */}
          <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.015] bg-noise mix-blend-overlay" aria-hidden />

          {/* Colour-burn edge glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[6] mix-blend-color-burn"
            style={{
              background: `radial-gradient(ellipse 90% 90% at 50% 50%, transparent 58%, ${darken(colourway.hex, 0.45)} 100%)`,
            }}
            animate={{ opacity: isActive ? 0.3 : 0.08 }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            aria-hidden
          />
        </motion.div>
      </div>

      <div className="flex items-baseline justify-between mt-5">
        <div>
          <span className="font-serif tracking-[0.25em] text-[11px] uppercase text-parchment/70">{colourway.name}</span>
          <p className="font-sans text-[10px] tracking-[0.1em] text-parchment/40 mt-1">{colourway.suited}</p>
        </div>
        <span className="font-serif tracking-[0.25em] text-[11px] uppercase text-parchment/70">
          {colourway.standardFrom}
        </span>
      </div>
    </div>
  );
}
