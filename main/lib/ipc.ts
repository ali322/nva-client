import { ipcMain, app } from 'electron'
import { opendedWindow, openWindow, getWindow } from './window'
import { checkValid } from './index'
import checkUpdate from './updater'

ipcMain.on('open-window', (_: any, key: string, options: any): void => {
  if (opendedWindow().includes(key) === false) {
    openWindow(key, options)
  } else {
    let win = getWindow(key) as Electron.BrowserWindow
    win.focus()
  }
})

ipcMain.on('check-valid', (evt: any, val: any): void => {
  evt.returnValue = checkValid(val)
})

ipcMain.on('check-update', (evt: any, msg: string): void => {
  if (process.env.NODE_ENV === 'production') {
    checkUpdate(msg).then((ret: any): void => {
      if (ret) {
        evt.sender.send('update-available', ret)
      } else {
        evt.sender.send('update-not-available', msg)
      }
    })
  }
})

ipcMain.on('restart', (): void => {
  app.relaunch()
  app.exit(0)
})
