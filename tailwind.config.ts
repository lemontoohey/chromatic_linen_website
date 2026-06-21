import type { Config } from 'tailwindcss';

// Chromatic Linen palette — the five dye-house colourways (sage, terracotta,
// dune, slate, charcoal) stay as the literal product colours throughout the
// site. The UI chrome itself now runs on a deep-midnight base with light
// violet ("mist") text, and "teal" as the Beacon Laundry brand accent.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0E1C',
        'midnight-deep': '#05070F',
        mist: '#E5E1F7',
        violet: '#9C8FD9',
        'violet-deep': '#6F61B0',
        sage: '#7C8A6B',
        terracotta: '#C16A47',
        dune: '#D8C39E',
        slate: '#5C7480',
        charcoal: '#3A332C',
        teal: '#147D7A',
        'teal-deep': '#0E5A58',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
