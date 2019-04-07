import { mapState, mapMutations } from 'vuex'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'

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
      'mode'
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
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  }
}
