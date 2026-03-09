/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary brand colors
                'brand-navy': '#0F1419',
                'brand-blue': '#1E40AF',
                'brand-cyan': '#06B6D4',
                'brand-orange': '#F97316',
                'brand-green': '#10B981',
                
                // Neutral palette
                'neutral-50': '#F9FAFB',
                'neutral-100': '#F3F4F6',
                'neutral-200': '#E5E7EB',
                'neutral-300': '#D1D5DB',
                'neutral-400': '#9CA3AF',
                'neutral-500': '#6B7280',
                'neutral-600': '#4B5563',
                'neutral-700': '#374151',
                'neutral-800': '#1F2937',
                'neutral-900': '#111827',
            },
            fontFamily: {
                'hebrew': ['Heebo', 'system-ui', 'sans-serif'],
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
                'heading-xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
                'heading-lg': ['2rem', { lineHeight: '1.3' }],
                'heading-md': ['1.5rem', { lineHeight: '1.4' }],
                'heading-sm': ['1.25rem', { lineHeight: '1.4' }],
                'body-lg': ['1.125rem', { lineHeight: '1.6' }],
                'body-md': ['1rem', { lineHeight: '1.6' }],
                'body-sm': ['0.875rem', { lineHeight: '1.5' }],
                'caption': ['0.75rem', { lineHeight: '1.4' }],
            },
            spacing: {
                'section': '6rem',
                'section-sm': '4rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'slide-down': 'slideDown 0.6s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
