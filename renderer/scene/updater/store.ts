import { observable } from 'mobx'
import { SyncTrunk } from 'mobx-sync'

class RootStore {
  @observable locale: string = 'en'
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
