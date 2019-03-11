import { commonParams, ERR_OK } from './config'
import { getUid } from 'common/js/uid'
import axios from 'axios'

export function getSongUrl(songs) {
  const url = '/api/getPurlUrl'

  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = getUrlMid(mids, types)
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  // 轮训调用devServer代理接口
  return new Promise((resolve, reject) => {
    let pollTime = 3

    function request() {
      return axios.post(url, {
        comm: data,
        req_0: urlMid
      }).then((res) => {
        res = res.data
        if (res.code === ERR_OK) {
          let urlMid = res.req_0
          if (urlMid && urlMid.code === ERR_OK) {
            const info = urlMid.data.midurlinfo[0]
            if (info && info.purl) {
              resolve(urlMid.data.midurlinfo)
            } else {
              poll()
            }
          } else {
            poll()
          }
        } else {
          poll()
        }
      })
    }

    function poll() {
      if (--pollTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}

function getUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
