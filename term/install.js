process.stdout.isTTY = true

const chalk = require('chalk')
let argv = require('yargs').argv
let path = argv.path
let pkgs = argv.pkg
let registry = argv.registry

const { installPKG, defaultPKG } = require('./lib')

console.log(`使用npm镜像 ${chalk.yellow(registry)}`)
if (pkgs) {
  console.log(chalk.yellow(`正在安装依赖包 ${pkgs}, 请耐心等待`))
  pkgs = pkgs.split(',').map(v => {
    let pkg = v.split('@')
    return {
      name: pkg[0],
      version: pkg[1]
    }
  })
} else {
  pkgs = defaultPKG(path)
  console.log(chalk.yellow(`正在安装依赖包, 请耐心等待`))
}
installPKG(pkgs, path, registry)
