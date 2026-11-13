/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        // Paleta da marca Folhinha Pronta
        petrol: {
          DEFAULT: '#1E3A5F',
          50: '#EAF0F6',
          100: '#CFDCE9',
          200: '#A3BAD3',
          300: '#7797BC',
          400: '#4B75A6',
          500: '#2E5885',
          600: '#1E3A5F',
          700: '#182F4C',
          800: '#122439',
          900: '#0C1826',
        },
        mint: {
          DEFAULT: '#2ECC91',
          50: '#E9FBF3',
          100: '#C8F5E1',
          200: '#96EBC7',
          300: '#64E1AD',
          400: '#3AD69B',
          500: '#2ECC91',
          600: '#25A374',
          700: '#1C7A57',
          800: '#12523A',
          900: '#09291D',
        },
        orange: {
          DEFAULT: '#FF6B35',
          50: '#FFF1EC',
          100: '#FFDBCB',
          200: '#FFB897',
          300: '#FF9463',
          400: '#FF7F49',
          500: '#FF6B35',
          600: '#E84E15',
          700: '#B93C10',
          800: '#8A2C0C',
          900: '#5C1D08',
        },
        surface: '#F7F9FB',
        ink: '#1F2937',

        // shadcn/ui semantic tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.92' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
      },
      boxShadow: {
        card: '0 2px 10px 0 rgba(30, 58, 95, 0.08)',
        'card-hover': '0 12px 28px -8px rgba(30, 58, 95, 0.22)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
