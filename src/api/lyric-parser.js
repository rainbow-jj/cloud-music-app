// 解析 [00:01.997] 这一类时间戳的正则表达式
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0;
const STATE_PLAYING = 1;

function noop() {
}

export default class Lyric {
  /**
   * @params {string} lrc
   * @params {function} handler
  */
  constructor(lrc, handlder = noop, speed) {
    this.lrc =lrc;
    this.line = []; // 这是解析后的数组 每项包含对应的歌词和时间
    this.handlder = handlder; //回调函数
    this.state = STATE_PAUSE; // 播放状态
    this.curLineIndex = 0;  // 当前播放歌词所在的行数
    this.startStamp = 0; // 歌曲开始播放的饿时间撮
    this.speed = speed || 1;


    this._init();
    this._initLines();
  }

  // 解析字符串，生成Lines数组
  _initLines() {
    // 解析代码
    const lines = this.lrc.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let result =  timeExp.exec(line);
      if (!result) continue;
      console.log('initlines_result',result)
      const txt = line.replace(timeExp, '').trim(); //把时间戳去掉，只剩下歌词文本
      if(txt) {
        if(result[3].length === 3) {
          result[3] = result[3] / 10;
        }
        this.lines.push({
          time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,  //转化具体到毫秒的时间，result[3] * 10可理解为（ result / 100）* 1000
          txt
        });
      }
    }
    this.lines.sort((a,b) => {
      return a.time - b.time
    }); //根据时间排序
  }

  // offset为时间进度，isSeek标志代表用户是否动手调用进度
  // 插件方法为play方法，如下所示
  play(offset = 0, isSeek = false) {
    if(!this.lines.length) { return }
    this.state = STATE_PLAYING;
    // 找到当前所在的行
    this.curLineIndex = this._findcurLineIndex(offset);
    // 现在正处于第 this.curLineIndex-1行
    // 立即定位，方式是调用传来的回调函数，并把当前歌词信息传递给它、
    this._calHandler(this.curLineIndex-1);
    // 根据时间进度去判断歌曲开始的时间戳
    this.startStamp = +new Date() - offset;
    if (this.curLineIndex < this.lines.length) {
      clearTimeout( this.timer);
      // 继续播放
      this._playRest(isSeek);
    }
  }

  togglePlay(offset) {
    if (this.state === STATE_PLAYING) {
      this.stop()
    } else {
      this.state = STATE_PLAYING
      this.play(offset, true)
    }
  }

  stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }

  seek(offset) {
    this.play(offset, true)
  }

  _findcurLineIndex(time) {
    for(let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length -1
  }

  _calHandler(i) {
    if( i<0 ) { return }
    this.handlder({
      txt:this.lines[i].txt,
      lineNum: i
    })
  }
  
  _playRest(isSeek = false) {
    let line = this.lines[this.curLineIndex];
    let delay;
    if (isSeek) {
      delay = line.time - (+new Date() - this.startStamp);
    } else  {
      // 拿上上一行的歌词开始时间，算间隔
      let preTime = this.lines[this.curLineIndex -1] ? this.lines[this.curLineIndex -1].time: 0;
      delay = line.time - preTime;
    }
    this.timer = setTimeout(() => {
      this._calHandler(this.curLineIndex++);
      if(this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest();
      }
    }, (delay/this.speed))
  }

  changeSpeed(speed) {
    this.speed = speed;
  }
}