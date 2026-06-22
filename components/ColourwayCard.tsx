'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Colourway } from '@/data/colourways';
import { FabricSwatch } from '@/components/FabricSwatch';
import { useUiStore } from '@/store/useUiStore';

interface ColourwayCardProps {
  colourway: Colourway;
  onSelect: (c: Colourway) => void;
}

export function ColourwayCard({ colourway, onSelect }: ColourwayCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const setActiveColourway = useUiStore((s) => s.setActiveColourway);

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
        {/* Ambient colour glow */}
        <div aria-hidden className="absolute -inset-12 pointer-events-none blur-[70px] mix-blend-screen"
          style={{ background: `radial-gradient(ellipse 55% 65% at 50% 44%, ${colourway.hex}12 0%, transparent 70%)` }} />
        <div aria-hidden className="absolute -inset-12 pointer-events-none blur-[90px] mix-blend-screen"
          style={{ background: 'radial-gradient(ellipse 45% 55% at 50% 44%, rgba(90,30,120,0.07) 0%, transparent 70%)' }} />

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

          {/* Mist veil — lifts once to reveal the fabric */}
          <motion.div className="absolute inset-0 z-[3] pointer-events-none bg-void/70 backdrop-blur-md"
            initial={{ opacity: 1 }}
            animate={revealed ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 2.8, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }} />

          {/* One soft diagonal light sweep on reveal */}
          {revealed && (
            <motion.div className="absolute inset-0 z-[4] pointer-events-none mix-blend-screen"
              style={{ background: 'linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.14) 50%, transparent 62%)' }}
              initial={{ x: '-130%' }}
              animate={{ x: '130%' }}
              transition={{ duration: 2.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
          )}

          {/* Radial vignette */}
          <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
            style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(6,0,12,0.55) 78%, rgba(6,0,12,0.92) 100%)' }} />
          {/* Inset shadow */}
          <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
            style={{ boxShadow: 'inset 0 0 50px 10px rgba(6,0,12,0.7)' }} />
          {/* Noise */}
          <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.015] bg-noise mix-blend-overlay" aria-hidden />
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
