<template>
  <transition name="slide">
    <div class="singer-detail">{{ $route.params.id }}</div>
  </transition>

</template>

<script>
export default {
  name: 'SingerDetail'

}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.singer-detail
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background $color-background
  z-index 100

.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
