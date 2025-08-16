/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'surface': 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-strong': 'var(--color-on-surface-strong)',
        'primary': 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'outline': 'var(--color-outline)',
        'outline-dark': 'var(--color-outline-dark)',
        'surface-dark': 'var(--color-surface-dark)',
        'surface-dark-alt': 'var(--color-surface-dark-alt)',
        'on-surface-dark': 'var(--color-on-surface-dark)',
        'on-surface-dark-strong': 'var(--color-on-surface-dark-strong)',
      }
    },
  },
  plugins: [],
}