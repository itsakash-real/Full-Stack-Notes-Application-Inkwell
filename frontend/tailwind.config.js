/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Backgrounds ---
        canvas: "#f8f9fb",
        surface: "#ffffff",
        hover:  "#f3f4f6",
        active: "#eaecef",

        // --- Borders ---
        border:   "#e2e4e9",
        "border-strong": "#d0d2d8",
        "border-hover": "#c4c6cc",

        // --- Accent (indigo) ---
        accent:        "#5c5fef",
        "accent-hover": "#4a4dd6",
        "accent-press": "#3c3fbb",
        "accent-light": "#f0f1ff",
        "accent-subtle":"#e8e9fc",
        "accent-muted":"#b8baf8",

        // --- Text ---
        text:          "#181a24",
        "text-secondary": "#5a5d72",
        "text-tertiary":  "#9296aa",
        "text-disabled":  "#bcc0cc",

        // --- Status ---
        success:       "#0d9e6c",
        "success-light":"#ecfaf4",
        warning:       "#d47d0a",
        "warning-light":"#fef9ee",
        danger:        "#e0464d",
        "danger-light": "#fdf2f3",
        "danger-hover":  "#c9383f",
        info:          "#3b82f6",
        "info-light":  "#eff6ff",
      },

      fontFamily: {
        sans:  ['"Inter"', '"Inter Fallback"', 'system-ui', '-apple-system', 'sans-serif'],
        mono:  ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],   // 11px
        'sm':  ['0.8125rem', { lineHeight: '1.25rem' }], // 13px
        'base':['0.9375rem', { lineHeight: '1.5rem' }],  // 15px
        'lg':  ['1.0625rem', { lineHeight: '1.625rem' }],// 17px
        'xl':  ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],  // 30px
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],    // 36px
        '5xl': ['3rem', { lineHeight: '3.5rem' }],        // 48px
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      borderRadius: {
        'md': '0.5rem',     // 8px
        'lg': '0.625rem',   // 10px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
      },

      boxShadow: {
        'xs':     '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'sm':     '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card':   '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'modal':  '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        'dropdown':'0 10px 30px -8px rgba(0, 0, 0, 0.10), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        'ring-accent': '0 0 0 3px rgba(92, 95, 239, 0.15)',
      },

      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          '0%':   { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },

      animation: {
        'fade-in':        'fade-in 0.25s ease-out',
        'fade-in-up':     'fade-in-up 0.3s ease-out',
        'fade-in-scale':  'fade-in-scale 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.2s ease-out',
        shimmer:          'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
};
