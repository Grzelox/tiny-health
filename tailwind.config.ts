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
        primary: {
          50: "#f0f3ea",
          100: "#dde5cc",
          200: "#c6d3a6",
          300: "#bec5a4",
          400: "#a0b085",
          500: "#8a8e75",
          600: "#78805f",
          700: "#646b4d",
          800: "#525640",
          900: "#454a37",
        },
        secondary: {
          50: "#faf8f3",
          100: "#f1ead8",
          200: "#e5d7b8",
          300: "#d5c7ad",
          400: "#c2ad88",
          500: "#b09768",
          600: "#9d8555",
          700: "#847048",
          800: "#68604d",
          900: "#5a5242",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "primary-gradient": "linear-gradient(135deg, #bec5a4 0%, #8a8e75 100%)",
        "secondary-gradient": "linear-gradient(135deg, #d5c7ad 0%, #68604d 100%)",
        "card-gradient":
          "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(241,234,216,0.85) 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #f1ead8 0%, #d5c7ad 35%, #bec5a4 70%, #8a8e75 100%)",
        "footer-gradient": "linear-gradient(135deg, #8a8e75 0%, #78805f 50%, #68604d 100%)",
        "intense-gradient": "linear-gradient(135deg, #a0b085 0%, #8a8e75 50%, #78805f 100%)",
      },
      boxShadow: {
        modern:
          "0 4px 6px -1px rgba(138, 142, 117, 0.15), 0 2px 4px -1px rgba(138, 142, 117, 0.08)",
        "modern-lg":
          "0 10px 15px -3px rgba(138, 142, 117, 0.15), 0 4px 6px -2px rgba(138, 142, 117, 0.08)",
        "modern-xl":
          "0 20px 25px -5px rgba(138, 142, 117, 0.15), 0 10px 10px -5px rgba(138, 142, 117, 0.06)",
        "inner-soft": "inset 0 1px 2px 0 rgba(138, 142, 117, 0.08)",
        glow: "0 0 25px rgba(138, 142, 117, 0.25)",
        "intense-glow": "0 0 30px rgba(138, 142, 117, 0.35)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
