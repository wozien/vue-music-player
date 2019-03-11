let uid = ''

export function getUid() {
  if (uid) {
    return uid
  }
  const t = (new Date()).getUTCMilliseconds()
  return '' + Math.round(2147483647 * Math.random()) * t % 1e10
}
