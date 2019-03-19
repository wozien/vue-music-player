import { mapState } from 'vuex'

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
