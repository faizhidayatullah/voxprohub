/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // semua file di dalam src
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "serif", "bold"],
      },
    },
  },

  plugins: [],
};
