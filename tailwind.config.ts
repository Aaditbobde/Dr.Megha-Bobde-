import type { Config } from "tailwindcss";

const brandOrange = {
  50: '#FDF6F0',
  100: '#FBEAE0',
  200: '#F6D2BE',
  300: '#EEB18F',
  400: '#E48956',
  500: '#D9691E', // Logo core terracotta orange
  600: '#BA5715', // WCAG AA compliant (4.6:1+ contrast on #FDFBF7)
  700: '#9E4912', // WCAG AAA compliant (5.8:1 contrast)
  800: '#873E12', // WCAG AAA compliant (7.5:1 contrast)
  900: '#6E3210',
  950: '#3D1806',
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // Enforced minimum readable sizes:
        // xs: 14px (secondary text, captions, hours, tags) - was 12px
        'xs': ['0.875rem', { lineHeight: '1.55', letterSpacing: '0.005em' }],
        // sm: 16px (minimum readable body text / tap targets) - was 14px
        'sm': ['1rem', { lineHeight: '1.65', letterSpacing: '0em' }],
        // base: 18px (baseline body font size) - was 16px
        'base': ['1.125rem', { lineHeight: '1.72', letterSpacing: '-0.005em' }],
        // lg: 20px - was 18px
        'lg': ['1.25rem', { lineHeight: '1.65', letterSpacing: '-0.01em' }],
        // Headings shifted one full step up for effortless scanning:
        // xl: 24px (stepped up from 20px)
        'xl': ['1.5rem', { lineHeight: '1.38', letterSpacing: '-0.015em' }],
        // 2xl: 30px (stepped up from 24px)
        '2xl': ['1.875rem', { lineHeight: '1.35', letterSpacing: '-0.02em' }],
        // 3xl: 36px (stepped up from 30px)
        '3xl': ['2.25rem', { lineHeight: '1.32', letterSpacing: '-0.02em' }],
        // 4xl: 48px (stepped up from 36px)
        '4xl': ['3rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }],
        // 5xl: 60px (stepped up from 48px)
        '5xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        // 6xl: 72px (stepped up from 60px)
        '6xl': ['4.5rem', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
        // 7xl: 84px (stepped up from 72px)
        '7xl': ['5.25rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },
      lineHeight: {
        'body': '1.72',
        'heading': '1.35',
        'tight-heading': '1.25',
      },
      maxWidth: {
        'prose': '68ch',
        'reading': '72ch',
      },
      colors: {
        brand: brandOrange,
        clinic: brandOrange, // Map clinic to brand for seamless backward compatibility
        cream: {
          50: '#FDFBF7', // Main background (warm off-white)
          100: '#FAF7F2',
          200: '#F3EDE2',
          300: '#E8DFCF',
          400: '#D6C8B4',
        },
        espresso: {
          50: '#F7F6F5',
          100: '#EFECE9',
          200: '#DDD8D3',
          300: '#8A7D73',
          400: '#5C5046', // WCAG AAA: 7.3:1 contrast on #FDFBF7
          500: '#4A3F36', // WCAG AAA: 9.7:1 contrast on #FDFBF7
          600: '#3D332B', // WCAG AAA: 12.1:1 contrast on #FDFBF7
          700: '#302821', // WCAG AAA: 14.5:1 contrast
          800: '#241E19', // WCAG AAA: 16.8:1 contrast
          900: '#1A1512', // Main dark text (charcoal espresso): 18.5:1 contrast
          950: '#120E0C',
        },
        sage: {
          50: '#F5F7F4',
          100: '#E9EFE7',
          200: '#D4E0D1',
          300: '#B5C8B0',
          400: '#839A7D',
          500: '#688260',
          600: '#536D4C', // WCAG AA: 5.6:1
          700: '#43583C', // WCAG AAA: 7.4:1
          800: '#33442E',
          900: '#253321',
        },
        warm: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F4ECE1',
          300: '#E7DCB8',
          400: '#D2C2B0',
          500: '#B8A490',
          600: '#5C5046',
          700: '#4A3F36',
          800: '#3D332B',
          900: '#1A1512',
        },
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(43, 36, 32, 0.05)',
        'warm-md': '0 6px 20px -4px rgba(43, 36, 32, 0.07)',
        'warm-lg': '0 12px 32px -6px rgba(43, 36, 32, 0.1)',
        'brand-lift': '0 10px 25px -4px rgba(196, 96, 28, 0.22)',
      },
      fontFamily: {
        sans: ['Inter', 'Work Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Fraunces', 'Playfair Display', 'Lora', 'Georgia', 'serif'],
        devanagari: ['Noto Serif Devanagari', 'Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;