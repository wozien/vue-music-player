<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item of recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item of discList" :key="item.dissid"
                @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {ERR_OK} from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  name: 'Recommend',
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    // 获取推荐的轮播数据
    this._getRecommend()
    // 获取热门歌单
    this._getDiscList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push(`/recommend/${item.dissid}`)
      this.setDisc(item)
    },
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.recommend
  position fixed
  top 88px
  bottom 0
  width 100%
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      width 100%
      overflow hidden
    .recommend-list
      .list-title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .item
        display flex
        box-sizing border-box
        padding 0 20px 20px 20px
        .icon
          width 60px
          padding-right 20px
          img
            width 60px
            height 60px
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text
          .desc
            color $color-text-d

    .loading-container
      loading-container()

</style>
