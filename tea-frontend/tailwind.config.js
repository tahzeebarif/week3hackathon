/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans:  ["'Jost'", "sans-serif"],
      },
      colors: {
        tea: {
          dark:   "#1a1a1a",
          mid:    "#4a4a4a",
          light:  "#8a8a8a",
          bg:     "#f5f5f3",
          bgdark: "#eeede9",
          white:  "#ffffff",
          border: "#e0ddd8",
          green:  "#2d5a27",
        },
      },
    },
  },
  plugins: [],
};
