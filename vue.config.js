'use strict';
const SocialTags = require('social-tags-webpack-plugin')
module.exports = {
    pwa: {
        appleMobileWebAppCapable: 'yes',
        msTileColor: '#222336',
        appleMobileWebAppStatusBarStyle: 'black',
        iconPaths :[

        ]
    },
    configureWebpack: {
        plugins: [
            new SocialTags({
                appUrl: 'http://player1.jelliti.me/',
                facebook: {
                    //'fb:app_id': "",
                    'og:url': "http://player1.jelliti.me/",
                    'og:type': "music.radio_station",
                    'og:title': "JoujmaFM player",
                    'og:image': 'src/img/book.png',
                    'og:description': "JoujmaFM player, 24h/7 of music",
                    'og:site_name': "JoujmaFM",
                    'og:locale': "FR_fr",
                    'og:article:author': "simyos",
                },
                twitter: {
                    "twitter:card": "summary",
                    "twitter:site": "@site_account",
                    "twitter:creator": "@individual_account",
                    "twitter:url": "http://example.com/page.html",
                    "twitter:title": "JoujmaFM player",
                    "twitter:description": "JoujmaFM player, 24h/7 of music",
                    "twitter:image": '<%= BASE_URL %>/img/icon.png'
                },
            })
        ]
    },
    productionSourceMap : false,
    transpileDependencies: ["firebase","axios","colorthief","vue2-hammer","standardized-audio-context"]
};