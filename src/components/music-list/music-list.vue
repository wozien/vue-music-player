<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length">
        <div class="play-btn" ref="playbtn" @click="randomAllPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="layer" ref="layer"></div>
    <scroll class="scroll-list" :data="songs" ref="scrollList"
            :probeType="probeType" :listen-scroll="listenScroll" @scroll="scroll">
      <div class="songs-list-wrapper">
        <song-list :songs="songs" @select="selectSong"></song-list>
      </div>
      <div class="loading-container" v-if="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

// 标题的高度
const TITLE_HEIGHT = 40

export default {
  name: 'MusicList',
  mixins: [playlistMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    // 背景图高度
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 计算歌单可以向上滚动的距离
    this.minTranslateY = -this.imageHeight + TITLE_HEIGHT
    this.$refs.scrollList.$el.style.top = this.imageHeight + 'px'
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    // 选择歌曲播放事件
    selectSong(item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    // 随机播放全部
    randomAllPlay() {
      this.randomPlay({
        list: this.songs
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.scrollList.$el.style.bottom = bottom
      this.$refs.scrollList.refresh()
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      const precent = Math.abs(newY / this.imageHeight)

      if (newY > 0) {
        scale = 1 + precent
        zIndex = 10
      }

      if (newY < this.minTranslateY) {
        this.$refs.bgImage.style['padding-top'] = '40px'
        this.$refs.playbtn.style.display = 'none'
        zIndex = 10
      } else {
        this.$refs.bgImage.style['padding-top'] = '70%'
        this.$refs.playbtn.style.display = ''
      }

      this.$refs.bgImage.style['z-index'] = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
      this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.music-list
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 100
  background $color-background
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
  .title
    position absolute
    top 0
    width 100%
    line-height 40px
    text-align center
    font-size $font-size-large
    color $color-text
    z-index 40
    no-wrap()
  .bg-image
    position relative
    width 100%
    height 0
    padding-top 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play-btn
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        color $color-theme
        border 1px solid $color-theme
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
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7, 17, 27, 0.4)

  .layer
    position relative
    height 100%
    background $color-background

  .scroll-list
    position fixed
    top 0
    bottom 0
    width 100%
    background $color-background
    .songs-list-wrapper
      padding 20px 30px
    .loading-container
      loading-container()
</style>
