'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Colourway, colourways } from '@/data/colourways';
import { useUiStore } from '@/store/useUiStore';

// Repurposed from ArtworkCard: same scroll-reveal wipe mechanic, but the
// five peeling layers are now literally the five dye-run colours, so the
// reveal animation doubles as a preview of the whole palette before
// settling on this swatch's own colour-on-image treatment.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface ColourwayCardProps {
  colourway: Colourway;
  onSelect: (c: Colourway) => void;
}

export function ColourwayCard({ colourway, onSelect }: ColourwayCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const setActiveColourway = useUiStore((s) => s.setActiveColourway);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !revealed) {
          setRevealed(true);
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [revealed]);

  // Separate from the one-shot reveal above: this fires every time the card
  // crosses the centre band of the viewport, feeding its hex into the
  // global store so the shader background behind it eases toward this
  // colourway for as long as it's the one in frame.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const tintObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveColourway(colourway.hex);
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    );
    tintObserver.observe(node);
    return () => tintObserver.disconnect();
  }, [colourway.hex, setActiveColourway]);

  const src = `${basePath}${colourway.image}`;

  return (
    <div ref={ref} className="cursor-pointer w-[82vw] md:w-[42vw]" onClick={() => onSelect(colourway)}>
      <div className="relative w-full h-[60vh] md:h-[72vh] overflow-hidden">
        <motion.img
          layoutId={`colourway-image-${colourway.id}`}
          src={src}
          alt={colourway.name}
          className="w-full h-full object-cover"
        />
        {colourways.map((layer, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 z-10"
            style={{ backgroundColor: layer.hex, opacity: 0.45, transformOrigin: 'top' }}
            initial={{ scaleY: 1 }}
            animate={revealed ? { scaleY: 0 } : { scaleY: 1 }}
            transition={{
              duration: 0.45,
              delay: i * 0.06,
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        ))}
      </div>
      <motion.div layoutId={`colourway-container-${colourway.id}`} className="flex items-baseline justify-between mt-4">
        <div>
          <p className="font-serif text-[12px] tracking-[0.25em] uppercase text-mist/80">
            {colourway.name}
          </p>
          <p className="font-sans text-[11px] tracking-[0.1em] text-mist/45">
            {colourway.suited}
          </p>
        </div>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-mist/50">
          from {colourway.standardFrom}
        </p>
      </motion.div>
    </div>
  );
}
