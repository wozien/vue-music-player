<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  name: 'Slider',
  props: {
    // 是否循环轮播
    loop: {
      type: Boolean,
      default: true
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 播放间隔
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted () {
    this.setSilderWidth()
    this.initSilder()
  },
  methods: {
    setSilderWidth () {
      let width = 0
      let sliderWidth = this.$refs['slider'].clientWidth
      // 挂在到实例属性是因为其他函数要用
      this.children = this.$refs['sliderGroup'].children
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      // 循环播放会在前后clone一个silder节点
      if (this.loop) {
        width += 2 * sliderWidth
      }

      this.$refs['sliderGroup'].style.width = width + 'px'
    },
    initSilder () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.slider
  min-height 1px
  .slider-group
    position relative
    overflow hidden
    .slider-item
      float left
      box-sizing border-box
      text-align center
      a
        display block
        width 100%
        text-direction none
      img
        width 100%
        display block
</style>
