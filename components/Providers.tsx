'use client';
import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useUiStore } from '@/store/useUiStore';

export function Providers({ children }: { children: ReactNode }) {
  const setScrollVelocity = useUiStore((s) => s.setScrollVelocity);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenis.on('scroll', () => { setScrollVelocity(lenis.velocity); });
    const onFrame = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(onFrame);
    return () => { lenis.destroy(); gsap.ticker.remove(onFrame); };
  }, [setScrollVelocity]);

  return <>{children}</>;
}
