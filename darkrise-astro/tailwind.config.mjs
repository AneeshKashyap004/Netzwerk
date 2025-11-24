/******** Tailwind config (Darkrise-like, dark-first) ********/ 
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0f172a',
          800: '#0a1220',
        },
        surface: '#111827',
        text: '#e6edf6',
        muted: '#93a4b9',
        accent: {
          DEFAULT: '#0b63ca',
          600: '#0046b5'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ]
};
