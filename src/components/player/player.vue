<template>
  <div class="player" v-show="playlist.length>0">
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
          <div class="cd-wrapper">
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
    <!-- mini 播放器 -->
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

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
    ...mapMutations({
      selectFullScreen: 'SET_FULL_SCREEN'
    })
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

  .mini-player
    position fixed
    bottom 0
    width 100%
    height 60px
    background $color-highlight-background
    z-index 150
    display flex
    align-items center
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
