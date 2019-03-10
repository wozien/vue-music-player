<template>
  <div class="loading">
    <img src="./loading.gif">
    <p class="desc">{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.loading
  width 100%
  text-align center
  img
    width 24px
    height 24px
  .desc
    line-height 20px
    font-size $font-size-small
    color $color-text-l
</style>
