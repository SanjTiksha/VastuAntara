/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#731B1B',
        accent: '#C9A138',
        siteWhite: '#FFFFFF',
        bgSoft: '#FAF9F7',
      },
      fontFamily: {
        sans: ['Poppins', 'Nunito', 'system-ui', 'sans-serif'],
        marathi: ['Hind', 'Baloo 2', 'Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        'soft-card': '0 12px 32px rgba(115, 27, 27, 0.08)',
      },
      borderRadius: {
        brand: '1.5rem',
      },
    },
  },
  plugins: [],
}

