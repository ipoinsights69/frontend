/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      colors: {
        brand: {
          purple: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        finance: {
          green: '#10B981',
          red: '#EF4444',
          yellow: '#F59E0B',
          blue: '#3B82F6',
        },
      },
    },
  },
  plugins: [],
} 