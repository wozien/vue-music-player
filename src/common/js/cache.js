import storage from 'good-storage'

// 搜索历史缓存
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 播放历史缓存
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return arr
  } else if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)

  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 保存搜素记录
export function saveSearch(query) {
  const searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  const searches = storage.get(SEARCH_KEY, [])
  deleteArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 保存播放记录到缓存中
export function savePlayHistory(song) {
  const history = storage.get(PLAY_KEY, [])
  insertArray(history, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, history)
  return history
}

export function loadPlayHistory() {
  return storage.get(PLAY_KEY, [])
}

// 保存收藏的歌曲
export function saveFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function delFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  deleteArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
