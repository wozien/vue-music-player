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
  },
  // 插入歌曲
  insertSong({commit, state}, song) {
    let playlist = state.playlist.slice()
    let seqlist = state.sequenceList.slice()
    let curIndex = state.currentIndex
    let curSong = playlist[curIndex]

    // 找出歌曲在原播放列表的位置
    let fpIndex = findIndex(playlist, song)
    // 插入歌曲
    playlist.splice(++curIndex, 0, song)

    // 删除原来的存在的歌曲
    if (fpIndex > -1) {
      if (fpIndex < curIndex) {
        playlist.splice(fpIndex, 1)
        curIndex--
      } else {
        playlist.splice(fpIndex + 1, 1)
      }
    }

    let cursIndex = findIndex(seqlist, curSong)
    let fsIndex = findIndex(seqlist, song)
    seqlist.splice(++cursIndex, 0, song)
    if (fsIndex > -1) {
      if (fsIndex < cursIndex) {
        seqlist.splice(fsIndex, 1)
      } else {
        seqlist.splice(fsIndex + 1, 1)
      }
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, seqlist)
    commit(types.SET_CURRENT_INDEX, curIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  },
  // 播放列表中删除歌曲
  deleteSong({commit, state}, song) {
    let playlist = state.playlist.slice()
    let seqlist = state.sequenceList.slice()
    let curIndex = state.currentIndex
    const pIndex = findIndex(playlist, song)
    const sIndex = findIndex(seqlist, song)
    playlist.splice(pIndex, 1)
    seqlist.splice(sIndex, 1)

    // 当前歌曲在删除的后面
    // 当前歌曲是最后一条，且删除最后一条
    if (curIndex > pIndex || curIndex === playlist.length) {
      curIndex--
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, seqlist)
    commit(types.SET_CURRENT_INDEX, curIndex)
    commit(types.SET_PLAYING_STATE, playlist.length > 0)
  },
  deleteSonglist({commit}) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
  }
}

export default actions
