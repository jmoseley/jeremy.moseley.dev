module.exports = {
  content: ["_site/**/*.html"],
  safelist: [],
  theme: {
    fontFamily: {
      sans: ['"Roboto Mono"', "Arial", "sans-serif"],
    },
    extend: {
      colors: {
        change: "black",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
