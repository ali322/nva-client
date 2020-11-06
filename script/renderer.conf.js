const { resolve } = require('./util')
const { ESBuildPlugin } = require('esbuild-loader')
const { distFolder } = require('./constant')

const vendorJS = [
  'react',
  'react-router-dom',
  'react-dom',
  'mobx',
  'mobx-react',
  'lodash'
]

const vendorCSS = [
  'xterm/css/xterm.css',
  'normalize.css/normalize.css',
  'ionicons/dist/css/ionicons.min.css'
]

const beforeHook = (conf) => {
  const rules = conf.module.rules.map((rule) => {
    if (rule.test.toString() === '/\\.(js|jsx)$/') {
      return {
        test: /\.(js|jsx)/
      }
    }
    if (rule.test.toString() === '/\\.(ts|tsx)$/') {
      return {
        test: /\.(ts|tsx)/,
        loader: 'esbuild-loader'
      }
    }
    return rule
  })
  return {
    target: 'electron-renderer',
    module: {
      exprContextCritical: false,
      rules
    },
    node: {
      __dirname: true,
      __filename: true
    },
    resolve: {
      alias: {
        '@': resolve('renderer')
      }
    },
    plugins: conf.plugins.concat([new ESBuildPlugin()])
  }
}

module.exports = {
  explicit: true,
  proj: {
    jsExt: '.tsx',
    cssExt: '.less',
    sourceFolder: 'renderer/scene',
    loaderOptions: {
      typescript: {
        transpileOnly: true,
        happyPackMode: true,
        configFile: 'tsconfig.json'
      }
    },
    distFolder,
    beforeBuild(conf) {
      return beforeHook(conf)
    },
    beforeDev(conf) {
      return beforeHook(conf)
    }
  },
  mods: {
    index: {
      vendor: {
        js: 'base',
        css: 'base'
      }
    }
  },
  vendors: {
    js: {
      base: vendorJS
    },
    css: {
      base: vendorCSS
    }
  }
}
