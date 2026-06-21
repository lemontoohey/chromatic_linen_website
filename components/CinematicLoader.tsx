'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// No opaque background here on purpose. The WebGL shader + particle field in
// CanvasBackground is already running underneath (it mounts in the same
// layout tick), so the wordmark reads as something condensing out of that
// moving violet/teal depth rather than a loading screen sitting on top of it.
// It blurs and scales in from the field, holds, then blurs and scales back
// out into it — no flat rectangle, no hard cut to the hero beneath.
export function CinematicLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 1.12, filter: 'blur(30px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.07, filter: 'blur(24px)' }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Soft violet/teal glow the wordmark seems to emerge from — no
              hard edge, just a falloff that matches the shader's own bloom. */}
          <div
            className="absolute w-[34rem] h-[34rem] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(156,143,217,0.28) 0%, rgba(20,125,122,0.13) 42%, rgba(10,14,28,0) 72%)',
              filter: 'blur(18px)',
            }}
          />
          <p className="relative font-serif text-[12px] tracking-[0.5em] uppercase text-mist/85">
            Chromatic Linen
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
