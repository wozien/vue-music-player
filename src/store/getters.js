const getters = {
  singer(state) {
    return state.singer
  },
  currentSong(state) {
    return state.playlist[state.currentIndex] || {}
  }
}

export default getters
