/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)",
        },
        background: {
          DEFAULT: "rgb(var(--color-background) / <alpha-value>)",
          foreground: "rgb(var(--color-background-foreground) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "rgb(var(--color-foreground) / <alpha-value>)",
          muted: "rgb(var(--color-foreground-muted) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--color-destructive) / <alpha-value>)",
          foreground: "rgb(var(--color-destructive-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          foreground: "rgb(var(--color-success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          foreground: "rgb(var(--color-warning-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
          foreground: "rgb(var(--color-info-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card-rgb) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground-rgb) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover-rgb) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground-rgb) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground-rgb) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--border-rgb) / <alpha-value>)",
          foreground: "rgb(var(--border-foreground-rgb) / <alpha-value>)",
        },
        input: {
          DEFAULT: "rgb(var(--input-rgb) / <alpha-value>)",
          foreground: "rgb(var(--input-foreground-rgb) / <alpha-value>)",
        },
        ring: "rgb(var(--ring-rgb) / <alpha-value>)",
        radius: "var(--radius)",
      },
    },
  },
  plugins: [
    ({ addBase }) => {
      addBase({
        ":root": {
          "--color-primary": "0 0 0",
          "--color-secondary": "45 45 45",
          "--color-background": "255 255 255",
          "--color-primary-foreground": "255 255 255",
          "--color-foreground": "0 0 0",
          "--color-destructive": "239 68 68",
          "--color-success": "34 197 94",
          "--color-warning": "234 179 8",
          "--color-info": "59 130 246",
          "--color-muted": "115 115 115",
          "--card-rgb": "255 255 255",
          "--card-foreground-rgb": "0 0 0",
          "--popover-rgb": "255 255 255",
          "--popover-foreground-rgb": "0 0 0",
          "--accent-rgb": "245 245 245",
          "--accent-foreground-rgb": "0 0 0",
          "--border-rgb": "229 229 229",
          "--border-foreground-rgb": "0 0 0",
          "--input-rgb": "255 255 255",
          "--input-foreground-rgb": "0 0 0",
          "--ring-rgb": "0 0 0",
          "--radius": "0.5rem",
        },
        ".dark": {
          "--color-primary": "255 255 255",
          "--color-secondary": "210 210 210",
          "--color-background": "17 17 17",
          "--color-primary-foreground": "0 0 0",
          "--color-foreground": "255 255 255",
          "--color-destructive": "239 68 68",
          "--color-success": "34 197 94",
          "--color-warning": "234 179 8",
          "--color-info": "59 130 246",
          "--color-muted": "140 140 140",
          "--card-rgb": "31 31 31",
          "--card-foreground-rgb": "255 255 255",
          "--popover-rgb": "31 31 31",
          "--popover-foreground-rgb": "255 255 255",
          "--accent-rgb": "45 45 45",
          "--accent-foreground-rgb": "255 255 255",
          "--border-rgb": "55 55 55",
          "--border-foreground-rgb": "255 255 255",
          "--input-rgb": "31 31 31",
          "--input-foreground-rgb": "255 255 255",
          "--ring-rgb": "255 255 255",
          "--radius": "0.5rem",
        },
      });
    },
  ],
};
