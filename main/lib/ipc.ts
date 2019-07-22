import { ipcMain, app } from 'electron'
import globby from 'globby'
import { join, sep } from 'path'
import { checkPKG } from './pkg'
import { opendedWindow, openWindow, getWindow } from './window'
import { checkValid, generateProject } from './index'
import { GenerateProject } from '../interface'
import attachUpdater from './updater'

ipcMain.on('check-pkgs', async (evt: any, msg: any): Promise<void> => {
  if (msg.ignoreCheck) return
  const matched = await globby(
    '+(vue|react)/package.json',
    { cwd: join(msg.path, 'node_modules') }
  )
  let pkgs = matched.map((v: string): string => v.split(sep)[0])
  let ret = await checkPKG(msg.path, pkgs)
  evt.sender.send('pkg-upgrade-available', ret)
})

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

ipcMain.on(
  'generate-project',
  (_: any, { name, path, repo, answers }: GenerateProject): void => {
    generateProject(name, path, repo, answers)
  }
)

ipcMain.on('check-update', (): void => {
  let win: any = getWindow('index')
  if (process.env.NODE_ENV === 'production') {
    let updater = attachUpdater(win)
    updater.checkForUpdates()
  }
})

ipcMain.on('restart', (): void => {
  app.relaunch()
  app.exit(0)
})
