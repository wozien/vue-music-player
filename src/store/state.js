import { playMode } from 'common/js/config'
import { loadSearch } from 'common/js/cache'

const state = {
  // 当前歌单
  disc: {},
  // 当前歌手
  singer: {},
  // 是否正在播放
  playing: false,
  // 是否铺满全屏播放
  fullScreen: false,
  // 播放列表
  playlist: [],
  // 歌单播放列表
  sequenceList: [],
  // 播放顺序模式
  mode: playMode.sequence,
  // 当前播放歌曲的索引
  currentIndex: -1,
  // 搜索记录
  searchHistory: loadSearch()
}

export default state
