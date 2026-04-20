/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#004AAD',
                'bg-dark': '#FFFFFF',
                'bg-chrome': '#F4F8FF',
                'bg-surface': '#E9F4FF',
                'bg-hover': '#DDEEFF',
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
                future: ['Audiowide', 'cursive'],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
                '2xl': '1rem',
                full: '9999px',
            },
        },
    },
    plugins: [],
};
