module.exports = {
  presets: [
      ["@babel/env", {
          "modules": false
      }],
    '@vue/app'
  ],
    sourceType: 'unambiguous',
    plugins : [
        "@babel/transform-async-to-generator",
        //"@babel/transform-class-properties",
        //"@babel/transform-runtime",
        //"@babel/lodash"
    ],
  env: {
    production: {
      plugins: ["transform-remove-console" ]
    },
      development:{
          plugins: ["dynamic-import-node"]
      }
  }
}
