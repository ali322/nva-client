import { observable, action } from 'mobx'
import { SyncTrunk, ignore } from 'mobx-sync'

interface Project {
  [prop: string]: any
}

class ProjectStore {
  @ignore
  @observable
  currentRunning: string = ''

  @ignore
  @observable
  percentage: number = 0

  @ignore
  @observable
  running: boolean = false

  @ignore
  @observable
  finished: boolean = false

  @ignore
  @observable
  ready: boolean = true

  @action.bound
  saveState(key: string, val: any): void {
    (this as Project)[key] = val
  }
}

class RootStore {
  @observable histories: any[] = []

  @observable opened: any = null
  @observable.ref settings: Record<string, any> = {
    npmRegistry: 'https://registry.npmjs.org/',
    output: 'dist',
    source: 'src',
    devPort: 3000,
    previewPort: 3000,
    upgradeCheck: false,
    strict: true,
    profile: false
  }
  project: ProjectStore
  constructor() {
    this.project = new ProjectStore()
  }
  @action.bound
  addHistory(payload: any): void {
    this.histories = [payload].concat(this.histories)
  }
  @action.bound
  saveHistories(payload: any[]): void {
    this.histories = payload
  }
  @action.bound
  saveOpened(payload: any): void {
    this.opened = payload
  }
  @action.bound
  saveSettings(payload: any): void {
    this.settings = payload
  }
}

const rootStore = new RootStore()

const trunk = new SyncTrunk(rootStore, {
  storage: window.localStorage,
  onError(err: any): void {
    console.log('err', err)
  }
})

trunk.init()

export default rootStore
