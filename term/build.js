process.stdout.isTTY = true

const chalk = require('chalk')
let context = require('./context')

let argv = require('yargs').argv
let path = argv.path
let profile = argv.profile || false
let output = argv.output
let source = argv.source

process.chdir(path)
let tasks = require('nva-task')(context({
  proj: {
    distFolder: output,
    sourceFolder: source
  }
}))
console.log(chalk.yellow('开始打包项目, 请耐心等待...'))
tasks.build({ profile })
