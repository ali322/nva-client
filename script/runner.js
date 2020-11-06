const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const taskFactory = require('nva-task')
const { spawn } = require('child_process')
const { logStats } = require('./util')

const rendererConfig = require('./renderer.conf')
const mainConfig = require('./main.conf')

let electronProcess = null
let manualRestart = false
let hotMiddleware
let watcher

function electronLog(data, color) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach((line) => {
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

function startRenderer () {
  return new Promise((resolve) => {
    rendererConfig.proj = Object.assign({}, rendererConfig.proj, {
      afterDev(err, stats) {
        console.log('renderer started')
        logStats('Renderer', stats)
        resolve()
      }
    })
    const tasks = taskFactory(rendererConfig)
    const options = { port: 8080, browser: 'none' }
    tasks.dev(options)
  })
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
  return new Promise((resolve) => {
    mainConfig.proj = Object.assign({}, mainConfig.proj, {
      isDev: true,
      afterDev(err, stats) {
        logStats('Main', stats)
        resolve()
        onChange()
      }
    })
    const tasks = taskFactory(mainConfig)
    tasks.devLibrary()
  })
}

function startElectron() {
  electronProcess = spawn(electron, [
    'main/index-dev.js',
    '--inspect=5858',
    '.'
  ])

  electronProcess.stdout.on('data', (data) => {
    electronLog(data, 'blue')
  })
  electronProcess.stderr.on('data', (data) => {
    electronLog(data, 'red')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
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
