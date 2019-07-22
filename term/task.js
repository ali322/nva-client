process.stdout.isTTY = true

let argv = require('yargs').argv
const chalk = require('chalk')
const fs = require('fs')
const { join } = require('path')
const context = require('./context')()
let name = argv.name
let path = argv.path
let port = argv.port
let output = argv.output

process.chdir(path)

if (name === 'preview') {
  if (fs.existsSync(join(path, output))) {
    let server = require('nva-server')({
      content: output,
      rewrites: true,
      mock: './.nva/mock/*.@(js|json)'
    })
    server.listen(port, () => {
      let url = `http://localhost:${port}`
      console.log(chalk.yellow('预览服务已启动'))
      const { openBrowser } = require('nva-task/lib/common')
      openBrowser('default', url, context.logText.openBrowserFailed)
    })
  } else {
    console.log(chalk.red(`${output} 目录不存在, 请先完成打包`))
  }
}
