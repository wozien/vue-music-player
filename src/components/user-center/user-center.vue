<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper">
        <scroll ref="favoriteList" v-show="currentIndex===0" :data="favoriteList" class="list-scroll">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectItem"></song-list>
          </div>
        </scroll>
        <scroll ref="playHistory" v-show="currentIndex===1" :data="playHistory" class="list-scroll">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectItem"></song-list>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Song from 'common/js/song'
import {mapState, mapActions} from 'vuex'

export default {
  name: 'UserCenter',
  data() {
    return {
      currentIndex: 0,
      switches: [{
        name: '我喜欢的'
      }, {
        name: '最近听的'
      }]
    }
  },
  computed: {
    ...mapState([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    switchItem(index) {
      this.currentIndex = index
    },
    back() {
      this.$router.back()
    },
    selectItem(song) {
      this.insertSong(new Song(song))
    },
    ...mapActions(['insertSong'])
  },
  components: {
    Switches,
    Scroll,
    SongList
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.user-center
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 100
  background $color-background
  &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(100%, 0, 0)

  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .switches-wrapper
    margin: 10px 0 30px 0
  .play-btn
    box-sizing: border-box
    width 135px
    padding 7px 0
    margin 0 auto
    text-align center
    border 1px solid $color-text-l
    color $color-text-l
    border-radius 100px
    font-size 0
    .icon-play
      display inline-block
      vertical-align middle
      margin-right 6px
      font-size $font-size-medium-x
    .text
      display inline-block
      vertical-align middle
      font-size $font-size-small
  .list-wrapper
    position absolute
    top 110px
    bottom 0
    width 100%
    .list-scroll
      height 100%
      overflow hidden
      .list-inner
        padding 20px 30px
</style>
