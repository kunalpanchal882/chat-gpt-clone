module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-900': '#0b0b0d',
        'panel-800': '#0f1720',
        'muted-400': '#9aa4b2',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
}
