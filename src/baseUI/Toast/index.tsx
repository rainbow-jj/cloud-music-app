//Toast/index.js
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import style from '../../assets/global-style';

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 50px;
  &.enter{
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  &.enter-active{
    opacity: 1;
    transition:all 0.3s;
    transform: translate3d(0, 0, 0);
  }
  &.exit-active{
    opacity: 0;
    transition: all 0.3s;
    transform: translate3d(0, 100%, 0);
  }
  .text {
    line-height:50px;
    text-align: center;
    color: #fff;
    font-size: ${style["font-size-l"]}
  }
`

//外面组件需要拿到这个函数组件的ref，因此用forwardRef
const Toast = forwardRef((props:any, ref) => {
  const {text} = props;
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState<any>('');

  useImperativeHandle(ref, () =>({
    // 外面组件拿到函数ref的方法，用useImperativeHandle这个hook
    show() {
      // 做了防抖处理
      if(timer) clearTimeout(timer);
      setShow(true);
      setTimer(setTimeout(() => {
        setShow(false)
      },3000));
    }
  }))

  return (
    <CSSTransition
      in={show}
      timeout={300}
      className="drop"
      unmountOnExit
    >
      <ToastWrapper>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  )
});

export default React.memo(Toast);