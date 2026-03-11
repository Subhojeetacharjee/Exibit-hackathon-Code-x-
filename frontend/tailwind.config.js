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
          DEFAULT: '#00e5ff',
          50: '#e0fffe',
          100: '#b3fffd',
          200: '#80fffa',
          300: '#4dfff5',
          400: '#1affef',
          500: '#00e5ff',
          600: '#00bcd4',
          700: '#0097a7',
          800: '#00796b',
          900: '#004d40',
        },
        accent: {
          green: '#39ff14',
          cyan: '#00e5ff',
          purple: '#bf00ff',
          pink: '#ff2d95',
        },
        secondary: '#80fffa',
        dark: {
          50: '#111111',
          100: '#0e0e0e',
          200: '#0a0a0a',
          300: '#080808',
          400: '#060606',
          500: '#040404',
          600: '#020202',
          700: '#010101',
          800: '#000000',
          900: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.5), 0 2px 6px -4px rgba(0, 0, 0, 0.4)',
        'card': '0 4px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 229, 255, 0.05)',
        'elevated': '0 10px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 229, 255, 0.08)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
        'neon': '0 0 15px rgba(0, 229, 255, 0.4), 0 0 30px rgba(0, 229, 255, 0.15), 0 0 60px rgba(0, 229, 255, 0.05)',
        'neon-green': '0 0 15px rgba(57, 255, 20, 0.4), 0 0 30px rgba(57, 255, 20, 0.15)',
        'neon-pink': '0 0 15px rgba(255, 45, 149, 0.4), 0 0 30px rgba(255, 45, 149, 0.15)',
      },
    },
  },
  plugins: [],
}
