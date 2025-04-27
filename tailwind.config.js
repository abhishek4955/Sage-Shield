module.exports = {
  theme: {
    extend: {
      fontSize: {
        '4k-base': '1.125rem',    // 18px
        '4k-lg': '1.25rem',       // 20px
        '4k-xl': '1.5rem',        // 24px
        '4k-2xl': '1.875rem',     // 30px
        '4k-3xl': '2.25rem',      // 36px
      },
      spacing: {
        '4k-1': '0.375rem',       // 6px
        '4k-2': '0.75rem',        // 12px
        '4k-3': '1.125rem',       // 18px
        '4k-4': '1.5rem',         // 24px
        '4k-6': '2.25rem',        // 36px
        '4k-8': '3rem',           // 48px
      },
      transitionTimingFunction: {
        'bounce-ease': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'nav-hover': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        }
      },
      animation: {
        'nav-hover': 'nav-hover 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
} 