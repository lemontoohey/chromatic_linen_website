import { create } from 'zustand';

interface UiState {
  scrollVelocity: number;
  isTransitioning: boolean;
  activeColourway: string;
  setScrollVelocity: (v: number) => void;
  setIsTransitioning: (v: boolean) => void;
  setActiveColourway: (c: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  scrollVelocity: 0,
  isTransitioning: false,
  activeColourway: '#7C8A6B',
  setScrollVelocity: (v) => set({ scrollVelocity: v }),
  setIsTransitioning: (v) => set({ isTransitioning: v }),
  setActiveColourway: (c) => set({ activeColourway: c }),
}));
