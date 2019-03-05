import originJsonp from 'jsonp'

function param (data) {
  let url = ''

  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }

  return url ? url.substring(1) : ''
}

// 把默认jsonp模版封装成返回promise
export default function jsonp (url, data, option) {
  if (param(data)) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  }

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
