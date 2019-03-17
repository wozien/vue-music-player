import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'

function findIndex(list, song) {
  let index = list.findIndex((item) => {
    return item.id === song.id
  })
  return index
}

const actions = {
  // 选择播放
  selectPlay({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      index = findIndex(randomList, list[index])
      commit(types.SET_PLAYLIST, randomList)
    } else {
      commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  },
  // 随机播放
  randomPlay({commit}, {list}) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_PLAY_MODE, playMode.random)

    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
  }
}

export default actions
