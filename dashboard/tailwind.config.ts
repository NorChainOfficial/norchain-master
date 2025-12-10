import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      'xs': ['0.875rem', { lineHeight: '1.375rem' }],      // 14px (was 13px)
      'sm': ['0.9375rem', { lineHeight: '1.5rem' }],       // 15px
      'base': ['1.0625rem', { lineHeight: '1.75rem' }],    // 17px (was 16px)
      'lg': ['1.1875rem', { lineHeight: '1.875rem' }],     // 19px (was 18px)
      'xl': ['1.375rem', { lineHeight: '2rem' }],          // 22px (was 20px)
      '2xl': ['1.625rem', { lineHeight: '2.125rem' }],     // 26px (was 24px)
      '3xl': ['2rem', { lineHeight: '2.5rem' }],           // 32px (was 28px)
      '4xl': ['2.5rem', { lineHeight: '3rem' }],           // 40px (was 34px)
      '5xl': ['3.25rem', { lineHeight: '3.75rem' }],       // 52px (was 44px)
      '6xl': ['4rem', { lineHeight: '4.5rem' }],           // 64px
    },
    extend: {
      colors: {
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
        // NorChain Brand System - Core Colors
        norchain: {
          primary: '#0057B8',      // Deep blue
          secondary: '#0B132B',    // Dark navy
          accent: '#2EC4B6',       // Teal
          highlight: '#33F2FF',    // Cyan glow
          dark: '#021D39',         // Deep dark
        },
        // Indigo palette - Primary brand
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Violet palette - Secondary accent
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Slate palette - Dark mode backgrounds
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Shariah compliance green
        shariah: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // DeFi purple
        defi: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        // NorChain Brand Gradients
        'aurora': 'linear-gradient(135deg, #0057B8 0%, #2EC4B6 50%, #33F2FF 100%)',
        'aurora-dark': 'linear-gradient(135deg, #0B132B 0%, #0057B8 50%, #2EC4B6 100%)',
        'primary-glow': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'accent-glow': 'linear-gradient(135deg, #2EC4B6 0%, #33F2FF 100%)',
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-primary-reverse': 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        'gradient-shariah': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-defi': 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-intense': '0 0 40px rgba(99, 102, 241, 0.6)',
        'glow-primary': '0 0 30px rgba(99, 102, 241, 0.3)',
        'glow-secondary': '0 0 30px rgba(139, 92, 246, 0.3)',
        'glow-shariah': '0 0 30px rgba(34, 197, 94, 0.3)',
        'glow-defi': '0 0 30px rgba(168, 85, 247, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.1)',
        'card': '0 6px 25px rgba(11, 19, 43, 0.25)',
        'card-light': '0 4px 20px rgba(11, 19, 43, 0.15)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
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
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)' },
        },
        'blob': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
