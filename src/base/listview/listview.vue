<template>
  <scroll class="listview" ref="listview" :data="list"
          :probe-type="3" :listen-scroll="true"
          @scroll="scroll">
    <ul>
      <li class="list-group" v-for="(group, index) in list" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items" :key="item.id" @click="onSelect(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" v-if="shortcutList.length">
      <ul>
        <li class="item" v-for="(item, index) in shortcutList" :key="index"
            :data-index="index"
            :class="{'current': currentIndex==index}"
            @touchstart.stop.prevent="onShortcutStart"
            @touchmove.stop.prevent="onShortcutMove">
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div class="loading-container" v-show="!list.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'

// 一个导航字母的高度
const ANCHAR_HIGHT = 18
// 一个fixed标题的高度
const FIXED_HEIGHT = 30

export default {
  name: 'ListView',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  created() {
    this.touch = {}
    this.listHeight = []
  },
  computed: {
    shortcutList() {
      return this.list.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.list[this.currentIndex] ? this.list[this.currentIndex].title : ''
    }
  },
  methods: {
    onSelect(item) {
      this.$emit('select', item)
    },
    // 导航字母栏点击
    onShortcutStart(e) {
      let index = +getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.index = index
      this._scrollTo(index)
    },
    // 导航字母栏拖动
    onShortcutMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHAR_HIGHT | 0
      let nowIndex = this.touch.index + delta
      this._scrollTo(nowIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      if (index < 0 || index > this.listHeight - 2) {
        return
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _setListHeight() {
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    list() {
      setTimeout(() => {
        this._setListHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight

      // 当滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        const h1 = listHeight[i]
        const h2 = listHeight[i + 1]
        if (-newY >= h1 && -newY < h2) {
          this.currentIndex = i
          this.diff = h2 + newY
          return
        }
      }

      // 滚动到底部，且-newY大于最后一个元素的高度
      this.currentIndex = listHeight - 2
    },
    diff(val) {
      let fixedTop = (val > 0 && val < FIXED_HEIGHT) ? val - FIXED_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.listview
  position relative
  width 100%
  height 100%
  overflow hidden
  background $color-background
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium

  .list-shortcut
    position absolute
    top 50%
    right 0
    transform translateY(-50%)
    width 20px
    padding 20px 0px
    border-radius 10px
    text-align center
    background $color-background-d
    font-family Helvetica
    z-index 30
    .item
      padding 3px
      line-height 1
      color $color-text-l
      font-size $font-size-small
      &.current
        color: $color-theme

  .list-fixed
    position absolute
    top 0
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background

  .loading-container
    loading-container()
</style>
