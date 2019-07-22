process.stdout.isTTY = true

const chalk = require('chalk')
const context = require('./context')

const argv = require('yargs').argv
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
  proj: {
    distFolder: output,
    sourceFolder: source
  }
}))
console.log(chalk.yellow('开始启动开发服务...'))
tasks.dev({ protocol, hostname, port, browser, profile })
