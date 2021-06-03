const chalk = require('chalk')
const co = require('co')
const npminstall = require('npminstall')
const { readJsonSync } = require('fs-extra')
const { map } = require('lodash')
const { join } = require('path')

exports.installPKG = (pkgs = [], path, registry, locale) => {
  if (pkgs.length > 0) {
    co(function * () {
      yield npminstall({
        root: path,
        pkgs: pkgs,
        registry: registry,
        ignoreScripts: true,
        cacheDir: null,
        detail: true,
        timeout: 10 * 60000,
        streamingTimeout: 10 * 120000
      })
    })
      .then(() => {
        console.log(chalk.green(`\n${locale === 'cn' ? '依赖包安装完成' : 'all dependencies installed'}`))
      })
      .catch(err => {
        console.log(err)
        process.exit(1)
      })
  }
}

exports.defaultPKG = path => {
  let pkgJSON = readJsonSync(join(path, 'package.json'))
  let pkgs = []
  pkgs = pkgs.concat(
    map(pkgJSON.dependencies, (v, k) => {
      return { name: k, version: v }
    })
  )
  pkgs = pkgs.concat(
    map(pkgJSON.devDependencies, (v, k) => {
      return { name: k, version: v }
    })
  )
  return pkgs
}
