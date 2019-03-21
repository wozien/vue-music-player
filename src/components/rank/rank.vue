<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="item in toplist" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{ index+1 }}</span>
              <span>{{ song.songname }}-{{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/scroll'
import { playlistMixin } from 'common/js/mixin'

export default {
  name: 'Rank',
  mixins: [playlistMixin],
  data() {
    return {
      toplist: []
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`,
        query: {
          title: item.topTitle
        }
      })
    },
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.toplist = res.data.topList
        }
      })
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.rank
  position fixed
  top 88px
  bottom 0px
  width 100%
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0 20px
      padding-top 20px
      height 100px
      &:last-child
        padding-bottom 20px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
        img
          width 100%
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        padding 0 20px
        height 100px
        overflow hidden
        background $color-highlight-background
        color $color-text-d
        font-size $font-size-small
        .song
          no-wrap()
          line-height 26px
</style>
