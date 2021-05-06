import React, { useEffect } from 'react';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll/index';
import styled from 'styled-components';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import { forceCheck } from 'react-lazyload';
import {Content} from './style';
import Loading from '../../baseUI/loading';

const Recommend = (props) => {
  const { bannerList, recommendList, enterLoading } = props
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
    <Content>
      <Slider bannerList={bannerListJS}></Slider>
      <Scroll onScroll={forceCheck}>
        <div>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      { enterLoading ? <Loading></Loading> : null }
    </Content>
  );
}

  // 映射Redux全局的state到组件的props上
  const mapStateToProps = (state) => ({
    // 不要再这里将数据toJS,不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染, 属于滥用immutable
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
    enterLoading: state.getIn(['recommend', 'enterLoading'])//简单数据类型不需要调用toJS
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