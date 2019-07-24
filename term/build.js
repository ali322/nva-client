process.stdout.isTTY = true

const chalk = require('chalk')
let context = require('./context')

let argv = require('yargs').argv
const locale = argv.locale || 'en'
let path = argv.path
let profile = argv.profile || false
let output = argv.output
let source = argv.source

process.chdir(path)
let tasks = require('nva-task')(context({
  locale,
  proj: {
    distFolder: output,
    sourceFolder: source
  }
}))
console.log(chalk.yellow(locale === 'cn' ? '开始打包项目, 请耐心等待...' : 'start release project, please wait...'))
tasks.build({ profile })
