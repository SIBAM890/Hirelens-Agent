/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900 (Deep Navy)
          light: '#334155',   // Slate 700
          lighter: '#64748b', // Slate 500
        },
        accent: {
          DEFAULT: '#2563eb', // Royal Blue
          hover: '#1d4ed8',   // Darker Royal Blue
          light: '#60a5fa',   // Lighter Blue
        },
        secondary: {
          DEFAULT: '#f43f5e', // Rose
          hover: '#e11d48',
        },
        background: {
          DEFAULT: '#f8fafc', // Slate 50
          paper: '#ffffff',
        },
        success: '#10b981', // Emerald 500
        warning: '#f59e0b', // Amber 500
        error: '#ef4444',   // Red 500
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
        'gradient-surface': 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}