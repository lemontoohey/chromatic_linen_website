'use client';
import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useUiStore } from '@/store/useUiStore';

gsap.registerPlugin(ScrollTrigger);

export function Providers({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollVelocity = useUiStore((s) => s.setScrollVelocity);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      syncTouch: true,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', () => {
      ScrollTrigger.update();
      setScrollVelocity(lenis.velocity);
    });
    const onFrame = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(onFrame);
    setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => { lenis.destroy(); gsap.ticker.remove(onFrame); };
  }, [setScrollVelocity]);

  return <>{children}</>;
}
