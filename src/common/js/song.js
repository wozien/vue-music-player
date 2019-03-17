import { getSongUrl, getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: joinSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

function joinSinger(singer) {
  let res = []
  if (!singer) {
    return ''
  }
  singer.forEach(({name}) => {
    res.push(name)
  })
  return res.join('/')
}

// 过滤付费歌曲
export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

// 获取歌曲的url -- 代理方式
export function processSongUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return getSongUrl(songs).then((midUrlInfo) => {
    midUrlInfo.forEach((info, index) => {
      let song = songs[index]
      song.url = info.purl ? info.purl : ''
    })
    // 过滤掉没有url的歌曲
    songs = songs.filter((song) => {
      return song.url
    })
    return songs
  })
}
