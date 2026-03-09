import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#111111",
        "surface-light": "#1A1A1A",
        border: "#222222",
        "text-primary": "#FFFFFF",
        "text-secondary": "#999999",
        "text-muted": "#666666",
        // OMODA brand teal/turquoise
        accent: {
          DEFAULT: "#00C9B7",
          light: "#33D4C5",
          dark: "#009E8F",
          50: "#E6FAF8",
          100: "#B3F0EA",
          500: "#00C9B7",
          600: "#009E8F",
          700: "#007A6F",
        },
        // JAECOO brand — darker, more premium tone
        "accent-alt": {
          DEFAULT: "#2A5CFF",
          light: "#5A7FFF",
          dark: "#1A3FCC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "section": ["clamp(2rem, 5vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "subtitle": ["clamp(1.125rem, 2vw, 1.5rem)", { lineHeight: "1.4" }],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "counter": "counter 1.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
