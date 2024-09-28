/** @type {import('tailwindcss').Config} */
import fluid, { extract } from 'fluid-tailwind'

export default {
  content: {
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    extract
  },
  theme: {
    extend: {
      fontSize: {
        '2xs': ['0.625rem',{
          lineHeight: '0.75rem'
        }],
      },
    },
  },
  plugins: [
    fluid
  ],
}
