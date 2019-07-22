const merge = require('webpack-merge')
const webpack = require('webpack')
const base = require('./webpack.base')
const mapValues = require('lodash/mapValues')
const TidyStatsPlugin = require('tidy-stats-webpack-plugin')
const InjectHtmlPlugin = require('inject-html-webpack-plugin')
const { join, posix } = require('path')
const entry = require('./entry')
const {
  scenePath,
  distPath,
  vendorPath,
  publicPath,
  vendorURL
} = require('./constant')

module.exports = merge(base, {
  entry: mapValues(entry, v =>
    [
      'webpack-hot-middleware/client?&reload=true',
      'react-hot-loader/patch'
    ].concat(v)
  ),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'react-hot-loader/webpack',
          // 'babel-loader',
          'ts-loader'
        ]
      }
    ]
  },
  output: {
    publicPath
  },
  devtool: '#source-map',
  stats: 'errors-only',
  node: {
    __dirname: true,
    __filename: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new TidyStatsPlugin({ ignoreAssets: true }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: join(vendorPath, 'main-manifest.json')
    })
  ].concat(
    Object.keys(entry).map(
      k =>
        new InjectHtmlPlugin({
          transducer: '/hmr/',
          chunks: [k],
          filename: join(scenePath, k, 'index.html'),
          more: {
            js: [posix.join(vendorURL, 'main-vendor.js')],
            css: [posix.join(vendorURL, 'main-vendor.css')]
          }
        })
    )
  )
})
