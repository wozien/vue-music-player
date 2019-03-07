<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}"
            v-for="(item, index) in dots" :key="index"></span>
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
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this.setSilderWidth()
      this.initDots()
      this.initSilder()

      if (this.autoPlay) {
        this.play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }

      // 节流处理
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.slider.isInTransition) {
          this.onScrollEnd()
        } else {
          if (this.autoPlay) {
            this.play()
          }
        }
        this.refresh()
      }, 60)
    })
  },
  methods: {
    refresh () {
      if (this.slider) {
        this.setSilderWidth(true)
        this.slider.refresh()
      }
    },
    setSilderWidth (isResize) {
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

      // 无缝循环播放会在前后clone一个节点
      if (this.loop && !isResize) {
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

      this.slider.on('scrollEnd', this.onScrollEnd)

      this.slider.on('touchend', () => {
        if (this.autoPlay) {
          this.play()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    onScrollEnd () {
      this.currentPageIndex = this.slider.getCurrentPage().pageX
      if (this.autoPlay) {
        this.play()
      }
    },
    initDots () {
      this.dots = new Array(this.children.length)
    },
    play () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.slider
  position: relative
  // overflow: hidden
  .slider-group
    overflow: hidden
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
  .dots
    position absolute
    left 0
    right 0
    bottom 12px
    text-align center
    .dot
      display inline-block
      width 8px
      height 8px
      border-radius 50%
      margin 0 4px
      background $color-text-l
      &.active
        width 20px
        border-radius 5px
        background $color-text-ll
</style>
