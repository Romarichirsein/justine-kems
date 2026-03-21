import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'jk-imperial-green':    '#003B36',
        'jk-imperial-green-dk': '#002a26',
        'jk-royal-gold':        '#D4AF37',
        'jk-royal-gold-dark':   '#B8860B',
        'jk-cream':             '#FFF8F0',
        'jk-dark-bg':           '#0A1A18',
        'jk-dark-surface':      '#0F2320',
        'jk-text-dark':         '#2C2C2C',
        'jk-text-muted':        '#6B6B6B',
        'jk-dark-text':         '#F5F5F5',
      },
      fontFamily: {
        script:  ['Great Vibes', 'cursive'],
        display: ['Playfair Display', 'serif'],
        sans:    ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'neon-gold':    '0 0 8px rgba(212,175,55,0.4), 0 0 16px rgba(212,175,55,0.2)',
        'neon-gold-lg': '0 0 12px rgba(212,175,55,0.5), 0 0 24px rgba(212,175,55,0.3)',
        'luxury':       '0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)',
        'luxury-dark':  '0 20px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(212,175,55,0.06)',
      },
      backgroundImage: {
        'gradient-gold':       'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
        'gradient-green':      'linear-gradient(135deg, #003B36 0%, #002a26 100%)',
        'gradient-gold-light': 'linear-gradient(135deg, #F5E17C 0%, #D4AF37 50%, #B8860B 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in-up':    'fade-in-up 0.6s ease both',
        'fade-in-left':  'fade-in-left 0.6s ease both',
        'fade-in-right': 'fade-in-right 0.6s ease both',
        'zoom-in':       'zoom-in 0.6s ease both',
        'float':         'float 3s ease-in-out infinite',
        'spin-slow':     'spin-slow 12s linear infinite',
        'pulse-soft':    'pulse-soft 2s ease-in-out infinite',
        'shimmer':       'shimmer 1.5s infinite',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'zoom-in': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.8', transform: 'scale(1.04)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
