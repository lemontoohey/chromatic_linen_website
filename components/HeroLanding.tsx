'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const DYE_LAYERS = ['#7C8A6B', '#C16A47', '#D8C39E', '#5C7480', '#147D7A'];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function HeroLanding() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    let cooldown = false;
    function handleScroll() {
      if (window.scrollY > 30 && !cooldown) {
        cooldown = true;
        setWiping(true);
        setTimeout(() => setWiping(false), 500);
        setTimeout(() => { cooldown = false; }, 1200);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function enter() {
    if (exiting) return;
    setContentVisible(false);
    setExiting(true);
    setTimeout(() => router.push('/collection'), 1100);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="hero"
        style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 10 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 1.2 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-[0.35]"
          src={`${basePath}/assets/beacon_laundry_intro.mp4`}
        />
        {DYE_LAYERS.map((colour, i) => (
          <motion.div
            key={i}
            className="fixed inset-0 pointer-events-none mix-blend-screen"
            style={{ backgroundColor: colour, zIndex: 20 + i }}
            animate={{ opacity: wiping ? 0.55 : 0.18 }}
            transition={{
              duration: wiping ? 0.18 : 0.6,
              delay: wiping ? i * 0.04 : (4 - i) * 0.04,
              ease: wiping ? [0.76, 0, 0.24, 1] : [0.25, 0.46, 0.45, 0.94],
            }}
          />
        ))}

        <AnimatePresence>
          {contentVisible && (
            <motion.div
              key="content"
              className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: 'easeIn' }}
            >
              <motion.img
                src={`${basePath}/assets/beacon-laundry-logo.svg`}
                alt="Beacon Laundry"
                className="h-14 md:h-16 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 4, ease: 'easeIn', delay: 0.5 }}
              />
              <motion.p
                className="font-sans text-[10px] tracking-[0.35em] uppercase text-mist/50 mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ duration: 2, ease: 'easeOut', delay: 1.2 }}
              >
                A Beacon Laundry Initiative
              </motion.p>
              <motion.h1
                className="font-serif text-4xl md:text-6xl tracking-[0.05em] uppercase text-mist"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.88, y: 0 }}
                transition={{ duration: 2, ease: 'easeOut', delay: 1.8 }}
              >
                Chromatic Linen
              </motion.h1>
              <motion.div
                className="w-6 h-px bg-mist/18 my-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 2.8 }}
              />
              <motion.p
                className="font-sans text-sm md:text-base max-w-md text-mist/70 leading-relaxed text-center px-6 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 3.0 }}
              >
                Stained, written-off linen — rescued, vat-dyed in earthy tones, and
                given a second life across the Northern Rivers.
              </motion.p>
              <motion.span
                className="font-sans text-[9px] tracking-[0.55em] uppercase text-mist cursor-pointer pointer-events-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.28 }}
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 1, delay: 3.4, ease: 'easeOut' }}
                onClick={enter}
              >
                Enter
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
