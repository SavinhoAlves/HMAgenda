/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas baseadas na sua planilha de 2026
        'agenda-particular': '#dc2626', 
        'agenda-retorno': '#ea580c',
        'agenda-socio': '#4c1d95',
      }
    },
  },
  plugins: [],
}