/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.jsx", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      screens: {
        'horizontal': {'raw': '(min-height: 400px)'}, // Example: for screens at least 400px tall
        'vertical': {'raw': '(min-height: 800px)'},  // Example: for screens at least 800px tall
      },

    },
  },
  plugins: [],
}

