/** @type {import('tailwindcss').Config} */
module.exports = {
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
  content: ["./src/components/*.js", "./src/input.scss", "./src/*.js"],
  theme: {
    fontFamily: {},
    extend: {
      colors: {
        primary: "#F1F6F9",
        secondary: "#9BA4B5",
        tertiary: "#032e4b",
        quaternary: "#0b4f7d",
        border:'#606060'
      },
    },
  },
  plugins: [],
};
