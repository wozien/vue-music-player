<template>
  <div class="music-list">
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter"></div>
    </div>

    <scroll class="scroll-list" :data="songs" ref="scrollList">
      <div class="songs-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'

export default {
  name: 'MusicList',
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
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.$refs.scrollList.$el.style.top = this.imageHeight + 'px'
  },
  components: {
    Scroll,
    SongList
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
    background-size cover
    transform-origin top

    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7, 17, 27, 0.4)

  .scroll-list
    position fixed
    top 0
    bottom 0
    width 100%
    background $color-background
    .songs-list-wrapper
      padding 20px 30px
</style>
