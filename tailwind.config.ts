import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f141c',
        surface: {
          DEFAULT: '#0f141c',
          dim: '#0f141c',
          bright: '#343942',
          lowest: '#090e16',
          low: '#171c24',
          container: '#1b2028',
          high: '#252a33',
          highest: '#30353e',
          elevation1: '#161e2e',
          elevation2: '#1e293b',
          elevation3: '#263348',
        },
        workbench: {
          border: '#263244',
          'border-subtle': '#1e293b',
          'border-strong': '#303e54',
          text: '#f8fafc',
          'text-secondary': '#94a3b8',
          'text-muted': '#64748b',
          accent: '#6366f1',
          cyan: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
        primary: {
          DEFAULT: '#6366f1',
          light: '#c0c1ff',
          dark: '#4f46e5',
          container: '#8083ff',
        },
        secondary: {
          DEFAULT: '#38bdf8',
          light: '#7bd0ff',
          container: '#00a6e0',
        },
        tertiary: {
          DEFAULT: '#10b981',
          light: '#4edea3',
          container: '#00885d',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        },
        danger: {
          DEFAULT: '#f43f5e',
          light: '#ffb4ab',
        },
        outline: {
          DEFAULT: '#908fa0',
          variant: '#464554',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
