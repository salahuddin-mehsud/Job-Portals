/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Deep blue (primary) - blue-600
        'primary-50': '#EFF6FF', // Light blue (50-level shade) - blue-50
        'primary-100': '#DBEAFE', // Light blue (100-level shade) - blue-100
        'primary-500': '#3B82F6', // Medium blue (500-level shade) - blue-500
        'primary-600': '#2563EB', // Primary blue (600-level shade) - blue-600
        'primary-700': '#1D4ED8', // Dark blue (700-level shade) - blue-700
        
        // Secondary Colors
        'secondary': '#64748B', // Sophisticated slate gray (secondary) - slate-500
        'secondary-100': '#F1F5F9', // Light slate (100-level shade) - slate-100
        'secondary-200': '#E2E8F0', // Light slate (200-level shade) - slate-200
        'secondary-300': '#CBD5E1', // Medium light slate (300-level shade) - slate-300
        'secondary-400': '#94A3B8', // Medium slate (400-level shade) - slate-400
        'secondary-500': '#64748B', // Secondary slate (500-level shade) - slate-500
        'secondary-600': '#475569', // Dark slate (600-level shade) - slate-600
        'secondary-700': '#334155', // Darker slate (700-level shade) - slate-700
        'secondary-800': '#1E293B', // Very dark slate (800-level shade) - slate-800
        'secondary-900': '#0F172A', // Darkest slate (900-level shade) - slate-900
        
        // Accent Colors
        'accent': '#059669', // Success-oriented green (accent) - emerald-600
        'accent-50': '#ECFDF5', // Light emerald (50-level shade) - emerald-50
        'accent-100': '#D1FAE5', // Light emerald (100-level shade) - emerald-100
        'accent-500': '#10B981', // Medium emerald (500-level shade) - emerald-500
        'accent-600': '#059669', // Accent emerald (600-level shade) - emerald-600
        'accent-700': '#047857', // Dark emerald (700-level shade) - emerald-700
        
        // Background Colors
        'background': '#FFFFFF', // Pure white background - white
        'surface': '#F8FAFC', // Subtle off-white surface - slate-50
        'surface-100': '#F1F5F9', // Light surface (100-level shade) - slate-100
        
        // Text Colors
        'text-primary': '#0F172A', // Near-black primary text - slate-900
        'text-secondary': '#475569', // Medium gray secondary text - slate-600
        'text-muted': '#64748B', // Muted text color - slate-500
        
        // Status Colors
        'success': '#10B981', // Vibrant green success - emerald-500
        'success-50': '#ECFDF5', // Light success (50-level shade) - emerald-50
        'success-100': '#D1FAE5', // Light success (100-level shade) - emerald-100
        'success-600': '#059669', // Dark success (600-level shade) - emerald-600
        
        'warning': '#F59E0B', // Attention-grabbing amber warning - amber-500
        'warning-50': '#FFFBEB', // Light warning (50-level shade) - amber-50
        'warning-100': '#FEF3C7', // Light warning (100-level shade) - amber-100
        'warning-600': '#D97706', // Dark warning (600-level shade) - amber-600
        
        'error': '#EF4444', // Clear red error - red-500
        'error-50': '#FEF2F2', // Light error (50-level shade) - red-50
        'error-100': '#FEE2E2', // Light error (100-level shade) - red-100
        'error-600': '#DC2626', // Dark error (600-level shade) - red-600
        
        // Border Colors
        'border': '#E2E8F0', // Light gray border - slate-200
        'border-light': '#F1F5F9', // Very light border - slate-100
        'border-dark': '#CBD5E1', // Darker border - slate-300
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '0.125rem',
        'DEFAULT': '0.375rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'modal': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      zIndex: {
        '1000': '1000',
        '1010': '1010',
        '1020': '1020',
        '1030': '1030',
        '1040': '1040',
        '1050': '1050',
        '1100': '1100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}