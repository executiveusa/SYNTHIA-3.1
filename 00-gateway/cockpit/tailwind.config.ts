import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pauli Design System — ALEX Edition
        void: '#08080A',
        surface: '#0F0F12',
        panel: '#14141A',
        border: '#1E1E28',
        muted: '#2A2A38',
        // ALEX Gold
        gold: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F5A623',
          600: '#D97706',
          700: '#B45309',
          DEFAULT: '#F5A623',
        },
        // Signal colors
        signal: {
          green:  '#22C55E',
          red:    '#EF4444',
          yellow: '#EAB308',
          blue:   '#3B82F6',
          purple: '#8B5CF6',
        },
        text: {
          primary:   '#F8F8FC',
          secondary: '#A0A0B8',
          muted:     '#606075',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'gold-glow': 'radial-gradient(ellipse at center, rgba(245,166,35,0.15) 0%, transparent 70%)',
        'alex-gradient': 'linear-gradient(135deg, #F5A623 0%, #D97706 100%)',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'gold': '0 0 20px rgba(245,166,35,0.3)',
        'gold-lg': '0 0 40px rgba(245,166,35,0.2)',
        'panel': '0 2px 16px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s linear infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'thinking': 'thinking 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 8px rgba(245,166,35,0.6)' },
          '50%':       { opacity: '0.7', boxShadow: '0 0 20px rgba(245,166,35,0.9)' },
        },
        'scan': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'thinking': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
