/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#10b981',
          600: '#059669',
          700: '#0a6847',
          800: '#0f5132',
          900: '#073b22',
        },
        gold: {
          50: '#fffdf0',
          100: '#fef9c3',
          200: '#fef08a',
          400: '#fbbf24',
          500: '#f3c623',
          600: '#d4af37',
          700: '#b8921a',
          800: '#927310',
        },
        surface: {
          DEFAULT: '#FBFBFA',
          card: '#FFFFFF',
          tint: '#E8F5E9',
          tintLight: '#F4FAF4',
        },
        onyx: {
          DEFAULT: '#1E293B',
          muted: '#64748B',
          light: '#94A3B8',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        quran: ['"Amiri"', '"Scheherazade New"', 'Traditional Arabic', 'serif'],
      },
      boxShadow: {
        'm3-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        'm3-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
        'm3-3': '0px 4px 12px 3px rgba(0, 0, 0, 0.08), 0px 1px 3px 0px rgba(0, 0, 0, 0.06)',
        'glow-emerald': '0 0 25px -5px rgba(15, 81, 50, 0.35)',
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
      }
    },
  },
  plugins: [],
}
