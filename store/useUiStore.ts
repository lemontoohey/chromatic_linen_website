import { create } from 'zustand';

interface UiState {
  isCanvasPaused: boolean;
  setCanvasPaused: (v: boolean) => void;
  hasLoaded: boolean;
  setHasLoaded: (v: boolean) => void;
  isTransitioning: boolean;
  setIsTransitioning: (v: boolean) => void;
  scrollVelocity: number;
  setScrollVelocity: (v: number) => void;
  activeColourway: string;
  setActiveColourway: (c: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCanvasPaused: false,
  setCanvasPaused: (v) => set({ isCanvasPaused: v }),
  hasLoaded: false,
  setHasLoaded: (v) => set({ hasLoaded: v }),
  isTransitioning: false,
  setIsTransitioning: (v) => set({ isTransitioning: v }),
  scrollVelocity: 0,
  setScrollVelocity: (v) => set({ scrollVelocity: v }),
  activeColourway: '#7C8A6B',
  setActiveColourway: (c) => set({ activeColourway: c }),
}));
