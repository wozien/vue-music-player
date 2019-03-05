<template>
  <div class="recommend">
    recommend
  </div>
</template>

<script>
import { getRecommend } from 'api/recommend'

export default {
  name: 'Recommend',
  created () {
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>
