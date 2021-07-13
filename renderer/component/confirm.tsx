import * as React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { action, observable } from 'mobx'

@observer
export default class Confirm extends React.Component<any, any> {
  @observable actived: boolean = false
  @observable content: string = ''
  @observable ok: Function = () => {}
  @action.bound
  handleClose() {
    this.actived = false
    this.content = ''
    this.ok = () => {}
  }
  @action.bound
  show(content: string, ok: Function) {
    this.actived = true
    this.content = content
    this.ok = ok
  }
  render() {
    return (
      <StyledConfirm style={{
        'visibility': this.actived ? 'visible' : 'hidden',
        'opacity': this.actived ? 1 : 0
      }}>
        <div className="modal-mask"></div>
        <div className="modal-inner px-20 py-12">
          <p className="m-0 text-center py-8 text-gray text-md">{this.content}</p>
          <div className="text-right mt-12">
            <button className="btn btn-success px-16 mr-12" onClick={() => {
              this.ok()
              this.handleClose()
            }}>
              <span>{this.props.confirmText || 'Confirm'}</span>
            </button>
            <button className="btn btn-secondary px-16" onClick={this.handleClose}>
              <span>{this.props.cancelText || 'Cancel'}</span>
            </button>
          </div>
        </div>
      </StyledConfirm>
    )
  }
}

const StyledConfirm = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-mask{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: #000;
    opacity: .6;
    transition: all .3s;
  }
  .modal-inner{
    background-color: #FFF;
    border-radius: 4px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
    position: relative;
    z-index: 1000;
  }
`
