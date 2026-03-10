/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#135bec',
                'bg-dark': '#101622',
                'bg-chrome': '#111318',
                'bg-surface': '#1c212b',
                'bg-hover': '#282e39',
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
