const { join } = require('path')
const chalk = require('chalk')

exports.resolve = (...dir) => join(__dirname, '..', ...dir)

exports.logStats = (proc, data) => {
  let log = ''

  log += chalk.yellow.bold(
    `┏ ${proc} Process ${new Array(19 - proc.length + 1).join('-')}`
  )
  log += '\n\n'

  if (typeof data === 'object') {
    data
      .toString({
        colors: true,
        chunks: false,
        modules: false
      })
      .split(/\r?\n/)
      .forEach((line) => {
        log += '  ' + line + '\n'
      })
  } else {
    log += `  ${data}\n`
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

  console.log(log)
}