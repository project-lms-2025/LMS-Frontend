/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#6C5CE7",
          white: "#FFFFFF",
        },
        secondary: {
          gray: "#F5F6FA",
          coral: "#FF7F50",
        },
        accent: {
          yellow: "#FDCB6E",
          skyblue: "#87CEEB",
        },
      },
    },
  },
  plugins: [],
}

