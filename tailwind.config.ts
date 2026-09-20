import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0D0E",
        coal: "#101315",
        paper: "#F7F7F4",
        rule: "#DADCD7",
        muted: "#636665",
        ash: "#A9ACA8",
        smoke: "#7E8580",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        inter: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "ui-serif", "Georgia", "serif"],
      },
      maxWidth: {
        page: "1320px",
      },
      screens: {
        rail: "1100px",
      },
    },
  },
  plugins: [],
} satisfies Config;
