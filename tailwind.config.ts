import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Negros y carbones
        ink: "#0b0b0c",
        coal: "#121212",
        graphite: "#1a1a1a",
        steel: "#262626",
        // Dorado apagado (más sobrio que un dorado brillante)
        gold: {
          DEFAULT: "#b8995a",
          light: "#d2b97f",
          dark: "#8a7240",
        },
        // Texto hueso, más cálido que el blanco puro
        bone: {
          DEFAULT: "#e8e2d4",
          muted: "#9d9689",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        script: ["var(--font-script)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
