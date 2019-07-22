import { BrowserWindow } from 'electron'

export default (app: Electron.App): Record<string, any>[] => {
  let menus: any[] = [
    {
      role: 'window',
      label: '窗口',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '重做',
          accelerator: 'CmdOrCtrl+Z',
          selector: 'undo:'
        },
        {
          label: '撤销',
          accelerator: 'Shift+CmdOrCtrl+Z',
          selector: 'redo:'
        },
        { type: 'separator' },
        {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:'
        },
        {
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:'
        },
        {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:'
        },
        {
          label: '选择全部',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }
      ]
    },
    {
      role: 'help',
      label: '帮助',
      submenu: [
        {
          label: '打开开发者工具',
          click(): void {
            let win = BrowserWindow.getFocusedWindow()
            win.webContents.openDevTools()
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    menus = [
      {
        label: app.getName(),
        submenu: [
          { role: 'about', label: '关于' },
          { type: 'separator' },
          { role: 'services', label: '服务' },
          { type: 'separator' },
          { role: 'quit', label: '退出' }
        ]
      }
    ].concat(menus)
  }

  return menus
}
