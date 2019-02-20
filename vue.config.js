module.exports = {
  outputDir:'docs',
  // assetsDir: '',
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
  }
}