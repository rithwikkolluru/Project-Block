/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gravityBase: '#0A0A1A',
        gravityAccent: '#6366F1',
        safeFloat: '#10B981',
        warnWobble: '#F59E0B',
        dangerCollapse: '#EF4444'
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(180deg, #0A0A1A 0%, #1A1A2E 100%)',
      }
    },
  },
  plugins: [],
}
