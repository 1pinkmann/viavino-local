const mix         = require('laravel-mix')
const tailwindcss = require('tailwindcss')

mix
    .js('./resources/js/theme.js', './build/js/theme.js')
    .sass('./resources/sass/theme.sass', './build/css/theme.css').options({
        processCssUrls: false,
        postCss: [
            tailwindcss({
                purge: [
                    'templates/*.phtml'
                ],
                theme: {
                    extend: {
                        screens: {
                            'lg': '1060px'
                        },
                        fontFamily: {
                            'body': 'Montserrat, sans-serif',
                            'display': 'Cormorant Garamond, sans-serif'
                        },
                        colors: {
                            'intro': '#958F88',
                            'rosato': '#E44D50',
                            'rosso': '#93273B',
                            'bianco': '#E4B445'
                        },
                        fill: theme => theme('colors'),
                        stroke: theme => theme('colors')
                    }
                }
            })
        ]
    })