const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    darkMode: 'selector',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'ezzora-50': '#f8f8f6',
                'ezzora-100': '#edede7',
                'ezzora-200': '#d9d8cf',
                'ezzora-300': '#c1c1b0',
                'ezzora-400': '#a7a490',
                'ezzora-500': '#969279',
                'ezzora-600': '#89836d',
                'ezzora-700': '#726c5c',
                'ezzora-800': '#5e594e',
                'ezzora-900': '#4e4a40',
                'ezzora-950': '#292721',
                'light-primary-1': '#ffffff',
                'light-primary-2': '#f3f3f3',
                'light-primary-3': '#f2f7ff',
                'dark-primary-1': '#11121e',
                'dark-primary-2': '#1d1d29',
                'secondary-1': '#ffbc11',
                'secondary-2': '#4578f9',
                'secondary-3': '#43b430',
                'secondary-4': '#cb3eff',
                'typography-1': '#ffffff',
                'typography-2': '#7b7b7b',
                'typography-3': '#000000',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
