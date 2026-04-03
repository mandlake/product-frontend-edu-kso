import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/widgets/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/entities/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          white: "var(--color-neutral-white)",
          black: "var(--color-neutral-black)",
        },
        primary: {
          normal: "var(--color-primary-normal)",
          dark: "var(--color-primary-dark)",
        },
        gray: {
          900: "var(--color-gray-900)",
          800: "var(--color-gray-800)",
          600: "var(--color-gray-600)",
          200: "var(--color-gray-200)",
          100: "var(--color-gray-100)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
