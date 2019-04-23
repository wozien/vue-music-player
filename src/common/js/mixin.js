import { mapState, mapMutations } from 'vuex'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'
import { saveSearch, deleteSearch, saveFavorite, delFavorite } from 'common/js/cache'

export const playlistMixin = {
  computed: {
    ...mapState([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newlist) {
      this.handlePlaylist(newlist)
    }
  },
  methods: {
    // 必须实现改方法
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random')
    },
    ...mapState([
      'playlist',
      'sequenceList',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    // 改播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = []
      // 随机播放
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    // 切随机模式当前歌曲保持不变
    resetCurrentIndex(list) {
      let index = list.findIndex((song) => {
        return song.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.setFavoriteList(delFavorite(song))
      } else {
        this.setFavoriteList(saveFavorite(song))
      }
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setFavoriteList: 'SET_FAVORITE_LIST'
    })
  }
}

export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapState(['searchHistory'])
  },
  methods: {
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
    setQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    deleteOne(item) {
      this.setSearchHistory(deleteSearch(item))
    },
    ...mapMutations({
      setSearchHistory: 'SET_SEARCH_HISTORY'
    })
  }
}
