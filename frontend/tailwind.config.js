/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Deep Navy
          light: '#334155',
          dark: '#020617',
        },
        accent: {
          DEFAULT: '#4f46e5', // Electric Indigo
          hover: '#4338ca',
        },
        background: '#f8fafc', // Very light gray/white
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #bc13fe' },
          '100%': { boxShadow: '0 0 20px #00f3ff, 0 0 10px #bc13fe' }
        }
      }
    },
  },
  plugins: [],
}