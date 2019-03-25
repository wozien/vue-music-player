<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotkey" :key="item.n"
                  @click="setQuery(item.k)">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"
               @prepareScroll="blurInput"
               @select="onSaveSearch"
      ></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { saveSearch } from 'common/js/cache'
import { mapMutations } from 'vuex'

export default {
  name: 'Search',
  data() {
    return {
      hotkey: [],
      query: ''
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    setQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      // 在移动端，在滑动查询结果前，让输入框失去焦点，收起键盘框
      this.$refs.searchBox.blur()
    },
    // 保存搜素记录
    onSaveSearch() {
      this.setSearchHistory(saveSearch(this.query))
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapMutations({
      setSearchHistory: 'SET_SEARCH_HISTORY'
    })
  },
  components: {
    SearchBox,
    Suggest
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d

  .search-result
    position fixed
    top 178px
    bottom 0
    width 100%
</style>
