import { BrowserWindow, app } from 'electron'
import { join, posix } from 'path'
import { merge, find } from 'lodash'
import { format, URL } from 'url'
import attachUpdater from './updater'

export function opendedWindow(): string[] {
  let allWins = BrowserWindow.getAllWindows()
  let opened = allWins.map((win: Electron.BrowserWindow): string => {
    let url = new URL(win.webContents.getURL())
    return url.pathname.split(posix.sep).slice(-2, -1)[0]
  })
  return opened
}

export function getWindow(key: string): Electron.BrowserWindow | undefined {
  let allWins = BrowserWindow.getAllWindows()
  return find(allWins, (win: Electron.BrowserWindow): boolean => {
    let url = new URL(win.webContents.getURL())
    return url.pathname.split(posix.sep).slice(-2, -1)[0] === key
  })
}

function createWindow(
  path: string = join('index', 'index.html'),
  options: Record<string, any> = {}
): Electron.BrowserWindow {
  let defaults = {
    width: 1024,
    height: 768,
    // useContentSize: true,
    // webPreferences: {webSecurity: false},
    center: true,
    resizable: false,
    frame: false,
    show: false,
    autoHideMenuBar: true,
    transparent: false,
    hasShadow: true,
    backgroundColor: '#282A30',
    titleBarStyle: 'default'
  }
  let opts = merge(defaults, options)
  let win: any = new BrowserWindow(opts)
  if (process.env.NODE_ENV === 'development') {
    win.loadURL(`http://localhost:8080/renderer/scene/${path}`)
    win.webContents.openDevTools()
  } else {
    let url = format({
      pathname: join(__dirname, '..', '..', 'dist', 'renderer', path),
      protocol: 'file:',
      slashes: true
    })
    win.loadURL(url)
    // win.webContents.openDevTools()
  }
  win.once('ready-to-show', (): void => {
    win.show()
  })
  win.on('closed', (): void => {
    win = null
  })

  return win
}

const updaterWindow = ({
  version
}: Record<string, any>): Electron.BrowserWindow => {
  let win = createWindow('updater/index.html', {
    width: 300,
    height: 160,
    backgroundColor: '#282A30'
  })
  win.webContents.on('did-finish-load', (): void => {
    win.webContents.send('update-version', version)
  })
  return win
}

export function openWindow(
  key: string,
  query: Record<string, any> = {}
): Electron.BrowserWindow {
  if (key === 'updater') {
    return updaterWindow(query)
  } else {
    let win = createWindow()
    if (process.env.NODE_ENV === 'production') {
      let updater: any = attachUpdater(win)
      updater.checkForUpdates()
      app.on('before-quit', (): void => {
        updater.removeAllListeners()
        updater = null
      })
    }
    return win
  }
}
