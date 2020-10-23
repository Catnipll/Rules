const cookieName = ' 全民 K 歌'
const signurlKey = 'hotkids_signurl_familymart'
const signheaderKey = 'hotkids_signheader_familymart'
const signbodyKey = 'hotkids_signbody_familymart'
const hotkids = init()

const requrl = $request.url
if ($request && $request.method != 'OPTIONS') {
  const signurlVal = requrl
  const signheaderVal = JSON.stringify($request.headers)
  const signbodyVal = $request.body
  const cmd = JSON.parse($request.body).cmd
  hotkids.log(`signurlVal:${signurlVal}`)
  hotkids.log(`signheaderVal:${signheaderVal}`)
  hotkids.log(`signbodyVal:${signbodyVal}`)
  if (signurlVal) hotkids.setdata(signurlVal, signurlKey)
  if (signheaderVal) hotkids.setdata(signheaderVal, signheaderKey)
  if (signbodyVal && cmd=='task.revisionSignInGetAward') {
    hotkids.setdata(signbodyVal, signbodyKey)
    hotkids.msg(cookieName, `获取 Cookie: 成功`, ``)
  }  
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
hotkids.done()
