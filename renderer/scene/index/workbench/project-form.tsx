import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { observable, computed } from 'mobx'
import { ipcRenderer, remote } from 'electron'
import { join } from 'path'
import { autobind } from 'core-decorators'
import { Select } from '@/component'
import t from '@/locale'
import repos from '@/config/repo'

const win: any = remote.getCurrentWindow()

@inject((stores: any) => ({
  locale: stores.root.locale
}))
@observer
export default class ProjectForm extends React.Component<any, any>{
  @observable repos: any = repos
  @observable repo: string = ''
  @observable name: string = ''
  @observable version: string = ''
  @observable path: string = ''
  @observable downloading: boolean = false
  @computed get saved() {
    return this.path ? join(this.path, this.name) : ''
  }
  @computed get templates() {
    return Object.keys(this.repos(this.props.locale)).map((k: any) => ({
      label: k,
      value: this.repos[k]
    }))
  }
  @autobind
  select() {
    const message = t(this.props.locale)
    let workDir = remote.dialog.showOpenDialog(win, {
      title:  message.chooseWorkspace,
      properties: ['openDirectory', 'createDirectory']
    })
    if (workDir) {
      this.path = workDir[0]
    }
  }
  @autobind
  submit() {
    const { onCreate, onFail } = this.props
    if (this.downloading) return
    this.downloading = true
    ipcRenderer.send('generate-project', {
      name: this.name,
      repo: this.repo,
      path: this.path,
      answers: {
        ver: this.version
      }
    })
    ipcRenderer.on('project-generated', (_: any, isCreated: boolean): void => {
      this.downloading = false
      if (isCreated) {
        let project = {
          name: this.name,
          path: this.saved
        }
        onCreate(project)
      } else {
        onFail()
      }
    })
  }
  render() {
    const { onCancel, locale } = this.props
    const message = t(locale)
    return (
      <div className="h-100 d-flex flex-column pt-28 pb-12">
        <div className="header-border bg-white pb-12 d-flex">
          <div className="flex-1 text-center">
            <h1 className="text-xl">{message.initProject}</h1>
          </div>
        </div>
        <div className="flex-1 d-flex justify-content-start align-items-start p-20 pb-0">
          <form className="form form--label-right w-100">
            <div className="form-group d-flex">
              <label className="form-group__label">{message.template}</label>
              <div className="form-group__content">
                <Select data={this.templates} value={this.repo} placeholder={message.chooseTemplate}
                  onChange={(repo: any) => this.repo = repo}></Select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">{message.name}</label>
              <div className="form-group__content">
                <div className="input-wrapper">
                  <input type="text" className="input input--sm" 
                    placeholder={message.typeName} style={{width: '300px'}}
                    value={this.name} onChange={(evt: any) => this.name = evt.target.value}/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">{message.version}</label>
              <div className="form-group__content">
                <div className="input-wrapper">
                  <input type="text" className="input input--sm" 
                    placeholder={message.typeVersion} style={{width: '300px'}}
                    value={this.version} onChange={(evt: any) => this.version = evt.target.value}/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">{message.workspace}</label>
              <div className="form-group__content">
                <div className="input-group" style={{width: '300px'}}>
                  <div className="input-wrapper">
                    <input type="text" className="input input--sm" 
                      placeholder={message.chooseWorkspace} 
                      value={this.path} onChange={(evt: any) => this.path = evt.target.value}/>
                  </div>
                  <div className="input-group-addon p-0 border-0">
                    <button type="button" className="btn btn-no-hover btn-secondary border-left-0 bg-gray-lightest-5" onClick={this.select}>
                      <span className="text-md">{message.choose}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">{message.projectPath}</label>
              <div className="form-group__content">
                <div className="input-wrapper">
                  <input type="text" className="input input--sm" 
                    placeholder={message.workspaceAndName}
                    value={this.saved} readOnly style={{width: '300px'}}/>
                </div>
              </div>
            </div>
            <div className="text-center py-12">
              <button className="btn btn-success mr-12" type="button" disabled={this.downloading} onClick={this.submit}>
                <span className="px-20">{this.downloading ? `${message.initProject}...` : message.submit}</span>
              </button>
              <button className="btn btn-secondary" type="button" onClick={onCancel}>
                <span className="px-20">{message.cancel}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
