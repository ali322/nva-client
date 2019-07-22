const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const { scenePath, publicPath } = require('./constant')

const rendererConfig = require('./webpack.dev')
const mainConfig = require('./webpack.main')

let electronProcess = null
let manualRestart = false
let hotMiddleware
let watcher

function logStats (proc, data) {
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
      .forEach(line => {
        log += '  ' + line + '\n'
      })
  } else {
    log += `  ${data}\n`
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

  console.log(log)
}

function startRenderer () {
  return new Promise((resolve, reject) => {
    const compiler = webpack(rendererConfig)
    compiler.hooks.done.tap('dev.runner', stats => {
      logStats('Renderer', stats)
    })
    const app = express()
    app.use(express.static('.', {
      dotfiles: 'deny'
    }))
    const devMiddleware = webpackDevMiddleware(compiler, {
      publicPath,
      logLevel: 'silent'
    })
    devMiddleware.waitUntilValid(() => {
      resolve()
    })
    app.use(devMiddleware)
    app.use(webpackHotMiddleware(compiler, {
      log: false
    }))

    app.listen(8080)
  })
}

function startElectron () {
  electronProcess = spawn(electron, ['main/index-dev.js', '--inspect=5858', '.'])

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}

function electronLog (data, color) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    log += `  ${line}\n`
  })
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('┏ Electron -------------------') +
        '\n\n' +
        log +
        chalk[color].bold('┗ ----------------------------') +
        '\n'
    )
  }
}

function startMain() {
  const onChange = () => {
    if (electronProcess && electronProcess.kill) {
      manualRestart = true
      process.kill(electronProcess.pid)
      electronProcess = null
      startElectron()

      setTimeout(() => {
        manualRestart = false
      }, 5000)
    }
  }
  return new Promise((resolve, reject) => {
    const compiler = webpack(mainConfig)
    compiler.watch({
      aggregateTimeout: 300
    }, (err, stats) => {
      logStats('Main', stats)
      resolve()
      onChange()
    })
  })
}

function start () {
  Promise.all([startMain(), startRenderer()]).then(() => {
    startElectron()
  }).catch(err => {
    console.error(err)
  })
}

start()
