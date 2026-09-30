import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cosmic dark backgrounds
        cosmic: {
          950: '#06080e',
          900: '#0b0e18',
          850: '#111524',
          800: '#171c30',
          750: '#1f253f',
          700: '#283152',
          600: '#384470',
        },
        // Ethereal Astral Accents
        astral: {
          cyan: '#06b6d4',
          glow: '#22d3ee',
          teal: '#14b8a6',
        },
        // Nebula Violet Palette
        nebula: {
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        // Starlight Gold
        starlight: {
          100: '#fef9c3',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        // Astrological Elements
        element: {
          fire: '#f97316',
          earth: '#10b981',
          air: '#38bdf8',
          water: '#818cf8',
        },
        // Primary purple palette (kept for backwards compatibility)
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Warm accent pink
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        // Gold for best friend level
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Chat background
        chat: {
          bg: '#070913',
          bubble: '#13182b',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'serif'],
        serif: ['Cinzel', 'serif'],
      },
      animation: {
        'message-in': 'messageIn 0.3s ease-out',
        'typing-dot': 'typingDot 1.4s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 35s linear infinite',
      },
      keyframes: {
        messageIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        typingDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.85)' },
          '50%': { opacity: '0.9', transform: 'scale(1.15)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))' },
          '50%': { opacity: '0.85', filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.75))' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cosmic-grid': 'radial-gradient(circle, rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
