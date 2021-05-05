import React from 'react';
import { ListWrapper, List, ListItem } from './style';

function RecommendList (props:any) {

  return (
    <ListWrapper>
      <h1 className="title">推荐歌单</h1>
      <List>
        {
          props.recommendList.map((item:any, index:number) => {
            return (
              <ListItem key={item.id + index}>
                <div className="img_wrapper">
                  {/* decorate 给图片上的图标和文字提供一个遮罩 */}
                  <div className="decorate"></div>
                  <img src={item.picUrl + "?param=300x300"} alt="music"/>
                  <div className="play_count">
                    <i className="iconfont play">&#xe885;</i>
                    <span className="count">{item.playCount}</span>
                  </div>
                </div>
                <div className="desc">{item.name}</div>
              </ListItem>
            )
          })
        }
      </List>
    </ListWrapper>
  )

}

export default React.memo(RecommendList)