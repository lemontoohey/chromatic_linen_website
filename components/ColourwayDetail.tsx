'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Colourway, colourways } from '@/data/colourways';

// Repurposed from ArtworkDetail: same reveal sequence, Ken Burns drift and
// 3D tilt as the original gallery piece view, now showing a fabric swatch
// with dyehouse technique, suited product, and standard / bespoke pricing
// instead of artwork medium and price.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface ColourwayDetailProps {
  colourway: Colourway;
  onClose?: () => void;
}

export function ColourwayDetail({ colourway, onClose }: ColourwayDetailProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glareX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const glareY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 18 });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  useGSAP(() => {
    if (imageRef.current) {
      gsap.fromTo(imageRef.current, { scale: 1 }, { scale: 1.04, duration: 20, ease: 'none' });
    }
  }, [colourway.id]);

  const src = `${basePath}${colourway.image}`;

  return (
    <motion.div
      layoutId={`colourway-container-${colourway.id}`}
      className="fixed inset-0 z-40 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: '60vw',
          height: '80vh',
          left: 'calc(50% - 30vw)',
          top: 'calc(50% - 40vh)',
          background: `radial-gradient(circle, ${colourway.hex}33, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        className="relative md:absolute md:w-[42vw] md:[left:calc(38%_-_21vw)] md:[top:calc(50%_-_36vh)] md:h-[72vh] overflow-hidden"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <motion.img
          ref={imageRef}
          layoutId={`colourway-image-${colourway.id}`}
          src={src}
          alt={colourway.name}
          className="w-full h-full object-cover"
        />
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]: number[]) =>
                `radial-gradient(circle at ${50 + gx * 60}% ${50 + gy * 60}%, rgba(229,225,247,0.30), transparent 60%)`
            ),
          }}
        />
        {colourways.map((layer, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{ backgroundColor: layer.hex, transformOrigin: 'top' }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.76, 0, 0.24, 1] }}
          />
        ))}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: colourway.hex }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      <motion.div
        className="relative mt-8 md:mt-0 md:absolute md:right-[4vw] md:top-1/2 md:-translate-y-1/2 md:w-[24vw] flex flex-col gap-4 px-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="font-serif text-2xl tracking-wide text-mist">{colourway.name}</h2>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-mist/60">
          {colourway.technique}
        </p>
        <p className="font-sans text-sm text-mist/70 leading-relaxed">
          {colourway.description}
        </p>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-mist/50 mt-2">
          Best suited to: {colourway.suited}
        </p>
        <div className="flex flex-col gap-1 mt-2">
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-mist/80">
            Standard run — from {colourway.standardFrom}
          </p>
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-mist/80">
            Bespoke colour match — from {colourway.bespokeFrom}
          </p>
        </div>
        <span className="w-8 h-8 rounded-full border border-mist/20 mt-2" style={{ backgroundColor: colourway.hex }} />
        <button
          onClick={onClose}
          className="mt-8 font-sans text-[10px] tracking-[0.3em] uppercase text-mist/50 hover:text-mist transition-colors duration-500 self-start"
        >
          [ Close ]
        </button>
      </motion.div>
    </motion.div>
  );
}
