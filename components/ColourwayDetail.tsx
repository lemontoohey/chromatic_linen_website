'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import gsap from 'gsap';
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

interface ColourwayDetailProps {
  colourway: Colourway;
  onClose?: () => void;
}

export function ColourwayDetail({ colourway, onClose }: ColourwayDetailProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [hasHover, setHasHover] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const setActiveColourway = useUiStore((s) => s.setActiveColourway);
  const activeColourway = useUiStore((s) => s.activeColourway);
  const isActive = activeColourway === colourway.hex;

  useEffect(() => { setHasHover(window.matchMedia('(hover: hover)').matches); }, []);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, [colourway.id]);

  useEffect(() => { setActiveColourway(colourway.hex); }, [colourway.id]);

  useEffect(() => {
    if (!imageRef.current) return;
    gsap.fromTo(imageRef.current, { scale: 1 }, { scale: 1.04, duration: 20, ease: 'none' });
    return () => { gsap.killTweensOf(imageRef.current); };
  }, [colourway.id]);

  const rotateX = useSpring(0, { damping: 25, stiffness: 150 });
  const rotateY = useSpring(0, { damping: 25, stiffness: 150 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!hasHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -3);
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 3);
  }
  function handleMouseLeave() { rotateX.set(0); rotateY.set(0); }

  const textContainerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.6 } },
  };
  const textItemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' as const },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' as const, transition: { duration: 1.4, ease: [0.22, 0.61, 0.36, 1] as const } },
  };

  return (
    <div className="relative w-full min-h-screen md:h-screen md:overflow-hidden flex flex-col md:block gap-8 px-6 md:px-0 pt-24 pb-24 md:pt-0 md:pb-0">
      <button onClick={onClose}
        className="fixed top-8 left-6 md:top-12 md:left-12 z-50 text-parchment/50 hover:text-vermillion font-sans text-[10px] tracking-[0.3em] uppercase transition-colors duration-500">
        [ Back to Collection ]
      </button>

      <div className="relative [perspective:2000px] md:absolute md:inset-0">
        <div className="relative flex flex-col gap-4 z-10 w-[82vw] mx-auto md:mx-0 md:absolute md:w-[42vw] md:[left:calc(38%_-_21vw)] md:[top:calc(50%_-_36vh)]">
          <motion.div
            layoutId={`colourway-container-${colourway.id}`}
            onMouseMove={hasHover ? handleMouseMove : undefined}
            onMouseLeave={hasHover ? handleMouseLeave : undefined}
            className="relative w-full h-[60vh] md:h-[72vh] overflow-hidden [transform-style:preserve-3d]"
            style={{
              boxShadow: '0 40px 80px -20px rgba(35,15,60,0.8), 0 0 30px 2px rgba(90,30,120,0.2)',
              rotateX, rotateY,
            }}
          >
            {/* Noise */}
            <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.015] bg-noise mix-blend-overlay" aria-hidden />

            <motion.div ref={imageRef} layoutId={`colourway-image-${colourway.id}`} className="absolute inset-0 w-full h-full">
              <motion.div className="absolute inset-0"
                initial={{ filter: 'blur(10px)', scale: 1.02 }}
                animate={{ filter: 'blur(0px)', scale: 1 }}
                transition={{ duration: 2.4, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}>
                <FabricSwatch hex={colourway.hex} layers={colourway.dyeLayers} className="w-full h-full" />
              </motion.div>

              {/* Solid colour topcoat */}
              <div className="absolute inset-0 z-[2] pointer-events-none"
                style={{ backgroundColor: avgHex(colourway.dyeLayers), opacity: 0.73 }} />
            </motion.div>

            {/* Radial vignette */}
            <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
              style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(6,0,12,0.55) 78%, rgba(6,0,12,0.92) 100%)' }} />

            {/* Colour-burn edge glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-[6] mix-blend-color-burn"
              style={{
                background: `radial-gradient(ellipse 90% 90% at 50% 50%, transparent 58%, ${darken(colourway.hex, 0.45)} 100%)`,
              }}
              animate={{ opacity: isActive ? 0.5 : 0.08 }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
              aria-hidden
            />
          </motion.div>
        </div>
      </div>

      {/* Right metadata panel */}
      <motion.div variants={textContainerVariants} initial="hidden" animate="show"
        className="flex flex-col gap-8 md:gap-12 py-4 md:py-0 z-10 md:absolute md:right-[4vw] md:top-1/2 md:-translate-y-1/2 md:w-[22vw]">
        <motion.div variants={textItemVariants} className="flex flex-col gap-4 border-b border-parchment/10 pb-8">
          <h1 className="text-parchment font-serif text-3xl sm:text-4xl md:text-6xl tracking-wide">{colourway.name}</h1>
          <p className="text-vermillion font-sans text-xl tracking-widest">{colourway.standardFrom}</p>
        </motion.div>
        <motion.div variants={textItemVariants} className="grid grid-cols-2 gap-8 font-sans text-[10px] tracking-[0.2em] uppercase text-parchment/40">
          <div className="flex flex-col gap-2">
            <span className="text-parchment/20">Technique</span>
            <span>{colourway.technique}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-parchment/20">Best suited to</span>
            <span>{colourway.suited}</span>
          </div>
        </motion.div>
        <motion.div variants={textItemVariants} className="flex flex-col gap-4 text-parchment/70 font-sans font-light leading-relaxed max-w-md italic">
          <p>&quot;{colourway.description}&quot;</p>
        </motion.div>
        <motion.div variants={textItemVariants} className="flex items-center gap-4">
          <span className="w-8 h-8 rounded-full border border-parchment/20" style={{ backgroundColor: colourway.hex }} />
          <div className="flex flex-col gap-1 font-sans text-xs tracking-[0.15em] uppercase text-parchment/40">
            <span>Standard — {colourway.standardFrom}</span>
            <span>Bespoke — {colourway.bespokeFrom}</span>
          </div>
        </motion.div>
        <motion.button variants={textItemVariants}
          className="self-start mt-4 px-8 py-4 min-h-[48px] border border-vermillion text-vermillion font-sans text-xs tracking-[0.4em] uppercase hover:bg-vermillion hover:text-void transition-all duration-700 relative overflow-hidden group">
          <span className="absolute inset-0 bg-vermillion translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1] -z-10" />
          Enquire About This Colour
        </motion.button>
      </motion.div>
    </div>
  );
}
