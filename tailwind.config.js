/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50, #f0f9ff)',
          100: 'var(--color-brand-100, #e0f2fe)',
          200: 'var(--color-brand-200, #bae6fd)',
          300: 'var(--color-brand-300, #7dd3fc)',
          400: 'var(--color-brand-400, #38bdf8)',
          500: 'var(--color-brand-500, #008be3)',
          600: 'var(--color-brand-600, #0077c8)',
          700: 'var(--color-brand-700, #005fa3)',
          800: 'var(--color-brand-800, #00487d)',
          900: 'var(--color-brand-900, #0a192f)',
          950: 'var(--color-brand-950, #030812)',
        },
        gold: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#008be3',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        crimson: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        sand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 25px 50px -12px rgba(0, 139, 227, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
