'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Repurposed from the original GatekeeperPage: same "resting sheer / sweep
// on scroll" colour-layer mechanic, but the five layers are now the actual
// Chromatic Linen dye-run colours rather than a decorative flower palette,
// and "Enter" is reframed as a real CTA into the colour range.
const DYE_LAYERS = ['#7C8A6B', '#C16A47', '#D8C39E', '#5C7480', '#147D7A'];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function HeroLanding() {
  const router = useRouter();
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    let cooldown = false;
    function handleScroll() {
      if (window.scrollY > 30 && !cooldown) {
        cooldown = true;
        setWiping(true);
        setTimeout(() => setWiping(false), 500);
        setTimeout(() => {
          cooldown = false;
        }, 1200);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function enter() {
    router.push('/collection');
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
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

      <div className="relative z-30 flex flex-col items-center gap-8 px-6 text-center">
        <img
          src={`${basePath}/assets/beacon-laundry-logo.svg`}
          alt="Beacon Laundry"
          className="h-14 md:h-16 mb-4"
        />
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-mist/50">
          A Beacon Laundry Initiative
        </p>
        <h1 className="font-serif text-4xl md:text-6xl tracking-[0.05em] uppercase text-mist">
          Chromatic Linen
        </h1>
        <p className="font-sans text-sm md:text-base max-w-md text-mist/70 leading-relaxed">
          Stained, written-off linen — rescued, vat-dyed in earthy tones, and
          given a second life across the Northern Rivers.
        </p>
        <button
          onClick={enter}
          className="mt-6 font-sans text-[11px] tracking-[0.3em] uppercase text-mist/80 border border-mist/30 px-8 py-3 hover:border-teal hover:text-teal transition-colors duration-500"
        >
          Explore the Range
        </button>
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-mist/30 mt-2">
          scroll to preview
        </p>
      </div>
    </div>
  );
}
