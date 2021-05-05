import React from 'react';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll/index';
import styled from 'styled-components';

export const Content = styled.div`
  position: fixed;
  top: 90px;
  bottom: 0;
  width: 100%;
`


const Recommend = () => {
  // mock数据
  const bannerList = [1, 2, 3, 4, 5].map((item) => {
    return { imageUrl: 'http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg' }
  })

  const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12].map((item) => {
    return {
      id: 1,
      picUrl:"https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
      playCount:11117243,
      name: "[话语速歌爆红]全新演绎热门剧集中文推广曲"
    }
  })

  return (
    <Content>
      <Slider bannerList={bannerList}></Slider>
      <Scroll onScroll={(e) => console.log(e)}>
        <div>
          <RecommendList recommendList={recommendList}></RecommendList>
        </div>
      </Scroll>
    </Content>
  )
}

export default React.memo(Recommend)