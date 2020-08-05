process.stdout.isTTY = true

const chalk = require('chalk')
const { join } = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
let argv = require('yargs').argv
const locale = argv.locale || 'en'
let path = argv.path
let pkgs = argv.pkg
let registry = argv.registry

const { installPKG, defaultPKG } = require('./lib')

console.log(`${locale === 'cn' ? '使用npm镜像' : 'using npm registry'} ${chalk.yellow(registry)}`)
if (pkgs) {
  console.log(chalk.yellow(`${locale === 'cn' ? '正在安装依赖包' : 'installing dependencies'} ${pkgs}, ${locale === 'cn' ? '请耐心等待' : 'please wait'}`))
  pkgs = pkgs.split(',').map(v => {
    let pkg = v.split('@')
    return {
      name: pkg[0],
      version: pkg[1]
    }
  })
} else {
  pkgs = defaultPKG(path)
  const nodeModules = join(path, 'node_modules')
  const packageLock = join(path, 'package-lock.json')
  if (fs.existsSync(nodeModules)) {
    console.log(chalk.yellow(`${locale === 'cn' ? '正在删除 node_moduls 目录' : 'deleting node_modules directory'}\n`))
    rimraf.sync(nodeModules)
  }
  if (fs.existsSync(packageLock)) {
    console.log(chalk.yellow(`${locale === 'cn' ? '正在删除 package-lock.json 文件' : 'deleting package-lock.json file'}`))
    rimraf.sync(packageLock)
  }
  console.log(chalk.yellow(locale === 'cn' ? `正在安装依赖包, 请耐心等待` : 'installing dependencies, please wait'))
}
installPKG(pkgs, path, registry, locale)
