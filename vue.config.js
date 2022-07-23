'use strict';

const devConfig = JSON.stringify(process.env.NODE_ENV === 'production' ? require('./public/config.json') : require('./public/config.json'))

module.exports = {
    pwa: {
        appleMobileWebAppCapable: 'yes',
        msTileColor: '#222336',
        appleMobileWebAppStatusBarStyle: 'black',
        iconPaths :[
        ],

        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: 'src/registerServiceWorker.js',
            // ...other Workbox options...

        }
    },
    configureWebpack: {
        // resolve: {
        //     alias: {
        //             config: path.resolve(__dirname, "./public/assets/player.config.js")
        //     },
        // },
        externals: {
            //config: "/assets/config.json"
            //config: require('./public/assets/config.js')
            //config: path.resolve(__dirname, "./public/assets/player.config.js")
            'config': devConfig
        },
        plugins: [

        ],
    },
    productionSourceMap : (process.env.NODE_ENV === 'production'),
    transpileDependencies: ["axios","standardized-audio-context"],
};