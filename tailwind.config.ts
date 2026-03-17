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
        cream: '#F5F0F8',
        gold: {
          DEFAULT: '#9B7EC8',
          light: '#B69DD4',
          dark: '#7B5DAF',
        },
        dark: '#1A1525',
        warm: {
          DEFAULT: '#6B5B7B',
          light: '#8E7FA0',
        },
        stone: {
          DEFAULT: '#DDD5E8',
          light: '#EAE4F0',
        },
        charcoal: '#2A2235',
        mystic: {
          indigo: '#4A3B6B',
          violet: '#6B4E8D',
          moon: '#C8BFD6',
          star: '#E8D5A0',
          aura: '#8B6BB5',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
