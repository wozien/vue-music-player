import { getSongUrl } from 'api/song'

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
      song.url = info.purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${info.purl}` : info.purl
    })
    return songs
  })
}
