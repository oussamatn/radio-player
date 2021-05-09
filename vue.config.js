'use strict';
//const SocialTags = require('social-tags-webpack-plugin')
const config = require('./public/assets/config.json')

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
            //² new FaviconsWebpackPlugin('src/asserts/logo.png'), // svg works too!

            // new SocialTags({
            //     // appUrl: config.meta.url,
            //     // facebook: {
            //     //     //'fb:app_id': "",
            //     //     'og:url': config.meta.url,
            //     //     'og:type': "music.radio_station",
            //     //     'og:title': config.title,
            //     //     'og:image': config.meta.image,
            //     //     'og:description': config.description,
            //     //     'og:site_name': config.title,
            //     //     'og:locale': config.meta.locale,
            //     // },
            //     // twitter: {
            //     //     "twitter:card": "summary",
            //     //     "twitter:site": config.twitter.username,
            //     //     "twitter:url": config.meta.url,
            //     //     "twitter:title": config.title,
            //     //     "twitter:description": config.description,
            //     //     "twitter:image": config.meta.image
            //     // },
            // })
        ]
    },
    productionSourceMap : false,
    transpileDependencies: ["firebase","axios","vue2-hammer","standardized-audio-context"]
};