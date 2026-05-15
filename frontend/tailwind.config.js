/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind WHERE to look for class usage
  // It removes unused CSS in production = tiny file sizes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ── CUSTOM COLOR PALETTE ───────────────────────────
      // Our "Writer's Den" color system
      colors: {
        // Backgrounds — layered depth
        bg: {
          base:    "#0f0e0d",   // Deepest background
          surface: "#1a1917",   // Cards, sidebars
          card:    "#242220",   // Note cards
          hover:   "#2e2b28",   // Hover states
        },
        // Borders
        border: {
          DEFAULT: "#2e2c29",
          light:   "#3d3a36",
        },
        // Accent — warm amber/gold
        accent: {
          DEFAULT: "#e8b86d",
          hover:   "#f0c97e",
          dim:     "#a07c40",
          subtle:  "#2a2218",  // Very subtle accent background
        },
        // Text hierarchy
        ink: {
          DEFAULT: "#f0ebe3",  // Primary text
          muted:   "#8a8279",  // Secondary/placeholder text
          faint:   "#4a4742",  // Disabled/very muted
        },
        // Status colors
        success: "#6db887",
        danger:  "#e87070",
        warning: "#e8c46d",
      },

      // ── CUSTOM FONTS ────────────────────────────────────
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans:    ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "Consolas", "monospace"],
      },

      // ── CUSTOM ANIMATIONS ───────────────────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in":         "fade-in 0.3s ease-out forwards",
        "fade-in-scale":   "fade-in-scale 0.25s ease-out forwards",
        "slide-in-right":  "slide-in-right 0.3s ease-out forwards",
        "shimmer":         "shimmer 2s linear infinite",
      },

      // ── CUSTOM SHADOWS ──────────────────────────────────
      boxShadow: {
        "card":         "0 2px 8px rgba(0,0,0,0.4)",
        "card-hover":   "0 8px 24px rgba(0,0,0,0.5)",
        "accent-glow":  "0 0 20px rgba(232,184,109,0.15)",
        "modal":        "0 24px 64px rgba(0,0,0,0.7)",
      },

      // ── BORDER RADIUS ───────────────────────────────────
      borderRadius: {
        "xl":  "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};