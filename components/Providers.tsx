'use client';
import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import { useUiStore } from '@/store/useUiStore';

export function Providers({ children }: { children: ReactNode }) {
  const setScrollVelocity = useUiStore((s) => s.setScrollVelocity);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      setScrollVelocity(velocity);
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [setScrollVelocity]);

  return <>{children}</>;
}
