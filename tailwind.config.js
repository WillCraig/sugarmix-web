/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--bg)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        line2: 'var(--line2)',
        accent: 'var(--accent)',
        low: 'var(--low)',
        mod: 'var(--mod)',
        high: 'var(--high)',
        ex: 'var(--ex)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      maxWidth: {
        app: '430px',
      },
    },
  },
  plugins: [],
};
