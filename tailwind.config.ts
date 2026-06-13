import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAFCFE',
        gold: {
          DEFAULT: '#5A8EAE',
          light: '#8BB8D6',
          dark: '#3D6E8E',
        },
        dark: '#1C2A38',
        warm: {
          DEFAULT: '#7A8EA0',
          light: '#9AACBB',
        },
        stone: {
          DEFAULT: '#DDE8F0',
          light: '#F0F4F8',
        },
        charcoal: '#253545',
        mystic: {
          indigo: '#3D6E8E',
          violet: '#5A8EAE',
          moon: '#C0D8E8',
          star: '#A0D0F0',
          aura: '#6BA0C0',
        },
        // Bazi quiz feature tokens (ADD ONLY - spec 1.7).
        // Namespaced under bazi-* so existing site gold/cream/dark
        // tokens are untouched. Mood: night / ink / jade / gold.
        bazi: {
          ink: '#15211C',
          raised: '#1C2B24',
          border: '#2C3B33',
          gold: '#C9A86A',
          cream: '#F2EBDD',
          body: '#D8D2C4',
          muted: '#8A9389',
        },
        element: {
          wood: '#7BAE6E',
          fire: '#D4604A',
          earth: '#D9A441',
          metal: '#C9C2B4',
          water: '#5A8FB8',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        'serif-jp': ['var(--font-serif-jp)', 'Noto Serif JP', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      letterSpacing: {
        'widest-xl': '0.2em',
      },
    },
  },
  plugins: [],
};
export default config;
