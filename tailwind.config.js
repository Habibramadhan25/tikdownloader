/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        // Neo-Brutalist Colors
        neo: {
          yellow: '#FFDE00',
          green: '#00FF00',
          cyan: '#00FFFF',
          pink: '#FF00FF',
          purple: '#8A2BE2',
          black: '#000000',
          white: '#F0F0F0',
        }
      },
      boxShadow: {
        'brutal': '6px 6px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '10px 10px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      }
    },
  },
  plugins: [],
}
