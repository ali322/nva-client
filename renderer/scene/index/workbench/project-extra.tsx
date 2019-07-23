import * as React from 'react'
import { ipcRenderer } from 'electron'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Modal, Toast, Icon } from '@/component'
import { isEmpty } from '@/lib'
import t from '@/locale'

enum ModalType {
  addDep,
  upgradeDep,
  installDep,
  report
}

@inject((stores: any) => ({
  locale: stores.root.locale
}))
@observer
export default class ProjectExtra extends React.Component<any, any>{
  @observable modalVisible: boolean = false
  @observable modalType: ModalType = ModalType.addDep
  @observable upgradePKG: Array<any> = []
  @observable name: string = ''
  @observable version: string = ''
  toast!: any
  componentDidMount() {
    const { path } = this.props
    isEmpty('node_modules', path)
      .then((empty: boolean) => {
        if (empty) {
          this.modalType = ModalType.installDep
          this.modalVisible = true
        } else {
          ipcRenderer.send('check-pkgs', {
            path: path,
            ignoreCheck: false
          })
          ipcRenderer.on('pkg-upgrade-available', (_: any, msg: any) => {
            this.upgradePKG = msg
          })
        }
      })
      .catch((err: Error) => console.error(err))
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners('pkg-upgrade-available')
  }
  renderModal() {
    const { installPKG } = this.props
    if (this.modalType === ModalType.addDep) {
      return (
        <div className="py-24 w-100">
          <div className="input-wrapper mb-12 px-20" style={{width: "220px"}}>
            <input type="text" placeholder="请输入包名" className="input input--sm" onChange={(e: any) => {
              this.name = e.target.value
            }}/>
          </div>
          <div className="input-wrapper px-20 mb-20" style={{width: "220px"}}>
            <input type="text" placeholder="请输入版本号" className="input input--sm" onChange={(e: any) => {
              this.version = e.target.value
            }}/>
          </div>
          <div className="d-flex flex-row justify-content-center">
            <button className="btn btn-success px-12 mr-12" onClick={() => {
              installPKG([`${this.name}@${this.version}`])
              this.modalVisible = false
            }}>
              <span>确定</span>
            </button>
            <button className="btn btn-secondary px-12"
            onClick={() => this.modalVisible = false}>
              <span>取消</span>
            </button>
          </div>
        </div>
      )
    }
    if (this.modalType === ModalType.installDep) {
      return (
        <div className="py-24">
          <p className="text-center text-md">是否安装项目依赖包</p>
          <div className="d-flex flex-row justify-content-center">
            <button className="btn btn-success px-12 mr-12"
              onClick={() => {
                installPKG()
                this.modalVisible = false
              }}>
              <span>确定</span>
            </button>
            <button className="btn btn-secondary px-12"
              onClick={() => this.modalVisible = false}>
              <span>取消</span>
            </button>
          </div>
        </div>
      )
    }
    if (this.modalType === ModalType.upgradeDep) {
      return (
        <div className="py-24 px-16">
          {this.upgradePKG.map((pkg: any) => (
            <div className="d-flex flex-row align-items-center mb-12">
              <div className="upgrade-pkg-label flex-1">
                <span>{pkg.name}</span>
                <p className="mb-0 text-sm text-muted">{`新版本: ${pkg.latest} 当前版本: ${pkg.current}`}</p>
              </div>
              <button className="btn btn-sm btn-success mx-12" onClick={() => {
                installPKG([`${pkg.name}@${pkg.latest}`])
                this.modalVisible = false
              }}>
                <span>更新</span>
              </button>
            </div>
          ))}
        </div>
      )
    }
    return null
  }
  render() {
    const message = t(this.props.locale)
    return (
      <div className="project-extra-container">
        <div className="project-extra h-100 d-flex align-items-center pr-12">
          {this.upgradePKG.length > 0 ? (
            <button className="text-muted d-flex align-items-center outline-0 border-0 bg-transparent line-height-25 cursor-pointer" onClick={()=> {
              this.modalVisible = true
              this.modalType = ModalType.upgradeDep
            }}>
              <Icon type="git-pull-request"></Icon>
              <span className="pl-4 text-sm">{message.updateDep}</span>
            </button>
          ) : null}
          <button className="text-muted d-flex align-items-center outline-0 border-0 bg-transparent line-height-25 cursor-pointer" onClick={() => {
            this.modalVisible = true
            this.modalType = ModalType.installDep
          }}>
            <Icon type="git-compare"></Icon>
            <span className="pl-4 text-sm">{message.reinstallDep}</span>
          </button>
          <button className="text-muted d-flex align-items-center outline-0 border-0 bg-transparent line-height-25 cursor-pointer" onClick={() => {
            this.modalVisible = true
            this.modalType = ModalType.addDep
          }}>
            <Icon type="git-branch"></Icon>
            <span className="pl-4 text-sm">{message.addDep}</span>
          </button>
        </div>
        <Modal active={this.modalVisible} width={300} onClose={() => this.modalVisible = false}>
        {this.renderModal()}
        </Modal>
        <Toast ref={(ref: any) => this.toast = ref}></Toast>
      </div>
    )
  }
}
