const webpack = require('webpack')
const merge = require('webpack-merge')
const InjectHtmlPlugin = require('inject-html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const TidyStatsPlugin = require('tidy-stats-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const base = require('./webpack.base')
const entry = require('./entry')
const {
  scenePath,
  distPath,
  vendorPath,
  vendorURLOfProd
} = require('./constant')
const { urlLoaderOptions } = require('./util')
const { basename, join, posix } = require('path')

module.exports = merge(base, {
  entry,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  devtool: false,
  stats: 'errors-only',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new MiniCSSExtractPlugin({
      filename: '[name]/[name].css'
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: join(vendorPath, 'main-manifest.json')
    }),
    new TidyStatsPlugin({
      identifier: 'renderer'
    })
    // new BundleAnalyzerPlugin()
  ].concat(
    Object.keys(entry).map(
      k =>
        new InjectHtmlPlugin({
          transducer: file => basename(file),
          chunks: [k],
          output: join(distPath, k, 'index.html'),
          filename: join(scenePath, k, 'index.html'),
          more: {
            js: [posix.join(vendorURLOfProd, 'main-vendor.js')],
            css: [posix.join(vendorURLOfProd, 'main-vendor.css')]
          }
        })
    )
  )
})
