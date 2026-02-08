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
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900
          light: '#334155',   // Slate 700
          dark: '#020617',    // Slate 950
        },
        accent: {
          DEFAULT: '#4f46e5', // Indigo 600
          hover: '#4338ca',   // Indigo 700
          light: '#818cf8',   // Indigo 400
        },
        background: '#f8fafc', // Slate 50
        surface: '#ffffff',
        success: '#10b981',    // Emerald 500
        warning: '#f59e0b',    // Amber 500
        error: '#ef4444',      // Red 500
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        'gradient-surface': 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.05)',
        'neon': '0 0 20px rgba(79, 70, 229, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}