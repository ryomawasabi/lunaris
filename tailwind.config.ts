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
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
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
