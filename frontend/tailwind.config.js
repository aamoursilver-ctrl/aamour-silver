/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#EFEAE2',   // warm stone, not cream-terracotta default
        ink: '#221E1B',
        brass: '#9C7A45',    // signature accent — antique brass, jewelry-specific
        sage: '#7C8A75',
        line: '#DAD3C6',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
