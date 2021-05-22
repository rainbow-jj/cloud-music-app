import React, { useState, useRef, useEffect } from 'react';
import { connect } from "react-redux";
import { changeFullScreen, changePlaying, changeSequencePlayList, changePlayList, changeMode, changeCurrentIndex, changeShowPlayList, changeCurrentSong} from './store/actionCreators';
import MiniPlayer from './miniPlay';
import NormalPlayer from './normalPlayer';
import { getSongUrl, isEmptyObject, findIndex, shuffle } from '../../api/utils';
import Toast from '../../baseUI/Toast';
import { playMode } from '../../api/config';
import { getLyricRequest } from '../../api/request';
import Lyric from '../../api/lyric-parser';

function Player(props:any) {
  const {
    fullScreen,
    playing,
    sequencePlayList:immutableSequencePlayList, //顺序列表
    playList:immutablePlayList,
    mode, //播放模式
    currentIndex,
    currentSong:immutableCurrentSong,
  } = props;

  const { 
    toggleFullScreenDispatch, 
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentSongDispatch,
    changePlayListDispatch, //改变playList
    changeModeDispatch, //改变mode
    } = props;
  // 当前歌曲播放时间
  const [currentTime, setCurrentTime] = useState<any>();
  // 歌曲总时长
  const [duration, setDuration] = useState<any>();
  // 记录当前歌曲，以便于下次重渲染时对比是否是一首歌曲
  const [preSong, setPreSong] = useState<any>({});
  const [modeText, setModeText] = useState("");
  const [currentPlayingLyric, setPlayingLyric] = useState("");
  const currentLyric = useRef<any>();
  const currentLineNum = useRef(0);


  // 歌曲播放进度
  let percent = isNaN(currentTime/duration) ? 0 : currentTime/ duration;

  const toastRef = useRef<any>();
  const songReady = useRef(true);
  const audioRef = useRef<any>();
  // const [songReady, setSongReady] = useState(true)
  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS(); //深度转换为纯js数组和对象

  useEffect(() => {
    // 得到currentSong数据、和currentIndex、audio属性添加了src/调用play状态、分别发起Dispatch：歌曲对应下标、赋值currentSong、播放状态、重头开始时间、歌曲时长
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current) return;
    let current = playList[currentIndex];
    setPreSong(current);
    songReady.current = false; // 把标志位置为 false, 表示现在新的资源没有缓冲完成，不能切歌
    changeCurrentSongDispatch(current); //赋值currentSong
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play().then(() => {
        songReady.current = true;
      }).catch(error => {console.error('播放异常',error)});

    });
    togglePlayingDispatch(true); //播放状态
    setCurrentTime(0);//从头开始播放
    setDuration((current.dt / 1000) | 0); //时长
    console.log('playList', playing)
    getLyric(current.id);
    setCurrentTime(0);
    setDuration((current.dt/1000) | 0);

  }, [playList, currentIndex]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const handleLyric = ({lineNum, txt}) => {
    if(!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt)
  }

  const getLyric = id => {
    let lyric = "";
    if(currentLyric.current) {
      currentLyric.current.stop();
    }
    // 避免 songReady 恒为false的情况
    getLyricRequest(id).then((data:any) => {
      console.log('lrxdata',data.lrc.lyric);
      lyric = data.lrc.lyric;
      if (!lyric) {
        currentLyric.current = null;
        return;
      }
      currentLyric.current = new Lyric(lyric, handleLyric as any);
      currentLyric.current.play();
      currentLineNum.current = 0;
      currentLyric.current.seek(0);
    }).catch(() => {
      songReady.current = true;
      audioRef.current.play()
    })
  }

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state)
    if(currentLyric.current){
      currentLyric.current.togglePlay(currentTime*1000);
    }
  }

  const updateTime = e => {
    setCurrentTime(e.target.currentTime);

  };
  
  const handleError = () => {
    songReady.current = true;
    alert("播放出错");
  };

  const onProgressChange = curPercent => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
    if ( currentLyric.current ) {
      currentLyric.current.seek(newTime *1000)
    }
  }

  // 单曲循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    changePlaying(true);
    audioRef.current.play();
  }

  const handlePrev = () => {
    // 播放列表只有一首歌的时候单曲循环
    if (playList.length === 1) {
      handleLoop();
      return 
    };
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleNext = () => {
    // 播放列表只有一首歌的时候单曲循环
    if (playList.length === 1) {
      handleLoop();
      return
    };
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  }

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环")
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环")
    } else if (newMode === 2) {
      // 随记播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放")
    }
    changeModeDispatch(newMode)
    toastRef.current.show()
  }

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext()
    }
  }
  
  return (
    <div>
      { 
        isEmptyObject(currentSong) ? null :(
          <MiniPlayer
            song={currentSong}
            fullScreen={fullScreen}
            playing={playing}
            toggleFullScreen={toggleFullScreenDispatch}
            togglePlayList={togglePlayListDispatch}
            clickPlaying={clickPlaying}
            percent={percent}
          />
        )
      } 
      {
        isEmptyObject(currentSong) ? null : (
          <NormalPlayer 
            song={currentSong} 
            fullScreen={fullScreen} 
            playing={playing}
            duration={duration}
            toggleFullScreen={toggleFullScreenDispatch}
            togglePlayList={togglePlayListDispatch}
            clickPlaying={clickPlaying}
            percent={percent} //进度
            currentTime={currentTime}//播放时间
            onProgressChange={onProgressChange}
            handlePrev={handlePrev}
            handleNext={handleNext}
            mode={mode}
            changeMode={changeMode}
            currentLyric={currentLyric.current}
            currentPlayying={currentPlayingLyric}
            currentLineNum={currentLineNum.current}
          ></NormalPlayer>
        )
      }
      <audio ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  )
} 

const mapStateToProps = state => ({
  fullScreen: state.getIn(['player','fullScreen']),
  playing: state.getIn(['player', 'playing']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
  playList: state.getIn(['player', 'playList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  showPlayList: state.getIn(['player', 'showPlayList']),
  currentSong: state.getIn(['player', 'currentSong']),
})

const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlaying(data));
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeModeDispatch(data) {
      dispatch(changeMode(data));
    },
    // changeSequencePlayListDispatch(data) {
    //   dispatch(changeSequencePlayList(data))
    // },
    changeCurrentSongDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));