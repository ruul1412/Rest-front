/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
   theme: {
    extend: {
      colors: {
        brand: {
          primary: "#B77C36",
          secondary: "#A66C2B",
          cream: "#FAF7F2",
          dark: "#30251F",
          text: "#51463D",
          muted: "#8B8178",
          border: "#E5DED5",
          soft: "#F5EBDD",
        },
      },
    },
  },
  plugins: [],
}