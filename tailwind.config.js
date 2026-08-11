/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leanly: {
          primary: '#3A9900',
          50: '#E8F5E3',
          100: '#DDF2D2',
          200: '#CDEDBD',
          background: '#EEF3EF',
          surface: '#FFFFFF',
          text: {
            primary: '#151515',
            secondary: '#6F746F',
            muted: '#9A9F9A',
          },
          nav: '#202020',
          border: 'rgba(20, 30, 20, 0.08)'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.03)',
        'nav': '0 -4px 20px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}
