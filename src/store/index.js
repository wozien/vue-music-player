import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 开发环境开启vuex日志
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
