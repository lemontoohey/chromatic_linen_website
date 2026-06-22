'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Colourway, colourways } from '@/data/colourways';
import { FabricSwatch } from '@/components/FabricSwatch';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface ColourwayDetailProps {
  colourway: Colourway;
  onClose?: () => void;
}

export function ColourwayDetail({ colourway, onClose }: ColourwayDetailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasHover, setHasHover] = useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const glareX = useSpring(useTransform(mouseX, [0, 1], ['-100%', '200%']), { damping: 25, stiffness: 150 });
  const glareY = useSpring(useTransform(mouseY, [0, 1], ['-100%', '200%']), { damping: 25, stiffness: 150 });
  const rotateX = useSpring(0, { damping: 25, stiffness: 150 });
  const rotateY = useSpring(0, { damping: 25, stiffness: 150 });

  useEffect(() => { setHasHover(window.matchMedia('(hover: hover)').matches); }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
    if (hasHover) {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -3);
      rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 3);
    }
  }
  function handleMouseLeave() { rotateX.set(0); rotateY.set(0); }

  useGSAP(() => {
    if (videoRef.current) gsap.fromTo(videoRef.current, { scale: 1 }, { scale: 1.04, duration: 20, ease: 'none' });
  }, [colourway.id]);

  const videoSrc = `${basePath}/assets/beacon_laundry_intro.mp4`;

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
        className="fixed top-8 left-6 md:top-12 md:left-12 z-50 text-mist/50 hover:text-teal font-sans text-[10px] tracking-[0.3em] uppercase transition-colors duration-500">
        [ Back to Collection ]
      </button>

      <div className="relative [perspective:2000px] md:absolute md:inset-0">
        <motion.div className="absolute z-0 pointer-events-none mix-blend-screen blur-[40px] md:blur-[60px]"
          style={{ background: `radial-gradient(circle at 50% 50%, ${colourway.hex}30 0%, transparent 60%)`, width: '60vw', height: '80vh', left: 'calc(50% - 30vw)', top: 'calc(50% - 40vh)' }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative flex flex-col gap-4 z-10 w-[82vw] mx-auto md:mx-0 md:absolute md:w-[42vw] md:[left:calc(38%_-_21vw)] md:[top:calc(50%_-_36vh)]">
          <motion.div
            layoutId={`colourway-container-${colourway.id}`}
            onMouseMove={hasHover ? handleMouseMove : undefined}
            onMouseLeave={hasHover ? handleMouseLeave : undefined}
            className="relative w-full h-[60vh] md:h-[72vh] overflow-hidden [transform-style:preserve-3d]"
            style={{
              boxShadow: '0 40px 80px -20px rgba(10,5,25,0.9), 0 0 30px 2px rgba(90,30,120,0.15)',
              rotateX, rotateY,
            }}
          >
            <motion.div layoutId={`colourway-image-${colourway.id}`} className="absolute inset-0">
              <FabricSwatch hex={colourway.hex} className="w-full h-full" />
            </motion.div>

            {/* Video overlay - fades in tinted to colourway */}
            <motion.div className="absolute inset-0 overflow-hidden z-[1]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <video ref={videoRef} src={videoSrc} autoPlay muted loop playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 mix-blend-color" style={{ backgroundColor: colourway.hex }} />
            </motion.div>

            {/* Benzi reveal overlays */}
            <motion.div className="absolute inset-0 bg-[#592512] mix-blend-color z-[3] pointer-events-none"
              initial={{ opacity: 0.82 }} animate={{ opacity: 0 }}
              transition={{ duration: 2.2, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }} />
            <motion.div className="absolute inset-0 bg-[#3a1707] z-[3] pointer-events-none"
              initial={{ opacity: 0.82 }} animate={{ opacity: 0 }}
              transition={{ duration: 2.2, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }} />
            <motion.div className="absolute inset-0 bg-[#8b3d2a] mix-blend-color z-[3] pointer-events-none"
              initial={{ opacity: 0.5 }} animate={{ opacity: 0 }}
              transition={{ duration: 2.5, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }} />

            {/* Magenta light flash */}
            <motion.div className="absolute inset-0 bg-[#E40078] mix-blend-screen blur-[60px] pointer-events-none z-[4]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 0.07, 0], scale: [0.9, 1.1, 1.15] }}
              transition={{ duration: 1.5, delay: 0.35, ease: 'easeOut' }} />
            {/* Warm light flash */}
            <motion.div className="absolute inset-0 bg-[#c85a42] mix-blend-screen blur-[80px] pointer-events-none z-[4]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 0.28, 0], scale: [0.9, 1.02, 1.03] }}
              transition={{ duration: 2.2, delay: 0.15, ease: 'easeOut' }} />

            {/* Vignette */}
            <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
              style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(10,14,28,0.55) 78%, rgba(10,14,28,0.92) 100%)' }} />
            <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
              style={{ boxShadow: 'inset 0 0 60px 10px rgba(107,0,56,0.12)' }} />

            {/* Varnish sheen */}
            <motion.div className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-30"
              style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 50%)', x: glareX, y: glareY, scale: 2 }} />
          </motion.div>
        </div>
      </div>

      {/* Metadata panel */}
      <motion.div variants={textContainerVariants} initial="hidden" animate="show"
        className="flex flex-col gap-8 md:gap-12 py-4 md:py-0 z-10 md:absolute md:right-[4vw] md:top-1/2 md:-translate-y-1/2 md:w-[22vw]">
        <motion.div variants={textItemVariants} className="flex flex-col gap-4 border-b border-mist/10 pb-8">
          <h2 className="text-mist font-serif text-3xl sm:text-4xl md:text-5xl tracking-wide">{colourway.name}</h2>
          <p className="text-teal font-sans text-lg tracking-widest">{colourway.standardFrom}</p>
        </motion.div>
        <motion.div variants={textItemVariants} className="grid grid-cols-2 gap-8 font-sans text-[10px] tracking-[0.2em] uppercase text-mist/40">
          <div className="flex flex-col gap-2">
            <span className="text-mist/20">Technique</span>
            <span>{colourway.technique}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-mist/20">Best suited to</span>
            <span>{colourway.suited}</span>
          </div>
        </motion.div>
        <motion.div variants={textItemVariants} className="flex flex-col gap-4 text-mist/70 font-sans font-light leading-relaxed max-w-md">
          <p>{colourway.description}</p>
        </motion.div>
        <motion.div variants={textItemVariants} className="flex items-center gap-4">
          <span className="w-8 h-8 rounded-full border border-mist/20" style={{ backgroundColor: colourway.hex }} />
          <div className="flex flex-col gap-1 font-sans text-xs tracking-[0.15em] uppercase text-mist/60">
            <span>Standard — {colourway.standardFrom}</span>
            <span>Bespoke — {colourway.bespokeFrom}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
