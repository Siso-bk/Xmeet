import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0c1b1a',
        moss: '#1e3a34',
        clay: '#f0e9df',
        ember: '#b45309',
        mist: '#e8f1ee'
      }
    }
  },
  plugins: []
}

export default config
