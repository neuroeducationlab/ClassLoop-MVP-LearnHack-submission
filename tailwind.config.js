import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans Thai', 'Inter', 'sans-serif'],
      },
      colors: {
        // Brand stops from the spec (50/300/500/600 pink, 300/600 grey);
        // the in-between shades are interpolated so the full scale works.
        pink: {
          700: '#A82465',
          600: '#D12E80',
          500: '#EE4D9B',
          400: '#F26FAE',
          300: '#F794C2',
          200: '#F9BEDC',
          100: '#FBDCEC',
          50: '#FDEEF6',
        },
        grey: {
          700: '#525156',
          600: '#6B6A70',
          500: '#85848A',
          400: '#9FA0A5',
          300: '#C3C4C8',
          200: '#E3E3E6',
          100: '#F1F1F3',
          50: '#F8F8F9',
        },
        ink: '#17161A',
        paper: '#FFFFFF',
        canvas: '#FAFAFA',

        // shadcn/ui tokens
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // v4-style alias used by some pages; v3 has no shadow-xs
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
