import React, {useRef, useEffect} from "react";
import { getName } from "../../../api/utils";
import { NormalPlayerContainer, Header, Middle, Footer, CDWrapper, Operators, ProgressWrapper, LyricContainer, LyricWrapper } from './style';
import {CSSTransition}  from 'react-transition-group';
import animations from 'create-keyframe-animation';
import { prefixStyle, formatPlayTime } from '../../../api/utils';
import ProgressBar from '../../../baseUI/progress-bar';
import { playMode } from "../../../api/config";
import Scroll from "../../../baseUI/scroll";


function NormalPlayer(props) {
  const { song, fullScreen, playing ,percent, duration, currentTime,mode, } = props;
  const { toggleFullScreen, clickPlaying, onProgressChange, handlePrev, handleNext, changeMode, togglePlayList, currentLineNum, currentPlayingLyric, currentLyric } = props;
  const normalPlayerRef = useRef<any>();
  const cdWrapperRef = useRef<any>()
  const transform:any = prefixStyle("transform");
  const currentState = useRef("");
  const lyricScrollRef = useRef<any>();
  const lyricLineRefs = useRef<any>([]);

  useEffect (() => {
    if (!lyricScrollRef.current) return;
    let bScroll = lyricScrollRef.current.getBScroll();
    if (currentLineNum > 5) {
      // 保持当前歌词在第5条的位置
      let lineEl = lyricLineRefs.current[currentLineNum - 5].current;
      bScroll.scrollToElement(lineEl, 1000);
    } else {
      // 当前歌词行数<=5 直接滚动到最顶端
      bScroll.scrollTo(0, 0 , 1000);
    }
  },[currentLineNum])

  // 计算偏移的辅助函数
  const _getPosAndScale = () => {
    // 定义目标的宽度
    const targetWidth = 40;
    // 定义左边的padding
    const paddingLeft = 40;
    // 定义底部的padding
    const paddingBottom = 30;
    const paddingTop = 80;
    // 宽度
    const width = window.innerWidth * 0.8;
    // 偏移量
    const scale = targetWidth / width;

    //两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    return {
      x, y, scale
    }
  }

  const enter = () => {
    normalPlayerRef.current.style.display = "block";
    const { x, y, scale } = _getPosAndScale(); //获取Miniplayer图片中心相对 normalPlayer 唱片中心的偏移 
    let animation = {
      0: {
        transform: `translate3d(${x}px ${y}px, 0) scale(${scale})`
      },
      60: {
        tranform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: {
        tranform: `translate3d(0, 0, 0) scale(1)`
      }
    };
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: 'linear'
      }
    });
    animations.runAnimation(
      cdWrapperRef.current,
      "move"
    );
  }

  const afterEnter = () => {
    const cdWrapperDom = cdWrapperRef.current;
    animations.unregisterAnimation("move");
    cdWrapperDom.style.animation = "";

  }

  const leave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "all 0.4s";
    const { x, y, scale } = _getPosAndScale();
    cdWrapperDom.style[transform] = `translate3d(${x} px, ${y} px, 0) scale(${scale})`;
  }


  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "";
    cdWrapperDom.style[transform] = "";
    // 一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSSTransition 的工作只是把动画执行一遍 
    // 不置为 none 现在全屏播放器页面还是存在
    normalPlayerRef.current.style.display = "none";
  };

  const getPlayMode = () => {
    let content;
    if (mode === playMode.sequence) {
      content = "&#xe625;";
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
    } else {
      content = "&#xe61b;";
    }
    return content;
  }

  const toggleCurrentState = () => {
    if (currentState.current !== "lyric") {
      currentState.current = "lyric";
    } else {
      currentState.current = "";
    }
  }

  return (
    <CSSTransition
      className="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className="background">
          <img src={song.al.picUrl+"?params=300*300"} alt="歌曲背景图片" width="100%"
            height="100%"/>
        </div>
        <div className="background layer"></div>
        <Header className="top" onClick={() => toggleFullScreen(false)}>
          <div className="back">
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <h1 className="title">{song.name}</h1>
          <h2 className="subtitle">{getName(song.ar)}</h2>
        </Header>
        <Middle ref={cdWrapperRef}>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState.current !== "lyric"}
          >
            <CDWrapper style={{visibility:currentState.current !== "lyric" ? "visible" : "hidden"}}
            >
              <div className="cd">
                <img className={`image play ${playing ? "" : "pause"}`} src={song.al.picUrl+"?params=400*400"} alt="img"/>
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>
          <CSSTransition 
            timeout={400}
            classNames="fade"
            in={currentState.current === "lyric"}
          >
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper 
                  style={{visibility: currentState.current === "lyric" ? "visible" : "hidden"}}
                  className="lyric_wrapper"
                >
                  { 
                    currentLyric ? 
                    currentLyric.lines.map((item, index) => {
                      // 拿到每行的歌词Dom对象，后面滚动歌词的需要的！
                      lyricLineRefs.current[index] = React.createRef();
                      return (
                        <p
                          className={`text ${currentLineNum === index ? "current" : ""}`}
                          key={item + index}  
                          ref={lyricLineRefs.current[index]}
                        >
                          {item.txt}
                        </p>
                      )
                    })
                    : <p className="text pure">纯音乐， 请欣赏</p>
                  }
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>
        <Footer className="bottom">
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper"><ProgressBar
              percent={percent}
              percentChange={onProgressChange}
            ></ProgressBar></div>
            <span className="time time-r">{formatPlayTime(duration)}</span>
          </ProgressWrapper>
          
          <Operators>
            <div className="icon i-left" onClick={changeMode}>
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              ></i>
            </div>
            <div className="icon i-left" onClick={handlePrev}>
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i className="iconfont"
                onClick={e => clickPlaying(e, !playing)}
                dangerouslySetInnerHTML={{ __html:playing?"&#xe723;":"&#xe731;"}}
              ></i>
            </div>
            <div className="icon i-right" onClick={handleNext}>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div className="icon i-right">
              <i className="iconfont" onClick={() => togglePlayList(true)}>&#xe640;</i>
            </div>
          </Operators>
        </Footer>
      </NormalPlayerContainer>
    </CSSTransition>
  )
}
export default React.memo(NormalPlayer);
