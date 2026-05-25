import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        retro: {
          bg: '#0f172a',
          panel: '#1e293b',
          border: '#334155',
          primary: '#22c55e',
          accent: '#06b6d4',
          warning: '#eab308',
          danger: '#ef4444',
          text: '#e2e8f0',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        terminal: ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
