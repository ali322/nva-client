const taskFactory = require('nva-task')
const rendererConfig = require('./renderer.conf')
const mainConfig = require('./main.conf')
const { logStats } = require('./util')

function startRenderer() {
  return new Promise((resolve) => {
    rendererConfig.proj = Object.assign({}, rendererConfig.proj, {
      afterBuild(err, stats) {
        logStats('Renderer', stats)
        resolve()
      }
    })
    const tasks = taskFactory(rendererConfig)
    tasks.build({ profile: false})
  })
}

function startMain() {
  return new Promise((resolve) => {
    mainConfig.proj = Object.assign({}, mainConfig.proj, {
      isDev: false,
      afterBuild(err, stats) {
        logStats('Main', stats)
        resolve()
      }
    })
    const tasks = taskFactory(mainConfig)
    tasks.buildLibrary()
  })
}

function build() {
  Promise.all([startMain(), startRenderer()]).then(() => {
    console.log('Build success')
  }).catch((err) => {
    console.error(err)
  })
}

build()