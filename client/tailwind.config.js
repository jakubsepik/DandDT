/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  important: true,
  corePlugins: {
    // ...
    backdropOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    ringOpacity: false,
    textOpacity: false,
  },
  content: ["./src/components/*.js", "./src/input.scss", "./src/*.js","./src/components/**/*.js"],
  theme: {
    fontFamily: {},
    extend: {
      colors: {
        primary: "#F1F6F9",
        secondary: "#1a93a6",
        tertiary: "#032e4b",
        quaternary: "#0b4f7d",
        border:'#606060',
        dark_primary: "#1c1f20",
        dark_secondary: "#262a2b",
      },
    },
  },
  plugins: [],
};
