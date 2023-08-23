/** @type {import('tailwindcss').Config} */
const { createThemes } = require('tw-colors')
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primaryBlue: 'hsl(220, 98%, 61%)',
            },
            boxShadow: {
                customBoxShadow: '0px 16px 12px 0px rgb(0 0 0 / 0.5)',
            },
        },
    },
    plugins: [
        createThemes({
            light: {
                mainBackground: 'hsl(0, 0%, 90%)',
                secondaryBackground: 'hsl(0, 0%, 96%)',
                secondaryText: 'hsl(235, 19%, 35%)',
                darkGrayishBlue: 'hsl(236, 9%, 51%)',
                veryDarkGrayishBlue: 'hsl(235, 19%, 35%)',
            },
            dark: {
                mainBackground: 'hsl(235, 21%, 11%)',
                secondaryBackground: 'hsl(235, 24%, 19%)',
                secondaryText: 'hsl(234, 39%, 85%)',
                lightGrayishBlueHover: 'hsl(236, 33%, 92%)',
                darkGrayishBlue: 'hsl(234, 11%, 52%)',
                veryDarkGrayishBlue: 'hsl(233, 14%, 35%)',
                veryDarkGrayishBlueHover: 'hsl(237, 14%, 26%)',
            },
        }),
    ],
}
