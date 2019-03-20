<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import MusicList from 'components/music-list/music-list'
import { getDiscSong } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'

export default {
  name: 'Disc',
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapState(['disc'])
  },
  created() {
    this._getDiscSong()
  },
  methods: {
    _getDiscSong() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getDiscSong(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          processSongUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
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
@import "~common/stylus/variable"

.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
