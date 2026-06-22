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
        <div
          aria-hidden
          className="absolute -inset-12 pointer-events-none blur-[70px] mix-blend-screen"
          style={{ background: `radial-gradient(ellipse 55% 65% at 50% 44%, ${colourway.hex}18 0%, transparent 70%)` }}
        />

        <motion.div
          layoutId={`colourway-container-${colourway.id}`}
          className="relative w-full h-[60vh] md:h-[72vh] overflow-hidden"
          style={{ boxShadow: '0 40px 80px -20px rgba(10,5,25,0.9), 0 0 30px 2px rgba(90,30,120,0.15)' }}
        >
          <motion.div layoutId={`colourway-image-${colourway.id}`} className="absolute inset-0">
            <FabricSwatch hex={colourway.hex} className="w-full h-full" />
          </motion.div>

          {/* Benzi reveal wipe — peels away on scroll */}
          <motion.div className="absolute inset-0 bg-[#592512] mix-blend-color z-[3] pointer-events-none"
            initial={{ opacity: 0.85 }} animate={revealed ? { opacity: 0 } : { opacity: 0.85 }}
            transition={{ duration: 2.2, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }} />
          <motion.div className="absolute inset-0 bg-[#3a1707] z-[3] pointer-events-none"
            initial={{ opacity: 0.85 }} animate={revealed ? { opacity: 0 } : { opacity: 0.85 }}
            transition={{ duration: 2.2, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }} />
          <motion.div className="absolute inset-0 bg-[#8b3d2a] mix-blend-color z-[3] pointer-events-none"
            initial={{ opacity: 0.5 }} animate={revealed ? { opacity: 0 } : { opacity: 0.5 }}
            transition={{ duration: 2.5, delay: 0.05, ease: [0.22, 0.61, 0.36, 1] }} />

          {/* Magenta light flash on reveal */}
          {revealed && (
            <motion.div className="absolute inset-0 bg-[#E40078] mix-blend-screen blur-[60px] pointer-events-none z-[4]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 0.06, 0], scale: [0.9, 1.1, 1.15] }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }} />
          )}
          {revealed && (
            <motion.div className="absolute inset-0 bg-[#c85a42] mix-blend-screen blur-[80px] pointer-events-none z-[4]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 0.22, 0], scale: [0.9, 1.02, 1.03] }}
              transition={{ duration: 2.2, delay: 0.1, ease: 'easeOut' }} />
          )}

          {/* Vignette + inset shadow */}
          <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
            style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(10,14,28,0.55) 78%, rgba(10,14,28,0.92) 100%)' }} />
          <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
            style={{ boxShadow: 'inset 0 0 50px 10px rgba(10,14,28,0.7)' }} />
        </motion.div>
      </div>

      <div className="flex items-baseline justify-between mt-4">
        <div>
          <p className="font-serif text-[12px] tracking-[0.25em] uppercase text-mist/80">{colourway.name}</p>
          <p className="font-sans text-[11px] tracking-[0.1em] text-mist/45">{colourway.suited}</p>
        </div>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-mist/50">from {colourway.standardFrom}</p>
      </div>
    </div>
  );
}
