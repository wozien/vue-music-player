<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :rank="true" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'

export default {
  name: 'TopList',
  data() {
    return {
      title: '',
      songs: []
    }
  },
  computed: {
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
    }
  },
  created() {
    this.title = this.$route.query.title
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      const topid = this.$route.params.id
      getMusicList(topid).then((res) => {
        if (res.code === ERR_OK) {
          processSongUrl(this._normalizeSongs(res.songlist)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
