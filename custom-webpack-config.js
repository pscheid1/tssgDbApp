const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        TSSGAPPURL: JSON.stringify(process.env.tssgAppURL || 'http://localhost'),
        TSSGAPP_PORT: JSON.stringify(process.env.tssgAppPort || '4200'),
        TSSGAPIURL: JSON.stringify(process.env.tssgApiURL || 'http://localhost'),
        TSSGAPIPORT: JSON.stringify(process.env.tssgApiPort || '7010')
      }
    })
  ]
}
