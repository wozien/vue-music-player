const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const config = require('./config')

let port = process.env.PORT || config.build.port
let app = new express()
let router = express.Router()

// 获取歌单数据代理
router.get('/getDiscList', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

// 获取歌单歌曲数据
router.get('/getDiscSong', function(req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    if (typeof ret === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch(e => {
    console.log(e)
  })
})

// 获取歌曲url
router.post('/getPurlUrl', bodyParser.json(), function(req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios.post(url, req.body, {
      headers: {
        'referer': 'https://y.qq.com/',
        'origin': 'https://y.qq.com',
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      res.json(response.data)
    }).catch((e) => {
      console.log(e)
  })
})

// 获取歌曲歌词
router.get('/lyric', function(req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    if (typeof ret === 'string') {
      const reg = /^\w+\({.+}\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

// 搜索接口
router.get('/search', function(req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

// 路由配置
app.use('/api', router)

// 指定静态目录
app.use(express.static('./dist'))

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})