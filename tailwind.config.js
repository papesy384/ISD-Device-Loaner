/**
 * Tailwind theme: ISD brand colors (isd-navy, isd-gold).
 * With Tailwind v4, active theme is in app/globals.css @theme; this file is kept for reference and /messages content.
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./messages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "isd-navy": "#002D56",
        "isd-gold": "#FDB913",
      },
    },
  },
  plugins: [],
};
