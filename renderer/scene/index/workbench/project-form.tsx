import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { observable, computed } from 'mobx'
import { ipcRenderer, remote } from 'electron'
import { join } from 'path'
import { autobind } from 'core-decorators'
import { Select } from '@/component'
import repos from '@/config/repo.json'

const win: any = remote.getCurrentWindow()

@inject((stores: any) => ({
  auth: stores.root.auth
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
    return Object.keys(this.repos).map((k: any) => ({
      label: k,
      value: this.repos[k]
    }))
  }
  @autobind
  select() {
    let workDir = remote.dialog.showOpenDialog(win, {
      title: '选择工作空间',
      properties: ['openDirectory', 'createDirectory']
    })
    if (workDir) {
      this.path = workDir[0]
    }
  }
  @autobind
  submit() {
    const { onCreate } = this.props
    this.downloading = true
    ipcRenderer.send('generate-project', {
      name: this.name,
      repo: this.repo,
      path: this.path,
      answers: {
        ver: this.version
      }
    })
    let project = {
      name: this.name,
      path: this.saved
    }
    onCreate(project)
  }
  render() {
    const { onCancel } = this.props
    return (
      <div className="h-100 d-flex flex-column pt-28 pb-12">
        <div className="header-border bg-white pb-12 d-flex">
          <div className="flex-1 text-center">
            <h1 className="text-xl">初始化项目</h1>
          </div>
        </div>
        <div className="flex-1 d-flex justify-content-start align-items-start p-20 pb-0">
          <form className="form form--label-right w-100">
            <div className="form-group d-flex">
              <label className="form-group__label">模板</label>
              <div className="form-group__content">
                <Select data={this.templates} value={this.repo} placeholder="请选择模板"
                  onChange={(repo: any) => this.repo = repo}></Select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">名称</label>
              <div className="form-group__content">
                <div className="input-wrapper">
                  <input type="text" className="input input--sm" 
                    placeholder="请输入名称" style={{width: '300px'}}
                    value={this.name} onChange={(evt: any) => this.name = evt.target.value}/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">版本号</label>
              <div className="form-group__content">
                <div className="input-wrapper">
                  <input type="text" className="input input--sm" 
                    placeholder="请输入版本号" style={{width: '300px'}}
                    value={this.version} onChange={(evt: any) => this.version = evt.target.value}/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">工作空间</label>
              <div className="form-group__content">
                <div className="input-group" style={{width: '300px'}}>
                  <div className="input-wrapper">
                    <input type="text" className="input input--sm" 
                      placeholder="请选择工作空间" 
                      value={this.path} onChange={(evt: any) => this.path = evt.target.value}/>
                  </div>
                  <div className="input-group-addon p-0 border-0">
                    <button type="button" className="btn btn-no-hover btn-secondary border-left-0 bg-gray-lightest-5" onClick={this.select}>
                      <span className="text-md">选择</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-group__label">项目路径</label>
              <div className="form-group__content">
                <div className="input-wrapper">
                  <input type="text" className="input input--sm" 
                    placeholder="工作空间 + 名称"
                    value={this.saved} readOnly style={{width: '300px'}}/>
                </div>
              </div>
            </div>
            <div className="text-center py-12">
              <button className="btn btn-success mr-12" onClick={this.submit}>
                <span className="px-20">提交</span>
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                <span className="px-20">取消</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
