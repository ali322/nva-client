import { ipcMain, app } from 'electron'
import globby from 'globby'
import { join, sep } from 'path'
import { checkPKG } from './pkg'
import { opendedWindow, openWindow, getWindow } from './window'
import { checkValid, generateProject } from './index'
import { GenerateProject } from '../interface'
import checkUpdate from './updater'

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

ipcMain.on('generate-project',async (evt: any, { name, path, repo, answers }: GenerateProject): Promise<void> => {
    const isCreated = await generateProject(name, path, repo, answers)
    evt.sender.send('project-generated', isCreated)
  }
)

ipcMain.on('check-update', (evt: any, msg: string): void => {
  if (process.env.NODE_ENV === 'production') {
    checkUpdate(msg).then((ret: any): void => {
      if (ret) {
        evt.sender.send('update-available', ret)
      }
    })
  }
})

ipcMain.on('restart', (): void => {
  app.relaunch()
  app.exit(0)
})
