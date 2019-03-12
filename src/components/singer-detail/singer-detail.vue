<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>

</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong, processSongUrl, isValidMusic} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  name: 'SingerDetail',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters(['singer'])
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongUrl(this._normalizaSongs(res.data.list)).then((songs) => {
            this.songs = songs
            console.log(songs)
          })
        }
      })
    },
    _normalizaSongs(list) {
      let res = []
      list.forEach(({musicData}) => {
        if (isValidMusic(musicData)) {
          res.push(createSong(musicData))
        }
      })
      return res
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
