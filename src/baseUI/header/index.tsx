import React from 'react';
import styled , { keyframes }from 'styled-components';
import style from '../../assets/global-style';

const marquee = keyframes`
  from {
    left: 100%;
  }
  to {
    left: -100%
  }
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
`
interface HeaderProps {
  handleClick?: () => void,
  title?: string
  className?: string
}

const defaultProps: HeaderProps = {
  title: '标题',
  className:'title'
}
const HeaderContainer = styled.div`
 .Marquee {
  width: 100%;
  background-color:red;
  height: 35px;
  overflow: hidden;
  position: relative;
  white-space: nowrap;
 }
  position: fixed;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  color: ${style["font-color-light"]};
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  >h1 {
    font-size: ${style["font-size-l"]};
    font-weight: 700;
    
  }
  .text {
    margin-left:30px;
    position: absolute;
    animation: ${marquee} 10s linear infinite;
  }
`
 

const Header = React.forwardRef((props:HeaderProps = defaultProps, ref:any) => {
  const { handleClick, title, className} = props;
  return (
    <HeaderContainer ref={ref} className={className}>
      <i className="iconfont back"  onClick={handleClick}>&#xe655;</i>
      <h1 className="text">{title}</h1>
    </HeaderContainer>
  )
})


export default React.memo(Header);
