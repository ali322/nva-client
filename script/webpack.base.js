const webpack = require('webpack')
const { urlLoaderOptions, cssLoaders , resolve } = require('./util')
const { distPath } = require('./constant')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  target: 'electron-renderer',
  mode: isProd ? 'production' : 'development',
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.css$/,
        use: cssLoaders(isProd)
      },
      {
        test: /\.less$/,
        use: cssLoaders(isProd, 'less')
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        exclude: /nva-favicon.ico/,
        loader: 'url-loader',
        options: urlLoaderOptions(isProd)
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: urlLoaderOptions(isProd)
      }
    ]
  },
  output: {
    path: distPath,
    filename: '[name]/[name].js'
  },
  resolve: {
    alias: {
      '@': resolve('renderer'),
    },
    extensions: ['*', '.ts', '.tsx', '.js', '.mjs']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
    })
  ]
}
