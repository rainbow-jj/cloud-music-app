import React, { useCallback, useState, useRef} from 'react';
import { connect } from "react-redux";
import { PlayListWrapper, ScrollWrapper, ListContent, ListHeader } from './style';
import { changeCurrentIndex, changeShowPlayList, changeMode, changePlayList, deleteSong, changeSequencePlayList, changeCurrentSong, changePlaying } from '../store/actionCreators';
import { CSSTransition } from 'react-transition-group';
import { findIndex, getName, prefixStyle, shuffle } from '../../../api/utils';
import Scroll from '../../../baseUI/scroll';
import { playMode } from '../../../api/config';
import Confirm from '../../../baseUI/confirm';

function PlayList(props) {
  const { showPlayList, currentSong: immutableCurrentSong, currentIndex, playList: immutablePlayList, sequencePlayList:immutableSequencePlayList,mode} = props;
  const { togglePlayListDispatch, changeCurrentIndexDispatch, changeModeDispatch, changePlayListDispatch, deleteSongDispatch, clearDispatch } = props;
  const playListRef = useRef<any>();
  const listWrapperRef = useRef<any>();
  const confirmRef = useRef<any>();
  const listContentRef = useRef();
  const [isShow, setIsShow ]= useState(false);
  const transform = prefixStyle('transform');
  const [canTouch, setCanTouch] = useState(true);
  //touchStart 后记录 y 值
  const [startY, setStartY] = useState(0);
  //touchStart 事件是否已经被触发
  const [initialed, setInitialed] = useState<any>(0);
  // 用户下滑的距离
  const [distance, setDistance] = useState(0);

  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  const onEnter = useCallback(() => {
    // 让列表显示
    setIsShow(true)
    // 最开始是隐藏在下面
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;

  },[transform])

  const onEntering = useCallback(() => { 
    // 让列表展示
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
  }, [transform]) 

  const onExiting = useCallback(() => { 
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform])

  const onExit = useCallback(() => { 
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  },[transform])

  const getCurrentIcon = (item) => {
    // 是不是当前播放的歌曲
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;' : '';
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{ __html: content }}></i>
    )
  }

  const getPlayMode = () => {
    let content, text;
    if(mode === playMode.sequence) {
      content = "&#xe625;";
      text = "顺序播放"
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
      text = "单曲循环";
    } else {
      content = "&#xe61b;";
      text = "随机播放";
    }
    return (
      <div>
        <i className="iconfont" onClick={(e) => changeMode()} dangerouslySetInnerHTML={{ __html:content}}></i>
        <span className="text" onClick={(e) => changeMode()}>{text}</span>
      </div>
    )
  }

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    // 具体逻辑比较复杂，后面来实现
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList)
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  }

  const handleChangeCurrentIndex = (index) => {
    if (currentIndex === index) return;
    changeCurrentIndexDispatch(index);
  }

  const handleDeleteSong = (e, song) => {
    e.stopPropagation();
    deleteSongDispatch(song)
  }

  const handleShowClear = () => {
    confirmRef.current.show();
  };

  const handleConfirmClear = () => {
    clearDispatch();
  }

  const handleTouchStart = (e) => {
    if (!canTouch || initialed) return;
    listWrapperRef.current.style["transition"] = "";
    setStartY(e.nativeEvent.touches[0].pageY);// 记录 y 值
    setInitialed(true);
  };

  const handleTouchMove = (e) => {
    if (!canTouch || !initialed) return;
    let distance = e.nativeEvent.touches[0].pageY - startY;
    if (distance < 0) return;
    setDistance(distance);// 记录下滑距离
    listWrapperRef.current.style.transform = `translate3d (0, ${distance} px, 0)`;
  };

  const handleTouchEnd = (e) => {
    setInitialed(false);
    // 这里设置阈值为 150px
    if (distance >= 150) {
      // 大于 150px 则关闭 PlayList
      togglePlayListDispatch(false);
    } else {
      // 否则反弹回去
      listWrapperRef.current.style["transition"] = "all 0.3s";
      listWrapperRef.current.style[transform] = `translate3d (0px, 0px, 0px)`;
    }
  };

  const handleScroll = (pos) => {
    // 只有当内容偏移量为 0 的时候才能下滑关闭 PlayList。否则一边内容在移动，一边列表在移动，出现 bug
    let state = pos.y === 0;
    setCanTouch(state);
  }
  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnter}
      onEntering={onEntering}
      onExiting={onExiting}
      onExit={onExit}
    >
      <PlayListWrapper 
        ref={playListRef}
        style={isShow === true ? { display:"block"} : {display: "none"}}
        onClick={() => togglePlayListDispatch(false)}

      >
        <div className="list_wrapper" 
          ref={listWrapperRef}
          onClick={ e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              { getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={pos => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {
                  playList.map((item, index) => {
                    return (
                      <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                        { getCurrentIcon( item )}
                        <span className="text">{item.name}-{getName(item.ar)}</span>
                        <span className="like"> <i className="iconfont">&#xe601;</i></span>
                        <span className="delete" onClick={(e) => handleDeleteSong(e, item)}><i className="iconfont">&#xe63d;</i></span>
                      </li>
                    )
                  })
                }
              </ListContent>
            </Scroll>
          </ScrollWrapper>
          <Confirm 
            ref={confirmRef}
            text={"是否删除全部"}
            cancelBtnText={"取消"}
            confirmBtnText={"确定"}
            handleConfirm={handleConfirmClear}
          />
        </div>
      </PlayListWrapper>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  currentSong: state.getIn(['palyer', 'currentSong']),
  showPlayList: state.getIn(['player', 'showPlayList']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  playList: state.getIn(['player', 'playList']), //播放列表
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),// 顺序排列时的播放列表
  mode: state.getIn(['player', 'mode'])
})

const mapDispatchToProps = dispatch => {
  return {
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    // 修改当前歌曲在列表中的 index，也就是切歌
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    // 修改当前的播放模式
    changeModeDispatch(data) {
      dispatch(changeMode(data))
    },
    // 修改当前的歌曲列表
    changePlayListDispatch(data) {
      dispatch(changePlayList(data))
    },
    deleteSongDispatch(data) {
      dispatch(deleteSong(data));
    },
    clearDispatch() {
      dispatch(changePlayList([]));
      dispatch(changeSequencePlayList([]));
      dispatch(changeCurrentIndex(-1));
      // 3.关闭PlayList的显示
      dispatch(changeShowPlayList(false));
      // 4.将当前歌曲置空
      dispatch(changeCurrentSong({}));
      // 5.重置播放状态
      dispatch(changePlaying(false));

    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList));