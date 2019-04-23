<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!-- 模糊背景图 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 播放cd图和歌词区 -->
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!-- 歌词区域 -->
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" ref="lyricLine"
                   :class="{'current': currentLine === index}"
                   v-for="(item, index) of currentLyric.lines" :key="index">
                  {{ item.txt }}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 底部-->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!-- 滚动条区域 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ _formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"
                            @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{ _formatTime(currentSong.duration) }}</span>
          </div>
          <!-- 底部按钮 -->
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right" @click="toggleFavorite(currentSong)">
              <i class="icon" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini 播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i class="icon-mini" :class="miniIcon" @click.stop="togglePlay"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlaylist"></i>
        </div>
      </div>
    </transition>
    <!-- 歌曲播放dom -->
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error"
           @timeupdate="updateTime" @ended="end"></audio>

    <!-- 播放列表 -->
    <playlist ref="playlist"></playlist>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { prefixStyle } from 'common/js/dom'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress/progress-bar'
import ProgressCircle from 'base/progress/progress-circle'
import Playlist from 'components/playlist/playlist'
import { playMode } from 'common/js/config'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import { playerMixin } from 'common/js/mixin'
import { savePlayHistory } from 'common/js/cache'

const preTransform = prefixStyle('transform')
const preDuration = prefixStyle('transitionDuration')

export default {
  mixins: [playerMixin],
  name: 'Player',
  data() {
    return {
      // 当前歌曲是否加载完成
      songReady: false,
      // 歌曲播放的当前时间
      currentTime: 0,
      // 当前的歌词对象
      currentLyric: null,
      // 当前歌词行数
      currentLine: 0,
      // 当前处于cd还是歌词页的标记
      currentShow: 'cd',
      // 当前播放的歌词
      playingLyric: ''
    }
  },
  computed: {
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapState([
      'fullScreen',
      'playing',
      'currentIndex'
    ]),
    ...mapGetters(['currentSong'])
  },
  created() {
    this.touch = {}
  },
  methods: {
    back() {
      this.selectFullScreen(false)
    },
    open() {
      this.selectFullScreen(true)
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      // 注册动画
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.animation = ''
    },
    leave(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style.transition = 'all .4s'
      this.$refs.cdWrapper.style[preTransform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[preTransform] = ''
    },
    togglePlay() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 上一首
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 0) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
        this.songReady = false
      }
    },
    // 下一首
    next() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 0) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
        this.songReady = false
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 歌曲加载完成
    ready() {
      this.songReady = true
      this.setPlayHistory(savePlayHistory(this.currentSong))
    },
    error() {
      this.songReady = true
    },
    // 歌曲播放时间变化
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    // 歌曲播放结束
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 拖动进度条
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlay()
      }
      if (this.currentLyric) {
        // 跳到对应的歌词
        this.currentLyric.seek(1000 * currentTime)
      }
    },
    // 获取歌词对象
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        this.currentLyric.play()
      }).catch((e) => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLine = 0
      })
    },
    // 歌词播放的回调
    handleLyric({lineNum, txt}) {
      if (!this.$refs.lyricLine) {
        return
      }
      this.currentLine = lineNum
      if (lineNum > 5) {
        let lineEle = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEle, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart(e) {
      const touch = e.touches[0]
      this.touch.init = true
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }

      // 求手指滑动中歌词页面的x轴的偏移量
      // 初始化偏移
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[preTransform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[preDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[preDuration] = 0
    },
    middleTouchEnd() {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        // 当前处于cd页面， 只要滑动超过0.1，就显示歌词页面
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }

      this.$refs.lyricList.$el.style[preTransform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[preDuration] = '300ms'
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[preDuration] = '300ms'
      this.touch.init = false
    },
    _formatTime(time) {
      // 向下取整
      time = time | 0
      const minute = time / 60 | 0
      const second = this._padZero(time % 60)
      return `${minute}:${second}`
    },
    _padZero(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 获取cd层缩小动画的偏移和缩放
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - (width / 2) - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    showPlaylist() {
      this.$refs.playlist.show()
    },
    ...mapMutations({
      selectFullScreen: 'SET_FULL_SCREEN',
      setPlayHistory: 'SET_PLAY_HISTORY'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyric()
      })
    },
    // 播放状态监听
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.player
  .normal-player
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    background $color-background
    z-index 150
    .background
      position absolute
      top 0
      left 0
      height 100%
      width 100%
      z-index -1
      opacity .6
      filter blur(20px)
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        left 6px
        top 0
        z-index 50
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
      .title
        width 70%
        margin 0 auto
        line-height 40px
        text-align center
        no-wrap()
        font-size $font-size-large
        color $color-text
      .subtitle
        line-height 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position fixed
      top 80px
      width 100%
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-r
        display inline-block
        width 100%
        height 100%
        vertical-align top
        overflow hidden
        .lyric-wrapper
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height 32px
            color $color-text-l
            font-size $font-size-medium
            &.current
              color $color-text
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          top 0
          left 10%
          width 80%
          height 100%
          .cd
            width 100%
            height 100%
            box-sizing border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius 50%
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
            .image
              position absolute
              top 0
              left 0
              width 100%
              height 100%
              border-radius 50%
        .playing-lyric-wrapper
          width 80%
          margin 30px auto
          overflow hidden
          text-align center
          .playing-lyric
            height 20px
            line-height 20px
            font-size $font-size-medium
            color $color-text-l
    .bottom
      position absolute
      bottom 50px
      width 100%
      .dot-wrapper
        text-align center
        font-size 0
        .dot
          display inline-block
          vertical-align middle
          margin 0 4px
          width 8px
          height 8px
          border-radius 50%
          background $color-text-l
          &.active
            width 20px
            border-radius 5px
            background $color-text-ll
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0 auto
        padding 10px 0
        .time
          color $color-text
          font-size $font-size-small
          flex 0 0 30px
          line-height 30px
          width 30px
          &.time-l
            text-align left
          &.time-r
            text-align right
        .progress-bar-wrapper
          flex 1

      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
            color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition all .4s
      .top, .bottom
        transition all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      .top
        transform translate3d(0, -100px, 0)
      .bottom
        transform translate3d(0, 100px, 0)

  .mini-player
    position fixed
    bottom 0
    width 100%
    height 60px
    background $color-highlight-background
    z-index 150
    display flex
    align-items center
    &.mini-enter-active, &.mini-leave-active
      transition all .4s
    &.mini-enter, &.mini-leave-to
      opacity 0
    .icon
      flex 0 0 40px
      width 40px
      padding 0 10px 0 20px
      img
        width 40px
        height 40px
        border-radius 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size 32px
        position absolute
        top 0
        left 0
  @keyframes rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
</style>
