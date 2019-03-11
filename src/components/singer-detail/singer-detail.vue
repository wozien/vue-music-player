<template>
  <transition name="slide">
    <div class="singer-detail">{{ $route.params.id }}</div>
  </transition>

</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong, processSongUrl} from 'common/js/song'

export default {
  name: 'SingerDetail',
  data () {
    return {
      songs: []
    }
  },
  computed: {
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
        if (musicData.songid && musicData.albummid) {
          res.push(createSong(musicData))
        }
      })
      return res
    }
  }
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
