/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "#326789",
      secondary: "#78A6C8",
      background: "#E9EEF2",
      alert: "#E65C4F",
    },
    extend: {
      fontFamily: {
        nunito: ['"Nunito"', "cursive"],
      },
    },
  },
  plugins: [],
};
