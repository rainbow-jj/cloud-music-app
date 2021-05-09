import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';
import { Container, TopDesc, Menu, SongList, SongItem } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from '../../baseUI/header';
import { getCount, isEmptyObject, } from '../../api/utils';
import { getAlumList, changeEnterLoading } from './store/actionCreator';

const Album = (props) => {
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState("歌单");

  const handleBack = useCallback(() => {
    setShowStatus(false);
  },[])
  
  // 从路由中拿到歌单的 id
  const id = props.match.params.id;

  const { currentAlbum: currentAlbumImmutable, enterLoading} = props;
  const { getAlbumDataDispatch } = props;

  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  let currentAlbum = currentAlbumImmutable.toJS();

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{getCount(currentAlbum.subscribedCount)}</span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }

  const renderSongList = () => {
    return (
      <SongList>
        <div className="first_line">
          <div className="play">
            <i className="iconfont">&#xe6e3;</i>
            <span>播放全部<span className="sum">(共{currentAlbum.tracks.length}首)</span></span>
          </div>
          <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span>收藏({getCount(currentAlbum.subscribedCount)})</span>
          </div>
        </div>
        <SongItem>
          {
            currentAlbum.tracks.map((item,index) => {
              return (
                <li key={index}>
                  <span className="index">{index + 1}</span>
                  <div className="info">
                    <span>{item.name}</span>
                    <span>{}</span>
                  </div>
                </li>
              )
            })
          }
        </SongItem>
      </SongList>
    )
  }

  return (
    <div>
      <CSSTransition
        in={showStatus}
        timeout={300}
        appear={true}
        classNamrs="fly"
        unmountOnExit
        onExited={props.history.goBack}
      >
        <Container>  
          <Header className="Marquee" title={title} handleClick={handleBack}></Header>
          { !isEmptyObject (currentAlbum) ?
            (
              <Scroll
                bounceTop={false}
              >
                <div>
                  {renderTopDesc()}
                  {renderMenu()}
                  {renderSongList()}
                </div>
              </Scroll>
            ) : null
          }
          { enterLoading ? <Loading></Loading> : null }
        </Container>   
      </CSSTransition>
    </div>
  )
}

// 把redux中的state映射到props上
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  ennterLoading: state.getIn(['album', 'enterLoading'])
})

// 把dispatch映射到props
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(false));
      dispatch(getAlumList(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));