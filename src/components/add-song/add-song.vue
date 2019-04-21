<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" v-show="currentIndex===0" :data="playHistory" class="list-scroll">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectItem"></song-list>
            </div>
          </scroll>
          <scroll ref="searchList" v-show="currentIndex===1" :data="searchHistory" class="list-scroll">
            <div class="list-inner">
              <search-list :searches="searchHistory"
                         @select="setQuery"
                         @delete="deleteOne"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="false"
                 @prepareScroll="blurInput"
                 @select="selectSearchItem"></suggest>
      </div>

      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'
import {searchMixin} from 'common/js/mixin'
import {mapState, mapActions} from 'vuex'
import Song from 'common/js/song'

export default {
  name: 'AddSong',
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      switches: [{
        name: '最近播放'
      }, {
        name: '搜索历史'
      }],
      currentIndex: 0
    }
  },
  computed: {
    ...mapState(['playHistory'])
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectItem(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.showTip()
      }
    },
    selectSearchItem() {
      // 保存搜索记录
      this.onSaveSearch()
      this.showTip()
    },
    showTip() {
      this.$refs.topTip.show()
    },
    ...mapActions(['insertSong'])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    SongList,
    Scroll,
    SearchList,
    TopTip
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.add-song
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 200
  background $color-background
  &.slide-enter, &.slide-leave-to
    transform: translate3d(100%,0,0)
  &.slide-enter-active, &.slide-leave-active
    transition all .3s
  .header
    position relative
    height 44px
    text-align center
    .title
      line-height 44px
      font-size $font-size-large
      color $color-text
    .close
      position absolute
      top 0
      right 8px
      .icon-close
        display block
        padding 12px
        font-size 12px
        color $color-theme
  .search-box-wrapper
    margin 20px;
  .shortcut
    .list-wrapper
      position absolute
      top 165px
      bottom 0
      width 100%
      .list-scroll
        overflow hidden
        height 100%
        .list-inner
          padding 20px 30px
  .search-result
    position fixed
    top 124px
    bottom 0
    width 100%
  .tip-title
    text-align center
    padding 18px 0
    .icon-ok
      font-size: $font-size-medium
      color: $color-theme
      margin-right: 4px
    .text
      font-size: $font-size-medium
      color: $color-text
</style>
