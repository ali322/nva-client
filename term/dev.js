process.stdout.isTTY = true

const chalk = require('chalk')
const context = require('./context')

const argv = require('yargs').argv
const locale = argv.locale || 'en'
const path = argv.path
const port = argv.port
const protocol = argv.protocol || 'http'
const hostname = argv.hostname || 'localhost'
const browser = argv.browser || 'default'
const profile = argv.profile || false
const output = argv.output
const source = argv.source

process.chdir(path)
let tasks = require('nva-task')(context({
  locale,
  proj: {
    distFolder: output,
    sourceFolder: source
  }
}))
console.log(chalk.yellow(locale === 'cn' ? '开始启动开发服务...' : 'start launch development service'))
tasks.dev({ protocol, hostname, port, browser, profile })
