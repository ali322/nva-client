import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { observable, action } from 'mobx'
import { remote, ipcRenderer } from 'electron'
import { findIndex } from 'lodash'
import { autobind } from 'core-decorators'
import { Modal, Toast, Icon } from '@/component'
import t from '@/locale'
import Project from './project'
import ProjectDrawer from './project-drawer'
import ProjectForm from './project-form'

const win: Electron.BrowserWindow = remote.getCurrentWindow()

@inject((stores: any): Record<string, any> => {
  return {
    locale: stores.root.locale,
    histories: stores.root.histories,
    saveHistories: stores.root.saveHistories,
    addHistory: stores.root.addHistory,
    opened: stores.root.opened,
    saveOpened: stores.root.saveOpened
  }
})
@observer
export default class WorkBench extends React.Component<any, any> {
  @observable drawerActived: boolean = false
  @observable modalActived: boolean = false
  toast!: any

  componentDidMount() {
    const { histories, opened, saveOpened } = this.props
    if (histories.length > 0 && opened === null) {
      saveOpened(histories[0])
    }
  }

  @action.bound
  toggledDrawer() {
    this.drawerActived = !this.drawerActived
  }
  @autobind
  createProject(project: any) {
    const { addHistory, saveOpened, histories } = this.props
    const index = findIndex(histories, project)
    if (index < 0) {
      addHistory(project)
    }
    saveOpened(project)
    this.modalActived = false
    this.drawerActived = false
  }
  @autobind
  selectProject(path: string): any {
    const { addHistory, histories, saveOpened, locale } = this.props
    const message = t(locale)
    const isValid: any = ipcRenderer.sendSync('check-valid', path)
    if (!isValid) {
      this.toast.error(message.unsupportedProject)
      return
    }
    let project: any = { path, name: isValid.name }
    saveOpened(project)
    const index = findIndex(histories, project)
    if (index < 0) {
      addHistory(project)
    }
  }
  @autobind
  openProject() {
    let projPath = remote.dialog.showOpenDialog(win, {
      title: '选择工程目录',
      properties: ['openDirectory']
    })
    if (projPath) {
      this.selectProject(projPath[0])
    }
  }
  @autobind
  deleteHistory(i: number) {
    const { histories, saveHistories, saveOpened, opened } = this.props
    let next = histories.slice()
    next.splice(i, 1)
    if (histories[i].path === opened.path && histories[i].name === opened.name) {
      saveOpened(null)
      this.toggledDrawer()
    }
    saveHistories(next)
  }
  renderOperations() {
    const { histories, opened, locale } = this.props
    const message = t(locale)
    const buttons = (
      <div className={`flex-0 py-12 d-flex align-items-center justify-content-center ${opened ? '' : 'h-100'}`}>
        <button type="button"
          className={`btn btn-success mr-8 btn-normal`}
          onClick={() => this.modalActived = true}>
          <Icon type="add" size={16}></Icon>
          <span className="pl-4">{message.initProject}</span>
        </button>
        <button type="button"
          className={`btn btn-secondary btn-normal`}
          onClick={this.openProject}>
          <Icon type="folder-open" size={16}></Icon>
          <span className="pl-4">{message.openProject}</span>
        </button>
      </div>
    )
    if (opened === null) {
      return buttons
    }
    return (
      <ProjectDrawer active={this.drawerActived} histories={histories}
        selectProject={this.selectProject} opened={opened}
        toggleActive={this.toggledDrawer} deleteHistory={this.deleteHistory}>
        {buttons}
      </ProjectDrawer>
    )
  }
  renderProject() {
    const { opened, history } = this.props
    if (opened) {
      return (
        <Project path={opened.path} name={opened.name} history={history}
          toggleDrawer={this.toggledDrawer}></Project>
      )
    }
    return null
  }
  render() {
    const message = t(this.props.locale)
    return (
      <div className="h-100 border-box">
        {this.renderOperations()}
        {this.renderProject()}
        <Modal width={520} active={this.modalActived} onClose={() => this.modalActived = false}>
          <ProjectForm onCreate={this.createProject} onFail={() => this.toast.error(message.initProjectFailed)} onCancel={() => this.modalActived = false}></ProjectForm>
        </Modal>
        <Toast ref={(ref: any) => this.toast = ref}></Toast>
      </div>
    )
  }
}
