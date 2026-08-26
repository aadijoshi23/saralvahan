/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#172217',
        leaf: {
          50: '#f2f8f2',
          100: '#dfeee0',
          600: '#287a3d',
          700: '#1f6231',
          800: '#194d28',
        },
        saffron: '#f49a35',
      },
      boxShadow: {
        soft: '0 20px 50px -28px rgba(23, 34, 23, 0.28)',
      },
    },
  },
  plugins: [],
};
