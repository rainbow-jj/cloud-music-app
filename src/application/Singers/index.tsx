import React, {
  useState, useEffect, useContext
} from 'react';
import Horizon from '../../baseUI/horizon-item';
import { categoryTypes, alphaTypes } from '../../api/config';
import { NavContainer, List,ListContainer, ListItem } from './style';
import Scroll from '../../baseUI/scroll';
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList
} from './store/actionCreators';
import { connect } from 'react-redux';
import LazyLoad, { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading';
import { CategoryDataContext } from './data';
import { CHANGE_CATEGORY, CHANGE_ALPHA, Data } from './data';
import { renderRoutes } from 'react-router-config';
import { useHistory, withRouter } from 'react-router-dom';

function Singers(props) {
  // let [category, setCategory] = useState('');
  // let [alpha, setAlpha] = useState('');
  const { data, dispatch }:any = useContext(CategoryDataContext);
  const {category, alpha} = data.toJS();
  const history = useHistory();
  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount, songsCount} = props;
  const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props;

  useEffect(() => {
    getHotSingerDispatch();
    // eslint-disable-next-line
  }, []);

  const enterDetail = (id) => {
    history.push(`/singers/${id}`)
  }

  let handleUpdateAlpha = (val) => {
    dispatch({ type: CHANGE_ALPHA, data: val });
    updateDispatch(category, val);
  };

  let handleUpdateCatetory = (val) => {
    dispatch({ type: CHANGE_CATEGORY, data: val });
    updateDispatch(val, alpha);
  };

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '' ,pageCount)
  }

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha)
  }


  // 渲染函数，返回歌手列表
  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : [];
    return (
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem key={item.acountid + "" + index} onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music"></img>}>
                    <img src={`${item.picUrl}?param300x300`} width="100%" height="100%" alt="music" />
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  return (
    <div>
      <NavContainer>
        <Horizon oldVal={category} list={categoryTypes} handleClick={handleUpdateCatetory} title={"分类（默认热门）"}></Horizon>
        <Horizon oldVal={alpha} list={alphaTypes} handleClick={handleUpdateAlpha} title={" 首字母 "}></Horizon>
      </NavContainer>
      <ListContainer play={songsCount}>
        <Scroll direction={"vertical"}
          pullUp={ handlePullUp }
          pullDown={ handlePullDown}
          pullDownLoading={ pullDownLoading }
          pullUpLoading={ pullUpLoading }
          onScroll = { forceCheck }
        >
          { renderSingerList() }
        </Scroll>
        <Loading show={enterLoading}></Loading>
      </ListContainer>
      {renderRoutes(props.route.routes)}
    </div>
  )
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']), //控制进场Loading
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']), //控制上拉加载动画
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),//控制下拉加载动画
  pageCount: state.getIn(['singers', 'pageCount']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList());
    },
    updateDispatch(category, alpha) {
      dispatch(changePageCount(0));//由于改变了分类，所以pageCount清零
      dispatch(changeEnterLoading(true));//loading，现在实现控制逻辑
      dispatch(getSingerList(category, alpha));
    },
    // 滑到底部刷新部分的处理
    pullUpRefreshDispatch(category, alpha, hot, count) {
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(count + 1));
      if (hot) {
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList(category, alpha));
      }
    },
    // 顶部下拉刷新
    pullDownRefreshDispatch(category, alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changePageCount(0));//属于重新获取数据
      if (category === '' && alpha === '') {
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList(category, alpha));
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));