'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function HeroLanding() {
  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center">
      <motion.img
        src={`${basePath}/assets/beacon-laundry-logo.svg`}
        alt="Beacon Laundry"
        className="h-14 md:h-16 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 3, ease: 'easeIn', delay: 0.5 }}
      />
      <motion.p
        className="font-sans text-[10px] tracking-[0.35em] uppercase text-parchment/50 mb-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 1.2 }}
      >
        A Beacon Laundry Initiative
      </motion.p>
      <motion.h1
        className="font-serif text-4xl md:text-6xl tracking-[0.05em] uppercase text-parchment"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 0.88, y: 0 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 1.8 }}
      >
        Chromatic Linen
      </motion.h1>
      <motion.div
        className="w-6 h-px bg-parchment/18 my-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 2.8 }}
      />
      <motion.p
        className="font-sans text-sm md:text-base max-w-md text-parchment/60 leading-relaxed text-center px-6 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 3.0 }}
      >
        Stained, written-off linen — rescued, vat-dyed in earthy tones, and
        given a second life across the Northern Rivers.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        whileHover={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 3.4, ease: 'easeOut' }}
      >
        <Link
          href="/collection"
          className="font-sans text-[9px] tracking-[0.55em] uppercase text-parchment"
        >
          Explore the Range
        </Link>
      </motion.div>
    </div>
  );
}
