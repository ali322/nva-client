import * as React from 'react'
import { ipcRenderer } from 'electron'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Modal, Toast, Icon, Select } from '@/component'
import { isEmpty } from '@/lib'
import { saveDeps } from '@/lib/project'
import t from '@/locale'
import { checkUpdate } from '@/lib/pkg'

enum ModalType {
  addDep,
  runCMD,
  upgradeDep,
  installDep,
  report
}

const pkgTypes = [
  { label: 'production', value: 'prod' },
  { label: 'development', value: 'dev' }
]

@inject((stores: any) => ({
  locale: stores.root.locale
}))
@observer
export default class ProjectExtra extends React.Component<any, any> {
  @observable modalVisible: boolean = false
  @observable modalType: ModalType = ModalType.addDep
  @observable upgradePKG: any[] = []
  @observable name: string = ''
  @observable version: string = ''
  @observable pkgType: string = pkgTypes[0].value
  @observable cmd: string = ''
  toast!: any
  componentDidMount() {
    const { path } = this.props
    this.checkEmpty(path)
  }
  componentWillReceiveProps(nextProps: any) {
    if (nextProps.path !== this.props.path) {
      this.checkEmpty(nextProps.path)
    }
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners('pkg-upgrade-available')
  }
  checkEmpty(path: string) {
    const { userSettings } = this.props
    isEmpty('node_modules', path)
      .then((empty: boolean) => {
        if (empty) {
          this.modalType = ModalType.installDep
          this.modalVisible = true
        } else {
          if (userSettings.upgradeCheck) {
            checkUpdate(path, userSettings.npmRegistry).then((ret: any) => {
              this.upgradePKG = ret
            })
          }
        }
      })
      .catch((err: Error) => console.error(err))
  }
  renderModal() {
    const { installPKG, locale, path, runCMD } = this.props
    const message = t(locale)
    if (this.modalType === ModalType.addDep) {
      return (
        <div className="py-24 w-100">
          <div className="input-wrapper mb-12 px-20" style={{ width: '220px' }}>
            <input type="text" placeholder={message.typePackage} className="input input--sm" onChange={(e: any) => {
              this.name = e.target.value
            }}/>
          </div>
          <div className="input-wrapper px-20 mb-20" style={{ width: '220px' }}>
            <input type="text" placeholder={message.typeVersion} className="input input--sm" onChange={(e: any) => {
              this.version = e.target.value
            }}/>
          </div>
          <div className="input-wrapper px-20 mb-20">
            <Select data={pkgTypes} placeholder={message.selectType} width={100}
              onChange={(val: any) => {
                console.log('val', val)
                this.pkgType = val
              }} value={this.pkgType}></Select>
          </div>
          <div className="d-flex flex-row justify-content-center">
            <button className="btn btn-success px-12 mr-12" onClick={() => {
              installPKG([`${this.name}@${this.version}`])
              saveDeps(path, { [this.name]: this.version }, this.pkgType === 'dev')
              this.modalVisible = false
            }}>
              <span>{message.submit}</span>
            </button>
            <button className="btn btn-secondary px-12"
              onClick={() => this.modalVisible = false}>
              <span>{message.cancel}</span>
            </button>
          </div>
        </div>
      )
    }
    if (this.modalType === ModalType.runCMD) {
      return (
        <div className="py-24">
          <div className="input-wrapper mb-12 px-20">
            <input type="text" placeholder={message.typeCMD} className="input" onChange={(e: any) => {
              this.cmd = e.target.value
            }} />
          </div>
          <div className="d-flex flex-row justify-content-center">
            <button className="btn btn-success px-12 mr-12"
              onClick={() => {
                runCMD(this.cmd)
                this.modalVisible = false
              }}>
              <span>{message.submit}</span>
            </button>
            <button className="btn btn-secondary px-12"
              onClick={() => this.modalVisible = false}>
              <span>{message.cancel}</span>
            </button>
          </div>
        </div>
      )
    }
    if (this.modalType === ModalType.installDep) {
      return (
        <div className="py-24">
          <p className="text-center text-md">{message.installDepsNow}</p>
          <div className="d-flex flex-row justify-content-center">
            <button className="btn btn-success px-12 mr-12"
              onClick={() => {
                installPKG()
                this.modalVisible = false
              }}>
              <span>{message.submit}</span>
            </button>
            <button className="btn btn-secondary px-12"
              onClick={() => this.modalVisible = false}>
              <span>{message.cancel}</span>
            </button>
          </div>
        </div>
      )
    }
    if (this.modalType === ModalType.upgradeDep) {
      return (
        <div className="py-24 px-16">
          {this.upgradePKG.map((pkg: any, i: number) => (
            <div className="d-flex flex-row align-items-center mb-12" key={i}>
              <div className="upgrade-pkg-label flex-1">
                <span>{pkg.name}</span>
                <p className="mb-0 text-sm text-muted">{`${message.latestVersion}: ${pkg.latest}`}</p>
              </div>
              <button className="btn btn-sm btn-success mx-12" onClick={() => {
                installPKG([`${pkg.name}@${pkg.latest}`])
                this.modalVisible = false
              }}>
                <span>{message.update}</span>
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
    const { running } = this.props
    return (
      <div className="project-extra-container">
        <div className="project-extra h-100 d-flex align-items-center pr-12">
          {this.upgradePKG.length > 0 && !running ? (
            <button className="text-muted d-flex align-items-center outline-0 border-0 bg-transparent line-height-25 cursor-pointer" onClick={() => {
              this.modalVisible = true
              this.modalType = ModalType.upgradeDep
            }}>
              <Icon type="download"></Icon>
              <span className="pl-4 text-sm">{message.updateDep}</span>
            </button>
          ) : null}
          {!running && <button className="text-muted d-flex align-items-center outline-0 border-0 bg-transparent line-height-25 cursor-pointer" onClick={() => {
            this.modalVisible = true
            this.modalType = ModalType.installDep
          }}>
            <Icon type="sync"></Icon>
            <span className="pl-4 text-sm">{message.installDep}</span>
          </button>}
          {!running && <button className="text-muted d-flex align-items-center outline-0 border-0 bg-transparent line-height-25 cursor-pointer" onClick={() => {
            this.modalVisible = true
            this.modalType = ModalType.addDep
          }}>
            <Icon type="add"></Icon>
            <span className="pl-4 text-sm">{message.addDep}</span>
          </button>}
          {!running && (
            <button disabled={running} className="text-muted d-flex align-items-center border-0 bg-transparent line-height-25 cursor-pointer" onClick={() => {
              this.modalVisible = true
              this.modalType = ModalType.runCMD
            }}>
              <Icon type="paper-plane"></Icon>
              <span className="pl-4 text-sm">{message.runCMD}</span>
            </button>
          )}
        </div>
        <Modal active={this.modalVisible} width={300} onClose={() => this.modalVisible = false}>
          {this.renderModal()}
        </Modal>
        <Toast ref={(ref: any) => this.toast = ref}></Toast>
      </div>
    )
  }
}
