/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heebo: ['Heebo', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#3B82F6',
                    light: '#60A5FA',
                    dark: '#1E40AF',
                },
                accent: {
                    DEFAULT: '#F59E0B',
                    light: '#FBBF24',
                    dark: '#D97706',
                },
                surface: {
                    dark: '#0A0F1C',
                    card: '#111827',
                },
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.2' },
                    '50%': { opacity: '0.4' },
                },
            },
        },
    },
    plugins: [],
}
