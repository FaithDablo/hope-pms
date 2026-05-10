/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#3525cd",
        "primary-container": "#4f46e5",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#464555",
        "outline-variant": "#c7c4d8",
        "outline": "#777587",
        "background": "#f8f9ff",
        "surface-container-low": "#eff4ff"
      },
    },
  },
  plugins: [],
}