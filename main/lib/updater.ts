import { ipcMain, dialog } from 'electron'
import { AppUpdater } from 'electron-updater'
import { updater } from './adapter.js'
import { getWindow } from './window'
// const logger = require('electron-log')

const autoUpdater = updater({
  type: 'github',
  options: {
    username: 'ali322',
    repo: 'nva-client',
    log: true
  }
})

autoUpdater.autoDownload = false
// autoUpdater.autoInstallOnAppQuit =
// logger.transports.file.level = 'info'
// autoUpdater.logger = logger

// autoUpdater.updateConfigPath = require('path').join(
//   __dirname,
//   '..',
//   '..',
//   'dev-app-update.yml'
// )

export default (win: Electron.BrowserWindow): AppUpdater => {
  autoUpdater.once('checking-for-update', (): void => {
    if (win.isDestroyed() === false) {
      win.webContents.send('checking-for-update')
    }
  })

  autoUpdater.once('update-available', (info: any): void => {
    // dialog.showErrorBox('update-available', feedURL ? feedURL.toString() : 'none')
    if (win) {
      win.webContents.send('update-available', info)
    }
  })

  autoUpdater.once('update-not-available', (info: any): void => {
    // dialog.showErrorBox('update-not-available', '')
    if (win) {
      win.webContents.send('update-not-available', info)
    }
  })

  autoUpdater.on('error', (err: Error): void => {
    dialog.showErrorBox('err', err.message)
    if (win) {
      win.webContents.send('updater-error', err)
    }
  })

  autoUpdater.on('download-progress', (info: any): void => {
    let win = getWindow('updater') as Electron.BrowserWindow
    win.webContents.send('download-progress', info)
  })

  autoUpdater.once('update-downloaded', (): void => {
    try {
      autoUpdater.quitAndInstall(true, true)
    } catch (err) {
      console.error(err)
      dialog.showErrorBox('error', JSON.stringify(err))
    }
  })

  ipcMain.on('download-update', (): void => {
    autoUpdater
      .downloadUpdate()
      .then((): void => {
        console.log('wait for post download operation')
      })
      .catch((err: any): void => {
        dialog.showErrorBox('error', JSON.stringify(err))
      })
  })

  return autoUpdater
}
