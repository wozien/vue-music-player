<template>
  <div class="recommend">
    <div>
      <div v-if="recommends.length" class="slider-wrapper">
        <slider>
          <div v-for="item of recommends" :key="item.id">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </div>
        </slider>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend } from 'api/recommend'
import Slider from 'base/slider/slider'
import {ERR_OK} from 'api/config'

export default {
  name: 'Recommend',
  data () {
    return {
      recommends: []
    }
  },
  created () {
    // 获取推荐的轮播数据
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
          console.log(this.recommends)
        }
      })
    }
  },
  components: {
    Slider
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.recommend
  .slider-wrapper
    width 100%
    overflow hidden
</style>
