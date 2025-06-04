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
          50: "#f5f7f2",
          100: "#e6ead9",
          200: "#d1d9bc",
          300: "#b3c297",
          400: "#95aa74",
          500: "#7b9256",
          600: "#617544",
          700: "#4c5b37",
          800: "#3d482e",
          900: "#333c28",
        },
        secondary: {
          50: "#f7f6f4",
          100: "#e7e2dc",
          200: "#d5ccc1",
          300: "#bfb0a0",
          400: "#a8917d",
          500: "#967964",
          600: "#816755",
          700: "#675246",
          800: "#54433b",
          900: "#463a34",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "primary-gradient": "linear-gradient(135deg, #95aa74 0%, #7b9256 100%)",
        "secondary-gradient": "linear-gradient(135deg, #967964 0%, #54433b 100%)",
        "card-gradient":
          "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(245,247,242,0.8) 100%)",
        "hero-gradient": "linear-gradient(135deg, #f5f7f2 0%, #e6ead9 50%, #d1d9bc 100%)",
      },
      boxShadow: {
        modern: "0 4px 6px -1px rgba(149, 170, 116, 0.1), 0 2px 4px -1px rgba(149, 170, 116, 0.06)",
        "modern-lg":
          "0 10px 15px -3px rgba(149, 170, 116, 0.1), 0 4px 6px -2px rgba(149, 170, 116, 0.05)",
        "modern-xl":
          "0 20px 25px -5px rgba(149, 170, 116, 0.1), 0 10px 10px -5px rgba(149, 170, 116, 0.04)",
        "inner-soft": "inset 0 1px 2px 0 rgba(149, 170, 116, 0.05)",
        glow: "0 0 20px rgba(149, 170, 116, 0.15)",
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
