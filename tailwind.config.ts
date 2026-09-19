import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Negros y carbones
        ink: "#0a0a0a",
        coal: "#121212",
        graphite: "#1a1a1a",
        steel: "#262626",
        // Metálicos
        gold: {
          DEFAULT: "#c9a24b",
          light: "#e8cd85",
          dark: "#8f6f26",
        },
        copper: {
          DEFAULT: "#b4683a",
          light: "#d6935f",
          dark: "#7a4322",
        },
        // Texto hueso, más cálido que el blanco puro
        bone: {
          DEFAULT: "#ece5d5",
          muted: "#a39c8c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-metal":
          "linear-gradient(135deg, #8f6f26 0%, #e8cd85 35%, #c9a24b 55%, #8f6f26 100%)",
        "copper-metal":
          "linear-gradient(135deg, #7a4322 0%, #d6935f 40%, #b4683a 60%, #7a4322 100%)",
      },
      keyframes: {
        "ping-slow": {
          "75%, 100%": { transform: "scale(1.9)", opacity: "0" },
        },
        "scroll-hint": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
      },
      animation: {
        "ping-slow": "ping-slow 2.4s cubic-bezier(0, 0, 0.2, 1) infinite",
        "scroll-hint": "scroll-hint 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
