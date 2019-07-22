import * as React from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { Icon } from '@/component'

@observer
export default class Toast extends React.Component<any, any>{
  @observable visible: boolean = false
  @observable msg: string = ''
  @observable hasError: boolean = false
  show(msg: string, hasError: boolean = false) {
    this.visible = true
    this.msg = msg
    this.hasError = hasError
    setTimeout(() => {
      this.visible = false
    }, 1500)
  }
  error(msg: string) {
    this.show(msg, true)
  }
  render() {
    const StyledToast = styled.div`
      display: ${this.visible ? 'block': 'none'};
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 9999;
      .toast{
        position: relative;
        right: 50%;
        bottom: 50%;
        color: #fff;
        background-color: ${this.hasError ? '#ff3300' : '#0f76fd'};
        box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.5);
        border-radius: 3px;
        padding: 8px 16px;
      }
      .toast-animate-enter{
        opacity: 0;
      }
      .toast-animate-enter-active{
        opacity: 1;
        transition: opacity 200ms;
      }
      .toast-animate-exit{
        opacity: 1;
      }
      .toast-animate-exit-active{
        opacity: 0;
        transition: opacity 200ms;
      }
    `
    return (
      <StyledToast>
        <CSSTransition in={this.visible} timeout={2000} className="toast">
          <div>
            <div className="d-flex align-items-center">
              <Icon type={this.hasError ? 'alert' : 'check-circle'}></Icon>
              <span className="pl-8">{this.msg}</span>
            </div>
          </div>
        </CSSTransition>
      </StyledToast>
    )
  }
}

