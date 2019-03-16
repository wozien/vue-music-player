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
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <!-- 底部按钮 -->
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i class="icon-play"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini 播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'

export default {
  name: 'Player',
  computed: {
    ...mapState([
      'fullScreen',
      'playlist'
    ]),
    ...mapGetters(['currentSong'])
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
      console.log(animations)
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
    leave() {

    },
    afterLeave() {

    },
    ...mapMutations({
      selectFullScreen: 'SET_FULL_SCREEN'
    }),
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
    }
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
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-bottom 80%
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
            .image
              position absolute
              top 0
              left 0
              width 100%
              height 100%
              border-radius 50%
    .bottom
      position absolute
      bottom 50px
      width 100%
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
</style>
