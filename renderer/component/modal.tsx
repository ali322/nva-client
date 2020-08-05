import * as React from 'react'
import styled from 'styled-components'

export default ({ children, active, width = 300, onClose }: any) => {
  const StyledModal = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: ${active ? 'visible' : 'hidden'};
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
      opacity: ${active ? 0.6 : 0};
      transition: all .3s;
    }
    .modal-inner{
      width: ${width}px;
      background-color: #FFF;
      border-radius: 4px;
      box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
      position: relative;
      z-index: 1000;
    }
  `
  return (
    <StyledModal>
      <div className="modal-mask" onClick={onClose}></div>
      <div className="modal-inner">
        {children}
      </div>
    </StyledModal>
  )
}
