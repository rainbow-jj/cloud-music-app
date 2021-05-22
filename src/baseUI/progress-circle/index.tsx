//baseUI/progress-circle.js
import React from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';

const CircleWrapper = styled.div`
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: ${style["theme-color-shadow"]}
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: ${style["theme-color"]}
    }
  }

`

function ProgressCircle(props) {
  // 传递进来的percent 是0.2就相当于是20%
  const { radius, percent } = props;
  // 整个背景的圆长
  const dashArray = Math.PI * 100
  // 没有高亮的部分，剩下高亮的就是进度
  const dashOffset = (1 - percent) * dashArray

 return (
   <CircleWrapper>
     <svg width={radius} height={radius} viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
       <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
       <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent"
          strokeDasharray={dashArray}// 虚线和间隙值的集合
          strokeDashoffset={dashOffset}//虚线和起始点的便宜位置
        ></circle>
      </svg>
      { props.children }
   </CircleWrapper>
 )
}

export default React.memo(ProgressCircle);
