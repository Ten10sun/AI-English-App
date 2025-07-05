import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            animation: {
                'spin-slow': 'spin 2.5s linear infinite',
            },
            colors: {
                'github-0': '#161b22',
                'github-1': '#0e4429',
                'github-2': '#006d32',
                'github-3': '#26a641',
                'github-4': '#39d353',
            },
        },
    },

    plugins: [forms],
};
