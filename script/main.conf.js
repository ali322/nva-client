const { resolve } = require('./util')
const { entryOfMain, distPathOfMain } = require('./constant')

const isProd = process.env.NODE_ENV === 'production'

const beforeHook = (conf) => {
  const rules = conf.module.rules.map((rule) => {
    if (rule.test.toString() === '/\\.(js|jsx)$/') {
      return {
        test: /\.(js|jsx)/
      }
    }
    return rule
  })
  return {
    target: 'electron-main',
    entry: entryOfMain,
    // stats: 'errors-only',
    devtool: 'source-map',
    module: {
      exprContextCritical: false,
      rules
    },
    resolve: {
      alias: {
        '@': resolve('renderer')
      }
    },
    output: {
      path: distPathOfMain,
      filename: 'index.js'
    },
    node: {
      __dirname: false,
      __filename: false
    }
  }
}

module.exports = {
  explicit: true,
  proj: {
    loaderOptions: {
      typescript: {
        transpileOnly: true,
        happyPackMode: true,
        configFile: 'tsconfig.json'
      }
    },
    distFolder: 'dist/main',
    beforeBuild(conf) {
      return beforeHook(conf)
    },
    beforeDev(conf) {
      return beforeHook(conf)
    }
  }
}

