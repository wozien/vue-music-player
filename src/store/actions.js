import * as types from './mutation-types'

const actions = {
  // 选择播放
  selectPlay({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  }
}

export default actions
