import React,{ useCallback, useState, useRef, useEffect} from 'react';
import { CSSTransition } from 'react-transition-group';
import { Container, ImgWrapper, CollectButton, SongListWrapepr, BgLayer} from './style';
import Header from '../../baseUI/header';
import SongsList from "../SongList/index";
import Scroll from '../../baseUI/scroll';
import {HEADER_HEIGHT} from '../../api/config';
import {connect} from 'react-redux';
import { changeLoading, getSongerInfo } from './store/actionCreators';
import Loading from '../../baseUI/loading';
import MusicNote from "../../baseUI/music-note/index";

function Singer(props) {
  const { artist: immutableArtist, songs: immutableSongs, loading, getSingerDataDispatch, songsCount} = props;

  const artist = immutableArtist.toJS();
  const songs = immutableSongs.toJS();

  const [showStatus, setShowStatus] = useState(true);
  const collectButton = useRef<any>(); 
  const imageWrapper = useRef<any>();
  const songScrollWrapper = useRef<any>();
  const songScroll = useRef<any>();
  const header = useRef<any>();
  const layer = useRef<any>();
  // 图片初始高度
  const initialHeight = useRef<any>(0);
  const musicNoteRef = useRef<any>();

  // 往上偏移的尺寸
  const OFFSET = 5;

  useEffect(() => {
    const id = props.match.params.id;
    getSingerDataDispatch(id)
    let h = imageWrapper.current.offsetHeight;
    initialHeight.current = h;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    //把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh();
    // eslint-disable-next-line
  }, []);

  const handleScroll = (pos: any) => {
    let height = initialHeight.current;
    const newY = pos.Y
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    const minScrollY = (height-OFFSET) + HEADER_HEIGHT;
    console.log('newY', newY)

    // 指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY/height);

    // 滑动下拉，背景图片放大，按钮跟着偏移（下移）
    if (newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`; // 图片等比缩放到1+percent
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`; // 按钮元素移动位置到 y的 ${newY}px
      // 遮罩层的顶部(也往下移动了) = 下拉图片的高度 - 偏移量 + 滚动的高度
      layerDOM.style.top = `${height - OFFSET + newY}px`

    }else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDOM.style.zindex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zindex = -1;
      // 按钮跟着移动并且逐渐变透明
      buttonDOM.style["transeform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1-percent *2}`;

    }else if (newY < minScrollY) {
      // 往上滑动，但若超过了header部分
      layerDOM.style.top = `${HEADER_HEIGHT -OFFSET}px`;
      layerDOM.style.zIndex = 1;
      // 防止溢出的歌单内容遮住 Header
      headerDOM.style.zIndex =  100;
      // 此时图片的高度和header 一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
    
  }
  
  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false)
  },[]);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y});
  }
  return (
    <div>
      <CSSTransition
        in={showStatus}
        timeout={300}
        classNames="fly"
        appear={true}
        onExited={() => props.history.goBack()}
      >
        <Container play={songsCount}>
          <Header ref={header} handleClick={setShowStatusFalse} title={"头部"} ></Header>
          <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
            <div className="filter"></div>
          </ImgWrapper>
          <CollectButton ref={collectButton}>
            <i className="iconfont">&#xe62d;</i>
            <span className="text"> 收藏 </span>
          </CollectButton>
          <BgLayer ref={layer}></BgLayer>
          <SongListWrapepr ref={songScrollWrapper}>
            <Scroll ref={songScroll} onScroll={handleScroll}>
              <SongsList
                songs={songs}
                showCollect={false}
                musicAnimation={musicAnimation}
              ></SongsList>
            </Scroll>
          </SongListWrapepr>
          {loading ? (<Loading></Loading>) : null}
          <MusicNote ref={musicNoteRef}></MusicNote>
        </Container>
      </CSSTransition>
    </div>
  )
}

const mapStateToProps = state => ({
  artist:state.getIn(['singerInfo', 'artist']),
  songs: state.getIn(['singerInfo', 'songOfArtist']),
  loading: state.getIn(['singerInfo', 'loading']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = dispatch => {
  return {
    getSingerDataDispatch(id) {
      dispatch( changeLoading(true))
      dispatch(getSongerInfo(id))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Singer));