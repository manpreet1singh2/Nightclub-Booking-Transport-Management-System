/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          50:  '#f0f0ff',
          100: '#e0e0ff',
          200: '#c4c4ff',
          300: '#a0a0ff',
          400: '#7878ff',
          500: '#5050ff',
          600: '#3030e0',
          700: '#1a1a9e',
          800: '#10105e',
          900: '#08083a',
          950: '#04041e',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        neon: {
          pink:   '#ff2d78',
          purple: '#a855f7',
          blue:   '#3b82f6',
          cyan:   '#06b6d4',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'night-gradient': 'linear-gradient(135deg, #04041e 0%, #0d0d2b 50%, #1a0533 100%)',
        'card-gradient':  'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'gold-gradient':  'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)',
        'hero-gradient':  'linear-gradient(180deg, rgba(4,4,30,0) 0%, rgba(4,4,30,0.8) 60%, #04041e 100%)',
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'glow':      'glow 2s ease-in-out infinite alternate',
        'slide-up':  'slideUp 0.5s ease-out',
        'fade-in':   'fadeIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float:   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glow:    { from: { boxShadow: '0 0 10px rgba(168,85,247,0.4)' }, to: { boxShadow: '0 0 30px rgba(168,85,247,0.8), 0 0 60px rgba(168,85,247,0.3)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(168,85,247,0.5)',
        'neon-pink':   '0 0 20px rgba(255,45,120,0.5)',
        'neon-gold':   '0 0 20px rgba(251,191,36,0.5)',
        'glass':       '0 8px 32px 0 rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
