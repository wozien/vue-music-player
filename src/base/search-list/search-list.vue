<template>
  <div class="search-list">
    <transition-group tag="ul" name="list">
      <li class="search-item"
          v-for="item in searches"
          :key="item"
          @click="selectItem(item)"
      >
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleleItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    deleleItem(item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.search-list
  .search-item
    display flex
    align-items center
    height 40px
    overflow hidden
    &.list-enter-active, &.list-leave-active
      transition all .3s
    &.list-enter, &.list-leave-to
      height 0
    .text
      flex 1
      color $color-text-l
    .icon
      extend-click()
      .icon-delete
        font-size: $font-size-small
        color: $color-text-d
</style>
