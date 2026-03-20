/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8b8',
          400: '#ec7593',
          500: '#e04472',
          600: '#cc2458',
          700: '#ab1846',
          800: '#8f1640',
          900: '#7a153b',
          950: '#430619',
        },
        dark: {
          100: '#1e1e2e',
          200: '#181825',
          300: '#11111b',
        }
      }
    },
  },
  plugins: [],
}