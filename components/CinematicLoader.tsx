'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useUiStore } from '@/store/useUiStore';

export function CinematicLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const setHasLoaded = useUiStore((s) => s.setHasLoaded);

  useEffect(() => {
    if (!loaderRef.current || !barRef.current) return;
    const tl = gsap.timeline({
      onComplete: () => {
        setHasLoaded(true);
        gsap.set(loaderRef.current, { display: 'none' });
      },
    });
    tl.to(barRef.current, { scaleX: 1, duration: 2, ease: 'power3.inOut', transformOrigin: 'left center' });
    tl.to(barRef.current, { opacity: 0, duration: 0.3, ease: 'power1.out' });
    tl.to(loaderRef.current, { opacity: 0, duration: 1.5, ease: 'power2.inOut' });
    return () => { tl.kill(); };
  }, [setHasLoaded]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[200] flex items-center justify-center bg-void pointer-events-none">
      <div className="w-1/2 max-w-sm h-px bg-void/50 overflow-hidden relative">
        <div ref={barRef} className="absolute inset-y-0 left-0 w-full bg-vermillion scale-x-0 origin-left" />
      </div>
    </div>
  );
}
