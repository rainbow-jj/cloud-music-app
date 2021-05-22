import styled from 'styled-components';
import style from '../../assets/global-style';

export const Content = styled.div<any>`
  position: fixed;
  top: 90px;
  bottom: ${props => props.play > 0 ? "60px" : 0};
  width: 100%;
  
` 
 