import { create } from 'zustand';

interface UiState {
  scrollVelocity: number;
  setScrollVelocity: (v: number) => void;
  isTransitioning: boolean;
  setIsTransitioning: (v: boolean) => void;
  activeColourway: string;
  setActiveColourway: (c: string) => void;
  hasLoaded: boolean;
  setHasLoaded: (v: boolean) => void;
  isCanvasPaused: boolean;
  setCanvasPaused: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  scrollVelocity: 0,
  setScrollVelocity: (v) => set({ scrollVelocity: v }),
  isTransitioning: false,
  setIsTransitioning: (v) => set({ isTransitioning: v }),
  activeColourway: '#7C8A6B',
  setActiveColourway: (c) => set({ activeColourway: c }),
  hasLoaded: false,
  setHasLoaded: (v) => set({ hasLoaded: v }),
  isCanvasPaused: false,
  setCanvasPaused: (v) => set({ isCanvasPaused: v }),
}));
