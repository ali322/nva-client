import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { remote } from 'electron'
import { ipcRenderer } from 'electron'
import { Toolbar, Progress } from '@/component'
import t from '@/locale'
import rootStore from './store'

const win: Electron.BrowserWindow = remote.getCurrentWindow()

@observer
export default class App extends React.Component<any, any>{
  @observable updateVisible: boolean = false
  @observable updating: boolean = false
  @observable updatePercent: number = 50
  @observable downloadSpeed: number = 0
  @observable updateVersion: string = ''
  locale: string = rootStore.locale
  componentDidMount() {
    const message = t(this.locale)
    ipcRenderer.on('update-available', (info: any) => {
      this.updateVersion = info.version
      let notify = new Notification(message.updateAvailable, {
        body: `${message.newVersionFound} v${info.version}`
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
    const message = t(this.locale)
    return (
      <div className="window updater-window text-center pt-24">
        <Toolbar></Toolbar>
        {this.updating ? (
          <div className="updater-info">
            <div className="pb-12 pt-32 px-32">
              <Progress value={this.updatePercent}/>
            </div>
            {this.updatePercent < 100 ? 
              <p className="m-0 py-12 text-md">{message.downloadingUpdates}( {this.downloadSpeed}kb/s )</p>
              : <p className="m-0 py-12 text-md">{message.downloadedRestart}</p>}
          </div>
        ) : (
          <div className="updater-info">
            <p className="m-0 py-20 text-md">{message.newVersionFound} v{this.updateVersion} {message.updateOrNot}</p>
            <div className="pt-8">
              <button className="btn btn-success mr-16" onClick={() => this.update()}>
                <span>{message.submit}</span>
              </button>
              <button className="btn btn-secondary" onClick={() =>win.close()}>
                <span>{message.cancel}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}
