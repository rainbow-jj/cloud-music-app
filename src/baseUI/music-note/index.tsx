//baseUI/music-note/index.js
import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { prefixStyle } from '../../api/utils';
import style from '../../assets/global-style';

const MusicNoteContainer = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(.62,-0.1,.86,.57);
    transform: translate3d(0, 0, 0);
    >div{
      transition: transform 1s;
    }
  }
`

const MusicNote = forwardRef((props:any, ref) => {
  const iconRef = useRef<any>();
  // 容器中有 3 个音符，也就是同时只能有 3 个音符下落
  const ICON_COUNT = 10;

  const transform = prefixStyle("transform")

  // 原生DOM操作，返回一个DOM节点对象
  const createNode = (txt) => {
    const template = `<div className='icon_wrapper'>${txt}</div>`;
    let tempNode = document.createElement('div');
    tempNode.innerHTML = template;
    return tempNode.firstChild
  }

  useEffect(() => {
    for (let i = 0; i < ICON_COUNT; i++) {
      let node = createNode(`<div class="iconfont">&#xe642;</div>`);
      iconRef.current.appendChild(node);
    }
    // 类数组转换成数组，当然也可以用[...xxx] 解构语法或 Array.from()
    let domArray = [].slice.call(iconRef.current.children);
    domArray.forEach( (item:any) => {
      item.running = false;
      item.addEventListener('transitionend', function() {
        console.log('item', item)
        //console.log('this', this)
        
        item.style['display'] = 'none';
        item.style[transform] = `translate3d(0, 0, 0)`;
        item.running = false;

        let icon = item.querySelector('div');
        icon.style[transform] = `translate3d(0,0,0)`
      }, false);
    });
    //eslint-disable-next-line

  },[]);

  const startAnimation = ({x, y}) => {
    for (let i = 0; i < ICON_COUNT; i++) {
      let domArray = [].slice.call(iconRef.current.children)
      let item:any = domArray[i]
      // 选择一个空闲的的元素来开始动画
      if (item.running === false) {
        item.style.left = x + "px";
        item.style.top = y + "px";
        item.style.display = "inline-block";

        setTimeout(() => {
          item.running = true;
          item.style[transform] = `translate3d(0, 750px, 0)`;
          let icon = item.querySelector("div");
          icon.style[transform] = `translate3d(-40px, 0, 0)`;
        }, 20);
        break;
      }
    }
  }

  // 外界调用的 ref 方法
  useImperativeHandle(ref, () => ({
    startAnimation
  }))

  return (
    <MusicNoteContainer ref={iconRef}>
    </MusicNoteContainer>
  )
})

export default React.memo(MusicNote);