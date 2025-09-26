/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['\"Baloo 2\"', 'cursive'],
        body: ['\"Inter\"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#7a4bff',
        secondary: '#36c1ff',
        highlight: '#ffcb47',
        slateGlass: 'rgba(255, 255, 255, 0.65)',
      },
      boxShadow: {
        glow: '0 10px 30px rgba(122, 75, 255, 0.35)',
      },
    },
  },
  plugins: [],
}