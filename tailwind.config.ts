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
        text: {
          default: "var(--color-text-default)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          disabled: "var(--color-text-disabled)",
        },
        icon: {
          default: "var(--color-icon-default)",
          white: "var(--color-icon-white)",
        },
        background: {
          default: "var(--color-background-default)",
          secondary: "var(--color-background-secondary)",
          tertiary: "var(--color-background-tertiary)",
          black: "var(--color-background-black)",
        },
        line: {
          default: "var(--color-line-default)",
          strong: "var(--color-line-strong)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
