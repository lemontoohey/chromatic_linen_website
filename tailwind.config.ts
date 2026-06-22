import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#06000c',
        parchment: '#FDF5E6',
        vermillion: 'rgba(155, 27, 21, 0.85)',
        benzi: '#962814',
        magenta: '#E40078',
        pg7: '#005F56',
        sage: '#7C8A6B',
        terracotta: '#C16A47',
        dune: '#D8C39E',
        slate: '#5C7480',
        charcoal: '#3A332C',
        teal: '#147D7A',
        'teal-deep': '#0E5A58',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
