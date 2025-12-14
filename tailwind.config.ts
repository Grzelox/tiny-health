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
        background: "#FBFAF6",
        surface: "#F1F4EE",
        border: "#D9E2D8",
        text: "#1F2A24",
        muted: "#5B6B63",
        primary: {
          50: "#F2F7F5",
          100: "#DDEBE6",
          200: "#BED7CF",
          300: "#98BFAF",
          400: "#6FA48E",
          500: "#3F6F5E",
          600: "#355E50",
          700: "#2D4F44",
          800: "#264038",
          900: "#1F332D",
        },
        secondary: {
          50: "#F6F8F7",
          100: "#E9EEEB",
          200: "#D9E2D8",
          300: "#B6C3BC",
          400: "#94A39B",
          500: "#5B6B63",
          600: "#4B5A53",
          700: "#3C4842",
          800: "#2C3530",
          900: "#1F2A24",
        },
        accent: {
          50: "#FFFAF2",
          100: "#FDF1DE",
          200: "#F9E0B7",
          300: "#F2C98B",
          400: "#EDB36A",
          500: "#E7A55B",
          600: "#D89345",
          700: "#C48436",
          800: "#9B652A",
          900: "#6F4715",
        },
        success: {
          50: "#F1F8F4",
          100: "#DCEFE4",
          200: "#B8DFCA",
          300: "#8EC9AA",
          400: "#5EAE85",
          500: "#2F7D5B",
          600: "#296D50",
          700: "#225C43",
          800: "#1C4A36",
          900: "#163B2B",
        },
        warning: {
          50: "#FFFAF0",
          100: "#FCEECF",
          200: "#F7DBA2",
          300: "#F0C16B",
          400: "#E3A73D",
          500: "#B7791F",
          600: "#9E661A",
          700: "#825415",
          800: "#684211",
          900: "#52340D",
        },
        danger: {
          50: "#FDF3F2",
          100: "#FBE2E0",
          200: "#F6C1BE",
          300: "#EE9893",
          400: "#E36B65",
          500: "#C2413B",
          600: "#AA3933",
          700: "#8E2F2A",
          800: "#732623",
          900: "#5A1E1C",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "primary-gradient": "linear-gradient(135deg, #98BFAF 0%, #3F6F5E 100%)",
        "secondary-gradient": "linear-gradient(135deg, #F2C98B 0%, #C48436 100%)",
        "card-gradient":
          "linear-gradient(145deg, rgba(251,250,246,0.96) 0%, rgba(241,244,238,0.92) 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #FBFAF6 0%, #F1F4EE 45%, #DDEBE6 75%, #BED7CF 100%)",
        "footer-gradient": "linear-gradient(135deg, #1F332D 0%, #2D4F44 50%, #1F2A24 100%)",
        "intense-gradient": "linear-gradient(135deg, #6FA48E 0%, #3F6F5E 50%, #355E50 100%)",
      },
      boxShadow: {
        modern: "0 4px 6px -1px rgba(63, 111, 94, 0.15), 0 2px 4px -1px rgba(63, 111, 94, 0.08)",
        "modern-lg":
          "0 10px 15px -3px rgba(63, 111, 94, 0.15), 0 4px 6px -2px rgba(63, 111, 94, 0.08)",
        "modern-xl":
          "0 20px 25px -5px rgba(63, 111, 94, 0.15), 0 10px 10px -5px rgba(63, 111, 94, 0.06)",
        "inner-soft": "inset 0 1px 2px 0 rgba(63, 111, 94, 0.08)",
        glow: "0 0 25px rgba(63, 111, 94, 0.25)",
        "intense-glow": "0 0 30px rgba(63, 111, 94, 0.35)",
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
