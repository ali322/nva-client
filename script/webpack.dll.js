const webpack = require('webpack')
const merge = require('webpack-merge')
const ChunkAssetPlugin = require('chunk-asset-webpack-plugin')
const TidyStatsPlugin = require('tidy-stats-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const { join, extname } = require('path')
const { resolve } = require('./util')
const base = require('./webpack.base')
const { distPath, vendorPath } = require('./constant')

const vendorJS = [
  'react',
  'react-router-dom',
  'react-dom',
  'mobx',
  'mobx-react',
  'lodash'
]

const vendorCSS = [
  'xterm/dist/xterm.css',
  'normalize.css/normalize.css',
  'ionicons/dist/css/ionicons.min.css'
]

const vendorJSConf = {
  name: 'js',
  mode: 'production',
  entry: vendorJS,
  output: {
    path: vendorPath,
    filename: '[name]-vendor.js',
    library: '[name]_[hash]'
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: join(vendorPath, '[name]-manifest.json'),
      context: __dirname
    }),
    new TidyStatsPlugin({
      identifier: 'vendor:js'
    })
  ]
}

const vendorCSSConf = merge(base, {
  name: 'css',
  mode: 'production',
  entry: vendorCSS,
  output: {
    path: distPath
  },
  stats: 'minimal',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new MiniCSSExtractPlugin({
      filename: 'vendor/[name]-vendor.css'
    }),
    new ChunkAssetPlugin({
      chunks: {
        main: files => files.filter(v => extname(v) !== '.js')
      }
    }),
    new TidyStatsPlugin({
      identifier: 'vendor:css'
    })
  ]
})

module.exports = [vendorJSConf, vendorCSSConf]
