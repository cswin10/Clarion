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
        // Clarion Design System
        navy: {
          DEFAULT: "#0A1628",
          light: "#0F1E32",
        },
        charcoal: "#1E293B",
        slate: {
          DEFAULT: "#334155",
          light: "#475569",
        },
        gold: {
          DEFAULT: "#D4A853",
          dark: "#B8860B",
          light: "#E5C374",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
        success: "#2DD4BF",
        warning: "#FBBF24",
        danger: "#F87171",
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
        "gold": "0 0 20px rgba(212, 168, 83, 0.15)",
        "gold-strong": "0 0 30px rgba(212, 168, 83, 0.25)",
      },
      letterSpacing: {
        "heading": "-0.02em",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 168, 83, 0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(212, 168, 83, 0.3)" },
        },
      },
      backgroundImage: {
        "gradient-navy": "linear-gradient(135deg, #0A1628 0%, #0F1E32 100%)",
        "gradient-card": "linear-gradient(180deg, #1E293B 0%, #172033 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
