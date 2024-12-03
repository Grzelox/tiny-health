import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7f2',
          100: '#e6ead9',
          200: '#d1d9bc',
          300: '#b3c297',
          400: '#95aa74',
          500: '#7b9256',
          600: '#617544',
          700: '#4c5b37',
          800: '#3d482e',
          900: '#333c28',
        },
        secondary: {
          50: '#f7f6f4',
          100: '#e7e2dc',
          200: '#d5ccc1',
          300: '#bfb0a0',
          400: '#a8917d',
          500: '#967964',
          600: '#816755',
          700: '#675246',
          800: '#54433b',
          900: '#463a34',
        },
      },
    },
  },
  plugins: [],
};

export default config;