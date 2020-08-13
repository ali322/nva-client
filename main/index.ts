import { app, Menu } from 'electron'
import { openWindow } from './lib/window'
import attachMenu from './lib/menu'
import './lib/ipc'

let win: Electron.BrowserWindow | null = null

app.on('ready', (): void => {
  let menus = attachMenu(app)
  const menu = Menu.buildFromTemplate(menus)
  Menu.setApplicationMenu(menu)
  win = openWindow('index')
})

app.on('window-all-closed', (): void => {
  app.quit()
})

app.on('activate', (): void => {
  if (win === null) {
    win = openWindow('index')
  }
})
