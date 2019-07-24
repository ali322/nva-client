process.stdout.isTTY = true

const chalk = require('chalk')
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
  console.log(chalk.yellow(locale === 'cn' ? `正在安装依赖包, 请耐心等待` : 'installing dependencies, please wait'))
}
installPKG(pkgs, path, registry, locale)
