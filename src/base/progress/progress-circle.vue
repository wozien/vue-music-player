<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="bar" r="50" cx="50" cy="50" fill="transparent"
              :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" />
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ProgressCircle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 圆的周长
      dashArray: Math.PI * 100
    }
  },
  computed: {
    // 圆border的偏移
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.progress-circle
  position relative
  circle
    stroke-width 8px
    transform-origin center
    &.background
      transform scale(0.9)
      stroke $color-theme-d
    &.bar
      transform scale(0.9) rotate(-90deg)
      stroke $color-theme
</style>
