import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { observable, computed } from 'mobx'
import { remote } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'
import rimraf from 'rimraf'
import { valid } from 'semver'
import { autobind } from 'core-decorators'
import { Select, Progress, Toast, Confirm } from '@/component'
import t from '@/locale'
import getTemplates from '@/config/template'
import { generateProject } from '@/lib/project'

const win: any = remote.getCurrentWindow()

@inject((stores: any): any => ({
  locale: stores.root.locale
}))
@observer
export default class ProjectForm extends React.Component<any, any> {
  @observable template: string = ''
  @observable name: string = ''
  @observable version: string = ''
  @observable path: string = ''
  @observable downloading: boolean = false
  @observable percent: number = 0
  toast!: any
  confirm!: any
  @computed get saved(): string {
    return this.path ? join(this.path, this.name) : ''
  }
  @computed get templates(): any {
    const repos = getTemplates(this.props.locale)
    return Object.keys(repos).map((k: any): any => ({
      label: k,
      value: repos[k]
    }))
  }
  @autobind
  async select() {
    const message = t(this.props.locale)
    let ret = await remote.dialog.showOpenDialog(win, {
      title: message.chooseWorkspace,
      properties: ['openDirectory', 'createDirectory']
    })
    if (ret.filePaths) {
      this.path = ret.filePaths[0]
    }
  }
  @autobind
  async submit() {
    const { onCreate, onFail, locale } = this.props
    const message = t(locale)
    if (this.name === '') {
      this.toast.error(`${message.name} ${message.canNotBeEmpty}`)
      return
    }
    if (this.template === '') {
      this.toast.error(`${message.template} ${message.canNotBeEmpty}`)
      return
    }
    if (this.version === '') {
      this.toast.error(`${message.version} ${message.canNotBeEmpty}`)
      return
    }
    if (valid(this.version) === null) {
      this.toast.error(`${message.version} ${message.isInvalid}`)
      return
    }
    if (this.path === '') {
      this.toast.error(`${message.workspace} ${message.canNotBeEmpty}`)
      return
    }
    const next = async () => {
      if (this.downloading) return
      this.downloading = true
      try {
        await generateProject(this.name, this.path, this.template, {
          version: this.version
        }, (progress: Record<string, any>): void => {
          this.percent = Math.round(progress.percent * 100)
        })
        let project = {
          name: this.name,
          path: this.saved
        }
        onCreate(project)
      } catch (e) {
        console.log(e)
        onFail()
      } finally {
        this.downloading = false
      }
    }
    if (existsSync(join(this.path, this.name))) {
      this.confirm.show(message.directoryIsExists, async () => {
        rimraf.sync(join(this.path, this.name))
        await next()
      })
    } else {
      await next()
    }
  }
  render() {
    const { onCancel, locale } = this.props
    const message = t(locale)
    return (
      <div className="h-100 d-flex flex-column pt-28 pb-12">
        <div className="header-border bg-white pb-12 d-flex">
          <div className="flex-1 text-center">
            <h1 className="text-xl">{message.createProject}</h1>
          </div>
        </div>
        <div className="flex-1 d-flex justify-content-start align-items-start p-20 pb-0">
          <form className="form form--label-right w-100">
            <div className="form-group d-flex">
              <label className="form-group__label">{message.template}</label>
              <div className="form-group__content">
                <Select data={this.templates} value={this.template} placeholder={message.chooseTemplate}
                  onChange={(template: any) => this.template = template} width={420}></Select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">{message.name}</label>
              <div className="form-group__content">
                <div className="input-wrapper">
                  <input type="text" className="input input--sm"
                    placeholder={message.typeName} style={{ width: '420px' }}
                    value={this.name} onChange={(evt: any) => this.name = evt.target.value}/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">{message.version}</label>
              <div className="form-group__content">
                <div className="input-wrapper">
                  <input type="text" className="input input--sm"
                    placeholder={message.typeVersion} style={{ width: '420px' }}
                    value={this.version} onChange={(evt: any) => this.version = evt.target.value}/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">{message.workspace}</label>
              <div className="form-group__content">
                <div className="input-group" style={{ width: '420px' }}>
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
                    value={this.saved} readOnly style={{ width: '420px' }}/>
                </div>
              </div>
            </div>
            {this.downloading && (
              <div className="text-center py-4">
                <Progress value={this.percent} />
              </div>
            )}
            <div className="text-center py-12">
              <button className="btn btn-success mr-12" type="button" disabled={this.downloading} onClick={this.submit}>
                <span className="px-20">{this.downloading ? `${message.creating}...` : message.submit}</span>
              </button>
              <button className="btn btn-secondary" type="button" onClick={onCancel}>
                <span className="px-20">{message.cancel}</span>
              </button>
            </div>
          </form>
        </div>
        <Toast ref={(ref: any) => this.toast = ref} />
        <Confirm ref={(ref: any) => this.confirm = ref} confirmText={message.confirm} cancelText={message.cancel}></Confirm>
      </div>
    )
  }
}
