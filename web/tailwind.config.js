/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kanji: [
          '"Noto Serif JP"',
          '"Yu Mincho"',
          '"Hiragino Mincho Pro"',
          "serif",
        ],
        serif: ['"Cormorant Garamond"', '"EB Garamond"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        ink: "#0d0a07",
        parchment: "#f1e6cc",
        parchmentDark: "#d8c79a",
        gold: "#c9a24a",
        goldBright: "#e9c873",
        crimson: "#7a1a1a",
        crimsonBright: "#a83232",
      },
      boxShadow: {
        gavel: "0 0 60px rgba(232,202,114,0.35)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.92" },
        },
      },
      animation: {
        flicker: "flicker 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
