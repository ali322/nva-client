const chalk = require('chalk')

let baseConf = {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
      'vue-router': 'vue-router/dist/vue-router.esm.js'
    }
  }
}
let hooks = {
  beforeDev () {
    return baseConf
  },
  beforeBuild () {
    return baseConf
  },
  beforeVendor (config) {
    return config.map(function (v) {
      return v.name === 'js' ? baseConf : null
    })
  },
  afterBuild() {
    console.log(chalk.yellow('项目打包完成'))
  }
}

module.exports = hooks
