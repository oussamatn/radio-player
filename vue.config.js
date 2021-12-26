'use strict';
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
        plugins: [

        ]
    },
    productionSourceMap : false,
    transpileDependencies: ["axios","standardized-audio-context"]
};