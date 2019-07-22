import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { remote } from 'electron'
import { ipcRenderer } from 'electron'
import { Toolbar, Progress } from '@/component'

const win: Electron.BrowserWindow = remote.getCurrentWindow()

@observer
export default class App extends React.Component<any, any>{
  @observable updateVisible: boolean = false
  @observable updating: boolean = false
  @observable updatePercent: number = 0
  @observable downloadSpeed: number = 0
  @observable updateVersion: string = ''
  componentDidMount() {
    ipcRenderer.on('update-available', (info: any) => {
      this.updateVersion = info.version
      let notify = new Notification('发现新版本', {
        body: `发现新版本 v${info.version}`
      })

      notify.onclick = () => {
        ipcRenderer.send('open-window', 'updater')
      }
    })

    ipcRenderer.on('download-progress', (_: any, ret: any) => {
      let percent = ret.percent || 0
      percent = percent > this.updatePercent ? percent : this.updatePercent
      // console.log('percent', percent)
      this.updatePercent = Math.floor(percent)
      this.downloadSpeed = Math.floor(ret.bytesPerSecond / 1024)
    })

    ipcRenderer.on('update-downloaded', () => {
      this.updating = false
      this.updatePercent = 0
      this.updateVersion = ''
      this.updateVisible = false
    })

    ipcRenderer.on('update-version', (_: any, ver: string) => {
      this.updateVersion = ver
    })
  }
  @action.bound
  update() {
    this.updating = true
    ipcRenderer.send('download-update')
  }
  render() {
    return (
      <div className="window updater-window text-center pt-24">
        <Toolbar></Toolbar>
        {this.updating ? (
          <div className="updater-info">
            <div className="pb-12 pt-32 px-32">
              <Progress value={this.updatePercent}/>
            </div>
            {this.updatePercent < 100 ? 
              <p className="m-0 py-12">正在下载更新...( {this.downloadSpeed}kb/s )</p>
              : <p className="m-0 py-12">下载完成应用重启中...</p>}
          </div>
        ) : (
          <div className="updater-info">
            <p className="m-0 py-20">检测到可用版本 v{this.updateVersion} 是否更新?</p>
            <div className="pt-8">
              <button className="btn btn-success mr-16" onClick={() => this.update()}>
                <span>确定</span>
              </button>
              <button className="btn btn-secondary" onClick={() =>win.close()}>
                <span>取消</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}
