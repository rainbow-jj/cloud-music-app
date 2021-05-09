
import React, { useMemo } from 'react';
import { GlobalStyle } from './style';
import { IconStyle } from './assets/iconfont/iconfont';
// 读取路由配置转为routes标签 renderRoutes 这个方法只渲染一次路由
import { renderRoutes } from 'react-router-config'; 
import routes from './routes/index';
import { HashRouter } from 'react-router-dom';
import store from './store/index';
import { Provider } from 'react-redux';
import {Data} from './application/Singers/data';

function App() {
  const renderedRoutes = useMemo(() => renderRoutes(routes), []);
  console.log('renderedRoutes: ', renderedRoutes);

  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        <Data>
          {renderedRoutes}
        </Data>
      </HashRouter>
    </Provider>
  );
}

export default App;
