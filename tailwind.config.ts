import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Clarion Design System
        // Primary surfaces - deep, sophisticated blues
        surface: {
          primary: "#080C15",    // Deep midnight
          secondary: "#0D1321",  // Rich navy
          tertiary: "#141B2D",   // Elevated surface
        },
        // Legacy navy (for backwards compatibility)
        navy: {
          DEFAULT: "#080C15",
          light: "#0D1321",
        },
        charcoal: "#141B2D",

        // Neutral palette - refined grays with blue undertone
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        slate: {
          DEFAULT: "#334155",
          light: "#475569",
        },

        // Accent colors - warm gold/copper for premium feel
        accent: {
          DEFAULT: "#C8AA6E",    // Rich champagne gold
          warm: "#B89B5D",       // Warm copper gold
          light: "#E5D4A8",      // Light champagne
          muted: "#8B7355",      // Muted bronze
        },
        // Legacy gold mapping
        gold: {
          DEFAULT: "#C8AA6E",
          dark: "#8B7355",
          light: "#E5D4A8",
        },

        // Text colors
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
        },

        // Semantic colors - refined
        success: "#34D399",      // Emerald green
        warning: "#FBBF24",      // Amber
        danger: "#F87171",       // Coral red
        info: "#60A5FA",         // Sky blue
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "card": "12px",
        "button": "8px",
        "input": "6px",
      },
      boxShadow: {
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
        "gold": "0 0 30px rgba(200, 170, 110, 0.2)",
        "gold-strong": "0 0 40px rgba(200, 170, 110, 0.35)",
        "accent": "0 0 40px rgba(200, 170, 110, 0.25)",
        "glow": "0 0 60px rgba(200, 170, 110, 0.15)",
      },
      letterSpacing: {
        "heading": "-0.02em",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 30px rgba(200, 170, 110, 0.15)" },
          "50%": { boxShadow: "0 0 50px rgba(200, 170, 110, 0.35)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-navy": "linear-gradient(135deg, #080C15 0%, #0D1321 100%)",
        "gradient-card": "linear-gradient(180deg, #141B2D 0%, #0D1321 100%)",
        "gradient-premium": "linear-gradient(135deg, #C8AA6E 0%, #8B7355 100%)",
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
