/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Ledger" palette: deep slate-navy for structure/authority,
        // warm amber as the single accent (attendance/notices/actions),
        // a muted sage for positive states (present/approved).
        ink: {
          50: '#f4f6f8',
          100: '#e4e9ee',
          200: '#c8d2dc',
          300: '#9fb0c0',
          400: '#6d8299',
          500: '#4c6178',
          600: '#374a5e',
          700: '#2a394a',
          800: '#1c2733',
          900: '#121a22',
        },
        amber: {
          50: '#fdf8ed',
          100: '#faedc9',
          400: '#e3a832',
          500: '#cc8f1e',
          600: '#a97316',
        },
        sage: {
          50: '#f1f6f0',
          400: '#7ba26a',
          500: '#5f8a4e',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
