import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a14',
        'bg-elevated': '#15151f',
        pink: '#FF2D87',
        cyan: '#00E5FF',
        yellow: '#FFD60A',
        orange: '#FF6B35',
        purple: '#9D4EDD',
        lime: '#C1FF00',
        red: '#FF1744',
        blue: '#2979FF',
        'green-bright': '#00E676',
        border: '#2A2A3E',
        'text-dim': '#9CA3AF',
        gold: '#FFD60A',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        accent: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px currentColor)' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 16px currentColor)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
