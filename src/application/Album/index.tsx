import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';
import { Container, TopDesc, Menu } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from '../../baseUI/header';
import { getCount, isEmptyObject, } from '../../api/utils';
import { getAlumList, changeEnterLoading } from './store/actionCreator';
import SongList from '../SongList/index';
import { HEADER_HEIGHT } from '../../api/config';
import style from "../../assets/global-style";
import MusicNote from "../../baseUI/music-note/index";

const Album = (props) => {
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState("歌单");
  const headerEl = useRef<any>();
  const musicNoteRef = useRef<any>();

  // 从路由中拿到歌单的 id
  const id = props.match.params.id;

  const { currentAlbum: currentAlbumImmutable, enterLoading, songsCount} = props;
  const { getAlbumDataDispatch } = props;

  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  let currentAlbum = currentAlbumImmutable.toJS();

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, [])

  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y / minScrollY)
    let headerDom = headerEl.current;
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style['theme-color'];
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
      setTitle(currentAlbum.name);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle("歌单");
    }

  }, [currentAlbum])

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

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
        <Container play={songsCount}>  
          <Header ref={headerEl} className="Marquee" title={title} handleClick={handleBack}></Header>
          { !isEmptyObject(currentAlbum) ?
            (
              <Scroll
                bounceTop={false}
                onScroll={handleScroll}
              >
                <div>
                  {renderTopDesc()}
                  {renderMenu()}
                  <SongList 
                    songs={currentAlbum.tracks}
                    collectCount={currentAlbum.subscribedCount}
                    showCollect={true}
                    showBackground={true}
                    musicAnimation={musicAnimation}
                  />
                </div>
              </Scroll>
            ) : null
          }
          { enterLoading ? <Loading></Loading> : null }
          <MusicNote ref={musicNoteRef}></MusicNote>
        </Container>   
      </CSSTransition>
    </div>
  )
}

// 把redux中的state映射到props上
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  ennterLoading: state.getIn(['album', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size
})

// 把dispatch映射到props
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlumList(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));