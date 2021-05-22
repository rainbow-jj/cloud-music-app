import React, { useEffect, useRef } from 'react';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll/index';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import { forceCheck } from 'react-lazyload';
import { Content } from './style';
import Loading from '../../baseUI/loading';
import BScroll from "better-scroll"
import { renderRoutes } from 'react-router-config';

const Recommend = (props) => {
  const { bannerList, recommendList, enterLoading, songsCount} = props
  const { getBannerDataDispatch, getRecommendDataDispatch} = props;


  useEffect(() => {
    // 如果页面有数据，则不发请求
    // immutable 数据结构中长度属性 size
    if (!bannerList.size) {
      getBannerDataDispatch();
    }
    if (!recommendList.size) {
      getRecommendDataDispatch()
    }
    // eslint-disable-next-line
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS  = recommendList ? recommendList.toJS() : [];

  return (
    <Content play={songsCount}>
      <Scroll direction={"vertical"} onScroll={forceCheck}>
        <div > 
          <Slider bannerList={bannerListJS}></Slider> 
          <RecommendList recommendList={recommendListJS}></RecommendList> 
      </div>
      </Scroll>
      { enterLoading ? <Loading></Loading> : null }
      {renderRoutes(props.route.routes)}
    </Content>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  // 不要再这里将数据toJS,不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染, 属于滥用immutable
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading']),//简单数据类型不需要调用toJS
  songsCount: state.getIn(['player', 'playList']).size // 尽量减少 toJS 操作，直接取 size 属性就代表了 list 的长度
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend))