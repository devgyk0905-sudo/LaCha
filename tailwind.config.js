/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          bg: '#0d0f14',
          bg2: '#13161e',
          bg3: '#1a1e2a',
          border: 'rgba(255,255,255,0.08)',
        }
      }
    },
  },
  plugins: [],
}
