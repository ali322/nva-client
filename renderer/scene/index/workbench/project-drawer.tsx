import * as React from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import { Icon } from '@/component'

interface Props {
  active: boolean,
  histories: any[],
  opened: any,
  children: any,
  toggleActive: any,
  deleteHistory: any,
  selectProject: any
}
export default ({ active = false, opened, histories, children, toggleActive, deleteHistory, selectProject }: Props) => {
  const defaultStyle: Record<string, any> = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: '#fff'
  }
  return (
    <StyledDrawer>
      {active && (
        <div className="mask-layer"
          onClick={toggleActive}></div>
      )}
      <CSSTransition unmountOnExit timeout={200} in={active} classNames="drawer">
        <div style={defaultStyle}>
          <div className="drawer-content">
            <div className="history flex-1 overflow-y">
              {histories.map((history: any, i: number) => (
                <span
                  key={i}
                  className="d-block px-12 pt-12 pb-8 link"
                  onClick={() => {
                    selectProject(history.path)
                    toggleActive()
                  }}>
                  <div className="history-head w-100 position-relative">
                    <span className={`flex-1 d-block text-base pr-20 line-height-25 text-truncate ${opened.path === history.path ? 'text-gray font-weight-bold' : 'text-muted'}`}>{history.name}</span>
                    <button className="delete-history p-0 border-0 outline-0 bg-transparent"
                      onClick={(e: any) => {
                        e.stopPropagation()
                        // deleteHistory(i)
                      }}>
                      <Icon type="trash" size={14}></Icon>
                    </button>
                  </div>
                  <p className={`m-0 text-sm text-truncate ${opened.path === history.path ? 'text-gray' : 'text-muted'}`}>{history.path}</p>
                </span>
              ))}
            </div>
            {children}
          </div>
        </div>
      </CSSTransition>
    </StyledDrawer>
  )
}

const StyledDrawer = styled.div`
  .mask-layer {
    position: absolute;
    top: 0;
    bottom: 0;
    left:0;
    right:0;
    background: rgba(0,0,0, .5);
    z-index: 99;
  }
  .drawer-enter {
    opacity: 0;
    transform: translateX(-3%);
  }
  .drawer-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: all .2s ease;
  }
  .drawer-exit {
    opacity: 1;
    transform: translateX(0);
  }
  .drawer-exit-active {
    opacity: 0;
    transform: translateX(-3%);
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  
  .drawer-content{
    width: 280px;
    box-shadow: 2px 0 2px 1px rgba(0,0,0, .2);
    display: flex;
    height: 100%;
    flex-direction: column;
    .history{
      & > span {
        color: inherit;
        text-decoration: none;
        .history-head {
          .delete-history {
            position: absolute;
            right: 0;
            top: 3px;
            display: none;
            color: #AAA;
          }
        }
        &:hover .delete-history {
          display: block;
        }
      }
    }
  }
`
